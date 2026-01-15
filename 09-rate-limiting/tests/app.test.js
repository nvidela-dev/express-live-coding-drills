const request = require('supertest');
const app = require('../src/app');

describe('Rate Limiting Challenge', () => {
  // Note: Tests run sequentially and share state
  // Each test file gets a fresh app instance

  describe('GET /api/limited (5 req/10sec)', () => {
    it('should allow requests under limit', async () => {
      const res = await request(app)
        .get('/api/limited')
        .expect(200);

      expect(res.body).toEqual({ message: 'OK' });
    });

    it('should include X-RateLimit-Limit header', async () => {
      const res = await request(app)
        .get('/api/limited')
        .expect(200);

      expect(res.headers).toHaveProperty('x-ratelimit-limit');
      expect(res.headers['x-ratelimit-limit']).toBe('5');
    });

    it('should include X-RateLimit-Remaining header', async () => {
      const res = await request(app)
        .get('/api/limited')
        .expect(200);

      expect(res.headers).toHaveProperty('x-ratelimit-remaining');
    });

    it('should decrement remaining count', async () => {
      // Make first request
      const res1 = await request(app).get('/api/limited');
      const remaining1 = parseInt(res1.headers['x-ratelimit-remaining']);

      // Make second request
      const res2 = await request(app).get('/api/limited');
      const remaining2 = parseInt(res2.headers['x-ratelimit-remaining']);

      expect(remaining2).toBeLessThan(remaining1);
    });
  });

  describe('GET /api/strict (2 req/10sec)', () => {
    it('should return 429 after exceeding limit', async () => {
      // Make 3 requests (limit is 2)
      await request(app).get('/api/strict');
      await request(app).get('/api/strict');

      const res = await request(app)
        .get('/api/strict')
        .expect(429);

      expect(res.body).toHaveProperty('error');
    });

    it('should include Retry-After header when limited', async () => {
      // Exhaust limit
      await request(app).get('/api/strict');
      await request(app).get('/api/strict');

      const res = await request(app)
        .get('/api/strict')
        .expect(429);

      expect(res.headers).toHaveProperty('retry-after');
      const retryAfter = parseInt(res.headers['retry-after']);
      expect(retryAfter).toBeGreaterThan(0);
      expect(retryAfter).toBeLessThanOrEqual(10);
    });

    it('should show 0 remaining when limited', async () => {
      // Exhaust limit
      await request(app).get('/api/strict');
      await request(app).get('/api/strict');

      const res = await request(app)
        .get('/api/strict')
        .expect(429);

      expect(res.headers['x-ratelimit-remaining']).toBe('0');
    });
  });

  describe('GET /api/unlimited', () => {
    it('should not have rate limit headers', async () => {
      const res = await request(app)
        .get('/api/unlimited')
        .expect(200);

      expect(res.headers).not.toHaveProperty('x-ratelimit-limit');
      expect(res.headers).not.toHaveProperty('x-ratelimit-remaining');
    });

    it('should always return 200', async () => {
      // Make many requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/unlimited')
          .expect(200);
      }
    });
  });

  describe('Rate limit error response', () => {
    it('should return JSON error body', async () => {
      // Exhaust strict limit first
      await request(app).get('/api/strict');
      await request(app).get('/api/strict');

      const res = await request(app)
        .get('/api/strict')
        .expect('Content-Type', /json/)
        .expect(429);

      expect(res.body).toHaveProperty('error');
      expect(typeof res.body.error).toBe('string');
    });
  });
});
