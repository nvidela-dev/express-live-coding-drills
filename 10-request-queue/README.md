# Challenge 10: Request Queue with Timeout

## Difficulty: Advanced

## Problem

Build a middleware that manages concurrent requests to a slow backend service. The middleware should limit concurrent requests, queue excess requests, and handle timeouts.

## Requirements

- [ ] Create `requestQueue` middleware with configurable options
- [ ] Limit maximum concurrent requests to the endpoint
- [ ] Queue requests that exceed the concurrent limit
- [ ] Process queued requests as slots become available
- [ ] Timeout queued requests after a configurable duration (504 Gateway Timeout)
- [ ] Reject requests when queue is full (503 Service Unavailable)
- [ ] Include `X-Queue-Position` header for queued requests

## requestQueue Factory Signature

```javascript
const requestQueue = (options) => {
  // options.maxConcurrent - max simultaneous requests
  // options.maxQueue - max requests in queue
  // options.timeout - queue timeout in ms
  // Return middleware function
};
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/slow` | Simulated slow endpoint (200ms delay) |

## Configuration

- maxConcurrent: 2
- maxQueue: 3
- timeout: 1000 (1 second)

## Expected Behavior

1. First 2 requests: Process immediately
2. Requests 3-5: Queue and wait
3. Request 6+: Return 503 (queue full)
4. Queued requests waiting > 1s: Return 504

## Expected Response Formats

### Success (200)
```json
{
  "message": "Processed",
  "processingTime": 200
}
```

### Queue Timeout (504)
```json
{
  "error": "Gateway Timeout - request queued too long"
}
```

### Queue Full (503)
```json
{
  "error": "Service Unavailable - queue full"
}
```

## Expected Headers

### For queued requests (before processing)
```
X-Queue-Position: 2
```

## Run Tests

```bash
npm install
npm test
```
