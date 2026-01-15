# Challenge 07: Centralized Error Handler

## Difficulty: Intermediate

## Problem

Build an Express.js application with a centralized error handling system using custom error classes. The error handler should format errors consistently and map error types to appropriate HTTP status codes.

## Requirements

- [ ] Create custom error classes: `NotFoundError`, `ValidationError`, `UnauthorizedError`
- [ ] Each error class should have a `statusCode` property
- [ ] Create centralized error handler middleware (must be last middleware)
- [ ] Error responses should have consistent format
- [ ] Support `NODE_ENV=production` to hide stack traces
- [ ] Unknown errors should return 500 Internal Server Error

## Custom Error Classes

```javascript
class NotFoundError extends Error {
  statusCode = 404;
}

class ValidationError extends Error {
  statusCode = 400;
}

class UnauthorizedError extends Error {
  statusCode = 401;
}
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/resource/:id` | Throws NotFoundError if id is "missing" |
| POST | `/data` | Throws ValidationError if body is empty |
| GET | `/admin` | Throws UnauthorizedError always |
| GET | `/crash` | Throws generic Error (500) |

## Expected Response Format

### Error Response
```json
{
  "error": {
    "message": "Resource not found",
    "status": 404
  }
}
```

### Development Mode (NODE_ENV !== 'production')
```json
{
  "error": {
    "message": "Resource not found",
    "status": 404,
    "stack": "Error: Resource not found\n    at ..."
  }
}
```

### Production Mode (NODE_ENV === 'production')
Stack trace should be omitted.

## Status Code Mapping

| Error Class | Status Code |
|-------------|-------------|
| NotFoundError | 404 |
| ValidationError | 400 |
| UnauthorizedError | 401 |
| Generic Error | 500 |

## Run Tests

```bash
npm install
npm test
```
