/**
 * Register User DTO
 */
export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}

/**
 * Register Response DTO
 */
export interface RegisterResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: Date
}
