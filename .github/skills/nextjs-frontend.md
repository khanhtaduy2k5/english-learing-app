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
- Styling with Tailwind CSS (Dark Mode theme)
- Writing unit tests with Vitest and JSDOM
- Creating E2E tests with Playwright
- Managing client-side state with Zustand

## Key Directories

- `client/src/app/` - Next.js pages and layouts (App Router)
- `client/src/components/` - Reusable React components (Sidebar, Button, Input)
- `client/src/hooks/` - Custom React hooks (useAuth)
- `client/src/store/` - Zustand state management (authStore)
- `client/src/lib/` - Utilities and API client
- `client/__tests__/` - Centralized unit tests (Vitest)
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

- `/app/page.tsx` - Landing page (Dark Mode, Glassmorphism)
- `/app/dashboard/layout.tsx` - Dashboard layout with Sidebar
- `/app/dashboard/page.tsx` - User dashboard (stats, quick actions)
- `/app/login/page.tsx` - Login page
- `/app/register/page.tsx` - Registration page
- `/app/lessons/[id]/` - Lesson detail page

### Components

- `Sidebar.tsx` - Dashboard navigation sidebar (collapsible, Dark Mode)
- `Button.tsx` - Reusable button component
- `Input.tsx` - Reusable input component with label and error

### State Management

- `authStore.ts` - Authentication state (user, token, isAuthenticated)

### Authentication

- `hooks/useAuth.ts` - Custom hook wrapping authStore with `isReady` flag
- Dashboard layout handles auth redirect (no middleware needed)

### API Integration

- `lib/api.ts` - Axios-based API client with interceptors for auth tokens

## Design System

The app uses a **Dark Mode** design language:

- **Background**: `#030712` (near-black)
- **Accent Colors**: Indigo/Purple gradients
- **Glass Effects**: `bg-white/5`, `backdrop-blur-xl`, `border-white/10`
- **Typography**: Inter (Google Fonts)
- **Active States**: Gradient borders with glow effects

## Testing Guidelines

- **Unit Tests**: Located in `__tests__/` folder (centralized)
  - `__tests__/components/` - Component tests
  - `__tests__/hooks/` - Hook tests
  - `__tests__/lib/` - Utility and API tests
  - `__tests__/store/` - Store tests
- **E2E Tests**: Located in `e2e/` folder
- **Mocking**: Mock API calls and Zustand stores with Vitest `vi.mock()`

## ESLint Notes

- Escape special characters in JSX text: use `&apos;` for `'`, `&quot;` for `"`
- This avoids `react/no-unescaped-entities` build errors

## Related Docs

- `docs/SETUP.md` - Frontend setup instructions
- `docs/ARCHITECTURE.md` - Overall application architecture
- `docs/CONTRIBUTING.md` - Contribution guidelines
