import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { GetUserById } from '../../application/use-cases/GetUserById.js'
import { UpdateUser } from '../../application/use-cases/UpdateUser.js'
import { UserRepository } from '../../infrastructure/repositories/UserRepository.js'
import { updateUserSchema } from '../validators/auth.validators.js'
import { authMiddleware } from '@repo/shared-utils'
import type { JWTPayload } from '@repo/shared-utils'

type Variables = {
  user: JWTPayload
}

const app = new Hono<{ Variables: Variables }>()

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

// Dependency injection
const userRepository = new UserRepository()
const getUserByIdUseCase = new GetUserById(userRepository)
const updateUserUseCase = new UpdateUser(userRepository)

/**
 * GET /api/users/:id
 * Get user by ID (authenticated users only)
 */
app.get('/:id', authMiddleware(JWT_SECRET), async (c) => {
  try {
    const userId = c.req.param('id')
    const currentUser = c.get('user')

    // Users can only view their own profile, admins can view any
    if (currentUser.sub !== userId && currentUser.role !== 'admin') {
      return c.json(
        {
          success: false,
          error: 'Forbidden: You can only view your own profile',
        },
        403,
      )
    }

    const user = await getUserByIdUseCase.execute(userId)

    return c.json({
      success: true,
      data: user,
    })
  } catch (error) {
    if (error instanceof Error) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        404,
      )
    }
    return c.json(
      {
        success: false,
        error: 'Internal server error',
      },
      500,
    )
  }
})

/**
 * PUT /api/users/:id
 * Update user profile (own profile or admin)
 */
app.put('/:id', authMiddleware(JWT_SECRET), zValidator('json', updateUserSchema), async (c) => {
  try {
    const userId = c.req.param('id')
    const currentUser = c.get('user')
    const dto = c.req.valid('json')

    // Users can only update their own profile, admins can update any
    if (currentUser.sub !== userId && currentUser.role !== 'admin') {
      return c.json(
        {
          success: false,
          error: 'Forbidden: You can only update your own profile',
        },
        403,
      )
    }

    const user = await updateUserUseCase.execute(userId, dto)

    return c.json({
      success: true,
      data: user,
    })
  } catch (error) {
    if (error instanceof Error) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        400,
      )
    }
    return c.json(
      {
        success: false,
        error: 'Internal server error',
      },
      500,
    )
  }
})

export default app
