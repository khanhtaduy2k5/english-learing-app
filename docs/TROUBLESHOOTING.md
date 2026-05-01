# Troubleshooting Guide

## Common Issues and Solutions

### Frontend Issues

#### Build Errors

##### Error: "Cannot find module"

**Problem:** Module not found during build

```
Module not found: Can't resolve './component'
```

**Solutions:**

1. Check file exists and path is correct
2. Verify file extension (.tsx, .ts, .jsx, .js)
3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
4. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

##### Error: "TypeScript errors"

**Problem:** TypeScript compilation fails

```
Type 'X' is not assignable to type 'Y'
```

**Solutions:**

1. Run type checking:
   ```bash
   npm run type-check
   ```
2. Check tsconfig.json settings
3. Verify imports and exports
4. Use `unknown` instead of `any` for type safety

#### Runtime Errors

##### "Cannot read property 'X' of undefined"

**Problem:** Accessing property on undefined/null object

**Solutions:**

1. Add null/undefined checks:
   ```typescript
   if (user?.email) {
     console.log(user.email);
   }
   ```
2. Use optional chaining:
   ```typescript
   const email = user?.profile?.email;
   ```
3. Use nullish coalescing:
   ```typescript
   const value = data?.field ?? defaultValue;
   ```

##### White Page / No Content

**Problem:** Page loads but shows nothing

**Solutions:**

1. Check browser console for errors (F12)
2. Check Network tab for failed requests
3. Verify API endpoint in `.env.local`
4. Check if API is running: `curl http://localhost:8080/api/health`
5. Clear browser cache and reload

##### API Requests Fail

**Problem:** 404 or CORS errors when calling API

**Solutions:**

1. Verify API URL in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```
2. Ensure backend is running:
   ```bash
   docker-compose ps
   ```
3. Check CORS configuration in backend
4. Verify token is being sent in headers
5. Check browser Network tab for actual request

#### Authentication Issues

##### "401 Unauthorized"

**Problem:** Authentication token invalid or missing

**Solutions:**

1. Clear localStorage and re-login:
   ```javascript
   localStorage.clear();
   // Reload page
   ```
2. Check token expiration:
   ```javascript
   const token = localStorage.getItem("token");
   console.log(token);
   ```
3. Verify backend JWT secret matches
4. Check token refresh endpoint works

##### Infinite Login Loop

**Problem:** User redirected to login even after login

**Solutions:**

1. Check `middleware.ts` configuration
2. Verify token is stored correctly:
   ```javascript
   console.log(localStorage.getItem("token"));
   ```
3. Check browser cookies are enabled
4. Clear browser cache and cookies
5. Verify token format is correct

#### State Management Issues

##### Store Not Updating

**Problem:** Zustand store state doesn't update UI

**Solutions:**

1. Verify store actions modify state correctly:

   ```typescript
   // Correct: Create new object
   setUser({ ...state.user, name: newName });

   // Wrong: Mutating directly
   state.user.name = newName;
   ```

2. Use React DevTools to inspect store state
3. Check component subscribes to correct store
4. Verify component re-renders after state change

### Backend Issues

#### Build Errors

##### "Cannot resolve symbol"

**Problem:** IntelliJ or compiler can't find class/method

**Solutions:**

1. Rebuild project:
   ```bash
   mvn clean compile
   ```
2. Invalidate IDE cache:
   - IntelliJ: File → Invalidate Caches → Restart
3. Update Maven dependencies:
   ```bash
   mvn dependency:resolve
   ```

##### Maven Build Fails

**Problem:** `mvn clean build` fails

**Solutions:**

1. Check Java version (requires Java 21):
   ```bash
   java -version
   ```
2. Update Maven:
   ```bash
   mvn -v
   ```
3. Clear local repository:
   ```bash
   rm -rf ~/.m2/repository
   ```
4. Check internet connection for downloading dependencies

#### Runtime Errors

##### Database Connection Refused

**Problem:** Cannot connect to PostgreSQL

```
java.net.ConnectException: Connection refused
```

**Solutions:**

1. Verify PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```
2. Check connection string in `application.yaml`:
   ```yaml
   datasource:
     url: jdbc:postgresql://localhost:5432/english_learning_db
   ```
3. Verify database exists:
   ```bash
   docker exec postgres_container psql -U postgres -l
   ```
4. Check port 5432 is not blocked:
   ```bash
   sudo netstat -tlnp | grep 5432
   ```

##### "No qualifying bean of type found"

**Problem:** Spring can't autowire dependency

```
No qualifying bean of type 'UserService' available
```

**Solutions:**

1. Verify class has @Service or @Component annotation:
   ```java
   @Service
   public class UserService { }
   ```
2. Verify component is in correct package (sub-package of main app)
3. Check for typos in @Autowired field name
4. Verify interface/class exists

##### JPA EntityNotFoundException

**Problem:** Entity not found in database

```
EntityNotFoundException: Unable to find User with id 1
```

