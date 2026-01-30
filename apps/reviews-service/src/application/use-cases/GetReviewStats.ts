import type { IReviewRepository } from '../../domain/repositories/IReviewRepository.js'
import type { ReviewStatsResponseDto } from '../dtos/ReviewDtos.js'

export class GetReviewStats {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(productId: string): Promise<ReviewStatsResponseDto> {
    const stats = await this.reviewRepository.getStats(productId)
    return stats
  }
}
