import { IUserRepository } from '../../domain/repositories/IUserRepository.js'
import { UserNotFoundError } from '../../domain/errors/AuthErrors.js'
import { UserResponseDto } from '../dtos/UpdateUserDto.js'

/**
 * Get User By ID Use Case
 * Retrieves user details by ID
 */
export class GetUserById {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    // Find user by ID
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError(userId)
    }

    // Return response
    return {
      id: user.id,
      email: user.email.getValue(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
