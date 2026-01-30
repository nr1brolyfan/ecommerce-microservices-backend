/**
 * Email Value Object
 * Ensures email validity following DDD principles
 */

export class Email {
  private readonly value: string

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error('Invalid email format')
    }
    this.value = email.toLowerCase().trim()
  }

  /**
   * Validate email format
   */
  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Get email value
   */
  getValue(): string {
    return this.value
  }

  /**
   * Check equality
   */
  equals(other: Email): boolean {
    return this.value === other.value
  }

  /**
   * String representation
   */
  toString(): string {
    return this.value
  }
}
