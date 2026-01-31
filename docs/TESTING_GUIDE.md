# Integration Testing Guide

## 📋 Prerequisites

- PostgreSQL running (via Docker or locally)
- All 5 microservices running
- Postman installed with collection imported

---

## 🚀 Quick Start

### 1. Start PostgreSQL (if using Docker)

```bash
# Start PostgreSQL container
docker compose up -d

# Verify it's running
docker compose ps
```

### 2. Reset and Seed Databases

```bash
# Run automated reset and seed script
./scripts/reset-and-seed.sh

# Or manually:
pnpm db:push
pnpm seed
```

### 3. Start All Services

```bash
# In a separate terminal
pnpm dev
```

This will start all 5 services in parallel:
- Auth Service → http://localhost:3000
- Products Service → http://localhost:3001
- Cart Service → http://localhost:3002
- Orders Service → http://localhost:3003
- Reviews Service → http://localhost:3004

### 4. Verify Services Are Running

```bash
./scripts/smoke-test.sh
```

Expected output:
```
✅ Auth Service is running (http://localhost:3000)
✅ Products Service is running (http://localhost:3001)
✅ Cart Service is running (http://localhost:3002)
✅ Orders Service is running (http://localhost:3003)
✅ Reviews Service is running (http://localhost:3004)
```

---

## 📮 Postman Setup

### Import Collection and Environment

1. Open Postman
2. Click **Import**
3. Import both files:
   - `postman_collection.json`
   - `postman_environment.json`
4. Select environment: **E-commerce Microservices - Local**

### Environment Variables

The environment includes these variables (auto-populated during tests):

| Variable | Description | Initial Value |
|----------|-------------|---------------|
| `auth_url` | Auth service URL | http://localhost:3000 |
| `products_url` | Products service URL | http://localhost:3001 |
| `cart_url` | Cart service URL | http://localhost:3002 |
| `orders_url` | Orders service URL | http://localhost:3003 |
| `reviews_url` | Reviews service URL | http://localhost:3004 |
| `token` | User JWT token | (set after login) |
| `admin_token` | Admin JWT token | (set after admin login) |
| `user_id` | Current user ID | (set after registration) |
| `product_id` | Sample product ID | (set from products) |
| `category_id` | Sample category ID | (set from categories) |
| `order_id` | Sample order ID | (set after order creation) |
| `review_id` | Sample review ID | (set after review creation) |

---

## 🧪 Test Scenarios

### Scenario 1: User Flow (Happy Path)

**Goal**: Complete user journey from registration to review

1. **Register New User**
   - Request: `POST {{auth_url}}/api/auth/register`
   - Body:
     ```json
     {
       "email": "testuser@example.com",
       "password": "TestPassword123!",
       "firstName": "Test",
       "lastName": "User"
     }
     ```
   - Expected: `201 Created`
   - Saves: `user_id` from response

2. **Login User**
   - Request: `POST {{auth_url}}/api/auth/login`
   - Body:
     ```json
     {
       "email": "testuser@example.com",
       "password": "TestPassword123!"
     }
     ```
   - Expected: `200 OK` with `token`
   - Saves: `token` to environment

3. **Get Current User**
   - Request: `GET {{auth_url}}/api/auth/me`
   - Headers: `Authorization: Bearer {{token}}`
   - Expected: `200 OK` with user data

4. **Browse Products**
   - Request: `GET {{products_url}}/api/products`
   - Expected: `200 OK` with product list
   - Saves: First `product_id` from response

5. **Get Product Details**
   - Request: `GET {{products_url}}/api/products/{{product_id}}`
   - Expected: `200 OK` with product details

6. **Add Product to Cart**
   - Request: `POST {{cart_url}}/api/cart/{{user_id}}/items`
   - Headers: `Authorization: Bearer {{token}}`
   - Body:
     ```json
     {
       "productId": "{{product_id}}",
       "quantity": 2
     }
     ```
   - Expected: `200 OK`

7. **View Cart**
   - Request: `GET {{cart_url}}/api/cart/{{user_id}}`
   - Headers: `Authorization: Bearer {{token}}`
   - Expected: `200 OK` with 2 items

8. **Create Order**
   - Request: `POST {{orders_url}}/api/orders`
   - Headers: `Authorization: Bearer {{token}}`
   - Body:
     ```json
     {
       "userId": "{{user_id}}"
     }
     ```
   - Expected: `201 Created`
   - Saves: `order_id` from response

9. **Verify Cart is Empty**
   - Request: `GET {{cart_url}}/api/cart/{{user_id}}`
   - Expected: `200 OK` with empty items array

10. **Add Review**
    - Request: `POST {{reviews_url}}/api/reviews`
    - Headers: `Authorization: Bearer {{token}}`
    - Body:
      ```json
      {
        "productId": "{{product_id}}",
        "userId": "{{user_id}}",
        "orderId": "{{order_id}}",
        "rating": 5,
        "title": "Great product!",
        "comment": "Really happy with this purchase."
      }
      ```
    - Expected: `201 Created`

---

### Scenario 2: Admin Flow

**Goal**: Test admin-only operations

