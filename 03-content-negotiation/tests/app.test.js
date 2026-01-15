const request = require('supertest');
const app = require('../src/app');

describe('Content Negotiation Challenge', () => {
  describe('GET /data', () => {
    it('should return JSON by default', async () => {
      const res = await request(app)
        .get('/data')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({
        name: 'Widget',
        price: 29.99,
        inStock: true
      });
    });

    it('should return JSON when Accept: application/json', async () => {
      const res = await request(app)
        .get('/data')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({
        name: 'Widget',
        price: 29.99,
        inStock: true
      });
    });

    it('should return plain text when Accept: text/plain', async () => {
      const res = await request(app)
        .get('/data')
        .set('Accept', 'text/plain')
        .expect('Content-Type', /text\/plain/)
        .expect(200);

      expect(res.text).toContain('Name: Widget');
      expect(res.text).toContain('Price: 29.99');
      expect(res.text).toContain('In Stock: Yes');
    });

    it('should return HTML when Accept: text/html', async () => {
      const res = await request(app)
        .get('/data')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text\/html/)
        .expect(200);

      expect(res.text).toContain('<html>');
      expect(res.text).toContain('Widget');
      expect(res.text).toContain('29.99');
      expect(res.text).toContain('</html>');
    });

    it('should return 406 for unsupported Accept header', async () => {
      const res = await request(app)
        .get('/data')
        .set('Accept', 'application/xml')
        .expect(406);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 406 for image/png Accept header', async () => {
      const res = await request(app)
        .get('/data')
        .set('Accept', 'image/png')
        .expect(406);

      expect(res.body).toHaveProperty('error');
    });
  });
});
