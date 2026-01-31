import { and, eq, gt, gte, lte, type SQL } from 'drizzle-orm'
import { Product } from '../../domain/entities/Product.js'
import type {
  IProductRepository,
  ProductFilters,
  ProductUpdateData,
} from '../../domain/repositories/IProductRepository.js'
import { db } from '../database/connection.js'
import { products } from '../database/schema.js'

export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1)

    const row = result[0]
    if (!row) {
      return null
    }

    return Product.fromPersistence({
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      price: parseFloat(row.price),
      sku: row.sku,
      stockQuantity: row.stockQuantity,
      imageUrl: row.imageUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const conditions: SQL[] = []

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId))
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()))
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()))
    }

    if (filters?.inStock === true) {
      conditions.push(gt(products.stockQuantity, 0))
    }

    let query = db.select().from(products)

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any
    }

    const result = await query.orderBy(products.name)

    return result.map((row) =>
      Product.fromPersistence({
        id: row.id,
        categoryId: row.categoryId,
        name: row.name,
        slug: row.slug,
        description: row.description ?? undefined,
        price: parseFloat(row.price),
        sku: row.sku,
        stockQuantity: row.stockQuantity,
        imageUrl: row.imageUrl ?? undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    )
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1)

    const row = result[0]
    if (!row) {
      return null
    }

    return Product.fromPersistence({
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      price: parseFloat(row.price),
      sku: row.sku,
      stockQuantity: row.stockQuantity,
      imageUrl: row.imageUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  async findBySku(sku: string): Promise<Product | null> {
    const result = await db.select().from(products).where(eq(products.sku, sku)).limit(1)

    const row = result[0]
    if (!row) {
      return null
    }

    return Product.fromPersistence({
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      price: parseFloat(row.price),
      sku: row.sku,
      stockQuantity: row.stockQuantity,
      imageUrl: row.imageUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  async create(product: Product): Promise<Product> {
    const result = await db
      .insert(products)
      .values({
        id: product.id,
        categoryId: product.categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.getValue().toString(),
        sku: product.sku.getValue(),
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
      .returning()

    const row = result[0]
    if (!row) {
      throw new Error('Failed to create product')
    }

    return Product.fromPersistence({
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      price: parseFloat(row.price),
      sku: row.sku,
      stockQuantity: row.stockQuantity,
      imageUrl: row.imageUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  async update(id: string, data: ProductUpdateData): Promise<Product> {
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (data.categoryId) updateData.categoryId = data.categoryId
    if (data.name) updateData.name = data.name
    if (data.slug) updateData.slug = data.slug
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.price = data.price.toString()
    if (data.sku) updateData.sku = data.sku
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl

    const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning()

    const row = result[0]
    if (!row) {
      throw new Error('Failed to update product')
    }

    return Product.fromPersistence({
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      price: parseFloat(row.price),
      sku: row.sku,
      stockQuantity: row.stockQuantity,
      imageUrl: row.imageUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  async delete(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id))
  }

  async existsBySku(sku: string): Promise<boolean> {
    const result = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.sku, sku))
      .limit(1)

    return result.length > 0
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const result = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1)

    return result.length > 0
  }
}
