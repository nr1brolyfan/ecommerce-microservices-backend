import * as dotenv from 'dotenv'
import * as dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Load environment variables from root
dotenv.config({ path: '../../.env' })

// Single database URL for all schemas
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/microservices_db'

// Single config with ALL schemas pointing to one database
export default defineConfig({
  schema: './src/*.schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
  // Enable schema support for PostgreSQL
  schemaFilter: ['auth', 'products', 'cart', 'orders', 'reviews'],
})
