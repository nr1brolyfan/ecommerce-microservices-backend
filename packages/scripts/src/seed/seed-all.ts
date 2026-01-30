/**
 * Seed All Databases
 * Runs all seed scripts in the correct order
 */

import { seedAuth } from './seed-auth.js'
import { seedOrders } from './seed-orders.js'
import { seedProducts } from './seed-products.js'
import { seedReviews } from './seed-reviews.js'

/**
 * Seed all databases in order
 * Order matters: auth → products → orders → reviews
 */
async function seedAll() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // 1. Auth (users must exist first)
    await seedAuth()
    console.log('')

    // 2. Products (products must exist before orders)
    await seedProducts()
    console.log('')

    // 3. Orders (orders must exist before reviews)
    await seedOrders()
    console.log('')

    // 4. Reviews (depends on users, products, and orders)
    await seedReviews()
    console.log('')

    console.log('✅ All databases seeded successfully!\n')
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run
seedAll()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
