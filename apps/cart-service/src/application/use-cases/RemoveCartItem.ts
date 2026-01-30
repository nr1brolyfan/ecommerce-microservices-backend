import type { ICartRepository } from '../../domain/repositories/ICartRepository.js'

export interface RemoveCartItemDto {
  userId: string
  productId: string
}

export class RemoveCartItem {
  constructor(private cartRepository: ICartRepository) {}

  async execute(dto: RemoveCartItemDto): Promise<void> {
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

    // Remove item
    await this.cartRepository.removeItem(cart.id, dto.productId)
  }
}
