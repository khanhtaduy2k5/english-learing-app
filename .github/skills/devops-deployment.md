---
name: devops-deployment
description: Handle Docker containerization, CI/CD, and deployment
skills:
  - Docker multi-stage builds
  - Docker Compose orchestration
  - CI/CD pipeline configuration
  - Environment management
applyTo:
  - docker-compose.yml
  - server/Dockerfile
  - client/Dockerfile
  - .github/workflows/**
---

# DevOps & Deployment Skill

## Container Architecture

| Service | Image Base | Port | Health Check |
|---------|-----------|------|-------------|
| `server` | Eclipse Temurin 21 JRE | 8080 | `GET /api/health` |
| `frontend` | Node 20 Alpine | 3000 | HTTP check |
| `redis` | Redis 7 Alpine | 6379 | `redis-cli ping` |

Network: Custom bridge `english-learning-network`

## Key Files

- `docker-compose.yml` — Multi-container orchestration
- `server/Dockerfile` — Spring Boot multi-stage build
- `client/Dockerfile` — Next.js multi-stage build
- `.github/workflows/ci.yml` — CI/CD pipeline

## Commands

```bash
# Build and start
docker compose up -d --build

# Stop
docker compose down

# Logs
docker compose logs -f server
docker compose logs -f frontend

# Rebuild single service
docker compose up -d --build server
```

## Environment Variables

### Backend (`server/.env`)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=postgres.project_id
SPRING_DATASOURCE_PASSWORD=***
SPRING_REDIS_HOST=redis
SPRING_REDIS_PORT=6379
```

### Frontend
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Dockerfile Best Practices

1. Multi-stage builds (build → runtime)
2. Specific base image versions (no `latest`)
3. Run as non-root user
4. Minimize layer count
5. `.dockerignore` for build context

## CI/CD Pipeline

Tests MUST pass before any deployment:
```
1. .\mvnw test                    # Backend tests
2. npm test                        # Frontend tests
3. docker compose build            # Container builds
4. Deploy to staging → Verify → Deploy to production
```
