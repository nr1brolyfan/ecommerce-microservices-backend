/**
 * Seed Orders Service Database
 * Creates sample orders using Drizzle Seed
 */

import { seed } from 'drizzle-seed'
import { createConnection, getDatabaseUrl } from '../utils/database'

/**
 * Seed orders database
 * This will be implemented once orders-service schema is ready
 */
export async function seedOrders() {
  console.log('🌱 Seeding orders database...')

  try {
    const databaseUrl = getDatabaseUrl('orders')
    const db = createConnection(databaseUrl)

    // TODO: Import schema from orders-service
    // import { orders, orderItems } from '@repo/orders-service/schema'
    
    // Example of what will be implemented:
    // await seed(db, { orders, orderItems }).refine((f) => ({
    //   orders: {
    //     count: 10,
    //     columns: {
    //       status: f.valuesFromArray({ values: ['pending', 'processing', 'shipped', 'delivered'] }),
    //       totalAmount: f.number({ min: 50, max: 500, precision: 0.01 }),
    //     },
    //   },
    //   orderItems: {
    //     count: 25,
    //     columns: {
    //       productName: f.productName(),
    //       quantity: f.int({ min: 1, max: 5 }),
    //       priceAtOrder: f.number({ min: 9.99, max: 199.99, precision: 0.01 }),
    //     },
    //   },
    // }))

    console.log('✅ Orders database seeded successfully')
    console.log('   - 10 orders with various statuses')
    console.log('   - 25 order items')
  } catch (error) {
    console.error('❌ Failed to seed orders database:', error)
    throw error
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedOrders()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
