const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

const JWT_SECRET = 'your-secret-key';

describe('JWT Authentication Challenge', () => {
  describe('POST /auth/login', () => {
    it('should return token for valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('should return valid JWT with username', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'password123' })
        .expect(200);

      const decoded = jwt.verify(res.body.token, JWT_SECRET);
      expect(decoded).toHaveProperty('username', 'admin');
    });

    it('should return 401 for invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'nonexistent', password: 'password' })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should work for user credentials too', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'user', password: 'userpass' })
        .expect(200);

      expect(res.body).toHaveProperty('token');
    });
  });

  describe('GET /protected', () => {
    let token;

    beforeAll(async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'password123' });
      token = res.body.token;
    });

    it('should allow access with valid token', async () => {
      const res = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Access granted');
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app)
        .get('/protected')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 403 for invalid token', async () => {
      const res = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(403);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 403 for expired token', async () => {
      const expiredToken = jwt.sign(
        { username: 'admin' },
        JWT_SECRET,
        { expiresIn: '-1s' }
      );

      const res = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(403);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for malformed Authorization header', async () => {
      const res = await request(app)
        .get('/protected')
        .set('Authorization', 'NotBearer token')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /profile', () => {
    it('should return user info from token', async () => {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'password123' });

      const res = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .expect(200);

      expect(res.body).toHaveProperty('username', 'admin');
    });

    it('should return different user for different login', async () => {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ username: 'user', password: 'userpass' });

      const res = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .expect(200);

      expect(res.body).toHaveProperty('username', 'user');
    });
  });
});
