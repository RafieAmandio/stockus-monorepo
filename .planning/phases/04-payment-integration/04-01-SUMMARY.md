---
phase: 04
plan: 01
subsystem: payment
tags: [schema, drizzle, migration, payments, subscriptions]
dependency_graph:
  requires: [03-01]
  provides: [payment-schema, subscription-schema, promo-code-schema, referral-schema]
  affects: [04-02, 04-03, 04-04]
tech-stack:
  added: []
  patterns: [generatedAlwaysAsIdentity, pgEnum]
key-files:
  created:
    - backend/src/db/schema/payments.ts
    - backend/src/db/schema/subscriptions.ts
    - backend/src/db/schema/promo-codes.ts
    - backend/src/db/schema/referrals.ts
    - backend/drizzle/0003_typical_next_avengers.sql
  modified:
    - backend/src/db/schema/cohorts.ts
    - backend/src/db/schema/index.ts
    - backend/drizzle.config.ts
decisions:
  - generatedAlwaysAsIdentity for primary keys (modern PostgreSQL pattern)
  - Cohorts as workshop entity (no separate workshops table)
  - Nullable price field for subscription-only cohorts
metrics:
  duration: 2 min 7 sec
  completed: 2026-01-26
---

# Phase 4 Plan 1: Payment Database Schemas Summary

Payment schemas created with Midtrans transaction ID support, subscription tracking, promo codes with usage limits, and referral reward system linking to users table.

## What Was Built

### Payment Schema (payments.ts)
- `payments` table with Midtrans order/transaction IDs (unique for idempotency)
- `payment_status` enum: pending, settlement, capture, deny, cancel, expire, refund
- `payment_type` enum: subscription, workshop
- Foreign key to users.id, optional references to cohorts (as workshops), promo codes, referrals
- Stores raw Midtrans webhook response for debugging/audit

### Subscription Schema (subscriptions.ts)
- `subscriptions` table tracking user membership periods
- `subscription_status` enum: active, expired, cancelled
- Links to payment record that initiated the subscription
- Start/end date for subscription validity period

### Promo Code Schema (promo-codes.ts)
- `promo_codes` table with discount percentage (0-100)
- Usage limits: maxUses (null = unlimited), currentUses counter
- Validity period: validFrom, expiresAt timestamps
- isActive flag for manual enable/disable

### Referral Schema (referrals.ts)
- `referrals` table: one code per user (unique userId)
- Tracks total uses and rewards earned in IDR
- `referral_usages` table: records each referral use
- Links new user, payment that triggered reward, and reward amount
- Drizzle relations defined for query builder

### Cohorts Price Field
- Added nullable `price` column to existing cohorts table
- null = subscription-only access (included in membership)
- value > 0 = purchasable workshop price in IDR

## Tasks Completed

| # | Task | Commit | Key Changes |
|---|------|--------|-------------|
| 1 | Create payment and subscription schemas | db3155b | payments.ts, subscriptions.ts, 3 enums |
| 2 | Create promo code and referral schemas | e768286 | promo-codes.ts, referrals.ts with relations |
| 3 | Add price field to cohorts schema | 3078aa0 | Nullable price column for workshop payments |
| 4 | Export schemas and generate migration | 65bc447 | index.ts, drizzle.config.ts, migration 0003 |

## Migration Content (0003_typical_next_avengers.sql)

```sql
-- Enums
CREATE TYPE "payment_status" AS ENUM(...)
CREATE TYPE "payment_type" AS ENUM(...)
CREATE TYPE "subscription_status" AS ENUM(...)

-- Tables
CREATE TABLE "payments" (15 columns)
CREATE TABLE "subscriptions" (8 columns)
CREATE TABLE "promo_codes" (11 columns)
CREATE TABLE "referrals" (6 columns)
CREATE TABLE "referral_usages" (6 columns)

-- Cohort modification
ALTER TABLE "cohorts" ADD COLUMN "price" integer

-- Foreign keys
payments.user_id -> users.id
subscriptions.user_id -> users.id
referrals.user_id -> users.id
referral_usages.referral_id -> referrals.id
referral_usages.new_user_id -> users.id
```

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **generatedAlwaysAsIdentity() for primary keys** - Modern PostgreSQL pattern (from research) instead of serial, prevents accidental INSERT with explicit ID values

2. **Cohorts serve as workshops** - No separate workshops table needed. Cohorts with non-null price are purchasable workshops, null price means subscription-only access

3. **Raw webhook response stored** - Full Midtrans response JSON stored in `raw_response` text field for debugging and audit trail

## Next Phase Readiness

**Blockers:** None

**Ready for 04-02:** Payment service can now use these schemas to:
- Create payment records with Midtrans order IDs
- Track subscription periods per user
- Apply promo codes with validation
- Process referral rewards

**Schema exports available:**
- `payments`, `paymentStatusEnum`, `paymentTypeEnum`
- `subscriptions`, `subscriptionStatusEnum`
- `promoCodes`
- `referrals`, `referralUsages`, `referralsRelations`, `referralUsagesRelations`
