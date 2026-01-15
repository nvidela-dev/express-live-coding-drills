const request = require('supertest');
const app = require('../src/app');

describe('Input Validation Middleware Challenge', () => {
  describe('POST /register', () => {
    it('should accept valid registration', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'John', email: 'john@example.com', age: 25 })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should reject missing name', async () => {
      const res = await request(app)
        .post('/register')
        .send({ email: 'john@example.com', age: 25 })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'name' })
      );
    });

    it('should reject name shorter than 2 characters', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'J', email: 'john@example.com', age: 25 })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'name' })
      );
    });

    it('should reject name longer than 50 characters', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'A'.repeat(51), email: 'john@example.com', age: 25 })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'name' })
      );
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'John', email: 'notanemail', age: 25 })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should reject non-numeric age', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'John', email: 'john@example.com', age: 'twenty' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'age' })
      );
    });

    it('should reject age below 18', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'John', email: 'john@example.com', age: 15 })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'age' })
      );
    });

    it('should reject age above 120', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'John', email: 'john@example.com', age: 150 })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'age' })
      );
    });

    it('should return multiple errors at once', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: '', email: 'invalid', age: 10 })
        .expect(400);

      expect(res.body.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('POST /comment', () => {
    it('should accept valid comment', async () => {
      const res = await request(app)
        .post('/comment')
        .send({ text: 'This is a valid comment' })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should reject empty text', async () => {
      const res = await request(app)
        .post('/comment')
        .send({ text: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'text' })
      );
    });

    it('should reject text longer than 500 characters', async () => {
      const res = await request(app)
        .post('/comment')
        .send({ text: 'A'.repeat(501) })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'text' })
      );
    });

    it('should reject missing text field', async () => {
      const res = await request(app)
        .post('/comment')
        .send({})
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'text' })
      );
    });
  });

  describe('Error response format', () => {
    it('should include field and message in errors', async () => {
      const res = await request(app)
        .post('/register')
        .send({})
        .expect(400);

      expect(res.body.errors[0]).toHaveProperty('field');
      expect(res.body.errors[0]).toHaveProperty('message');
      expect(typeof res.body.errors[0].message).toBe('string');
    });
  });
});
