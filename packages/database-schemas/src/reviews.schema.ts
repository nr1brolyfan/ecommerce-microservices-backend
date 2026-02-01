import { integer, pgSchema, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'

// Reviews schema
export const reviewsSchema = pgSchema('reviews')

// Reviews table
export const reviews = reviewsSchema.table(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull(), // references products-service (no FK)
    userId: uuid('user_id').notNull(), // references auth-service (no FK)
    orderId: uuid('order_id').notNull(), // references orders-service (no FK) - for purchase verification
    rating: integer('rating').notNull(), // 1-5
    title: varchar('title', { length: 255 }).notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    // UNIQUE constraint: user can have only one review per product
    uniqueUserProduct: uniqueIndex('unique_user_product_idx').on(table.userId, table.productId),
  }),
)

// Type exports for TypeScript
export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
