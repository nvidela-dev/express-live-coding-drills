# Challenge 08: Async Error Wrapper

## Difficulty: Intermediate

## Problem

Express.js doesn't natively catch errors from async route handlers. Build a wrapper function that properly catches rejected promises and forwards errors to the error handling middleware.

## Requirements

- [ ] Create `asyncHandler` wrapper function
- [ ] Wrapper should catch errors from async functions
- [ ] Wrapper should catch rejected promises
- [ ] Errors should be forwarded to Express error handler via `next(error)`
- [ ] Successful responses should work normally
- [ ] Create error handler middleware to format errors

## asyncHandler Signature

```javascript
const asyncHandler = (fn) => {
  // Return a function that Express can use as middleware
  // Catch any errors and forward to next()
};
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/success` | Returns data after async delay |
| GET | `/throw` | Throws error in async function |
| GET | `/reject` | Returns rejected promise |
| GET | `/delay-error` | Error after delayed operation |

## Expected Behavior

### GET /success
- Simulates async operation (use setTimeout or Promise)
- Returns `{ data: "success" }` with status 200

### GET /throw
- Uses async/await
- Throws `new Error("Thrown error")`
- Should return 500 with error message

### GET /reject
- Returns `Promise.reject(new Error("Rejected promise"))`
- Should return 500 with error message

### GET /delay-error
- Simulates delayed async operation
- Throws error after delay
- Should return 500 with error message

## Expected Response Formats

### Success (200)
```json
{
  "data": "success"
}
```

### Error (500)
```json
{
  "error": "Error message here"
}
```

## Run Tests

```bash
npm install
npm test
```
