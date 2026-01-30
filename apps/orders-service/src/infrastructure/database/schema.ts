import { decimal, integer, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// Order status ENUM
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
])

// Orders table
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Order items table (snapshot of products at order time)
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull(), // snapshot - no FK
  productName: varchar('product_name', { length: 255 }).notNull(), // snapshot
  quantity: integer('quantity').notNull(),
  priceAtOrder: decimal('price_at_order', { precision: 10, scale: 2 }).notNull(), // snapshot
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
})

// Type exports for TypeScript
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
