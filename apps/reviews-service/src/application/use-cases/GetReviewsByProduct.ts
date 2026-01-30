import type { IReviewRepository } from '../../domain/repositories/IReviewRepository.js'
import type { ReviewResponseDto } from '../dtos/ReviewDtos.js'

export class GetReviewsByProduct {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(productId: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.findByProductId(productId)
    return reviews.map((review) => review.toJSON())
  }
}
