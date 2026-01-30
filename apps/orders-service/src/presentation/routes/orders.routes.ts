import { zValidator } from '@hono/zod-validator'
import { authMiddleware, requireAdmin } from '@repo/shared-utils/auth/middleware'
import { errorResponse } from '@repo/shared-utils/response/error'
import { successResponse } from '@repo/shared-utils/response/success'
import { Hono } from 'hono'
// Import use cases
import { CreateOrder } from '../../application/use-cases/CreateOrder.js'
import { GetOrderById } from '../../application/use-cases/GetOrderById.js'
import { GetOrdersByUserId } from '../../application/use-cases/GetOrdersByUserId.js'
import { UpdateOrderStatus } from '../../application/use-cases/UpdateOrderStatus.js'
import { CartClient } from '../../infrastructure/clients/CartClient.js'
import { ProductsClient } from '../../infrastructure/clients/ProductsClient.js'
import { db } from '../../infrastructure/database/connection.js'
// Import repository and clients
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository.js'
import {
  createOrderSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
  userIdParamSchema,
} from '../validators/order.validators.js'

const app = new Hono()

// Initialize dependencies
const orderRepository = new OrderRepository(db)
const cartClient = new CartClient()
const productsClient = new ProductsClient()

// Initialize use cases
const createOrderUseCase = new CreateOrder(orderRepository, cartClient, productsClient)
const getOrderByIdUseCase = new GetOrderById(orderRepository)
const getOrdersByUserIdUseCase = new GetOrdersByUserId(orderRepository)
const updateOrderStatusUseCase = new UpdateOrderStatus(orderRepository)

// POST /api/orders - Create order from cart
app.post('/', authMiddleware, zValidator('json', createOrderSchema), async (c) => {
  try {
    const body = c.req.valid('json')
    const user = c.get('user')

    // Verify user can only create their own orders (unless admin)
    if (user.role !== 'admin' && user.sub !== body.userId) {
      return c.json(errorResponse('Forbidden: You can only create your own orders'), 403)
    }

    const order = await createOrderUseCase.execute(body)
    return c.json(successResponse(order), 201)
  } catch (error: any) {
    console.error('Error creating order:', error)
    return c.json(errorResponse(error.message || 'Failed to create order'), 400)
  }
})

// GET /api/orders/:id - Get order by ID
app.get('/:id', authMiddleware, zValidator('param', orderIdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param')
    const user = c.get('user')

    const order = await getOrderByIdUseCase.execute(id)

    // Verify user can only view their own orders (unless admin)
    if (user.role !== 'admin' && user.sub !== order.userId) {
      return c.json(errorResponse('Forbidden: You can only view your own orders'), 403)
    }

    return c.json(successResponse(order))
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return c.json(errorResponse(error.message || 'Failed to fetch order'), 404)
  }
})

// GET /api/orders/user/:userId - Get orders by user ID
app.get('/user/:userId', authMiddleware, zValidator('param', userIdParamSchema), async (c) => {
  try {
    const { userId } = c.req.valid('param')
    const user = c.get('user')

    // Verify user can only view their own orders (unless admin)
    if (user.role !== 'admin' && user.sub !== userId) {
      return c.json(errorResponse('Forbidden: You can only view your own orders'), 403)
    }

    const orders = await getOrdersByUserIdUseCase.execute(userId)
    return c.json(successResponse(orders))
  } catch (error: any) {
    console.error('Error fetching user orders:', error)
    return c.json(errorResponse(error.message || 'Failed to fetch user orders'), 400)
  }
})

// PUT /api/orders/:id/status - Update order status (admin only)
app.put(
  '/:id/status',
  authMiddleware,
  requireAdmin,
  zValidator('param', orderIdParamSchema),
  zValidator('json', updateOrderStatusSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const body = c.req.valid('json')

      const order = await updateOrderStatusUseCase.execute(id, body)
      return c.json(successResponse(order))
    } catch (error: any) {
      console.error('Error updating order status:', error)
      return c.json(errorResponse(error.message || 'Failed to update order status'), 400)
    }
  },
)

export default app
