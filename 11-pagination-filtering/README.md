# Challenge 11: Pagination & Filtering API

## Difficulty: Advanced

## Problem

Build a REST API endpoint with comprehensive pagination, sorting, and filtering capabilities. The API should handle query parameters to return subsets of data with proper metadata.

## Requirements

- [ ] `GET /api/products` - Returns paginated, sorted, filtered products
- [ ] Support `page` and `limit` query parameters for pagination
- [ ] Support `sort` parameter with format `field:order` (e.g., `name:asc`)
- [ ] Support multiple sort fields (e.g., `sort=price:desc,name:asc`)
- [ ] Support `filter` parameter for filtering (e.g., `filter[status]=active`)
- [ ] Support comparison filters: `_gte`, `_lte`, `_gt`, `_lt`
- [ ] Return metadata: total, page, limit, totalPages
- [ ] Default: page=1, limit=10

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | Get products with pagination/filtering |

## Sample Data

Use this in-memory dataset (25 products):

```javascript
const products = [
  { id: 1, name: 'Laptop', price: 999, status: 'active', category: 'electronics' },
  { id: 2, name: 'Phone', price: 699, status: 'active', category: 'electronics' },
  // ... more products
];
```

## Query Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=5` | Items per page (default: 10) |
| `sort` | `?sort=price:desc` | Sort by field and order |
| `filter[field]` | `?filter[status]=active` | Exact match filter |
| `filter[field_gte]` | `?filter[price_gte]=100` | Greater than or equal |
| `filter[field_lte]` | `?filter[price_lte]=500` | Less than or equal |

## Example Requests

```
GET /api/products?page=1&limit=5
GET /api/products?sort=price:desc
GET /api/products?sort=category:asc,price:desc
GET /api/products?filter[status]=active
GET /api/products?filter[price_gte]=100&filter[price_lte]=500
GET /api/products?page=2&limit=5&sort=name:asc&filter[category]=electronics
```

## Expected Response Format

```json
{
  "data": [
    { "id": 1, "name": "Laptop", "price": 999, "status": "active", "category": "electronics" }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

## Run Tests

```bash
npm install
npm test
```
