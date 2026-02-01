/**
 * Seed Orders Service Database
 * Creates sample orders using Drizzle Seed
 * NOTE: Requires auth and products databases to be seeded first
 */

import { orderItems, orders } from '@repo/database-schemas/orders'
import { sql } from 'drizzle-orm'
import { createConnection, getDatabaseUrl } from '../utils/database.js'
import { ensureTablesExist } from '../utils/validation.js'

/**
 * Seed orders database with sample orders
 * Fetches real user IDs from auth DB and product IDs from products DB
 */
export async function seedOrders() {
  console.log('🌱 Seeding orders database...')

  try {
    const ordersDb = createConnection(getDatabaseUrl('orders'))
    const authDb = createConnection(getDatabaseUrl('auth'))
    const productsDb = createConnection(getDatabaseUrl('products'))

    // Ensure tables exist
    await ensureTablesExist(ordersDb, ['orders', 'order_items'], 'orders')

    // Clear existing data
    console.log('   🧹 Clearing existing orders...')
    await ordersDb.execute('TRUNCATE TABLE orders.orders CASCADE')

    // Fetch user IDs from auth database
    const usersResult = await authDb.execute<{ id: string }>(
      sql`SELECT id FROM auth.users WHERE role = 'user' LIMIT 5`,
    )
    const users = Array.from(usersResult)
    const userIds = users.map((u: any) => u.id)

    if (userIds.length === 0) {
      throw new Error('No users found in auth database. Please run seed-auth first.')
    }

    // Fetch product data from products database
    const productsResult = await productsDb.execute<{
      id: string
      name: string
      price: string
    }>(sql`SELECT id, name, price FROM products.products LIMIT 15`)
    const products = Array.from(productsResult)

    if (products.length === 0) {
      throw new Error('No products found in products database. Please run seed-products first.')
    }

    console.log(`   ✓ Found ${userIds.length} users and ${products.length} products`)

    // Create 10 orders with different statuses
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    let totalOrders = 0
    let totalOrderItems = 0

    for (let i = 0; i < 10; i++) {
      const userId = userIds[i % userIds.length]
      const status = orderStatuses[i % orderStatuses.length]

      // Randomly select 1-3 products for this order
      const numItems = Math.floor(Math.random() * 3) + 1
      const orderProducts = []
      let orderTotal = 0

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)] as any
        if (!product) continue

        const quantity = Math.floor(Math.random() * 3) + 1
        const priceAtOrder = parseFloat(product.price)
        const subtotal = priceAtOrder * quantity

        orderProducts.push({
          productId: product.id,
          productName: product.name,
          quantity,
          priceAtOrder: priceAtOrder.toFixed(2),
          subtotal: subtotal.toFixed(2),
        })

        orderTotal += subtotal
      }

      if (orderProducts.length === 0) continue

      // Insert order
      const [insertedOrder] = await ordersDb
        .insert(orders)
        .values({
          userId,
          status: status as any,
          totalAmount: orderTotal.toFixed(2),
        })
        .returning()

      if (!insertedOrder) continue

      // Insert order items
      await ordersDb.insert(orderItems).values(
        orderProducts.map((item) => ({
          orderId: insertedOrder.id,
          ...item,
        })),
      )

      totalOrders++
      totalOrderItems += orderProducts.length
    }

    console.log('✅ Orders database seeded successfully')
    console.log(
      `   - ${totalOrders} orders with various statuses (pending, processing, shipped, delivered, cancelled)`,
    )
    console.log(`   - ${totalOrderItems} order items`)
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
