/**
 * @repo/shared-types
 * Shared TypeScript types, DTOs, domain models and errors
 */

// Domain Entities
export * from './domain/entities/BaseEntity.js'

// Domain Value Objects
export * from './domain/value-objects/Email.js'
export * from './domain/value-objects/Password.js'
export * from './domain/value-objects/Id.js'

// Errors
export * from './errors/DomainError.js'
export * from './errors/ValidationError.js'
export * from './errors/NotFoundError.js'
export * from './errors/UnauthorizedError.js'
export * from './errors/ForbiddenError.js'

// DTOs
export * from './dtos/auth/index.js'
export * from './dtos/products/index.js'
export * from './dtos/cart/index.js'
export * from './dtos/orders/index.js'
export * from './dtos/reviews/index.js'
