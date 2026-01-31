import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import internalRoutes from './presentation/routes/internal.routes.js'
import ordersRoutes from './presentation/routes/orders.routes.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'orders-service',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.route('/api/orders', ordersRoutes)

// Internal routes (for service-to-service communication)
app.route('/internal/orders', internalRoutes)

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
export type OrdersApp = typeof app

export default app
