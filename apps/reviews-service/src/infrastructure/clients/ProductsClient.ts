import type { IProductServiceClient } from '../../application/use-cases/CreateReview.js'
import { config } from '../../config/env.js'

interface Product {
  id: string
  name: string
  price: number
  stockQuantity: number
}

export class ProductsClient implements IProductServiceClient {
  private baseUrl = config.productsServiceUrl

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/products/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

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
      if (error instanceof Error && error.message.includes('fetch')) {
        console.error('Products service is unreachable:', error)
        throw new Error('Products service unavailable')
      }
      console.error('Error fetching product:', error)
      throw error
    }
  }
}
