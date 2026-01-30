export interface AddItemToCartDto {
  productId: string
  quantity: number
}

export interface UpdateCartItemDto {
  quantity: number
}

export interface CartItemResponseDto {
  id: string
  productId: string
  quantity: number
  priceAtAddition: number
  subtotal: number
  addedAt: Date
}

export interface CartResponseDto {
  id: string
  userId: string
  items: CartItemResponseDto[]
  totalAmount: number
  totalItems: number
  createdAt: Date
  updatedAt: Date
}
