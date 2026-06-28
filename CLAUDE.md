# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal Node.js REST API built with Express 5.x. The entire application lives in a single file (`index.js`). Data is stored in-memory (no database), so it resets on every restart.

## Running the Server

```bash
node index.js
# Server starts at http://localhost:3000
```

No build step required. There is no configured test runner or linter — `npm test` will exit with an error.

## API Endpoints

All endpoints require the header `x-api-key: my-secret-key-123`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users?id=<id>` | Fetch a single user by integer ID |
| POST | `/users` | Create a new user (`id`, `name`, `email` required in JSON body) |

Example requests:
```bash
# Get a user
curl -H "x-api-key: my-secret-key-123" "http://localhost:3000/users?id=101"

# Create a user
curl -X POST -H "x-api-key: my-secret-key-123" -H "Content-Type: application/json" \
  -d '{"id":103,"name":"Test","email":"test@example.com"}' http://localhost:3000/users
```

## Architecture

`index.js` contains everything:
- **`authenticate` middleware** — checks `x-api-key` header against the hardcoded `API_KEY` constant; returns 401 if missing or wrong.
- **`users` array** — in-memory data store seeded with two records (IDs 101, 102). Writes (POST) mutate this array at runtime only.
- **Route handlers** — both routes apply `authenticate` before the handler. GET parses `req.query.id` as an integer; POST validates that `id`, `name`, and `email` are present and that the ID is not a duplicate.

The API key (`my-secret-key-123`) is hardcoded directly in `index.js`. Any future secrets should be moved to environment variables (`process.env`).
