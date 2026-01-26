# Phase 3: Content API - Research

**Researched:** 2026-01-26
**Domain:** Content Management REST API with Hono, Drizzle ORM, PostgreSQL, File Uploads
**Confidence:** HIGH

## Summary

Phase 3 implements CRUD endpoints for content management (courses, research reports, templates, cohorts) with admin authorization. The standard approach uses Hono's resource-based routing with Zod validation, Drizzle ORM for type-safe database operations, and built-in Node.js file handling for local uploads.

The existing codebase already has authentication middleware (`authMiddleware`, `requireTier`) and database infrastructure (Drizzle + PostgreSQL) from Phase 2, making this a straightforward extension. The key challenges are database schema design for relational content (courses → sessions → cohorts), file upload handling, and admin-only route protection.

**Primary recommendation:** Use resource-based route organization (`/courses`, `/research`, `/templates`, `/cohorts`) with nested relations in Drizzle, store files locally in `uploads/` with unique filenames, and extend existing `requireTier('member')` pattern for admin authorization. Store content as HTML text columns with frontend sanitization responsibility.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Hono | 4.6+ | HTTP framework | Already in use, excellent TypeScript support, fast, minimal |
| @hono/zod-validator | 0.7+ | Request validation | Already in use, seamless Zod integration with Hono |
| Drizzle ORM | 0.36+ | Database ORM | Already in use, type-safe queries, excellent PostgreSQL support |
| Zod | 3.24+ | Schema validation | Already in use, TypeScript-first validation |
| Node.js fs/promises | Native | File operations | Built-in, no dependencies, sufficient for v1 local storage |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| crypto (native) | Native | UUID generation | Unique filename generation for uploads |
| path (native) | Native | Path manipulation | Safe file path handling |
| mime-types | 2.1+ | MIME type detection | (Optional) File type validation enhancement |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Local file storage | Multer middleware | Multer adds dependency, Node.js parseBody + fs is simpler for v1 |
| text column | JSONB for metadata | Separate columns better for query planning (confirmed by research) |
| Status enum | Boolean flags | Enum clearer, extensible (draft/published/archived) |

**Installation:**
```bash
# No new dependencies needed for core functionality
# Optional: mime-types for enhanced validation
npm install mime-types
npm install --save-dev @types/mime-types
```

## Architecture Patterns

### Recommended Project Structure
```
backend/src/
├── routes/
│   ├── courses.ts          # Course CRUD
│   ├── research.ts          # Research report CRUD
│   ├── templates.ts         # Template upload/download
│   ├── cohorts.ts           # Cohort management
│   └── index.ts             # Route mounting
├── db/schema/
│   ├── courses.ts           # Course + session tables
│   ├── research.ts          # Research reports table
│   ├── templates.ts         # Template metadata table
│   ├── cohorts.ts           # Cohort + enrollment tables
│   └── index.ts             # Schema exports
├── middleware/
│   └── auth.ts              # (exists) authMiddleware, requireTier
├── utils/
│   └── file-upload.ts       # File handling utilities
└── uploads/                 # Local file storage (gitignored)
    ├── templates/
    ├── images/
    └── thumbnails/
```

### Pattern 1: Resource-Based Route Organization

**What:** Each content type gets its own route file mounted at a resource path
**When to use:** Standard for REST APIs with multiple resources
**Example:**
```typescript
// Source: https://hono.dev/docs/guides/best-practices

// routes/courses.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware, requireTier, AuthEnv } from '../middleware/auth.js'

const courses = new Hono<AuthEnv>()

// Public: List published courses (with tier filtering in query)
courses.get('/', async (c) => {
  const courses = await db.query.courses.findMany({
    where: eq(courses.status, 'published'),
    with: { sessions: true }
  })
  return c.json({ courses })
})

// Admin: Create course
courses.post('/',
  authMiddleware,
  requireTier('member'), // Extend this for admin check
  zValidator('json', createCourseSchema),
  async (c) => {
    const data = c.req.valid('json')
    const [course] = await db.insert(courses).values(data).returning()
    return c.json({ course }, 201)
  }
)

// Admin: Update course
courses.patch('/:id',
  authMiddleware,
  requireTier('member'),
  zValidator('json', updateCourseSchema),
  async (c) => {
    const id = Number(c.req.param('id'))
    const data = c.req.valid('json')
    const [course] = await db.update(courses)
      .set(data)
      .where(eq(courses.id, id))
      .returning()
    return c.json({ course })
  }
)

export default courses

// routes/index.ts
import { Hono } from 'hono'
import courses from './courses.js'
import research from './research.js'

const routes = new Hono()
routes.route('/courses', courses)
routes.route('/research', research)

export default routes
```

