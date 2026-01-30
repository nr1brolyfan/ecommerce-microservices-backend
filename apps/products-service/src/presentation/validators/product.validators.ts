import { z } from 'zod'

// Product validators
export const createProductSchema = z.object({
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must not exceed 255 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(255, 'Slug must not exceed 255 characters'),
  description: z.string().optional(),
  price: z
    .number()
    .positive('Price must be positive')
    .max(999999.99, 'Price cannot exceed 999,999.99'),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(100, 'SKU must not exceed 100 characters'),
  stockQuantity: z
    .number()
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative'),
  imageUrl: z.string().url('Image URL must be a valid URL').optional(),
})

export const updateProductSchema = z.object({
  categoryId: z.string().uuid('Category ID must be a valid UUID').optional(),
  name: z.string().min(3).max(255).optional(),
  slug: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  price: z.number().positive().max(999999.99).optional(),
  sku: z.string().min(3).max(100).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional(),
})

export const productFiltersSchema = z.object({
  categoryId: z.string().uuid().optional(),
  minPrice: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive())
    .optional(),
  maxPrice: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive())
    .optional(),
  inStock: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
})

// Category validators
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must not exceed 255 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(255, 'Slug must not exceed 255 characters'),
  description: z.string().optional(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(3).max(255).optional(),
  slug: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
})
