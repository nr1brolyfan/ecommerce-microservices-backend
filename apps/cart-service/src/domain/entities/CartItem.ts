export interface CartItemProps {
  id: string
  cartId: string
  productId: string
  productName: string
  quantity: number
  priceAtAddition: number
  addedAt: Date
}

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly cartId: string,
    public readonly productId: string,
    public readonly productName: string,
    public readonly quantity: number,
    public readonly priceAtAddition: number,
    public readonly addedAt: Date,
  ) {}

  static create(props: CartItemProps): CartItem {
    return new CartItem(
      props.id,
      props.cartId,
      props.productId,
      props.productName,
      props.quantity,
      props.priceAtAddition,
      props.addedAt,
    )
  }

  static fromPersistence(props: CartItemProps): CartItem {
    return new CartItem(
      props.id,
      props.cartId,
      props.productId,
      props.productName,
      props.quantity,
      props.priceAtAddition,
      props.addedAt,
    )
  }

  getSubtotal(): number {
    return this.priceAtAddition * this.quantity
  }

  toJSON() {
    return {
      id: this.id,
      cartId: this.cartId,
      productId: this.productId,
      productName: this.productName,
      quantity: this.quantity,
      priceAtAddition: this.priceAtAddition,
      subtotal: this.getSubtotal(),
      addedAt: this.addedAt,
    }
  }
}
