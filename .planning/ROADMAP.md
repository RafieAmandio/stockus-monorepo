# Roadmap: StockUs

## Overview

StockUs launches as a complete investment education platform for Indonesian investors. The roadmap progresses from backend foundation through content infrastructure, payment integration with referral rewards, DRM-protected video delivery, member-facing frontend, and finally admin panel customization and deployment. Each phase delivers a complete, verifiable capability that unblocks the next.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Authentication** - Backend setup with PayloadCMS, user authentication, and role-based access control
- [ ] **Phase 2: Content Management System** - Collections for courses, research reports, templates, and cohort scheduling
- [ ] **Phase 3: Payment & Referral System** - Midtrans integration with subscription payments, workshops, promo codes, and referral rewards
- [ ] **Phase 4: Video Infrastructure** - Cloudflare R2 video storage with signed URL access control
- [ ] **Phase 5: Member Dashboard & Frontend** - Next.js frontend with course catalog, member dashboard, research library, and public pages
- [ ] **Phase 6: Admin Panel Customization** - PayloadCMS admin enhancements for content managers and member management
- [ ] **Phase 7: Deployment & DevOps** - Production deployment with separate backend/frontend/admin, CI/CD pipeline

## Phase Details

### Phase 1: Foundation & Authentication
**Goal**: Users can create accounts with tiered access levels on a secure backend
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Success Criteria** (what must be TRUE):
  1. User can sign up with email and password
  2. User receives email verification after signup
  3. User can reset forgotten password via email link
  4. User session persists across browser refresh without re-login
  5. System correctly distinguishes between anonymous, free, and member tiers
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD
- [ ] 01-03: TBD

### Phase 2: Content Management System
**Goal**: Admin can create and manage all educational content through PayloadCMS
**Depends on**: Phase 1 (requires authentication and access control)
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, COHO-01, COHO-02, COHO-03
**Success Criteria** (what must be TRUE):
  1. Admin can create courses with titles, descriptions, thumbnails, and member-only flags
  2. Admin can publish research reports with dates and access controls
  3. Admin can upload downloadable templates (PDF, Excel) to media library
  4. Admin can create cohorts with start/end dates and manage enrollment windows
  5. Admin can add session schedules to cohorts with Zoom links
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: Payment & Referral System
**Goal**: Users can purchase subscriptions and workshops, apply promo codes, and earn referral rewards
**Depends on**: Phase 1 (requires user accounts to attach payments)
**Requirements**: PAY-01, PAY-02, PAY-03, PAY-04, PAY-05, PAY-06, PAY-07, REF-01, REF-02, REF-03, REF-04, REF-05
**Success Criteria** (what must be TRUE):
  1. User can purchase annual subscription via Midtrans with Indonesian payment methods (Virtual Account, GoPay, cards)
  2. User can purchase one-time workshops through same payment flow
  3. User can apply promo codes during checkout for discounts
  4. New user can apply referral code during signup or checkout
  5. Referrer receives reward when their code is used on successful payment
  6. Member can view their unique referral code and referral stats (uses, rewards earned)
  7. Admin can configure referral reward amounts and types
  8. Webhook automatically updates subscription status after payment confirmation
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD
- [ ] 03-04: TBD

### Phase 4: Video Infrastructure
**Goal**: Course videos are stored securely and accessible only to authenticated members
**Depends on**: Phase 3 (video access gated by subscription status)
**Requirements**: VID-01, VID-02, VID-03, VID-04
**Success Criteria** (what must be TRUE):
  1. Videos are stored on Cloudflare R2 (S3-compatible storage)
  2. Only authenticated members with active subscriptions can access videos via time-limited signed URLs
  3. Admin can upload session recordings through PayloadCMS admin panel
  4. Member can watch videos embedded within course pages
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Member Dashboard & Frontend
**Goal**: Members and visitors experience complete Next.js frontend with courses, research, and community features
**Depends on**: Phase 2 (content), Phase 3 (payments), Phase 4 (videos)
**Requirements**: MEMB-01, MEMB-02, MEMB-03, MEMB-04, MEMB-05, MEMB-06, MEMB-07, COHO-04, COHO-05, PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07
**Success Criteria** (what must be TRUE):
  1. Visitor can view landing page with hero, course showcase, community features, testimonials, FAQ
  2. Visitor can view About Us, Community, Pricing, and Research preview pages
  3. Member can access dashboard showing enrolled courses, download history, and upcoming sessions
  4. Member can enroll in available cohorts and view session schedule with Zoom links
  5. Member can track course progress through completed sessions
  6. Member can download completion certificate after finishing course
  7. Member can access full research reports and download all templates
  8. Free user can access preview content only (limited videos, some reports)
  9. All pages are mobile responsive with proper SEO meta tags
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD
- [ ] 05-03: TBD
- [ ] 05-04: TBD
- [ ] 05-05: TBD

### Phase 6: Admin Panel Customization
**Goal**: Content managers have streamlined PayloadCMS admin experience for managing platform
**Depends on**: Phase 2 (content structure), Phase 4 (video workflow)
**Requirements**: ADMN-01, ADMN-02, ADMN-03, ADMN-04, ADMN-05
**Success Criteria** (what must be TRUE):
  1. Admin panel displays dashboard with key metrics (active members, total revenue, course enrollments)
  2. Admin can manage all content types (courses, reports, templates, videos) in one interface
  3. Admin can view and edit user accounts, including subscription status and tier changes
  4. Admin can view order history with payment status and transaction details
  5. Admin panel is accessible as separate deployment from public frontend
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Deployment & DevOps
**Goal**: Production application deployed with separate backend/frontend/admin and automated CI/CD
**Depends on**: Phase 6 (all features complete)
**Requirements**: None (infrastructure phase, no functional requirements)
**Success Criteria** (what must be TRUE):
  1. Backend API and Admin Panel deployed as separate service with CORS configured for frontend
  2. Next.js frontend deployed as separate service connecting to backend API
  3. PostgreSQL database deployed with migration workflow for production updates
  4. CI/CD pipeline automatically tests and deploys changes on merge to main branch
  5. Environment variables properly configured across all deployments
  6. Health check endpoints return status for monitoring
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Authentication | 0/3 | Not started | - |
| 2. Content Management System | 0/3 | Not started | - |
| 3. Payment & Referral System | 0/4 | Not started | - |
| 4. Video Infrastructure | 0/2 | Not started | - |
| 5. Member Dashboard & Frontend | 0/5 | Not started | - |
| 6. Admin Panel Customization | 0/2 | Not started | - |
| 7. Deployment & DevOps | 0/2 | Not started | - |

---
*Roadmap created: 2025-01-25*
*Last updated: 2025-01-25*
