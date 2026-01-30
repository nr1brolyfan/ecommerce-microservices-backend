import { ProductNotFoundError } from '../../domain/errors/ProductErrors.js'
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js'
import type { ProductResponseDto } from '../dtos/ProductDtos.js'

export class GetProductById {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new ProductNotFoundError(id)
    }

    return product.toJSON()
  }
}
