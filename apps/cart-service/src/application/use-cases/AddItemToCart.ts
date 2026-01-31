import type { CartItem } from '../../domain/entities/CartItem.js'
import { CartItem as CartItemEntity } from '../../domain/entities/CartItem.js'
import type { ICartRepository } from '../../domain/repositories/ICartRepository.js'
import { ProductsClient } from '../../infrastructure/clients/ProductsClient.js'

export interface AddItemToCartDto {
  userId: string
  productId: string
  quantity: number
}

export class AddItemToCart {
  private productsClient: ProductsClient

  constructor(private cartRepository: ICartRepository) {
    this.productsClient = new ProductsClient()
  }

  async execute(dto: AddItemToCartDto): Promise<CartItem> {
    // Verify product exists and has sufficient stock
    const product = await this.productsClient.getProduct(dto.productId)
    if (!product) {
      throw new Error(`Product ${dto.productId} not found`)
    }

    const hasStock = await this.productsClient.checkStock(dto.productId, dto.quantity)
    if (!hasStock) {
      throw new Error(`Insufficient stock for product ${dto.productId}`)
    }

    // Get or create cart
    let cart = await this.cartRepository.findByUserId(dto.userId)
    if (!cart) {
      cart = await this.cartRepository.create(dto.userId)
    }

    // Check if item already exists in cart
    const existingItem = await this.cartRepository.getItemByProductId(cart.id, dto.productId)
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + dto.quantity
      const updatedHasStock = await this.productsClient.checkStock(dto.productId, newQuantity)
      if (!updatedHasStock) {
        throw new Error(`Insufficient stock for product ${dto.productId}`)
      }
      return await this.cartRepository.updateItemQuantity(cart.id, dto.productId, newQuantity)
    }

    // Create new cart item
    const cartItem = CartItemEntity.create({
      id: crypto.randomUUID(),
      cartId: cart.id,
      productId: dto.productId,
      productName: product.name,
      quantity: dto.quantity,
      priceAtAddition: parseFloat(product.price),
      addedAt: new Date(),
    })

    return await this.cartRepository.addItem(cart.id, cartItem)
  }
}
