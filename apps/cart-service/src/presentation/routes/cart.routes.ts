import { zValidator } from '@hono/zod-validator'
import { authMiddleware, requireOwnership } from '@repo/shared-utils/auth'
import type { JWTPayload } from '@repo/shared-utils/jwt'
import { Hono } from 'hono'
import { AddItemToCart } from '../../application/use-cases/AddItemToCart.js'
import { ClearCart } from '../../application/use-cases/ClearCart.js'
import { GetCart } from '../../application/use-cases/GetCart.js'
import { RemoveCartItem } from '../../application/use-cases/RemoveCartItem.js'
import { UpdateCartItem } from '../../application/use-cases/UpdateCartItem.js'
import { config } from '../../config/env.js'
import { CartRepository } from '../../infrastructure/repositories/CartRepository.js'
import { addItemToCartSchema, updateCartItemSchema } from '../validators/cart.validators.js'

type Variables = {
  user: JWTPayload
}

const app = new Hono<{ Variables: Variables }>()

// Initialize repository
const cartRepository = new CartRepository()

// Initialize use cases
const getCart = new GetCart(cartRepository)
const addItemToCart = new AddItemToCart(cartRepository)
const updateCartItem = new UpdateCartItem(cartRepository)
const removeCartItem = new RemoveCartItem(cartRepository)
const clearCart = new ClearCart(cartRepository)

// Initialize middleware
const auth = authMiddleware(config.jwtSecret)
const ownership = requireOwnership('userId')

// GET /api/cart/:userId - Get user's cart
app.get('/:userId', auth, ownership, async (c) => {
  try {
    const userId = c.req.param('userId')
    console.log('Getting cart for userId:', userId)
    const cart = await getCart.execute(userId)

    return c.json({
      success: true,
      data: cart.toJSON(),
    })
  } catch (error: any) {
    console.error('Cart error:', error)
    return c.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      500,
    )
  }
})

// POST /api/cart/:userId/items - Add item to cart
app.post('/:userId/items', auth, ownership, zValidator('json', addItemToCartSchema), async (c) => {
  try {
    const userId = c.req.param('userId')
    const body = c.req.valid('json')

    const cartItem = await addItemToCart.execute({
      userId,
      productId: body.productId,
      quantity: body.quantity,
    })

    return c.json(
      {
        success: true,
        data: cartItem.toJSON(),
      },
      201,
    )
  } catch (error: any) {
    const status = error.message.includes('not found')
      ? 404
      : error.message.includes('Insufficient stock')
        ? 409
        : 500

    return c.json(
      {
        success: false,
        error: error.message,
      },
      status,
    )
  }
})

// PUT /api/cart/:userId/items/:productId - Update item quantity
app.put(
  '/:userId/items/:productId',
  auth,
  ownership,
  zValidator('json', updateCartItemSchema),
  async (c) => {
    try {
      const userId = c.req.param('userId')
      const productId = c.req.param('productId')
      const body = c.req.valid('json')

      const cartItem = await updateCartItem.execute({
        userId,
        productId,
        quantity: body.quantity,
      })

      return c.json({
        success: true,
        data: cartItem.toJSON(),
      })
    } catch (error: any) {
      const status = error.message.includes('not found')
        ? 404
        : error.message.includes('Insufficient stock')
          ? 409
          : 500

      return c.json(
        {
          success: false,
          error: error.message,
        },
        status,
      )
    }
  },
)

// DELETE /api/cart/:userId/items/:productId - Remove item from cart
app.delete('/:userId/items/:productId', auth, ownership, async (c) => {
  try {
    const userId = c.req.param('userId')
    const productId = c.req.param('productId')

    await removeCartItem.execute({
      userId,
      productId,
    })

    return c.json({
      success: true,
      message: 'Item removed from cart',
    })
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 500

    return c.json(
      {
        success: false,
        error: error.message,
      },
      status,
    )
  }
})

// DELETE /api/cart/:userId - Clear cart
app.delete('/:userId', auth, ownership, async (c) => {
  try {
    const userId = c.req.param('userId')
    await clearCart.execute(userId)

    return c.json({
      success: true,
      message: 'Cart cleared successfully',
    })
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: error.message,
      },
      500,
    )
  }
})

export default app
