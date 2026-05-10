---
name: fullstack-development
description: Coordinate full-stack development across frontend, backend, and DevOps
skills:
  - Full-stack architecture understanding
  - Frontend-backend API integration
  - End-to-end feature development
  - Cross-stack debugging
  - Project structure and workflow coordination
applyTo:
  - .
---

# Full-Stack Development Skill

This skill provides expertise for developing features across the entire English Learning App stack: frontend, backend, and DevOps.

## Project Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (Next.js + React)             │
│  - Components, Pages, State Management  │
│  - client/src/app, client/src/components│
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               │
┌──────────────▼──────────────────────────┐
│  Backend (Spring Boot)                  │
│  - REST Endpoints, Services, Data Logic │
│  - server/src/main/java/com/example/   │
└──────────────┬──────────────────────────┘
               │ JDBC (Supabase Pooler)
               │
┌──────────────▼──────────────────────────┐
│  Database (Supabase PostgreSQL)         │
│  - Cloud-hosted, Session Pooler (IPv4)  │
│  - Redis for caching (optional)         │
└─────────────────────────────────────────┘
```

## Development Workflow

### Feature Development Checklist

1. **Plan the Feature**
   - Define API contract (endpoints, request/response)
   - Sketch UI/UX
   - Identify data model changes

2. **Implement Backend**
   - Create/modify REST endpoints
   - Implement business logic in services
   - Write unit and integration tests
   - Update `docs/API.md` with endpoint specification

3. **Implement Frontend**
   - Create React components for UI
   - Add client-side logic and state management
   - Integrate with backend API using `client/src/lib/api.ts`
   - Write component and E2E tests

4. **Test Integration**
   - Run E2E tests with Playwright
   - Manual testing in Docker environment
   - Cross-browser testing

5. **Deploy & Monitor**
   - Verify Docker builds work
   - Test in staging environment
   - Monitor logs and health checks

## Key Integration Points

### API Client (`client/src/lib/api.ts`)

The frontend API client handles:

- HTTP requests to backend endpoints
- Request/response formatting
- Error handling and retries
- Authentication token management

### Authentication Flow

1. User registers/logs in via frontend
2. Backend validates credentials and returns JWT token
3. Frontend stores token in `authStore.ts`
4. Subsequent requests include token in `Authorization` header
5. Backend validates token and authorizes requests

### State Management Pattern

- **authStore**: Authentication state and user info
- **Backend**: Single source of truth for persistent data (Supabase PostgreSQL)

## Common Full-Stack Tasks

### Adding a New Lesson Feature

**Backend Steps:**

```java
// 1. Create/update entity (JPA)
// 2. Create repository interface
// 3. Create service with business logic
// 4. Create REST controller with endpoints
// 5. Write unit tests
```

**Frontend Steps:**

```tsx
// 1. Add API client methods in lib/api.ts
// 2. Create React components for UI
// 3. Integrate state with components
// 4. Write component tests in __tests__/
// 5. Write E2E tests in e2e/
```

**DevOps Steps:**

```bash
# Verify Docker builds with new dependencies
docker compose build

# Test in containerized environment
docker compose up -d

# Verify services are healthy
docker compose ps
```

### Debugging End-to-End Issues

1. **Check Backend Logs**

   ```bash
   docker compose logs server
   ```

2. **Verify API Response**
   - Browser DevTools → Network tab
   - Check request/response in API calls

3. **Check Frontend State**
   - Zustand DevTools (browser extension)
   - React DevTools for component props

4. **Check Docker Networking**

   ```bash
   docker compose exec frontend ping server
   ```

5. **Check Environment Variables**
   - Verify `NEXT_PUBLIC_API_BASE_URL` matches backend URL

## Directory Navigation

```
english-learning-app/
├── client/                 # Frontend (Next.js)
│   ├── src/app/           # Pages (App Router)
│   ├── src/components/    # React components (Sidebar, Button, Input)
│   ├── src/hooks/         # Custom hooks (useAuth)
│   ├── src/store/         # Zustand stores (authStore)
│   ├── src/lib/           # API client, utilities
│   ├── __tests__/         # Centralized unit tests (Vitest)
│   └── e2e/               # Playwright E2E tests
│
├── server/                # Backend (Spring Boot)
│   ├── src/main/java/     # Application code
│   ├── src/test/java/     # Tests (JUnit + Mockito)
│   ├── .env               # Supabase credentials (not committed)
│   └── pom.xml            # Maven configuration
│
├── docker-compose.yml     # Multi-container setup (server + frontend + redis)
└── docs/                  # Documentation
    ├── API.md            # API specification
    ├── ARCHITECTURE.md   # Architecture overview
    ├── DEPLOYMENT.md     # Deployment guide
    └── DATABASE.md       # Database schema
```

## Environment Setup

### Development (Local)

```bash
# Backend
cd server
.\mvnw spring-boot:run    # Reads .env automatically

# Frontend
cd client
npm run dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

### Development (Docker)

```bash
docker compose up -d --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

### Testing

```bash
# Client unit tests
cd client && npm test

# Server unit tests
cd server && .\mvnw test

# E2E tests
cd client && npm run test:e2e
```

## Communication Between Services

### Docker Compose Service Names

- Frontend service: `frontend`
- Backend service: `server`
- Frontend reaches backend at: `http://localhost:8080` (via port mapping)

### Environment Variables

- Frontend needs `NEXT_PUBLIC_API_BASE_URL` environment variable
- Backend reads Supabase credentials from `server/.env` via `env_file`

## Related Documentation

- `docs/ARCHITECTURE.md` - Complete architecture overview
- `docs/API.md` - API endpoints and contracts
- `docs/DATABASE.md` - Database schema and design
- `docs/DEPLOYMENT.md` - Production deployment guide
- `docs/CONTRIBUTING.md` - Contributing guidelines
- `docs/SETUP.md` - Complete setup instructions

## Best Practices

1. **Communication First**: Define API contracts before implementation
2. **Test at All Levels**: Unit, integration, and E2E tests
3. **Document Changes**: Keep API.md and other docs updated
4. **Use Docker**: Develop in containers that match production
5. **Version Everything**: Code, dependencies, database schemas
6. **Monitor Logs**: Check backend and frontend logs for issues
7. **Automate Deployment**: Use Docker and CI/CD pipelines
