/**
 * Products Service DTOs
 */

export interface CategoryDto {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: Date
}

export interface ProductDto {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string
  price: number
  sku: string
  stockQuantity: number
  imageUrl?: string
  category?: CategoryDto
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductDto {
  categoryId: string
  name: string
  description?: string
  price: number
  sku: string
  stockQuantity: number
  imageUrl?: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  stockQuantity?: number
  imageUrl?: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

export interface ProductFiltersDto {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}
