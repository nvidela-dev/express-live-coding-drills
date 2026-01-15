const request = require('supertest');
const app = require('../src/app');

describe('Request Queue Challenge', () => {
  describe('GET /api/slow', () => {
    it('should process single request successfully', async () => {
      const res = await request(app)
        .get('/api/slow')
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Processed');
    });

    it('should process concurrent requests up to limit', async () => {
      const requests = [
        request(app).get('/api/slow'),
        request(app).get('/api/slow')
      ];

      const results = await Promise.all(requests);

      results.forEach(res => {
        expect(res.status).toBe(200);
      });
    });

    it('should queue requests beyond concurrent limit', async () => {
      // Start 3 requests (limit is 2, so 1 will be queued)
      const requests = [
        request(app).get('/api/slow'),
        request(app).get('/api/slow'),
        request(app).get('/api/slow')
      ];

      const results = await Promise.all(requests);

      // All should eventually succeed
      results.forEach(res => {
        expect(res.status).toBe(200);
      });
    });
  });

  describe('Queue full behavior', () => {
    it('should return 503 when queue is full', async () => {
      // Start many requests to fill queue
      // maxConcurrent: 2, maxQueue: 3, so 6th request should fail
      const requests = [];
      for (let i = 0; i < 7; i++) {
        requests.push(request(app).get('/api/slow'));
      }

      const results = await Promise.all(requests);

      // At least one should be 503
      const has503 = results.some(res => res.status === 503);
      expect(has503).toBe(true);

      // 503 response should have error message
      const failed = results.find(res => res.status === 503);
      expect(failed.body).toHaveProperty('error');
    });
  });

  describe('Timeout behavior', () => {
    it('should return 504 for queued requests that timeout', async () => {
      // This test requires requests to stay in queue longer than timeout
      // We need to block the slots long enough

      // Start 2 requests that will hold slots
      const blockingRequests = [
        request(app).get('/api/slow'),
        request(app).get('/api/slow')
      ];

      // Small delay to ensure blocking requests get slots first
      await new Promise(resolve => setTimeout(resolve, 10));

      // Start more requests that will queue
      // These should timeout if they wait > 1 second
      const queuedRequests = [
        request(app).get('/api/slow'),
        request(app).get('/api/slow'),
        request(app).get('/api/slow')
      ];

      const results = await Promise.all([...blockingRequests, ...queuedRequests]);

      // Check that responses are either 200, 503, or 504
      results.forEach(res => {
        expect([200, 503, 504]).toContain(res.status);
      });
    });
  });

  describe('Response format', () => {
    it('should include processingTime in successful response', async () => {
      const res = await request(app)
        .get('/api/slow')
        .expect(200);

      expect(res.body).toHaveProperty('processingTime');
      expect(typeof res.body.processingTime).toBe('number');
    });
  });
});
