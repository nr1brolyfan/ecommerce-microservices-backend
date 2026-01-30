/**
 * Base Entity
 * Abstract class for all domain entities following DDD principles
 */

export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Check if two entities are equal based on their ID
   */
  equals(entity: BaseEntity): boolean {
    if (!entity) return false
    if (!(entity instanceof BaseEntity)) return false
    return this.id === entity.id
  }

  /**
   * Mark entity as updated
   */
  markAsUpdated(): void {
    this.updatedAt = new Date()
  }
}
