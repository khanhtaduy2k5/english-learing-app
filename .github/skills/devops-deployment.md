---
name: devops-deployment
description: Handle Docker containerization, orchestration, and deployment of the English Learning App
skills:
  - Docker containerization
  - Docker Compose orchestration
  - Container networking
  - Environment configuration
  - Application deployment
applyTo:
  - docker-compose.yml
  - server/Dockerfile
  - client/Dockerfile
---

# DevOps & Deployment Skill

This skill provides expertise for containerizing and deploying the English Learning App using Docker and Docker Compose.

## Core Responsibilities

- Creating and maintaining Dockerfile for frontend and backend
- Managing multi-container orchestration with docker-compose.yml
- Configuring container networking and environment variables
- Building and pushing container images
- Managing deployment configurations

## Key Files

- `docker-compose.yml` - Multi-container orchestration (server, frontend, redis)
- `server/Dockerfile` - Backend (Spring Boot) container image
- `client/Dockerfile` - Frontend (Next.js) container image
- `server/.env` - Supabase database credentials (not committed)
- `docs/DEPLOYMENT.md` - Deployment guide

## Container Structure

### Backend Service (`server`)

- **Image**: Spring Boot application (Eclipse Temurin 21 JRE)
- **Port**: 8080
- **Build**: Multi-stage Maven build
- **Database**: Connects to Supabase PostgreSQL via Session Pooler
- **Health Check**: `GET /api/health`

### Frontend Service (`frontend`)

- **Image**: Next.js application (Node 20 Alpine)
- **Port**: 3000
- **Build**: Multi-stage Node.js build
- **Dependencies**: Depends on server service being healthy

### Redis Service (`redis`)

- **Image**: Redis 7 Alpine
- **Port**: 6379
- **Usage**: Caching (optional)

### Network

- Custom bridge network `english-learning-network`
- Service discovery via container names

## Common Tasks

### Building Containers

```bash
docker compose build
```

### Starting Services

```bash
docker compose up -d
```

### Stopping Services

```bash
docker compose down
```

### Viewing Logs

```bash
docker compose logs -f server
docker compose logs -f frontend
```

### Rebuilding After Code Changes

```bash
docker compose up -d --build
```

## Environment Configuration

### Backend Environment Variables (server/.env)

- `SPRING_DATASOURCE_URL` - JDBC connection string (Supabase Pooler)
- `SPRING_DATASOURCE_USERNAME` - Database username (e.g. `postgres.project_id`)
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `SPRING_REDIS_HOST` - Redis hostname (set in docker-compose.yml)
- `SPRING_REDIS_PORT` - Redis port (set in docker-compose.yml)

### Frontend Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API endpoint (e.g. `http://localhost:8080`)

## Dockerfile Best Practices

1. Use multi-stage builds to minimize image size
2. Separate build and runtime layers
3. Minimize layer count to improve caching
4. Use specific base image versions (avoid `latest`)
5. Run as non-root user for security
6. Document exposed ports and environment variables

## Docker Compose Best Practices

1. Define services with explicit names for DNS resolution
2. Use `depends_on` with `condition: service_healthy` for proper startup order
3. Configure health checks for automatic restart and dependency management
4. Use `env_file` for sensitive configuration (not hardcoded in compose file)
5. Remove unused services (e.g. local postgres when using Supabase)

## Deployment Scenarios

### Local Development

```bash
docker compose up -d --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

### Production Deployment

- Push images to container registry (Docker Hub, ECR, GCR, etc.)
- Use environment-specific compose files or Kubernetes
- Configure SSL/TLS via reverse proxy (Nginx, Traefik)
- Ensure database credentials are managed via secrets

## Related Docs

- `docs/DEPLOYMENT.md` - Detailed deployment instructions
- `docs/TROUBLESHOOTING.md` - Common deployment issues
- `README.md` - Quick start with Docker
