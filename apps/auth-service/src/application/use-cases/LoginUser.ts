import type { IUserRepository } from '../../domain/repositories/IUserRepository.js'
import { InvalidCredentialsError } from '../../domain/errors/AuthErrors.js'
import type { LoginDto, LoginResponseDto } from '../dtos/LoginDto.js'
import { comparePassword, generateToken } from '@repo/shared-utils'

/**
 * Login User Use Case
 * Handles user authentication and JWT generation
 */
export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Verify password
    const isPasswordValid = await comparePassword(dto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    // Generate JWT token
    const token = await generateToken(
      {
        sub: user.id,
        email: user.email.getValue(),
        role: user.role,
      },
      this.jwtSecret,
    )

    // Return response
    return {
      token,
      user: {
        id: user.id,
        email: user.email.getValue(),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }
}
