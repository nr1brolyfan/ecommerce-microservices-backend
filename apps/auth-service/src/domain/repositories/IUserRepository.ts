import { User } from '../entities/User.js'

/**
 * User Repository Interface
 * Defines the contract for user persistence following DDD principles
 */
export interface IUserRepository {
  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>

  /**
   * Create new user
   */
  create(user: User): Promise<User>

  /**
   * Update existing user
   */
  update(user: User): Promise<User>

  /**
   * Delete user by ID
   */
  delete(id: string): Promise<void>

  /**
   * Check if email exists
   */
  existsByEmail(email: string): Promise<boolean>
}
