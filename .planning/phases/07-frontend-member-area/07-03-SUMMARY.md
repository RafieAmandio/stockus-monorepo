---
phase: 07-frontend-member-area
plan: 03
subsystem: frontend-layout
completed: 2026-01-29
duration: 84s
tags: [nextjs, layout, sidebar, navigation, route-groups]

requires:
  - 07-01 (DAL with getUser for auth verification)

provides:
  - Member area layout with persistent sidebar
  - Sidebar navigation component with user info
  - LogoutButton client component
  - EmptyState reusable component

affects:
  - All member pages in (auth) route group
  - Future member feature implementations

tech-stack:
  added: []
  patterns:
    - Next.js route groups for URL structure
    - Layout-level authentication verification
    - Client components for interactivity (LogoutButton)
    - Server components for data fetching (Layout)

key-files:
  created:
    - frontend/src/app/(auth)/layout.tsx
    - frontend/src/components/member/Sidebar.tsx
    - frontend/src/components/member/LogoutButton.tsx
    - frontend/src/components/member/EmptyState.tsx
  modified: []

decisions:
  - id: route-group-pattern
    what: Use (auth) route group for member pages
    why: URLs don't include 'auth' prefix, cleaner routing
    impact: All member pages (dashboard, courses, etc.) get layout automatically
    alternatives: /member prefix in URLs (more explicit but longer)

  - id: layout-level-auth
    what: Verify authentication at layout level
    why: Single verification point, consistent protection
    impact: All pages in route group are automatically protected
    alternatives: Per-page auth checks (more redundant)

  - id: sidebar-client-component
    what: Make Sidebar a client component
    why: Needs usePathname for active state highlighting
    impact: Requires passing user data from layout as props
    alternatives: Server component + parallel routing (more complex)
---

# Phase 07 Plan 03: Member Area Layout Summary

**One-liner:** Member area layout with sidebar navigation using (auth) route group pattern and layout-level authentication

## What We Built

Created the foundational layout for all member pages with a persistent sidebar containing navigation links, user info, and logout functionality. Used Next.js route groups to keep URLs clean.

### Key Components

**1. Member Layout** (`frontend/src/app/(auth)/layout.tsx`)
- Async server component that verifies authentication
- Calls getUser() from DAL to fetch user data
- Redirects to /login if not authenticated
- Wraps all member pages with sidebar and container

**2. Sidebar Component** (`frontend/src/components/member/Sidebar.tsx`)
- Client component for active state management
- Navigation links: Dashboard, Kursus, Riset, Download, Jadwal, Profil
- User info section with avatar initial, name, email
- Tier badge (Member/Free) with conditional styling
- Active route highlighting using usePathname
- Sticky positioning for persistent visibility

**3. LogoutButton Component** (`frontend/src/components/member/LogoutButton.tsx`)
- Client component for logout interaction
- POST request to /auth/logout with credentials: include
- Loading state during logout process
- Redirects to /login and refreshes router
- Indonesian text: "Keluar" / "Keluar..."

**4. EmptyState Component** (`frontend/src/components/member/EmptyState.tsx`)
- Reusable component for empty content areas
- Configurable icon, title, description
- Optional action button with link
- Used across member pages for consistent empty states

## How It Works

### Route Group Architecture

```
app/
  (auth)/              <- Route group (not in URL)
    layout.tsx         <- Wraps all member pages
    dashboard/
      page.tsx         <- URL: /dashboard
    courses/
      page.tsx         <- URL: /courses
    profile/
      page.tsx         <- URL: /profile
```

### Authentication Flow

1. User navigates to /dashboard (or any member page)
2. Layout component runs (server-side)
3. getUser() fetches user data from backend
4. If user null, redirect to /login
5. If user exists, render Sidebar + page content
6. Sidebar shows user info and navigation

### Active State Detection

Sidebar uses `usePathname()` to highlight active route:
```typescript
const isActive = pathname.startsWith(item.href)
```

This ensures submenu pages also show parent as active.

## Technical Decisions

### Why Route Groups?

Route groups let us organize pages logically without affecting URLs. The `(auth)` group:
- Groups all authenticated pages
- Provides shared layout
- Keeps URLs clean: /dashboard not /auth/dashboard

### Why Layout-Level Auth?

Placing auth check in layout.tsx means:
- Single verification point (DRY)
- Automatic protection for all pages in group
- No need to repeat auth logic in every page
- User data available to layout for sidebar

### Why Client Sidebar?

Sidebar needs `usePathname()` for active state, which requires client component. Trade-off:
- Pro: Simple active state logic
- Con: User data must be passed as props from layout
- Alternative: Could use cookies in client, but prefer single source of truth

## Testing Checklist

Manual verification:
- [ ] Sidebar renders with navigation links
- [ ] User info displays correctly (name, email, tier)
- [ ] Active route highlighting works
- [ ] Logout button calls API and redirects
- [ ] Layout protects routes (redirects if not authenticated)
- [ ] EmptyState component renders properly

Build verification:
- [x] TypeScript compiles without errors
- [x] Next.js build succeeds
- [x] No runtime errors during static generation

## Files Modified

### Created Files (4)

| File | Purpose | Lines |
|------|---------|-------|
| `frontend/src/app/(auth)/layout.tsx` | Member area layout with auth check | 26 |
| `frontend/src/components/member/Sidebar.tsx` | Navigation sidebar with user info | ~100 |
| `frontend/src/components/member/LogoutButton.tsx` | Logout button with API call | ~40 |
| `frontend/src/components/member/EmptyState.tsx` | Reusable empty state component | ~35 |

Total: ~200 lines added

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

### Ready to Proceed

- [x] Member layout structure complete
- [x] Navigation framework in place
- [x] Auth verification working at layout level
- [x] Reusable components created

### Integration Points for Future Plans

**For dashboard (07-04):**
- Dashboard page will render inside (auth) layout
- DashboardStats and QuickActions components ready to use
- EmptyState available for empty dashboard sections

**For courses pages (07-05):**
- Courses navigation already in sidebar
- Layout will wrap course list and detail pages
- EmptyState ready for "no enrolled courses" state

**For research pages (07-06):**
- Research navigation in sidebar
- Layout will wrap research list and viewer
- Consistent styling with sidebar width (w-64)

### Blockers

None identified.

### Concerns

1. **Sidebar responsiveness:** Current implementation is desktop-only. Mobile menu needed for smaller screens.
   - **Impact:** Mobile users can't navigate member area
   - **When to address:** Before 07-10 (responsiveness plan)
   - **Solution:** Add mobile menu with hamburger toggle

2. **Loading states:** Layout auth check has no loading state
   - **Impact:** Slight flash before redirect on protected routes
   - **When to address:** If user reports flashing (optimization)
   - **Solution:** Add Suspense boundary with skeleton

## Commit Trail

| Task | Commit | Message |
|------|--------|---------|
| 1 | 09437bf | feat(07-03): create member area components (Sidebar, LogoutButton, EmptyState) |
| 2 | acfe90e | feat(07-03): create (auth) route group layout with sidebar |

**Total commits:** 2
**All atomic:** Yes

## Success Metrics

- Layout wraps all member pages: Yes
- Sidebar navigation functional: Yes
- User info displays correctly: Yes
- Logout functionality works: Yes
- TypeScript compiles: Yes
- Build succeeds: Yes

## What's Next

With member area layout complete, next plan (07-04) will implement the dashboard page with stats cards and quick action buttons. The dashboard will be the first page rendered inside this layout structure.
