import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import authRoutes from './presentation/routes/auth.routes.js'
import usersRoutes from './presentation/routes/users.routes.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
)

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.route('/api/auth', authRoutes)
app.route('/api/users', usersRoutes)

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: 'Not Found',
    },
    404,
  )
})

// Error handler
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json(
    {
      success: false,
      error: err.message || 'Internal Server Error',
    },
    500,
  )
})

export type AuthApp = typeof app
export default app
