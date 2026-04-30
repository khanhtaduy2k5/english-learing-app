# English Learning App Frontend

A modern Next.js frontend for the English Learning Application, built with TypeScript and Tailwind CSS.

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install
# or
yarn install
```

## Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API client
├── store/              # Zustand stores (state management)
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Build

```bash
npm run build
npm start
```

## Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
