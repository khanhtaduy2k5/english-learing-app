---
name: java-backend
description: Develop, test, and debug the Spring Boot backend for the English Learning App
skills:
  - Spring Boot development
  - Java REST API development
  - Maven build automation
  - JUnit and integration testing
  - Application YAML configuration
applyTo:
  - server/**
---

# Java Backend Skill

This skill provides expertise for working with the Spring Boot backend of the English Learning App.

## Core Responsibilities

- Building and running Spring Boot applications
- Creating and maintaining REST APIs for lesson management, authentication, and health endpoints
- Writing unit and integration tests using JUnit
- Managing dependencies with Maven (pom.xml)
- Configuring application properties in `application.yaml`

## Key Directories

- `server/src/main/java/com/example/` - Application source code
- `server/src/test/java/com/example/` - Test classes
- `server/src/main/resources/` - Configuration and templates
- `server/target/` - Build output and compiled JAR

## Common Tasks

### Building the Application

```bash
cd server
./mvnw clean package
```

### Running the Application

```bash
cd server
./mvnw spring-boot:run
```

### Running Tests

```bash
cd server
./mvnw test
```

## Project Structure

- **AuthService** - Handles authentication logic
- **HealthService** - Provides health check endpoints
- **Lesson Controllers** - REST endpoints for lesson operations
- **Application.yaml** - Server configuration (port, database, etc.)

## Best Practices

1. Follow RESTful conventions for API endpoints
2. Include comprehensive unit tests for business logic
3. Use Spring Boot actuators for health checks
4. Maintain separation of concerns (controllers, services, repositories)
5. Document API endpoints in API.md

## Related Docs

- `docs/API.md` - API specification
- `server/HELP.md` - Maven help and troubleshooting
- `docs/DATABASE.md` - Database schema and design
