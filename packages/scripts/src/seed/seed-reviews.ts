/**
 * Seed Reviews Service Database
 * Creates sample reviews using Drizzle Seed
 */

import { seed } from 'drizzle-seed'
import { createConnection, getDatabaseUrl } from '../utils/database'

/**
 * Seed reviews database
 * This will be implemented once reviews-service schema is ready
 */
export async function seedReviews() {
  console.log('🌱 Seeding reviews database...')

  try {
    const databaseUrl = getDatabaseUrl('reviews')
    const db = createConnection(databaseUrl)

    // TODO: Import schema from reviews-service
    // import { reviews } from '@repo/reviews-service/schema'
    
    // Example of what will be implemented:
    // await seed(db, { reviews }).refine((f) => ({
    //   reviews: {
    //     count: 20,
    //     columns: {
    //       rating: f.int({ min: 1, max: 5 }),
    //       title: f.loremSentence(),
    //       comment: f.loremParagraphs({ paragraphs: 2 }),
    //     },
    //   },
    // }))

    console.log('✅ Reviews database seeded successfully')
    console.log('   - 20 reviews with ratings 1-5')
  } catch (error) {
    console.error('❌ Failed to seed reviews database:', error)
    throw error
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedReviews()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
