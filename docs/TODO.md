# TODO - E-commerce Microservices Backend

> **Projekt**: Backend systemu e-commerce w architekturze mikroserwisowej  
> **Technologie**: TypeScript, Hono, Drizzle ORM, PostgreSQL, pnpm workspaces  
> **Szacowany czas**: 8-12 dni roboczych

---

## 📋 Progress Overview

- **FAZA 1**: Setup & Infrastructure ✅ (5/5)
- **FAZA 2**: Shared Packages ✅ (4/4)
- **FAZA 3**: Auth Service 🔄 (3/6)
- **FAZA 4**: Products Service ⬜ (0/6)
- **FAZA 5**: Cart Service ⬜ (0/5)
- **FAZA 6**: Orders Service ⬜ (0/6)
- **FAZA 7**: Reviews Service ⬜ (0/6)
- **FAZA 8**: Testing & Documentation ⬜ (0/5)
- **FAZA 9**: Final Polish ⬜ (0/4)

**TOTAL PROGRESS**: 12/47 tasków (26%)

---

## FAZA 1: Setup & Infrastructure 🏗️

### [x] 1.1 Inicjalizacja Projektu
- [x] Utworzyć główny folder `microservices/`
- [x] Zainicjalizować Git repository (`git init`)
- [x] Utworzyć `.gitignore` (node_modules, .env, dist, *.log)
- [x] Zainicjalizować pnpm (`pnpm init`)
- [x] Utworzyć `pnpm-workspace.yaml` z konfiguracją workspaces

### [x] 1.2 Struktura Folderów
- [x] Utworzyć folder `apps/` dla mikroserwisów
- [x] Utworzyć folder `packages/` dla shared code
- [x] Utworzyć folder `docs/` dla dokumentacji
- [x] Skopiować PROJEKT.md i TODO.md do `docs/`
- [x] Utworzyć strukturę dla każdego mikroserwisu:
  - [x] `apps/auth-service/`
  - [x] `apps/products-service/`
  - [x] `apps/cart-service/`
  - [x] `apps/orders-service/`
  - [x] `apps/reviews-service/`

### [x] 1.3 PostgreSQL Setup
- [x] Utworzyć `docker-compose.yml` dla PostgreSQL
- [x] Utworzyć `scripts/init-databases.sql` (5 baz danych)
- [x] Uruchomić PostgreSQL (`docker-compose up -d`)
- [x] Zweryfikować połączenie z bazą (`psql` lub pgAdmin)

### [x] 1.4 Root Package Configuration
- [x] Utworzyć root `package.json` z workspace scripts:
  - [x] `"dev"` - uruchom wszystkie serwisy
  - [x] `"build"` - build wszystkich serwisów
  - [x] `"test"` - testy wszystkich serwisów
  - [x] `"db:migrate"` - migracje wszystkich baz
- [x] Dodać dev dependencies (typescript, tsx, vitest)
- [x] Utworzyć `.env.example` template

### [x] 1.5 Environment Variables
- [x] Utworzyć główny `.env` z:
  - [x] Połączenie PostgreSQL
  - [x] JWT_SECRET
  - [x] Service URLs (localhost:3000-3004)
- [x] Dodać `.env` do `.gitignore`
- [x] Zweryfikować że wszystkie zmienne są załadowane

---

## FAZA 2: Shared Packages 📦

### [x] 2.1 @repo/shared-config
- [x] Utworzyć `packages/shared-config/`
- [x] Utworzyć `tsconfig.base.json` z konfiguracją TypeScript
- [x] Utworzyć `eslint.config.js` z regułami ESLint
- [x] Utworzyć `prettier.config.js` z formatowaniem
- [x] Dodać `package.json` z exports

### [x] 2.2 @repo/shared-types
- [x] Utworzyć `packages/shared-types/` z strukturą DDD
- [x] Zaimplementować `domain/entities/BaseEntity.ts`
- [x] Zaimplementować value objects:
  - [x] `domain/value-objects/Email.ts`
  - [x] `domain/value-objects/Password.ts`
  - [x] `domain/value-objects/Id.ts`
- [x] Utworzyć custom errors:
  - [x] `errors/DomainError.ts`
  - [x] `errors/ValidationError.ts`
  - [x] `errors/NotFoundError.ts`
  - [x] `errors/UnauthorizedError.ts`
  - [x] `errors/ForbiddenError.ts` (bonus)
