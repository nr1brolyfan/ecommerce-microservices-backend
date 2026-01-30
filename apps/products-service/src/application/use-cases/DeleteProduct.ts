import { ProductNotFoundError } from '../../domain/errors/ProductErrors.js'
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js'

export class DeleteProduct {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    // Verify product exists
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new ProductNotFoundError(id)
    }

    await this.productRepository.delete(id)
  }
}
