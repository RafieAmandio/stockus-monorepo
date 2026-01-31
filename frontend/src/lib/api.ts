const API_URL = process.env.API_URL || 'http://localhost:3001'

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  const { revalidate, ...fetchOptions } = options

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    next: revalidate !== undefined ? { revalidate } : undefined,
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
