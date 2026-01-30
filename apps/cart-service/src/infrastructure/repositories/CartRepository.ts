import { and, eq } from 'drizzle-orm'
import { Cart } from '../../domain/entities/Cart.js'
import { CartItem as CartItemEntity } from '../../domain/entities/CartItem.js'
import type { ICartRepository } from '../../domain/repositories/ICartRepository.js'
import { db } from '../database/connection.js'
import { cartItems, carts } from '../database/schema.js'

export class CartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        items: true,
      },
    })

    if (!cart) return null

    return this.toDomain(cart)
  }

  async findById(id: string): Promise<Cart | null> {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, id),
      with: {
        items: true,
      },
    })

    if (!cart) return null

    return this.toDomain(cart)
  }

  async create(userId: string): Promise<Cart> {
    const [newCart] = await db
      .insert(carts)
      .values({
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    if (!newCart) {
      throw new Error('Failed to create cart')
    }

    return Cart.create({
      id: newCart.id,
      userId: newCart.userId,
      items: [],
      createdAt: newCart.createdAt,
      updatedAt: newCart.updatedAt,
    })
  }

  async addItem(cartId: string, item: CartItemEntity): Promise<CartItemEntity> {
    const [newItem] = await db
      .insert(cartItems)
      .values({
        id: item.id,
        cartId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtAddition: item.priceAtAddition.toString(),
        addedAt: item.addedAt,
      })
      .returning()

    if (!newItem) {
      throw new Error('Failed to add item to cart')
    }

    // Update cart updated_at
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))

    return CartItemEntity.create({
      id: newItem.id,
      cartId: newItem.cartId,
      productId: newItem.productId,
      quantity: newItem.quantity,
      priceAtAddition: parseFloat(newItem.priceAtAddition),
      addedAt: newItem.addedAt,
    })
  }

  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItemEntity> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
      .returning()

    if (!updatedItem) {
      throw new Error(`Item with productId ${productId} not found in cart ${cartId}`)
    }

    // Update cart updated_at
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))

    return CartItemEntity.create({
      id: updatedItem.id,
      cartId: updatedItem.cartId,
      productId: updatedItem.productId,
      quantity: updatedItem.quantity,
      priceAtAddition: parseFloat(updatedItem.priceAtAddition),
      addedAt: updatedItem.addedAt,
    })
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))

    // Update cart updated_at
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))
  }

  async clear(userId: string): Promise<void> {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    })

    if (!cart) return

    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))

    // Update cart updated_at
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id))
  }

  async getItemByProductId(cartId: string, productId: string): Promise<CartItemEntity | null> {
    const item = await db.query.cartItems.findFirst({
      where: and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)),
    })

    if (!item) return null

    return CartItemEntity.create({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      priceAtAddition: parseFloat(item.priceAtAddition),
      addedAt: item.addedAt,
    })
  }

  private toDomain(cart: any): Cart {
    const items = cart.items.map((item: any) =>
      CartItemEntity.create({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtAddition: parseFloat(item.priceAtAddition),
        addedAt: item.addedAt,
      }),
    )

    return Cart.create({
      id: cart.id,
      userId: cart.userId,
      items,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    })
  }
}
