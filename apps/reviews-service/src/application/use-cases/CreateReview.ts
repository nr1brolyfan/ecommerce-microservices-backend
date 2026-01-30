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
  status: string
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

/**
 * CreateReview Use Case
 *
 * Business Rules:
 * - User must have purchased the product (verified via orderId)
 * - Product must exist in the catalog
 * - Order must belong to the user
 * - Order must be in a valid status (delivered, shipped, or processing)
 * - User can only have one review per product (enforced by DB constraint + app logic)
 * - Rating must be between 1-5 (enforced by Rating value object + Zod validator)
 * - Title must be at least 5 characters (enforced by Zod validator)
 *
 * Edge Cases Handled:
 * - Duplicate reviews (checked before creation)
 * - Cancelled/pending orders (only valid statuses allowed)
 * - Non-existent products (verified via Products Service)
 * - Non-existent orders (verified via Orders Service)
 * - Order not belonging to user (ownership check)
 * - Product not in order (purchase verification)
 * - Service unavailability (Products/Orders services down)
 */
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

    // 3. Verify order is not cancelled (only delivered/shipped orders can be reviewed)
    const validStatuses = ['delivered', 'shipped', 'processing']
    if (!validStatuses.includes(order.status.toLowerCase())) {
      throw new ValidationError(
        `Cannot review products from ${order.status} orders. Order must be delivered, shipped, or processing.`,
      )
    }

    // 4. Verify user purchased this product in this order
    const productInOrder = order.items.some((item) => item.productId === dto.productId)
    if (!productInOrder) {
      throw new ValidationError('Product not found in order')
    }

    // 5. Check if user already reviewed this product
    const existingReview = await this.reviewRepository.existsByProductAndUser(
      dto.productId,
      dto.userId,
    )
    if (existingReview) {
      throw new ValidationError('User already reviewed this product')
    }

    // 6. Create review entity
    const review = Review.create(
      dto.productId,
      dto.userId,
      dto.orderId,
      dto.rating,
      dto.title,
      dto.comment,
    )

    // 7. Save to database
    const savedReview = await this.reviewRepository.create(review)

    // 8. Return response
    return this.toResponseDto(savedReview)
  }

  private toResponseDto(review: Review): ReviewResponseDto {
    return review.toJSON()
  }
}
