import { zValidator } from '@hono/zod-validator'
import { authMiddleware, requireAdmin } from '@repo/shared-utils/auth'
import type { JWTPayload } from '@repo/shared-utils/jwt'
import { Hono } from 'hono'
import { CreateProduct } from '../../application/use-cases/CreateProduct.js'
import { DeleteProduct } from '../../application/use-cases/DeleteProduct.js'
import { GetProductById } from '../../application/use-cases/GetProductById.js'
import { GetProducts } from '../../application/use-cases/GetProducts.js'
import { UpdateProduct } from '../../application/use-cases/UpdateProduct.js'
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository.js'
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository.js'
import { createProductSchema, updateProductSchema } from '../validators/product.validators.js'

type Variables = {
  user: JWTPayload
}

const app = new Hono<{ Variables: Variables }>()

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

// Initialize repositories
const productRepository = new ProductRepository()
const categoryRepository = new CategoryRepository()

// Initialize use cases
const createProduct = new CreateProduct(productRepository, categoryRepository)
const getProducts = new GetProducts(productRepository)
const getProductById = new GetProductById(productRepository)
const updateProduct = new UpdateProduct(productRepository, categoryRepository)
const deleteProduct = new DeleteProduct(productRepository)

// Public routes
app.get('/', async (c) => {
  try {
    const categoryId = c.req.query('categoryId')
    const filters = categoryId ? { categoryId } : undefined
    const products = await getProducts.execute(filters)

    return c.json({
      success: true,
      data: products,
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

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const product = await getProductById.execute(id)

    return c.json({
      success: true,
      data: product,
    })
  } catch (error: any) {
    const status = error.name === 'ProductNotFoundError' ? 404 : 500
    return c.json(
      {
        success: false,
        error: error.message,
      },
      status,
    )
  }
})

// Admin-only routes
app.post(
  '/',
  authMiddleware(JWT_SECRET),
  requireAdmin,
  zValidator('json', createProductSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')
      const product = await createProduct.execute(body)

      return c.json(
        {
          success: true,
          data: product,
        },
        201,
      )
    } catch (error: any) {
      const status =
        error.name === 'CategoryNotFoundError'
          ? 404
          : error.name === 'DuplicateSkuError' || error.name === 'DuplicateSlugError'
            ? 409
            : error.name === 'ValidationError'
              ? 400
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

app.put(
  '/:id',
  authMiddleware(JWT_SECRET),
  requireAdmin,
  zValidator('json', updateProductSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const body = c.req.valid('json')
      const product = await updateProduct.execute(id, body)

      return c.json({
        success: true,
        data: product,
      })
    } catch (error: any) {
      const status =
        error.name === 'ProductNotFoundError' || error.name === 'CategoryNotFoundError'
          ? 404
          : error.name === 'DuplicateSkuError' || error.name === 'DuplicateSlugError'
            ? 409
            : error.name === 'ValidationError'
              ? 400
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

app.delete('/:id', authMiddleware(JWT_SECRET), requireAdmin, async (c) => {
  try {
    const id = c.req.param('id')
    await deleteProduct.execute(id)

    return c.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error: any) {
    const status = error.name === 'ProductNotFoundError' ? 404 : 500
    return c.json(
      {
        success: false,
        error: error.message,
      },
      status,
    )
  }
})

export default app
