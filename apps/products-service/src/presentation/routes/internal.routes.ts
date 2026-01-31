import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { UpdateProductStock } from '../../application/use-cases/UpdateProductStock.js'
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository.js'

const app = new Hono()

// Initialize repositories
const productRepository = new ProductRepository()

// Initialize use cases
const updateProductStock = new UpdateProductStock(productRepository)

// Update stock schema
const updateStockSchema = z.object({
  quantityChange: z.number().int(),
})

/**
 * Internal endpoint for stock updates
 * Used by orders-service for inter-service communication
 * This endpoint is NOT protected by admin middleware
 * It should be accessed only by other services
 */
app.put('/:id/stock', zValidator('json', updateStockSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const { quantityChange } = c.req.valid('json')

    const product = await updateProductStock.execute(id, quantityChange)

    return c.json({
      success: true,
      data: product,
    })
  } catch (error: any) {
    const status =
      error.name === 'ProductNotFoundError'
        ? 404
        : error.name === 'InsufficientStockError'
          ? 400
          : 500

    return c.json(
      {
        success: false,
        error: { message: error.message },
      },
      status,
    )
  }
})

export default app
