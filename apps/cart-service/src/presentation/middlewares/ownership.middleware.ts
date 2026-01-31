import type { JWTPayload } from '@repo/shared-utils/jwt'
import type { MiddlewareHandler } from 'hono'

/**
 * Middleware to check if the user owns the resource (cart)
 * or is an admin
 */
export const requireOwnership: MiddlewareHandler = async (c, next) => {
  const user = c.get('user') as JWTPayload
  const userId = c.req.param('userId')

  if (!user) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      401,
    )
  }

  // Allow if user is admin or owns the resource
  if (user.role === 'admin' || user.sub === userId) {
    return await next()
  }

  return c.json(
    {
      success: false,
      error: 'Forbidden: You can only access your own cart',
    },
    403,
  )
}
