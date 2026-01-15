# Challenge 04: Request Logging Middleware

## Difficulty: Beginner

## Problem

Build an Express.js application with custom middleware that logs requests and adds useful headers to responses. The middleware should track timing and assign unique IDs to each request.

## Requirements

- [ ] Create middleware that adds `X-Request-Id` header to all responses
- [ ] Create middleware that adds `X-Response-Time` header (in milliseconds)
- [ ] Store request logs in an exportable array
- [ ] Each log entry should contain: method, url, timestamp, requestId
- [ ] Provide `GET /logs` endpoint to retrieve all logged requests
- [ ] Provide `GET /health` endpoint that returns `{ status: "ok" }`
- [ ] Request ID should be unique for each request

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/logs` | Retrieve all request logs |

## Expected Headers

All responses should include:
- `X-Request-Id`: Unique identifier (e.g., UUID or incrementing number)
- `X-Response-Time`: Time in milliseconds (e.g., "5ms" or "5")

## Log Entry Format

```json
{
  "method": "GET",
  "url": "/health",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "abc-123"
}
```

## Expected Response Formats

### GET /health
```json
{
  "status": "ok"
}
```

### GET /logs
```json
[
  {
    "method": "GET",
    "url": "/health",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "abc-123"
  }
]
```

## Run Tests

```bash
npm install
npm test
```
