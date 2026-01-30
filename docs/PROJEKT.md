# Projekt: E-commerce Backend - Architektura Mikroserwisowa

## 1. Informacje Ogólne

### 1.1 Cel Projektu
Zaprojektowanie i implementacja backendu dla systemu e-commerce w architekturze mikro-usługowej. Projekt realizowany w ramach przedmiotu "Programowanie aplikacji internetowych opartych o mikrousługi".

### 1.2 Zakres Funkcjonalny
- **Zarządzanie użytkownikami** - rejestracja, logowanie, uwierzytelnianie
- **Katalog produktów** - produkty, kategorie, zarządzanie stanem magazynowym
- **Koszyk zakupowy** - dodawanie produktów, zarządzanie ilością
- **Zamówienia** - składanie zamówień, historia, statusy
- **Opinie i oceny** - recenzje produktów, system ocen

### 1.3 Wymagania Techniczne
- **Język**: TypeScript
- **Runtime**: Node.js 20+
- **Architektura**: Mikroserwisy komunikujące się przez REST/HTTP
- **Ilość serwisów**: 5 mikroserwisów
- **Frontend**: Brak (testy przez Postman/cURL)

---

## 2. Architektura Systemu

### 2.1 Diagram Architektury

```
┌─────────────────────────────────────────────────────────────────┐
│                         KLIENT (Postman/cURL)                    │
└────────┬────────┬────────┬────────┬────────┬─────────────────────┘
         │        │        │        │        │
         │        │        │        │        │
    ┌────▼────┐ ┌▼────────▼┐ ┌─────▼──────┐ ┌▼─────────┐ ┌────────▼─────┐
    │  AUTH   │ │ PRODUCTS │ │    CART    │ │  ORDERS  │ │   REVIEWS    │
    │ SERVICE │ │ SERVICE  │ │  SERVICE   │ │ SERVICE  │ │   SERVICE    │
    │ :3000   │ │  :3001   │ │   :3002    │ │  :3003   │ │    :3004     │
    └────┬────┘ └────┬─────┘ └─────┬──────┘ └────┬─────┘ └──────┬───────┘
         │           │              │             │               │
         │           │              │             │               │
    ┌────▼──────┐ ┌──▼────────┐ ┌──▼────────┐ ┌─▼─────────┐ ┌───▼────────┐
    │  auth_db  │ │products_db│ │  cart_db  │ │ orders_db │ │ reviews_db │
    │(PostgreSQL│ │(PostgreSQL│ │(PostgreSQL│ │(PostgreSQL│ │(PostgreSQL)│
    └───────────┘ └───────────┘ └───────────┘ └───────────┘ └────────────┘
```

### 2.2 Komunikacja Między Serwisami

```
┌─────────────┐       veryfikacja       ┌──────────────┐
│    CART     │────────produktu────────>│   PRODUCTS   │
│   SERVICE   │                          │   SERVICE    │
└──────┬──────┘                          └──────────────┘
       │                                        ▲
       │ pobranie koszyka                      │ weryfikacja
       ▼                                        │ produktu
┌─────────────┐       weryfikacja       ┌──────┴───────┐
│   ORDERS    │────────użytkownika────> │     AUTH     │
│   SERVICE   │                          │   SERVICE    │
└──────┬──────┘                          └──────────────┘
       │ wyczyszczenie koszyka
       └─────────────────────────────────┐
                                          │
       ┌──────────────────────────────────▼──────┐
       │           REVIEWS SERVICE                │
       │  (weryfikacja produktu + zamówienia)    │
       └─────────────────────────────────────────┘
```

**Protokół komunikacji**: Hono RPC (type-safe HTTP calls)

---

## 3. Szczegółowy Opis Mikroserwisów

### 3.1 Auth Service (Port 3000)

**Odpowiedzialność**: Zarządzanie użytkownikami i uwierzytelnianie

**Bounded Context**: User Management

**Baza danych**: `auth_db` (PostgreSQL)

**Schemat bazy**:
```sql
users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── password_hash (VARCHAR)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── role (ENUM: 'user', 'admin')
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpointy**:

| Metoda | Endpoint | Opis | Auth | Role |
|--------|----------|------|------|------|
| POST | `/api/auth/register` | Rejestracja nowego użytkownika | ❌ | - |
| POST | `/api/auth/login` | Logowanie (zwraca JWT) | ❌ | - |
| GET | `/api/auth/me` | Pobierz dane zalogowanego użytkownika | ✅ | user, admin |
| GET | `/api/users/:id` | Pobierz profil użytkownika | ✅ | user, admin |
| PUT | `/api/users/:id` | Aktualizuj profil użytkownika | ✅ | user (own), admin |

**Request/Response Examples**:

```typescript
// POST /api/auth/register
Request: {
  email: "user@example.com",
  password: "SecurePass123!",
  firstName: "Jan",
  lastName: "Kowalski"
}
Response: {
  success: true,
  data: {
    id: "uuid",
    email: "user@example.com",
    firstName: "Jan",
    lastName: "Kowalski",
    role: "user"
  }
}

