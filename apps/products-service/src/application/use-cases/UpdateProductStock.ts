import { InsufficientStockError, ProductNotFoundError } from '../../domain/errors/ProductErrors.js'
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js'
import type { ProductResponseDto } from '../dtos/ProductDtos.js'

export class UpdateProductStock {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, quantityChange: number): Promise<ProductResponseDto> {
    // Verify product exists
    const existingProduct = await this.productRepository.findById(id)
    if (!existingProduct) {
      throw new ProductNotFoundError(id)
    }

    // Calculate new stock quantity
    const currentStock = existingProduct.stockQuantity
    const newStock = currentStock + quantityChange

    // Validate stock quantity (can't be negative)
    if (newStock < 0) {
      throw new InsufficientStockError(id, Math.abs(quantityChange), currentStock)
    }

    // Update only the stock quantity
    const updatedProduct = await this.productRepository.update(id, {
      stockQuantity: newStock,
    })

    return updatedProduct.toJSON()
  }
}
