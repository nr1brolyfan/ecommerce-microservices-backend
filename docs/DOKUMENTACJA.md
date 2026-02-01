# Dokumentacja Projektu - System E-commerce (Mikroserwisy)

## 1. Opis domeny i celów projektu

### Domena
Projekt to backend systemu e-commerce zrealizowany w architekturze mikroserwisowej. Umożliwia zarządzanie produktami, użytkownikami, koszykiem zakupowym, zamówieniami oraz opiniami klientów.

### Cele projektu
- Zaprojektowanie i implementacja backendu w architekturze mikroserwisowej
- Praktyczne wykorzystanie komunikacji REST/HTTP między serwisami
- Separacja odpowiedzialności - każdy serwis odpowiada za osobną domenę biznesową
- Zastosowanie nowoczesnych technologii (TypeScript, Node.js, PostgreSQL)

## 2. Architektura systemu

### Technologie
- **Runtime**: Node.js 22.19.0
- **Język**: TypeScript
- **Framework HTTP**: Hono
- **Baza danych**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Walidacja**: Zod
- **Autentykacja**: JWT (jose)
- **Monorepo**: pnpm workspaces

### Diagram komponentów

```
┌─────────────────────┐
│   Auth Service      │  Port: 3000
│   (auth schema)     │  - Rejestracja
└──────────┬──────────┘  - Logowanie
           │             - Zarządzanie użytkownikami
           │
┌──────────┴──────────┐
│ PostgreSQL DB       │
│ (microservices_db)  │
│  ├─ auth schema     │
│  ├─ products schema │
│  ├─ cart schema     │
│  ├─ orders schema   │
│  └─ reviews schema  │
└──────────┬──────────┘
           │
    ┌──────┴──────┬──────────┬──────────┬──────────┐
    │             │          │          │          │
┌───┴────┐  ┌────┴───┐ ┌────┴───┐ ┌───┴────┐ ┌──┴─────┐
│Products│  │  Cart  │ │ Orders │ │Reviews │ │Shared  │
│Service │  │Service │ │Service │ │Service │ │Packages│
│Port    │  │Port    │ │Port    │ │Port    │ │        │
│3001    │  │3002    │ │3003    │ │3004    │ │        │
└────────┘  └────────┘ └────────┘ └────────┘ └────────┘
```

### Odpowiedzialności mikroserwisów

1. **Auth Service** (port 3000)
   - Rejestracja nowych użytkowników
   - Logowanie i generowanie JWT tokenów
   - Zarządzanie użytkownikami (CRUD)
   - Walidacja tokenów (middleware dla innych serwisów)

2. **Products Service** (port 3001)
   - Katalog produktów
   - Zarządzanie kategoriami
   - Aktualizacja stanów magazynowych
   - Publiczne i administracyjne endpointy

3. **Cart Service** (port 3002)
   - Zarządzanie koszykiem użytkownika
   - Dodawanie/usuwanie produktów z koszyka
   - Aktualizacja ilości produktów
   - Komunikacja z Products Service (sprawdzanie dostępności)

4. **Orders Service** (port 3003)
   - Składanie zamówień
   - Zarządzanie statusem zamówień
   - Historia zamówień użytkownika
   - Snapshot produktów w momencie zamówienia

5. **Reviews Service** (port 3004)
   - Dodawanie opinii o produktach
   - Edycja/usuwanie własnych opinii
   - Wyświetlanie opinii dla produktów
   - Statystyki ocen (średnia, rozkład)

### Baza danych

System używa **jednej bazy PostgreSQL** (`microservices_db`) z osobnymi **schematami** dla każdego serwisu:
- `auth` - użytkownicy
- `products` - kategorie i produkty
- `cart` - koszyki i pozycje koszyka
- `orders` - zamówienia i pozycje zamówień
- `reviews` - opinie

Podejście to zapewnia:
- Logiczną separację danych
- Uproszczone zarządzanie (jeden db:push dla wszystkich schematów)
- Łatwiejsze backupy

## 3. Specyfikacje API

### Auth Service (port 3000)

#### POST /api/auth/register
Rejestracja nowego użytkownika.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "Jan",
  "lastName": "Kowalski"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "role": "user"
  }
}
```

#### POST /api/auth/login
Logowanie użytkownika.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

#### GET /api/users/:id
Pobranie szczegółów użytkownika (wymaga JWT).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Products Service (port 3001)

#### GET /api/products
Lista wszystkich produktów (publiczny endpoint).

**Query params:**
- `categoryId` (optional) - filtrowanie po kategorii

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "price": 999.99,
      "stockQuantity": 50,
      "categoryId": "uuid",
      "description": "Najnowszy iPhone"
    }
  ]
}
```

#### POST /api/products
Dodanie produktu (wymaga JWT, tylko admin).

**Request:**
```json
{
  "name": "iPhone 15 Pro",
  "categoryId": "uuid",
  "price": 999.99,
  "sku": "SKU-12345",
  "stockQuantity": 50,
  "description": "Najnowszy iPhone"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "price": 999.99,
    "sku": "SKU-12345"
  }
}
```

#### GET /api/categories
Lista kategorii (publiczny endpoint).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices"
    }
  ]
}
```

### Cart Service (port 3002)

#### GET /api/cart/:userId
Pobranie koszyka użytkownika (wymaga JWT).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "items": [
      {
        "productId": "uuid",
        "productName": "iPhone 15 Pro",
        "quantity": 2,
        "priceAtAddition": 999.99
      }
    ],
    "totalAmount": 1999.98
  }
}
```

