/**
 * Not Found Error
 * Thrown when a requested resource is not found
 */

import { DomainError } from './DomainError.js'

export class NotFoundError extends DomainError {
  constructor(
    resource: string,
    id?: string,
  ) {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`
    super(message, 'NOT_FOUND')
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
