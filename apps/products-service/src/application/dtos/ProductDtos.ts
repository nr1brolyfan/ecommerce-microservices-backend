export interface CreateProductDto {
  categoryId: string
  name: string
  slug: string
  description?: string
  price: number
  sku: string
  stockQuantity: number
  imageUrl?: string
}

export interface UpdateProductDto {
  categoryId?: string
  name?: string
  slug?: string
  description?: string
  price?: number
  sku?: string
  stockQuantity?: number
  imageUrl?: string
}

export interface ProductResponseDto {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string
  price: number
  sku: string
  stockQuantity: number
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  category?: CategoryResponseDto
}

export interface CategoryResponseDto {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: Date
}

export interface CreateCategoryDto {
  name: string
  slug: string
  description?: string
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  description?: string
}

export interface ProductFiltersDto {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}
