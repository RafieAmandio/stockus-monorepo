import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware, requireTier, AuthEnv } from '../middleware/auth.js'
import {
  getReferralStats,
  validateReferralCode,
  generateReferralCode,
} from '../services/referral.service.js'

const validateCodeSchema = z.object({
  code: z.string().min(1),
})

const referralRoutes = new Hono<AuthEnv>()

/**
 * GET /referrals/my-code
 * Get authenticated member's referral code and stats
 * Members only - referral code is generated on first subscription
 */
referralRoutes.get(
  '/my-code',
  authMiddleware,
  requireTier('member'),
  async (c) => {
    const userId = c.get('userId')

    // Get or generate referral code
    const existingStats = await getReferralStats(userId)

    if (existingStats) {
      return c.json({
        code: existingStats.code,
        stats: {
          totalUses: existingStats.totalUses,
          rewardsEarned: existingStats.rewardsEarned,
          recentUsages: existingStats.recentUsages,
        },
      })
    }

    // Generate new code if member doesn't have one
    // (This handles members who upgraded before referral system was implemented)
    const result = await generateReferralCode(userId)

    if (!result.success) {
      return c.json({ error: result.error }, 500)
    }

    return c.json({
      code: result.code,
      stats: {
        totalUses: 0,
        rewardsEarned: 0,
        recentUsages: [],
      },
    })
  }
)

/**
 * GET /referrals/stats
 * Get detailed referral stats for member dashboard
 * Members only
 */
referralRoutes.get(
  '/stats',
  authMiddleware,
  requireTier('member'),
  async (c) => {
    const userId = c.get('userId')

    const stats = await getReferralStats(userId)

    if (!stats) {
      return c.json({
        code: null,
        totalUses: 0,
        rewardsEarned: 0,
        recentUsages: [],
      })
    }

    return c.json({
      code: stats.code,
      totalUses: stats.totalUses,
      rewardsEarned: stats.rewardsEarned,
      recentUsages: stats.recentUsages,
    })
  }
)

/**
 * POST /referrals/validate
 * Validate a referral code (for use during checkout)
 * Public endpoint - any authenticated user can validate
 */
referralRoutes.post(
  '/validate',
  authMiddleware,
  zValidator('json', validateCodeSchema),
  async (c) => {
    const userId = c.get('userId')
    const body = c.req.valid('json')

    const result = await validateReferralCode(body.code)

    if (!result.success) {
      return c.json({ valid: false, error: result.error }, 400)
    }

    // Cannot use own referral code
    if (result.referrerId === userId) {
      return c.json({
        valid: false,
        error: 'Cannot use your own referral code',
      }, 400)
    }

    return c.json({ valid: true })
  }
)

export { referralRoutes }
