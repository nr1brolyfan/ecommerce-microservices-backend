import { BaseEntity, Email, Password } from '@repo/shared-types'

export type UserRole = 'user' | 'admin'

export interface UserProps {
  id: string
  email: Email
  passwordHash: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

/**
 * User Domain Entity
 * Represents a user in the system following DDD principles
 */
export class User extends BaseEntity {
  private _email: Email
  private _passwordHash: string
  private _firstName: string
  private _lastName: string
  private _role: UserRole

  constructor(props: UserProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._email = props.email
    this._passwordHash = props.passwordHash
    this._firstName = props.firstName
    this._lastName = props.lastName
    this._role = props.role
  }

  // Getters
  get email(): Email {
    return this._email
  }

  get passwordHash(): string {
    return this._passwordHash
  }

  get firstName(): string {
    return this._firstName
  }

  get lastName(): string {
    return this._lastName
  }

  get role(): UserRole {
    return this._role
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`
  }

  // Business methods
  isAdmin(): boolean {
    return this._role === 'admin'
  }

  updateProfile(firstName: string, lastName: string): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty')
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty')
    }

    this._firstName = firstName.trim()
    this._lastName = lastName.trim()
    this.markAsUpdated()
  }

  updateEmail(email: Email): void {
    this._email = email
    this.markAsUpdated()
  }

  updatePassword(passwordHash: string): void {
    if (!passwordHash || passwordHash.length === 0) {
      throw new Error('Password hash cannot be empty')
    }
    this._passwordHash = passwordHash
    this.markAsUpdated()
  }

  // Factory method
  static create(
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    role: UserRole = 'user',
  ): User {
    const emailVO = new Email(email)

    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty')
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty')
    }

    return new User({
      id: crypto.randomUUID(),
      email: emailVO,
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // Convert to plain object (for persistence)
  toPlainObject() {
    return {
      id: this.id,
      email: this._email.getValue(),
      passwordHash: this._passwordHash,
      firstName: this._firstName,
      lastName: this._lastName,
      role: this._role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
