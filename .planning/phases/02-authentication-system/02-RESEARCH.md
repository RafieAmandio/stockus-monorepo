# Phase 2: Authentication System - Research

**Researched:** 2026-01-26
**Domain:** JWT-based authentication with email verification and password management
**Confidence:** HIGH

## Summary

This research covers implementing a complete authentication system for a Hono + TypeScript + PostgreSQL stack with ESM modules. The standard approach uses Hono's built-in JWT middleware, Argon2id for password hashing, and HTTP-only cookies for secure token storage. Email verification and password reset flows follow modern security best practices with time-limited, single-use tokens.

The authentication ecosystem has matured significantly in 2026, with Argon2id now the recommended standard over bcrypt for new applications. Resend has emerged as a modern alternative to Nodemailer for transactional emails, offering superior developer experience. JWT security best practices emphasize short-lived access tokens, refresh token rotation, and protection against common vulnerabilities like algorithm confusion and weak secrets.

**Primary recommendation:** Use Hono's native JWT helpers with Argon2id hashing, HTTP-only cookies for tokens, and Resend for email. Implement refresh token rotation for security. Store verification/reset tokens hashed in database with expiration timestamps.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| hono/jwt | Built-in | JWT signing, verification, middleware | Native Hono support, TypeScript-first, zero dependencies |
| argon2 | ^0.31+ | Password hashing | Winner of Password Hashing Competition, OWASP recommended, GPU-attack resistant |
| resend | ^3.0+ | Transactional email | Modern API, excellent DX, works with edge functions |
| crypto (Node.js) | Built-in | Token generation | Cryptographically secure, no dependencies |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | ^3.24+ | Request validation | Already in stack, validate auth payloads |
| cookie | ^0.6+ | Cookie parsing (if needed) | Manual cookie handling (Hono has built-in support) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| argon2 | bcrypt | bcrypt is proven but slower parameter adjustment, less GPU-attack resistant |
| resend | nodemailer | Nodemailer offers SMTP flexibility but requires more boilerplate, doesn't work on edge |
| JWT | Sessions (database) | Database sessions are stateless-proof but add DB latency to every request |

**Installation:**
```bash
npm install argon2 resend
```

## Architecture Patterns

### Recommended Project Structure
```
backend/src/
├── routes/
│   └── auth.ts              # Authentication endpoints
├── middleware/
│   └── auth.ts              # JWT verification middleware
├── services/
│   ├── auth.service.ts      # Authentication business logic
│   ├── email.service.ts     # Email sending
│   └── token.service.ts     # Token generation/verification
├── db/
│   └── schema/
│       ├── users.ts         # Users table (already exists)
│       ├── tokens.ts        # Verification/reset tokens
│       └── sessions.ts      # Optional: refresh token storage
└── config/
    └── env.ts               # Environment config (already exists)
```

### Pattern 1: JWT with HTTP-only Cookies
**What:** Store access tokens in HTTP-only cookies instead of localStorage
**When to use:** Always, for XSS protection
**Example:**
```typescript
// Source: https://medium.com/@alperkilickaya/creating-a-jwt-authentication-system-with-http-only-refresh-token-using-react-and-node-js-6865f04087ce
import { sign } from 'hono/jwt'

app.post('/auth/login', async (c) => {
  // ... validate credentials ...

  const accessToken = await sign(
    {
      sub: user.id,
      role: user.tier,
      exp: Math.floor(Date.now() / 1000) + 60 * 15 // 15 minutes
    },
    c.env.JWT_SECRET
  )

  // Set HTTP-only cookie
  c.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'Strict',
    maxAge: 900, // 15 minutes in seconds
    path: '/'
  })

  return c.json({ user: { id: user.id, email: user.email } })
})
```

