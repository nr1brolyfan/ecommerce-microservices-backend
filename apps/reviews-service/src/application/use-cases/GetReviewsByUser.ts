import type { IReviewRepository } from '../../domain/repositories/IReviewRepository.js'
import type { ReviewResponseDto } from '../dtos/ReviewDtos.js'

export class GetReviewsByUser {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(userId: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.findByUserId(userId)
    return reviews.map((review) => review.toJSON())
  }
}
