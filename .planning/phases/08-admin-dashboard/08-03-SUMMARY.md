---
phase: 08-admin-dashboard
plan: 03
subsystem: ui
tags: [next.js, react, admin-dashboard, metrics, indonesian-locale]

# Dependency graph
requires:
  - phase: 08-01
    provides: Admin route group, AdminSidebar, backend /admin/metrics endpoint
  - phase: 08-02
    provides: MetricCard component pattern (though created separately)
provides:
  - Admin dashboard page with 4 KPI metrics cards
  - MetricCard component for metric display
  - Server-side admin API client (admin-server.ts)
  - IDR currency formatting for Indonesian locale
affects: [08-04, 08-05, 08-06] # Other admin pages will use similar patterns

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server-side admin API client pattern (admin-server.ts) separate from client-side
    - Indonesian locale formatting for currency display
    - Quick actions card pattern for common admin tasks

key-files:
  created:
    - frontend/src/lib/api/admin-server.ts
    - frontend/src/components/admin/MetricCard.tsx
  modified:
    - frontend/src/app/(admin)/admin/page.tsx
    - frontend/src/lib/api-client.ts
    - frontend/src/lib/api-client-server.ts

key-decisions:
  - "Separate admin-server.ts from admin.ts: Server components need cookie forwarding, client components use credentials"
  - "Split api-client.ts into server/client files: Fixes import error when client components import server-only code"
  - "IDR currency formatting: Uses Indonesian locale (id-ID) for target audience"

patterns-established:
  - "Admin API pattern: admin-server.ts for server components with adminFetch helper"
  - "Metrics display: Grid of MetricCard components with responsive layout"
  - "Quick actions: Card with links to common create pages"

# Metrics
duration: 6.0min
completed: 2026-01-30
---

# Phase 08 Plan 03: Dashboard Metrics Page Summary

**Admin dashboard with 4 KPI cards (members, revenue, subscriptions, orders) using IDR currency formatting and server-side metrics fetching**

## Performance

- **Duration:** 6.0 min (362 seconds)
- **Started:** 2026-01-29T17:23:06Z
- **Completed:** 2026-01-29T17:29:08Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments
- Server-side admin API client with metrics, users, and orders functions
- MetricCard component for clean KPI display
- Dashboard page showing 4 key metrics with IDR formatting
- Quick actions card with links to create courses/research/templates

## Task Commits

Each task was committed atomically:

1. **Task 1: Create admin API client** - `37e8e92` (feat)
2. **Task 2: Create MetricCard component** - `25d07ed` (feat)
3. **Task 3: Build dashboard page with metrics** - `0039958` (feat)

**Bug fixes committed separately:**
- `3c80c4a` - Split api-client to fix client component import error
- `39c6713` - Fix course form schema TypeScript errors

## Files Created/Modified

### Created
- `frontend/src/lib/api/admin-server.ts` - Server-side admin API client with cookie forwarding
- `frontend/src/components/admin/MetricCard.tsx` - KPI display card component
- `frontend/src/lib/api-client-server.ts` - Server-only API client (split from api-client.ts)

### Modified
- `frontend/src/app/(admin)/admin/page.tsx` - Dashboard with metrics and quick actions
- `frontend/src/lib/api-client.ts` - Removed server-only code (now client-only)
- `frontend/src/app/(auth)/cohorts/page.tsx` - Updated import to api-client-server
- `frontend/src/app/(auth)/courses/[slug]/[sessionId]/page.tsx` - Updated import to api-client-server
- `frontend/src/app/(auth)/courses/[slug]/page.tsx` - Updated import to api-client-server
- `frontend/src/app/(auth)/courses/page.tsx` - Updated import to api-client-server
- `frontend/src/app/(auth)/downloads/page.tsx` - Updated import to api-client-server
- `frontend/src/app/(auth)/research/[slug]/page.tsx` - Updated import to api-client-server
- `frontend/src/app/(auth)/research/page.tsx` - Updated import to api-client-server

### Auto-created by prior work
- `frontend/src/app/(admin)/admin/courses/[id]/page.tsx` - Edit course page (fixed schema)
- `frontend/src/app/(admin)/admin/courses/new/page.tsx` - New course page (fixed schema)

