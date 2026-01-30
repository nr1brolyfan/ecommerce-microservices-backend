import type { Cart } from '../../domain/entities/Cart.js'
import type { ICartRepository } from '../../domain/repositories/ICartRepository.js'

export class GetCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId)

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await this.cartRepository.create(userId)
    }

    return cart
  }
}
