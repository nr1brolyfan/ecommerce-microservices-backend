import type { IProductRepository } from '../../domain/repositories/IProductRepository.js'
import type { ProductFiltersDto, ProductResponseDto } from '../dtos/ProductDtos.js'

export class GetProducts {
  constructor(private productRepository: IProductRepository) {}

  async execute(filters?: ProductFiltersDto): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll(filters)
    return products.map((product) => product.toJSON())
  }
}
