import type { Review } from '../entities/Review.js'

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface IReviewRepository {
  // Create
  create(review: Review): Promise<Review>

  // Read
  findById(id: string): Promise<Review | null>
  findByProductId(productId: string): Promise<Review[]>
  findByUserId(userId: string): Promise<Review[]>
  findByProductAndUser(productId: string, userId: string): Promise<Review | null>

  // Update
  update(id: string, review: Review): Promise<Review>

  // Delete
  delete(id: string): Promise<void>

  // Stats
  getAverageRating(productId: string): Promise<number>
  getRatingDistribution(productId: string): Promise<ReviewStats['ratingDistribution']>
  getStats(productId: string): Promise<ReviewStats>

  // Exists
  existsById(id: string): Promise<boolean>
  existsByProductAndUser(productId: string, userId: string): Promise<boolean>
}