- [x] Utworzyć strukturę dla DTOs (auth, products, cart, orders, reviews)
- [x] Dodać `package.json` i skonfigurować build

### [x] 2.3 @repo/shared-utils
- [x] Utworzyć `packages/shared-utils/`
- [x] Zaimplementować JWT utilities:
  - [x] `jwt/generate.ts` - generowanie JWT (jose)
  - [x] `jwt/verify.ts` - weryfikacja JWT
  - [x] `jwt/types.ts` - typy payload
- [x] Zaimplementować auth middleware:
  - [x] `auth/middleware.ts` - authMiddleware, requireAdmin, requireOwnership
  - [x] `auth/password.ts` - hash/compare (bcrypt)
- [x] Zaimplementować logger:
  - [x] `logger/index.ts` - konfiguracja Pino
- [x] Zaimplementować response formatters:
  - [x] `response/success.ts`
  - [x] `response/error.ts`
- [x] Dodać `package.json` i dependencies (jose, bcrypt, pino, hono)

### [x] 2.4 @repo/scripts
- [x] Utworzyć `packages/scripts/`
- [x] Dodać `package.json` z dependencies (drizzle-seed, drizzle-orm, postgres)
- [x] Utworzyć `utils/database.ts` z connection helpers
- [x] Przygotować strukturę dla seed scripts z Drizzle Seed:
  - [x] `seed/seed-auth.ts` (TODO: implement when schema ready)
  - [x] `seed/seed-products.ts` (TODO: implement when schema ready)
  - [x] `seed/seed-orders.ts` (TODO: implement when schema ready)
  - [x] `seed/seed-reviews.ts` (TODO: implement when schema ready)
  - [x] `seed/seed-all.ts` (orchestrates all seeds)

---

## FAZA 3: Auth Service 🔐

### [x] 3.1 Setup Auth Service
- [x] Utworzyć strukturę folderów DDD w `apps/auth-service/src/`:
  - [x] `domain/` (entities, value-objects, repositories, errors)
  - [x] `application/` (use-cases, dtos)
  - [x] `infrastructure/` (database, repositories)
  - [x] `presentation/` (routes, middlewares, validators)
  - [x] `config/`
- [x] Utworzyć `package.json` z dependencies (hono, drizzle-orm, postgres, zod)
- [x] Utworzyć `tsconfig.json` (extends shared-config)
- [x] Utworzyć `.env.example` dla auth-service

### [x] 3.2 Database Schema & Migrations
- [x] Utworzyć `infrastructure/database/schema.ts` z tabelą `users`:
  - [x] id, email, password_hash, first_name, last_name, role, timestamps
- [x] Utworzyć `infrastructure/database/connection.ts` (Drizzle connection)
- [x] Utworzyć `drizzle.config.ts`
- [x] Wygenerować migracje (`drizzle-kit generate`)
- [x] Uruchomić migracje (`drizzle-kit push`)

### [x] 3.3 Domain Layer
- [x] Utworzyć `domain/entities/User.ts` entity
- [x] Utworzyć `domain/value-objects/Email.ts` (walidacja email) - używa z shared-types
- [x] Utworzyć `domain/value-objects/Password.ts` (walidacja hasła) - używa z shared-types
- [x] Utworzyć `domain/repositories/IUserRepository.ts` interface
- [x] Utworzyć `domain/errors/AuthErrors.ts` (UserNotFound, InvalidCredentials)

### [ ] 3.4 Application Layer
- [ ] Utworzyć use cases:
  - [ ] `application/use-cases/RegisterUser.ts`
  - [ ] `application/use-cases/LoginUser.ts`
  - [ ] `application/use-cases/GetUserById.ts`
  - [ ] `application/use-cases/UpdateUser.ts`
- [ ] Utworzyć DTOs:
  - [ ] `application/dtos/RegisterDto.ts`
  - [ ] `application/dtos/LoginDto.ts`
  - [ ] `application/dtos/UpdateUserDto.ts`

### [ ] 3.5 Infrastructure Layer
- [ ] Zaimplementować `infrastructure/repositories/UserRepository.ts` (implements IUserRepository)
- [ ] Dodać metody: findById, findByEmail, create, update
- [ ] Przetestować repository bezpośrednio

