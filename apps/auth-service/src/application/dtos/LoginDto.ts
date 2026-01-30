/**
 * Login User DTO
 */
export interface LoginDto {
  email: string
  password: string
}

/**
 * Login Response DTO
 */
export interface LoginResponseDto {
  token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}