## Decisions Made

**1. Separate admin-server.ts from admin.ts**
- admin.ts handles client-side API calls (courses, templates, research)
- admin-server.ts handles server-side API calls (metrics, users, orders)
- Rationale: Server components need cookie forwarding via headers, client components use credentials: 'include'

**2. Split api-client.ts into server and client files**
- Original api-client.ts imported 'next/headers' at module level
- This broke when imported in client components
- Solution: api-client-server.ts for server-only, api-client.ts for client-only
- Rationale: Next.js strict separation between server and client code

**3. Indonesian locale for currency**
- Used 'id-ID' locale for Intl.NumberFormat
- Displays as "Rp 2.500.000" format
- Rationale: Target audience is Indonesian investors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Split api-client.ts to fix import error**
- **Found during:** Task 3 (Building dashboard page)
- **Issue:** api-client.ts imported 'next/headers' at top level, breaking client component builds with error "You're importing a component that needs 'next/headers'. That only works in a Server Component"
- **Fix:** Created api-client-server.ts with server-only code, kept api-client.ts as client-only, updated 7 server component imports to use new file
- **Files modified:** frontend/src/lib/api-client.ts, frontend/src/lib/api-client-server.ts, 7 page files in (auth) route group
- **Verification:** Build succeeds, TypeScript compiles without errors
- **Committed in:** `3c80c4a`

**2. [Rule 1 - Bug] Fixed course form Zod schema TypeScript errors**
- **Found during:** Task 3 build verification
- **Issue:** Course form schemas had type conflicts between useForm generic type and zodResolver inferred type. Schema used .default() but form expected required fields, causing TypeScript error: "Type 'string | undefined' is not assignable to type 'string'"
- **Fix:** Let linter auto-fix schemas to use CourseFormData type from admin.ts with proper .optional() modifiers and satisfies constraint
- **Files modified:** frontend/src/app/(admin)/admin/courses/[id]/page.tsx, frontend/src/app/(admin)/admin/courses/new/page.tsx
- **Verification:** Build succeeds, TypeScript compilation passes
- **Committed in:** `39c6713`

**3. [Rule 3 - Blocking] Created admin-server.ts instead of overwriting admin.ts**
- **Found during:** Task 1 execution
- **Issue:** Plan specified creating frontend/src/lib/api/admin.ts but this file already existed with course/template/research management functions. Writing new content would overwrite existing functionality.
- **Fix:** Created admin-server.ts for server-side functions (metrics, users, orders) separate from existing admin.ts (client-side CRUD)
- **Files modified:** frontend/src/lib/api/admin-server.ts (created)
- **Verification:** Both files coexist, imports work correctly
- **Committed in:** `37e8e92` (Task 1)

---

**Total deviations:** 3 auto-fixed (2 blocking, 1 bug)
**Impact on plan:** All fixes necessary for build success and type safety. Separation of server/client API clients is architectural improvement following Next.js best practices. No scope creep.

## Issues Encountered

**1. api-client.ts module-level import issue**
- Problem: Importing 'next/headers' at module level breaks client component usage
- Root cause: Next.js requires strict separation of server-only code
- Solution: Split file into api-client-server.ts (with 'server-only' directive) and api-client.ts (client-only)
- Lesson: Always use 'server-only' directive for files importing Next.js server APIs

**2. Zod schema type inference complexity**
- Problem: Complex interplay between .optional(), .default(), and useForm generics
- Root cause: Zod infers output type differently than input type with defaults
- Solution: Let TypeScript/linter infer types, use satisfies for validation
- Lesson: Avoid manual type annotations on Zod-validated forms, let inference work

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Plan 04 (Course Management):**
- Admin API patterns established (server vs client)
- MetricCard component available for reuse
- Dashboard provides overview of system metrics

**Ready for Plan 05 (Research/Template Management):**
- Same patterns apply for content management pages
- admin-server.ts provides getAdminUsers/Orders for reference

**Architecture notes:**
- admin-server.ts for server components (metrics, lists)
- admin.ts for client components (CRUD forms)
- MetricCard pattern can be reused for other metric displays

**No blockers.**

---
*Phase: 08-admin-dashboard*
*Completed: 2026-01-30*