### Pattern 2: Drizzle Relations for Nested Data

**What:** Define one-to-many relationships using `relations()` for type-safe nested queries
**When to use:** Content with sessions (courses), cohorts with sessions, enrollments
**Example:**
```typescript
// Source: https://orm.drizzle.team/docs/relations-v2

// db/schema/courses.ts
import { pgTable, serial, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived'])

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  content: text('content'), // HTML from rich text editor
  status: contentStatusEnum('status').notNull().default('draft'),
  isFreePreview: boolean('is_free_preview').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const courseSessions = pgTable('course_sessions', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  sessionOrder: integer('session_order').notNull(),
  duration: integer('duration'), // minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Define relations
export const coursesRelations = relations(courses, ({ many }) => ({
  sessions: many(courseSessions),
}))

export const courseSessionsRelations = relations(courseSessions, ({ one }) => ({
  course: one(courses, {
    fields: [courseSessions.courseId],
    references: [courses.id],
  }),
}))

// Query with nested data
const courseWithSessions = await db.query.courses.findFirst({
  where: eq(courses.id, courseId),
  with: {
    sessions: {
      orderBy: [asc(courseSessions.sessionOrder)],
    },
  },
})
```

### Pattern 3: File Upload with Hono parseBody

**What:** Use Hono's built-in `parseBody()` for multipart/form-data, save to disk with UUID filenames
**When to use:** Template uploads, image uploads, thumbnails
**Example:**
```typescript
// Source: https://hono.dev/examples/file-upload
// Enhanced from: https://dev.to/aaronksaunders/quick-rest-api-file-upload-with-hono-js-and-drizzle-49ok

import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// routes/templates.ts
templates.post('/upload',
  authMiddleware,
  requireTier('member'), // Admin only
  async (c) => {
    const body = await c.req.parseBody()
    const file = body.file

    if (!file || typeof file === 'string') {
      return c.json({ error: 'File upload required' }, 400)
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. PDF and Excel only.' }, 400)
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return c.json({ error: 'File too large. Maximum 10MB.' }, 400)
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`
    const filepath = join(process.cwd(), 'uploads', 'templates', filename)

    // Ensure directory exists
    await mkdir(join(process.cwd(), 'uploads', 'templates'), { recursive: true })

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    // Save metadata to database
    const [template] = await db.insert(templates).values({
      title: body.title as string,
      originalFilename: file.name,
      filename,
      filepath: `/uploads/templates/${filename}`,
      fileSize: file.size,
      mimeType: file.type,
    }).returning()

    return c.json({ template }, 201)
  }
)

// Download endpoint
templates.get('/:id/download', async (c) => {
  const id = Number(c.req.param('id'))
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, id)
  })

  if (!template) {
    return c.json({ error: 'Template not found' }, 404)
  }

  const filepath = join(process.cwd(), 'uploads', 'templates', template.filename)
  const file = await readFile(filepath)

  return c.body(file, {
    headers: {
      'Content-Type': template.mimeType,
      'Content-Disposition': `attachment; filename="${template.originalFilename}"`,
    },
  })
})
```

### Pattern 4: Admin Authorization Extension

**What:** Extend existing auth middleware to check for admin role
**When to use:** All admin-only endpoints (content creation, editing, deletion)
**Example:**
```typescript
// middleware/auth.ts (extend existing)

export type UserRole = 'user' | 'admin'

export interface AuthVariables {
  userId: number
  userTier: UserTier
  userRole: UserRole // Add role
  jwtPayload: JwtPayload
}

// Add role to JWT payload in auth.service.ts
export interface JwtPayload {
  sub: number
  tier: UserTier
  role: UserRole // Add this
  iat: number
  exp: number
}

