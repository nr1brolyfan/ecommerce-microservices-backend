import type { IUserRepository } from '../../domain/repositories/IUserRepository.js'
import { Email } from '@repo/shared-types'
import { UserNotFoundError, UserAlreadyExistsError } from '../../domain/errors/AuthErrors.js'
import type { UpdateUserDto, UserResponseDto } from '../dtos/UpdateUserDto.js'

/**
 * Update User Use Case
 * Handles user profile updates
 */
export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    // Find user by ID
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError(userId)
    }

    // Update email if provided
    if (dto.email) {
      const emailVO = new Email(dto.email)
      
      // Check if new email is already taken by another user
      const existingUser = await this.userRepository.findByEmail(dto.email)
      if (existingUser && existingUser.id !== userId) {
        throw new UserAlreadyExistsError(dto.email)
      }
      
      user.updateEmail(emailVO)
    }

    // Update profile if provided
    if (dto.firstName || dto.lastName) {
      user.updateProfile(
        dto.firstName || user.firstName,
        dto.lastName || user.lastName,
      )
    }

    // Persist changes
    const updatedUser = await this.userRepository.update(user)

    // Return response
    return {
      id: updatedUser.id,
      email: updatedUser.email.getValue(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    }
  }
}
