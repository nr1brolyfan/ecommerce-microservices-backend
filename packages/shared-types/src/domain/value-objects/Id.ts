/**
 * Id Value Object
 * UUID wrapper for entity IDs
 */

export class Id {
  private readonly value: string

  constructor(id: string) {
    if (!Id.isValid(id)) {
      throw new Error('Invalid UUID format')
    }
    this.value = id
  }

  /**
   * Validate UUID format
   */
  static isValid(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  /**
   * Get ID value
   */
  getValue(): string {
    return this.value
  }

  /**
   * Check equality
   */
  equals(other: Id): boolean {
    return this.value === other.value
  }

  /**
   * String representation
   */
  toString(): string {
    return this.value
  }
}
