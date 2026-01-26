import { Hono } from 'hono'
import { db } from '../db/index.js'
import { sql } from 'drizzle-orm'

const health = new Hono()

// Basic health check
health.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Readiness check with database connectivity
health.get('/ready', async (c) => {
  try {
    await db.execute(sql`SELECT 1`)
    return c.json({ status: 'ready', database: 'connected' })
  } catch (error) {
    return c.json(
      { status: 'not ready', database: 'disconnected', error: error instanceof Error ? error.message : 'Unknown error' },
      503
    )
  }
})

export default health
