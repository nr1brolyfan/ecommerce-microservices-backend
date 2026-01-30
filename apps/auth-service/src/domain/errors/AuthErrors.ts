import { DomainError } from '@repo/shared-types/errors/DomainError'
import { NotFoundError } from '@repo/shared-types/errors/NotFoundError'
import { ValidationError } from '@repo/shared-types/errors/ValidationError'

/**
 * User Not Found Error
 */
export class UserNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`User with identifier '${identifier}' not found`)
    this.name = 'UserNotFoundError'
  }
}

/**
 * Invalid Credentials Error
 */
export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

/**
 * User Already Exists Error
 */
export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email '${email}' already exists`)
    this.name = 'UserAlreadyExistsError'
  }
}

/**
 * Invalid Email Error
 */
export class InvalidEmailError extends ValidationError {
  constructor(email: string) {
    super(`Invalid email format: '${email}'`)
    this.name = 'InvalidEmailError'
  }
}

/**
 * Invalid Password Error
 */
export class InvalidPasswordError extends ValidationError {
  constructor(message?: string) {
    super(
      message ||
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
    )
    this.name = 'InvalidPasswordError'
  }
}

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Forbidden Error
 */
export class ForbiddenError extends DomainError {
  constructor(message: string = 'Access forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}