### [ ] 3.6 Presentation Layer (API)
- [ ] Utworzyć Hono app w `app.ts`
- [ ] Utworzyć `presentation/validators/auth.validators.ts` (Zod schemas)
- [ ] Utworzyć `presentation/routes/auth.routes.ts`:
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login (zwraca JWT)
  - [ ] GET /api/auth/me (wymaga JWT)
- [ ] Utworzyć `presentation/routes/users.routes.ts`:
  - [ ] GET /api/users/:id
  - [ ] PUT /api/users/:id
- [ ] Dodać middleware auth/admin z @repo/shared-utils
- [ ] Utworzyć `index.ts` entry point (start serwera na porcie 3000)
- [ ] Przetestować wszystkie endpointy w Postman
- [ ] Wyeksportować `export type AuthApp = typeof app` dla Hono RPC

---

## FAZA 4: Products Service 🛍️

### [ ] 4.1 Setup Products Service
- [ ] Utworzyć strukturę folderów DDD w `apps/products-service/src/`
- [ ] Utworzyć `package.json` z dependencies
- [ ] Utworzyć `tsconfig.json`
- [ ] Utworzyć `.env.example` (DATABASE_URL, AUTH_SERVICE_URL)

### [ ] 4.2 Database Schema & Migrations
- [ ] Utworzyć `infrastructure/database/schema.ts` z tabelami:
  - [ ] `categories` (id, name, slug, description, created_at)
  - [ ] `products` (id, category_id, name, slug, description, price, sku, stock_quantity, image_url, timestamps)
- [ ] Utworzyć connection i drizzle config
- [ ] Wygenerować i uruchomić migracje

### [ ] 4.3 Domain Layer
- [ ] Utworzyć entities:
  - [ ] `domain/entities/Product.ts`
  - [ ] `domain/entities/Category.ts`
- [ ] Utworzyć value objects:
  - [ ] `domain/value-objects/Price.ts` (validacja ceny)
  - [ ] `domain/value-objects/SKU.ts` (validacja SKU)
- [ ] Utworzyć interfaces:
  - [ ] `domain/repositories/IProductRepository.ts`
  - [ ] `domain/repositories/ICategoryRepository.ts`
- [ ] Utworzyć `domain/errors/ProductErrors.ts`

### [ ] 4.4 Application Layer
- [ ] Utworzyć use cases dla produktów:
  - [ ] `CreateProduct.ts`
  - [ ] `GetProducts.ts` (z filtrowaniem)
  - [ ] `GetProductById.ts`
  - [ ] `UpdateProduct.ts`
  - [ ] `DeleteProduct.ts`
- [ ] Utworzyć use cases dla kategorii:
  - [ ] `CreateCategory.ts`
  - [ ] `GetCategories.ts`
- [ ] Utworzyć DTOs

### [ ] 4.5 Infrastructure Layer
- [ ] Zaimplementować `ProductRepository.ts`
- [ ] Zaimplementować `CategoryRepository.ts`
- [ ] Dodać filtrowanie (category, minPrice, maxPrice, inStock)

### [ ] 4.6 Presentation Layer (API)
- [ ] Utworzyć Hono app
- [ ] Utworzyć validators (Zod)
- [ ] Utworzyć routes dla produktów:
  - [ ] GET /api/products (public)
  - [ ] GET /api/products/:id (public)
  - [ ] POST /api/products (admin only)
  - [ ] PUT /api/products/:id (admin only)
  - [ ] DELETE /api/products/:id (admin only)
- [ ] Utworzyć routes dla kategorii:
  - [ ] GET /api/categories (public)
  - [ ] GET /api/categories/:id (public)
  - [ ] POST /api/categories (admin only)
- [ ] Zintegrować auth middleware z @repo/shared-utils
- [ ] Start serwera na porcie 3001
- [ ] Wyeksportować `export type ProductsApp = typeof app`
- [ ] Przetestować wszystkie endpointy w Postman

---

## FAZA 5: Cart Service 🛒

### [ ] 5.1 Setup Cart Service
- [ ] Utworzyć strukturę folderów DDD w `apps/cart-service/src/`
- [ ] Utworzyć `package.json` z dependencies
- [ ] Utworzyć `tsconfig.json`
- [ ] Utworzyć `.env.example` (DATABASE_URL, PRODUCTS_SERVICE_URL, AUTH_SERVICE_URL)

