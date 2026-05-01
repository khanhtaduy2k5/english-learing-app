# API Documentation

## Overview

The English Learning App REST API uses JSON for request/response bodies and JWT tokens for authentication. All endpoints (except auth endpoints) require a valid JWT token in the Authorization header.

## Base URL

- **Development**: `http://localhost:8080/api`
- **Production**: `https://api.example.com/api`

## Authentication

### JWT Token Header

```
Authorization: Bearer <jwt_token>
```

Include this header in all authenticated requests.

## Response Format

All responses follow this format:

### Success Response

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "status": "error",
  "error": "error_code",
  "message": "Human readable error message"
}
```

## Auth Endpoints

### Login

**POST** `/auth/login`

Log in with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Errors:**

- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing fields

### Register

**POST** `/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "2",
    "email": "newuser@example.com",
    "name": "Jane Doe"
  },
  "message": "User registered successfully"
}
```

**Errors:**

- `400 Bad Request`: Validation error or email already exists
- `422 Unprocessable Entity`: Invalid input

### Refresh Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Errors:**

- `401 Unauthorized`: Invalid or expired refresh token

## User Endpoints

### Get Current User

**GET** `/users/me`

Get the authenticated user's information.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

### Update User Profile

**PUT** `/users/me`

Update the authenticated user's profile.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "newemail@example.com"
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "1",
    "email": "newemail@example.com",
    "name": "John Smith"
  }
}
```

## Lesson Endpoints

### Get All Lessons

**GET** `/lessons`

Get a list of all available lessons with optional pagination and filtering.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `level` (optional): Filter by difficulty level (beginner, intermediate, advanced)

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "lessons": [
      {
        "id": "1",
        "title": "Greetings",
        "description": "Learn basic greetings",
        "category": "basics",
        "level": "beginner",
        "duration": 15,
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### Get Lesson by ID

**GET** `/lessons/{id}`

Get details of a specific lesson including quiz questions.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

- `id`: Lesson ID

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "1",
    "title": "Greetings",
    "description": "Learn basic greetings",
    "content": "...",
    "category": "basics",
    "level": "beginner",
    "quiz": [
      {
        "id": "q1",
        "question": "What do you say when meeting someone?",
        "options": ["Hello", "Goodbye", "Sorry"],
        "correctAnswer": 0
      }
    ]
  }
}
```

**Errors:**

- `404 Not Found`: Lesson not found

### Create Lesson (Admin)

**POST** `/lessons`

Create a new lesson. Requires admin role.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "title": "New Lesson",
  "description": "Lesson description",
  "content": "...",
  "category": "basics",
  "level": "beginner",
  "duration": 20
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "2",
    "title": "New Lesson",
    ...
  }
}
```

**Errors:**

- `403 Forbidden`: Insufficient permissions

### Update Lesson (Admin)

**PUT** `/lessons/{id}`

Update an existing lesson.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response (200):**

```json
{
  "status": "success",
  "data": { ... }
}
```

### Delete Lesson (Admin)

**DELETE** `/lessons/{id}`

Delete a lesson.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response (204):** No content

**Errors:**

- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Lesson not found

## Quiz Endpoints

### Submit Quiz Answer

**POST** `/lessons/{id}/quiz/submit`

Submit answers for a lesson's quiz.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "q1",
      "selectedOption": 0
    }
  ]
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "score": 80,
    "totalQuestions": 5,
    "correctAnswers": 4,
    "passed": true
  }
}
```

## Health Check Endpoint

### Health Status

**GET** `/health`

Check API and database health status.

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "apiStatus": "UP",
    "databaseStatus": "UP",
    "cacheStatus": "UP",
    "timestamp": "2024-01-01T10:00:00Z"
  }
}
```

## Error Codes

| Code                  | HTTP Status | Description                     |
| --------------------- | ----------- | ------------------------------- |
| `INVALID_CREDENTIALS` | 401         | Email or password is incorrect  |
| `UNAUTHORIZED`        | 401         | JWT token is missing or invalid |
| `TOKEN_EXPIRED`       | 401         | JWT token has expired           |
| `FORBIDDEN`           | 403         | User doesn't have permission    |
| `NOT_FOUND`           | 404         | Resource not found              |
| `VALIDATION_ERROR`    | 400         | Input validation failed         |
| `EMAIL_EXISTS`        | 409         | Email already registered        |
| `INTERNAL_ERROR`      | 500         | Server error                    |

## Rate Limiting

- **Auth endpoints**: 5 requests per minute per IP
- **Other endpoints**: 100 requests per minute per user
- **Health check**: No limit

## CORS

The API accepts requests from configured origins (frontend domain). Preflight requests are automatically handled.

## Pagination

Endpoints that return lists support pagination:

- `page`: Page number (starting from 1)
- `limit`: Items per page (max 100)

Example: `GET /lessons?page=2&limit=20`
