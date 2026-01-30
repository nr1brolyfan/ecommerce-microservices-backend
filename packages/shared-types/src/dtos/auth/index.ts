/**
 * Auth Service DTOs
 */

export type UserRole = 'user' | 'admin'

export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
}

export interface AuthResponseDto {
  token: string
  user: UserDto
}
