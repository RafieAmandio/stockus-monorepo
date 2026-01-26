import { Hono } from 'hono'
import health from './health.js'
import { auth } from './auth.js'
import { researchRoutes } from './research.js'

const routes = new Hono()

// Health check routes
routes.route('/health', health)

// Authentication routes
routes.route('/auth', auth)

// Research routes
routes.route('/research', researchRoutes)

export default routes