// POST /api/auth/login
Request: {
  email: "user@example.com",
  password: "SecurePass123!"
}
Response: {
  success: true,
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: { id: "uuid", email: "...", role: "user" }
  }
}
```

**DDD Layers**:
- **Domain**: User entity, Email/Password value objects, IUserRepository
- **Application**: RegisterUser, LoginUser, GetUserById use cases
- **Infrastructure**: UserRepository (Drizzle), password hashing (bcrypt)
- **Presentation**: Hono routes, JWT middleware, Zod validators

---

### 3.2 Products Service (Port 3001)

**Odpowiedzialność**: Katalog produktów i kategorie

**Bounded Context**: Product Catalog

**Baza danych**: `products_db` (PostgreSQL)

**Schemat bazy**:
```sql
categories
├── id (UUID, PK)
├── name (VARCHAR)
├── slug (VARCHAR, UNIQUE)
├── description (TEXT)
└── created_at (TIMESTAMP)

products
├── id (UUID, PK)
├── category_id (UUID, FK -> categories.id)
├── name (VARCHAR)
├── slug (VARCHAR, UNIQUE)
├── description (TEXT)
├── price (DECIMAL)
├── sku (VARCHAR, UNIQUE)
├── stock_quantity (INTEGER)
├── image_url (VARCHAR, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Endpointy**:

| Metoda | Endpoint | Opis | Auth | Role |
|--------|----------|------|------|------|
| GET | `/api/products` | Lista produktów (z filtrowaniem) | ❌ | - |
| GET | `/api/products/:id` | Szczegóły produktu | ❌ | - |
| POST | `/api/products` | Dodaj nowy produkt | ✅ | admin |
| PUT | `/api/products/:id` | Edytuj produkt | ✅ | admin |
| DELETE | `/api/products/:id` | Usuń produkt | ✅ | admin |
| GET | `/api/categories` | Lista kategorii | ❌ | - |
| GET | `/api/categories/:id` | Szczegóły kategorii | ❌ | - |
| POST | `/api/categories` | Dodaj kategorię | ✅ | admin |

**Query Parameters** (GET /api/products):
- `category` - filtrowanie po kategorii
- `minPrice` / `maxPrice` - zakres cenowy
- `inStock` - tylko dostępne produkty

**Request/Response Examples**:

```typescript
// GET /api/products?category=electronics&inStock=true
Response: {
  success: true,
  data: [
    {
      id: "uuid",
      name: "Laptop Dell XPS 15",
      slug: "laptop-dell-xps-15",
      description: "Powerful laptop...",
      price: 5999.99,
      sku: "DELL-XPS-001",
      stockQuantity: 5,
      category: {
        id: "uuid",
        name: "Electronics"
      }
    }
  ]
}

// POST /api/products (admin only)
Request: {
  name: "Gaming Mouse",
  categoryId: "uuid",
  description: "RGB gaming mouse",
  price: 199.99,
  sku: "MOUSE-001",
  stockQuantity: 50
}
```

**DDD Layers**:
- **Domain**: Product/Category entities, Price/SKU value objects, IProductRepository
- **Application**: CreateProduct, GetProducts, UpdateProduct use cases
- **Infrastructure**: ProductRepository (Drizzle)
- **Presentation**: Hono routes, admin middleware

---

### 3.3 Cart Service (Port 3002)

**Odpowiedzialność**: Zarządzanie koszykiem zakupowym

**Bounded Context**: Shopping Cart

**Baza danych**: `cart_db` (PostgreSQL)

**Schemat bazy**:
```sql
carts
├── id (UUID, PK)
├── user_id (UUID, UNIQUE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

cart_items
├── id (UUID, PK)
├── cart_id (UUID, FK -> carts.id)
├── product_id (UUID)  -- referuje do products-service
├── quantity (INTEGER)
├── price_at_addition (DECIMAL)  -- snapshot ceny
└── added_at (TIMESTAMP)
```

**Endpointy**:

| Metoda | Endpoint | Opis | Auth | Role |
|--------|----------|------|------|------|
| GET | `/api/cart/:userId` | Pobierz koszyk użytkownika | ✅ | user (own), admin |
| POST | `/api/cart/:userId/items` | Dodaj produkt do koszyka | ✅ | user (own), admin |
| PUT | `/api/cart/:userId/items/:productId` | Zmień ilość produktu | ✅ | user (own), admin |
| DELETE | `/api/cart/:userId/items/:productId` | Usuń produkt z koszyka | ✅ | user (own), admin |
| DELETE | `/api/cart/:userId` | Wyczyść cały koszyk | ✅ | user (own), admin |

**Komunikacja z innymi serwisami**:
- **Products Service**: Weryfikacja czy produkt istnieje i ma wystarczający stock
- **Orders Service**: Wywołuje DELETE koszyka po złożeniu zamówienia

**Request/Response Examples**:

```typescript
// POST /api/cart/:userId/items
Request: {
  productId: "uuid",
  quantity: 2
}
Response: {
  success: true,
  data: {
    id: "uuid",
    userId: "uuid",
    items: [
      {
        id: "uuid",
        productId: "uuid",
        productName: "Laptop Dell XPS 15",
        quantity: 2,
        priceAtAddition: 5999.99,
        subtotal: 11999.98
      }
    ],
    totalAmount: 11999.98
  }
}
```

**DDD Layers**:
- **Domain**: Cart/CartItem entities, ICartRepository
- **Application**: AddToCart, UpdateCartItem, ClearCart use cases
- **Infrastructure**: CartRepository, ProductServiceClient (Hono RPC)
- **Presentation**: Hono routes, ownership validation

---

### 3.4 Orders Service (Port 3003)

**Odpowiedzialność**: Zarządzanie zamówieniami

**Bounded Context**: Order Management

**Baza danych**: `orders_db` (PostgreSQL)

**Schemat bazy**:
```sql
orders
├── id (UUID, PK)
├── user_id (UUID)
├── status (ENUM: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
├── total_amount (DECIMAL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

order_items
├── id (UUID, PK)
├── order_id (UUID, FK -> orders.id)
├── product_id (UUID)  -- snapshot
├── product_name (VARCHAR)  -- snapshot
├── quantity (INTEGER)
├── price_at_order (DECIMAL)  -- snapshot
└── subtotal (DECIMAL)
```

**Endpointy**:

| Metoda | Endpoint | Opis | Auth | Role |
|--------|----------|------|------|------|
| POST | `/api/orders` | Stwórz zamówienie z koszyka | ✅ | user, admin |
| GET | `/api/orders/:id` | Szczegóły zamówienia | ✅ | user (own), admin |
| GET | `/api/orders/user/:userId` | Historia zamówień użytkownika | ✅ | user (own), admin |
| PUT | `/api/orders/:id/status` | Zmień status zamówienia | ✅ | admin |

**Komunikacja z innymi serwisami**:
- **Cart Service**: Pobiera zawartość koszyka
- **Products Service**: Weryfikuje dostępność produktów
- **Cart Service**: Czyści koszyk po udanym złożeniu zamówienia

**Request/Response Examples**:

```typescript
// POST /api/orders
Request: {
  userId: "uuid"
}
Response: {
  success: true,
  data: {
    id: "uuid",
    userId: "uuid",
    status: "pending",
    items: [
      {
        productId: "uuid",
        productName: "Laptop Dell XPS 15",
        quantity: 2,
        priceAtOrder: 5999.99,
        subtotal: 11999.98
      }
    ],
    totalAmount: 11999.98,
    createdAt: "2026-01-30T10:00:00Z"
  }
}

// PUT /api/orders/:id/status (admin only)
Request: {
  status: "shipped"
}
```

**Proces składania zamówienia**:
1. Pobierz koszyk użytkownika (Cart Service)
2. Zweryfikuj dostępność produktów (Products Service)
3. Utwórz zamówienie (snapshot produktów i cen)
4. Zaktualizuj stan magazynowy (Products Service)
5. Wyczyść koszyk (Cart Service)

**DDD Layers**:
- **Domain**: Order/OrderItem entities, OrderStatus value object, IOrderRepository
- **Application**: CreateOrder, GetOrders, UpdateOrderStatus use cases
- **Infrastructure**: OrderRepository, CartServiceClient, ProductServiceClient
- **Presentation**: Hono routes, admin middleware dla zmiany statusu

---

### 3.5 Reviews Service (Port 3004)

**Odpowiedzialność**: Opinie i oceny produktów

**Bounded Context**: Product Reviews

**Baza danych**: `reviews_db` (PostgreSQL)

**Schemat bazy**:
```sql
reviews
├── id (UUID, PK)
├── product_id (UUID)  -- referuje do products-service
├── user_id (UUID)     -- referuje do auth-service
├── order_id (UUID)    -- weryfikacja zakupu
├── rating (INTEGER)   -- 1-5
├── title (VARCHAR)
├── comment (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

-- Constraint: user może mieć tylko jedną recenzję na produkt
UNIQUE(product_id, user_id)
```

**Endpointy**:

| Metoda | Endpoint | Opis | Auth | Role |
|--------|----------|------|------|------|
| POST | `/api/reviews` | Dodaj opinię | ✅ | user, admin |
| GET | `/api/reviews/product/:productId` | Opinie dla produktu | ❌ | - |
| GET | `/api/reviews/user/:userId` | Opinie użytkownika | ✅ | user (own), admin |
| PUT | `/api/reviews/:id` | Edytuj opinię | ✅ | user (own), admin |
| DELETE | `/api/reviews/:id` | Usuń opinię | ✅ | user (own), admin |
| GET | `/api/reviews/product/:productId/stats` | Statystyki ocen | ❌ | - |

**Komunikacja z innymi serwisami**:
- **Products Service**: Weryfikacja czy produkt istnieje
- **Orders Service**: Weryfikacja czy użytkownik kupił produkt

**Request/Response Examples**:

```typescript
// POST /api/reviews
Request: {
  productId: "uuid",
  userId: "uuid",
  orderId: "uuid",
  rating: 5,
  title: "Świetny laptop!",
  comment: "Bardzo wydajny, polecam każdemu."
}
Response: {
  success: true,
  data: {
    id: "uuid",
    productId: "uuid",
    userId: "uuid",
    rating: 5,
    title: "Świetny laptop!",
    comment: "Bardzo wydajny, polecam każdemu.",
    createdAt: "2026-01-30T10:00:00Z"
  }
}

// GET /api/reviews/product/:productId/stats
Response: {
  success: true,
  data: {
    averageRating: 4.5,
    totalReviews: 120,
    ratingDistribution: {
      "5": 80,
      "4": 25,
      "3": 10,
      "2": 3,
      "1": 2
    }
  }
}
```

**Zasady dodawania opinii**:
- Użytkownik musi kupić produkt (weryfikacja przez order_id)
- Jedna opinia na produkt od użytkownika
- Rating: 1-5 gwiazdek

**DDD Layers**:
- **Domain**: Review entity, Rating value object, IReviewRepository
- **Application**: CreateReview, GetReviewsByProduct, UpdateReview use cases
- **Infrastructure**: ReviewRepository, ProductServiceClient, OrderServiceClient
- **Presentation**: Hono routes, purchase verification middleware

---

## 4. Stack Technologiczny

### 4.1 Główne Technologie

| Obszar | Technologia | Wersja | Uzasadnienie |
|--------|-------------|--------|--------------|
| Runtime | Node.js | 20+ LTS | Stabilna wersja LTS |
| Język | TypeScript | 5.3+ | Type safety |
| Framework | Hono | ^4.0.0 | Lekki, szybki, type-safe RPC |
| Database | PostgreSQL | 16 | Relacyjna baza danych |
| ORM | Drizzle ORM | ^0.30.0 | Type-safe, lightweight |
| Validation | Zod | ^3.22.0 | Runtime type validation |
| Authentication | JWT (jose) | ^5.0.0 | Modern JWT library |
| Password Hashing | bcrypt | ^5.1.0 | Bezpieczne hashowanie |
| HTTP Client | Hono RPC | built-in | Type-safe inter-service calls |
| Logger | Pino | ^8.0.0 | Szybki JSON logger |
| Package Manager | pnpm | 8+ | Szybki, oszczędny |
| Testing | Vitest | ^1.0.0 | Szybkie testy jednostkowe |

### 4.2 Struktura Monorepo

**Package Manager**: pnpm workspaces

**Struktura**:
```
microservices/
├── apps/
│   ├── auth-service/
│   ├── products-service/
│   ├── cart-service/
│   ├── orders-service/
│   └── reviews-service/
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   ├── shared-config/
│   └── scripts/
└── package.json
```

**Konfiguracja workspaces** (`pnpm-workspace.yaml`):
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 5. Domain-Driven Design (DDD)

### 5.1 Architektura Warstwowa

Każdy mikroserwis stosuje 4-warstwową architekturę DDD:

```
┌─────────────────────────────────────────┐
│      PRESENTATION LAYER                  │  ← Hono routes, controllers,
│   (routes, controllers, middlewares)    │    middlewares, validators
├─────────────────────────────────────────┤
│      APPLICATION LAYER                   │  ← Use cases, DTOs,
│   (use-cases, application services)     │    orchestration logic
├─────────────────────────────────────────┤
│      DOMAIN LAYER                        │  ← Entities, value objects,
│   (entities, value objects, repos)      │    domain logic, interfaces
├─────────────────────────────────────────┤
│      INFRASTRUCTURE LAYER                │  ← DB repositories, external
│   (repositories, external services)     │    services, Drizzle schema
└─────────────────────────────────────────┘
```

### 5.2 Przykład Struktury (products-service)

```
products-service/
└── src/
    ├── domain/                    # Warstwa domenowa (core business logic)
    │   ├── entities/
    │   │   ├── Product.ts        # Product aggregate root
    │   │   └── Category.ts       # Category entity
    │   ├── value-objects/
    │   │   ├── Price.ts          # Money/Price value object
    │   │   └── SKU.ts            # Stock Keeping Unit
    │   ├── repositories/
    │   │   ├── IProductRepository.ts    # Interface (port)
    │   │   └── ICategoryRepository.ts
    │   └── errors/
    │       └── ProductErrors.ts
    │
    ├── application/               # Warstwa aplikacji (use cases)
    │   ├── use-cases/
    │   │   ├── CreateProduct.ts
    │   │   ├── GetProducts.ts
    │   │   ├── UpdateProduct.ts
    │   │   └── DeleteProduct.ts
    │   └── dtos/
    │       └── ProductDtos.ts
    │
    ├── infrastructure/            # Warstwa infrastruktury
    │   ├── database/
    │   │   ├── schema.ts         # Drizzle schema
    │   │   ├── connection.ts
    │   │   └── migrations/
    │   └── repositories/
    │       ├── ProductRepository.ts     # Implementacja IProductRepository
    │       └── CategoryRepository.ts
    │
    └── presentation/              # Warstwa prezentacji (API)
        ├── routes/
        │   ├── products.routes.ts
        │   └── categories.routes.ts
        ├── middlewares/
        │   ├── auth.middleware.ts
        │   └── validation.middleware.ts
        └── validators/
            └── product.validators.ts    # Zod schemas
```

### 5.3 Bounded Contexts

| Service | Bounded Context | Aggregate Roots |
|---------|----------------|-----------------|
| auth-service | User Management | User |
| products-service | Product Catalog | Product, Category |
| cart-service | Shopping Cart | Cart |
| orders-service | Order Management | Order |
| reviews-service | Product Reviews | Review |

### 5.4 Dependency Inversion Principle

```typescript
// domain/repositories/IProductRepository.ts (interface)
export interface IProductRepository {
  findById(id: string): Promise<Product | null>
  findAll(filters?: ProductFilters): Promise<Product[]>
  create(product: Product): Promise<Product>
  update(id: string, product: Product): Promise<Product>
  delete(id: string): Promise<void>
}

// infrastructure/repositories/ProductRepository.ts (implementacja)
export class ProductRepository implements IProductRepository {
  constructor(private db: DrizzleDB) {}
  
  async findById(id: string): Promise<Product | null> {
    // Drizzle implementation
  }
  // ...
}

// application/use-cases/CreateProduct.ts (używa interfejsu)
export class CreateProduct {
  constructor(private productRepo: IProductRepository) {}
  
  async execute(dto: CreateProductDto): Promise<Product> {
    // Business logic
  }
}
```

---

## 6. Komunikacja Między Serwisami

### 6.1 Hono RPC (Type-safe Client)

**Eksport typu z serwisu** (products-service):

```typescript
// products-service/src/app.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  // logic
  return c.json({ id, name: 'Product' })
})

export type ProductsApp = typeof app
export default app
```

**Konsumpcja w innym serwisie** (cart-service):

```typescript
// cart-service/src/infrastructure/clients/ProductsClient.ts
import { hc } from 'hono/client'
import type { ProductsApp } from '@repo/products-service'

export class ProductsClient {
  private client = hc<ProductsApp>(process.env.PRODUCTS_SERVICE_URL!)
  
  async getProduct(id: string) {
    const res = await this.client.api.products[':id'].$get({
      param: { id }
    })
    
    if (!res.ok) throw new Error('Product not found')
    
    return res.json() // Type-safe!
  }
}
```

### 6.2 Service Discovery

**Development** (localhost):
```
AUTH_SERVICE_URL=http://localhost:3000
PRODUCTS_SERVICE_URL=http://localhost:3001
CART_SERVICE_URL=http://localhost:3002
ORDERS_SERVICE_URL=http://localhost:3003
REVIEWS_SERVICE_URL=http://localhost:3004
```

**Docker Compose** (service names):
```
AUTH_SERVICE_URL=http://auth-service:3000
PRODUCTS_SERVICE_URL=http://products-service:3001
...
```

### 6.3 Error Handling

```typescript
// shared-utils/src/http/errors.ts
export class ServiceUnavailableError extends Error {
  constructor(service: string) {
    super(`Service ${service} is unavailable`)
    this.name = 'ServiceUnavailableError'
  }
}

// W use case
try {
  const product = await this.productsClient.getProduct(productId)
} catch (error) {
  throw new ServiceUnavailableError('products-service')
}
```

---

## 7. Uwierzytelnianie i Autoryzacja

### 7.1 JWT Token Structure

```typescript
interface JWTPayload {
  sub: string        // user ID
  email: string
  role: 'user' | 'admin'
  iat: number        // issued at
  exp: number        // expiration (24h)
}
```

### 7.2 Auth Middleware

**Wspólny middleware** (shared-utils/src/auth/middleware.ts):

```typescript
import { verify } from 'jose'
import { MiddlewareHandler } from 'hono'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const token = authHeader.substring(7)
  
  try {
    const payload = await verify(token, secret)
    c.set('user', payload)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get('user')
  
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  await next()
}
```

### 7.3 Użycie w Routach

```typescript
// products-service/src/presentation/routes/products.routes.ts
import { Hono } from 'hono'
import { authMiddleware, requireAdmin } from '@repo/shared-utils/auth'

const app = new Hono()

app.get('/api/products', (c) => { /* public */ })
app.post('/api/products', authMiddleware, requireAdmin, (c) => { /* admin only */ })

export default app
```

---

## 8. Bazy Danych

### 8.1 Architektura Database-per-Service

Każdy mikroserwis posiada własną bazę danych (PostgreSQL):

```
PostgreSQL Instance (localhost:5432)
├── auth_db         → auth-service
├── products_db     → products-service
├── cart_db         → cart-service
├── orders_db       → orders-service
└── reviews_db      → reviews-service
```

**Zalety**:
- Niezależność serwisów
- Brak shared schema
- Łatwiejsze skalowanie
- Izolacja błędów

### 8.2 Drizzle ORM

**Definicja schematu** (products-service):

```typescript
// infrastructure/database/schema.ts
import { pgTable, uuid, varchar, decimal, integer, timestamp } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
})

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
```

**Konfiguracja** (drizzle.config.ts):

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/infrastructure/database/schema.ts',
  out: './src/infrastructure/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  }
})
```

### 8.3 Migracje

```bash
# Generowanie migracji
pnpm drizzle-kit generate:pg

