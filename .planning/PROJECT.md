# StockUs

## What This Is

StockUs is an investment education platform that bridges Indonesian investors to global stock markets. The platform provides cohort-based courses, research reports, investment templates, and a premium community — all designed to teach frameworks for long-term investing rather than stock tips or signals.

## Core Value

Indonesian investors can learn structured approaches to global equity investing through live cohort-based courses and ongoing access to research, templates, and a professional community.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing page with hero, value proposition, course showcase, community features, testimonials, FAQ
- [ ] About Us page with team profiles (Jefta and Yosua)
- [ ] Community page showing free Discord + premium member community
- [ ] Research page with watchlist and portfolio views (stock data, returns)
- [ ] Pricing page with membership offering
- [ ] User authentication (signup, login, logout)
- [ ] Free user tier with limited content access (preview videos, some reports, basic templates)
- [ ] Member dashboard with course progress, downloads, upcoming sessions
- [ ] Annual subscription payment via Midtrans
- [ ] One-time workshop purchases via Midtrans
- [ ] Admin panel for content management (courses, research, templates, users, orders)
- [ ] Cohort management for 5-Day Fundamentals course
- [ ] Research reports (manually entered stock data, analysis)
- [ ] Downloadable templates (investment checklist, valuation template, journal)
- [ ] Course videos and session materials
- [ ] Member-only content gating

### Out of Scope

- Real-time stock data API integration — stock data is manually entered through CMS
- Mobile app — web-first approach
- Live video streaming — sessions happen on external platform (Zoom/Meet), not built into the app
- Automated trading signals — educational platform only, no financial advice
- Multi-language support — Indonesian audience, single language for v1
- Self-paced courses — cohort-based with fixed schedules only

## Context

**Target audience:** Indonesian investors who want to learn global equity investing with proper frameworks. Ranges from beginners to those already investing but wanting structured education.

**Existing presence:** StockUs has an existing Discord community. The platform needs to integrate with that community structure (free Discord for everyone, premium channels for members).

**The team:** Founded by Jefta Ongkodiputra and Yosua Kho, both with 10+ years experience as investment analysts and university-level teaching background.

**Business model:**
- Annual subscription: Includes fundamentals course, full research access, all templates, premium community
- Free tier: Limited preview content to demonstrate value
- Workshops: Special events sold separately as one-time purchases

**Cohort model:** The 5-Day Fundamentals course runs on fixed schedules with live sessions. Members can enroll in upcoming cohorts during their subscription period.

**Payment context:** Indonesian market requires Midtrans for local payment methods (Virtual Account, e-wallets like GoPay/OVO/Dana, credit cards).

**Design assets:** Hi-fi designs ready for all public pages and member dashboard. Admin panel design will be standard PayloadCMS admin UI.

## Constraints

- **Tech stack**: PayloadCMS (backend), React (frontend), Midtrans (payments) — specified by client
- **Architecture**: Backend, Frontend, and Admin Panel must be separate deployable applications
- **Timeline**: Original target was 3 weeks (Dec 24 - Jan 14) — project scope may need adjustment
- **Budget**: IDR 8,000,000 allocated
- **Payment region**: Indonesian payment methods only via Midtrans
- **Content entry**: Stock data manually entered (no external API dependencies)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PayloadCMS for backend | Client specified, good headless CMS for this use case | — Pending |
| Midtrans for payments | Required for Indonesian payment methods | — Pending |
| Separate BE/FE/Admin | Client requirement for deployment flexibility | — Pending |
| Manual stock data entry | Avoids external API complexity and costs | — Pending |
| Cohort-based courses only | Matches existing business model, simpler than self-paced | — Pending |
| Annual subscription model | Primary revenue, includes core course access | — Pending |

---
*Last updated: 2025-01-25 after initialization*
