import 'server-only'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL || 'http://localhost:3001'

/**
 * Server-side API client with cookie forwarding
 * Use in Server Components and Route Handlers
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  const { revalidate, ...fetchOptions } = options

  // Forward authentication cookies to backend
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value

  const cookieHeader = [
    accessToken ? `access_token=${accessToken}` : '',
    refreshToken ? `refresh_token=${refreshToken}` : '',
  ].filter(Boolean).join('; ')

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
  })

  if (!res.ok) {
    const error = new Error(`API Error: ${res.status} ${res.statusText}`)
    ;(error as any).status = res.status
    throw error
  }

  return res.json()
}
