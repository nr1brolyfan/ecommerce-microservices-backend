import { ValidationError } from '@repo/shared-types/errors'

export class Price {
  private readonly value: number

  constructor(value: number) {
    // Round to 2 decimal places to handle floating point precision issues
    const roundedValue = Math.round(value * 100) / 100
    this.validate(roundedValue)
    this.value = roundedValue
  }

  private validate(value: number): void {
    if (value < 0) {
      throw new ValidationError('Price cannot be negative')
    }

    if (value > 999999.99) {
      throw new ValidationError('Price cannot exceed 999,999.99')
    }

    // Check max 2 decimal places using string comparison to avoid floating point issues
    const decimalPlaces = (value.toString().split('.')[1] || '').length
    if (decimalPlaces > 2) {
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
