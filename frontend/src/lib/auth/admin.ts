import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUser } from './dal'

/**
 * Check if current user has admin access
 * Cached for request lifecycle
 */
export const checkIsAdmin = cache(async (): Promise<boolean> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return false
  }

  try {
    // Try to access an admin endpoint - if it succeeds, user is admin
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/admin/metrics`, {
      headers: {
        Cookie: `access_token=${token}`,
      },
      cache: 'no-store',
    })

    return res.ok
  } catch {
    return false
  }
})

/**
 * Require admin access - redirects if not authenticated or not admin
 * Use in admin layout and pages
 */
export const requireAdmin = cache(async () => {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = await checkIsAdmin()

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return user
})
