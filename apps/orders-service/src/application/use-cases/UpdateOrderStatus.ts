import type { Order } from '../../domain/entities/Order.js'
import { OrderNotFoundError } from '../../domain/errors/OrderErrors.js'
import type { IOrderRepository } from '../../domain/repositories/IOrderRepository.js'
import type { OrderResponseDto, UpdateOrderStatusDto } from '../dtos/OrderDtos.js'

export class UpdateOrderStatus {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    // Check if order exists
    const existingOrder = await this.orderRepository.findById(orderId)
    if (!existingOrder) {
      throw new OrderNotFoundError(orderId)
    }

    // Update status
    const updatedOrder = await this.orderRepository.updateStatus(orderId, dto.status)

    return this.toResponseDto(updatedOrder)
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
