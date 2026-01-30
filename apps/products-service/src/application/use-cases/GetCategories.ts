import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js'
import type { CategoryResponseDto } from '../dtos/ProductDtos.js'

export class GetCategories {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll()
    return categories.map((category) => category.toJSON())
  }
}
