# Postman Collection Guide

## 📦 Quick Start

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button
3. Import `postman_collection.json`
4. Import `postman_environment.json`
5. Select "E-commerce Microservices - Local" environment from dropdown

### 2. Start Services

```bash
# Start all microservices
pnpm dev

# OR start individually
pnpm dev:auth
pnpm dev:products
pnpm dev:cart
pnpm dev:orders
pnpm dev:reviews
```

### 3. Seed Database

```bash
# Seed all databases with test data
pnpm seed
```

## 🔑 Authentication Flow

### Option A: Login as Admin

1. Open **Auth Service** → **Login Admin**
2. Click **Send**
3. Token will be automatically saved to `{{admin_token}}` variable
4. Use this token for admin-only endpoints

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `Password123!`

### Option B: Register & Login as User

1. Open **Auth Service** → **Register User**
2. Modify email if needed
3. Click **Send**
4. Open **Auth Service** → **Login User**
5. Click **Send**
6. Token will be automatically saved to `{{token}}` variable

## 📋 Testing Workflows

### Workflow 1: Complete User Journey

```
1. Auth Service → Register User
2. Auth Service → Login User (saves token)
3. Products Service → Get All Products (pick a product_id)
4. Cart Service → Add Item to Cart
5. Cart Service → Get Cart
6. Orders Service → Create Order (saves order_id)
7. Orders Service → Get Order by ID
8. Reviews Service → Create Review (requires order_id and product_id)
9. Reviews Service → Get Product Reviews
10. Reviews Service → Get Product Review Stats
```

### Workflow 2: Admin Management

```
1. Auth Service → Login Admin (saves admin_token)
2. Products Service → Get All Categories (pick a category_id)
3. Products Service → Create Product (Admin) (saves product_id)
4. Products Service → Update Product (Admin)
5. Orders Service → Get User Orders
6. Orders Service → Update Order Status (Admin)
```

### Workflow 3: Cart to Order

```
1. Auth Service → Login User
2. Products Service → Get All Products
3. Cart Service → Add Item to Cart (add multiple products)
4. Cart Service → Update Cart Item Quantity
5. Cart Service → Get Cart (verify items)
6. Orders Service → Create Order
7. Cart Service → Get Cart (should be empty after order)
```

## 🎯 Environment Variables

The collection uses these environment variables (auto-populated by test scripts):

| Variable | Description | Auto-set by |
|----------|-------------|-------------|
| `auth_url` | Auth service URL | Manual (default: localhost:3000) |
| `products_url` | Products service URL | Manual (default: localhost:3001) |
| `cart_url` | Cart service URL | Manual (default: localhost:3002) |
| `orders_url` | Orders service URL | Manual (default: localhost:3003) |
| `reviews_url` | Reviews service URL | Manual (default: localhost:3004) |
| `token` | User JWT token | Login User request |
| `admin_token` | Admin JWT token | Login Admin request |
| `user_id` | Current user ID | Register/Login requests |
| `admin_id` | Admin user ID | Login Admin request |
| `product_id` | Last created/viewed product | Product requests |
| `category_id` | Last created/viewed category | Category requests |
| `order_id` | Last created order | Create Order request |
| `review_id` | Last created review | Create Review request |

## 📝 Request Details

### Auth Service (Port 3000)

| Request | Method | Auth | Description |
|---------|--------|------|-------------|
| Register User | POST | ❌ | Create new user account |
| Login User | POST | ❌ | Login and get JWT token |
| Login Admin | POST | ❌ | Login as admin |
| Get Current User | GET | ✅ User | Get authenticated user details |
| Get User by ID | GET | ✅ User | Get any user profile |
| Update User | PUT | ✅ Own/Admin | Update user profile |

### Products Service (Port 3001)