### [ ] 5.2 Database Schema & Migrations
- [ ] Utworzyć `infrastructure/database/schema.ts` z tabelami:
  - [ ] `carts` (id, user_id UNIQUE, created_at, updated_at)
  - [ ] `cart_items` (id, cart_id FK, product_id, quantity, price_at_addition, added_at)
- [ ] Wygenerować i uruchomić migracje

### [ ] 5.3 Domain & Application Layers
- [ ] Utworzyć `domain/entities/Cart.ts` i `CartItem.ts`
- [ ] Utworzyć `domain/repositories/ICartRepository.ts`
- [ ] Utworzyć use cases:
  - [ ] `GetCart.ts`
  - [ ] `AddItemToCart.ts`
  - [ ] `UpdateCartItem.ts`
  - [ ] `RemoveCartItem.ts`
  - [ ] `ClearCart.ts`

### [ ] 5.4 Infrastructure Layer (Hono RPC Integration)
- [ ] Zaimplementować `CartRepository.ts`
- [ ] Utworzyć `infrastructure/clients/ProductsClient.ts`:
  - [ ] Zaimportować `type ProductsApp` z products-service
  - [ ] Użyć `hc<ProductsApp>()` do utworzenia klienta
  - [ ] Zaimplementować `getProduct(id)` - weryfikacja produktu
  - [ ] Zaimplementować `checkStock(id, quantity)` - weryfikacja dostępności
- [ ] Dodać error handling dla niedostępnego serwisu

### [ ] 5.5 Presentation Layer (API)
- [ ] Utworzyć Hono app
- [ ] Utworzyć validators
- [ ] Utworzyć routes:
  - [ ] GET /api/cart/:userId (auth: own user or admin)
  - [ ] POST /api/cart/:userId/items (auth: own user or admin)
  - [ ] PUT /api/cart/:userId/items/:productId (auth: own user or admin)
  - [ ] DELETE /api/cart/:userId/items/:productId (auth: own user or admin)
  - [ ] DELETE /api/cart/:userId (auth: own user or admin)
- [ ] Dodać middleware sprawdzający ownership (user może tylko swój koszyk)
- [ ] Start serwera na porcie 3002
- [ ] Wyeksportować `export type CartApp = typeof app`
- [ ] Przetestować wszystkie endpointy w Postman (weryfikuj integrację z products-service)

---

## FAZA 6: Orders Service 📦

### [ ] 6.1 Setup Orders Service
- [ ] Utworzyć strukturę folderów DDD w `apps/orders-service/src/`
- [ ] Utworzyć `package.json` z dependencies
- [ ] Utworzyć `tsconfig.json`
- [ ] Utworzyć `.env.example` (DATABASE_URL, CART_SERVICE_URL, PRODUCTS_SERVICE_URL)

### [ ] 6.2 Database Schema & Migrations
- [ ] Utworzyć `infrastructure/database/schema.ts` z tabelami:
  - [ ] `orders` (id, user_id, status ENUM, total_amount, created_at, updated_at)
  - [ ] `order_items` (id, order_id FK, product_id snapshot, product_name snapshot, quantity, price_at_order, subtotal)
- [ ] Utworzyć ENUM dla statusu: pending, processing, shipped, delivered, cancelled
- [ ] Wygenerować i uruchomić migracje

### [ ] 6.3 Domain & Application Layers
- [ ] Utworzyć entities:
  - [ ] `domain/entities/Order.ts`
  - [ ] `domain/entities/OrderItem.ts`
- [ ] Utworzyć value objects:
  - [ ] `domain/value-objects/OrderStatus.ts`
- [ ] Utworzyć `domain/repositories/IOrderRepository.ts`
- [ ] Utworzyć use cases:
  - [ ] `CreateOrder.ts` (proces: get cart → verify products → create order → clear cart)
  - [ ] `GetOrderById.ts`
  - [ ] `GetOrdersByUserId.ts`
  - [ ] `UpdateOrderStatus.ts` (admin only)

### [ ] 6.4 Infrastructure Layer (Multiple RPC Clients)
- [ ] Zaimplementować `OrderRepository.ts`
- [ ] Utworzyć `infrastructure/clients/CartClient.ts`:
  - [ ] Zaimportować `type CartApp`
  - [ ] `getCart(userId)` - pobierz koszyk
  - [ ] `clearCart(userId)` - wyczyść po zamówieniu
