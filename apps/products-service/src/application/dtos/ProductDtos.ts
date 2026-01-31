export interface CreateProductDto {
  categoryId: string
  name: string
  slug?: string | undefined
  description?: string | undefined
  price: number
  sku: string
  stockQuantity: number
  imageUrl?: string | undefined
}

export interface UpdateProductDto {
  categoryId?: string | undefined
  name?: string | undefined
  slug?: string | undefined
  description?: string | undefined
  price?: number | undefined
  sku?: string | undefined
  stockQuantity?: number | undefined
  imageUrl?: string | undefined
}

export interface ProductResponseDto {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string | undefined
  price: number
  sku: string
  stockQuantity: number
  imageUrl?: string | undefined
  createdAt: Date
  updatedAt: Date
  category?: CategoryResponseDto
}

export interface CategoryResponseDto {
  id: string
  name: string
  slug: string
  description?: string | undefined
  createdAt: Date
}

export interface CreateCategoryDto {
  name: string
  slug?: string | undefined
  description?: string | undefined
}

export interface UpdateCategoryDto {
  name?: string | undefined
  slug?: string | undefined
  description?: string | undefined
}

export interface ProductFiltersDto {
  categoryId?: string | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  inStock?: boolean | undefined
}
