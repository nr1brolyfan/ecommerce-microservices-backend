import { z } from 'zod'

// Create order schema
export const createOrderSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
})

// Update order status schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    errorMap: () => ({
      message: 'Status must be one of: pending, processing, shipped, delivered, cancelled',
    }),
  }),
})

// Order ID param schema
export const orderIdParamSchema = z.object({
  id: z.string().uuid('Order ID must be a valid UUID'),
})

// User ID param schema
export const userIdParamSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
})
