export class OrderItem {
  constructor(
    public id: string,
    public orderId: string,
    public productId: string,
    public productName: string,
    public quantity: number,
    public priceAtOrder: number,
    public subtotal: number,
  ) {}

  // Domain methods
  static create(
    productId: string,
    productName: string,
    quantity: number,
    priceAtOrder: number,
  ): OrderItem {
    const subtotal = quantity * priceAtOrder

    return new OrderItem(
      crypto.randomUUID(),
      '', // Will be set when added to order
      productId,
      productName,
      quantity,
      priceAtOrder,
      subtotal,
    )
  }

  static fromCartItem(cartItem: {
    productId: string
    productName: string
    quantity: number
    priceAtAddition: number
  }): OrderItem {
    return OrderItem.create(
      cartItem.productId,
      cartItem.productName,
      cartItem.quantity,
      cartItem.priceAtAddition,
    )
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      productName: this.productName,
      quantity: this.quantity,
      priceAtOrder: this.priceAtOrder,
      subtotal: this.subtotal,
    }
  }
}
