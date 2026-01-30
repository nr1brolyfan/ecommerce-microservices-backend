/**
 * Password Value Object
 * Ensures password strength following DDD principles
 */

export class Password {
  private readonly value: string

  constructor(password: string) {
    if (!Password.isValid(password)) {
      throw new Error(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      )
    }
    this.value = password
  }

  /**
   * Validate password strength
   * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
   */
  static isValid(password: string): boolean {
    if (password.length < 8) return false
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return hasUpperCase && hasLowerCase && hasNumber
  }

  /**
   * Get password value (use carefully, only for hashing)
   */
  getValue(): string {
    return this.value
  }
}
