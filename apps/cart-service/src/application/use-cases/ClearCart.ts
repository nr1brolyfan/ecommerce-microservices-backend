import type { ICartRepository } from '../../domain/repositories/ICartRepository.js'

export class ClearCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<void> {
    await this.cartRepository.clear(userId)
  }
}
