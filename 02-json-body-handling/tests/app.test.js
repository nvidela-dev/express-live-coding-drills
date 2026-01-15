const request = require('supertest');
const app = require('../src/app');

describe('JSON Body Handling Challenge', () => {
  describe('POST /api/messages', () => {
    it('should create a message and return 201', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ title: 'Hello', content: 'World' })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Hello');
      expect(res.body.content).toBe('World');
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ content: 'World' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when content is missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ title: 'Hello' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for empty body', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/messages/:id', () => {
    it('should retrieve a created message', async () => {
      const createRes = await request(app)
        .post('/api/messages')
        .send({ title: 'Test', content: 'Content' })
        .expect(201);

      const id = createRes.body.id;

      const res = await request(app)
        .get(`/api/messages/${id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.id).toBe(id);
      expect(res.body.title).toBe('Test');
      expect(res.body.content).toBe('Content');
    });

    it('should return 404 for non-existent message', async () => {
      const res = await request(app)
        .get('/api/messages/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/messages/:id', () => {
    it('should update an existing message', async () => {
      const createRes = await request(app)
        .post('/api/messages')
        .send({ title: 'Original', content: 'Content' })
        .expect(201);

      const id = createRes.body.id;

      const res = await request(app)
        .put(`/api/messages/${id}`)
        .send({ title: 'Updated', content: 'New Content' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.id).toBe(id);
      expect(res.body.title).toBe('Updated');
      expect(res.body.content).toBe('New Content');
    });

    it('should return 404 for non-existent message', async () => {
      const res = await request(app)
        .put('/api/messages/nonexistent')
        .send({ title: 'Updated', content: 'Content' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing fields on update', async () => {
      const createRes = await request(app)
        .post('/api/messages')
        .send({ title: 'Original', content: 'Content' })
        .expect(201);

      const id = createRes.body.id;

      const res = await request(app)
        .put(`/api/messages/${id}`)
        .send({ title: 'Updated' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/messages/:id', () => {
    it('should delete an existing message and return 204', async () => {
      const createRes = await request(app)
        .post('/api/messages')
        .send({ title: 'ToDelete', content: 'Content' })
        .expect(201);

      const id = createRes.body.id;

      await request(app)
        .delete(`/api/messages/${id}`)
        .expect(204);

      await request(app)
        .get(`/api/messages/${id}`)
        .expect(404);
    });

    it('should return 404 for non-existent message', async () => {
      const res = await request(app)
        .delete('/api/messages/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('error');
    });
  });
});
