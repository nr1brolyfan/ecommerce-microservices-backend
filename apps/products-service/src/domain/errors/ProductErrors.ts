import { DomainError, NotFoundError } from '@repo/shared-types/errors'

export class ProductNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Product not found: ${identifier}`)
    this.name = 'ProductNotFoundError'
  }
}

export class CategoryNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Category not found: ${identifier}`)
    this.name = 'CategoryNotFoundError'
  }
}

export class DuplicateSkuError extends DomainError {
  constructor(sku: string) {
    super(`Product with SKU '${sku}' already exists`)
    this.name = 'DuplicateSkuError'
  }
}

export class DuplicateSlugError extends DomainError {
  constructor(slug: string) {
    super(`Resource with slug '${slug}' already exists`)
    this.name = 'DuplicateSlugError'
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

export class InvalidPriceError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPriceError'
  }
}

export class InvalidSkuError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidSkuError'
  }
}
