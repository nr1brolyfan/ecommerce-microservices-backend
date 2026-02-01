# @repo/database-schemas

Centralized Drizzle database schemas for all microservices.

## 🎯 Purpose

This package serves as the **Single Source of Truth** for all database table definitions across the microservices architecture.

### Why?

- ✅ **No duplication** - Schema defined once, used everywhere
- ✅ **Type safety** - Shared types across services and seeds
- ✅ **Clean dependencies** - No circular deps between apps
- ✅ **Easy maintenance** - Update schema in one place

## 📦 Available Schemas

```typescript
import { users, roleEnum } from '@repo/database-schemas/auth'
import { categories, products } from '@repo/database-schemas/products'
import { carts, cartItems } from '@repo/database-schemas/cart'
import { orders, orderItems, orderStatusEnum } from '@repo/database-schemas/orders'
import { reviews } from '@repo/database-schemas/reviews'

// Or import all at once
import * from '@repo/database-schemas'
```

## 🔧 Usage in Services

Services **re-export** schemas from this package:

```typescript
// apps/auth-service/src/infrastructure/database/schema.ts
export * from '@repo/database-schemas/auth'
```

This allows:
- Services to use schemas as if they were local
- Drizzle Kit to find schemas for migrations
- Clean separation of concerns

## 🌱 Usage in Seeds

Seed scripts import directly from this package:

```typescript
// packages/scripts/src/seed/seed-auth.ts
import { users } from '@repo/database-schemas/auth'
import { seed } from 'drizzle-seed'

await seed(db, { users }).refine((f) => ({
  users: {
    count: 10,
    columns: {
      email: f.email(),
      firstName: f.firstName(),
    },
  },
}))
```

## 📝 Adding a New Schema

1. Create schema file in `src/`:

```typescript
// src/my-service.schema.ts
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const myTable = pgTable('my_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
})

export type MyTable = typeof myTable.$inferSelect
export type NewMyTable = typeof myTable.$inferInsert
```

2. Add export to `src/index.ts`:

```typescript
export * from './my-service.schema.js'
```

3. Add export path to `package.json`:

```json
{
  "exports": {
    "./my-service": "./src/my-service.schema.ts"
  }
}
```

4. Use in your service:

```typescript
// apps/my-service/src/infrastructure/database/schema.ts
export * from '@repo/database-schemas/my-service'
```

5. Add dependency in service's `package.json`:

```json
{
  "dependencies": {
    "@repo/database-schemas": "workspace:*"
  }
}
```

## 🏗️ Architecture

```
@repo/database-schemas (SSoT)
      ↓
      ├──> apps/auth-service (re-exports)
      ├──> apps/products-service (re-exports)
      ├──> apps/cart-service (re-exports)
      ├──> apps/orders-service (re-exports)
      ├──> apps/reviews-service (re-exports)
      └──> packages/scripts (seeds import directly)
```

## ⚠️ Important Notes

- **Never duplicate schemas** - Always import from this package
- **Update in one place** - Schema changes propagate automatically
- **Type-safe** - Full TypeScript support across all services
- **No circular deps** - Clean monorepo architecture

## 📚 Related

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Seeding Documentation](../scripts/README.md)