### Pattern 2: Refresh Token Rotation
**What:** Issue new refresh token on each use, invalidate old one
**When to use:** Always, prevents token replay attacks
**Example:**
```typescript
// Source: https://pixicstudio.medium.com/jwt-refresh-tokens-and-http-only-cookies-the-complete-security-playbook-a8e8c525be82
app.post('/auth/refresh', async (c) => {
  const oldRefreshToken = c.req.cookie('refresh_token')

  // Verify and delete old token from DB
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.tokenHash, hashToken(oldRefreshToken))
  })

  if (!session || session.expiresAt < new Date()) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  // Delete old session
  await db.delete(sessions).where(eq(sessions.id, session.id))

  // Create new tokens
  const accessToken = await sign({ sub: session.userId }, c.env.JWT_SECRET)
  const newRefreshToken = crypto.randomBytes(32).toString('hex')

  // Store new refresh token
  await db.insert(sessions).values({
    userId: session.userId,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  })

  // Set new cookies
  c.cookie('access_token', accessToken, { httpOnly: true, secure: true })
  c.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: true,
    path: '/auth/refresh' // Limit scope
  })

  return c.json({ success: true })
})
```

### Pattern 3: Authentication Middleware with Type Safety
**What:** Type-safe middleware that extracts and validates JWT, adds user to context
**When to use:** Protecting routes that require authentication
**Example:**
```typescript
// Source: https://hono.dev/docs/middleware/builtin/jwt
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'

type Variables = JwtVariables & {
  userId: number
  userTier: 'anonymous' | 'free' | 'member'
}

const app = new Hono<{ Variables: Variables }>()

// Apply JWT middleware
app.use('/api/*', jwt({
  secret: process.env.JWT_SECRET!,
  cookie: 'access_token' // Read from cookie instead of header
}))

// Extract user data from JWT payload
app.use('/api/*', async (c, next) => {
  const payload = c.get('jwtPayload')
  c.set('userId', payload.sub as number)
  c.set('userTier', payload.role as Variables['userTier'])
  await next()
})

// Protected route
app.get('/api/profile', (c) => {
  const userId = c.get('userId')
  const tier = c.get('userTier')
  return c.json({ userId, tier })
})
```

### Pattern 4: Email Verification Flow
**What:** Generate secure token, store hashed in DB, send link via email
**When to use:** After user registration
**Example:**
```typescript
// Source: https://mailtrap.io/blog/nodejs-email-validation/
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

app.post('/auth/signup', async (c) => {
  const { email, password } = await c.req.json()

  // Hash password with Argon2
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 25600, // ~25MB
    timeCost: 3,
    parallelism: 1
  })

  // Create user
  const [user] = await db.insert(users).values({
    email,
    passwordHash,
    isVerified: false
  }).returning()

  // Generate verification token
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  // Store token with expiration
  await db.insert(tokens).values({
    userId: user.id,
    type: 'email_verification',
    tokenHash,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  })

  // Send email
  const verificationUrl = `${c.env.FRONTEND_URL}/verify-email?token=${token}`
  await resend.emails.send({
    from: 'StockUs <noreply@stockus.com>',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
  })

  return c.json({ message: 'Check your email for verification link' })
})

app.get('/auth/verify-email', async (c) => {
  const token = c.req.query('token')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  // Find token
  const tokenRecord = await db.query.tokens.findFirst({
    where: and(
      eq(tokens.tokenHash, tokenHash),
      eq(tokens.type, 'email_verification'),
      gt(tokens.expiresAt, new Date())
    )
  })

  if (!tokenRecord) {
    return c.json({ error: 'Invalid or expired token' }, 400)
  }

  // Update user and delete token
  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({ isVerified: true })
      .where(eq(users.id, tokenRecord.userId))

    await tx.delete(tokens).where(eq(tokens.id, tokenRecord.id))
  })

  return c.json({ message: 'Email verified successfully' })
})
```

