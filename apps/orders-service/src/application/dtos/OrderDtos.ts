import type { OrderStatus } from '../../infrastructure/database/schema.js'

// Create Order DTO
export interface CreateOrderDto {
  userId: string
}

// Update Order Status DTO
export interface UpdateOrderStatusDto {
  status: OrderStatus
}

// Order Response DTO
export interface OrderResponseDto {
  id: string
  userId: string
  status: OrderStatus
  items: OrderItemResponseDto[]
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

// Order Item Response DTO
export interface OrderItemResponseDto {
  id: string
  productId: string
  productName: string
  quantity: number
  priceAtOrder: number
  subtotal: number
}
