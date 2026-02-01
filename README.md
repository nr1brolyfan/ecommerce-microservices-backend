# E-commerce Backend - Architektura Mikroserwisowa

System e-commerce zbudowany w architekturze mikroserwisowej z wykorzystaniem TypeScript, Node.js i PostgreSQL.

## Technologie

- **Runtime**: Node.js 20+
- **Język**: TypeScript
- **Framework**: Hono (REST API)
- **Baza danych**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Walidacja**: Zod
- **Autentykacja**: JWT (jose)
- **Monorepo**: pnpm workspaces

## Architektura

System składa się z 5 niezależnych mikroserwisów:

- **Auth Service** (port 3000) - zarządzanie użytkownikami i autentykacja
- **Products Service** (port 3001) - katalog produktów i kategorii
- **Cart Service** (port 3002) - koszyk zakupowy
- **Orders Service** (port 3003) - składanie i zarządzanie zamówieniami
- **Reviews Service** (port 3004) - opinie i oceny produktów

Każdy serwis posiada własną bazę danych PostgreSQL i komunikuje się przez REST API.

## Wymagania (na czym ja robiłem i testowałem)

- Node.js 22.19.0
- pnpm 10.28.1
- PostgreSQL 16+

## Instalacja i uruchomienie

### 1. Zainstaluj zależności
```bash
pnpm install
```

### 2. Uruchom PostgreSQL
```bash
docker-compose up -d
```

### 3. Skonfiguruj zmienne środowiskowe
Pliki `.env` są już skonfigurowane w każdym serwisie (`apps/*/env`).

Sprawdź i dostosuj jeśli potrzeba (szczególnie dane połączenia do PostgreSQL).

### 4. Uruchom migracje baz danych
```bash
pnpm db:push
```

### 5. (Opcjonalnie) Załaduj dane testowe
```bash
pnpm seed
```

### 6. Uruchom wszystkie serwisy
```bash
pnpm dev
```

Serwisy będą dostępne na:
- http://localhost:3000 (Auth)
- http://localhost:3001 (Products)
- http://localhost:3002 (Cart)
- http://localhost:3003 (Orders)
- http://localhost:3004 (Reviews)

## Testowanie API

Import kolekcji Postman z pliku `postman_collection.json` do Postman.

### Podstawowy flow testowy:

1. **Zaloguj się jako admin**
   ```
   POST http://localhost:3000/api/auth/login
   {
     "email": "admin@example.com",
     "password": "Password123!"
   }
   ```

2. **Utwórz kategorię** (jako admin)
   ```
   POST http://localhost:3001/api/categories
   ```

3. **Dodaj produkty** (jako admin)
   ```
   POST http://localhost:3001/api/products
   ```

4. **Zarejestruj użytkownika**
   ```
   POST http://localhost:3000/api/auth/register
   ```

5. **Dodaj produkt do koszyka**
   ```
   POST http://localhost:3002/api/cart/{userId}/items
   ```

6. **Złóż zamówienie**
   ```
   POST http://localhost:3003/api/orders
   ```

7. **Zmień status zamówienia** (jako admin)
   ```
   PUT http://localhost:3003/api/orders/{orderId}/status
   ```

8. **Dodaj opinię o produkcie**
   ```
   POST http://localhost:3004/api/reviews
   ```

## Struktura projektu

```
microservices/
├── apps/                       # Mikroserwisy
│   ├── auth-service/
│   ├── products-service/
│   ├── cart-service/
│   ├── orders-service/
│   └── reviews-service/
├── packages/                   # Współdzielone pakiety
│   ├── shared-types/
│   ├── shared-utils/
│   └── shared-config/
├── docs/                       # Dokumentacja
│   └── PROJEKT.md             # Szczegółowa dokumentacja projektu
├── postman_collection.json    # Kolekcja Postman
└── docker-compose.yml         # PostgreSQL
```

## Dokumentacja

Pełna dokumentacja projektu znajduje się w pliku `docs/PROJEKT.md`.