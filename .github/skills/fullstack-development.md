---
name: fullstack-development
description: Coordinate full-stack development with TDD, gorgeous UI, and security-first approach
skills:
  - Full-stack architecture
  - TDD across frontend and backend
  - Frontend-backend API integration
  - End-to-end feature development
  - Security-first development
applyTo:
  - .
---

# Full-Stack Development Skill

## ⚠️ MANDATORY WORKFLOW — Every New Feature

**This is the ONLY acceptable workflow for developing features. Deviations are NOT allowed.**

```
┌──────────────────────────────────────────────────┐
│  STEP 1: Plan                                     │
│  → Define API contract (endpoints, request/response)│
│  → Sketch UI (gorgeous, premium design)            │
│  → Identify data model changes                     │
├──────────────────────────────────────────────────┤
│  STEP 2: Write Backend Tests (RED)                │
│  → Service unit tests (Mockito)                    │
│  → Controller integration tests (MockMvc)          │
│  → Security tests (OWASP applicable categories)    │
│  → Run .\mvnw test → ALL FAIL ✅                   │
├──────────────────────────────────────────────────┤
│  STEP 3: Implement Backend (GREEN)                │
│  → Write minimum code to pass tests               │
│  → Run .\mvnw test → ALL PASS ✅                   │
├──────────────────────────────────────────────────┤
│  STEP 4: Write Frontend Tests (RED)               │
│  → Component tests (Vitest + Testing Library)      │
│  → Hook/store tests                                │
│  → E2E tests (Playwright)                          │
│  → Run npm test → ALL FAIL ✅                      │
├──────────────────────────────────────────────────┤
│  STEP 5: Implement Frontend (GREEN + GORGEOUS)    │
│  → Build components with premium design            │
│  → Glassmorphism, micro-animations, gradients      │
│  → Run npm test → ALL PASS ✅                      │
├──────────────────────────────────────────────────┤
│  STEP 6: Integration Test                         │
│  → E2E tests with Playwright                      │
│  → Manual verification in browser                  │
│  → Cross-browser / responsive check                │
├──────────────────────────────────────────────────┤
│  STEP 7: Refactor + Final Verification            │
│  → Clean up code (both frontend and backend)       │
│  → Run ALL tests: .\mvnw test && npm test          │
│  → ALL GREEN ✅                                    │
└──────────────────────────────────────────────────┘
```

## Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (Next.js + React + Tailwind)  │
│  Port: 3000                             │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│  Backend (Spring Boot 4.x + Java 21)    │
│  Port: 8080                             │
└──────────────┬──────────────────────────┘
               │ JDBC (Supabase Pooler)
┌──────────────▼──────────────────────────┐
│  Database (PostgreSQL) + Redis Cache    │
└─────────────────────────────────────────┘
```

## Directory Structure

```
english-learning-app/
├── client/                  # Frontend (Next.js)
│   ├── src/app/            # Pages (App Router)
│   ├── src/components/     # UI components
│   ├── src/hooks/          # Custom hooks
│   ├── src/store/          # Zustand stores
│   ├── src/lib/            # API client, utilities
│   ├── src/styles/         # globals.css (theme variables)
│   ├── __tests__/          # Unit tests (Vitest)
│   └── src/e2e/            # E2E tests (Playwright)
│
├── server/                  # Backend (Spring Boot)
│   ├── src/main/java/      # Application code
│   ├── src/test/java/      # Tests (JUnit + Mockito + Security)
│   └── pom.xml             # Maven configuration
│
├── docker-compose.yml       # server + frontend + redis
└── docs/                    # Documentation
```

## Authentication Flow

```
1. User registers/logs in → Frontend sends POST /api/auth/login
2. Backend validates credentials → returns JWT token
3. Frontend stores token in authStore (Zustand)
4. Subsequent requests include Authorization: Bearer {token}
5. Backend validates token on protected endpoints
```

## API Integration

- Frontend API client: `client/src/lib/api.ts` (Axios with interceptors)
- Backend base URL: `http://localhost:8080` (dev) / env variable (prod)
- Frontend env: `NEXT_PUBLIC_API_BASE_URL`

## Testing Commands

```bash
# Backend tests (run FIRST)
cd server && .\mvnw test

# Frontend unit tests
cd client && npm test

# Frontend E2E tests
cd client && npm run test:e2e

# Security dependency scan
cd server && .\mvnw org.owasp:dependency-check-maven:check
```

## Development Commands

```bash
# Backend
cd server && .\mvnw spring-boot:run

# Frontend
cd client && npm run dev

# Docker (full stack)
docker compose up -d --build
```

## Quality Checklist (Before Completion)

```
Tests:
  □ Backend unit tests written and passing
  □ Backend security tests (OWASP) written and passing
  □ Frontend component tests written and passing
  □ E2E tests written and passing

UI Quality:
  □ Glassmorphism applied to cards/modals
  □ Micro-animations on all interactive elements
  □ Responsive layout (mobile → desktop)
  □ Dark mode consistent with design system
  □ No plain/unstyled elements

Security:
  □ No hardcoded secrets
  □ Input validation on both frontend and backend
  □ Protected endpoints require authentication
  □ Error messages don't leak internal details
```
