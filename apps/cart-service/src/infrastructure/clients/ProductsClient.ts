import { config } from '../../config/env.js'

export class ProductsClient {
  private baseUrl = config.productsServiceUrl

  async getProduct(id: string): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/api/products/${id}`)

      if (!res.ok) {
        if (res.status === 404) {
          return null
        }
        throw new Error(`Product not found: ${id}`)
      }

      const data = (await res.json()) as { success: boolean; data: any }
      return data.data
    } catch (error: any) {
      throw new Error(`Failed to fetch product: ${error.message}`)
    }
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.getProduct(productId)
    if (!product) return false
    return product.stockQuantity >= quantity
  }
}
