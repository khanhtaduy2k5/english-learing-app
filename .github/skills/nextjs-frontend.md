---
name: nextjs-frontend
description: Build and maintain the Next.js/React frontend for the English Learning App with gorgeous UI and TDD
skills:
  - Next.js App Router development
  - TypeScript/React components
  - Tailwind CSS v3 styling with Dark Mode
  - Gorgeous UI design (Glassmorphism, Micro-animations, Premium aesthetics)
  - Test-Driven Development (Vitest, Playwright)
  - Client-side state management (Zustand)
applyTo:
  - client/**
---

# Next.js Frontend Skill

## ⚠️ MANDATORY RULES — Read Before Any Work

### Rule 1: TEST FIRST (TDD — Non-Negotiable)

**You MUST write tests BEFORE writing any implementation code.** This is strictly enforced.

**TDD Workflow:**
1. 🔴 **RED** — Write failing tests for the new feature/component
2. 🟢 **GREEN** — Write the minimum code to make tests pass
3. 🔵 **REFACTOR** — Clean up code while keeping tests green

**What to test (in order of priority):**
- Component rendering and user interactions (Vitest + Testing Library)
- Hook behavior and state changes
- API integration and error handling
- E2E user flows (Playwright)

**Test file location convention:**
```
client/__tests__/components/ComponentName.test.tsx   # Component tests
client/__tests__/hooks/useHookName.test.ts           # Hook tests
client/__tests__/lib/utilName.test.ts                # Utility tests
client/__tests__/store/storeName.test.ts             # Store tests
client/src/e2e/featureName.spec.ts                   # E2E tests
```

**Test naming convention:**
```typescript
describe('ComponentName', () => {
  it('should render title when data is loaded', () => { ... });
  it('should show error state when API fails', () => { ... });
  it('should navigate to lesson when card is clicked', () => { ... });
});
```

**Minimum test coverage per feature:**
- Every component: render test + interaction test + error state test
- Every hook: happy path + error path + edge cases
- Every new page: at least 1 E2E test covering the main flow

### Rule 2: GORGEOUS UI — Premium Design Quality

**Every UI element MUST meet these visual standards. Basic/plain UI is NOT acceptable.**

#### Color System (use CSS variables from globals.css)
```
Dark Mode (default):
  --bg-primary: #030712          (near-black background)
  --bg-secondary: #0a0f1e        (elevated surfaces)
  --bg-card: rgba(255,255,255,0.03)  (glass cards)
  --text-primary: #f8fafc        (headings, body text)
  --text-secondary: #94a3b8      (descriptions, labels)
  --text-muted: #64748b          (hints, placeholders)

Accent palette:
  Indigo:  from-indigo-500 to-purple-600    (primary gradient)
  Emerald: from-emerald-400 to-teal-500     (success states)
  Rose:    from-rose-400 to-pink-500        (error/destructive)
  Amber:   from-amber-400 to-orange-500     (warning states)
```

#### Glassmorphism (apply to ALL cards, modals, dropdowns)
```css
/* Required glass effect — DO NOT use opaque backgrounds */
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 16px;

/* Tailwind equivalent: */
/* bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl */
```

#### Micro-Animations (required on ALL interactive elements)
```
Hover effects:
  - Cards: scale(1.02) + border glow + shadow lift
  - Buttons: brightness boost + subtle scale + gradient shift
  - Links: underline slide-in or color transition
  - Icons: rotate or scale pulse

Transitions:
  - Use transition-all duration-300 ease-out as baseline
  - Page transitions: fade-in with slight translateY
  - List items: staggered fade-in (delay each item by 50-100ms)
  - Modals: scale from 0.95 + opacity fade

Loading states:
  - Skeleton loaders with shimmer animation (NOT plain spinners)
  - Pulse animation for placeholder content
  - Progress bars with gradient animation
```

#### Typography
```
Font: Inter (Google Fonts) — already configured
Headings: font-bold tracking-tight
  h1: text-4xl md:text-5xl (page titles)
  h2: text-2xl md:text-3xl (section titles)
  h3: text-xl (card titles)
Body: text-base text-secondary
Small: text-sm text-muted
```

#### Component Design Standards
```
Buttons:
  - Primary: gradient bg (indigo→purple) + hover:brightness-110 + active:scale-95
  - Secondary: glass background + border + hover:bg-white/10
  - Destructive: gradient bg (rose→pink)
  - All buttons: rounded-xl px-6 py-3 font-medium
  - NEVER use plain unstyled <button>

Cards:
  - Glass effect (see above) + hover:border-white/10 + hover:shadow-xl
  - Inner padding: p-6
  - Group hover effects for child elements

Inputs:
  - bg-white/5 border-white/10 rounded-xl
  - Focus: ring-2 ring-indigo-500/50 border-indigo-500/50
  - Error: ring-rose-500/50 border-rose-500/50
  - Placeholder text: text-muted

Empty states:
  - Illustration or icon (not just text)
  - Call-to-action button
  - Subtle background pattern or gradient
```

#### Layout Rules
```
- Max content width: max-w-7xl mx-auto
- Page padding: px-6 py-8
- Card grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Sidebar: fixed left, collapsible, glass background
- All pages MUST be responsive (mobile-first)
```

#### Forbidden Patterns (DO NOT use)
```
❌ Plain white/gray backgrounds on dark mode
❌ Default browser form elements without styling
❌ Static pages without any animations
❌ Generic colors (plain red, blue, green)
❌ Unstyled scrollbars in visible scroll areas
❌ Plain text error messages without visual treatment
❌ Placeholder images — use generate_image tool instead
❌ Components without hover/focus states
```

---

## Key Directories

- `client/src/app/` — Next.js pages and layouts (App Router)
- `client/src/components/` — Reusable UI components (Sidebar, Button, Input, Card, Alert)
- `client/src/hooks/` — Custom React hooks (useAuth)
- `client/src/store/` — Zustand state management (authStore)
- `client/src/lib/` — API client and utilities
- `client/src/styles/` — Global CSS with theme variables
- `client/__tests__/` — Unit tests (Vitest + Testing Library)
- `client/src/e2e/` — Playwright E2E tests

## Commands

```bash
# Development
npm run dev

# Tests (run these FIRST before implementing)
npm run test          # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)

# Build
npm run build
```

## State Management

- `authStore.ts` — Auth state (user, token, isAuthenticated)
- `hooks/useAuth.ts` — Hook wrapping authStore with `isReady` flag
- Dashboard layout handles auth redirect

## API Integration

- `lib/api.ts` — Axios client with auth token interceptors

## ESLint Notes

- Escape special characters in JSX: `&apos;` for `'`, `&quot;` for `"`
