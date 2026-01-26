---
phase: 02-authentication-system
plan: 01
subsystem: database
tags:
  - drizzle
  - postgresql
  - schema
  - authentication

dependency-graph:
  requires:
    - 01-02: Database schema foundation (users table)
  provides:
    - tokens: Verification and password reset token storage
    - sessions: Refresh token session storage
    - users.tier: User tier field for access control
  affects:
    - 02-02: Auth service will use these schemas
    - 02-03: Protected routes will check tier

tech-stack:
  added: []
  patterns:
    - Cascade delete for user relations
    - SHA-256 token hashing (64-char varchar)
    - tsx runner for drizzle-kit ESM compatibility

key-files:
  created:
    - backend/src/db/schema/tokens.ts
    - backend/src/db/schema/sessions.ts
    - backend/drizzle/0001_good_blonde_phantom.sql
  modified:
    - backend/src/db/schema/users.ts
    - backend/src/db/schema/index.ts
    - backend/drizzle.config.ts
    - backend/package.json

decisions:
  - id: tsx-drizzle-kit
    choice: Use tsx to run drizzle-kit for ESM compatibility
    reason: Drizzle-kit runs via CJS and cannot resolve .js imports pointing to .ts files; tsx handles both ESM and TypeScript properly
    alternatives: Remove extensions (breaks TypeScript NodeNext), use .ts extensions (non-standard)

metrics:
  duration: 2m 32s
  completed: 2026-01-26
---

# Phase 02 Plan 01: Auth Database Schema Summary

Database schema extended with tokens and sessions tables for authentication system foundation.

## One-liner

Tokens and sessions tables for JWT refresh and email verification with cascade-delete user relations.

## What Was Built

### tokens table (`backend/src/db/schema/tokens.ts`)
```typescript
export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 'email_verification' | 'password_reset'
  tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### sessions table (`backend/src/db/schema/sessions.ts`)
```typescript
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### users.tier column
```typescript
tier: varchar('tier', { length: 20 }).default('free').notNull(), // 'anonymous' | 'free' | 'member'
```

## Decisions Made

### tsx runner for drizzle-kit
**Context:** Drizzle-kit runs via CommonJS internally but project uses ESM with NodeNext moduleResolution requiring `.js` extensions.

**Decision:** Update `db:generate` script to run drizzle-kit via tsx:
```json
"db:generate": "tsx node_modules/drizzle-kit/bin.cjs generate"
```

**Rationale:** tsx handles both ESM imports and TypeScript, resolving the conflict between TypeScript's NodeNext requirement for `.js` extensions and drizzle-kit's CJS module resolution.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] ESM/CJS compatibility for drizzle-kit**
- **Found during:** Task 3 migration generation
- **Issue:** Drizzle-kit uses CJS internally and cannot resolve `.js` imports pointing to `.ts` files
- **Fix:** Updated db:generate script to use tsx as the runner
- **Files modified:** backend/package.json
- **Commit:** b88efde

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 4c4bd11 | feat | Create tokens schema for verification and password reset |
| 5a068a7 | feat | Create sessions schema for refresh tokens |
| b88efde | feat | Add tier column and update schema exports |

## Migration Generated

**File:** `backend/drizzle/0001_good_blonde_phantom.sql`

```sql
CREATE TABLE "tokens" (...);
CREATE TABLE "sessions" (...);
ALTER TABLE "users" ADD COLUMN "tier" varchar(20) DEFAULT 'free' NOT NULL;
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
```

## Next Phase Readiness

**Ready for 02-02:** Auth service can now implement:
- Email verification token generation/validation using tokens table
- Password reset token flow using tokens table
- JWT refresh token storage using sessions table
- User tier checks for access control

**Database setup required:** Migration needs to be applied when PostgreSQL is available.

---
*Generated: 2026-01-26*
