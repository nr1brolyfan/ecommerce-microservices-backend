import type { CartApp } from '@repo/cart-service/src/app.js'
import type { ICartServiceClient } from '../../application/use-cases/CreateOrder.js'
import { config } from '../../config/env.js'

interface CartItem {
  productId: string
  productName: string
  quantity: number
  priceAtAddition: number
}

interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
}

export class CartClient implements ICartServiceClient {
  private baseUrl = config.cartServiceUrl

  async getCart(userId: string): Promise<Cart | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/cart/${userId}`)

      if (!res.ok) {
        if (res.status === 404) {
          return null
        }
        throw new Error(`Failed to get cart: ${res.statusText}`)
      }

      const data = (await res.json()) as { success: boolean; data: Cart }
      if (!data.success) {
        throw new Error('Failed to get cart')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw new Error('Cart service unavailable')
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/api/cart/${userId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed to clear cart: ${res.statusText}`)
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw new Error('Cart service unavailable')
    }
  }
}
