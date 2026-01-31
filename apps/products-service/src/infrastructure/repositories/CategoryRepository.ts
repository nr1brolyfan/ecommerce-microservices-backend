import { eq } from 'drizzle-orm'
import { Category } from '../../domain/entities/Category.js'
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js'
import { db } from '../database/connection.js'
import { categories } from '../database/schema.js'

export class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1)

    const row = result[0]
    if (!row) {
      return null
    }

    return Category.fromPersistence({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      createdAt: row.createdAt,
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

    const row = result[0]
    if (!row) {
      return null
    }

    return Category.fromPersistence({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      createdAt: row.createdAt,
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

    const row = result[0]
    if (!row) {
      throw new Error('Failed to create category')
    }

    return Category.fromPersistence({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      createdAt: row.createdAt,
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

    const row = result[0]
    if (!row) {
      throw new Error('Failed to update category')
    }

    return Category.fromPersistence({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      createdAt: row.createdAt,
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
