import { Product } from '../../domain/entities/Product.js'
import {
  CategoryNotFoundError,
  DuplicateSkuError,
  DuplicateSlugError,
} from '../../domain/errors/ProductErrors.js'
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js'
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js'
import type { CreateProductDto, ProductResponseDto } from '../dtos/ProductDtos.js'

export class CreateProduct {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Verify category exists
    const categoryExists = await this.categoryRepository.findById(dto.categoryId)
    if (!categoryExists) {
      throw new CategoryNotFoundError(dto.categoryId)
    }

    // Check for duplicate SKU
    const skuExists = await this.productRepository.existsBySku(dto.sku)
    if (skuExists) {
      throw new DuplicateSkuError(dto.sku)
    }

    // Check for duplicate slug
    const slugExists = await this.productRepository.existsBySlug(dto.slug)
    if (slugExists) {
      throw new DuplicateSlugError(dto.slug)
    }

    // Create product entity
    const product = Product.create({
      id: crypto.randomUUID(),
      categoryId: dto.categoryId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      sku: dto.sku,
      stockQuantity: dto.stockQuantity,
      imageUrl: dto.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Save to repository
    const savedProduct = await this.productRepository.create(product)

    return savedProduct.toJSON()
  }
}
