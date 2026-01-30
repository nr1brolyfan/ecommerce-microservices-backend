import { NotFoundError, ValidationError } from '@repo/shared-types/errors'
import type { IReviewRepository } from '../../domain/repositories/IReviewRepository.js'
import type { ReviewResponseDto, UpdateReviewDto } from '../dtos/ReviewDtos.js'

export class UpdateReview {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    // 1. Find review
    const review = await this.reviewRepository.findById(reviewId)
    if (!review) {
      throw new NotFoundError('Review not found')
    }

    // 2. Check ownership
    if (!review.canBeUpdated(userId)) {
      throw new ValidationError('User does not own this review')
    }

    // 3. Update review
    review.update(dto.rating, dto.title, dto.comment)

    // 4. Save to database
    const updatedReview = await this.reviewRepository.update(reviewId, review)

    // 5. Return response
    return updatedReview.toJSON()
  }
}