# Uruchomienie migracji
pnpm drizzle-kit push:pg
```

### 8.4 Seeding

**Pakiet scripts** zawiera:
- `seed-auth.ts` - użytkownicy (1 admin, 5 users)
- `seed-products.ts` - kategorie i produkty (3 kategorie, 20 produktów)
- `seed-orders.ts` - przykładowe zamówienia
- `seed-reviews.ts` - przykładowe opinie
- `seed-all.ts` - wszystkie powyższe

**Użycie**:
```bash
pnpm scripts seed-all
```

---

## 9. Shared Packages

### 9.1 @repo/shared-types

**Cel**: Współdzielone typy TypeScript, DTOs, domain models

**Struktura**:
```
shared-types/
└── src/
    ├── domain/
    │   ├── entities/
    │   │   └── BaseEntity.ts       # Abstract base entity
    │   └── value-objects/
    │       ├── Email.ts            # Email value object
    │       ├── Password.ts         # Password value object
    │       └── Id.ts               # UUID wrapper
    ├── dtos/
    │   ├── auth/
    │   │   ├── RegisterDto.ts
    │   │   └── LoginDto.ts
    │   ├── products/
    │   │   └── CreateProductDto.ts
    │   ├── cart/
    │   ├── orders/
    │   └── reviews/
    └── errors/
        ├── DomainError.ts
        ├── ValidationError.ts
        └── NotFoundError.ts
