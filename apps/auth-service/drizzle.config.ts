import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export default defineConfig({
  schema: './src/infrastructure/database/schema.ts',
  out: './src/infrastructure/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/auth_db',
  },
  verbose: true,
  strict: true,
})
