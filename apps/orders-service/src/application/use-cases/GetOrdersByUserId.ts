import type { Order } from '../../domain/entities/Order.js'
import type { IOrderRepository } from '../../domain/repositories/IOrderRepository.js'
import type { OrderResponseDto } from '../dtos/OrderDtos.js'

export class GetOrdersByUserId {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByUserId(userId)
    return orders.map((order) => this.toResponseDto(order))
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
