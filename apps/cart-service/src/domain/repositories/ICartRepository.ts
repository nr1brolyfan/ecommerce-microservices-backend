import type { Cart } from '../entities/Cart.js'
import type { CartItem } from '../entities/CartItem.js'

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>
  findById(id: string): Promise<Cart | null>
  create(userId: string): Promise<Cart>
  addItem(cartId: string, item: CartItem): Promise<CartItem>
  updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<CartItem>
  removeItem(cartId: string, productId: string): Promise<void>
  clear(userId: string): Promise<void>
  getItemByProductId(cartId: string, productId: string): Promise<CartItem | null>
}
