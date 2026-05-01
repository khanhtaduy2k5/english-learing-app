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

- `docker-compose.yml` - Multi-container orchestration configuration
- `server/Dockerfile` - Backend (Spring Boot) container image
- `client/Dockerfile` - Frontend (Next.js) container image
- `docs/DEPLOYMENT.md` - Deployment guide

## Container Structure

### Backend Service

- **Image**: Spring Boot application
- **Port**: 8080 (configurable)
- **Build**: Maven-based build in Dockerfile
- **Volumes**: For development hot-reload (optional)

### Frontend Service

- **Image**: Next.js application
- **Port**: 3000 (configurable)
- **Build**: Node.js-based multi-stage build
- **Dependencies**: Depends on backend service

### Network

- Custom bridge network for inter-container communication
- Service discovery via container names

## Common Tasks

### Building Containers

```bash
docker-compose build
```

### Starting Services

```bash
docker-compose up -d
```

### Stopping Services

```bash
docker-compose down
```

### Viewing Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuilding After Code Changes

```bash
docker-compose up -d --build
```

## Environment Configuration

### Backend Environment Variables

- `SPRING_PROFILES_ACTIVE` - Application profile (dev, test, prod)
- `SERVER_PORT` - Port for Spring Boot application
- Database connection settings

### Frontend Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API endpoint URL
- `NODE_ENV` - Environment (development, production)

## Dockerfile Best Practices

1. Use multi-stage builds to minimize image size
2. Separate build and runtime layers
3. Minimize layer count to improve caching
4. Use specific base image versions (avoid `latest`)
5. Run as non-root user for security
6. Document exposed ports and environment variables

## Docker Compose Best Practices

1. Define services with explicit names for DNS resolution
2. Use `depends_on` to manage startup order
3. Configure health checks for automatic restart
4. Mount volumes for development workflows
5. Use `.env` files for sensitive configuration
6. Version the docker-compose.yml format appropriately

## Deployment Scenarios

### Local Development

```bash
docker-compose -f docker-compose.yml up
```

### Production Deployment

- Push images to container registry (Docker Hub, ECR, GCR, etc.)
- Use environment-specific compose files or Kubernetes
- Configure persistent volumes for data
- Set up reverse proxy (Nginx) for SSL/TLS

## Related Docs

- `docs/DEPLOYMENT.md` - Detailed deployment instructions
- `docs/TROUBLESHOOTING.md` - Common deployment issues
- `README.md` - Quick start with Docker
