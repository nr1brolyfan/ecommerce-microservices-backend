import { DomainError, NotFoundError } from '@repo/shared-types/errors'

export class OrderNotFoundError extends NotFoundError {
  constructor(orderId: string) {
    super(`Order with id ${orderId} not found`)
    this.name = 'OrderNotFoundError'
  }
}

export class EmptyCartError extends DomainError {
  constructor() {
    super('Cannot create order from empty cart')
    this.name = 'EmptyCartError'
  }
}

export class InsufficientStockError extends DomainError {
  constructor(productName: string, available: number, requested: number) {
    super(`Insufficient stock for ${productName}. Available: ${available}, Requested: ${requested}`)
    this.name = 'InsufficientStockError'
  }
}

export class InvalidOrderStatusTransitionError extends DomainError {
  constructor(currentStatus: string, newStatus: string) {
    super(`Cannot transition order from ${currentStatus} to ${newStatus}`)
    this.name = 'InvalidOrderStatusTransitionError'
  }
}

export class OrderAlreadyDeliveredError extends DomainError {
  constructor(orderId: string) {
    super(`Order ${orderId} is already delivered and cannot be modified`)
    this.name = 'OrderAlreadyDeliveredError'
  }
}

export class OrderAlreadyCancelledError extends DomainError {
  constructor(orderId: string) {
    super(`Order ${orderId} is already cancelled and cannot be modified`)
    this.name = 'OrderAlreadyCancelledError'
  }
}
