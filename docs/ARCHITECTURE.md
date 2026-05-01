# Architecture

## Overview

English Learning App is a full-stack web application built with a modern architecture:

- **Frontend**: Next.js 14+ with React, TypeScript, Tailwind CSS
- **Backend**: Spring Boot 4.0+ with Java 21, Spring Security, JPA
- **Database**: PostgreSQL (primary), Redis (caching/sessions)
- **Deployment**: Docker & Docker Compose

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Next.js)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Browser (React UI)               │  │
│  │  • Pages: Login, Register, Dashboard, Lessons    │  │
│  │  • Components: Button, Input, Card, Alert        │  │
│  │  • State Management: Zustand Stores              │  │
│  │  • Hooks: useAuth for authentication             │  │
│  └───────────────────────────────────────────────────┘  │
│                           ↓                              │
│               ┌──────────────────────┐                   │
│               │   API Client (Axios) │                   │
│               │  + JWT Interceptor   │                   │
│               └──────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│              Backend (Spring Boot)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │          REST API Controllers                     │  │
│  │  • Auth Controller: Login, Register, Refresh     │  │
│  │  • Lesson Controller: Get, Create, Update        │  │
│  │  • User Controller: Profile, Settings            │  │
│  │  • Health Controller: System Status              │  │
│  └───────────────────────────────────────────────────┘  │
│                           ↓                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Service Layer (Business Logic)            │  │
│  │  • AuthService: JWT generation, validation       │  │
│  │  • LessonService: Lesson management               │  │
│  │  • UserService: User operations                   │  │
│  │  • EmailService: Notifications                    │  │
│  └───────────────────────────────────────────────────┘  │
│                           ↓                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │       Repository Layer (Data Access)              │  │
│  │  • JPA Repositories for ORM                       │  │
│  │  • Redis for caching/sessions                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴──────────────────┐
        ↓                                     ↓
   PostgreSQL                            Redis
   (Primary DB)                         (Cache/Sessions)
```

## Frontend Architecture

### Directory Structure

```
client/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout wrapper
│   ├── page.tsx           # Home page
│   ├── login/             # Authentication
│   ├── register/          # User registration
│   ├── dashboard/         # Protected dashboard
│   └── lessons/[id]/      # Dynamic lesson routes
│
├── components/            # Reusable UI components
│   ├── Button.tsx        # Button component
│   ├── Input.tsx         # Input component
│   ├── Card.tsx          # Card wrapper
│   └── Alert.tsx         # Alert/notification
│
├── hooks/                 # Custom React hooks
│   └── useAuth.ts        # Authentication state & logic
│
├── lib/                   # Utilities & helpers
│   ├── api.ts            # Axios configuration
│   └── utils.ts          # Helper functions
│
├── store/                 # Zustand state stores
│   ├── authStore.ts      # Authentication state
│   ├── lessonStore.ts    # Lessons state
│   └── uiStore.ts        # UI state
│
├── types/                 # TypeScript definitions
│   └── index.ts          # Type definitions
│
├── middleware.ts          # Next.js middleware (route protection)
└── styles/               # Global styles
    └── globals.css
```

### State Management

- **Zustand Stores**: Lightweight state management
  - `authStore`: User authentication, tokens, user info
  - `lessonStore`: Lessons, progress, quiz states
  - `uiStore`: UI theme, notifications, modals

### Authentication Flow

1. User enters credentials on login page
2. `AuthService` sends credentials to backend API
3. Backend validates and returns JWT token
4. Token stored in localStorage via `authStore`
5. Axios interceptor adds token to all requests
6. `middleware.ts` protects routes - redirects to login if unauthorized
7. Token refresh on 401 response

## Backend Architecture

### Directory Structure

```
server/src/main/java/com/example/english_learning_app/
├── auth/                 # Authentication module
│   ├── AuthController
│   ├── AuthService
│   ├── JwtProvider
│   └── SecurityConfig
│
├── user/                 # User management module
│   ├── UserController
│   ├── UserService
│   ├── UserRepository
│   └── User entity
│
├── lesson/               # Lesson management module
│   ├── LessonController
│   ├── LessonService
│   ├── LessonRepository
│   └── Lesson entity
│
├── health/               # Health check module
│   └── HealthController
│
├── config/               # Configuration classes
│   ├── SecurityConfig
│   └── CorsConfig
│
├── web/                  # Web configuration
│   └── CorsConfiguration
│
└── EnglishLearningAppApplication.java  # Main application
```

### Core Modules

#### Authentication Module

- **JwtProvider**: JWT token generation and validation
- **SecurityConfig**: Spring Security configuration
- **AuthController**: Login, register, token refresh endpoints
- **AuthService**: Business logic for authentication

#### User Module

- **User Entity**: User information and authentication details
- **UserRepository**: JPA repository for database operations
- **UserService**: User management logic
- **UserController**: User-related endpoints

#### Lesson Module

- **Lesson Entity**: Lesson content and metadata
- **Quiz**: Quiz questions and answers
- **LessonRepository**: Database operations
- **LessonService**: Lesson management logic
- **LessonController**: Lesson-related endpoints

## Data Flow

### Login Flow

```
1. Client: POST /api/auth/login (credentials)
2. Backend: Validate credentials
3. Backend: Generate JWT token
4. Backend: Return token + user info
5. Client: Store token in localStorage
6. Client: Add token to all subsequent requests
```

### Lesson Access Flow

```
1. Client: GET /api/lessons/{id} (with JWT in header)
2. Backend: Validate JWT token
3. Backend: Fetch lesson from database
4. Backend: Cache lesson in Redis
5. Backend: Return lesson data
6. Client: Update lessonStore
7. Client: Render lesson UI
```

## External Services

- **Email Service**: Spring Mail for notifications
- **Cache**: Redis for session storage and caching
- **Database**: PostgreSQL for persistent data

## Deployment Architecture

```
Docker Container (Client)
├── Node.js
├── Next.js App
└── Nginx (reverse proxy)

Docker Container (Server)
├── Java Runtime
└── Spring Boot App

Docker Container (PostgreSQL)
└── Database

Docker Container (Redis)
└── Cache Layer

Docker Compose
└── Orchestrates all containers with networking
```

## Security Considerations

- **JWT Authentication**: Stateless token-based auth
- **Spring Security**: Framework-level security
- **CORS**: Configured for frontend domain
- **Password Hashing**: BCrypt for password encryption
- **HTTPS**: Recommended for production
- **Token Expiration**: Automatic logout on token expiration
- **Middleware Protection**: Client-side route protection
