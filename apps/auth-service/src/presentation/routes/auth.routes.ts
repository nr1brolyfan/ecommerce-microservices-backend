import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { RegisterUser } from '../../application/use-cases/RegisterUser.js'
import { LoginUser } from '../../application/use-cases/LoginUser.js'
import { UserRepository } from '../../infrastructure/repositories/UserRepository.js'
import { registerSchema, loginSchema } from '../validators/auth.validators.js'
import { authMiddleware } from '@repo/shared-utils'
import { GetUserById } from '../../application/use-cases/GetUserById.js'
import type { JWTPayload } from '@repo/shared-utils'

type Variables = {
  user: JWTPayload
}

const app = new Hono<{ Variables: Variables }>()

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

// Dependency injection
const userRepository = new UserRepository()
const registerUserUseCase = new RegisterUser(userRepository)
const loginUserUseCase = new LoginUser(userRepository, JWT_SECRET)
const getUserByIdUseCase = new GetUserById(userRepository)

/**
 * POST /api/auth/register
 * Register new user
 */
app.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const dto = c.req.valid('json')
    const user = await registerUserUseCase.execute(dto)

    return c.json(
      {
        success: true,
        data: user,
      },
      201,
    )
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

/**
 * POST /api/auth/login
 * Login user and return JWT
 */
app.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const dto = c.req.valid('json')
    const result = await loginUserUseCase.execute(dto)

    return c.json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error instanceof Error) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        401,
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
 * GET /api/auth/me
 * Get current authenticated user
 */
app.get('/me', authMiddleware(JWT_SECRET), async (c) => {
  try {
    const user = c.get('user')
    const userData = await getUserByIdUseCase.execute(user.sub)

    return c.json({
      success: true,
      data: userData,
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

export default app
