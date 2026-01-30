import { NotFoundError, ValidationError } from '@repo/shared-types/errors'
import type { IReviewRepository } from '../../domain/repositories/IReviewRepository.js'

export class DeleteReview {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(reviewId: string, userId: string): Promise<void> {
    // 1. Find review
    const review = await this.reviewRepository.findById(reviewId)
    if (!review) {
      throw new NotFoundError('Review not found')
    }

    // 2. Check ownership (user can only delete own review, unless admin check is added)
    if (!review.canBeUpdated(userId)) {
      throw new ValidationError('User does not own this review')
    }

    // 3. Delete review
    await this.reviewRepository.delete(reviewId)
  }
}
