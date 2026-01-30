import { ValidationError } from '@repo/shared-types/errors'
import { Review } from '../../domain/entities/Review.js'
import type { IReviewRepository } from '../../domain/repositories/IReviewRepository.js'
import type { CreateReviewDto, ReviewResponseDto } from '../dtos/ReviewDtos.js'

// Product service types
interface Product {
  id: string
  name: string
}

// Order service types
interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
  }>
}

// External service clients (will be injected)
export interface IProductServiceClient {
  getProduct(productId: string): Promise<Product | null>
}

export interface IOrderServiceClient {
  getOrder(orderId: string): Promise<Order | null>
}

export class CreateReview {
  constructor(
    private reviewRepository: IReviewRepository,
    private productServiceClient: IProductServiceClient,
    private orderServiceClient: IOrderServiceClient,
  ) {}

  async execute(dto: CreateReviewDto): Promise<ReviewResponseDto> {
    // 1. Verify product exists
    const product = await this.productServiceClient.getProduct(dto.productId)
    if (!product) {
      throw new ValidationError('Product not found')
    }

    // 2. Verify order exists and belongs to user
    const order = await this.orderServiceClient.getOrder(dto.orderId)
    if (!order) {
      throw new ValidationError('Order not found')
    }

    if (order.userId !== dto.userId) {
      throw new ValidationError('Order does not belong to user')
    }

    // 3. Verify user purchased this product in this order
    const productInOrder = order.items.some((item) => item.productId === dto.productId)
    if (!productInOrder) {
      throw new ValidationError('Product not found in order')
    }

    // 4. Check if user already reviewed this product
    const existingReview = await this.reviewRepository.existsByProductAndUser(
      dto.productId,
      dto.userId,
    )
    if (existingReview) {
      throw new ValidationError('User already reviewed this product')
    }

    // 5. Create review entity
    const review = Review.create(
      dto.productId,
      dto.userId,
      dto.orderId,
      dto.rating,
      dto.title,
      dto.comment,
    )

    // 6. Save to database
    const savedReview = await this.reviewRepository.create(review)

    // 7. Return response
    return this.toResponseDto(savedReview)
  }

  private toResponseDto(review: Review): ReviewResponseDto {
    return review.toJSON()
  }
}
