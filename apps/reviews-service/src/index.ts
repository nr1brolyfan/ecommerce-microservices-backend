import { serve } from '@hono/node-server'
import app from './app.js'
import { config } from './config/env.js'

const port = config.port

console.log(`🚀 Reviews Service starting on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})

console.log(`✅ Reviews Service is running on http://localhost:${port}`)
