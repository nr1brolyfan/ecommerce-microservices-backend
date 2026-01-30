import { BaseEntity } from '@repo/shared-types/domain/entities'
import type { CartItem } from './CartItem.js'

export interface CartProps {
  id: string
  userId: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

export class Cart extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly userId: string,
    public readonly items: CartItem[],
  ) {
    super(id, createdAt, updatedAt)
  }

  static create(props: CartProps): Cart {
    return new Cart(props.id, props.createdAt, props.updatedAt, props.userId, props.items)
  }

  static fromPersistence(props: CartProps): Cart {
    return new Cart(props.id, props.createdAt, props.updatedAt, props.userId, props.items)
  }

  getTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0)
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items.map((item) => item.toJSON()),
      totalAmount: this.getTotalAmount(),
      totalItems: this.getTotalItems(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
