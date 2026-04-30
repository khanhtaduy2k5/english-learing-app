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
- Auth state persisted with Zustand

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Components**: Pre-built UI components in `src/components/`
- **Customization**: Edit `tailwind.config.ts` for theme changes

## 🔌 API Integration

The API client is configured in `src/lib/api.ts`:

```typescript
// Example usage
const data = await apiClient.get("/api/lessons");
const response = await apiClient.post("/api/auth/login", { email, password });
```

**Environment Variable:**

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 🧩 State Management

Using Zustand for lightweight state management:

### Auth Store

```typescript
import { useAuthStore } from "@/store/authStore";

const { user, isAuthenticated, setUser, logout } = useAuthStore();
```

### Lesson Store

```typescript
import { useLessonStore } from "@/store/lessonStore";

const { lessons, selectedLesson, setLessons } = useLessonStore();
```

## 📱 Pages Overview

| Route               | Purpose           | Auth Required |
| ------------------- | ----------------- | ------------- |
| `/`                 | Home page         | No            |
| `/login`            | Login page        | No            |
| `/register`         | Registration page | No            |
| `/dashboard`        | User dashboard    | Yes           |
| `/lessons/:id`      | Lesson content    | Yes           |
| `/lessons/:id/quiz` | Lesson quiz       | Yes           |

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build image
docker build -t english-learning-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 \
  english-learning-frontend
```

### Docker Compose

The Docker Compose setup expects the backend to be running on the host machine at port 8080.
On Windows and macOS, `host.docker.internal` works out of the box; on Linux, the compose file adds the host gateway mapping.

```bash
# Start services
docker-compose up

# Stop services
docker-compose down
```

## 📦 Dependencies

### Main

- **react** - UI library
- **next** - Framework
- **axios** - HTTP client
- **zustand** - State management
- **tailwindcss** - Styling

### Dev

- **typescript** - Type safety
- **eslint** - Code linting
- **autoprefixer** - CSS vendor prefixes

## 🚀 Production Build

```bash
# Build optimized version
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000 (Linux/Mac)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Issues

Ensure your backend has CORS enabled for `http://localhost:3000`

### Token Issues

Clear localStorage if having auth issues:

```javascript
localStorage.clear();
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 📝 Environment Variables

Create `.env.local` based on `.env.example`:

```env
# API endpoint
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# For production
# NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

---

**Happy Learning! 🎓**
