---
phase: 07-frontend-member-area
plan: 08
subsystem: ui
tags: [next.js, react, typescript, cohorts, schedule]

# Dependency graph
requires:
  - phase: 07-03
    provides: Member area layout with sidebar navigation
  - phase: 04-01
    provides: Cohorts schema and status enum
provides:
  - Cohorts page showing available cohorts with schedules
  - CohortCard component with status badges and tier-aware actions
  - Status-based cohort grouping (open, upcoming, past)
  - Session schedule preview display
affects: [07-10-enrollment, future-cohort-detail-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Status-based content grouping for cohorts
    - Tier-aware enrollment actions (free users see upgrade prompts)
    - Session preview pattern (show first 3 sessions)

key-files:
  created:
    - frontend/src/components/member/CohortCard.tsx
    - frontend/src/app/(auth)/cohorts/page.tsx
  modified:
    - frontend/src/types/index.ts

key-decisions:
  - "CohortWithSessions extends Cohort with sessions array and course reference"
  - "Status-based grouping: open (active enrollment), upcoming (announced), past (closed/completed)"
  - "Session preview shows first 3 sessions sorted by sessionOrder"
  - "Indonesian date/time formatting with id-ID locale"

patterns-established:
  - "Cohort status configuration pattern: label and variant for each status type"
  - "Spots left calculation: maxParticipants - enrolledCount (null if no cap)"
  - "Tier-gated enrollment: members can enroll in open cohorts, free users see upgrade prompt"

# Metrics
duration: 3min
completed: 2026-01-29
---

# Phase 7 Plan 8: Cohorts Page with Schedule Display Summary

**Cohorts page with status-grouped cards showing schedules, enrollment status, and tier-aware actions for members and free users**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-29T16:40:15Z
- **Completed:** 2026-01-29T16:43:23Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- CohortCard component displays cohort schedule, status badge, spots left, session preview, and tier-aware enrollment buttons
- Cohorts page groups cohorts by status (open, upcoming, past) with appropriate sections
- Free users see locked enrollment with upgrade prompts, members see active enrollment buttons
- Session schedule preview shows first 3 sessions with formatted dates and times

## Task Commits

Each task was committed atomically:

1. **Task 1: Update types and create cohort components** - `4aaf314` (feat)
2. **Task 2: Create cohorts page** - `72dc554` (feat)

**Deviation fix:** `c0262b5` (fix - duplicate route removal)

**Plan metadata:** _To be added in final commit_

## Files Created/Modified
- `frontend/src/types/index.ts` - Added CohortSession and CohortWithSessions interfaces
- `frontend/src/components/member/CohortCard.tsx` - Cohort display card with status, schedule, enrollment actions
- `frontend/src/app/(auth)/cohorts/page.tsx` - Cohorts list page with status-based grouping

## Decisions Made

**CohortWithSessions interface:**
- Extends Cohort but replaces `title`/`description` with `name` to match backend schema
- Includes `sessions` array for schedule preview
- Optional `course` reference for displaying course title

**Status-based grouping:**
- Open cohorts: enrollment currently active
- Upcoming cohorts: announced but not open yet
- Past cohorts: closed or completed (limit to 6 for brevity)

**Session preview pattern:**
- Display first 3 sessions sorted by sessionOrder
- Show formatted date and time with Indonesian locale
- Indicate remaining sessions count if more than 3

**Tier-aware enrollment actions:**
- Members see "Daftar Sekarang" or "Daftar & Bayar" for open cohorts
- Free users see "Upgrade untuk Daftar" button linking to pricing
- Disabled states for upcoming, closed, or full cohorts

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed duplicate public research route**
- **Found during:** Task 2 (Build verification)
- **Issue:** Next.js build failed with error "You cannot have two parallel pages that resolve to the same path" - both `/research/page.tsx` and `/(auth)/research/page.tsx` existed
- **Fix:** Removed public `/research/page.tsx` since research should be tier-gated and behind authentication
- **Files modified:** frontend/src/app/research/page.tsx (deleted)
- **Verification:** Build succeeded after removal, `/research` route now serves authenticated tier-gated page
- **Committed in:** c0262b5 (separate blocking fix commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix to unblock build verification. Removed conflicting public research route in favor of authenticated tier-gated version. No scope creep.

## Issues Encountered
None - tasks executed as planned after blocking route conflict was resolved.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Cohorts page complete and ready for enrollment flow implementation (plan 07-10)
- Backend cohorts API includes session data via relations
- Frontend ready to display cohort schedules and collect enrollments
- No blockers for subsequent plans

---
*Phase: 07-frontend-member-area*
*Completed: 2026-01-29*
