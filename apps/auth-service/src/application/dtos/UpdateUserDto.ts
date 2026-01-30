/**
 * Update User DTO
 */
export interface UpdateUserDto {
  firstName?: string | undefined
  lastName?: string | undefined
  email?: string | undefined
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
