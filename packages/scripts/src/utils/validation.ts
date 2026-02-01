/**
 * Database Validation Utilities
 * Helpers to validate database state before seeding
 */

import { sql } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

/**
 * Check if a table exists in the database
 * @param db - Drizzle database instance
 * @param tableName - Name of the table to check
 * @returns true if table exists, false otherwise
 */
export async function tableExists(
  db: PostgresJsDatabase<any>,
  tableName: string,
): Promise<boolean> {
  const result = await db.execute<{ exists: boolean }>(
    sql`SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ${tableName}
    ) as exists`,
  )

  return result[0]?.exists || false
}

/**
 * Ensure all required tables exist before seeding
 * Throws an error if any table is missing
 * @param db - Drizzle database instance
 * @param tables - Array of table names to check
 * @throws Error if any table doesn't exist
 */
export async function ensureTablesExist(
  db: PostgresJsDatabase<any>,
  tables: string[],
): Promise<void> {
  const missingTables: string[] = []

  for (const table of tables) {
    const exists = await tableExists(db, table)
    if (!exists) {
      missingTables.push(table)
    }
  }

  if (missingTables.length > 0) {
    throw new Error(
      `Missing tables: ${missingTables.join(', ')}\n\n` +
        '❌ Database schema not initialized!\n' +
        '💡 Run `pnpm db:push` first to create all tables.\n',
    )
  }
}

/**
 * Get row count for a table
 * @param db - Drizzle database instance
 * @param tableName - Name of the table
 * @returns Number of rows in the table
 */
export async function getRowCount(db: PostgresJsDatabase<any>, tableName: string): Promise<number> {
  const result = await db.execute<{ count: number }>(
    sql`SELECT COUNT(*) as count FROM ${sql.identifier(tableName)}`,
  )

  return Number(result[0]?.count) || 0
}
