import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './app.js'

const port = Number(process.env.PORT) || 3000

console.log(`🚀 Auth Service starting on port ${port}...`)

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`✅ Auth Service running at http://localhost:${info.port}`)
  },
)
