import { relations } from 'drizzle-orm'
import { decimal, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// Carts table
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Cart items table
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id')
    .notNull()
    .references(() => carts.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  priceAtAddition: decimal('price_at_addition', { precision: 10, scale: 2 }).notNull(),
  addedAt: timestamp('added_at').notNull().defaultNow(),
})

// Relations
export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}))

// TypeScript types
export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export type CartItem = typeof cartItems.$inferSelect
export type NewCartItem = typeof cartItems.$inferInsert
