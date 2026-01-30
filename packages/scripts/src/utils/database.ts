/**
 * Database Connection Utilities
 * Helper functions to connect to different service databases
 */

import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

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
 */
export function getDatabaseUrl(service: 'auth' | 'products' | 'cart' | 'orders' | 'reviews') {
  const envKey = `${service.toUpperCase()}_DATABASE_URL`
  const url = process.env[envKey]
  
  if (!url) {
    throw new Error(`${envKey} environment variable not set`)
  }
  
  return url
}