```

**Przykład**:
```typescript
// domain/entities/BaseEntity.ts
export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}
}

// dtos/auth/RegisterDto.ts
export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}
```

### 9.2 @repo/shared-utils

**Cel**: Wspólne utility functions

**Struktura**:
```
shared-utils/
└── src/
    ├── jwt/
    │   ├── generate.ts             # JWT generation
    │   ├── verify.ts               # JWT verification
    │   └── types.ts
    ├── logger/
    │   └── index.ts                # Pino logger instance
    ├── auth/
    │   ├── middleware.ts           # Auth/admin middlewares
    │   └── password.ts             # bcrypt helpers
    ├── response/
    │   ├── success.ts              # Success response formatter
    │   └── error.ts                # Error response formatter
    └── validation/
        └── helpers.ts              # Zod validation helpers
```

**Przykład**:
```typescript
// response/success.ts
export function successResponse<T>(data: T) {
  return {
    success: true,
    data
  }
}

// response/error.ts
export function errorResponse(message: string, status: number = 400) {
  return {
    success: false,
    error: message
  }
}
```

### 9.3 @repo/shared-config

**Cel**: Wspólne konfiguracje (ESLint, TypeScript, Prettier)

**Struktura**:
```
shared-config/
├── tsconfig.base.json
├── eslint.config.js
└── prettier.config.js
```

**tsconfig.base.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

### 9.4 @repo/scripts

**Cel**: Skrypty utility (seeding, setup, migrations)

**Struktura**:
```
scripts/
└── src/
    ├── seed/
    │   ├── seed-auth.ts
    │   ├── seed-products.ts
    │   ├── seed-orders.ts
    │   ├── seed-reviews.ts
    │   └── seed-all.ts
    ├── setup/
    │   ├── create-databases.ts
    │   └── run-migrations.ts
    └── utils/
        └── fake-data.ts            # @faker-js/faker helpers
