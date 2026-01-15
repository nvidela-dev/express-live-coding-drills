const request = require('supertest');
const app = require('../src/app');
const { products } = require('../src/app');

describe('Pagination & Filtering Challenge', () => {
  describe('Basic Pagination', () => {
    it('should return first page with default limit', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.data).toHaveLength(10);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(10);
    });

    it('should return correct page when specified', async () => {
      const res = await request(app)
        .get('/api/products?page=2&limit=5')
        .expect(200);

      expect(res.body.data).toHaveLength(5);
      expect(res.body.meta.page).toBe(2);
      expect(res.body.meta.limit).toBe(5);
    });

    it('should include total count in metadata', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect(200);

      expect(res.body.meta.total).toBe(25);
    });

    it('should calculate totalPages correctly', async () => {
      const res = await request(app)
        .get('/api/products?limit=10')
        .expect(200);

      expect(res.body.meta.totalPages).toBe(3);
    });

    it('should return empty array for page beyond data', async () => {
      const res = await request(app)
        .get('/api/products?page=100')
        .expect(200);

      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('Sorting', () => {
    it('should sort by price ascending', async () => {
      const res = await request(app)
        .get('/api/products?sort=price:asc&limit=25')
        .expect(200);

      const prices = res.body.data.map(p => p.price);
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

    it('should sort by price descending', async () => {
      const res = await request(app)
        .get('/api/products?sort=price:desc&limit=25')
        .expect(200);

      const prices = res.body.data.map(p => p.price);
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });

    it('should sort by name ascending', async () => {
      const res = await request(app)
        .get('/api/products?sort=name:asc&limit=25')
        .expect(200);

      const names = res.body.data.map(p => p.name);
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    });

    it('should support multiple sort fields', async () => {
      const res = await request(app)
        .get('/api/products?sort=category:asc,price:desc&limit=25')
        .expect(200);

      // Check that products are sorted by category first
      const categories = res.body.data.map(p => p.category);
      const sortedCategories = [...new Set(categories)].sort();

      // First product's category should be first alphabetically
      expect(sortedCategories[0]).toBe(res.body.data[0].category);
    });
  });

  describe('Filtering', () => {
    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/products?filter[status]=active&limit=25')
        .expect(200);

      res.body.data.forEach(product => {
        expect(product.status).toBe('active');
      });
    });

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/products?filter[category]=electronics&limit=25')
        .expect(200);

      res.body.data.forEach(product => {
        expect(product.category).toBe('electronics');
      });
    });

    it('should filter with price_gte', async () => {
      const res = await request(app)
        .get('/api/products?filter[price_gte]=100&limit=25')
        .expect(200);

      res.body.data.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(100);
      });
    });

    it('should filter with price_lte', async () => {
      const res = await request(app)
        .get('/api/products?filter[price_lte]=50&limit=25')
        .expect(200);

      res.body.data.forEach(product => {
        expect(product.price).toBeLessThanOrEqual(50);
      });
    });

    it('should filter with price range', async () => {
      const res = await request(app)
        .get('/api/products?filter[price_gte]=100&filter[price_lte]=500&limit=25')
        .expect(200);

      res.body.data.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(100);
        expect(product.price).toBeLessThanOrEqual(500);
      });
    });

    it('should update total count for filtered results', async () => {
      const res = await request(app)
        .get('/api/products?filter[category]=electronics')
        .expect(200);

      expect(res.body.meta.total).toBeLessThan(25);
      expect(res.body.meta.total).toBe(
        products.filter(p => p.category === 'electronics').length
      );
    });
  });

  describe('Combined Operations', () => {
    it('should paginate, sort, and filter together', async () => {
      const res = await request(app)
        .get('/api/products?page=1&limit=5&sort=price:desc&filter[status]=active')
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(5);

      // All should be active
      res.body.data.forEach(product => {
        expect(product.status).toBe('active');
      });

      // Should be sorted by price desc
      const prices = res.body.data.map(p => p.price);
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });
  });
});
