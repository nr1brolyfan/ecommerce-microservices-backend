/**
 * @repo/shared-types
 * Shared TypeScript types, DTOs, domain models and errors
 */

// Domain Entities
export * from './domain/entities/BaseEntity'

// Domain Value Objects
export * from './domain/value-objects/Email'
export * from './domain/value-objects/Password'
export * from './domain/value-objects/Id'

// Errors
export * from './errors/DomainError'
export * from './errors/ValidationError'
export * from './errors/NotFoundError'
export * from './errors/UnauthorizedError'
export * from './errors/ForbiddenError'

// DTOs
export * from './dtos/auth'
export * from './dtos/products'
export * from './dtos/cart'
export * from './dtos/orders'
export * from './dtos/reviews'
