import type { IProductServiceClient } from '../../application/use-cases/CreateOrder.js'
import { config } from '../../config/env.js'

interface Product {
  id: string
  name: string
  price: number
  stockQuantity: number
}

export class ProductsClient implements IProductServiceClient {
  private baseUrl = config.productsServiceUrl

  async getProduct(productId: string, authToken?: string): Promise<Product | null> {
    try {
      const headers: Record<string, string> = {}
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      const res = await fetch(`${this.baseUrl}/api/products/${productId}`, { headers })

      if (!res.ok) {
        if (res.status === 404) {
          return null
        }
        throw new Error(`Failed to get product: ${res.statusText}`)
      }

      const data = (await res.json()) as { success: boolean; data: Product }
      if (!data.success) {
        throw new Error('Failed to get product')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw new Error('Products service unavailable')
    }
  }

  async updateStock(productId: string, quantityChange: number): Promise<void> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Use internal endpoint for stock updates (no auth required for service-to-service)
      const res = await fetch(`${this.baseUrl}/internal/products/${productId}/stock`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          quantityChange,
        }),
      })

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as any
        throw new Error(errorData.error?.message || `Failed to update stock: ${res.statusText}`)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      throw new Error('Products service unavailable')
    }
  }
}
