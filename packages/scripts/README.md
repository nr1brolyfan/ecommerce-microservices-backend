# @repo/scripts

Database seeding scripts using Drizzle Seed for all microservices.

## ⚠️ Important: Single Source of Truth

**All seed scripts import schemas from `@repo/database-schemas` package** to ensure consistency:

```typescript
// ✅ CORRECT - Import from shared package
import { users } from '@repo/database-schemas/auth'

// ❌ WRONG - Duplicating schema definition
const users = pgTable('users', { ... })
```

This ensures:
- **No schema duplication**
- **Automatic sync** when schemas change
- **No mismatch risk** between seeds and services
- **Clean dependency graph** - no circular dependencies between apps

## 📋 Prerequisites

**Before running seeds, you MUST create tables first:**

```bash
# From root directory
pnpm db:push
```

Seeds will **fail** if tables don't exist (they don't create tables, only insert data).

Each seed validates table existence and shows helpful error messages if tables are missing.

## 🚀 Usage

### Run All Seeds

```bash
# From root directory
pnpm seed
```

This runs seeds in the correct order:
1. `seed-auth` - Users (auth database)
2. `seed-products` - Categories & Products
3. `seed-orders` - Orders (depends on users & products)
4. `seed-reviews` - Reviews (depends on orders)

### Run Individual Seeds

```bash
pnpm seed:auth
pnpm seed:products
pnpm seed:orders
pnpm seed:reviews
```

### Reset Everything

```bash
# Push schema + seed (recommended)
pnpm reset

# Nuclear option: delete all data, recreate containers, push, seed
pnpm reset:clean
```

## 📊 Seeded Data

### Auth Service
- 1 admin user: `admin@example.com` / `Password123!`
- 5 regular users with random emails / `Password123!`

### Products Service
- 5 categories (Electronics, Clothing, Books, Home & Garden, Sports & Outdoors)
- 25 products with realistic names, prices, and stock

### Orders Service
- 10 orders with various statuses (pending, processing, shipped, delivered, cancelled)
- Multiple items per order

### Reviews Service
- 15 reviews (ratings 1-5)
- Only for delivered/shipped orders (realistic constraint)

## 🔍 Validation

Each seed script validates that required tables exist before running:

```typescript
await ensureTablesExist(db, ['users'])
```

If tables are missing, you'll see:

```
❌ Missing tables: users

❌ Database schema not initialized!
💡 Run `pnpm db:push` first to create all tables.
```

## Drizzle Seed

This package uses `drizzle-seed` which provides:

- Type-safe seeding based on Drizzle schemas
- Faker-like data generation built-in
- Refinement API for custom data generation
- Relation handling

Example:

```typescript
import { seed } from 'drizzle-seed'
import { users } from '@repo/database-schemas/auth'

await seed(db, { users }).refine((f) => ({
  users: {
    count: 10,
    columns: {
      email: f.email(),
      firstName: f.firstName(),
      role: f.valuesFromArray({ values: ['admin', 'user'] }),
    },
  },
}))
```

## Environment Variables

Requires database URLs in `.env`:

```
AUTH_DATABASE_URL=postgresql://...
PRODUCTS_DATABASE_URL=postgresql://...
CART_DATABASE_URL=postgresql://...
ORDERS_DATABASE_URL=postgresql://...
REVIEWS_DATABASE_URL=postgresql://...
```

## 🛠️ Development

### Adding a New Seed

1. Create `seed-<service>.ts` in `src/seed/`
2. **Import schema from the service** (don't duplicate!)
3. Add validation: `await ensureTablesExist(db, ['table_name'])`
4. Clear existing data: `await db.execute('TRUNCATE TABLE ...')`
5. Insert/generate data using `drizzle-seed`

Example:

```typescript
import { myTable } from '@repo/database-schemas/my-service'
import { ensureTablesExist } from '../utils/validation.js'

export async function seedMyService() {
  const db = createConnection(getDatabaseUrl('my-service'))
  
  // Validate
  await ensureTablesExist(db, ['my_table'])
  
  // Clear
  await db.execute('TRUNCATE TABLE my_table CASCADE')
  
  // Seed
  await db.insert(myTable).values({ ... })
}
```

**Note:** Make sure to add the schema to `@repo/database-schemas` package first!

## 🔗 Related Commands

- `pnpm db:push` - Create/update database tables (run BEFORE seeding)
- `pnpm dev` - Start all services
- `docker-compose up -d` - Start PostgreSQL