```

**Przykład seed-auth.ts**:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { users } from '../../apps/auth-service/src/infrastructure/database/schema'

export async function seedAuth() {
  const db = drizzle(process.env.AUTH_DATABASE_URL!)
  
  // Admin user
  await db.insert(users).values({
    email: 'admin@example.com',
    passwordHash: await hash('Admin123!', 10),
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  })
  
  // Regular users
  for (let i = 0; i < 5; i++) {
    await db.insert(users).values({
      email: faker.internet.email(),
      passwordHash: await hash('User123!', 10),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: 'user'
    })
  }
  
  console.log('✅ Auth seeded')
}
```

---

## 10. Konfiguracja i Uruchomienie

### 10.1 Wymagania Systemowe

- **Node.js**: 20+
- **pnpm**: 8+
- **PostgreSQL**: 16+ (lokalnie lub Docker)
- **Git**: do klonowania repo

### 10.2 Instalacja

```bash
# 1. Klonowanie repo (lub rozpakowanie ZIP)
git clone <repo-url>
cd microservices

# 2. Instalacja zależności
pnpm install

# 3. Uruchomienie PostgreSQL
docker-compose up -d

# 4. Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Edytuj .env z odpowiednimi wartościami

# 5. Uruchomienie migracji
pnpm db:migrate

# 6. Seed danych testowych
pnpm scripts seed-all
```