| Request | Method | Auth | Description |
|---------|--------|------|-------------|
| Get All Products | GET | ❌ | List all products |
| Get Products with Filters | GET | ❌ | Filter by price, stock, category |
| Get Product by ID | GET | ❌ | Single product details |
| Create Product | POST | ✅ Admin | Add new product |
| Update Product | PUT | ✅ Admin | Modify product |
| Delete Product | DELETE | ✅ Admin | Remove product |
| Get All Categories | GET | ❌ | List all categories |
| Get Category by ID | GET | ❌ | Single category details |
| Create Category | POST | ✅ Admin | Add new category |

### Cart Service (Port 3002)

| Request | Method | Auth | Description |
|---------|--------|------|-------------|
| Get Cart | GET | ✅ Own/Admin | View cart contents |
| Add Item to Cart | POST | ✅ Own/Admin | Add product to cart |
| Update Cart Item Quantity | PUT | ✅ Own/Admin | Change item quantity |
| Remove Item from Cart | DELETE | ✅ Own/Admin | Remove item |
| Clear Cart | DELETE | ✅ Own/Admin | Empty cart |

### Orders Service (Port 3003)

| Request | Method | Auth | Description |
|---------|--------|------|-------------|
| Create Order | POST | ✅ User | Create order from cart |
| Get Order by ID | GET | ✅ Own/Admin | View order details |
| Get User Orders | GET | ✅ Own/Admin | List user's orders |
| Update Order Status | PUT | ✅ Admin | Change order status |

### Reviews Service (Port 3004)

| Request | Method | Auth | Description |
|---------|--------|------|-------------|
| Create Review | POST | ✅ User | Add product review (requires purchase) |
| Get Product Reviews | GET | ❌ | List product reviews |
| Get Product Review Stats | GET | ❌ | Average rating & distribution |
| Get User Reviews | GET | ✅ Own/Admin | List user's reviews |
| Update Review | PUT | ✅ Own/Admin | Modify review |
| Delete Review | DELETE | ✅ Own/Admin | Remove review |

## 🔍 Common Issues

### Issue: "Unauthorized" Error

**Solution:** Make sure you've logged in and the token is saved:
1. Run **Login User** or **Login Admin**
2. Check Console tab to see "Token saved: ..."
3. Verify token in Environment variables

### Issue: "Product not found"

**Solution:** 
1. Run **Get All Products** first
2. Copy a product ID from response
3. Manually set `product_id` in environment OR use auto-set from response

### Issue: "Cannot create review - product not found in order"

**Solution:** You must purchase the product first:
1. Add product to cart
2. Create order
3. Get the order_id
4. Use that order_id when creating review

### Issue: "User already reviewed this product"

**Solution:** One user can only review each product once. Either:
- Use a different user
- Review a different product
- Delete the existing review first

## 🎨 Tips & Tricks

### 1. Use Test Scripts

Many requests automatically save IDs to environment variables. Check the **Tests** tab to see what's being saved.

### 2. Check Console

Open Postman Console (bottom left) to see detailed logs of what's happening.

### 3. Bulk Testing

Use Postman's **Collection Runner** to run entire folders sequentially:
1. Right-click on a folder
2. Select "Run folder"
3. Click "Run E-commerce Microservices"

### 4. Save Responses

Click **Save Response** → **Save as Example** to keep successful responses for reference.

### 5. Query Parameters

Products endpoint supports filters:
- `?inStock=true` - Only products in stock
- `?minPrice=10&maxPrice=1000` - Price range
- `?category=electronics` - Filter by category slug

## 🚀 Advanced Usage

### Create Custom Workflows

1. Create a new folder in the collection
2. Duplicate requests you need
3. Arrange them in order
4. Use Collection Runner

### Export & Share

1. Right-click collection
2. Export → Collection v2.1
3. Share the JSON file with team

### Environment for Docker

Create a new environment for Docker deployment:
```json
{
  "auth_url": "http://auth-service:3000",
  "products_url": "http://products-service:3001",
  ...
}
```

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/)
- [Main Project README](./README.md)
- [API Documentation](./docs/PROJEKT.md)

---

**Happy Testing! 🎉**