1. **Login as Admin**
   - Request: `POST {{auth_url}}/api/auth/login`
   - Body:
     ```json
     {
       "email": "admin@example.com",
       "password": "Password123!"
     }
     ```
   - Expected: `200 OK`
   - Saves: `admin_token` to environment

2. **Create Category**
   - Request: `POST {{products_url}}/api/categories`
   - Headers: `Authorization: Bearer {{admin_token}}`
   - Body:
     ```json
     {
       "name": "Test Category",
       "slug": "test-category",
       "description": "A test category"
     }
     ```
   - Expected: `201 Created`
   - Saves: `category_id`

3. **Create Product**
   - Request: `POST {{products_url}}/api/products`
   - Headers: `Authorization: Bearer {{admin_token}}`
   - Body:
     ```json
     {
       "name": "Test Product",
       "categoryId": "{{category_id}}",
       "description": "A test product",
       "price": 99.99,
       "sku": "TEST-001",
       "stockQuantity": 100
     }
     ```
   - Expected: `201 Created`

4. **Update Order Status**
   - Request: `PUT {{orders_url}}/api/orders/{{order_id}}/status`
   - Headers: `Authorization: Bearer {{admin_token}}`
   - Body:
     ```json
     {
       "status": "shipped"
     }
     ```
   - Expected: `200 OK`

---

### Scenario 3: Error Cases

**Goal**: Verify proper error handling

1. **401 Unauthorized - No Token**
   - Request: `GET {{auth_url}}/api/auth/me`
   - Headers: (no Authorization header)
   - Expected: `401 Unauthorized`

2. **403 Forbidden - User Tries Admin Endpoint**
   - Request: `POST {{products_url}}/api/products`
   - Headers: `Authorization: Bearer {{token}}` (user token, not admin)
   - Expected: `403 Forbidden`

3. **400 Bad Request - Invalid Email**
   - Request: `POST {{auth_url}}/api/auth/register`
   - Body:
     ```json
     {
       "email": "not-an-email",
       "password": "Test123!",
       "firstName": "Test",
       "lastName": "User"
     }
     ```
   - Expected: `400 Bad Request`

4. **404 Not Found - Nonexistent Resource**
   - Request: `GET {{products_url}}/api/products/99999999-9999-9999-9999-999999999999`
   - Expected: `404 Not Found`

---

### Scenario 4: Edge Cases

**Goal**: Test boundary conditions

1. **Empty Cart Order**
   - Clear cart first: `DELETE {{cart_url}}/api/cart/{{user_id}}`
   - Try to create order: `POST {{orders_url}}/api/orders`
   - Expected: `400 Bad Request` (Cart is empty)

2. **Insufficient Stock**
   - Add 1000 units of a product (more than stock)
   - Expected: `400 Bad Request` (Insufficient stock)

3. **Duplicate Review**
   - Add a review for a product
   - Try to add another review for the same product
   - Expected: `409 Conflict` or `400 Bad Request`

4. **Access Another User's Cart**
   - Login as User A
   - Try to access User B's cart
   - Expected: `403 Forbidden`

---

## 📊 Test Results Template

Create a file `docs/TESTING_RESULTS.md` with:

```markdown
# Integration Testing Results

**Date**: [Date]
**Tester**: [Your Name]

## Environment
- PostgreSQL: ✅ Running
- All Services: ✅ Running
- Postman Collection: ✅ Imported

## Test Results

### ✅ Scenario 1: User Flow
- [x] Register user
- [x] Login user
- [x] Browse products
- [x] Add to cart
- [x] Create order
- [x] Add review

**Notes**: [Any observations]

### ✅ Scenario 2: Admin Flow
- [x] Admin login
- [x] Create category
- [x] Create product
- [x] Update order status

**Notes**: [Any observations]

### ✅ Scenario 3: Error Cases
- [x] 401 Unauthorized
- [x] 403 Forbidden
- [x] 400 Bad Request
- [x] 404 Not Found

**Notes**: [Any observations]

### ✅ Scenario 4: Edge Cases
- [x] Empty cart order
- [x] Insufficient stock
- [x] Duplicate review
- [x] Access control

**Notes**: [Any observations]

## Issues Found
- None / [List any bugs or issues]

## Screenshots
- [Attach key screenshots if needed]
```

---

## 🔧 Troubleshooting

### Services Won't Start

```bash
# Check if ports are in use
lsof -ti:3000,3001,3002,3003,3004

# Kill processes if needed
kill -9 $(lsof -ti:3000,3001,3002,3003,3004)

# Restart
pnpm dev
```

### Database Connection Errors

```bash
# Check PostgreSQL is running
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# Check logs
docker compose logs postgres
```

### Seed Data Issues

```bash
# Full reset
./scripts/reset-and-seed.sh

# Or manually drop and recreate
docker compose down -v
docker compose up -d
pnpm db:push
pnpm seed
```

---

## 📝 Next Steps After Testing

1. Document all test results in `TESTING_RESULTS.md`
2. Fix any bugs found
3. Take screenshots of successful flows
4. Update README.md with final instructions
5. Prepare for final code review and packaging
