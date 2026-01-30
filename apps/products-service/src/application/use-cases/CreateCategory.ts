import { Category } from '../../domain/entities/Category.js'
import { DuplicateSlugError } from '../../domain/errors/ProductErrors.js'
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js'
import type { CategoryResponseDto, CreateCategoryDto } from '../dtos/ProductDtos.js'

export class CreateCategory {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Check for duplicate slug
    const slugExists = await this.categoryRepository.existsBySlug(dto.slug)
    if (slugExists) {
      throw new DuplicateSlugError(dto.slug)
    }

    // Create category entity
    const category = Category.create({
      id: crypto.randomUUID(),
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      createdAt: new Date(),
    })

    // Save to repository
    const savedCategory = await this.categoryRepository.create(category)

    return savedCategory.toJSON()
  }
}