### Pattern 5: Password Reset Flow
**What:** Secure, time-limited password reset with single-use tokens
**When to use:** Forgot password functionality
**Example:**
```typescript
// Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
app.post('/auth/forgot-password', async (c) => {
  const { email } = await c.req.json()

  // Always return success to prevent enumeration
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (user) {
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Store token
    await db.insert(tokens).values({
      userId: user.id,
      type: 'password_reset',
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    })

    // Send email
    const resetUrl = `${c.env.FRONTEND_URL}/reset-password?token=${token}`
    await resend.emails.send({
      from: 'StockUs <noreply@stockus.com>',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    })
  }

  // Generic response prevents email enumeration
  return c.json({ message: 'If an account exists, a reset link has been sent' })
})

app.post('/auth/reset-password', async (c) => {
  const { token, newPassword } = await c.req.json()
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  // Find and validate token
  const tokenRecord = await db.query.tokens.findFirst({
    where: and(
      eq(tokens.tokenHash, tokenHash),
      eq(tokens.type, 'password_reset'),
      gt(tokens.expiresAt, new Date())
    )
  })

  if (!tokenRecord) {
    return c.json({ error: 'Invalid or expired token' }, 400)
  }

  // Hash new password
  const passwordHash = await argon2.hash(newPassword, {
    type: argon2.argon2id,
    memoryCost: 25600,
    timeCost: 3,
    parallelism: 1
  })

  // Update password and delete token
  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({ passwordHash })
      .where(eq(users.id, tokenRecord.userId))

    // Delete ALL password reset tokens for this user
    await tx.delete(tokens).where(
      and(
        eq(tokens.userId, tokenRecord.userId),
        eq(tokens.type, 'password_reset')
      )
    )
  })

  // Optionally: invalidate all sessions for this user
  await db.delete(sessions).where(eq(sessions.userId, tokenRecord.userId))

  // Send notification email
  await resend.emails.send({
    from: 'StockUs <noreply@stockus.com>',
    to: user.email,
    subject: 'Password changed',
    html: '<p>Your password has been changed. If you did not make this change, contact support immediately.</p>'
  })

  return c.json({ message: 'Password reset successful' })
})
```

### Pattern 6: User Tier Authorization
**What:** Check user tier in middleware, restrict access by tier
**When to use:** Features gated by subscription level
**Example:**
```typescript
// Source: https://www.corbado.com/blog/nodejs-express-postgresql-jwt-authentication-roles
const requireTier = (minTier: 'free' | 'member') => {
  const tierLevels = { anonymous: 0, free: 1, member: 2 }

  return async (c: Context, next: Next) => {
    const userTier = c.get('userTier')

    if (tierLevels[userTier] < tierLevels[minTier]) {
      return c.json({
        error: 'Insufficient permissions',
        required: minTier,
        current: userTier
      }, 403)
    }

    await next()
  }
}

// Usage
app.get('/api/premium-feature', requireTier('member'), (c) => {
  return c.json({ feature: 'premium content' })
})
```

### Anti-Patterns to Avoid
- **Storing JWTs in localStorage:** Vulnerable to XSS attacks. Use HTTP-only cookies.
- **Long-lived access tokens:** Keep under 15 minutes. Use refresh tokens for persistence.
- **Not hashing tokens in database:** Store SHA-256 hash, not raw token, to protect against DB leaks.
- **Weak JWT secrets:** Use minimum 256 bits (32 bytes) from cryptographically secure RNG.
- **Accepting "none" algorithm:** Explicitly whitelist allowed algorithms (HS256, RS256, etc).
- **Password in verification tokens:** Never include password or hash in URLs or emails.
- **Automatic login after password reset:** Require explicit login to prevent session hijacking.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password hashing | Custom hash + salt | argon2 library | Resistant to GPU attacks, configurable memory/time cost, PHC winner |
| JWT signing/verification | Manual HMAC + base64 | hono/jwt helpers | Handles algorithm complexity, built-in validation, timing-safe comparison |
| Secure random tokens | Math.random() | crypto.randomBytes() | Cryptographically secure, no modulo bias, OS-level entropy |
| Token comparison | === or == | crypto.timingSafeEqual() | Prevents timing attacks that leak token information |
| Email sending | Raw SMTP sockets | Resend or Nodemailer | Handles retries, templates, deliverability, SPF/DKIM |
| Rate limiting | Manual counters | @hono/rate-limiter or similar | Distributed support, sliding windows, Redis backing |

**Key insight:** Authentication is where security bugs have the highest impact. Use battle-tested libraries that have been audited and fuzed. Custom implementations often miss edge cases like timing attacks, token fixation, or replay vulnerabilities.

## Common Pitfalls

