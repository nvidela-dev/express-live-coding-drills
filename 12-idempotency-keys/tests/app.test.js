const request = require('supertest');
const app = require('../src/app');
const { getPaymentCounter, getOrderCounter, resetCounters } = require('../src/app');

describe('Idempotency Keys Challenge', () => {
  beforeEach(() => {
    resetCounters();
  });

  describe('POST /api/payments', () => {
    it('should create payment on first request', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', 'test-key-1')
        .send({ amount: 100, currency: 'USD' })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('amount', 100);
      expect(res.body).toHaveProperty('status', 'completed');
    });

    it('should return cached response for same idempotency key', async () => {
      const key = 'duplicate-key-1';

      // First request
      const res1 = await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', key)
        .send({ amount: 100, currency: 'USD' })
        .expect(201);

      // Second request with same key
      const res2 = await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', key)
        .send({ amount: 100, currency: 'USD' })
        .expect(201);

      // Should return same response
      expect(res2.body.id).toBe(res1.body.id);
    });

    it('should set X-Idempotent-Replayed header on cached response', async () => {
      const key = 'replay-key-1';

      // First request
      await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', key)
        .send({ amount: 100, currency: 'USD' });

      // Second request
      const res = await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', key)
        .send({ amount: 100, currency: 'USD' });

      expect(res.headers['x-idempotent-replayed']).toBe('true');
    });

    it('should not set X-Idempotent-Replayed on first request', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', 'first-request-key')
        .send({ amount: 100, currency: 'USD' });

      expect(res.headers['x-idempotent-replayed']).toBeUndefined();
    });

    it('should not process payment twice for same key', async () => {
      const key = 'counter-test-key';

      await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', key)
        .send({ amount: 100, currency: 'USD' });

      await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', key)
        .send({ amount: 100, currency: 'USD' });

      // Counter should only be 1, not 2
      expect(getPaymentCounter()).toBe(1);
    });

    it('should process different keys separately', async () => {
      await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', 'key-a')
        .send({ amount: 100, currency: 'USD' });

      await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', 'key-b')
        .send({ amount: 200, currency: 'USD' });

      expect(getPaymentCounter()).toBe(2);
    });
  });

  describe('POST /api/orders', () => {
    it('should handle idempotency for orders too', async () => {
      const key = 'order-key-1';

      const res1 = await request(app)
        .post('/api/orders')
        .set('Idempotency-Key', key)
        .send({ items: ['item1', 'item2'] })
        .expect(201);

      const res2 = await request(app)
        .post('/api/orders')
        .set('Idempotency-Key', key)
        .send({ items: ['item1', 'item2'] });

      expect(res2.body.id).toBe(res1.body.id);
      expect(getOrderCounter()).toBe(1);
    });
  });

  describe('Idempotency key isolation', () => {
    it('should isolate keys between endpoints', async () => {
      const key = 'shared-key';

      // Use same key for both endpoints
      await request(app)
        .post('/api/payments')
        .set('Idempotency-Key', key)
        .send({ amount: 100, currency: 'USD' });

      await request(app)
        .post('/api/orders')
        .set('Idempotency-Key', key)
        .send({ items: ['item1'] });

      // Both should be processed (keys scoped to endpoint)
      expect(getPaymentCounter()).toBe(1);
      expect(getOrderCounter()).toBe(1);
    });
  });
});
