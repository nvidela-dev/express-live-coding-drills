# Challenge 01: Route Parameters

## Difficulty: Beginner

## Problem

Build an Express.js application that demonstrates proper handling of URL parameters and query strings. Your app must extract data from route parameters and query strings, then return appropriate JSON responses.

## Requirements

- [ ] `GET /users/:id` - Return a user object with the provided ID
- [ ] `GET /users/:id/posts/:postId` - Return a post object with both user and post IDs
- [ ] `GET /search` - Handle search queries with `q` (required) and `limit` (optional, default 10)
- [ ] Return 400 status for missing required parameters
- [ ] Return 400 status for invalid parameter types (non-numeric IDs)
- [ ] All successful responses return 200 with JSON

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/:id` | Get user by ID |
| GET | `/users/:id/posts/:postId` | Get specific post from user |
| GET | `/search` | Search with query parameters |

## Expected Response Formats

### GET /users/:id
```json
{
  "userId": "123"
}
```

### GET /users/:id/posts/:postId
```json
{
  "userId": "1",
  "postId": "42"
}
```

### GET /search?q=term&limit=5
```json
{
  "query": "term",
  "limit": 5
}
```

### Error Response (400)
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
