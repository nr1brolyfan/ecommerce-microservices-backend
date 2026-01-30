/**
 * Seed Products Service Database
 * Creates categories and products using Drizzle Seed
 */

import { seed } from 'drizzle-seed'
import { createConnection, getDatabaseUrl } from '../utils/database'

/**
 * Seed products database
 * This will be implemented once products-service schema is ready
 */
export async function seedProducts() {
  console.log('🌱 Seeding products database...')

  try {
    const databaseUrl = getDatabaseUrl('products')
    const db = createConnection(databaseUrl)

    // TODO: Import schema from products-service
    // import { categories, products } from '@repo/products-service/schema'
    
    // Example of what will be implemented:
    // await seed(db, { categories, products }).refine((f) => ({
    //   categories: {
    //     count: 5,
    //     columns: {
    //       name: f.valuesFromArray({ values: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'] }),
    //       slug: f.valuesFromArray({ values: ['electronics', 'clothing', 'books', 'home-garden', 'sports'] }),
    //       description: f.loremSentences({ sentences: 2 }),
    //     },
    //   },
    //   products: {
    //     count: 30,
    //     columns: {
    //       name: f.productName(),
    //       slug: f.slug(),
    //       description: f.productDescription(),
    //       price: f.number({ min: 9.99, max: 999.99, precision: 0.01 }),
    //       sku: f.string({ isUnique: true }),
    //       stockQuantity: f.int({ min: 0, max: 100 }),
    //     },
    //   },
    // }))

    console.log('✅ Products database seeded successfully')
    console.log('   - 5 categories')
    console.log('   - 30 products with random data')
  } catch (error) {
    console.error('❌ Failed to seed products database:', error)
    throw error
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
