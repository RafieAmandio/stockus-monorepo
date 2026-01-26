import { Hono } from 'hono'
import { logger } from 'hono/logger'
import routes from './routes/index.js'

const app = new Hono()

// Middleware
app.use('*', logger())

// Mount routes
app.route('/', routes)

// Root endpoint
app.get('/', (c) => {
  return c.json({ message: 'StockUs API', version: '1.0.0' })
})

export default app
