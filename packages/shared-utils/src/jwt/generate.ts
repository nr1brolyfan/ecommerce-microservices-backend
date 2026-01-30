/**
 * JWT Generation
 */

import { SignJWT } from 'jose'
import type { JWTPayload } from './types'

/**
 * Generate JWT token
 * @param payload - JWT payload with user data
 * @param secret - JWT secret key
 * @param expiresIn - Expiration time (default: 24h)
 */
export async function generateToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string,
  expiresIn = '24h',
): Promise<string> {
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(secret)

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey)
}
