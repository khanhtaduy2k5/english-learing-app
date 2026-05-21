---
name: java-backend
description: Develop, test, and secure the Spring Boot backend with strict TDD and OWASP security testing
skills:
  - Spring Boot 4.x development
  - Java 21 REST API development
  - Test-Driven Development (JUnit 5, Mockito, MockMvc)
  - OWASP Top 10 security testing
  - JPA/Hibernate with PostgreSQL
  - Maven build automation
applyTo:
  - server/**
---

# Java Backend Skill

## ⚠️ MANDATORY RULES — Read Before Any Work

### Rule 1: TEST FIRST (TDD — Non-Negotiable)

**You MUST write tests BEFORE writing any implementation code.** No exceptions.

**TDD Workflow:**
1. 🔴 **RED** — Write failing tests for the new feature
2. 🟢 **GREEN** — Write the minimum code to make tests pass
3. 🔵 **REFACTOR** — Clean up while keeping all tests green
4. ✅ **VERIFY** — Run `.\mvnw test` and confirm ALL tests pass

**What to test for each new feature:**

| Layer | Test Type | Annotation | What to Test |
|-------|-----------|------------|-------------|
| Service | Unit test | `@ExtendWith(MockitoExtension.class)` | Business logic, edge cases, exceptions |
| Controller | Integration test | `@WebMvcTest(XxxController.class)` | HTTP status codes, request/response, validation |
| Repository | Data test | `@DataJpaTest` | Custom queries, constraints |
| DTO/Entity | Unit test | (none) | Validation constraints, constructors, equals/hashCode |

**Test file location convention:**
```
server/src/test/java/com/example/english_learning_app/
├── {module}/
│   ├── {Module}ServiceTest.java        # Unit tests (Mockito)
│   ├── {Module}ControllerTest.java     # MockMvc integration tests
│   ├── {Module}RepositoryTest.java     # @DataJpaTest (if custom queries)
│   └── {Module}Test.java              # Entity/DTO validation tests
└── security/
    ├── A01_BrokenAccessControlTest.java
    ├── A02_CryptographicFailuresTest.java
    ├── ... (all OWASP Top 10)
    └── A10_ServerSideRequestForgeryTest.java
```

**Test naming convention:**
```java
@Test
void shouldReturnUser_whenValidId() { ... }

@Test
void shouldThrowNotFound_whenInvalidId() { ... }

@Test
void shouldRejectRequest_whenEmailIsBlank() { ... }
```

**Minimum test coverage per feature:**
- Every service method: happy path + error path + edge cases
- Every controller endpoint: 200/201 + 400 + 404 + 409 (as applicable)
- Every validation constraint: valid + invalid input
- Every security rule: authorized + unauthorized access

### Rule 2: OWASP Top 10 Security Testing

**When adding features that touch auth, user data, or API endpoints, you MUST write security tests covering applicable OWASP categories.**

Place all security tests in `server/src/test/java/com/example/english_learning_app/security/`.

#### A01 — Broken Access Control
```
- Users CANNOT access other users' resources
- Protected endpoints return 401 without auth token
- Non-admin users CANNOT access admin endpoints
- HTTP methods not allowed return 405
```

#### A02 — Cryptographic Failures
```
- Passwords are hashed (bcrypt), NEVER plaintext
- API responses NEVER contain password or secret fields
- Tokens have sufficient entropy (≥ 32 chars)
```

#### A03 — Injection
```
- SQL injection payloads in input fields → rejected or safely handled
- SQL injection in path variables → no data leak
- XSS payloads in user input → escaped or rejected
- All queries use parameterized statements (JPA handles this)
```

#### A04 — Insecure Design
```
- Rate limiting on login/register (after N failures → 429)
- Duplicate email → 409 Conflict
- Extremely long input (>255 chars) → 400 Bad Request
- Login errors do NOT reveal whether email exists
```

#### A05 — Security Misconfiguration
```
- Error responses do NOT contain stack traces or package names
- Security headers present (X-Content-Type-Options, X-Frame-Options)
- Swagger UI disabled on production profile
- Default credentials (admin/admin) do NOT work
```

#### A06 — Vulnerable Components
```
- No dependencies with known CRITICAL CVEs
- Run: .\mvnw org.owasp:dependency-check-maven:check
```

#### A07 — Authentication Failures
```
- Weak passwords rejected (< 8 chars, no uppercase/number)
- Expired tokens return 401
- Tampered tokens return 401
- Logged-out tokens are invalidated
```

#### A08 — Data Integrity Failures
```
- Unknown JSON fields are ignored (no mass assignment)
- Users cannot set their own ID or role via API
- Malformed JSON returns 400
- Duplicate creates return 409 (idempotency)
```

#### A09 — Logging & Monitoring
```
- Failed login attempts are logged with IP/timestamp
- Sensitive data (passwords, tokens) NEVER in logs
- Data modifications (create/update/delete) are audit-logged
```

#### A10 — SSRF
```
- URL inputs reject localhost, internal IPs, cloud metadata
- Only http:// and https:// protocols allowed
- file://, ftp://, gopher:// rejected
```

---

## Project Structure

```
server/src/main/java/com/example/english_learning_app/
├── EnglishLearningAppApplication.java
├── auth/          # POST /api/auth/login, /register, /logout
├── config/        # SecurityConfig, WebConfig, OpenApiConfig
├── health/        # GET /api/health
├── lesson/        # GET /api/lessons, /{id}, /{id}/quiz
├── user/          # CRUD /api/users
└── web/           # RootController
```

## Key Technical Details

| Item | Detail |
|------|--------|
| Database | PostgreSQL (Supabase) via Session Pooler |
| Test DB | H2 in-memory (auto via spring-boot-starter-test) |
| Auth | Currently demo token — needs JWT implementation |
| Validation | Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`) |
| API Docs | SpringDoc OpenAPI at `/swagger-ui.html` |

## Commands

```bash
# Run tests (ALWAYS run this first)
.\mvnw test

# Run with security scan
.\mvnw test org.owasp:dependency-check-maven:check

# Run application
.\mvnw spring-boot:run

# Build
.\mvnw clean package
```

## Known Security Issues (Must Fix)

| Issue | File | Severity |
|-------|------|----------|
| CSRF disabled | `SecurityConfig.java` | 🔴 Critical |
| `anyRequest().permitAll()` | `SecurityConfig.java` | 🔴 Critical |
| Hardcoded `demo-token` | `AuthService.java` | 🔴 Critical |
| No password verification | `AuthService.java` | 🔴 Critical |
| CORS wildcard `*` | `WebConfig.java` | 🟡 High |
| No `@Valid` on AuthController | `AuthController.java` | 🟡 High |
| No rate limiting | All endpoints | 🟡 High |
| No audit logging | All services | 🟠 Medium |

## Code Style

- Constructor injection (no `@Autowired` on fields)
- Records for DTOs and request/response objects
- `ResponseStatusException` for HTTP error responses
- `@Transactional(readOnly = true)` on read-only service methods
- Swagger `@Operation` + `@ApiResponse` annotations on every endpoint
