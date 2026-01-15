# Express.js Live Coding Drills

A collection of backend JavaScript coding challenges for practicing Express.js development. Each challenge simulates an interview-style problem with automated test validation.

## How It Works

1. Pick a challenge folder
2. Read the `README.md` to understand the problem
3. Implement your solution in `src/app.js`
4. Run `npm test` to validate

```bash
cd 01-route-parameters
npm install
npm test
```

## Challenges

### Beginner

| # | Challenge | Description |
|---|-----------|-------------|
| 01 | [Route Parameters](./01-route-parameters) | Extract URL params and query strings |
| 02 | [JSON Body Handling](./02-json-body-handling) | Parse and validate request bodies |
| 03 | [Content Negotiation](./03-content-negotiation) | Return formats based on Accept header |
| 04 | [Request Logging Middleware](./04-request-logging-middleware) | Custom middleware with timing |

### Intermediate

| # | Challenge | Description |
|---|-----------|-------------|
| 05 | [Input Validation Middleware](./05-input-validation-middleware) | Reusable request validators |
| 06 | [JWT Authentication](./06-jwt-authentication) | Token-based auth flow |
| 07 | [Centralized Error Handler](./07-centralized-error-handler) | Custom error classes and formatting |
| 08 | [Async Error Wrapper](./08-async-error-wrapper) | Handle rejected promises |

### Advanced

| # | Challenge | Description |
|---|-----------|-------------|
| 09 | [Rate Limiting](./09-rate-limiting) | Request throttling per IP |
| 10 | [Request Queue](./10-request-queue) | Concurrency and timeout management |
| 11 | [Pagination & Filtering](./11-pagination-filtering) | REST API query handling |
| 12 | [Idempotency Keys](./12-idempotency-keys) | Prevent duplicate operations |

## Rules

- Each challenge is self-contained with its own dependencies
- Tests define the requirements - make them pass
- Don't modify the test files
- No peeking at solutions online - practice makes perfect
