import { BaseEntity } from '@repo/shared-types/domain/entities'
import type { OrderStatus } from '../../infrastructure/database/schema.js'
import type { OrderItem } from './OrderItem.js'

export class Order extends BaseEntity {
  public updatedAt: Date

  constructor(
    id: string,
    public userId: string,
    public status: OrderStatus,
    public totalAmount: number,
    public items: OrderItem[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt)
    this.updatedAt = updatedAt
  }

  // Domain methods
  static create(userId: string, items: OrderItem[]): Order {
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)
    const now = new Date()

    return new Order(crypto.randomUUID(), userId, 'pending', totalAmount, items, now, now)
  }

  canBeUpdated(): boolean {
    return this.status !== 'delivered' && this.status !== 'cancelled'
  }

  canBeCancelled(): boolean {
    return this.status === 'pending' || this.status === 'processing'
  }

  updateStatus(newStatus: OrderStatus): void {
    if (!this.canBeUpdated()) {
      throw new Error('Cannot update order status')
    }
    this.status = newStatus
    this.updatedAt = new Date()
  }

  cancel(): void {
    if (!this.canBeCancelled()) {
      throw new Error('Cannot cancel order')
    }
    this.status = 'cancelled'
    this.updatedAt = new Date()
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      status: this.status,
      totalAmount: this.totalAmount,
      items: this.items.map((item) => item.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