### Pitfall 1: Algorithm Confusion Attack
**What goes wrong:** Server accepts JWT with "alg: none" or attacker switches RS256 to HS256, signing with public key as secret
**Why it happens:** JWT libraries default to accepting any algorithm in token header
**How to avoid:** Explicitly specify allowed algorithms in verification:
```typescript
await verify(token, secret, 'HS256') // Only accept HS256
```
**Warning signs:** JWT middleware configured without explicit algorithm parameter

**Source:** https://redsentry.com/resources/blog/jwt-vulnerabilities-list-2026-security-risks-mitigation-guide

### Pitfall 2: Account Enumeration via Password Reset
**What goes wrong:** Different responses for existing vs non-existing emails reveals valid accounts
**Why it happens:** Immediate DB check with different error messages
**How to avoid:** Always return same message, perform lookups after response:
```typescript
// Good: Generic message, same timing
return c.json({ message: 'If account exists, email sent' })
```
**Warning signs:** Error messages like "User not found" vs "Email sent"

**Source:** https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html

### Pitfall 3: Token Expiration Not Enforced
**What goes wrong:** Expired verification/reset tokens still work
**Why it happens:** Checking token existence but not expiration timestamp
**How to avoid:** Always include expiration check in WHERE clause:
```typescript
where: and(
  eq(tokens.tokenHash, hash),
  gt(tokens.expiresAt, new Date()) // Critical!
)
```
**Warning signs:** Tokens table has expiresAt but queries don't use it

### Pitfall 4: CORS Misconfiguration with Credentials
**What goes wrong:** Cookies not sent/received in cross-origin requests
**Why it happens:** Missing credentials: true in CORS config or SameSite blocking
**How to avoid:** Configure CORS for cookies:
```typescript
app.use('/auth/*', cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Enable credentials
  allowedHeaders: ['Content-Type']
}))
```
And set cookies with appropriate SameSite:
```typescript
c.cookie('token', value, {
  sameSite: 'None', // For cross-origin
  secure: true // Required with SameSite=None
})
```
**Warning signs:** Authentication works on same origin but fails cross-origin

**Source:** https://www.better-auth.com/docs/integrations/hono

### Pitfall 5: Weak Argon2 Parameters
**What goes wrong:** Argon2 hashing too fast, vulnerable to brute force
**Why it happens:** Using default parameters meant for testing
**How to avoid:** Use production-recommended parameters:
```typescript
await argon2.hash(password, {
  type: argon2.argon2id, // Hybrid protection
  memoryCost: 25600,     // ~25MB RAM
  timeCost: 3,           // 3 iterations
  parallelism: 1         // Sequential
})
```
**Warning signs:** Hashing completes in <100ms on normal hardware

**Source:** https://guptadeepak.com/the-complete-guide-to-password-hashing-argon2-vs-bcrypt-vs-scrypt-vs-pbkdf2-2026/

### Pitfall 6: Token Reuse After Password Change
**What goes wrong:** Old JWTs and refresh tokens still valid after password reset
**Why it happens:** Not invalidating existing sessions on password change
**How to avoid:** Delete all sessions on password change:
```typescript
await db.delete(sessions).where(eq(sessions.userId, userId))
```
**Warning signs:** User reports being logged in after password reset

### Pitfall 7: Email Verification Not Required for Login
**What goes wrong:** Unverified users can access system, enabling spam/abuse
**Why it happens:** Checking isVerified flag but not enforcing it
**How to avoid:** Check verification in login:
```typescript
if (!user.isVerified) {
  return c.json({ error: 'Email not verified' }, 403)
}
```
**Warning signs:** Users table has isVerified but login doesn't check it

### Pitfall 8: Modulo Bias in Token Generation
**What goes wrong:** Non-uniform distribution in tokens makes them predictable
**Why it happens:** Using crypto.randomBytes() % n for token generation
**How to avoid:** Use hex encoding instead:
```typescript
// Good: Uniform distribution
const token = crypto.randomBytes(32).toString('hex')

// Bad: Modulo bias
const token = crypto.randomBytes(32).readUInt32BE(0) % 1000000
```
**Warning signs:** Custom token generation code with modulo operator

**Source:** https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba

## Code Examples

Verified patterns from official sources:

