import { desc, eq } from 'drizzle-orm'
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

      if (!insertedOrder) {
        throw new Error('Failed to create order')
      }

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

    if (!result) {
      throw new Error('Failed to create order')
    }

    return this.findById(result.id) as Promise<Order>
  }

  async findById(id: string): Promise<Order | null> {
    const orderResult = await this.db.select().from(orders).where(eq(orders.id, id)).limit(1)

    const order = orderResult[0]
    if (!order) return null

    const items = await this.db.select().from(orderItems).where(eq(orderItems.orderId, order.id))

    return this.mapToEntity({ ...order, items })
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const userOrders = await this.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await this.db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id))
        return { ...order, items }
      }),
    )

    return ordersWithItems.map((order) => this.mapToEntity(order))
  }

  async findAll(): Promise<Order[]> {
    const allOrders = await this.db.select().from(orders).orderBy(desc(orders.createdAt))

    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await this.db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id))
        return { ...order, items }
      }),
    )

    return ordersWithItems.map((order) => this.mapToEntity(order))
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
    const orderResult = await this.db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)

    return orderResult.length > 0
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
