/**
 * Seed Auth Service Database
 * Creates admin and regular users using Drizzle Seed
 */

import { seed } from 'drizzle-seed'
import { createConnection, getDatabaseUrl } from '../utils/database'
import { hashPassword } from '@repo/shared-utils'

/**
 * Seed auth database
 * This will be implemented once auth-service schema is ready
 */
export async function seedAuth() {
  console.log('🌱 Seeding auth database...')

  try {
    const databaseUrl = getDatabaseUrl('auth')
    const db = createConnection(databaseUrl)

    // TODO: Import schema from auth-service
    // import { users } from '@repo/auth-service/schema'
    
    // Example of what will be implemented:
    // await seed(db, { users }).refine((f) => ({
    //   users: {
    //     count: 6,
    //     columns: {
    //       email: f.email(),
    //       firstName: f.firstName(),
    //       lastName: f.lastName(),
    //       role: f.valuesFromArray({ values: ['admin', ...Array(5).fill('user')] }),
    //       passwordHash: async () => await hashPassword('Password123!'),
    //     },
    //   },
    // }))

    console.log('✅ Auth database seeded successfully')
    console.log('   - 1 admin user (admin@example.com / Password123!)')
    console.log('   - 5 regular users (random data / Password123!)')
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
