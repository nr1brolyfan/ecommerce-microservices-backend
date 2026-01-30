import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import categoriesRoutes from './presentation/routes/categories.routes.js'
import productsRoutes from './presentation/routes/products.routes.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'products-service',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.route('/api/products', productsRoutes)
app.route('/api/categories', categoriesRoutes)

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
export type ProductsApp = typeof app

export default app