- [ ] Utworzyć `infrastructure/clients/ProductsClient.ts`:
  - [ ] Zaimportować `type ProductsApp`
  - [ ] `getProduct(id)` - weryfikacja produktu
  - [ ] `checkStock(id, quantity)` - weryfikacja dostępności
  - [ ] `updateStock(id, quantity)` - aktualizacja stanu (admin endpoint)

### [ ] 6.5 Presentation Layer (API)
- [ ] Utworzyć Hono app
- [ ] Utworzyć validators
- [ ] Utworzyć routes:
  - [ ] POST /api/orders (auth: user/admin) - stwórz zamówienie
  - [ ] GET /api/orders/:id (auth: own user or admin)
  - [ ] GET /api/orders/user/:userId (auth: own user or admin)
  - [ ] PUT /api/orders/:id/status (admin only)
- [ ] Zaimplementować proces składania zamówienia:
  - [ ] Walidacja użytkownika
  - [ ] Pobranie koszyka z cart-service
  - [ ] Weryfikacja produktów w products-service
  - [ ] Utworzenie zamówienia (snapshot cen i nazw)
  - [ ] Wyczyszczenie koszyka w cart-service
- [ ] Start serwera na porcie 3003
- [ ] Wyeksportować `export type OrdersApp = typeof app`
- [ ] Przetestować pełny flow w Postman

### [ ] 6.6 Error Handling & Rollback
- [ ] Dodać try-catch w CreateOrder use case
- [ ] Jeśli zamówienie się nie powiedzie, nie czyść koszyka
- [ ] Jeśli brak produktu w magazynie, zwróć błąd przed utworzeniem zamówienia
- [ ] Przetestować edge cases (puste koszyki, brak stocku)

---

## FAZA 7: Reviews Service ⭐

### [ ] 7.1 Setup Reviews Service
- [ ] Utworzyć strukturę folderów DDD w `apps/reviews-service/src/`
- [ ] Utworzyć `package.json` z dependencies
- [ ] Utworzyć `tsconfig.json`
- [ ] Utworzyć `.env.example` (DATABASE_URL, PRODUCTS_SERVICE_URL, ORDERS_SERVICE_URL)

### [ ] 7.2 Database Schema & Migrations
- [ ] Utworzyć `infrastructure/database/schema.ts` z tabelą:
  - [ ] `reviews` (id, product_id, user_id, order_id, rating 1-5, title, comment, created_at, updated_at)
  - [ ] UNIQUE constraint (product_id, user_id) - jedna opinia na produkt
- [ ] Wygenerować i uruchomić migracje

### [ ] 7.3 Domain & Application Layers
- [ ] Utworzyć `domain/entities/Review.ts`
- [ ] Utworzyć `domain/value-objects/Rating.ts` (1-5 validation)
- [ ] Utworzyć `domain/repositories/IReviewRepository.ts`
- [ ] Utworzyć use cases:
  - [ ] `CreateReview.ts` (weryfikacja zakupu produktu)
  - [ ] `GetReviewsByProduct.ts`
  - [ ] `GetReviewsByUser.ts`
  - [ ] `GetReviewStats.ts` (średnia ocena, dystrybucja)
  - [ ] `UpdateReview.ts`
  - [ ] `DeleteReview.ts`

### [ ] 7.4 Infrastructure Layer (RPC Clients)
- [ ] Zaimplementować `ReviewRepository.ts`
- [ ] Dodać metodę `getAverageRating(productId)` i `getRatingDistribution(productId)`
- [ ] Utworzyć `infrastructure/clients/ProductsClient.ts`:
  - [ ] `getProduct(id)` - weryfikacja czy produkt istnieje
- [ ] Utworzyć `infrastructure/clients/OrdersClient.ts`:
  - [ ] Zaimportować `type OrdersApp`
  - [ ] `verifyPurchase(userId, productId)` - czy użytkownik kupił produkt

### [ ] 7.5 Presentation Layer (API)
- [ ] Utworzyć Hono app
- [ ] Utworzyć validators (rating 1-5, title min 5 chars)
- [ ] Utworzyć routes:
  - [ ] POST /api/reviews (auth: user/admin) - wymaga weryfikacji zakupu
  - [ ] GET /api/reviews/product/:productId (public)
  - [ ] GET /api/reviews/user/:userId (auth: own user or admin)
  - [ ] GET /api/reviews/product/:productId/stats (public)
  - [ ] PUT /api/reviews/:id (auth: own user or admin)
  - [ ] DELETE /api/reviews/:id (auth: own user or admin)
