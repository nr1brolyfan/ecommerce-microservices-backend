import { ValidationError } from '@repo/shared-types/errors'

export class Rating {
  private readonly value: number

  constructor(value: number) {
    this.validate(value)
    this.value = value
  }

  private validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new ValidationError('Rating must be an integer')
    }

    if (value < 1 || value > 5) {
      throw new ValidationError('Rating must be between 1 and 5')
    }
  }

  getValue(): number {
    return this.value
  }

  toString(): string {
    return this.value.toString()
  }

  equals(other: Rating): boolean {
    return this.value === other.value
  }
}
