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

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/products/${productId}`)

      if (!res.ok) {
        if (res.status === 404) {
          return null
        }
        throw new Error(`Failed to get product: ${res.statusText}`)
      }

      const data = await res.json()
      if (!data.success) {
        throw new Error('Failed to get product')
      }

      return data.data as Product
    } catch (error) {
      console.error('Error fetching product:', error)
      throw new Error('Products service unavailable')
    }
  }

  async updateStock(productId: string, quantityChange: number): Promise<void> {
    try {
      // Get current product to calculate new stock
      const product = await this.getProduct(productId)
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }

      const newStock = product.stockQuantity + quantityChange

      // Update product with new stock quantity
      const res = await fetch(`${this.baseUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockQuantity: newStock,
        }),
      })

      if (!res.ok) {
        throw new Error(`Failed to update stock: ${res.statusText}`)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      throw new Error('Products service unavailable')
    }
  }
}
