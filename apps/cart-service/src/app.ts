import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import cartRoutes from './presentation/routes/cart.routes.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'cart-service',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.route('/api/cart', cartRoutes)

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: 'Route not found',
    },
    404,
  )
})

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json(
    {
      success: false,
      error: 'Internal server error',
    },
    500,
  )
})

// Export type for Hono RPC
export type CartApp = typeof app

export default app
