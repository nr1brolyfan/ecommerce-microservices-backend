/**
 * Reviews Service DTOs
 */

export interface ReviewDto {
  id: string
  productId: string
  userId: string
  orderId: string
  rating: number // 1-5
  title: string
  comment: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateReviewDto {
  productId: string
  userId: string
  orderId: string
  rating: number
  title: string
  comment: string
}

export interface UpdateReviewDto {
  rating?: number
  title?: string
  comment?: string
}

export interface ReviewStatsDto {
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
