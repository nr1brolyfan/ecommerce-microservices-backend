import type { Order } from '../../domain/entities/Order.js'
import { OrderNotFoundError } from '../../domain/errors/OrderErrors.js'
import type { IOrderRepository } from '../../domain/repositories/IOrderRepository.js'
import type { OrderResponseDto } from '../dtos/OrderDtos.js'

export class GetOrderById {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new OrderNotFoundError(orderId)
    }

    return this.toResponseDto(order)
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