### 10.3 Zmienne Środowiskowe

**Root .env**:
```bash
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Service URLs (development)
AUTH_SERVICE_URL=http://localhost:3000
PRODUCTS_SERVICE_URL=http://localhost:3001
CART_SERVICE_URL=http://localhost:3002
ORDERS_SERVICE_URL=http://localhost:3003
REVIEWS_SERVICE_URL=http://localhost:3004
```

**Per-service .env** (przykład auth-service):
```bash
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db
JWT_SECRET=your-super-secret-key-change-in-production
```

### 10.4 Uruchomienie Development

```bash
# Wszystkie serwisy jednocześnie (równolegle)
pnpm dev

# Pojedynczy serwis
pnpm --filter auth-service dev
pnpm --filter products-service dev
```

### 10.5 Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-databases.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

**scripts/init-databases.sql**:
```sql
CREATE DATABASE auth_db;
CREATE DATABASE products_db;
CREATE DATABASE cart_db;
CREATE DATABASE orders_db;
CREATE DATABASE reviews_db;
```

---

## 11. Testowanie

### 11.1 Strategia Testowania

**Typy testów**:
- **Unit tests**: Testy logiki domenowej (use cases, entities)
- **Integration tests**: Testy endpointów API
- **E2E tests**: Pełne scenariusze biznesowe (opcjonalne)

