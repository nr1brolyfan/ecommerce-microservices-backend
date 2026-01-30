/**
 * JWT Verification
 */

import { jwtVerify } from 'jose'
import type { JWTPayload } from './types'

/**
 * Verify JWT token
 * @param token - JWT token string
 * @param secret - JWT secret key
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export async function verifyToken(token: string, secret: string): Promise<JWTPayload> {
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(secret)

  const { payload } = await jwtVerify(token, secretKey)

  return payload as unknown as JWTPayload
}
