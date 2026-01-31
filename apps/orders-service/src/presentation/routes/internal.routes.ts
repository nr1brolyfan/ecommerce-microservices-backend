import { zValidator } from '@hono/zod-validator'
import { errorResponse } from '@repo/shared-utils/response/error'
import { successResponse } from '@repo/shared-utils/response/success'
import { Hono } from 'hono'
import { z } from 'zod'
import { GetOrderById } from '../../application/use-cases/GetOrderById.js'
import { db } from '../../infrastructure/database/connection.js'
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository.js'

const app = new Hono()

// Initialize dependencies
const orderRepository = new OrderRepository(db)
const getOrderByIdUseCase = new GetOrderById(orderRepository)

// Validation schema
const orderIdParamSchema = z.object({
  id: z.string().uuid(),
})

/**
 * Internal endpoint for getting order details
 * Used by reviews-service for purchase verification
 * This endpoint is NOT protected by auth middleware
 * It should be accessed only by other services
 */
app.get('/:id', zValidator('param', orderIdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param')
    const order = await getOrderByIdUseCase.execute(id)
    return c.json(successResponse(order))
  } catch (error: any) {
    console.error('Error fetching order:', error)

    const status = error.name === 'OrderNotFoundError' ? 404 : 500

    return c.json(errorResponse(error.message || 'Failed to fetch order'), status)
  }
})

export default app
