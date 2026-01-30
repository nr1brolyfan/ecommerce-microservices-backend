/**
 * Orders Service DTOs
 */

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItemDto {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  priceAtOrder: number
  subtotal: number
}

export interface OrderDto {
  id: string
  userId: string
  status: OrderStatus
  items: OrderItemDto[]
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderDto {
  userId: string
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
}
