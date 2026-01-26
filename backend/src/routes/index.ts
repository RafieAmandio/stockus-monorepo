import { Hono } from 'hono'
import health from './health.js'
import { auth } from './auth.js'
import { researchRoutes } from './research.js'
import { courseRoutes } from './courses.js'
import { templateRoutes } from './templates.js'
import { imageRoutes } from './images.js'

const routes = new Hono()

// Health check routes
routes.route('/health', health)

// Authentication routes
routes.route('/auth', auth)

// Research routes
routes.route('/research', researchRoutes)

// Course routes
routes.route('/courses', courseRoutes)

// Template routes
routes.route('/templates', templateRoutes)

// Image routes
routes.route('/images', imageRoutes)

export default routes
