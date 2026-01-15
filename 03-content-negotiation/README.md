# Challenge 03: Content Negotiation

## Difficulty: Beginner

## Problem

Build an Express.js application that returns data in different formats based on the client's `Accept` header. The app should serve the same data but format it according to what the client requests.

## Requirements

- [ ] `GET /data` - Return data in format based on Accept header
- [ ] Support `application/json` - Return JSON (default)
- [ ] Support `text/plain` - Return plain text format
- [ ] Support `text/html` - Return HTML formatted response
- [ ] Return 406 Not Acceptable for unsupported formats
- [ ] Set correct `Content-Type` header in responses

## Data to Serve

The endpoint should return information about a product:
- name: "Widget"
- price: 29.99
- inStock: true

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/data` | Get product data in requested format |

## Expected Response Formats

### Accept: application/json (or no Accept header)
```json
{
  "name": "Widget",
  "price": 29.99,
  "inStock": true
}
```

### Accept: text/plain
```
Name: Widget
Price: 29.99
In Stock: Yes
```

### Accept: text/html
```html
<html>
<body>
<h1>Widget</h1>
<p>Price: $29.99</p>
<p>In Stock: Yes</p>
</body>
</html>
```

### Unsupported Accept header (406)
```json
{
  "error": "Not Acceptable"
}
```

## Run Tests

```bash
npm install
npm test
```
