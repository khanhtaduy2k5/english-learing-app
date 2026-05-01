# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Git for version control
- Environment variables configured

## Development Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd english-learning-app
```

### 2. Configure Environment Variables

Create `.env` file in the root directory:

```env
# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/english_learning_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_REDIS_HOST=redis
SPRING_REDIS_PORT=6379

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000
```

### 3. Build and Run with Docker Compose

```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

**Services will be available at:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Production Deployment

### 1. Server Setup

#### On Ubuntu/Debian Server:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /app/english-learning-app
cd /app/english-learning-app
```

### 2. Deploy Application

```bash
# Pull latest code
git clone <repository-url> .

# Create production .env file
sudo nano .env
```

**Production .env template:**

```env
# Database
POSTGRES_DB=english_learning_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<strong-password>

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/english_learning_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<strong-password>
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_REDIS_HOST=redis
SPRING_REDIS_PORT=6379
SPRING_PROFILES_ACTIVE=prod

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# JWT
JWT_SECRET=<generate-long-random-secret>
JWT_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000

# Server
SERVER_PORT=8080
CLIENT_PORT=3000
```

### 3. Build Production Images

```bash
# Build with specific tags
docker-compose -f docker-compose.prod.yml build

# Push to registry (optional)
docker tag english-learning-app:latest your-registry/english-learning-app:latest
docker push your-registry/english-learning-app:latest
```

### 4. Run Production Stack

```bash
# Start services in background
docker-compose -f docker-compose.prod.yml up -d

# Verify all containers are running
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Nginx Reverse Proxy Configuration

### Install Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

### Configure as Reverse Proxy

Create `/etc/nginx/sites-available/english-learning-app`:

```nginx
upstream backend {
    server localhost:8080;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/english-learning-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Database Initialization

### First Time Setup

```bash
# Connect to PostgreSQL container
docker exec -it postgres_container psql -U postgres

# Create database
CREATE DATABASE english_learning_db;
\q
```

### Run Migrations

Migrations run automatically via Spring Boot on startup with:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

## Monitoring and Maintenance

### Check Application Health

```bash
# Health endpoint
curl https://yourdomain.com/api/health

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Backup Database

```bash
# Automatic daily backup script
#!/bin/bash
BACKUP_DIR="/backups/database"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

docker exec postgres_container pg_dump -U postgres english_learning_db | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Run migrations if needed
docker exec backend_container java -Dspring.jpa.hibernate.ddl-auto=migrate -jar app.jar
```

## Scaling and Performance

### Horizontal Scaling

Use Docker Swarm or Kubernetes for production scaling:

```yaml
# docker-compose.prod.yml with replicas
services:
  backend:
    deploy:
      replicas: 3
  frontend:
    deploy:
      replicas: 2
```

### Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "1"
          memory: 1G
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Restart service
docker-compose restart backend

# Rebuild
docker-compose build --no-cache backend
```

### Database Connection Failed

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check network
docker network ls
docker network inspect english-learning-app_default
```

### Performance Issues

```bash
# Monitor resource usage
docker stats

# Check database logs
docker-compose logs postgres

# View slow queries
docker exec postgres_container psql -U postgres -d english_learning_db -c "SELECT * FROM pg_stat_statements;"
```

## Rollback Procedure

```bash
# If deployment fails
git revert HEAD~1
docker-compose down
docker-compose build
docker-compose up -d

# Restore database if needed
psql english_learning_db < backup.sql
```

## Security Checklist

- [ ] Change default database password
- [ ] Enable HTTPS/SSL
- [ ] Set JWT secret to strong value
- [ ] Enable firewall rules
- [ ] Regular database backups
- [ ] Monitor application logs
- [ ] Keep Docker images updated
- [ ] Use environment variables for secrets
- [ ] Enable authentication on all endpoints
- [ ] Rate limiting enabled
