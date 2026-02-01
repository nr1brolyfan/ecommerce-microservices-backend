/**
 * Database Connection Utilities
 * Helper functions to connect to different service databases
 */

import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Load environment variables from root .env
config({ path: '../../.env' })

/**
 * Create database connection
 * @param databaseUrl - PostgreSQL connection string
 */
export function createConnection(databaseUrl: string) {
  const client = postgres(databaseUrl)
  return drizzle(client)
}

/**
 * Get database URL from environment
 * Now returns single DATABASE_URL for all services (using PostgreSQL schemas)
 */
export function getDatabaseUrl(_service?: 'auth' | 'products' | 'cart' | 'orders' | 'reviews') {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error('DATABASE_URL environment variable not set')
  }

  return url
}
