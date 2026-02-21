# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StockUs is an Indonesian investment education platform — two independent TypeScript services in one git repo (not a pnpm workspace monorepo).

- **Frontend** (`frontend/`): Next.js 16, React 19 with React Compiler, App Router
- **Backend** (`backend/`): Hono REST API on Node.js 20, PostgreSQL via Drizzle ORM

## Commands

### Frontend (`cd frontend`)
```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm vitest run   # Run all unit tests
pnpm vitest run src/path/to/file.test.ts  # Run single test file
```

### Backend (`cd backend`)
```bash
pnpm dev          # Start with tsx watch (live reload)
pnpm build        # TypeScript compile to dist/
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed database
```

### E2E Tests (from root)
```bash
npx playwright test   # Chromium-only, targets localhost:3000
```

### Docker
```bash
docker-compose up     # Both services (frontend:4000, backend:4001)
```

## Architecture

### Auth Flow
Cookie-based JWT auth. Backend sets HttpOnly cookies: `access_token` (JWT, 15 min) + `refresh_token` (7 days). Frontend middleware (`middleware.ts`) verifies JWT with `jose`. The Data Access Layer (DAL) in `frontend/src/lib/dal.ts` uses React `cache()` for request-scoped auth checks (`verifySession`, `requireAuth`, `requireMember`).

User tiers: `anonymous` (0), `free` (1), `member` (2) — enforced on both sides.

### Frontend API Clients
Two separate fetch wrappers — use the right one:
- `src/lib/api-client-server.ts` — Server Components/Route Handlers only. Manually forwards cookies, supports `next: { revalidate }` for ISR.
- `src/lib/api-client.ts` — Client Components only. Uses `credentials: 'include'`.
- `src/lib/api.ts` — Simpler server-only wrapper for public pages.

### Frontend Route Groups
- `(auth)/` — Member-only pages (dashboard, courses, billing, etc.)
- `(admin)/` — Admin panel (courses, research, templates, users, orders management)
- Public pages at root: `about/`, `community/`, `pricing/`, `research/`, `login/`, `signup/`

### Backend Structure
Routes in `backend/src/routes/`, schemas in `backend/src/db/schema/` (16 Drizzle schema files). All route inputs validated with `@hono/zod-validator`. Env vars validated at startup via Zod schema in `src/config/env.ts`.

### Styling
- Tailwind CSS v4 with `@tailwindcss/postcss`
- shadcn/ui (`new-york` style, `neutral` base, Lucide icons) — add components via `pnpm dlx shadcn@latest add <component>`
- Brand color: `#F96E00` (orange), available as `text-brand`, `bg-brand`
- Font: Montserrat
- Animations: `framer-motion` / `motion`
- Class composition: `cn()` utility (clsx + tailwind-merge)

### i18n
Custom `LanguageContext` with `useTranslation()` hook. Supports `en` and `id` (Indonesian). Translation files in frontend.

### External Services
- **Neon** — Managed PostgreSQL
- **Midtrans** — Indonesian payment gateway (Snap.js on frontend, webhooks on backend)
- **Cloudflare R2** — Video/file storage with signed URLs
- **Resend** — Transactional email

## Environment Setup
Copy `.env.example` files in root and `backend/`. Frontend needs `NEXT_PUBLIC_API_URL`, `API_URL` (server-side), `JWT_SECRET`, and Midtrans client keys.
