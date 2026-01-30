/**
 * Update User DTO
 */
export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email?: string
}

/**
 * User Response DTO
 */
export interface UserResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: Date
  updatedAt: Date
}