// New middleware for admin-only routes
export function requireAdmin() {
  return async (c: Context, next: Next) => {
    const userRole = c.get('userRole') as UserRole

    if (userRole !== 'admin') {
      return c.json({
        error: 'Admin access required',
        current: userRole
      }, 403)
    }

    await next()
  }
}

// Usage in routes
courses.post('/', authMiddleware, requireAdmin(), async (c) => {
  // Only admins can create courses
})
```

### Pattern 5: Slug Generation

**What:** Auto-generate URL-friendly slugs from titles with uniqueness handling
**When to use:** Courses, research reports (anything with public URLs)
**Example:**
```typescript
// Source: https://www.timsanteford.com/posts/automating-url-slug-generation-in-postgresql-with-triggers-and-functions/

// utils/slug.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces/hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Ensure uniqueness in route handler
async function createUniqueSlug(baseSlug: string, table: any): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await db.query[table].findFirst({
      where: eq(table.slug, slug)
    })

    if (!existing) return slug

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

// Usage
const baseSlug = generateSlug(courseData.title)
const uniqueSlug = await createUniqueSlug(baseSlug, courses)
```

### Anti-Patterns to Avoid

- **Storing files in database BLOBs:** Use filesystem for v1, files in DB hurt performance and complicate backups. Database is for metadata only.
- **JSONB for structured content metadata:** Query planner lacks statistics for JSONB columns, use separate columns for frequently-queried fields (status, title, dates). JSONB only for truly dynamic data.
- **Controller classes:** Hono loses TypeScript inference with controller pattern, use inline handlers or `factory.createHandlers()`
- **Manual SQL for relations:** Use Drizzle's `with` queries instead of JOIN statements, maintains type safety
- **Parsing files in memory for large uploads:** For v1 with 10MB limit this is fine, but document need to stream for larger files in future

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File type validation | Custom MIME type checking | Zod `.instanceof(File).refine()` | Handles edge cases (empty files, wrong extensions), type-safe |
| Unique filename generation | Timestamps or counters | `crypto.randomUUID()` (native) | Collision-resistant, no coordination needed |
| Slug generation | Simple replace(' ', '-') | Pattern from research (regex-based) | Handles special chars, unicode, edge cases |
| Password hashing | Custom crypto | Argon2 (already in use) | Industry standard, resistant to attacks |
| Authorization checks | Custom if/else logic | Middleware factory pattern | Composable, testable, consistent |
| Nested data fetching | Manual JOINs | Drizzle `with` queries | Type-safe, prevents N+1 queries, single SQL output |

**Key insight:** File upload security is deceptively complex. Never trust client-provided filenames or MIME types. Always generate new filenames server-side, validate file contents (not just extension), enforce size limits at multiple layers (middleware + validation + disk quota), and store outside web root. Even for v1 local storage, these practices prevent security vulnerabilities.

## Common Pitfalls

### Pitfall 1: File Upload Memory Exhaustion

**What goes wrong:** Using `parseBody()` loads entire file into memory. Multiple large concurrent uploads can crash Node.js process.

**Why it happens:** Hono's `parseBody()` is not streaming by default. With 10MB limit and typical server RAM, this is manageable but can still cause issues with concurrent uploads.

**How to avoid:**
- Enforce size limits in validation (before parseBody)
- Set request body size limit at Hono app level
- Monitor memory usage in production
- Document for Phase 5: migrate to streaming when moving to Cloudflare R2

**Warning signs:**
- Server becoming unresponsive during file uploads
- Memory usage spikes in monitoring
- Request timeouts on upload endpoints

### Pitfall 2: Missing Foreign Key Cascades

**What goes wrong:** Deleting a course leaves orphaned sessions in database. Breaks referential integrity and causes query errors.

**Why it happens:** Forgetting `onDelete: 'cascade'` in Drizzle foreign key definitions.

**How to avoid:**
```typescript
// CORRECT
export const courseSessions = pgTable('course_sessions', {
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }), // Add this
})

