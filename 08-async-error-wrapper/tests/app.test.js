const request = require('supertest');
const app = require('../src/app');

describe('Async Error Wrapper Challenge', () => {
  describe('GET /success', () => {
    it('should return data from async operation', async () => {
      const res = await request(app)
        .get('/success')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({ data: 'success' });
    });
  });

  describe('GET /throw', () => {
    it('should catch thrown errors in async function', async () => {
      const res = await request(app)
        .get('/throw')
        .expect(500);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Thrown error');
    });
  });

  describe('GET /reject', () => {
    it('should catch rejected promises', async () => {
      const res = await request(app)
        .get('/reject')
        .expect(500);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Rejected promise');
    });
  });

  describe('GET /delay-error', () => {
    it('should catch errors after async delay', async () => {
      const res = await request(app)
        .get('/delay-error')
        .expect(500);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Error handling behavior', () => {
    it('should not cause unhandled promise rejection', async () => {
      const unhandledRejection = jest.fn();
      process.on('unhandledRejection', unhandledRejection);

      await request(app).get('/reject');

      // Give time for any unhandled rejections to fire
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(unhandledRejection).not.toHaveBeenCalled();
      process.removeListener('unhandledRejection', unhandledRejection);
    });

    it('should return JSON error response', async () => {
      const res = await request(app)
        .get('/throw')
        .expect('Content-Type', /json/);

      expect(res.body).toHaveProperty('error');
      expect(typeof res.body.error).toBe('string');
    });
  });
});
