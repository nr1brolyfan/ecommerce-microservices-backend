import type { Product } from '../entities/Product.js'

export interface ProductFilters {
  categoryId?: string | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  inStock?: boolean | undefined
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>
  findAll(filters?: ProductFilters): Promise<Product[]>
  findBySlug(slug: string): Promise<Product | null>
  findBySku(sku: string): Promise<Product | null>
  create(product: Product): Promise<Product>
  update(id: string, product: Partial<Product>): Promise<Product>
  delete(id: string): Promise<void>
  existsBySku(sku: string): Promise<boolean>
  existsBySlug(slug: string): Promise<boolean>
}
