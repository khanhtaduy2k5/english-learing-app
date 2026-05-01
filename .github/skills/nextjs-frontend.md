---
name: nextjs-frontend
description: Build and maintain the Next.js/React frontend for the English Learning App
skills:
  - Next.js application development
  - TypeScript/React components
  - Tailwind CSS styling
  - Vitest unit testing
  - E2E testing with Playwright
  - Client-side state management (Zustand)
applyTo:
  - client/**
---

# Next.js Frontend Skill

This skill provides expertise for developing the Next.js frontend of the English Learning App.

## Core Responsibilities

- Building React components with TypeScript
- Implementing routing with Next.js App Router
- Styling with Tailwind CSS
- Writing unit tests with Vitest and JSDOM
- Creating E2E tests with Playwright
- Managing client-side state with Zustand

## Key Directories

- `client/src/app/` - Next.js pages and layouts (App Router)
- `client/src/components/` - Reusable React components
- `client/src/hooks/` - Custom React hooks (useAuth, etc.)
- `client/src/store/` - Zustand state management
- `client/src/lib/` - Utilities and API client
- `client/e2e/` - Playwright E2E tests

## Common Tasks

### Starting Development Server

```bash
cd client
npm run dev
```

### Running Tests

```bash
cd client
npm run test        # Unit tests (Vitest)
npm run test:e2e    # E2E tests (Playwright)
```

### Building for Production

```bash
cd client
npm run build
npm run start
```

## Project Structure

### Pages

- `/app/page.tsx` - Home page
- `/app/dashboard/page.tsx` - User dashboard
- `/app/login/page.tsx` - Login page
- `/app/register/page.tsx` - Registration page
- `/app/lessons/[id]/` - Lesson detail page

### Components

- `Button.tsx`, `Input.tsx`, `Card.tsx`, `Alert.tsx` - UI components
- `Button.test.tsx`, `Input.test.tsx` - Component tests

### State Management

- `authStore.ts` - Authentication state (Zustand)
- `lessonStore.ts` - Lesson data state
- `uiStore.ts` - UI state (modals, notifications)

### Authentication

- `middleware.ts` - Next.js middleware for protected routes
- `hooks/useAuth.ts` - Custom hook for auth logic

### API Integration

- `lib/api.ts` - Client for communicating with backend
- `API_SCHEMA.proto` - Protocol Buffer definitions

## Best Practices

1. Use TypeScript for type safety
2. Compose components for reusability
3. Keep state management minimal with Zustand
4. Test components and hooks thoroughly
5. Use Tailwind CSS utilities for styling (avoid custom CSS when possible)
6. Write E2E tests for critical user flows
7. Leverage Next.js middleware for authentication

## Testing Guidelines

- **Unit Tests**: Test individual components and hooks
- **E2E Tests**: Test complete user journeys (login → lesson interaction)
- **Mocking**: Mock API calls and external services

## Related Docs

- `client/SETUP.md` - Frontend setup instructions
- `docs/ARCHITECTURE.md` - Overall application architecture
- `docs/CONTRIBUTING.md` - Contribution guidelines
