# Database Documentation

## Overview

The application uses PostgreSQL as the primary database and Redis for caching/session storage.

## Database Schema

### Users Table

Stores user account information.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

**Fields:**

- `id`: Unique user identifier
- `email`: User email (unique, used for login)
- `password`: Hashed password (BCrypt)
- `name`: User's full name
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp
- `is_active`: Account activation status

### Lessons Table

Stores lesson content and metadata.

```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR(100),
  level VARCHAR(50),
  duration INTEGER,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Unique lesson identifier
- `title`: Lesson title
- `description`: Short description
- `content`: Full lesson content
- `category`: Lesson category (e.g., "basics", "vocabulary")
- `level`: Difficulty level (beginner, intermediate, advanced)
- `duration`: Estimated duration in minutes
- `created_by`: Reference to user who created the lesson
- `created_at`: Lesson creation timestamp
- `updated_at`: Last update timestamp

### Quiz Questions Table

Stores quiz questions for lessons.

```sql
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Unique question identifier
- `lesson_id`: Reference to parent lesson
- `question`: Question text
- `question_number`: Order of question in quiz
- `created_at`: Question creation timestamp

### Quiz Options Table

Stores answer options for quiz questions.

```sql
CREATE TABLE quiz_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text VARCHAR(255) NOT NULL,
  option_number INTEGER,
  is_correct BOOLEAN DEFAULT false
);
```

**Fields:**

- `id`: Unique option identifier
- `question_id`: Reference to parent question
- `option_text`: Option text
- `option_number`: Order of option
- `is_correct`: Whether this is the correct answer

### User Progress Table

Tracks user progress through lessons and quizzes.

```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  status VARCHAR(50),
  quiz_score INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

**Fields:**

- `id`: Unique progress record identifier
- `user_id`: Reference to user
- `lesson_id`: Reference to lesson
- `status`: Progress status (not_started, in_progress, completed)
- `quiz_score`: Quiz score (0-100)
- `completed_at`: Completion timestamp
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

## Indexes

For optimal query performance, the following indexes are recommended:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_level ON lessons(level);
CREATE INDEX idx_quiz_questions_lesson_id ON quiz_questions(lesson_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
```

## Redis Schema

### Session Storage

Session data is stored with key pattern: `session:{session_id}`

```
session:abc123def456 {
  userId: 1,
  email: "user@example.com",
  token: "jwt_token",
  expiresAt: timestamp
}
```

### Cache Keys

Lesson data cache pattern: `lesson:{lesson_id}`

```
lesson:1 {
  id: 1,
  title: "Greetings",
  description: "Learn basic greetings",
  ...
}
```

User cache pattern: `user:{user_id}`

## Connection Pool Configuration

### PostgreSQL

**Environment Variables:**

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/english_learning_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

**Pool Settings** (in `application.yaml`):

```yaml
spring:
  datasource:
    hikari:
      maximumPoolSize: 20
      minimumIdle: 5
      connectionTimeout: 30000
      idleTimeout: 600000
      maxLifetime: 1800000
```

### Redis

**Environment Variables:**

```
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379
SPRING_REDIS_PASSWORD=
```

## Data Lifecycle

### User Registration

1. New user data inserted into `users` table
2. Password hashed with BCrypt
3. `is_active` set to true
4. Email verification (optional)

### Lesson Completion

1. User progresses through lesson
2. Quiz answers tracked
3. Score calculated
4. `user_progress` record updated with completion status
5. Achievement unlocked (optional)

### Data Cleanup

Redis sessions expire automatically based on TTL (Time To Live).

Old progress records can be archived:

```sql
-- Archive progress older than 1 year
INSERT INTO user_progress_archive
SELECT * FROM user_progress WHERE updated_at < NOW() - INTERVAL '1 year';
```

## Backup and Recovery

### PostgreSQL Backup

```bash
# Full backup
pg_dump english_learning_db > backup.sql

# Restore
psql english_learning_db < backup.sql
```

### Docker Backup

```bash
# Backup PostgreSQL container
docker exec postgres_container pg_dump -U postgres english_learning_db > backup.sql

# Backup Redis container
docker exec redis_container redis-cli SAVE
docker cp redis_container:/data/dump.rdb ./dump.rdb
```

## Performance Tips

1. **Use Connection Pooling**: Keep database connections pooled (HikariCP)
2. **Cache Frequently Accessed Data**: Store lessons and user profiles in Redis
3. **Index Important Columns**: Email, category, level, and foreign keys
4. **Batch Operations**: Insert multiple records in single transaction when possible
5. **Monitor Query Performance**: Use `EXPLAIN ANALYZE` for slow queries
6. **Clean Up Old Data**: Archive or delete old progress records periodically

## Migration Strategy

Use Flyway or Liquibase for database migrations:

```
db/migration/
├── V1__Initial_schema.sql
├── V2__Add_quiz_tables.sql
└── V3__Add_user_progress.sql
```

Run migrations automatically on application startup via Spring Boot configuration.

## Troubleshooting

### Connection Refused

- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check connection string in `application.yaml`
- Verify firewall rules

### Slow Queries

- Check indexes with `EXPLAIN ANALYZE`
- Look for missing indexes on frequently filtered columns
- Consider query optimization or caching

### Data Integrity Issues

- Enable foreign key constraints
- Validate before INSERT/UPDATE operations
- Use transactions for multi-step operations
