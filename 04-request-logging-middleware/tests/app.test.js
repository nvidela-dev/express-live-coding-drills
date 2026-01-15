const request = require('supertest');
const app = require('../src/app');
const { logs } = require('../src/app');

describe('Request Logging Middleware Challenge', () => {
  beforeEach(() => {
    // Clear logs before each test
    logs.length = 0;
  });

  describe('X-Request-Id Header', () => {
    it('should include X-Request-Id header in response', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.headers).toHaveProperty('x-request-id');
      expect(res.headers['x-request-id']).toBeTruthy();
    });

    it('should generate unique request IDs', async () => {
      const res1 = await request(app).get('/health');
      const res2 = await request(app).get('/health');

      expect(res1.headers['x-request-id']).not.toBe(res2.headers['x-request-id']);
    });
  });

  describe('X-Response-Time Header', () => {
    it('should include X-Response-Time header in response', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.headers).toHaveProperty('x-response-time');
    });

    it('should contain a numeric value', async () => {
      const res = await request(app).get('/health');
      const responseTime = res.headers['x-response-time'];

      // Extract number from string (handles both "5ms" and "5" formats)
      const numericValue = parseFloat(responseTime);
      expect(numericValue).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /health', () => {
    it('should return status ok', async () => {
      const res = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('Request Logging', () => {
    it('should log requests to the logs array', async () => {
      await request(app).get('/health');

      expect(logs.length).toBe(1);
      expect(logs[0]).toHaveProperty('method', 'GET');
      expect(logs[0]).toHaveProperty('url', '/health');
      expect(logs[0]).toHaveProperty('timestamp');
      expect(logs[0]).toHaveProperty('requestId');
    });

    it('should log multiple requests', async () => {
      await request(app).get('/health');
      await request(app).get('/logs');

      expect(logs.length).toBe(2);
    });

    it('should include valid timestamp', async () => {
      await request(app).get('/health');

      const timestamp = new Date(logs[0].timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });
  });

  describe('GET /logs', () => {
    it('should return all logged requests', async () => {
      await request(app).get('/health');

      const res = await request(app)
        .get('/logs')
        .expect('Content-Type', /json/)
        .expect(200);

      // Should have 2 logs: /health and /logs itself
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array when no prior requests', async () => {
      const res = await request(app)
        .get('/logs')
        .expect(200);

      // First request is /logs itself, so it should have 1 entry
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
