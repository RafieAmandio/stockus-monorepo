---
phase: 03-content-api
plan: 06
subsystem: content-management
tags: [cohorts, sessions, scheduling, zoom, admin-crud]

requires:
  - 03-01 (content schemas)
  - 02-03 (auth middleware)
  - 02-04 (admin middleware)

provides:
  endpoints:
    - GET /cohorts (list cohorts)
    - GET /cohorts/:id (get cohort with sessions)
    - POST /cohorts (create cohort)
    - PATCH /cohorts/:id (update cohort)
    - DELETE /cohorts/:id (soft delete cohort)
    - POST /cohorts/:cohortId/sessions (add session)
    - PATCH /cohorts/:cohortId/sessions/:sessionId (update session)
    - DELETE /cohorts/:cohortId/sessions/:sessionId (delete session)

affects:
  - 04-xx (enrollment will use these cohort endpoints)
  - 05-xx (live sessions will need Zoom link integration)

tech-stack:
  added: []
  patterns:
    - cohort-session-management
    - scheduled-course-delivery
    - zoom-integration-ready

key-files:
  created:
    - backend/src/routes/cohorts.ts
  modified:
    - backend/src/routes/index.ts

decisions: []

metrics:
  duration: 2m 2s
  tasks-completed: 2
  commits: 2
  completed: 2026-01-26
---

# Phase 3 Plan 6: Cohort Management API Summary

**One-liner:** Complete CRUD API for cohorts and sessions with enrollment windows, Zoom links, and soft delete support

## What Was Built

### Cohort Management Routes (8 endpoints)

**Public Endpoints (auth required):**
1. **GET /cohorts** - List all active cohorts with course info
2. **GET /cohorts/:id** - Get cohort details with all sessions ordered by sessionOrder

**Admin-only Endpoints:**

Cohort CRUD:
3. **POST /cohorts** - Create cohort with dates, enrollment windows, max participants
4. **PATCH /cohorts/:id** - Update cohort details including status
5. **DELETE /cohorts/:id** - Soft delete cohort (sets deletedAt)

Session CRUD:
6. **POST /cohorts/:cohortId/sessions** - Add session with Zoom link and schedule
7. **PATCH /cohorts/:cohortId/sessions/:sessionId** - Update session details
8. **DELETE /cohorts/:cohortId/sessions/:sessionId** - Hard delete session

### Key Features

**Cohort Management:**
- Time-bound course instances with start/end dates
- Enrollment windows (open/close dates) for registration control
- Status tracking: upcoming, open, closed, completed
- Max participants limit
- Course relationship verification
- Soft delete preserves history

**Session Scheduling:**
- Individual sessions linked to cohort
- Scheduled date/time for each session
- Zoom link storage for live sessions
- Optional recording URL for post-session access
- Session ordering for proper sequence
- Optional link to course session template

**Data Handling:**
- ISO 8601 datetime strings converted to Date objects
- Zod validation on all inputs
- Proper date field handling with `{ mode: 'date' }` schema
- Admin verification via requireAdmin() middleware

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

None - followed established patterns from Phase 3.

## Next Phase Readiness

**Ready for Phase 4:**
- Cohort API complete for enrollment system
- Session schedules in place for live course delivery
- Zoom link structure ready for integration

**Considerations:**
- Enrollment endpoints will need to check cohort capacity (maxParticipants)
- Enrollment window validation (open/close dates) should be enforced
- Session attendance tracking will be needed in future phase
- Cohort status updates (upcoming → open → closed → completed) may need automation

## Testing Notes

**Manual verification steps:**
1. Create cohort for a course (requires admin access)
2. Add sessions with Zoom links to the cohort
3. List cohorts as authenticated user
4. Get cohort details with sessions
5. Update cohort status and session schedule
6. Delete session and soft-delete cohort

**TypeScript compilation:** Verified with `npx tsc --noEmit` - no errors

## Task Breakdown

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create cohort routes with CRUD operations | 6282245 | backend/src/routes/cohorts.ts |
| 2 | Mount cohort routes | a773726 | backend/src/routes/index.ts |

**Total:** 2 tasks, 2 commits, 2m 2s
