import { zValidator } from '@hono/zod-validator'
import { authMiddleware, requireAdmin } from '@repo/shared-utils/auth'
import { Hono } from 'hono'
import { CreateCategory } from '../../application/use-cases/CreateCategory.js'
import { GetCategories } from '../../application/use-cases/GetCategories.js'
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository.js'
import { createCategorySchema } from '../validators/product.validators.js'

const app = new Hono()

// Initialize repository
const categoryRepository = new CategoryRepository()

// Initialize use cases
const createCategory = new CreateCategory(categoryRepository)
const getCategories = new GetCategories(categoryRepository)

// Public routes
app.get('/', async (c) => {
  try {
    const categories = await getCategories.execute()

    return c.json({
      success: true,
      data: categories,
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

// Admin-only routes
app.post('/', authMiddleware, requireAdmin, zValidator('json', createCategorySchema), async (c) => {
  try {
    const body = c.req.valid('json')
    const category = await createCategory.execute(body)

    return c.json(
      {
        success: true,
        data: category,
      },
      201,
    )
  } catch (error: any) {
    const status =
      error.name === 'DuplicateSlugError' ? 409 : error.name === 'ValidationError' ? 400 : 500

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