#### POST /api/cart/:userId/items
Dodanie produktu do koszyka (wymaga JWT).

**Request:**
```json
{
  "productId": "uuid",
  "quantity": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productId": "uuid",
    "quantity": 2,
    "priceAtAddition": 999.99
  }
}
```

### Orders Service (port 3003)

#### POST /api/orders
Złożenie zamówienia (wymaga JWT).

**Request:**
```json
{
  "userId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "status": "pending",
    "totalAmount": 1999.98,
    "items": [...]
  }
}
```

#### GET /api/orders/user/:userId
Historia zamówień użytkownika (wymaga JWT).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "delivered",
      "totalAmount": 1999.98,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### PUT /api/orders/:orderId/status
Zmiana statusu zamówienia (wymaga JWT, tylko admin).

**Request:**
```json
{
  "status": "shipped"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "shipped"
  }
}
```

### Reviews Service (port 3004)

#### POST /api/reviews
Dodanie opinii (wymaga JWT).

**Request:**
```json
{
  "productId": "uuid",
  "orderId": "uuid",
  "rating": 5,
  "title": "Świetny produkt!",
  "comment": "Polecam, działa bez zarzutu"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productId": "uuid",
    "rating": 5,
    "title": "Świetny produkt!"
  }
}
```

#### GET /api/reviews/product/:productId
Opinie dla produktu (publiczny endpoint).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "title": "Świetny produkt!",
      "comment": "Polecam",
      "userId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /api/reviews/product/:productId/stats
Statystyki ocen produktu (publiczny endpoint).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.5,
    "totalReviews": 10,
    "ratingDistribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    }
  }
}
```

## 4. Konfiguracja i instrukcja uruchomienia

### Wymagania
- Node.js 22.19.0 lub nowszy
- pnpm 10.28.1 lub nowszy
- Docker (do PostgreSQL)

### Instrukcja krok po kroku

1. **Przejdź do katalogu**
```bash
cd microservices
```

2. **Zainstaluj zależności**
```bash
pnpm install
```

3. **Uruchom PostgreSQL przez Docker**
```bash
docker-compose up -d
```

Sprawdź czy działa:
```bash
docker ps
```

4. **Zaaplikuj schematy bazy danych**
```bash
pnpm db:push
```

To polecenie tworzy wszystkie tabele w odpowiednich schematach (auth, products, cart, orders, reviews).

5. **Załaduj dane testowe**
```bash
pnpm seed
```

Tworzy:
- 1 admina (`admin@example.com` / `Password123!`)
- 5 użytkowników testowych
- 5 kategorii
- 25 produktów
- 10 zamówień
- 10 opinii

6. **Uruchom wszystkie serwisy**
```bash
pnpm dev
```

7. **Sprawdź czy serwisy działają**
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

Każdy powinien zwrócić:
```json
{
  "status": "ok",
  "service": "nazwa-service",
  "timestamp": "..."
}
```

## 5. Wyniki testów

### Kolekcja Postman

W katalogu głównym projektu znajduje się plik `postman_collection.json` zawierający wszystkie endpointy API.

**Import do Postman:**
1. Otwórz Postman
2. File → Import
3. Wybierz `postman_collection.json`

### Podstawowy scenariusz testowy

**1. Logowanie jako admin**
```
POST http://localhost:3000/api/auth/login
Body: {
  "email": "admin@example.com",
  "password": "Password123!"
}
```
Zapisz otrzymany token JWT.

**2. Pobranie listy produktów**
```
GET http://localhost:3001/api/products
```

**3. Rejestracja nowego użytkownika**
```
POST http://localhost:3000/api/auth/register
Body: {
  "email": "test@example.com",
  "password": "Password123!",
  "firstName": "Test",
  "lastName": "User"
}
```

**4. Logowanie jako nowy użytkownik**
```
POST http://localhost:3000/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "Password123!"
}
```
Zapisz nowy token JWT.

**5. Dodanie produktu do koszyka**
```
POST http://localhost:3002/api/cart/{userId}/items
Headers: Authorization: Bearer {token}
Body: {
  "productId": "{productId z kroku 2}",
  "quantity": 2
}
```

**6. Pobranie koszyka**
```
GET http://localhost:3002/api/cart/{userId}
Headers: Authorization: Bearer {token}
```

**7. Złożenie zamówienia**
```
POST http://localhost:3003/api/orders
Headers: Authorization: Bearer {token}
Body: {
  "userId": "{userId}"
}
```

**8. Zmiana statusu zamówienia (jako admin)**
```
PUT http://localhost:3003/api/orders/{orderId}/status
Headers: Authorization: Bearer {admin_token}
Body: {
  "status": "shipped"
}
```

**9. Dodanie opinii**
```
POST http://localhost:3004/api/reviews
Headers: Authorization: Bearer {token}
Body: {
  "productId": "{productId}",
  "orderId": "{orderId}",
  "rating": 5,
  "title": "Świetny produkt!",
  "comment": "Polecam"
}
```

**10. Pobranie opinii produktu**
```
GET http://localhost:3004/api/reviews/product/{productId}
```

---

Grupa: jednoosobowa.