/**
 * Seed Reviews Service Database
 * Creates sample reviews
 * NOTE: Requires auth, products, and orders databases to be seeded first
 */

import { reviews } from '@repo/database-schemas/reviews'
import { sql } from 'drizzle-orm'
import { createConnection, getDatabaseUrl } from '../utils/database.js'
import { ensureTablesExist } from '../utils/validation.js'

// Review titles by rating
const reviewTitles = {
  5: [
    'Excellent product!',
    'Best purchase ever!',
    'Highly recommend!',
    'Amazing quality!',
    'Perfect!',
  ],
  4: ['Very good', 'Great product', 'Good value', 'Satisfied', 'Nice quality'],
  3: ["It's okay", 'Average product', 'Fair', 'Not bad', 'Decent'],
  2: ['Could be better', 'Disappointed', 'Not great', 'Below expectations', 'Poor quality'],
  1: ['Terrible', 'Waste of money', 'Very disappointed', "Don't buy", 'Awful'],
}

const reviewComments = {
  5: [
    'This product exceeded my expectations in every way. The quality is outstanding and it works perfectly. Highly recommend to anyone looking for a reliable option.',
    'Absolutely love it! Great value for money and the quality is top-notch. Would definitely buy again.',
    "Best purchase I've made this year. The product arrived quickly and works flawlessly. Five stars!",
  ],
  4: [
    'Very pleased with this purchase. Good quality and works as described. Only minor issues but nothing major.',
    'Great product overall. Does what it says and the quality is good. Would recommend.',
    'Happy with my purchase. The product meets my expectations and the price is reasonable.',
  ],
  3: [
    "It's okay. Does the job but nothing special. Quality is average for the price.",
    'Decent product. Works fine but could be better. Meets basic expectations.',
    'Fair purchase. Not disappointed but not impressed either. Average quality.',
  ],
  2: [
    'Not very happy with this. The quality is below what I expected. Would not buy again.',
    "Disappointed with the quality. It works but doesn't feel well-made. Expected better.",
    "Could be much better. The product feels cheap and doesn't match the description.",
  ],
  1: [
    'Terrible product. Broke after a few days. Complete waste of money. Do not recommend.',
    "Very disappointed. The quality is awful and it doesn't work properly. Returning it.",
    "Don't waste your money on this. Poor quality and doesn't work as advertised.",
  ],
}

/**
 * Seed reviews database with realistic reviews
 * Fetches order data to ensure reviews match actual purchases
 */
export async function seedReviews() {
  console.log('🌱 Seeding reviews database...')

  try {
    const reviewsDb = createConnection(getDatabaseUrl('reviews'))
    const ordersDb = createConnection(getDatabaseUrl('orders'))

    // Ensure tables exist
    await ensureTablesExist(reviewsDb, ['reviews'])

    // Clear existing data
    console.log('   🧹 Clearing existing reviews...')
    await reviewsDb.execute('TRUNCATE TABLE reviews CASCADE')

    // Fetch orders with items (only delivered/shipped orders)
    const ordersResult = await ordersDb.execute<{
      order_id: string
      user_id: string
      product_id: string
      status: string
    }>(sql`
      SELECT 
        o.id as order_id,
        o.user_id,
        oi.product_id,
        o.status
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.status IN ('delivered', 'shipped', 'processing')
      LIMIT 20
    `)

    const orderItems = Array.from(ordersResult)

    if (orderItems.length === 0) {
      throw new Error('No delivered/shipped orders found. Please run seed-orders first.')
    }

    console.log(`   ✓ Found ${orderItems.length} order items eligible for reviews`)

    // Create reviews for some of the orders (not all)
    const reviewsToCreate = orderItems.slice(0, 15) // Create 15 reviews
    let createdCount = 0

    for (const item of reviewsToCreate) {
      const orderItem = item as any

      // Skip if missing required data
      if (!orderItem.product_id || !orderItem.user_id || !orderItem.order_id) {
        continue
      }

      const rating = Math.floor(Math.random() * 5) + 1 // 1-5

      const titleOptions = reviewTitles[rating as keyof typeof reviewTitles]
      const commentOptions = reviewComments[rating as keyof typeof reviewComments]

      const title = titleOptions[Math.floor(Math.random() * titleOptions.length)] || 'Good product'
      const comment = commentOptions[Math.floor(Math.random() * commentOptions.length)] || null

      try {
        await reviewsDb.insert(reviews).values({
          productId: orderItem.product_id as string,
          userId: orderItem.user_id as string,
          orderId: orderItem.order_id as string,
          rating,
          title: title as string,
          comment: comment as string | null,
        })
        createdCount++
      } catch (error: any) {
        // Skip if unique constraint fails (user already reviewed this product)
        if (error.code === '23505' || error.message?.includes('unique_user_product')) {
          continue
        }
        throw error
      }
    }

    console.log('✅ Reviews database seeded successfully')
    console.log(`   - ${createdCount} reviews with ratings 1-5`)
    console.log('   - Reviews only for delivered/shipped orders')
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
