/**
 * Forbidden Error
 * Thrown when user doesn't have permission for the action
 */

import { DomainError } from './DomainError.js'

export class ForbiddenError extends DomainError {
  constructor(message = 'Forbidden: insufficient permissions') {
    super(message, 'FORBIDDEN')
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}
