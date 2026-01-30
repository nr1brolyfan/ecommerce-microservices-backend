/**
 * Authentication Middleware for Hono
 */

import type { Context, Next } from 'hono'
import { UnauthorizedError, ForbiddenError } from '@repo/shared-types'
import { verifyToken } from '../jwt/verify'
import type { JWTPayload } from '../jwt/types'

/**
 * Auth middleware - verifies JWT token
 * Adds user payload to context
 */
export function authMiddleware(secret: string) {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header')
    }

    const token = authHeader.substring(7)

    try {
      const payload = await verifyToken(token, secret)
      c.set('user', payload)
      await next()
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token')
    }
  }
}

/**
 * Require admin role middleware
 * Must be used after authMiddleware
 */
export async function requireAdmin(c: Context, next: Next) {
  const user = c.get('user') as JWTPayload | undefined

  if (!user) {
    throw new UnauthorizedError('User not authenticated')
  }

  if (user.role !== 'admin') {
    throw new ForbiddenError('Admin access required')
  }

  await next()
}

/**
 * Require ownership middleware
 * Checks if user ID matches the resource owner
 */
export function requireOwnership(userIdParam = 'userId') {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as JWTPayload | undefined

    if (!user) {
      throw new UnauthorizedError('User not authenticated')
    }

    const resourceUserId = c.req.param(userIdParam)

    // Admin can access any resource
    if (user.role === 'admin') {
      await next()
      return
    }

    // User can only access their own resources
    if (user.sub !== resourceUserId) {
      throw new ForbiddenError('You can only access your own resources')
    }

    await next()
  }
}
