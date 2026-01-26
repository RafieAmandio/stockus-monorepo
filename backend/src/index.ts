import { serve } from '@hono/node-server'
import app from './app.js'
import { env } from './config/env.js'
import { pool } from './db/index.js'

const server = serve({
  fetch: app.fetch,
  port: env.PORT,
}, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`)
})

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...')
  server.close()
  await pool.end()
  console.log('Server closed')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