### 11.2 Narzędzia

- **Vitest**: Framework testowy
- **Supertest** (lub fetch): Testy HTTP
- **@faker-js/faker**: Generowanie danych testowych

### 11.3 Przykład Testu Integration

```typescript
// products-service/tests/integration/products.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import app from '../../src/app'

describe('Products API', () => {
  let adminToken: string
  
  beforeAll(async () => {
    // Get admin token
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'Admin123!'
      })
    })
    const data = await res.json()
    adminToken = data.data.token
  })
  
  it('should create a product (admin only)', async () => {
    const res = await app.request('/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Product',
        categoryId: 'uuid',
        price: 99.99,
        sku: 'TEST-001',
        stockQuantity: 10
      })
    })
    
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.name).toBe('Test Product')
  })
})
```

### 11.4 Testowanie w Postman

**Kolekcja Postman** powinna zawierać:

**1. Auth Service**:
- Register user
- Login user
- Get current user
- Get user by ID

**2. Products Service**:
- Get all products
- Get product by ID
- Create product (admin)
- Update product (admin)
- Delete product (admin)
- Get categories
- Create category (admin)

**3. Cart Service**:
- Get cart
- Add item to cart
- Update item quantity
- Remove item from cart
- Clear cart

**4. Orders Service**:
- Create order
- Get order by ID
- Get user orders
- Update order status (admin)

**5. Reviews Service**:
- Create review
- Get product reviews
- Get review stats
- Update review
- Delete review

**Environment variables**:
```json
{
  "auth_url": "http://localhost:3000",
  "products_url": "http://localhost:3001",
  "cart_url": "http://localhost:3002",
  "orders_url": "http://localhost:3003",
  "reviews_url": "http://localhost:3004",
  "token": "",
  "user_id": ""
}
```

---

## 12. Deployment (Opcjonalnie)

### 12.1 Dockeryzacja Serwisów

**Przykład Dockerfile** (products-service):

```dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/products-service/package.json ./apps/products-service/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm --filter products-service build

FROM base AS production
WORKDIR /app
COPY --from=build /app/apps/products-service/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### 12.2 Docker Compose (Production)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  auth-service:
    build:
      context: .
      dockerfile: apps/auth-service/Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/auth_db
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres

  products-service:
    build:
      context: .
      dockerfile: apps/products-service/Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/products_db
      AUTH_SERVICE_URL: http://auth-service:3000
    depends_on:
      - postgres

  # ... inne serwisy

volumes:
  postgres_data:
```

---

## 13. Bezpieczeństwo

### 13.1 Checklist

- ✅ **JWT Authentication**: Wszystkie chronione endpointy wymagają tokenu
- ✅ **Password Hashing**: bcrypt z saltRounds=10
- ✅ **Role-based Access Control**: Admin vs User permissions
- ✅ **Input Validation**: Zod schemas dla wszystkich requestów
- ✅ **SQL Injection Protection**: Drizzle ORM (prepared statements)
- ✅ **CORS**: Konfiguracja CORS w Hono
- ✅ **Rate Limiting**: (opcjonalne) Hono rate limiter middleware
- ✅ **Environment Variables**: Wrażliwe dane w .env (nie commitowane)

### 13.2 Przykład Walidacji (Zod)

```typescript
// presentation/validators/product.validators.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  categoryId: z.string().uuid(),
  description: z.string().optional(),
  price: z.number().positive(),
  sku: z.string().min(3).max(100),
  stockQuantity: z.number().int().min(0),
  imageUrl: z.string().url().optional()
})

export type CreateProductDto = z.infer<typeof createProductSchema>

// W route
app.post('/api/products', authMiddleware, requireAdmin, async (c) => {
  const body = await c.req.json()
  const validated = createProductSchema.parse(body) // throws ZodError
  // ...
})
```