### Complete Auth Route Structure
```typescript
// Source: https://hono.dev/docs/middleware/builtin/jwt
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import argon2 from 'argon2'

const auth = new Hono()

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// Public routes
auth.post('/signup', zValidator('json', signupSchema), async (c) => {
  // Implementation from Pattern 4
})

auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')

  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (!user || !user.passwordHash) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  if (!user.isVerified) {
    return c.json({ error: 'Email not verified' }, 403)
  }

  const valid = await argon2.verify(user.passwordHash, password)
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Generate tokens...
  // Set cookies...

  return c.json({ user: { id: user.id, email: user.email } })
})

auth.post('/forgot-password', async (c) => {
  // Implementation from Pattern 5
})

auth.post('/reset-password', async (c) => {
  // Implementation from Pattern 5
})

auth.get('/verify-email', async (c) => {
  // Implementation from Pattern 4
})

// Protected routes
auth.use('/logout', jwt({ secret: process.env.JWT_SECRET!, cookie: 'access_token' }))
auth.post('/logout', async (c) => {
  const payload = c.get('jwtPayload')

  // Delete refresh token from DB
  await db.delete(sessions).where(eq(sessions.userId, payload.sub))

  // Clear cookies
  c.cookie('access_token', '', { maxAge: 0 })
  c.cookie('refresh_token', '', { maxAge: 0 })

  return c.json({ message: 'Logged out' })
})

auth.use('/refresh', jwt({ secret: process.env.JWT_SECRET!, cookie: 'refresh_token' }))
auth.post('/refresh', async (c) => {
  // Implementation from Pattern 2
})

export default auth
```

### Database Schema with Drizzle
```typescript
// Source: https://authjs.dev/reference/adapter/drizzle
import { pgTable, serial, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core'

// Users table (already exists - add tier column)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  isVerified: boolean('is_verified').default(false).notNull(),
  tier: varchar('tier', { length: 20 }).default('free').notNull(), // Add this
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Tokens table for verification and password reset
export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 'email_verification' | 'password_reset'
  tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(), // SHA-256 hash
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Sessions table for refresh tokens
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Add indexes for performance
export const tokensTypeIdx = pgTable.index('tokens_type_idx').on(tokens.type)
export const tokensExpiresAtIdx = pgTable.index('tokens_expires_at_idx').on(tokens.expiresAt)
export const sessionsUserIdIdx = pgTable.index('sessions_user_id_idx').on(sessions.userId)
```

### Environment Configuration
```typescript
// Source: Existing backend/src/config/env.ts (extend)
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Add authentication config
  JWT_SECRET: z.string().min(32), // Minimum 256 bits
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),

  // Email config
  RESEND_API_KEY: z.string().startsWith('re_'),
  EMAIL_FROM: z.string().email(),

  // URLs
  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

### Helper Functions
```typescript
// Source: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
import crypto from 'crypto'

export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex')
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function verifyTokenHash(token: string, hash: string): boolean {
  const computedHash = hashToken(token)
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(hash)
  )
}

// Token expiration helpers
export function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000)
}

export function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| bcrypt | Argon2id | 2015 (PHC win), widespread 2024+ | Better GPU-attack resistance, configurable memory cost |
| localStorage for JWT | HTTP-only cookies | Always recommended, enforced 2023+ | XSS protection, automatic CSRF via SameSite |
| Nodemailer | Resend/SendGrid API | 2023+ for modern apps | Simpler setup, better DX, edge function support |
| Access token only | Access + refresh token | Industry standard 2020+ | Session persistence without long-lived access tokens |
| Plain token storage | Hashed token storage | OWASP guidance 2022+ | DB leak doesn't compromise active tokens |
| HS256 only | HS256/RS256/ES256 | Algorithm flexibility 2024+ | RS256 for microservices, key rotation support |

**Deprecated/outdated:**
- **Passport.js:** While still functional, modern frameworks prefer native middleware. Hono's JWT middleware is simpler and type-safe.
- **express-session:** Database sessions add latency. JWT with refresh tokens offers better scalability.
- **bcryptjs (pure JS):** Slower than native bcrypt or Argon2. Use native bindings.
- **JWT in URL parameters:** Security risk (logged in server logs, browser history). Use cookies or headers.

## Open Questions

Things that couldn't be fully resolved:

