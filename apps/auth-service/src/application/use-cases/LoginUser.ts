import { IUserRepository } from '../../domain/repositories/IUserRepository.js'
import { InvalidCredentialsError } from '../../domain/errors/AuthErrors.js'
import { LoginDto, LoginResponseDto } from '../dtos/LoginDto.js'
import { comparePassword } from '@repo/shared-utils/auth/password'
import { generateToken } from '@repo/shared-utils/jwt/generate'

/**
 * Login User Use Case
 * Handles user authentication and JWT generation
 */
export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

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
    const token = await generateToken({
      sub: user.id,
      email: user.email.getValue(),
      role: user.role,
    })

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