- [ ] Dodać middleware weryfikacji zakupu w POST /api/reviews
- [ ] Start serwera na porcie 3004
- [ ] Wyeksportować `export type ReviewsApp = typeof app`
- [ ] Przetestować wszystkie endpointy w Postman

### [ ] 7.6 Business Logic Validation
- [ ] Weryfikować że rating jest między 1-5
- [ ] Weryfikować że użytkownik kupił produkt przed dodaniem opinii
- [ ] Weryfikować że produkt istnieje
- [ ] Zapobiec duplikatom (jeden user = jedna opinia na produkt)
- [ ] Przetestować edge cases

---

## FAZA 8: Testing & Documentation 🧪

### [ ] 8.1 Seed Scripts
- [ ] Zaimplementować `packages/scripts/src/seed/seed-auth.ts`:
  - [ ] 1 admin user (admin@example.com / Admin123!)
  - [ ] 5 regular users (używając Faker)
- [ ] Zaimplementować `packages/scripts/src/seed/seed-products.ts`:
  - [ ] 3-5 kategorii (Electronics, Clothing, Books, itp.)
  - [ ] 20-30 produktów w różnych kategoriach (Faker + realistyczne ceny)
- [ ] Zaimplementować `packages/scripts/src/seed/seed-orders.ts`:
  - [ ] 5-10 przykładowych zamówień dla różnych użytkowników
  - [ ] Różne statusy (pending, processing, shipped, delivered)
- [ ] Zaimplementować `packages/scripts/src/seed/seed-reviews.ts`:
  - [ ] 15-20 opinii dla różnych produktów
  - [ ] Różne ratingi (1-5)
- [ ] Zaimplementować `packages/scripts/src/seed/seed-all.ts`:
  - [ ] Uruchamia wszystkie seedy w odpowiedniej kolejności
- [ ] Dodać skrypt `pnpm seed` do root package.json
- [ ] Przetestować seed: wyczyść bazy i uruchom `pnpm seed`

### [ ] 8.2 Postman Collection
- [ ] Utworzyć kolekcję Postman "E-commerce Microservices"
- [ ] Utworzyć folder dla każdego serwisu
- [ ] Dodać requesty dla Auth Service:
  - [ ] Register User
  - [ ] Login User (zapisz token do zmiennej)
  - [ ] Get Current User (używa tokenu)
  - [ ] Get User by ID
  - [ ] Update User
- [ ] Dodać requesty dla Products Service:
  - [ ] Get All Products
  - [ ] Get Product by ID
  - [ ] Create Product (admin, używa tokenu)
  - [ ] Update Product (admin)
  - [ ] Delete Product (admin)
  - [ ] Get Categories
  - [ ] Create Category (admin)
- [ ] Dodać requesty dla Cart Service:
  - [ ] Get Cart
  - [ ] Add Item to Cart
  - [ ] Update Item Quantity
  - [ ] Remove Item
  - [ ] Clear Cart
- [ ] Dodać requesty dla Orders Service:
  - [ ] Create Order
  - [ ] Get Order by ID
  - [ ] Get User Orders
  - [ ] Update Order Status (admin)
- [ ] Dodać requesty dla Reviews Service:
  - [ ] Create Review
  - [ ] Get Product Reviews
  - [ ] Get Review Stats
  - [ ] Update Review
  - [ ] Delete Review
- [ ] Skonfigurować Environment variables (base URLs, token, userId)
- [ ] Wyeksportować kolekcję do `postman_collection.json`

### [ ] 8.3 Integration Testing
- [ ] Przetestować pełny flow użytkownika w Postman:
  - [ ] Rejestracja
  - [ ] Logowanie
  - [ ] Przeglądanie produktów
  - [ ] Dodanie produktów do koszyka
  - [ ] Złożenie zamówienia
  - [ ] Dodanie opinii
- [ ] Przetestować flow admina:
  - [ ] Logowanie jako admin
  - [ ] Utworzenie kategorii
  - [ ] Utworzenie produktu
  - [ ] Zmiana statusu zamówienia
- [ ] Przetestować error cases:
  - [ ] Brak tokenu (401 Unauthorized)
  - [ ] User próbuje dostać się do admin endpoint (403 Forbidden)
  - [ ] Nieprawidłowe dane (400 Bad Request)
  - [ ] Nieistniejący zasób (404 Not Found)
