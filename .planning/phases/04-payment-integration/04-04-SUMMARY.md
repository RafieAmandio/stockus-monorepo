---
phase: 04-payment-integration
plan: 04
subsystem: payments
tags: [midtrans, payments, subscription, workshop, promo-code, referral]

# Dependency graph
requires:
  - phase: 04-01
    provides: Payment database schemas (payments table, cohorts.price field)
  - phase: 04-02
    provides: Payment service (createSubscriptionPayment, createWorkshopPayment)
  - phase: 04-03
    provides: Promo/referral services (validatePromoCode, validateReferralCode)
provides:
  - Payment initiation endpoints (subscription, workshop)
  - Promo code validation endpoint
  - Payment history endpoint
  - Payment receipt email function
affects: [frontend-payment-flow, 04-05-webhook]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Snap token-based payment initiation
    - Pending payment record creation before token return
    - Cohorts serve as workshops (no separate table)

key-files:
  created:
    - backend/src/routes/payments.ts
  modified:
    - backend/src/routes/index.ts
    - backend/src/services/email.service.ts

key-decisions:
  - "IDR 2,500,000 subscription price constant in payments.ts"
  - "Workshop = cohort with price field (no separate workshops table)"
  - "Pending payment record created before Snap token returned"

patterns-established:
  - "Payment flow: validate -> create Midtrans transaction -> create pending record -> return token"
  - "Discount calculation: validatePromoCode + calculateDiscountedAmount"

# Metrics
duration: 3min
completed: 2027-01-27
---

# Phase 04 Plan 04: Payment Routes Summary

**Payment initiation endpoints with promo/referral support returning Midtrans Snap tokens for frontend checkout**

## Performance

- **Duration:** 3 min
- **Started:** 2027-01-27T01:30:00Z
- **Completed:** 2027-01-27T01:33:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- POST /payments/subscription endpoint with tier check, promo, referral validation
- POST /payments/workshop endpoint with cohort lookup and price validation
- POST /payments/validate-promo for pre-checkout discount preview
- GET /payments/history for user payment records
- Payment receipt email template with IDR formatting

## Task Commits

Each task was committed atomically:

1. **Task 1: Create payment routes** - `bece2e4` (feat)
2. **Task 2: Mount payment routes and add receipt email** - `96b1a55` (feat)

## Files Created/Modified
- `backend/src/routes/payments.ts` - Payment initiation endpoints (285 lines)
- `backend/src/routes/index.ts` - Route mounting at /payments
- `backend/src/services/email.service.ts` - sendPaymentReceiptEmail function

## Decisions Made
- Subscription price set to IDR 2,500,000 (hardcoded constant for v1)
- Workshop lookup via cohorts table (cohorts with price field are workshops)
- Pending payment record created BEFORE returning Snap token (audit trail)
- Own referral code rejection enforced at route level

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - work was already partially completed in working directory, committed atomically.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Payment initiation endpoints ready
- Integrates with 04-05 webhook for completion processing
- Frontend can now implement payment UI with Snap.js

---
*Phase: 04-payment-integration*
*Completed: 2027-01-27*
