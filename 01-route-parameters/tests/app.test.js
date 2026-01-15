const request = require('supertest');
const app = require('../src/app');

describe('Route Parameters Challenge', () => {
  describe('GET /users/:id', () => {
    it('should return user object with provided ID', async () => {
      const res = await request(app)
        .get('/users/123')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({ userId: '123' });
    });

    it('should return 400 for non-numeric ID', async () => {
      const res = await request(app)
        .get('/users/abc')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:id/posts/:postId', () => {
    it('should return both userId and postId', async () => {
      const res = await request(app)
        .get('/users/1/posts/42')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({ userId: '1', postId: '42' });
    });

    it('should return 400 for non-numeric userId', async () => {
      const res = await request(app)
        .get('/users/abc/posts/42')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for non-numeric postId', async () => {
      const res = await request(app)
        .get('/users/1/posts/xyz')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /search', () => {
    it('should return query and default limit', async () => {
      const res = await request(app)
        .get('/search?q=nodejs')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({ query: 'nodejs', limit: 10 });
    });

    it('should use provided limit', async () => {
      const res = await request(app)
        .get('/search?q=express&limit=5')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({ query: 'express', limit: 5 });
    });

    it('should return 400 when q parameter is missing', async () => {
      const res = await request(app)
        .get('/search')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for non-numeric limit', async () => {
      const res = await request(app)
        .get('/search?q=test&limit=abc')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });
});
