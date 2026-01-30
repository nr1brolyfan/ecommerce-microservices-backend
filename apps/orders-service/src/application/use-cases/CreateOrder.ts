import { Order } from '../../domain/entities/Order.js'
import { OrderItem } from '../../domain/entities/OrderItem.js'
import { EmptyCartError, InsufficientStockError } from '../../domain/errors/OrderErrors.js'
import type { IOrderRepository } from '../../domain/repositories/IOrderRepository.js'
import type { CreateOrderDto, OrderResponseDto } from '../dtos/OrderDtos.js'

// Cart service types
interface CartItem {
  productId: string
  productName: string
  quantity: number
  priceAtAddition: number
}

interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
}

// Product service types
interface Product {
  id: string
  name: string
  price: number
  stockQuantity: number
}

// External service clients (will be injected)
export interface ICartServiceClient {
  getCart(userId: string): Promise<Cart | null>
  clearCart(userId: string): Promise<void>
}

export interface IProductServiceClient {
  getProduct(productId: string): Promise<Product | null>
  updateStock(productId: string, quantity: number): Promise<void>
}

export class CreateOrder {
  constructor(
    private orderRepository: IOrderRepository,
    private cartServiceClient: ICartServiceClient,
    private productServiceClient: IProductServiceClient,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderResponseDto> {
    // 1. Get cart from cart-service
    const cart = await this.cartServiceClient.getCart(dto.userId)
    if (!cart || cart.items.length === 0) {
      throw new EmptyCartError()
    }

    // 2. Verify products and stock availability
    for (const cartItem of cart.items) {
      const product = await this.productServiceClient.getProduct(cartItem.productId)
      if (!product) {
        throw new Error(`Product ${cartItem.productId} not found`)
      }

      if (product.stockQuantity < cartItem.quantity) {
        throw new InsufficientStockError(product.name, product.stockQuantity, cartItem.quantity)
      }
    }

    // 3. Create order items (snapshots)
    const orderItems = cart.items.map((cartItem) =>
      OrderItem.create(
        cartItem.productId,
        cartItem.productName,
        cartItem.quantity,
        cartItem.priceAtAddition,
      ),
    )

    // 4. Create order
    const order = Order.create(dto.userId, orderItems)

    // 5. Save order to database
    const savedOrder = await this.orderRepository.create(order)

    // 6. Update stock for each product
    for (const item of cart.items) {
      await this.productServiceClient.updateStock(item.productId, -item.quantity)
    }

    // 7. Clear cart
    await this.cartServiceClient.clearCart(dto.userId)

    // 8. Return response
    return this.toResponseDto(savedOrder)
  }

  private toResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        subtotal: item.subtotal,
      })),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
