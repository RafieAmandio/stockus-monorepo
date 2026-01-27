---
phase: 06-frontend-public-pages
plan: 03
subsystem: ui
tags: [nextjs, react, seo, json-ld, shadcn-ui]

# Dependency graph
requires:
  - phase: 06-01
    provides: Next.js foundation with layout components and shadcn/ui
provides:
  - About Us page with team profiles and Person JSON-LD
  - Community page with Discord tier comparison
affects: [07-frontend-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [Person JSON-LD for team members, tier comparison cards]

key-files:
  created:
    - frontend/src/app/about/page.tsx
    - frontend/src/app/community/page.tsx
  modified: []

key-decisions:
  - "Used Person JSON-LD schema for team member structured data"
  - "Discord link placeholder (https://discord.gg/stockus) for free tier CTA"
  - "Two-tier community model: Free (public Discord) vs Premium (members-only channels)"

patterns-established:
  - "Hero section with gradient background for content pages"
  - "Feature list with check icons for comparison cards"
  - "Dark CTA section pattern for bottom-of-page conversion"

# Metrics
duration: 3min
completed: 2026-01-27
---

# Phase 06 Plan 03: About & Community Pages Summary

**About and Community pages with team profiles (Person JSON-LD), Discord tier comparison, and responsive mobile layouts**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-27T15:31:53Z
- **Completed:** 2026-01-27T15:34:53Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- About Us page with hero, mission, team profiles, and values sections
- Person JSON-LD structured data for Jefta (Founder) and Yosua (Co-Founder)
- Community page explaining Discord community value with free vs premium tiers
- Feature comparison cards with check icons for both community tiers
- Community guidelines numbered list with 6 professional conduct rules
- Dark CTA section with dual CTAs for free and premium conversion
- SEO metadata with Indonesian titles and descriptions for both pages
- Mobile responsive layouts with proper grid breakpoints

## Task Commits

Each task was committed atomically:

1. **Task 1: Create About Us Page** - `60f48e5` (feat)
2. **Task 2: Create Community Page** - `31c0b08` (feat)

## Files Created/Modified
- `frontend/src/app/about/page.tsx` - About Us page with hero, mission, team section (Jefta/Yosua with avatar placeholders), values section (3 core principles), Person JSON-LD for team members, SEO metadata
- `frontend/src/app/community/page.tsx` - Community page with hero, "Mengapa Bergabung?" section, Free vs Premium tier comparison cards (4 vs 7 features with check icons), community guidelines (6 rules numbered), dark CTA section with dual CTAs, SEO metadata

## Decisions Made

**Person JSON-LD for team members**
- Used @graph array to include multiple Person entities in one JSON-LD block
- Each person has @type: Person with name, jobTitle, description, and worksFor organization link
- Improves SEO and enables rich results for team member searches

**Discord community tier structure**
- Free tier: public Discord channels with 4 basic features (general discussion, market updates, weekly tips, networking)
- Premium tier: members-only channels with 7 premium features (includes all free + research channels, instructor access, Q&A sessions, course channels, templates, priority support)
- Free tier CTA links to Discord (https://discord.gg/stockus placeholder)
- Premium tier CTA links to /pricing page for membership purchase

**Avatar placeholder pattern**
- Used initials in colored circles (bg-slate-200) instead of image paths for team member avatars
- Simpler than managing placeholder images, consistent visual appearance
- Easy to replace with real photos later by updating image path

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - build completed successfully. ECONNREFUSED errors during static generation are expected (backend API not running at build time).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- About and Community pages complete with proper navigation links
- /pricing page needed next (referenced in Premium tier CTA)
- Discord invite link placeholder needs real URL when Discord server is created
- Team member photos can be added to /public/team/ directory when available

---
*Phase: 06-frontend-public-pages*
*Completed: 2026-01-27*
