import { IUserRepository } from '../../domain/repositories/IUserRepository.js'
import { User } from '../../domain/entities/User.js'
import { Password } from '@repo/shared-types/domain/value-objects/Password'
import { UserAlreadyExistsError } from '../../domain/errors/AuthErrors.js'
import { RegisterDto, RegisterResponseDto } from '../dtos/RegisterDto.js'
import { hashPassword } from '@repo/shared-utils/auth/password'

/**
 * Register User Use Case
 * Handles user registration with validation
 */
export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: RegisterDto): Promise<RegisterResponseDto> {
    // Validate password strength
    const password = new Password(dto.password)

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new UserAlreadyExistsError(dto.email)
    }

    // Hash password
    const passwordHash = await hashPassword(password.getValue())

    // Create user entity
    const user = User.create(
      dto.email,
      passwordHash,
      dto.firstName,
      dto.lastName,
      'user',
    )

    // Persist user
    const savedUser = await this.userRepository.create(user)

    // Return response
    return {
      id: savedUser.id,
      email: savedUser.email.getValue(),
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    }
  }
}
