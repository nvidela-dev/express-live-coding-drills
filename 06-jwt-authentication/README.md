# Challenge 06: JWT Authentication

## Difficulty: Intermediate

## Problem

Build an Express.js application with JWT-based authentication. Implement login functionality that issues tokens and middleware that protects routes by validating tokens.

## Requirements

- [ ] `POST /auth/login` - Authenticate user and return JWT token
- [ ] `GET /protected` - Protected route requiring valid JWT
- [ ] `GET /profile` - Returns user info from decoded token
- [ ] Create `authMiddleware` that validates JWT from Authorization header
- [ ] Token should be sent as `Bearer <token>` in Authorization header
- [ ] Attach decoded user info to `req.user`
- [ ] Return 401 for missing token
- [ ] Return 403 for invalid or expired token
- [ ] Use a secret key for signing (can be hardcoded for this challenge)

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Login and get token |
| GET | `/protected` | Protected resource |
| GET | `/profile` | Get user profile from token |

## Test Users

Use these hardcoded credentials for testing:
- Username: `admin`, Password: `password123`
- Username: `user`, Password: `userpass`

## Expected Request/Response Formats

### POST /auth/login

Request:
```json
{
  "username": "admin",
  "password": "password123"
}
```

Success Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Failed Response (401):
```json
{
  "error": "Invalid credentials"
}
```

### GET /protected (with valid token)

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Response (200):
```json
{
  "message": "Access granted"
}
```

### GET /profile (with valid token)

Response (200):
```json
{
  "username": "admin"
}
```

### Missing Token (401)
```json
{
  "error": "No token provided"
}
```

### Invalid Token (403)
```json
{
  "error": "Invalid token"
}
```

## Run Tests

```bash
npm install
npm test
```
