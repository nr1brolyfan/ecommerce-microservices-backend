import { z } from 'zod'

export const addItemToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID format'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive integer'),
})

export type AddItemToCartInput = z.infer<typeof addItemToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
