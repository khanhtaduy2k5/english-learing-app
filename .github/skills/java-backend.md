---
name: java-backend
description: Develop, test, and debug the Spring Boot backend for the English Learning App
skills:
  - Spring Boot development
  - Java REST API development
  - Maven build automation
  - JUnit and Mockito testing
  - JPA/Hibernate with PostgreSQL
  - Application YAML configuration
applyTo:
  - server/**
---

# Java Backend Skill

This skill provides expertise for working with the Spring Boot backend of the English Learning App.

## Core Responsibilities

- Building and running Spring Boot applications
- Creating and maintaining REST APIs for lesson management, authentication, and health endpoints
- Writing unit tests using JUnit and Mockito
- Managing dependencies with Maven (pom.xml)
- Configuring application properties in `application.yaml`
- Managing database connections to Supabase PostgreSQL

## Key Directories

- `server/src/main/java/com/example/` - Application source code
  - `auth/` - AuthController, AuthService (login, register, logout)
  - `user/` - User entity, UserRepository, UserService, UserController
  - `health/` - Health check endpoint
  - `lesson/` - Lesson management
  - `config/` - Application configuration
- `server/src/test/java/com/example/` - Test classes
- `server/src/main/resources/` - Configuration (application.yaml)
- `server/.env` - Supabase database credentials (not committed)

## Common Tasks

### Building the Application

```bash
cd server
.\mvnw clean package
```

### Running the Application

```bash
cd server
.\mvnw spring-boot:run
# Reads .env automatically via spring.config.import
```

### Running Tests

```bash
cd server
.\mvnw test
```

## Project Structure

- **AuthService** - Handles authentication (uses UserRepository to persist to Supabase)
- **UserService** - CRUD operations for users
- **HealthService** - Provides health check endpoints
- **Application.yaml** - Server configuration (datasource, JPA, Swagger)

## Database Configuration

The backend connects to **Supabase PostgreSQL** via Session Pooler:

```yaml
spring:
  config:
    import: optional:file:.env[.properties]
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: update
```

## Testing Patterns

- **Service Tests**: Use Mockito to mock repositories
- **Entity Tests**: Test constructors, setters, `@PrePersist` methods
- **Controller DTO Tests**: Test record field accessors
- All tests are pure unit tests (no Spring context loading needed)

## Best Practices

1. Follow RESTful conventions for API endpoints
2. Include comprehensive unit tests for business logic
3. Use Mockito for mocking dependencies in tests
4. Maintain separation of concerns (controllers, services, repositories)
5. Document API endpoints in API.md
6. Never commit `.env` files with real credentials

## Related Docs

- `docs/API.md` - API specification
- `docs/DATABASE.md` - Database schema and design
- `docs/TROUBLESHOOTING.md` - Common issues
