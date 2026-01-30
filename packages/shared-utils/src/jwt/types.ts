/**
 * JWT Types
 */

import type { UserRole } from '@repo/shared-types'

export interface JWTPayload {
  sub: string // user ID
  email: string
  role: UserRole
  iat?: number // issued at
  exp?: number // expiration
}
