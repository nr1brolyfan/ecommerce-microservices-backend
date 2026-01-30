/**
 * Validation Error
 * Thrown when input validation fails
 */

import { DomainError } from './DomainError.js'

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}
