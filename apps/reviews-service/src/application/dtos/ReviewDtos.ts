// Create Review DTO
export interface CreateReviewDto {
  productId: string
  userId: string
  orderId: string
  rating: number
  title: string
  comment?: string
}

// Update Review DTO
export interface UpdateReviewDto {
  rating: number
  title: string
  comment?: string
}

// Review Response DTO
export interface ReviewResponseDto {
  id: string
  productId: string
  userId: string
  orderId: string
  rating: number
  title: string
  comment: string | null
  createdAt: Date
  updatedAt: Date
}

// Review Stats Response DTO
export interface ReviewStatsResponseDto {
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
