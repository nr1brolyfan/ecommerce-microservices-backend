import { z } from 'zod'

// Create review schema
export const createReviewSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
  userId: z.string().uuid('User ID must be a valid UUID'),
  orderId: z.string().uuid('Order ID must be a valid UUID'),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(255, 'Title must be at most 255 characters'),
  comment: z.string().max(2000, 'Comment must be at most 2000 characters').optional(),
})

// Update review schema
export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(255, 'Title must be at most 255 characters'),
  comment: z.string().max(2000, 'Comment must be at most 2000 characters').optional(),
})

// Review ID param schema
export const reviewIdParamSchema = z.object({
  id: z.string().uuid('Review ID must be a valid UUID'),
})

// Product ID param schema
export const productIdParamSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
})

// User ID param schema
export const userIdParamSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
})
