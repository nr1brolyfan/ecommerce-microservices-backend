# Scripts Directory

This directory contains utility scripts for the microservices project.

## 📜 Available Scripts

### `reset-and-seed.sh`
**Purpose**: Reset all databases and seed with fresh test data

**Usage**:
```bash
./scripts/reset-and-seed.sh
# or
pnpm test:reset
```

**What it does**:
1. Pushes database schemas (recreates tables)
2. Seeds all databases with test data
   - 1 admin user + 5 regular users
   - 5 categories + 25 products
   - 10 sample orders
   - 12 sample reviews

**When to use**:
- Before running integration tests
- After making schema changes
- When you need fresh, consistent test data

---

### `smoke-test.sh`
**Purpose**: Quick health check for all microservices

**Usage**:
```bash
./scripts/smoke-test.sh
# or
pnpm test:smoke
```

**What it does**:
- Tests if all 5 services are running and responding
- Checks endpoints:
  - Auth Service (localhost:3000)
  - Products Service (localhost:3001)
  - Cart Service (localhost:3002)
  - Orders Service (localhost:3003)
  - Reviews Service (localhost:3004)

**When to use**:
- After starting services with `pnpm dev`
- Before running Postman tests
- To quickly verify the entire system is up

---

### `init-databases.sql`
**Purpose**: Initialize PostgreSQL databases

**Usage**:
- Automatically executed by Docker Compose on first run
- Creates 5 databases:
  - `auth_db`
  - `products_db`
  - `cart_db`
  - `orders_db`
  - `reviews_db`

**Manual execution** (if needed):
```bash
docker exec -i microservices-postgres psql -U postgres < scripts/init-databases.sql
```

---

## 🔄 Common Workflows

### Full Environment Reset
```bash
# 1. Stop services
Ctrl+C (in terminal running pnpm dev)

# 2. Reset databases
pnpm test:reset

# 3. Restart services
pnpm dev

# 4. Verify
pnpm test:smoke
```

### Quick Verification
```bash
# Check if everything is ready for testing
pnpm test:smoke

# If all green, you're good to go!
```

---

## 🛠️ Seed Scripts (in packages/scripts/src/seed/)

These are Node.js/TypeScript scripts that populate databases:

- `seed-auth.ts` - Users and authentication data
- `seed-products.ts` - Categories and products
- `seed-orders.ts` - Sample orders
- `seed-reviews.ts` - Sample product reviews
- `seed-all.ts` - Orchestrates all seeds in correct order

**Run individually**:
```bash
pnpm seed:auth
pnpm seed:products
pnpm seed:orders
pnpm seed:reviews
```

**Run all**:
```bash
pnpm seed
```

---

## 📊 Test Data Details

### Default Admin Account
```
Email: admin@example.com
Password: Password123!
```

### Regular Users
- 5 users with random names and emails
- All passwords: `Password123!`
- Can be used for testing user flows

### Products
- 25 products across 5 categories
- Various price ranges
- Different stock levels
- Realistic data generated with Drizzle Seed

### Orders
- 10 sample orders with different statuses
- Linked to actual users and products
- Various order statuses (pending, processing, shipped, delivered)

### Reviews
- 12 reviews for different products
- Only for products in shipped/delivered orders (business rule)
- Ratings from 1-5 stars
- Realistic titles and comments
