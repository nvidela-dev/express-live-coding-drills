# Challenge 09: Rate Limiting

## Difficulty: Advanced

## Problem

Build a rate limiting middleware from scratch (no external libraries). The middleware should track requests per IP address and reject requests that exceed the limit.

## Requirements

- [ ] Create `rateLimit` middleware factory with configurable options
- [ ] Track requests per IP address in memory
- [ ] Support configurable `windowMs` (time window in milliseconds)
- [ ] Support configurable `max` (maximum requests per window)
- [ ] Return 429 Too Many Requests when limit exceeded
- [ ] Include `Retry-After` header with seconds until reset
- [ ] Include `X-RateLimit-Limit` header showing max requests
- [ ] Include `X-RateLimit-Remaining` header showing remaining requests
- [ ] Reset count after window expires

## rateLimit Factory Signature

```javascript
const rateLimit = (options) => {
  // options.windowMs - time window in ms
  // options.max - max requests per window
  // Return middleware function
};
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/limited` | Rate limited endpoint (5 req/10sec) |
| GET | `/api/strict` | Stricter limit (2 req/10sec) |
| GET | `/api/unlimited` | No rate limiting |

## Expected Headers

### Successful Requests
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
```

### Rate Limited Response (429)
```
Retry-After: 8
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
```

## Expected Response Formats

### Success (200)
```json
{
  "message": "OK"
}
```

### Rate Limited (429)
```json
{
  "error": "Too many requests, please try again later"
}
```

## Configuration

- `/api/limited`: windowMs: 10000, max: 5
- `/api/strict`: windowMs: 10000, max: 2
- `/api/unlimited`: No rate limit middleware

## Run Tests

```bash
npm install
npm test
```
