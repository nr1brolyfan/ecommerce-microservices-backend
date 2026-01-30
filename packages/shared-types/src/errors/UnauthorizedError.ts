/**
 * Unauthorized Error
 * Thrown when authentication fails or token is invalid
 */

import { DomainError } from './DomainError'

export class UnauthorizedError extends DomainError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}
