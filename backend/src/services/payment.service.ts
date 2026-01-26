import midtransClient from 'midtrans-client'
import { nanoid } from 'nanoid'
import { env } from '../config/env.js'

// Initialize Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: env.MIDTRANS_IS_PRODUCTION,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
})

// Result types following existing pattern (from email.service.ts)
interface PaymentResult {
  success: boolean
  token?: string
  redirectUrl?: string
  orderId?: string
  error?: string
}

interface PaymentParams {
  userId: number
  userEmail: string
  userName: string
  amount: number // In IDR
  promoCodeId?: number
  referralId?: number
}

/**
 * Generate unique order ID with timestamp and random suffix
 * Format: sub-{userId}-{timestamp}-{nanoid} for subscriptions
 *         ws-{userId}-{workshopId}-{timestamp}-{nanoid} for workshops
 */
function generateOrderId(prefix: string, userId: number, itemId?: number): string {
  const timestamp = Date.now()
  const suffix = nanoid(6)
  if (itemId !== undefined) {
    return `${prefix}-${userId}-${itemId}-${timestamp}-${suffix}`
  }
  return `${prefix}-${userId}-${timestamp}-${suffix}`
}

/**
 * Extract userId from order ID
 * Used in webhook handler to identify the user
 */
export function extractUserIdFromOrderId(orderId: string): number {
  const parts = orderId.split('-')
  // Format: prefix-userId-... or prefix-userId-itemId-...
  return parseInt(parts[1], 10)
}

/**
 * Extract workshop ID from order ID (if present)
 */
export function extractWorkshopIdFromOrderId(orderId: string): number | null {
  const parts = orderId.split('-')
  // Workshop format: ws-userId-workshopId-timestamp-suffix
  if (parts[0] === 'ws' && parts.length >= 4) {
    return parseInt(parts[2], 10)
  }
  return null
}

/**
 * Create Midtrans Snap transaction for annual subscription
 * Returns token for frontend Snap.js integration
 */
export async function createSubscriptionPayment(
  params: PaymentParams
): Promise<PaymentResult> {
  const { userId, userEmail, userName, amount, promoCodeId, referralId } = params

  const orderId = generateOrderId('sub', userId)

  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: userName,
        email: userEmail,
      },
      item_details: [{
        id: 'annual-subscription',
        price: amount,
        quantity: 1,
        name: 'StockUs Annual Membership',
      }],
      // Store metadata for webhook processing
      custom_field1: promoCodeId?.toString() || '',
      custom_field2: referralId?.toString() || '',
    }

    const transaction = await snap.createTransaction(parameter)

    return {
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId,
    }
  } catch (err) {
    console.error('Midtrans subscription payment error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create payment'
    }
  }
}

/**
 * Create Midtrans Snap transaction for workshop purchase
 */
export async function createWorkshopPayment(
  params: PaymentParams & { workshopId: number; workshopName: string }
): Promise<PaymentResult> {
  const { userId, userEmail, userName, amount, workshopId, workshopName, promoCodeId, referralId } = params

  const orderId = generateOrderId('ws', userId, workshopId)

  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: userName,
        email: userEmail,
      },
      item_details: [{
        id: `workshop-${workshopId}`,
        price: amount,
        quantity: 1,
        name: workshopName,
      }],
      // Store metadata for webhook processing
      custom_field1: promoCodeId?.toString() || '',
      custom_field2: referralId?.toString() || '',
    }

    const transaction = await snap.createTransaction(parameter)

    return {
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId,
    }
  } catch (err) {
    console.error('Midtrans workshop payment error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create payment'
    }
  }
}

/**
 * Check transaction status via Midtrans API
 * Use as fallback when webhook doesn't arrive
 */
export async function checkTransactionStatus(orderId: string): Promise<PaymentResult & { status?: string }> {
  try {
    const response = await snap.transaction.status(orderId)

    return {
      success: true,
      orderId,
      status: response.transaction_status,
    }
  } catch (err) {
    console.error('Midtrans status check error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to check status'
    }
  }
}
