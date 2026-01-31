import { sql } from 'drizzle-orm'
import { db } from './src/infrastructure/database/connection.js'

async function migrate() {
  try {
    console.log('Adding product_name column...')
    await db.execute(sql`ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)`)
    console.log('Updating existing rows...')
    await db.execute(sql`UPDATE cart_items SET product_name = 'Unknown Product' WHERE product_name IS NULL`)
    console.log('Setting NOT NULL constraint...')
    await db.execute(sql`ALTER TABLE cart_items ALTER COLUMN product_name SET NOT NULL`)
    console.log('Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
