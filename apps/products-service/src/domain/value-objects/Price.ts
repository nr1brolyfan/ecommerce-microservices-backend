import { ValidationError } from '@repo/shared-types/errors'

export class Price {
  private readonly value: number

  constructor(value: number) {
    this.validate(value)
    this.value = value
  }

  private validate(value: number): void {
    if (value < 0) {
      throw new ValidationError('Price cannot be negative')
    }

    if (value > 999999.99) {
      throw new ValidationError('Price cannot exceed 999,999.99')
    }

    // Check max 2 decimal places
    if (!Number.isInteger(value * 100)) {
      throw new ValidationError('Price can have at most 2 decimal places')
    }
  }

  getValue(): number {
    return this.value
  }

  toString(): string {
    return this.value.toFixed(2)
  }

  equals(other: Price): boolean {
    return this.value === other.value
  }
}
