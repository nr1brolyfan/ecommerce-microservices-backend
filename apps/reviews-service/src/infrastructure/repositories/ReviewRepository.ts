import { and, avg, count, eq } from 'drizzle-orm'
import { Review } from '../../domain/entities/Review.js'
import type { IReviewRepository, ReviewStats } from '../../domain/repositories/IReviewRepository.js'
import { Rating } from '../../domain/value-objects/Rating.js'
import type { Database } from '../database/connection.js'
import { reviews } from '../database/schema.js'

export class ReviewRepository implements IReviewRepository {
  constructor(private db: Database) {}

  async create(review: Review): Promise<Review> {
    const [inserted] = await this.db
      .insert(reviews)
      .values({
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        orderId: review.orderId,
        rating: review.rating.getValue(),
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })
      .returning()

    if (!inserted) {
      throw new Error('Failed to create review')
    }

    return this.mapToEntity(inserted)
  }

  async findById(id: string): Promise<Review | null> {
    const review = await this.db.query.reviews.findFirst({
      where: eq(reviews.id, id),
    })

    if (!review) return null

    return this.mapToEntity(review)
  }

  async findByProductId(productId: string): Promise<Review[]> {
    const productReviews = await this.db.query.reviews.findMany({
      where: eq(reviews.productId, productId),
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
    })

    return productReviews.map((review) => this.mapToEntity(review))
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const userReviews = await this.db.query.reviews.findMany({
      where: eq(reviews.userId, userId),
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
    })

    return userReviews.map((review) => this.mapToEntity(review))
  }

  async findByProductAndUser(productId: string, userId: string): Promise<Review | null> {
    const review = await this.db.query.reviews.findFirst({
      where: and(eq(reviews.productId, productId), eq(reviews.userId, userId)),
    })

    if (!review) return null

    return this.mapToEntity(review)
  }

  async update(id: string, review: Review): Promise<Review> {
    await this.db
      .update(reviews)
      .set({
        rating: review.rating.getValue(),
        title: review.title,
        comment: review.comment,
        updatedAt: review.updatedAt,
      })
      .where(eq(reviews.id, id))

    return this.findById(id) as Promise<Review>
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(reviews).where(eq(reviews.id, id))
  }

  async getAverageRating(productId: string): Promise<number> {
    const result = await this.db
      .select({
        average: avg(reviews.rating),
      })
      .from(reviews)
      .where(eq(reviews.productId, productId))

    const average = result[0]?.average
    return average ? parseFloat(average as string) : 0
  }

  async getRatingDistribution(productId: string): Promise<ReviewStats['ratingDistribution']> {
    const distribution = await this.db
      .select({
        rating: reviews.rating,
        count: count(),
      })
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .groupBy(reviews.rating)

    // Initialize with zeros
    const result: ReviewStats['ratingDistribution'] = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    // Fill in actual counts
    for (const item of distribution) {
      if (item.rating >= 1 && item.rating <= 5) {
        result[item.rating as 1 | 2 | 3 | 4 | 5] = item.count
      }
    }

    return result
  }

  async getStats(productId: string): Promise<ReviewStats> {
    const [averageRating, ratingDistribution, totalReviewsResult] = await Promise.all([
      this.getAverageRating(productId),
      this.getRatingDistribution(productId),
      this.db
        .select({
          count: count(),
        })
        .from(reviews)
        .where(eq(reviews.productId, productId)),
    ])

    const totalReviews = totalReviewsResult[0]?.count || 0

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
    }
  }

  async existsById(id: string): Promise<boolean> {
    const review = await this.db.query.reviews.findFirst({
      where: eq(reviews.id, id),
      columns: { id: true },
    })

    return !!review
  }

  async existsByProductAndUser(productId: string, userId: string): Promise<boolean> {
    const review = await this.db.query.reviews.findFirst({
      where: and(eq(reviews.productId, productId), eq(reviews.userId, userId)),
      columns: { id: true },
    })

    return !!review
  }

  // Helper method to map database result to domain entity
  private mapToEntity(reviewData: any): Review {
    return new Review(
      reviewData.id,
      reviewData.productId,
      reviewData.userId,
      reviewData.orderId,
      new Rating(reviewData.rating),
      reviewData.title,
      reviewData.comment,
      new Date(reviewData.createdAt),
      new Date(reviewData.updatedAt),
    )
  }
}
