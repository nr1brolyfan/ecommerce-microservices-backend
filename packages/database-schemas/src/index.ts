/**
 * @repo/database-schemas
 *
 * Centralized Drizzle database schemas for all microservices.
 * Single Source of Truth for database table definitions.
 */

// Re-export all schemas
export * from './auth.schema.js'
export * from './cart.schema.js'
export * from './orders.schema.js'
export * from './products.schema.js'
export * from './reviews.schema.js'
