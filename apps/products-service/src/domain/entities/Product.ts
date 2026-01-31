import { BaseEntity } from '@repo/shared-types/domain/entities'
import { Price } from '../value-objects/Price.js'
import { SKU } from '../value-objects/SKU.js'

export interface ProductProps {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string | undefined
  price: number
  sku: string
  stockQuantity: number
  imageUrl?: string | undefined
  createdAt: Date
  updatedAt: Date
}

export class Product extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly categoryId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly price: Price,
    public readonly sku: SKU,
    public readonly stockQuantity: number,
    public readonly description?: string,
    public readonly imageUrl?: string,
  ) {
    super(id, createdAt, updatedAt)
  }

  static create(props: ProductProps): Product {
    return new Product(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.categoryId,
      props.name,
      props.slug,
      new Price(props.price),
      new SKU(props.sku),
      props.stockQuantity,
      props.description,
      props.imageUrl,
    )
  }

  static fromPersistence(props: ProductProps): Product {
    return new Product(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.categoryId,
      props.name,
      props.slug,
      new Price(props.price),
      new SKU(props.sku),
      props.stockQuantity,
      props.description,
      props.imageUrl,
    )
  }

  isInStock(): boolean {
    return this.stockQuantity > 0
  }

  hasEnoughStock(quantity: number): boolean {
    return this.stockQuantity >= quantity
  }

  toJSON() {
    return {
      id: this.id,
      categoryId: this.categoryId,
      name: this.name,
      slug: this.slug,
      description: this.description,
      price: this.price.getValue(),
      sku: this.sku.getValue(),
      stockQuantity: this.stockQuantity,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
