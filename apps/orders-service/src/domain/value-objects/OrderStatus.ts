import type { OrderStatus as OrderStatusType } from '../../infrastructure/database/schema.js'

const VALID_STATUSES: OrderStatusType[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export class OrderStatus {
  private constructor(private readonly value: OrderStatusType) {}

  static create(value: string): OrderStatus {
    if (!VALID_STATUSES.includes(value as OrderStatusType)) {
      throw new Error(
        `Invalid order status: ${value}. Must be one of: ${VALID_STATUSES.join(', ')}`,
      )
    }
    return new OrderStatus(value as OrderStatusType)
  }

  static fromString(value: string): OrderStatus {
    return OrderStatus.create(value)
  }

  getValue(): OrderStatusType {
    return this.value
  }

  isPending(): boolean {
    return this.value === 'pending'
  }

  isProcessing(): boolean {
    return this.value === 'processing'
  }

  isShipped(): boolean {
    return this.value === 'shipped'
  }

  isDelivered(): boolean {
    return this.value === 'delivered'
  }

  isCancelled(): boolean {
    return this.value === 'cancelled'
  }

  canTransitionTo(newStatus: OrderStatusType): boolean {
    const transitions: Record<OrderStatusType, OrderStatusType[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    }

    return transitions[this.value].includes(newStatus)
  }

  toString(): string {
    return this.value
  }
}