// WRONG - orphans sessions when course deleted
export const courseSessions = pgTable('course_sessions', {
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id),
})
```

**Warning signs:**
- Foreign key constraint errors when querying
- Ghost records appearing in counts
- "Record not found" errors for valid-looking IDs

### Pitfall 3: Enum Value Order Changes

**What goes wrong:** PostgreSQL enums maintain insertion order. Adding values in wrong position requires manual ALTER TYPE statements.

**Why it happens:** Drizzle-kit generates migrations that append new enum values to end by default.

**How to avoid:**
- Plan enum values upfront (draft, published, archived is sufficient)
- If must add value in middle, use manual migration with `ADD VALUE ... BEFORE/AFTER`
- Document enum order in schema comments

**Warning signs:**
- Migration fails with "enum value already exists"
- Enum values appear in wrong order in database tools

### Pitfall 4: Timezone Confusion in Timestamps

**What goes wrong:** Timestamps display in unexpected timezone, or comparisons fail due to timezone mismatches.

**Why it happens:** PostgreSQL `timestamp with timezone` converts to database timezone. Mixing `date` mode vs `string` mode in Drizzle causes inconsistency.

**How to avoid:**
```typescript
// Pick ONE mode and use consistently
export const courses = pgTable('courses', {
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

// Don't mix modes in same table
```

- Use `timestamp with timezone` for user-facing dates (cohort start/end)
- Use `.defaultNow()` or `sql`now()`` for consistency
- Always use mode: 'date' for JavaScript Date handling

**Warning signs:**
- Timestamps off by several hours
- Date comparisons returning wrong results
- createdAt showing future dates

### Pitfall 5: Missing Input Sanitization Assumption

**What goes wrong:** Developer assumes Zod validation prevents XSS, but validation doesn't sanitize HTML content.

**Why it happens:** Validation checks structure, not content safety. Rich text editor output can contain malicious scripts.

**How to avoid:**
- Document clearly: **API stores raw HTML, frontend MUST sanitize before render**
- Add comment in schema: "Content contains unsanitized HTML"
- Consider adding Content-Security-Policy headers
- For v1, trust admin users (internal tool), but document for Phase 5

**Warning signs:**
- XSS vulnerability reports
- Script tags executing in rendered content
- Content-Security-Policy violations

### Pitfall 6: File System Race Conditions

**What goes wrong:** Two requests upload files with same original name simultaneously, one overwrites the other.

**Why it happens:** Checking existence then writing is not atomic.

**How to avoid:**
- Always use `randomUUID()` for filenames (eliminates race condition)
- Never use original filename directly
- Store original filename in database metadata only

**Warning signs:**
- Users report uploaded files "disappearing"
- File count doesn't match database records
- Files with unexpected content

## Code Examples

Verified patterns from official sources:

### CRUD Endpoint Structure

```typescript
// Source: Hono best practices + existing codebase patterns

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db/index.js'
import { courses } from '../db/schema/courses.js'
import { authMiddleware, requireAdmin, AuthEnv } from '../middleware/auth.js'

const courseRoutes = new Hono<AuthEnv>()

// Validation schemas
const createCourseSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  content: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  isFreePreview: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

const updateCourseSchema = createCourseSchema.partial()

// LIST: Get all courses (public, filtered by status)
courseRoutes.get('/', async (c) => {
  const status = c.req.query('status') || 'published'

  const courseList = await db.query.courses.findMany({
    where: eq(courses.status, status),
    orderBy: [desc(courses.createdAt)],
    with: {
      sessions: {
        orderBy: [asc(courseSessions.sessionOrder)],
      },
    },
  })

  return c.json({ courses: courseList })
})

// GET: Single course by ID or slug
courseRoutes.get('/:idOrSlug', async (c) => {
  const param = c.req.param('idOrSlug')
  const isId = /^\d+$/.test(param)

  const course = isId
    ? await db.query.courses.findFirst({
        where: eq(courses.id, Number(param)),
        with: { sessions: true },
      })
    : await db.query.courses.findFirst({
        where: eq(courses.slug, param),
        with: { sessions: true },
      })

  if (!course) {
    return c.json({ error: 'Course not found' }, 404)
  }

  return c.json({ course })
})

// CREATE: New course (admin only)
courseRoutes.post('/',
  authMiddleware,
  requireAdmin(),
  zValidator('json', createCourseSchema),
  async (c) => {
    const data = c.req.valid('json')
    const userId = c.get('userId')

    // Generate unique slug
    const baseSlug = generateSlug(data.title)
    const slug = await createUniqueSlug(baseSlug, 'courses')

    const [course] = await db.insert(courses).values({
      ...data,
      slug,
      createdBy: userId,
    }).returning()

    return c.json({ course }, 201)
  }
)

// UPDATE: Existing course (admin only)
courseRoutes.patch('/:id',
  authMiddleware,
  requireAdmin(),
  zValidator('json', updateCourseSchema),
  async (c) => {
    const id = Number(c.req.param('id'))
    const data = c.req.valid('json')

    // If title changed, regenerate slug
    if (data.title) {
      const baseSlug = generateSlug(data.title)
      const slug = await createUniqueSlug(baseSlug, 'courses')
      data.slug = slug
    }

    data.updatedAt = new Date()

    const [course] = await db.update(courses)
      .set(data)
      .where(eq(courses.id, id))
      .returning()

    if (!course) {
      return c.json({ error: 'Course not found' }, 404)
    }

    return c.json({ course })
  }
)

// DELETE: Remove course (admin only)
courseRoutes.delete('/:id',
  authMiddleware,
  requireAdmin(),
  async (c) => {
    const id = Number(c.req.param('id'))

    const deleted = await db.delete(courses)
      .where(eq(courses.id, id))
      .returning({ id: courses.id })

    if (!deleted.length) {
      return c.json({ error: 'Course not found' }, 404)
    }

    return c.json({ message: 'Course deleted successfully' })
  }
)

export default courseRoutes
```

### File Upload with Validation

```typescript
// Source: Zod file validation + Hono parseBody
// References:
// - https://www.codu.co/niall/validate-an-image-file-with-zod-jjhied8p
// - https://dev.to/aaronksaunders/quick-rest-api-file-upload-with-hono-js-and-drizzle-49ok

import { randomUUID } from 'crypto'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { join } from 'path'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const ALLOWED_TEMPLATE_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

// File validation helper
function validateFile(file: File, allowedTypes: string[], maxSize: number) {
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`)
  }

  return true
}

// Image upload endpoint
courseRoutes.post('/upload-thumbnail',
  authMiddleware,
  requireAdmin(),
  async (c) => {
    const body = await c.req.parseBody()
    const file = body.thumbnail

    if (!file || typeof file === 'string') {
      return c.json({ error: 'Thumbnail file required' }, 400)
    }

    try {
      validateFile(file, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE)
    } catch (error) {
      return c.json({ error: error.message }, 400)
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'uploads', 'images')
    const filepath = join(uploadDir, filename)

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/images/${filename}`

    return c.json({
      url: publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    }, 201)
  }
)

// Template upload endpoint
templateRoutes.post('/',
  authMiddleware,
  requireAdmin(),
  async (c) => {
    const body = await c.req.parseBody()
    const file = body.file
    const title = body.title as string
    const description = body.description as string

    if (!file || typeof file === 'string') {
      return c.json({ error: 'File required' }, 400)
    }

    if (!title) {
      return c.json({ error: 'Title required' }, 400)
    }

    try {
      validateFile(file, ALLOWED_TEMPLATE_TYPES, MAX_FILE_SIZE)
    } catch (error) {
      return c.json({ error: error.message }, 400)
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'uploads', 'templates')
    const filepath = join(uploadDir, filename)

    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    // Save metadata to database
    const [template] = await db.insert(templates).values({
      title,
      description,
      originalFilename: file.name,
      filename,
      filepath: `/uploads/templates/${filename}`,
      fileSize: file.size,
      mimeType: file.type,
      uploadedBy: c.get('userId'),
    }).returning()

    return c.json({ template }, 201)
  }
)

// Template download endpoint
templateRoutes.get('/:id/download', async (c) => {
  const id = Number(c.req.param('id'))

  const template = await db.query.templates.findFirst({
    where: eq(templates.id, id)
  })

  if (!template) {
    return c.json({ error: 'Template not found' }, 404)
  }

  // Check if user has access (members only, unless free preview)
  const userTier = c.get('userTier')
  if (!template.isFreePreview && userTier !== 'member') {
    return c.json({ error: 'Member access required' }, 403)
  }

  const filepath = join(process.cwd(), 'uploads', 'templates', template.filename)
  const fileBuffer = await readFile(filepath)

  return c.body(fileBuffer, {
    headers: {
      'Content-Type': template.mimeType,
      'Content-Disposition': `attachment; filename="${template.originalFilename}"`,
      'Content-Length': template.fileSize.toString(),
    },
  })
})
```

### Complete Database Schema Example

```typescript
// Source: Drizzle ORM documentation + research findings

// db/schema/courses.ts
import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived'])

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  content: text('content'), // HTML from rich text editor - UNSANITIZED, frontend must sanitize
  status: contentStatusEnum('status').notNull().default('draft'),
  isFreePreview: boolean('is_free_preview').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

export const courseSessions = pgTable('course_sessions', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  sessionOrder: integer('session_order').notNull(),
  durationMinutes: integer('duration_minutes'),
  videoUrl: varchar('video_url', { length: 500 }), // For Phase 5
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

export const coursesRelations = relations(courses, ({ many }) => ({
  sessions: many(courseSessions),
}))

export const courseSessionsRelations = relations(courseSessions, ({ one }) => ({
  course: one(courses, {
    fields: [courseSessions.courseId],
    references: [courses.id],
  }),
}))

// db/schema/research.ts
export const researchReports = pgTable('research_reports', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  summary: text('summary'),
  content: text('content'), // HTML content
  publishedAt: timestamp('published_at', { mode: 'date' }),
  status: contentStatusEnum('status').notNull().default('draft'),
  isFreePreview: boolean('is_free_preview').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

// db/schema/templates.ts
export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  filename: varchar('filename', { length: 255 }).notNull().unique(), // UUID-based
  filepath: varchar('filepath', { length: 500 }).notNull(), // /uploads/templates/uuid.pdf
  fileSize: integer('file_size').notNull(), // bytes
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  isFreePreview: boolean('is_free_preview').default(false).notNull(),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

// db/schema/cohorts.ts
export const cohortStatusEnum = pgEnum('cohort_status', ['upcoming', 'open', 'closed', 'completed'])

export const cohorts = pgTable('cohorts', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(), // e.g., "Q1 2026 Cohort"
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
  enrollmentOpenDate: timestamp('enrollment_open_date', { mode: 'date' }),
  enrollmentCloseDate: timestamp('enrollment_close_date', { mode: 'date' }),
  status: cohortStatusEnum('status').notNull().default('upcoming'),
  maxParticipants: integer('max_participants'), // For v2
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

export const cohortSessions = pgTable('cohort_sessions', {
  id: serial('id').primaryKey(),
  cohortId: integer('cohort_id')
    .notNull()
    .references(() => cohorts.id, { onDelete: 'cascade' }),
  courseSessionId: integer('course_session_id')
    .references(() => courseSessions.id, { onDelete: 'set null' }), // Optional link
  title: varchar('title', { length: 255 }).notNull(),
  scheduledAt: timestamp('scheduled_at', { mode: 'date' }).notNull(),
  zoomLink: varchar('zoom_link', { length: 500 }),
  recordingUrl: varchar('recording_url', { length: 500 }),
  sessionOrder: integer('session_order').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

export const cohortsRelations = relations(cohorts, ({ one, many }) => ({
  course: one(courses, {
    fields: [cohorts.courseId],
    references: [courses.id],
  }),
  sessions: many(cohortSessions),
}))

export const cohortSessionsRelations = relations(cohortSessions, ({ one }) => ({
  cohort: one(cohorts, {
    fields: [cohortSessions.cohortId],
    references: [cohorts.id],
  }),
}))
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Controller classes | Resource routing with inline handlers | Hono v4+ | Better TypeScript inference, simpler code |
| Manual JOINs | Drizzle `with` queries | Drizzle 0.29+ | Type-safe relations, single SQL query |
| Multer middleware | Native `parseBody()` | Hono v3+ | No dependencies, simpler API |
| JSON enum config | PostgreSQL enum types | Drizzle 0.16+ | Database-level validation, type safety |
| Separate foreign key + relation | Unified `references()` syntax | Drizzle 0.30+ | Cleaner schema definitions |

**Deprecated/outdated:**
- **Storing secrets in .env committed to git:** Use env.example template + actual .env gitignored (already implemented in Phase 2)
- **Password hashing with bcrypt:** Argon2 is newer standard, more resistant to attacks (already using in Phase 2)
- **Storing boolean flags for status:** Enums are more maintainable and extensible
- **UUID v4 in application code:** `crypto.randomUUID()` is native Node.js 14.17+, no library needed

## Open Questions

Things that couldn't be fully resolved:

1. **Admin role storage**
   - What we know: Need to add `role` field to users table and JWT payload
   - What's unclear: Should admins be separate user tier ('admin') or separate role field ('user'/'admin') with tier ('free'/'member')?
   - Recommendation: Add separate `role` varchar column (default 'user'). Tier controls content access, role controls admin actions. This matches future need for 'member' users who aren't admins.

2. **File upload size enforcement**
   - What we know: Zod validates after parsing, `parseBody()` loads into memory first
   - What's unclear: Can Hono reject before parsing to prevent memory issues?
   - Recommendation: Add middleware to check `Content-Length` header before `parseBody()`. Document for Phase 5 migration to streaming.

3. **Cohort enrollment management**
   - What we know: Requirements mention COHO-04, COHO-05 (member enrollment, schedule viewing)
   - What's unclear: Phase 3 description focuses on admin creation, not member enrollment
   - Recommendation: Phase 3 implements admin CRUD only (COHO-01, COHO-02, COHO-03). Member enrollment (COHO-04, COHO-05) likely Phase 5 when building member dashboard.

## Sources

### Primary (HIGH confidence)

- **Hono Documentation** - https://hono.dev/docs/guides/best-practices - Route organization, middleware patterns
- **Hono File Upload Examples** - https://hono.dev/examples/file-upload - parseBody() usage
- **Drizzle ORM Relations v2** - https://orm.drizzle.team/docs/relations-v2 - Relational queries with `with`
- **Drizzle PostgreSQL Column Types** - https://orm.drizzle.team/docs/column-types/pg - Timestamp modes, text vs varchar
- **Drizzle ORM PostgreSQL Best Practices (2025)** - https://gist.github.com/productdevbook/7c9ce3bbeb96b3fabc3c7c2aa2abc717 - Enum patterns
- **Quick REST API File Upload with Hono JS and Drizzle** - https://dev.to/aaronksaunders/quick-rest-api-file-upload-with-hono-js-and-drizzle-49ok - Complete implementation

### Secondary (MEDIUM confidence)

- **Validate an Image File with Zod** - https://www.codu.co/niall/validate-an-image-file-with-zod-jjhied8p - File validation patterns
- **PostgreSQL Slug Generation Tutorial** - https://www.timsanteford.com/posts/automating-url-slug-generation-in-postgresql-with-triggers-and-functions/ - Slug automation
- **File Uploads in Node.js the Safe Way** - https://dev.to/prateekshaweb/file-uploads-in-nodejs-the-safe-way-validation-limits-and-storing-to-s3-4a86 - Security best practices
- **PostgreSQL JSONB vs Separate Tables** - https://www.heap.io/blog/when-to-avoid-jsonb-in-a-postgresql-schema - Query planner limitations
- **Add Role-Based Access Control On Top Of Your REST API** - https://marmelab.com/blog/2025/10/16/rbac-rest-middleware.html - Authorization patterns
- **REST API Design 2026** - https://miracl.in/blog/rest-api-design-2026/ - Modern API patterns

### Tertiary (LOW confidence)

- **WebSearch results** - Various community discussions and tutorials for ecosystem context

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use from Phase 1-2, official docs confirm patterns
- Architecture: HIGH - Hono + Drizzle patterns well-documented, existing codebase provides template
- File handling: MEDIUM - parseBody() documented but production edge cases need testing
- Pitfalls: HIGH - Common issues documented in official sources and community discussions

**Research date:** 2026-01-26
**Valid until:** 30 days (stable technologies, but verify Drizzle updates before implementing)