- [ ] Zrobić screenshots kluczowych requestów dla dokumentacji

### [ ] 8.4 Unit Tests (Opcjonalnie - podstawowe)
- [ ] Napisać testy dla use cases w auth-service:
  - [ ] RegisterUser.test.ts
  - [ ] LoginUser.test.ts
- [ ] Napisać testy dla use cases w products-service:
  - [ ] CreateProduct.test.ts
- [ ] Napisać testy dla use cases w orders-service:
  - [ ] CreateOrder.test.ts (mock RPC clients)
- [ ] Uruchomić `pnpm test` i zweryfikować że wszystkie przechodzą

### [ ] 8.5 README.md
- [ ] Utworzyć główny `README.md` z:
  - [ ] Krótki opis projektu
  - [ ] Stack technologiczny
  - [ ] Wymagania (Node.js, pnpm, PostgreSQL)
  - [ ] Instrukcja instalacji (krok po kroku)
  - [ ] Instrukcja uruchomienia
  - [ ] Jak seedować dane
  - [ ] Jak testować w Postman
  - [ ] Struktura projektu (krótko)
  - [ ] Linki do PROJEKT.md i TODO.md
- [ ] Przetestować instrukcję na czystym środowisku (symulacja)

---

## FAZA 9: Final Polish ✨

### [ ] 9.1 Code Review & Cleanup
- [ ] Przejrzeć cały kod i usunąć console.log
- [ ] Sprawdzić czy wszystkie zmienne środowiskowe są w .env.example
- [ ] Sprawdzić czy wszystkie serwisy mają proper error handling
- [ ] Zweryfikować że wszystkie endpointy zwracają consistent response format
- [ ] Sprawdzić czy code style jest consistent (Prettier)

### [ ] 9.2 Documentation Review
- [ ] Przejrzeć PROJEKT.md i zaktualizować jeśli coś się zmieniło
- [ ] Sprawdzić czy wszystkie endpointy w PROJEKT.md są aktualne
- [ ] Zaktualizować diagramy jeśli trzeba
- [ ] Dodać screenshots z Postman do dokumentacji (optional)

### [ ] 9.3 Performance & Security Check
- [ ] Zweryfikować że wszystkie hasła są hashowane (bcrypt)
- [ ] Sprawdzić że JWT secret nie jest hardcoded
- [ ] Sprawdzić że .env jest w .gitignore
- [ ] Sprawdzić czy wszystkie endpointy mają właściwe middleware auth/admin
- [ ] Przetestować czy ownership validation działa (user nie może edytować cudzego koszyka)

### [ ] 9.4 Final Packaging
- [ ] Utworzyć `.gitignore` jeśli nie istnieje
- [ ] Sprawdzić czy wszystkie node_modules są zignorowane
- [ ] Sprawdzić czy dist/ i build/ są zignorowane
- [ ] Utworzyć ZIP archiwum projektu (bez node_modules, .env, dist)
- [ ] Zweryfikować że ZIP zawiera:
  - [ ] Cały kod źródłowy
  - [ ] package.json i pnpm-workspace.yaml
  - [ ] docker-compose.yml
  - [ ] Dokumentację (PROJEKT.md, TODO.md, README.md)
  - [ ] Postman collection
  - [ ] .env.example
- [ ] Przetestować rozpakowanie i uruchomienie z ZIP

---

## 🎯 Quick Start Commands

```bash
# Setup
pnpm install
docker-compose up -d
pnpm db:migrate
pnpm seed

# Development
pnpm dev

# Testing
pnpm test

# Build
pnpm build
```

---

## 📝 Notes

- **Priorytet**: Najpierw skończ FAZY 1-7 (core functionality), potem FAZA 8-9 (polish)
- **Czas**: ~1-2 dni na fazę, elastycznie
- **Testowanie**: Testuj każdy serwis osobno przed przejściem do następnego
- **Hono RPC**: Kluczowe dla komunikacji między serwisami - przetestuj dokładnie
- **Seeding**: Niezbędne do szybkiego testowania - zrób wcześnie

---

**Last Updated**: 2026-01-30  
**Total Tasks**: 47 major tasks (każdy z 3-8 subtasks)  
**Status**: Not Started ⬜
