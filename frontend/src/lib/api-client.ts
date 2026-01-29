const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Client-side API client
 * Use in Client Components with 'use client'
 */
export async function clientFetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Send cookies automatically
  })

  if (!res.ok) {
    const error = new Error(`API Error: ${res.status} ${res.statusText}`)
    ;(error as any).status = res.status
    throw error
  }

  return res.json()
}
