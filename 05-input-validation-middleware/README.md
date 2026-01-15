# Challenge 05: Input Validation Middleware

## Difficulty: Intermediate

## Problem

Build a reusable validation middleware system for Express.js that validates request bodies against defined rules. The middleware should collect all validation errors and return them in a structured format.

## Requirements

- [ ] Create a `validate` middleware factory that accepts validation rules
- [ ] Support `required` - field must exist and not be empty
- [ ] Support `minLength` - string minimum length
- [ ] Support `maxLength` - string maximum length
- [ ] Support `isEmail` - valid email format
- [ ] Support `isNumber` - must be a number
- [ ] Support `min` - minimum numeric value
- [ ] Support `max` - maximum numeric value
- [ ] Return all validation errors at once (not just the first one)
- [ ] Return 400 with structured error response on validation failure

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register user (validates name, email, age) |
| POST | `/comment` | Post comment (validates text) |

## Validation Rules per Endpoint

### POST /register
- `name`: required, minLength: 2, maxLength: 50
- `email`: required, isEmail
- `age`: required, isNumber, min: 18, max: 120

### POST /comment
- `text`: required, minLength: 1, maxLength: 500

## Expected Request Bodies

### POST /register
```json
{
  "name": "John",
  "email": "john@example.com",
  "age": 25
}
```

### POST /comment
```json
{
  "text": "This is my comment"
}
```

## Expected Response Formats

### Success (200)
```json
{
  "success": true,
  "data": { ... }
}
```

### Validation Error (400)
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "age",
      "message": "Must be at least 18"
    }
  ]
}
```

## Run Tests

```bash
npm install
npm test
```