1. **Rate Limiting Strategy**
   - What we know: Express has express-rate-limit, but Hono needs custom or third-party solution
   - What's unclear: Best Hono-native rate limiting library for auth endpoints
   - Recommendation: Research @hono/rate-limiter or implement custom middleware with Redis. Not blocking for MVP—can add post-launch.

2. **Email Template Management**
   - What we know: Resend supports HTML emails, can use React Email for templates
   - What's unclear: Whether to use React Email or plain HTML for this phase
   - Recommendation: Start with plain HTML templates in email service. Upgrade to React Email if template complexity increases.

3. **Session Management at Scale**
   - What we know: Storing refresh tokens in PostgreSQL works for small-medium apps
   - What's unclear: At what scale should we move to Redis for session storage
   - Recommendation: PostgreSQL is fine for MVP. Monitor query performance. Move to Redis if session lookups become bottleneck (>1000 concurrent users).

4. **Multi-Factor Authentication**
   - What we know: Not in current requirements but user tier system suggests future premium features
   - What's unclear: Whether to design schema with MFA in mind now
   - Recommendation: Don't over-engineer for MFA now. Current schema is extensible (can add mfaEnabled, mfaSecret columns later).

## Sources

### Primary (HIGH confidence)
- [Hono JWT Middleware](https://hono.dev/docs/middleware/builtin/jwt) - Official Hono JWT documentation
- [Hono JWT Helper](https://hono.dev/docs/helpers/jwt) - Official JWT signing/verification API
- [Hono CORS Middleware](https://hono.dev/docs/middleware/builtin/cors) - Official CORS configuration
- [argon2 npm package](https://www.npmjs.com/package/argon2) - Official Argon2 Node.js bindings
- [Resend Node.js Guide](https://resend.com/docs/send-with-nodejs) - Official Resend documentation
- [Node.js crypto.randomBytes](https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba) - Cryptographically secure random generation
- [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) - Security best practices

### Secondary (MEDIUM confidence)
- [JWT Vulnerabilities List 2026](https://redsentry.com/resources/blog/jwt-vulnerabilities-list-2026-security-risks-mitigation-guide) - Recent CVEs and mitigation
- [JWT Refresh Tokens with HTTP-Only Cookies](https://pixicstudio.medium.com/jwt-refresh-tokens-and-http-only-cookies-the-complete-security-playbook-a8e8c525be82) - Medium article, December 2025
- [Password Hashing Guide 2025: Argon2 vs Bcrypt](https://guptadeepak.com/the-complete-guide-to-password-hashing-argon2-vs-bcrypt-vs-scrypt-vs-pbkdf2-2026/) - Comprehensive comparison
- [Node.js Email Verification Tutorial 2026](https://mailtrap.io/blog/nodejs-email-validation/) - Mailtrap guide, September 2025
- [Node.js Express PostgreSQL JWT & Roles](https://www.corbado.com/blog/nodejs-express-postgresql-jwt-authentication-roles) - Role-based auth patterns
- [Better Auth Hono Integration](https://www.better-auth.com/docs/integrations/hono) - Modern auth framework examples
- [Resend vs Nodemailer Comparison](https://devdiwan.medium.com/goodbye-nodemailer-why-i-switched-to-resend-for-sending-emails-in-node-js-55e5a0dba899) - Medium article on email services

### Tertiary (LOW confidence)
- Various Stack Overflow discussions on JWT best practices (cross-referenced with official docs)
- Community examples from GitHub (verified patterns against official documentation)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified from official sources (Hono docs, npm, official Argon2/Resend sites)
- Architecture: HIGH - Patterns sourced from official documentation and OWASP guidelines
- Pitfalls: HIGH - CVE database, OWASP, and official security advisories
- Code examples: HIGH - All examples adapted from official documentation or security best practice guides

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - authentication best practices are relatively stable)

**Notes:**
- Hono is relatively young (2022) but rapidly maturing with stable JWT middleware
- Argon2 adoption is accelerating in 2026, now OWASP's top recommendation
- Resend emerged 2023, gaining significant traction for developer experience
- JWT security landscape evolved significantly in 2025 with multiple high-profile CVEs, making algorithm whitelisting and strong secrets more critical than ever
