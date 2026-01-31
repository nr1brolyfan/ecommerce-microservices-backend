import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '@repo/shared-utils/auth'
import type { JWTPayload } from '@repo/shared-utils/jwt'
import { errorResponse, successResponse } from '@repo/shared-utils/response'
import { Hono } from 'hono'
// Import use cases
import { CreateReview } from '../../application/use-cases/CreateReview.js'
import { DeleteReview } from '../../application/use-cases/DeleteReview.js'
import { GetReviewsByProduct } from '../../application/use-cases/GetReviewsByProduct.js'
import { GetReviewsByUser } from '../../application/use-cases/GetReviewsByUser.js'
import { UpdateReview } from '../../application/use-cases/UpdateReview.js'
import { config } from '../../config/env.js'
import { OrdersClient } from '../../infrastructure/clients/OrdersClient.js'
import { ProductsClient } from '../../infrastructure/clients/ProductsClient.js'
import { db } from '../../infrastructure/database/connection.js'
// Import repository and clients
import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository.js'
import {
  createReviewSchema,
  productIdParamSchema,
  reviewIdParamSchema,
  updateReviewSchema,
  userIdParamSchema,
} from '../validators/review.validators.js'

type Variables = {
  user: JWTPayload
}

const app = new Hono<{ Variables: Variables }>()

// Create auth middleware with JWT secret
const auth = authMiddleware(config.jwtSecret)

// Initialize dependencies
const reviewRepository = new ReviewRepository(db)
const productsClient = new ProductsClient()
const ordersClient = new OrdersClient()

// Initialize use cases
const createReviewUseCase = new CreateReview(reviewRepository, productsClient, ordersClient)
const getReviewsByProductUseCase = new GetReviewsByProduct(reviewRepository)
const getReviewsByUserUseCase = new GetReviewsByUser(reviewRepository)
const updateReviewUseCase = new UpdateReview(reviewRepository)
const deleteReviewUseCase = new DeleteReview(reviewRepository)

// POST /api/reviews - Create review (requires purchase verification)
app.post('/', auth, zValidator('json', createReviewSchema), async (c) => {
  try {
    const body = c.req.valid('json')
    const user = c.get('user')

    // Verify user can only create reviews for themselves (unless admin)
    if (user.role !== 'admin' && user.sub !== body.userId) {
      return c.json(errorResponse('Forbidden: You can only create reviews for yourself'), 403)
    }

    const review = await createReviewUseCase.execute(body as any)
    return c.json(successResponse(review), 201)
  } catch (error: any) {
    console.error('Error creating review:', error)

    // Handle service unavailable errors
    if (error.message?.includes('service unavailable')) {
      return c.json(errorResponse(error.message), 503)
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return c.json(errorResponse(error.message), 400)
    }

    // Handle not found errors
    if (error.name === 'NotFoundError') {
      return c.json(errorResponse(error.message), 404)
    }

    return c.json(errorResponse(error.message || 'Failed to create review'), 400)
  }
})

// GET /api/reviews/product/:productId - Get reviews for product (public)
app.get('/product/:productId', zValidator('param', productIdParamSchema), async (c) => {
  try {
    const { productId } = c.req.valid('param')

    const reviews = await getReviewsByProductUseCase.execute(productId)
    return c.json(successResponse(reviews))
  } catch (error: any) {
    console.error('Error fetching product reviews:', error)
    return c.json(errorResponse(error.message || 'Failed to fetch product reviews'), 400)
  }
})

// GET /api/reviews/user/:userId - Get reviews by user (auth: own user or admin)
app.get('/user/:userId', auth, zValidator('param', userIdParamSchema), async (c) => {
  try {
    const { userId } = c.req.valid('param')
    const user = c.get('user')

    // Verify user can only view their own reviews (unless admin)
    if (user.role !== 'admin' && user.sub !== userId) {
      return c.json(errorResponse('Forbidden: You can only view your own reviews'), 403)
    }

    const reviews = await getReviewsByUserUseCase.execute(userId)
    return c.json(successResponse(reviews))
  } catch (error: any) {
    console.error('Error fetching user reviews:', error)
    return c.json(errorResponse(error.message || 'Failed to fetch user reviews'), 400)
  }
})

// PUT /api/reviews/:id - Update review (auth: own user or admin)
app.put(
  '/:id',
  auth,
  zValidator('param', reviewIdParamSchema),
  zValidator('json', updateReviewSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const body = c.req.valid('json')
      const user = c.get('user')

      const review = await updateReviewUseCase.execute(id, user.sub, body as any)
      return c.json(successResponse(review))
    } catch (error: any) {
      console.error('Error updating review:', error)
      return c.json(errorResponse(error.message || 'Failed to update review'), 400)
    }
  },
)

// DELETE /api/reviews/:id - Delete review (auth: own user or admin)
app.delete('/:id', auth, zValidator('param', reviewIdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param')
    const user = c.get('user')

    await deleteReviewUseCase.execute(id, user.sub)
    return c.json(successResponse({ message: 'Review deleted successfully' }))
  } catch (error: any) {
    console.error('Error deleting review:', error)
    return c.json(errorResponse(error.message || 'Failed to delete review'), 400)
  }
})

export default app
