import { eq } from 'drizzle-orm'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import { User } from '../../domain/entities/User'
import { Email } from '@repo/shared-types'
import { db } from '../database/connection'
import { users } from '../database/schema'
import type { Database } from '../database/connection'

/**
 * User Repository Implementation
 * Implements IUserRepository using Drizzle ORM
 */
export class UserRepository implements IUserRepository {
  constructor(private database: Database = db) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const result = await this.database
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (result.length === 0 || !result[0]) {
      return null
    }

    return this.toDomain(result[0])
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.database
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (result.length === 0 || !result[0]) {
      return null
    }

    return this.toDomain(result[0])
  }

  /**
   * Create new user
   */
  async create(user: User): Promise<User> {
    const plainUser = user.toPlainObject()

    const result = await this.database
      .insert(users)
      .values({
        id: plainUser.id,
        email: plainUser.email,
        passwordHash: plainUser.passwordHash,
        firstName: plainUser.firstName,
        lastName: plainUser.lastName,
        role: plainUser.role,
        createdAt: plainUser.createdAt,
        updatedAt: plainUser.updatedAt,
      })
      .returning()

    if (!result[0]) {
      throw new Error('Failed to create user')
    }

    return this.toDomain(result[0])
  }

  /**
   * Update existing user
   */
  async update(user: User): Promise<User> {
    const plainUser = user.toPlainObject()

    const result = await this.database
      .update(users)
      .set({
        email: plainUser.email,
        passwordHash: plainUser.passwordHash,
        firstName: plainUser.firstName,
        lastName: plainUser.lastName,
        role: plainUser.role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, plainUser.id))
      .returning()

    if (!result[0]) {
      throw new Error('Failed to update user')
    }

    return this.toDomain(result[0])
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<void> {
    await this.database.delete(users).where(eq(users.id, id))
  }

  /**
   * Check if email exists
   */
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    return result.length > 0
  }

  /**
   * Convert database row to domain entity
   */
  private toDomain(row: typeof users.$inferSelect): User {
    return new User({
      id: row.id,
      email: new Email(row.email),
      passwordHash: row.passwordHash,
      firstName: row.firstName,
      lastName: row.lastName,
      role: row.role,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }
}
