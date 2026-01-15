# Challenge 12: Idempotency Keys

## Difficulty: Advanced

## Problem

Implement idempotency for POST requests to prevent duplicate operations. When a client retries a request with the same idempotency key, return the cached response instead of executing the operation again.

## Requirements

- [ ] Create `idempotency` middleware that handles idempotency keys
- [ ] Accept `Idempotency-Key` header on POST requests
- [ ] Store responses keyed by idempotency key
- [ ] Return cached response for duplicate keys (without re-executing)
- [ ] Add `X-Idempotent-Replayed` header when returning cached response
- [ ] Keys expire after configurable TTL
- [ ] Handle missing idempotency key (optional behavior)

## idempotency Factory Signature

```javascript
const idempotency = (options) => {
  // options.ttl - time to live in milliseconds (default: 86400000 = 24h)
  // Return middleware function
};
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payments` | Create payment (idempotent) |
| POST | `/api/orders` | Create order (idempotent) |

## Expected Behavior

1. First request with key "abc-123": Execute operation, store result, return response
2. Second request with key "abc-123": Return stored response, set `X-Idempotent-Replayed: true`
3. Request with different key: Execute as new operation
4. Request after TTL expires: Execute as new operation

## Request Format

```
POST /api/payments
Idempotency-Key: unique-key-123
Content-Type: application/json

{
  "amount": 100,
  "currency": "USD"
}
```

## Expected Response Formats

### First Request (201)
```json
{
  "id": "pay_123",
  "amount": 100,
  "currency": "USD",
  "status": "completed"
}
```

### Replayed Request (201, with X-Idempotent-Replayed header)
Same response body as original request.

Headers:
```
X-Idempotent-Replayed: true
```

## Simulated Side Effect

The endpoint should increment a counter each time a payment is "processed". This counter can be exported for testing to verify that duplicate requests don't cause duplicate processing.

## Run Tests

```bash
npm install
npm test
```