---

## 14. Metryki i Monitoring (Opcjonalnie)

### 14.1 Health Checks

Każdy serwis powinien mieć endpoint:

```typescript
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'products-service',
    timestamp: new Date().toISOString()
  })
})
```

### 14.2 Logging

**Pino logger** (shared-utils):

```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

// Użycie
logger.info({ userId: '123' }, 'User logged in')
logger.error({ error }, 'Failed to create order')
```

---

## 15. Dokumentacja API

### 15.1 OpenAPI/Swagger

Hono wspiera **Hono OpenAPI** middleware:

```typescript
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

app.openapi(
  {
    method: 'get',
    path: '/api/products',
    responses: {
      200: {
        description: 'List of products',
        content: {
          'application/json': {
            schema: z.array(ProductSchema)
          }
        }
      }
    }
  },
  (c) => {
    // handler
  }
)

// Swagger UI dostępne na /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Products API',
    version: '1.0.0'
  }
})
```

### 15.2 Postman Collection

Eksport kolekcji Postman jako `postman_collection.json` w repozytorium.

---

## 16. Podział Pracy (Solo Project)

Ponieważ projekt jest realizowany solo, zalecany podział na iteracje:

### Iteracja 1: Setup & Infrastructure (1-2 dni)
- ✅ Setup monorepo (pnpm workspaces)
- ✅ Utworzenie struktury folderów
- ✅ Konfiguracja shared packages
- ✅ Setup PostgreSQL + Docker Compose
- ✅ Konfiguracja Drizzle ORM

### Iteracja 2: Auth Service (1-2 dni)
- ✅ Schema bazy danych
- ✅ DDD layers
- ✅ Rejestracja i logowanie
- ✅ JWT authentication
- ✅ Middleware auth/admin

### Iteracja 3: Products Service (1-2 dni)
- ✅ Schema bazy (products, categories)
- ✅ CRUD produktów i kategorii
- ✅ Integracja z auth middleware
- ✅ Admin permissions

### Iteracja 4: Cart Service (1 dzień)
- ✅ Schema bazy
- ✅ Operacje na koszyku
- ✅ Integracja z Products Service (Hono RPC)

### Iteracja 5: Orders Service (1-2 dni)
- ✅ Schema bazy
- ✅ Proces składania zamówienia
- ✅ Integracja z Cart + Products
- ✅ Status management

### Iteracja 6: Reviews Service (1 dzień)
- ✅ Schema bazy
- ✅ CRUD opinii
- ✅ Statystyki ocen
- ✅ Weryfikacja zakupu

### Iteracja 7: Testing & Documentation (1-2 dni)
- ✅ Kolekcja Postman
- ✅ Testy endpointów
- ✅ Seeding danych
- ✅ Dokumentacja PROJEKT.md
- ✅ README.md z instrukcją

**Szacowany czas**: 8-12 dni roboczych

---

## 17. Wnioski i Best Practices

### 17.1 Dobre Praktyki

1. **Database-per-Service**: Każdy serwis ma własną bazę
2. **Type Safety**: TypeScript + Zod + Drizzle = pełna type safety
3. **DDD Layers**: Separation of Concerns
4. **Hono RPC**: Type-safe inter-service communication
5. **JWT Auth**: Bezpieczne uwierzytelnianie
6. **Monorepo**: Łatwe zarządzanie shared code
7. **Environment Variables**: Bezpieczne przechowywanie secrets

### 17.2 Możliwe Rozszerzenia

- **API Gateway**: Centralny punkt wejścia
- **Message Queue**: RabbitMQ/Redis dla async communication
- **Caching**: Redis dla często pobieranych danych
- **Search**: Elasticsearch dla zaawansowanego wyszukiwania
- **File Upload**: S3/CloudStorage dla zdjęć produktów
- **Notifications**: Email service dla potwierdzenia zamówień
- **Payment Gateway**: Stripe/PayPal integration
- **Kubernetes**: Deployment w klastrze K8s

### 17.3 Zalecenia

- Commituj często z czytelnymi commit messages
- Używaj branchy dla nowych feature'ów
- Testuj każdy endpoint w Postman
- Dokumentuj endpointy w miarę implementacji
- Używaj seeda do szybkiego testowania
- Loguj ważne operacje (Pino)

---

## 18. Linki i Zasoby

### 18.1 Dokumentacje

- **Hono**: https://hono.dev/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Zod**: https://zod.dev/
- **Pino**: https://getpino.io/
- **Jose (JWT)**: https://github.com/panva/jose

### 18.2 Narzędzia

- **Postman**: https://www.postman.com/
- **Docker**: https://www.docker.com/
- **pnpm**: https://pnpm.io/

---

## 19. Kontakt

**Autor**: [Twoje Imię]  
**Email**: [Twój Email]  
**GitHub**: [Link do repo]  

---

**Data utworzenia**: 2026-01-30  
**Wersja**: 1.0
