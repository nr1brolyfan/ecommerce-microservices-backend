import type { CartItem } from '../../domain/entities/CartItem.js'
import type { ICartRepository } from '../../domain/repositories/ICartRepository.js'
import { ProductsClient } from '../../infrastructure/clients/ProductsClient.js'

export interface UpdateCartItemDto {
  userId: string
  productId: string
  quantity: number
}

export class UpdateCartItem {
  private productsClient: ProductsClient

  constructor(private cartRepository: ICartRepository) {
    this.productsClient = new ProductsClient()
  }

  async execute(dto: UpdateCartItemDto): Promise<CartItem> {
    // Verify product has sufficient stock
    const hasStock = await this.productsClient.checkStock(dto.productId, dto.quantity)
    if (!hasStock) {
      throw new Error(`Insufficient stock for product ${dto.productId}`)
    }

    // Get cart
    const cart = await this.cartRepository.findByUserId(dto.userId)
    if (!cart) {
      throw new Error(`Cart not found for user ${dto.userId}`)
    }

    // Check if item exists
    const existingItem = await this.cartRepository.getItemByProductId(cart.id, dto.productId)
    if (!existingItem) {
      throw new Error(`Product ${dto.productId} not found in cart`)
    }

    // Update quantity
    return await this.cartRepository.updateItemQuantity(cart.id, dto.productId, dto.quantity)
  }
}
