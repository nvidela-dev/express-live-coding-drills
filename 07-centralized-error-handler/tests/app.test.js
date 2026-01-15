const request = require('supertest');
const app = require('../src/app');

describe('Centralized Error Handler Challenge', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('GET /resource/:id', () => {
    it('should return 200 for valid id', async () => {
      const res = await request(app)
        .get('/resource/123')
        .expect(200);

      expect(res.body).toHaveProperty('id', '123');
    });

    it('should return 404 NotFoundError for id "missing"', async () => {
      const res = await request(app)
        .get('/resource/missing')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body.error).toHaveProperty('status', 404);
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('POST /data', () => {
    it('should return 200 for valid body', async () => {
      const res = await request(app)
        .post('/data')
        .send({ value: 'test' })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should return 400 ValidationError for empty body', async () => {
      const res = await request(app)
        .post('/data')
        .send({})
        .expect(400);

      expect(res.body.error).toHaveProperty('status', 400);
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('GET /admin', () => {
    it('should return 401 UnauthorizedError', async () => {
      const res = await request(app)
        .get('/admin')
        .expect(401);

      expect(res.body.error).toHaveProperty('status', 401);
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('GET /crash', () => {
    it('should return 500 for generic error', async () => {
      const res = await request(app)
        .get('/crash')
        .expect(500);

      expect(res.body.error).toHaveProperty('status', 500);
    });
  });

  describe('Error response format', () => {
    it('should include stack trace in development', async () => {
      process.env.NODE_ENV = 'development';

      const res = await request(app)
        .get('/resource/missing')
        .expect(404);

      expect(res.body.error).toHaveProperty('stack');
    });

    it('should omit stack trace in production', async () => {
      process.env.NODE_ENV = 'production';

      const res = await request(app)
        .get('/resource/missing')
        .expect(404);

      expect(res.body.error).not.toHaveProperty('stack');
    });
  });

  describe('Consistent error format', () => {
    it('should have error.message property', async () => {
      const res = await request(app)
        .get('/admin')
        .expect(401);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('message');
      expect(typeof res.body.error.message).toBe('string');
    });

    it('should have error.status property', async () => {
      const res = await request(app)
        .get('/admin')
        .expect(401);

      expect(res.body.error).toHaveProperty('status');
      expect(typeof res.body.error.status).toBe('number');
    });
  });
});
