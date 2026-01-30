# @repo/scripts

Database seeding scripts using Drizzle Seed for all microservices.

## Overview

This package provides seeding functionality for all service databases using the `drizzle-seed` plugin. Seeds are ready to be implemented once database schemas are defined in each service.

## Scripts

```bash
# Seed individual services
pnpm seed:auth         # Seed auth database (users)
pnpm seed:products     # Seed products database (categories, products)
pnpm seed:orders       # Seed orders database (orders, order items)
pnpm seed:reviews      # Seed reviews database (reviews)

# Seed all databases in order
pnpm seed:all          # Runs all seeds in the correct order
```

## Usage from Root

```bash
# From project root
pnpm seed              # Runs seed:all
```

## Implementation Status

Currently, all seed files are **scaffolded** with TODO comments showing how they will work once schemas are available. They will be implemented during the service development phases:

- **Auth seed**: Will create 1 admin + 5 users with hashed passwords
- **Products seed**: Will create 5 categories + 30 products
- **Orders seed**: Will create 10 orders with various statuses + 25 order items
- **Reviews seed**: Will create 20 reviews with ratings 1-5

## Drizzle Seed

This package uses `drizzle-seed` which provides:

- Type-safe seeding based on Drizzle schemas
- Faker-like data generation built-in
- Refinement API for custom data generation
- Relation handling

Example (will be implemented):

```typescript
import { seed } from 'drizzle-seed'
import { users } from './schema'

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

## Development

When implementing seeds in future phases:

1. Import schema from the service
2. Uncomment and configure the `seed()` call
3. Test with `pnpm seed:<service>`
