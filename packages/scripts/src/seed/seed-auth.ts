/**
 * Seed Auth Service Database
 * Creates admin and regular users using Drizzle Seed
 */

import { hashPassword } from '@repo/shared-utils'
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { seed } from 'drizzle-seed'
import { createConnection, getDatabaseUrl } from '../utils/database.js'

// Define schema (copied from auth-service to avoid circular dependencies)
const roleEnum = pgEnum('role', ['user', 'admin'])

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: roleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * Seed auth database with 1 admin and 5 regular users
 */
export async function seedAuth() {
  console.log('🌱 Seeding auth database...')

  try {
    const databaseUrl = getDatabaseUrl('auth')
    const db = createConnection(databaseUrl)

    // Hash password once for all users
    const hashedPassword = await hashPassword('Password123!')

    // Create admin user first
    await db.insert(users).values({
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    })

    // Use Drizzle Seed to generate 5 regular users
    await seed(db, { users }).refine((f) => ({
      users: {
        count: 5,
        columns: {
          email: f.email(),
          firstName: f.firstName(),
          lastName: f.lastName(),
          role: f.default({ defaultValue: 'user' }),
          passwordHash: f.default({ defaultValue: hashedPassword }),
        },
      },
    }))

    console.log('✅ Auth database seeded successfully')
    console.log('   - 1 admin user: admin@example.com / Password123!')
    console.log('   - 5 regular users: <random>@example.com / Password123!')
  } catch (error) {
    console.error('❌ Failed to seed auth database:', error)
    throw error
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAuth()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
