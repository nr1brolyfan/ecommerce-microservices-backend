import { eq } from 'drizzle-orm'
import { Category } from '../../domain/entities/Category.js'
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js'
import { db } from '../database/connection.js'
import { categories } from '../database/schema.js'

export class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1)

    if (result.length === 0) {
      return null
    }

    return Category.fromPersistence({
      id: result[0].id,
      name: result[0].name,
      slug: result[0].slug,
      description: result[0].description ?? undefined,
      createdAt: result[0].createdAt,
    })
  }

  async findAll(): Promise<Category[]> {
    const result = await db.select().from(categories).orderBy(categories.name)

    return result.map((row) =>
      Category.fromPersistence({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description ?? undefined,
        createdAt: row.createdAt,
      }),
    )
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)

    if (result.length === 0) {
      return null
    }

    return Category.fromPersistence({
      id: result[0].id,
      name: result[0].name,
      slug: result[0].slug,
      description: result[0].description ?? undefined,
      createdAt: result[0].createdAt,
    })
  }

  async create(category: Category): Promise<Category> {
    const result = await db
      .insert(categories)
      .values({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        createdAt: category.createdAt,
      })
      .returning()

    return Category.fromPersistence({
      id: result[0].id,
      name: result[0].name,
      slug: result[0].slug,
      description: result[0].description ?? undefined,
      createdAt: result[0].createdAt,
    })
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const updateData: any = {}

    if (categoryData.name) updateData.name = categoryData.name
    if (categoryData.slug) updateData.slug = categoryData.slug
    if (categoryData.description !== undefined) updateData.description = categoryData.description

    const result = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning()

    return Category.fromPersistence({
      id: result[0].id,
      name: result[0].name,
      slug: result[0].slug,
      description: result[0].description ?? undefined,
      createdAt: result[0].createdAt,
    })
  }

  async delete(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id))
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const result = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)

    return result.length > 0
  }
}