**Solutions:**

1. Verify entity exists before querying:
   ```java
   Optional<User> user = userRepository.findById(id);
   if (user.isPresent()) { ... }
   ```
2. Check transaction is active
3. Verify table and columns exist:
   ```bash
   docker exec postgres_container psql -U postgres -d english_learning_db -c "\d users"
   ```

#### Performance Issues

##### Slow API Responses

**Problem:** Endpoints take too long to respond

**Solutions:**

1. Check database query performance:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM lessons WHERE category = 'basics';
   ```
2. Add missing indexes:
   ```sql
   CREATE INDEX idx_lessons_category ON lessons(category);
   ```
3. Enable Spring Boot actuator metrics:
   ```yaml
   management:
     endpoints:
       web:
         exposure:
           include: metrics
   ```
4. Profile with Spring Boot profiler
5. Cache frequently accessed data in Redis

##### Out of Memory Error

**Problem:** `java.lang.OutOfMemoryError`

**Solutions:**

1. Increase heap size:
   ```bash
   java -Xmx2048m -Xms1024m -jar app.jar
   ```
2. Check for memory leaks
3. Optimize database queries
4. Limit connection pool size
5. Use pagination for large result sets

#### Authentication Issues

##### JWT Token Validation Fails

**Problem:** "Invalid token" error

**Solutions:**

1. Verify JWT_SECRET is same on backend:
   ```bash
   echo $JWT_SECRET
   ```
2. Check token hasn't expired
3. Verify token format in header:
   ```
   Authorization: Bearer <token>
   ```
4. Ensure JwtProvider uses correct algorithm

##### CORS Error

**Problem:** "No 'Access-Control-Allow-Origin' header"

**Solutions:**

1. Verify CORS configuration in SecurityConfig:
   ```java
   http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
   ```
2. Check allowed origins match frontend URL
3. Verify preflight requests are handled (OPTIONS method)
4. Check browser console for actual error

### Docker Issues

#### Container Won't Start

**Problem:** Docker container exits immediately

**Solutions:**

1. Check logs:
   ```bash
   docker logs container_name
   ```
2. Verify image built correctly:
   ```bash
   docker images
   ```
3. Check Docker environment:
   ```bash
   docker info
   ```
4. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

#### Port Already in Use

**Problem:** "Bind for 0.0.0.0:8080 failed: port is already allocated"

**Solutions:**

1. Find process using port:

   ```bash
   # Linux/Mac
   lsof -i :8080

   # Windows
   netstat -ano | findstr :8080
   ```

2. Kill process:
   ```bash
   kill -9 <PID>
   ```
3. Or use different port in docker-compose.yml:
   ```yaml
   ports:
     - "8081:8080"
   ```

#### Network Issues

**Problem:** Containers can't communicate

**Solutions:**

1. Check network exists:
   ```bash
   docker network ls
   ```
2. Inspect network:
   ```bash
   docker network inspect english-learning-app_default
   ```
3. Verify service names match in docker-compose.yml
4. Check firewall rules

### Database Issues

#### Migrations Not Applied

**Problem:** Database schema missing tables

**Solutions:**

1. Check Flyway/Liquibase migration files exist
2. Verify migrations are in correct directory
3. Check Spring Boot startup logs for errors
4. Manually run migrations:
   ```bash
   mvn flyway:migrate
   ```

#### Data Inconsistency

**Problem:** Data is corrupted or inconsistent

**Solutions:**

1. Run integrity checks:
   ```sql
   SELECT * FROM users WHERE email IS NULL;
   ```
2. Restore from backup if needed:
   ```bash
   psql database < backup.sql
   ```
3. Use transactions for multi-step operations
4. Add database constraints to prevent invalid data

### Development Tools

#### Vitest Tests Fail

**Problem:** "Cannot find module" in tests

**Solutions:**

1. Check vitest.config.ts is correct
2. Verify test file paths
3. Clear vitest cache:
   ```bash
   npm run test -- --clearCache
   ```
4. Check jsdom configuration

#### IDE Issues

**Problem:** IDE shows errors but code works

**Solutions:**

1. Invalidate cache:
   - VSCode: Restart
   - IntelliJ: File → Invalidate Caches → Restart
2. Close and reopen project
3. Reload TypeScript service (VSCode):
   - Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

## Getting More Help

If the above solutions don't work:

1. **Check Logs**

   ```bash
   # Frontend
   npm run dev  # Check console output

   # Backend
   docker-compose logs backend
   ```

2. **Search Issues**
   - Check GitHub Issues for similar problems
   - Google the error message

3. **Ask for Help**
   - Open new GitHub Issue with:
     - Error message (full output)
     - Steps to reproduce
     - Environment info (OS, Node version, Java version)
     - Screenshots/logs attached

4. **Debug Mode**

   ```bash
   # Frontend debug
   DEBUG=* npm run dev

   # Backend debug - attach debugger on port 5005
   mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005"
   ```
