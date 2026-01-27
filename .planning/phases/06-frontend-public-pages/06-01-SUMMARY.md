---
phase: 06-frontend-public-pages
plan: 01
subsystem: frontend-foundation
tags: [nextjs, shadcn-ui, tailwind, typescript, layout, responsive]

requires:
  - 05-02 (Video API Routes)
provides:
  - Next.js app infrastructure
  - shadcn/ui component library
  - API client for backend communication
  - Header/Footer layout components
  - Mobile navigation
affects:
  - 06-02 (Homepage)
  - 06-03 (Courses page)
  - 06-04 (Research page)
  - 06-05 (Pricing/About pages)

tech-stack:
  added:
    - Next.js 15
    - shadcn/ui
    - Tailwind CSS
    - lucide-react
  patterns:
    - Server Components by default
    - Client Components for interactivity ('use client')
    - API client with revalidation support
    - Responsive mobile-first design

key-files:
  created:
    - frontend/src/app/layout.tsx (Root layout with Header/Footer)
    - frontend/src/lib/api.ts (API client)
    - frontend/src/lib/constants.ts (Site metadata)
    - frontend/src/types/index.ts (TypeScript interfaces)
    - frontend/src/components/layout/Header.tsx
    - frontend/src/components/layout/Footer.tsx
    - frontend/src/components/layout/MobileNav.tsx
    - frontend/src/components/ui/* (shadcn components)
  modified: []

decisions:
  - decision: "Next.js 15 with App Router"
    rationale: "Server Components by default, improved performance, nested layouts"
    alternatives: "Pages Router (legacy)"
    impact: "Modern React patterns, better SEO, faster page loads"

  - decision: "shadcn/ui over pre-built component library"
    rationale: "Copy-paste components into codebase, full customization, no runtime overhead"
    alternatives: "MUI, Chakra UI, Mantine"
    impact: "Components are owned code, can modify without library constraints"

  - decision: "Inter font over Geist"
    rationale: "Widely used, good readability, professional appearance"
    alternatives: "Geist (Next.js default), custom fonts"
    impact: "Consistent typography across platform"

  - decision: "Indonesian locale (id_ID) and language (id)"
    rationale: "Target audience is Indonesian investors"
    alternatives: "English (en_US)"
    impact: "Better SEO for Indonesian market, matches content language"

  - decision: "Sticky header with backdrop blur"
    rationale: "Always accessible navigation, modern aesthetic"
    alternatives: "Static header, fixed header"
    impact: "Better UX, navigation always visible while scrolling"

metrics:
  duration: 5 min
  completed: 2026-01-27
---

# Phase 06 Plan 01: Next.js Foundation & Layout Summary

**One-liner:** Next.js 15 app with shadcn/ui, responsive Header/Footer, mobile drawer navigation, and API client for backend integration.

## What Was Built

Created the foundational Next.js frontend infrastructure that all public pages will use:

1. **Next.js 15 Project Setup**
   - TypeScript, Tailwind CSS, ESLint configured
   - App Router with Server Components
   - Inter font for professional typography
   - Environment variables for backend API

2. **shadcn/ui Component Library**
   - Initialized with New York style and Neutral colors
   - Installed components: button, card, accordion, badge, separator, sheet
   - Components live in codebase (not npm dependency)

3. **API Client Infrastructure**
   - `fetchAPI` helper with revalidation support
   - Configured for backend at localhost:3000
   - TypeScript interfaces for Course, ResearchReport, Cohort, TeamMember

4. **Layout Components**
   - **Header**: Sticky navigation with desktop links and mobile hamburger
   - **Footer**: Product, Company, Legal link sections with copyright
   - **MobileNav**: Sheet component for slide-out drawer on mobile devices
   - Responsive breakpoint at 768px (md: in Tailwind)

5. **Site Configuration**
   - Constants: SITE_NAME, SITE_DESCRIPTION, SITE_URL, MEMBERSHIP_PRICE
   - Navigation links defined in NAV_LINKS array
   - Enhanced metadata with OpenGraph and Twitter cards

## Technical Implementation

**File Structure:**
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx (Root layout with Header/Footer)
│   │   ├── page.tsx (Placeholder homepage)
│   │   └── globals.css (Tailwind base styles)
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── MobileNav.tsx
│   ├── lib/
│   │   ├── api.ts (fetchAPI client)
│   │   ├── constants.ts (Site metadata)
│   │   └── utils.ts (shadcn utilities)
│   └── types/
│       └── index.ts (TypeScript interfaces)
├── .env.local (Environment variables, gitignored)
└── next.config.ts (Image domains, React Compiler)
```

**API Client Pattern:**
```typescript
// Usage example:
const courses = await fetchAPI<Course[]>('/courses', { revalidate: 3600 })
```
- Centralized error handling
- TypeScript generics for type safety
- Next.js revalidation support for ISR

**Responsive Design:**
- Mobile: Hamburger menu with Sheet drawer
- Desktop: Full navigation in header
- Breakpoint: `md:` prefix (768px)

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

1. **Build Verification**: ✓ `npm run build` succeeds without errors
2. **TypeScript Compilation**: ✓ All types validate correctly
3. **Tailwind Styles**: ✓ Classes apply correctly in build output
4. **File Structure**: ✓ All required files created in correct locations
5. **Dependencies**: ✓ All packages installed (466 packages, 0 vulnerabilities)

## Files Changed

**Created (28 files):**
- Frontend application structure
- Layout components (Header, Footer, MobileNav)
- shadcn/ui components (button, card, accordion, badge, separator, sheet)
- API client and TypeScript types
- Configuration files (next.config.ts, tsconfig.json, tailwind via postcss)

**Modified:**
- None (fresh setup)

## Database Changes

None - frontend only.

## Integration Points

**Backend API:**
- Expects API at `http://localhost:3000` (configurable via API_URL env var)
- Ready to fetch from `/courses`, `/research`, `/cohorts` endpoints
- TypeScript interfaces match backend response schemas

**Image Storage:**
- Next.js Image component configured for Cloudflare R2 domains
- Pattern: `*.r2.cloudflarestorage.com`

## Next Phase Readiness

**Ready for:**
- 06-02 (Homepage): Layout and navigation in place
- 06-03 (Courses page): API client ready, Course type defined
- 06-04 (Research page): API client ready, ResearchReport type defined
- 06-05 (Additional pages): Layout structure established

**Blockers:**
None - foundation is complete.

**Concerns:**
None - standard Next.js setup with no unusual patterns.

## Testing Notes

**Manual Verification:**
1. Build succeeds: `npm run build` ✓
2. Dev server starts: `npm run dev -- -p 3001` ✓
3. TypeScript validates: No compilation errors ✓

**Not Tested:**
- Visual rendering (will be verified in 06-02 checkpoint)
- Mobile drawer interaction (will be verified in 06-02 checkpoint)
- API client functionality (will be tested when pages fetch data)

## Performance Notes

**Build Performance:**
- Initial build: ~1.2 seconds
- TypeScript compilation: Clean, no errors
- Static generation: 4 pages (/, /_not-found, plus app internals)

**Bundle Size:**
- Next.js 15 with App Router
- shadcn/ui components bundled as-needed (tree-shakeable)
- lucide-react icons (only Menu icon imported)

## Commits

1. **b6f1ce4** - `feat(06-01): create Next.js project with shadcn/ui`
   - Next.js 15 setup with TypeScript and Tailwind
   - shadcn/ui initialization and component installation
   - API client, types, and constants

2. **37043c1** - `feat(06-01): create layout components (Header, Footer, MobileNav)`
   - Header with desktop navigation
   - Footer with link sections
   - MobileNav with Sheet drawer
   - Enhanced root layout with metadata

## Knowledge Captured

**shadcn/ui Pattern:**
- Components are copied into `/src/components/ui/`
- Modify directly in codebase (not npm dependencies)
- Uses Tailwind for styling, no runtime JS overhead

**Next.js 15 Patterns:**
- Server Components by default (faster, less JS)
- Client Components marked with `'use client'` directive (MobileNav)
- `metadataBase` required for OpenGraph URL resolution

**Mobile-First Responsive:**
- Base styles apply to mobile
- `md:` prefix applies at 768px and above
- `hidden md:inline-flex` = hidden on mobile, visible on desktop
- `md:hidden` = visible on mobile, hidden on desktop

---

**Phase 06 Plan 01 Complete** - Frontend foundation ready for page development.
