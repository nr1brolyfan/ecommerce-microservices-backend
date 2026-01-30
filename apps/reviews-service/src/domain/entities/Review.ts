import { BaseEntity } from '@repo/shared-types/domain/entities'
import { Rating } from '../value-objects/Rating.js'

export class Review extends BaseEntity {
  public updatedAt: Date

  constructor(
    id: string,
    public productId: string,
    public userId: string,
    public orderId: string,
    public rating: Rating,
    public title: string,
    public comment: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt)
    this.updatedAt = updatedAt
  }

  // Domain methods
  static create(
    productId: string,
    userId: string,
    orderId: string,
    rating: number,
    title: string,
    comment?: string,
  ): Review {
    const now = new Date()
    const ratingVO = new Rating(rating)

    return new Review(
      crypto.randomUUID(),
      productId,
      userId,
      orderId,
      ratingVO,
      title,
      comment || null,
      now,
      now,
    )
  }

  canBeUpdated(requestUserId: string): boolean {
    return this.userId === requestUserId
  }

  update(rating: number, title: string, comment?: string): void {
    this.rating = new Rating(rating)
    this.title = title
    this.comment = comment || null
    this.updatedAt = new Date()
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      userId: this.userId,
      orderId: this.orderId,
      rating: this.rating.getValue(),
      title: this.title,
      comment: this.comment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
