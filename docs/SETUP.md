# English Learning App - Frontend Setup Guide

## 📋 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn installed

### Installation Steps

1. **Navigate to the frontend directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env.local
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── dashboard/           # Dashboard (protected)
│   └── lessons/
│       └── [id]/            # Dynamic lesson route
│           ├── page.tsx     # Lesson view
│           └── quiz/        # Quiz page
│
├── components/              # Reusable UI Components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Alert.tsx
│
├── lib/                      # Utilities
│   ├── api.ts              # Axios API client
│   └── utils.ts            # Helper functions
│
├── hooks/                    # Custom React Hooks
│   └── useAuth.ts          # Authentication hook
│
├── store/                    # Zustand State Management
│   ├── authStore.ts        # Auth state
│   ├── lessonStore.ts      # Lessons state
│   └── uiStore.ts          # UI state
│
├── types/                    # TypeScript Definitions
│   └── index.ts
│
└── styles/                   # Global Styles
    └── globals.css
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript

## 🔐 Authentication

The app uses JWT tokens for authentication:

- Tokens are stored in localStorage
- Tokens are automatically added to API requests via axios interceptor
- Protected routes redirect to login if not authenticated
- API middleware (`src/middleware.ts`) handles route protection

### Key Features:

- Login page with email/password
- Registration with form validation
- Automatic logout on token expiration (401 response)
