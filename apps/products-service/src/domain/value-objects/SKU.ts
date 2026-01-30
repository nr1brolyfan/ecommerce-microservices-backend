import { ValidationError } from '@repo/shared-types/errors'

export class SKU {
  private readonly value: string

  constructor(value: string) {
    this.validate(value)
    this.value = value.toUpperCase()
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('SKU cannot be empty')
    }

    if (value.length < 3 || value.length > 100) {
      throw new ValidationError('SKU must be between 3 and 100 characters')
    }

    // SKU should contain only alphanumeric characters and hyphens
    const skuPattern = /^[A-Z0-9-]+$/i
    if (!skuPattern.test(value)) {
      throw new ValidationError('SKU can only contain letters, numbers, and hyphens')
    }
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  equals(other: SKU): boolean {
    return this.value === other.value
  }
}
