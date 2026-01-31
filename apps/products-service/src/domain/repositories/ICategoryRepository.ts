import type { Category } from '../entities/Category.js'

export interface CategoryUpdateData {
  name?: string | undefined
  slug?: string | undefined
  description?: string | undefined
}

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  findBySlug(slug: string): Promise<Category | null>
  create(category: Category): Promise<Category>
  update(id: string, data: CategoryUpdateData): Promise<Category>
  delete(id: string): Promise<void>
  existsBySlug(slug: string): Promise<boolean>
}
