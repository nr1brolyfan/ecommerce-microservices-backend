import {
  CategoryNotFoundError,
  DuplicateSkuError,
  DuplicateSlugError,
  ProductNotFoundError,
} from '../../domain/errors/ProductErrors.js'
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js'
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js'
import type { ProductResponseDto, UpdateProductDto } from '../dtos/ProductDtos.js'

export class UpdateProduct {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    // Verify product exists
    const existingProduct = await this.productRepository.findById(id)
    if (!existingProduct) {
      throw new ProductNotFoundError(id)
    }

    // If category is being updated, verify it exists
    if (dto.categoryId) {
      const categoryExists = await this.categoryRepository.findById(dto.categoryId)
      if (!categoryExists) {
        throw new CategoryNotFoundError(dto.categoryId)
      }
    }

    // If SKU is being updated, check for duplicates
    if (dto.sku && dto.sku !== existingProduct.sku.getValue()) {
      const skuExists = await this.productRepository.existsBySku(dto.sku)
      if (skuExists) {
        throw new DuplicateSkuError(dto.sku)
      }
    }

    // If slug is being updated, check for duplicates
    if (dto.slug && dto.slug !== existingProduct.slug) {
      const slugExists = await this.productRepository.existsBySlug(dto.slug)
      if (slugExists) {
        throw new DuplicateSlugError(dto.slug)
      }
    }

    // Update product
    const updatedProduct = await this.productRepository.update(id, dto)

    return updatedProduct.toJSON()
  }
}
