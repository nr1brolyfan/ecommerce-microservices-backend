import { BaseEntity } from '@repo/shared-types/domain/entities'

export interface CategoryProps {
  id: string
  name: string
  slug: string
  description?: string | undefined
  createdAt: Date
}

export class Category extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly name: string,
    public readonly slug: string,
    public readonly description?: string,
  ) {
    super(id, createdAt, updatedAt)
  }

  static create(props: CategoryProps): Category {
    return new Category(
      props.id,
      props.createdAt,
      props.createdAt, // updatedAt initially same as createdAt
      props.name,
      props.slug,
      props.description,
    )
  }

  static fromPersistence(props: CategoryProps): Category {
    return new Category(
      props.id,
      props.createdAt,
      props.createdAt,
      props.name,
      props.slug,
      props.description,
    )
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      createdAt: this.createdAt,
    }
  }
}
