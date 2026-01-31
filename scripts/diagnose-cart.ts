/**
 * Diagnostic script to check cart items and their product names
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { cartItems } from '../apps/cart-service/src/infrastructure/database/schema.js'

const CART_DB_URL =
  process.env.CART_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cart_db'

async function diagnoseCart() {
  const sql = postgres(CART_DB_URL)
  const db = drizzle(sql)

  console.log('🔍 Diagnosing cart items...\n')

  const items = await db.select().from(cartItems)

  if (items.length === 0) {
    console.log('✅ No cart items found in database')
    await sql.end()
    return
  }

  console.log(`Found ${items.length} cart items:\n`)

  items.forEach((item, index) => {
    console.log(`Item ${index + 1}:`)
    console.log(`  - Product ID: ${item.productId}`)
    console.log(`  - Product Name: ${item.productName}`)
    console.log(`  - Quantity: ${item.quantity}`)
    console.log(`  - Price: ${item.priceAtAddition}`)
    console.log('')
  })

  const unknownProducts = items.filter(
    (item) =>
      !item.productName || item.productName === 'Unknown product' || item.productName === '',
  )

  if (unknownProducts.length > 0) {
    console.log(`⚠️  Found ${unknownProducts.length} items with missing/unknown product names`)
    console.log('   These should be removed and re-added to the cart')
  } else {
    console.log('✅ All cart items have valid product names')
  }

  await sql.end()
}

diagnoseCart().catch(console.error)
