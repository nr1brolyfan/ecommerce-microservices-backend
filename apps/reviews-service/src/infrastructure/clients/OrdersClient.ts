import type { IOrderServiceClient } from '../../application/use-cases/CreateReview.js'
import { config } from '../../config/env.js'

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  priceAtOrder: number
  subtotal: number
}

interface Order {
  id: string
  userId: string
  status: string
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export class OrdersClient implements IOrderServiceClient {
  private baseUrl = config.ordersServiceUrl

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/orders/${orderId}`)

      if (!res.ok) {
        if (res.status === 404) {
          return null
        }
        throw new Error(`Failed to get order: ${res.statusText}`)
      }

      const data = (await res.json()) as { success: boolean; data: Order }
      if (!data.success) {
        throw new Error('Failed to get order')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw new Error('Orders service unavailable')
    }
  }
}
