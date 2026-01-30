import * as dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Load environment variables
dotenv.config()

export default defineConfig({
  schema: './src/infrastructure/database/schema.ts',
  out: './src/infrastructure/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/reviews_db',
  },
  verbose: true,
  strict: true,
})
