import { DomainError, NotFoundError } from '@repo/shared-types/errors'

export class CartNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Cart not found: ${identifier}`)
    this.name = 'CartNotFoundError'
  }
}

export class CartItemNotFoundError extends NotFoundError {
  constructor(productId: string) {
    super(`Cart item not found for product: ${productId}`)
    this.name = 'CartItemNotFoundError'
  }
}

export class ProductNotAvailableError extends DomainError {
  constructor(productId: string) {
    super(`Product is not available: ${productId}`)
    this.name = 'ProductNotAvailableError'
  }
}

export class InsufficientStockError extends DomainError {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`,
    )
    this.name = 'InsufficientStockError'
  }
}

export class InvalidQuantityError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidQuantityError'
  }
}
