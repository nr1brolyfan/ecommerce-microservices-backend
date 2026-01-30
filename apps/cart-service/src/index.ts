import { serve } from '@hono/node-server'
import app from './app.js'
import { config } from './config/env.js'

const port = config.port

console.log(`🚀 Cart Service starting on port ${port}...`)

serve({
  fetch: app.fetch,
  port,
})

console.log(`✅ Cart Service running on http://localhost:${port}`)
console.log(`📋 Health check: http://localhost:${port}/health`)
console.log(`🛒 Cart API: http://localhost:${port}/api/cart`)
