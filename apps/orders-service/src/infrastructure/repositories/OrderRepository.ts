import { eq } from 'drizzle-orm'
import { Order } from '../../domain/entities/Order.js'
import { OrderItem } from '../../domain/entities/OrderItem.js'
import type { IOrderRepository } from '../../domain/repositories/IOrderRepository.js'
import type { Database } from '../database/connection.js'
import { type OrderStatus, orderItems, orders } from '../database/schema.js'

export class OrderRepository implements IOrderRepository {
  constructor(private db: Database) {}

  async create(order: Order): Promise<Order> {
    const result = await this.db.transaction(async (tx) => {
      // Insert order
      const [insertedOrder] = await tx
        .insert(orders)
        .values({
          id: order.id,
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount.toString(),
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        })
        .returning()

      // Insert order items
      if (order.items.length > 0) {
        await tx.insert(orderItems).values(
          order.items.map((item) => ({
            id: item.id,
            orderId: insertedOrder.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder.toString(),
            subtotal: item.subtotal.toString(),
          })),
        )
      }

      return insertedOrder
    })

    return this.findById(result.id) as Promise<Order>
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: true,
      },
    })

    if (!order) return null

    return this.mapToEntity(order)
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const userOrders = await this.db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    })

    return userOrders.map((order) => this.mapToEntity(order))
  }

  async findAll(): Promise<Order[]> {
    const allOrders = await this.db.query.orders.findMany({
      with: {
        items: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    })

    return allOrders.map((order) => this.mapToEntity(order))
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))

    return this.findById(id) as Promise<Order>
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(orders).where(eq(orders.id, id))
  }

  async existsById(id: string): Promise<boolean> {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, id),
      columns: { id: true },
    })

    return !!order
  }

  // Helper method to map database result to domain entity
  private mapToEntity(orderData: any): Order {
    const items =
      orderData.items?.map(
        (item: any) =>
          new OrderItem(
            item.id,
            item.orderId,
            item.productId,
            item.productName,
            item.quantity,
            parseFloat(item.priceAtOrder),
            parseFloat(item.subtotal),
          ),
      ) || []

    return new Order(
      orderData.id,
      orderData.userId,
      orderData.status,
      parseFloat(orderData.totalAmount),
      items,
      new Date(orderData.createdAt),
      new Date(orderData.updatedAt),
    )
  }
}
