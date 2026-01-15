# Challenge 02: JSON Body Handling

## Difficulty: Beginner

## Problem

Build an Express.js application that properly handles JSON request bodies. Your app must parse incoming JSON, validate required fields, and manage an in-memory collection of messages.

## Requirements

- [ ] `POST /api/messages` - Create a new message with `title` and `content` fields
- [ ] `PUT /api/messages/:id` - Update an existing message
- [ ] `GET /api/messages/:id` - Retrieve a message by ID
- [ ] `DELETE /api/messages/:id` - Delete a message by ID
- [ ] Return 201 for successful creation
- [ ] Return 200 for successful update/retrieval
- [ ] Return 204 for successful deletion
- [ ] Return 400 for missing required fields
- [ ] Return 404 for non-existent messages

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/messages` | Create new message |
| GET | `/api/messages/:id` | Get message by ID |
| PUT | `/api/messages/:id` | Update message |
| DELETE | `/api/messages/:id` | Delete message |

## Request Body Format

### POST /api/messages
```json
{
  "title": "Hello",
  "content": "World"
}
```

### PUT /api/messages/:id
```json
{
  "title": "Updated Title",
  "content": "Updated Content"
}
```

## Expected Response Formats

### POST /api/messages (201)
```json
{
  "id": "1",
  "title": "Hello",
  "content": "World"
}
```

### GET /api/messages/:id (200)
```json
{
  "id": "1",
  "title": "Hello",
  "content": "World"
}
```

### PUT /api/messages/:id (200)
```json
{
  "id": "1",
  "title": "Updated Title",
  "content": "Updated Content"
}
```

### Error Response (400/404)
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
