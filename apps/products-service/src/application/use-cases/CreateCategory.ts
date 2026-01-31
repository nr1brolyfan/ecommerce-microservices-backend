import { Category } from '../../domain/entities/Category.js'
import { DuplicateSlugError } from '../../domain/errors/ProductErrors.js'
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js'
import type { CategoryResponseDto, CreateCategoryDto } from '../dtos/ProductDtos.js'
import { slugify } from '../utils/slugify.js'

export class CreateCategory {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Generate slug from name if not provided
    const slug = dto.slug || slugify(dto.name)

    // Check for duplicate slug
    const slugExists = await this.categoryRepository.existsBySlug(slug)
    if (slugExists) {
      throw new DuplicateSlugError(slug)
    }

    // Create category entity
    const category = Category.create({
      id: crypto.randomUUID(),
      name: dto.name,
      slug,
      description: dto.description,
      createdAt: new Date(),
    })

    // Save to repository
    const savedCategory = await this.categoryRepository.create(category)

    return savedCategory.toJSON()
  }
}
