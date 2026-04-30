# english-learning-app

## Server API

The Spring Boot server exposes these REST endpoints:

- `POST /api/auth/login` - login with `{ email, password }`
- `POST /api/auth/register` - register with `{ name, email, password }`
- `POST /api/auth/logout` - logout current user
- `GET /api/lessons` - list lessons
- `GET /api/lessons/{id}` - lesson detail
- `GET /api/lessons/{id}/quiz` - quiz for a lesson
- `GET /api/health` - health check

The current implementation returns demo data so the frontend can run end-to-end right away. You can replace the in-memory data and auth stubs with database-backed logic later.
