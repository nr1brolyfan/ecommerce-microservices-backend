import type { OrderStatus } from '../../infrastructure/database/schema.js'
import type { Order } from '../entities/Order.js'

export interface IOrderRepository {
  // Create
  create(order: Order): Promise<Order>

  // Read
  findById(id: string): Promise<Order | null>
  findByUserId(userId: string): Promise<Order[]>
  findAll(): Promise<Order[]>

  // Update
  updateStatus(id: string, status: OrderStatus): Promise<Order>

  // Delete
  delete(id: string): Promise<void>

  // Exists
  existsById(id: string): Promise<boolean>
}
