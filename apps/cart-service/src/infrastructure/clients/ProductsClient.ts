import { hc } from 'hono/client'
import { config } from '../../config/env.js'

// Note: In production, this type should be imported from a shared package
// For now, we use any to avoid circular dependencies
type ProductsApp = any

export class ProductsClient {
  private client = hc<ProductsApp>(config.productsServiceUrl)

  async getProduct(id: string): Promise<any> {
    try {
      const res = await this.client.api.products[':id'].$get({
        param: { id },
      })

      if (!res.ok) {
        throw new Error(`Product not found: ${id}`)
      }

      const data = await res.json()
      return data.data
    } catch (error: any) {
      throw new Error(`Failed to fetch product: ${error.message}`)
    }
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.getProduct(productId)
    return product.stockQuantity >= quantity
  }
}
