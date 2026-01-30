/**
 * Cart Service DTOs
 */

export interface CartItemDto {
  id: string
  cartId: string
  productId: string
  productName: string
  quantity: number
  priceAtAddition: number
  subtotal: number
  addedAt: Date
}

export interface CartDto {
  id: string
  userId: string
  items: CartItemDto[]
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface AddToCartDto {
  productId: string
  quantity: number
}

export interface UpdateCartItemDto {
  quantity: number
}
