# Luna — Step-by-Step Implementation Sub-Plan

> **Parent Plan**: [luna-implementation-plan.md](file:///Users/sanjaya/Documents/DressShoppingWebsite/Luna-plan/luna-implementation-plan.md)
> This document breaks every phase into granular, individually actionable tasks with exact files, commands, and verification steps.

---

## Progress Tracker

| Phase | Task Count | Status |
| :--- | :---: | :---: |
| Phase 0 — Project Setup | 5 tasks | ✅ Completed |
| Phase 1 — Product Service | 9 tasks | 🔄 In Progress |
| Phase 2 — User Service | 7 tasks | ⬜ Not Started |
| Phase 3 — API Gateway | 4 tasks | ⬜ Not Started |
| Phase 4 — Order Service | 7 tasks | ⬜ Not Started |
| Phase 5 — React Storefront | 8 tasks | ⬜ Not Started |
| Phase 6 — Admin Dashboard | 5 tasks | ⬜ Not Started |
| Phase 7 — Docker & Testing | 4 tasks | ⬜ Not Started |

---

## Phase 0 — Maven Multi-Module Project Setup

### Task 0.1: Create Root Maven Parent POM
- [x] Create `pom.xml` at workspace root
- Define `<groupId>com.luna</groupId>`, `<artifactId>luna-parent</artifactId>`
- Set `<java.version>21</java.version>`
- Spring Boot parent: `3.3.4`
- Spring Cloud BOM: `2023.0.3`
- Aggregate modules: `luna-gateway`, `product-service`, `user-service`, `order-service`
- **Verify**: `mvn validate` runs without errors at root (PASSED)

### Task 0.2: Scaffold Product Service Module
- [x] Create `product-service/pom.xml` inheriting from root parent
- Dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `postgresql`, `spring-boot-starter-validation`, `spring-boot-starter-actuator`, `springdoc-openapi-starter-webmvc-ui`, `spring-boot-starter-test`
- [x] Create directory structure:
  ```
  product-service/src/main/java/com/luna/product/
  ├── ProductServiceApplication.java
  ├── controller/
  ├── service/
  ├── repository/
  ├── entity/
  ├── dto/
  ├── exception/
  └── config/
  product-service/src/main/resources/application.properties
  product-service/src/test/java/com/luna/product/
  ```
- **Verify**: `mvn compile -pl product-service` succeeds (PASSED)

### Task 0.3: Scaffold User Service Module
- [x] Create `user-service/pom.xml` inheriting from root parent
- Dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `postgresql`, `spring-boot-starter-security`, `spring-boot-starter-validation`, `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (0.12.6), `spring-boot-starter-test`
- [x] Create directory structure under `com.luna.user`
- **Verify**: `mvn compile -pl user-service` succeeds (PASSED)

### Task 0.4: Scaffold Order Service Module
- [x] Create `order-service/pom.xml` inheriting from root parent
- Dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `postgresql`, `spring-cloud-starter-openfeign`, `spring-boot-starter-validation`, `spring-boot-starter-test`
- [x] Create directory structure under `com.luna.order`
- **Verify**: `mvn compile -pl order-service` succeeds (PASSED)

### Task 0.5: Scaffold Gateway Module
- [x] Create `luna-gateway/pom.xml` inheriting from root parent
- Dependencies: `spring-cloud-starter-gateway`, `jjwt-api`, `jjwt-impl`, `jjwt-jackson`
- [x] Create directory structure under `com.luna.gateway`
- **Verify**: `mvn compile -pl luna-gateway` succeeds (PASSED)

---

## Phase 1 — Product Service (Port 8082)

### Task 1.1: Create PostgreSQL Database & Tables
- [x] Connect to local PostgreSQL and execute `CREATE DATABASE luna_products;`
- [x] Execute DDL script `Luna-platform/db/ddls/1. products.sql`
- [x] Configure `product-service/src/main/resources/application.properties` for port 5433
- **Verify**: Service database and tables `categories`, `products`, `product_variants` created in pgAdmin (PASSED)

### Task 1.2: Create Category Entity
- [x] Create `entity/Category.java`
  - `@Entity @Table(name = "categories")`
  - Fields: `id` (Long, `@GeneratedValue(strategy = IDENTITY)`), `name` (varchar 80, not null), `slug` (varchar 80, unique), `description` (varchar 500), `imageUrl` (varchar 1000), `createdAt`, `updatedAt`
  - `@PrePersist` and `@PreUpdate` lifecycle callbacks for timestamps
- [x] Create `repository/CategoryRepository.java`
  - Extends `JpaRepository<Category, Long>`
  - Method: `Optional<Category> findBySlug(String slug)`
- [x] Create `dto/CategoryResponse.java` (Java Record)
  - Fields: `id`, `name`, `slug`, `description`, `imageUrl`
- **Verify**: `mvn compile -pl product-service` succeeds with 4 source files compiled (PASSED)

### Task 1.3: Create Product Entity
- [x] Create `entity/Product.java`
  - `@Entity @Table(name = "products")`
  - Fields: `id` (UUID, `@GeneratedValue(strategy = UUID)`), `name` (varchar 150), `description` (text), `price` (BigDecimal, `precision = 12, scale = 2`), `brand` (varchar 80, default "Luna"), `gender` (varchar 20), `imageUrl` (varchar 1000), `active` (boolean, default true), `createdAt`, `updatedAt`
  - `@ManyToOne(fetch = LAZY)` → `Category category`
  - `@OneToMany(mappedBy = "product", cascade = ALL, orphanRemoval = true)` → `List<ProductVariant> variants`
  - Factory method: `Product.create(...)` (no public no-arg constructor leak)
  - Update method: `product.update(name, description, price, ...)`
  - Deactivation method: `product.deactivate()`
- [x] Create `repository/ProductRepository.java`
  - Extends `JpaRepository<Product, UUID>`, `JpaSpecificationExecutor<Product>`
  - Method: `findByIdWithDetails(@Param("id") UUID id)`
- **Verify**: `mvn compile -pl product-service` succeeds with 9 source files compiled (PASSED)

### Task 1.4: Create ProductVariant Entity
- [x] Create `entity/ProductVariant.java`
  - `@Entity @Table(name = "product_variants")`
  - Fields: `id` (UUID), `size` (varchar 20), `color` (varchar 40), `sku` (varchar 80, unique), `stockQuantity` (int, default 0), `createdAt`, `updatedAt`
  - `@ManyToOne(fetch = LAZY)` → `Product product`
- [x] Create `repository/ProductVariantRepository.java`
  - Extends `JpaRepository<ProductVariant, UUID>`
  - Custom `@Query` for atomic stock decrement (`decrementStock`) and increment (`addStock`)
  - Method: `List<ProductVariant> findByProductId(UUID productId)`
- **Verify**: `mvn compile -pl product-service` succeeds with atomic query verified (PASSED)

### Task 1.5: Create All DTOs (Java Records)
- [x] `dto/ProductRequest.java` — validated request for create/update
  - `@NotBlank name`, `@Size(max=2000) description`, `@NotNull @DecimalMin("0.01") price`, `@NotBlank categorySlug`, `@NotNull Gender gender`, `brand`, `imageUrl`, `@Valid variants`
- [x] `dto/ProductResponse.java` — list/card view
  - `id`, `name`, `description`, `price`, `brand`, `gender`, `category` (nested `CategoryResponse`), `imageUrl`, `active`, `availableSizes`, `availableColors`, `totalStock`, `createdAt`, `updatedAt`
- [x] `dto/ProductDetailResponse.java` — full detail with variants
  - All fields from `ProductResponse` + `List<VariantResponse> variants`
- [x] `dto/VariantRequest.java` — `@NotBlank size`, `@NotBlank color`, `@NotBlank sku`, `@Min(0) stockQuantity`
- [x] `dto/VariantResponse.java` — `id`, `size`, `color`, `sku`, `stockQuantity`
- [x] `dto/StockAdjustmentRequest.java` — `@Min(1) quantity`, `@NotBlank adjustmentType` ("INCREMENT" or "DECREMENT")
- **Verify**: All records compile cleanly with `mvn compile` (15 source files compiled, PASSED)

### Task 1.6: Create Service Layer (Business Logic & In-Service Entity Mapping)
- [x] `service/CategoryService.java`
  - In-service mapping: `toCategoryResponse(Category c)`
  - `list()` → return `List<CategoryResponse>`
  - `getBySlug(String slug)` → return `CategoryResponse`
- [x] `service/ProductService.java`
  - In-service mapping: `toProductResponse(Product p)`, `toProductDetailResponse(Product p)` (aggregating sizes, colors, total stock)
  - `create(ProductRequest)` → look up Category by slug, create Product with variants, save, return `ProductResponse`
  - `list(search, category, gender, minPrice, maxPrice, page, size, sort)` → build JPA `Specification<Product>`, apply pagination, return `Page<ProductResponse>`
  - `getById(UUID id)` → find active product, return `ProductDetailResponse` (with variants)
  - `update(UUID id, ProductRequest)` → find active, update fields, save
  - `deactivate(UUID id)` → soft-delete (set `active = false`)
- [x] `service/VariantService.java`
  - In-service mapping: `toVariantResponse(ProductVariant v)`, `toVariantEntity(VariantRequest r, Product p)`
  - `addVariant(UUID productId, VariantRequest)` → create variant linked to product
  - `listVariants(UUID productId)` → return `List<VariantResponse>`
  - `getVariant(UUID variantId)` → return `VariantResponse`
  - `adjustStock(UUID variantId, StockAdjustmentRequest)` → atomic increment or decrement
- [x] Exceptions:
  - `exception/ProductNotFoundException.java`
  - `exception/VariantNotFoundException.java`
  - `exception/InsufficientStockException.java`
  - `exception/CategoryNotFoundException.java`
- [x] Specifications: `repository/ProductSpecifications.java`
- **Verify**: `mvn compile -pl product-service` succeeds (23 source files compiled, PASSED)

### Task 1.7: Create REST Controllers
- [x] `controller/ProductController.java` — `@RequestMapping("/api/products")`
  - `GET /` → `list(...)` with `@RequestParam` filters & pagination
  - `GET /{id}` → `getById(UUID)`
  - `POST /` → `create(@Valid @RequestBody ProductRequest)` → 201
  - `PUT /{id}` → `update(UUID, @Valid @RequestBody ProductRequest)`
  - `DELETE /{id}` → `deactivate(UUID)` → 204
  - `GET /{id}/variants` → `listVariants(UUID)`
  - `POST /{id}/variants` → `addVariant(UUID, @Valid @RequestBody VariantRequest)` → 201
  - `GET /variants/{variantId}` → `getVariant(UUID)`
  - `PATCH /variants/{variantId}/stock` → `adjustStock(UUID, @Valid @RequestBody StockAdjustmentRequest)`
- [x] `controller/CategoryController.java` — `@RequestMapping("/api/categories")`
  - `GET /` → `list()`
  - `GET /{slug}` → `getBySlug(String)`
- **Verify**: `mvn compile -pl product-service` succeeds with 25 source files compiled (PASSED)

### Task 1.8: Create Global Exception Handler
- [x] `exception/GlobalExceptionHandler.java` — `@RestControllerAdvice`
  - Handle `ProductNotFoundException` → 404 `ProblemDetail`
  - Handle `VariantNotFoundException` → 404 `ProblemDetail`
  - Handle `CategoryNotFoundException` → 404 `ProblemDetail`
  - Handle `InsufficientStockException` → 409 Conflict `ProblemDetail`
  - Handle `MethodArgumentNotValidException` → 400 with field errors map
  - Handle `IllegalArgumentException` → 400 `ProblemDetail`
- **Verify**: `mvn compile -pl product-service` succeeds with 26 source files compiled (PASSED)

### Task 1.9: Seed Dummy Data via SQL DML Script
- [ ] Execute SQL DML script: `Luna-platform/db/dmls/1. products-seed.sql` in pgAdmin / psql
  - Seeds 5 categories: Evening Dresses, Cocktail & Party, Casual Summer Dresses, Maxi & Midi Dresses, Work & Formal
  - Seeds 8 products across categories with realistic dress descriptions, prices, brand, gender
  - Seeds 26 size/color variants with unique SKUs and stock inventory
- **Verify**:
  - `mvn spring-boot:run -pl product-service` starts cleanly
  - `GET http://localhost:8082/api/products` returns paginated seeded dresses
  - `GET http://localhost:8082/api/products?search=silk&gender=WOMEN` filters correctly
  - `GET http://localhost:8082/api/categories` returns all 5 categories
  - `GET http://localhost:8082/actuator/health` returns `{"status":"UP"}`

---

## Phase 2 — User Service (Port 8081)

### Task 2.1: Create PostgreSQL Database
- [x] Execute: `CREATE DATABASE luna_users;`
- [x] Configure `user-service/src/main/resources/application.properties` for port 8081, `luna_users`
- [x] Write DDL: `Luna-platform/db/ddls/2. users.sql`
- **Verify**: Service starts, tables auto-created

### Task 2.2: Create User & Address Entities
- [x] `entity/User.java` — id (UUID), name, email (unique), passwordHash, role (enum: CUSTOMER, ADMIN), phone, timestamps
- [x] `entity/Address.java` — id (UUID), user (ManyToOne), line1, line2, city, state, postalCode, country, isDefault
- [x] `repository/UserRepository.java` — `findByEmail(String email)`, `existsByEmail(String email)`
- [x] `repository/AddressRepository.java` — `findByUserId(UUID userId)`
- **Verify**: `users` and `addresses` tables created in `luna_users`

### Task 2.3: Create Auth DTOs
- [x] `dto/RegisterRequest.java` — `@NotBlank name`, `@Email email`, `@Size(min=8) password`, `phone`
- [x] `dto/LoginRequest.java` — `@Email email`, `@NotBlank password`
- [x] `dto/AuthResponse.java` — `token`, `tokenType` ("Bearer"), `expiresIn`, `user` (nested UserResponse)
- [x] `dto/UserResponse.java` — `id`, `name`, `email`, `role`, `phone`, `createdAt`
- [x] `dto/AddressRequest.java`, `dto/AddressResponse.java`
- **Verify**: Records compile

### Task 2.4: JWT Token Provider
- [x] `security/JwtTokenProvider.java`
  - `generateToken(User user)` → signed JWT with `sub` (userId), `email`, `role`, `exp` (24h)
  - `validateToken(String token)` → boolean
  - `getUserIdFromToken(String token)` → UUID
  - Secret key from `${JWT_SECRET}` environment variable
- **Verify**: Unit test generates and validates a token

### Task 2.5: Spring Security Configuration
- [x] `security/JwtAuthenticationFilter.java` — `OncePerRequestFilter` extracting Bearer token, validating, setting `SecurityContextHolder`
- [x] `config/SecurityConfig.java` — `SecurityFilterChain` bean
  - Permit: `POST /api/auth/**`
  - Authenticate: `GET/PUT /api/account/**`, `GET /api/users/**`
  - Stateless session, CSRF disabled, register JWT filter before `UsernamePasswordAuthenticationFilter`
- **Verify**: Unauthenticated `GET /api/account` returns 401

### Task 2.6: Auth & User Service + Controllers
- [x] `service/AuthService.java` — `register(RegisterRequest)`, `login(LoginRequest)`, BCrypt encoding, duplicate email check
- [x] `service/UserService.java` — `getProfile(UUID userId)`, `updateProfile(UUID, UpdateProfileRequest)`, `listAddresses(UUID)`, `addAddress(UUID, AddressRequest)`
- [x] `controller/AuthController.java` — `POST /api/auth/register` (201), `POST /api/auth/login` (200)
- [x] `controller/AccountController.java` — `GET /api/account`, `PUT /api/account`, `GET /api/account/addresses`, `POST /api/account/addresses`, `DELETE /api/account/addresses/{id}`
- [x] `controller/UserController.java` — `GET /api/users/{id}`
- **Verify**: Register → Login → use JWT to access `/api/account`

### Task 2.7: Write API Specs
- [x] Write specs in `Luna-api-spec/user-service/`:
  - `register-customer.md`, `login-authenticate.md`, `get-account-profile.md`, `update-account-profile.md`, `list-saved-addresses.md`, `add-delivery-address.md`, `delete-delivery-address.md`
- **Verify**: All specs follow the standard template from `Luna-rule/1. project-standards.md`

---

## Phase 3 — Luna API Gateway (Port 8080)

### Task 3.1: Gateway Application & Route Configuration
- [x] Create `LunaGatewayApplication.java`
- [x] Configure `application.properties` with route definitions:
  - `/api/auth/**`, `/api/account/**`, `/api/users/**` → `http://localhost:8081`
  - `/api/products/**`, `/api/categories/**` → `http://localhost:8082`
  - `/api/orders/**`, `/api/admin/orders/**` → `http://localhost:8083`
- **Verify**: Gateway starts on port 8080

### Task 3.2: CORS Configuration
- [x] Configure global CORS in `application.properties`:
  - Allowed origins: `http://localhost:5173`, `http://localhost:3000`
  - Allowed methods: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
  - Allowed headers: `*`
  - Allow credentials: `true`
- **Verify**: Preflight OPTIONS requests return correct CORS headers

### Task 3.3: JWT Authentication Gateway Filter
- [x] Create `filter/JwtAuthGatewayFilter.java`
  - Validate JWT signature on protected routes
  - Inject downstream headers: `X-User-Id`, `X-User-Email`, `X-User-Role`
  - Skip validation for public routes (`/api/auth/**`, `GET /api/products/**`, `GET /api/categories/**`)
- **Verify**: Authenticated request through gateway reaches downstream service with correct headers

### Task 3.4: End-to-End Gateway Routing Verification
- [ ] Start all services + gateway
- [ ] Test through gateway:
  - `GET http://localhost:8080/api/products` → forwarded to 8082
  - `POST http://localhost:8080/api/auth/register` → forwarded to 8081
  - Authenticated `GET http://localhost:8080/api/account` → forwarded to 8081 with user headers
- **Verify**: All routes work through single gateway entry point

---

## Phase 4 — Order Service (Port 8083)

### Task 4.1: Create PostgreSQL Database & DDL
- [x] Execute: `CREATE DATABASE luna_orders;`
- [x] Configure `order-service/src/main/resources/application.properties` for port 8083, `luna_orders`
- [x] Write DDL: `Luna-platform/db/ddls/3. orders.sql`
- **Verify**: Service starts, tables auto-created

### Task 4.2: Create Order & OrderItem Entities
- [x] `entity/Order.java` — id (UUID), userId (UUID), status (enum: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED), subtotal, shippingFee, totalAmount (`numeric(12,2)`), shippingAddressLine, recipientName, recipientPhone, timestamps
- [x] `entity/OrderItem.java` — id (UUID), order (ManyToOne), productId (UUID), variantId (UUID), productName (snapshot), size (snapshot), color (snapshot), unitPrice (snapshot BigDecimal), quantity, lineTotal
- [x] Repositories for both
- **Verify**: Tables created in `luna_orders`

### Task 4.3: OpenFeign Client to Product Service
- [x] Enable Feign: `@EnableFeignClients` on main application class
- [x] `client/ProductServiceClient.java` — `@FeignClient(name = "product-service", url = "${services.product-service.url:http://localhost:8082}")`
  - `@GetMapping("/api/products/variants/{variantId}")` → `VariantDetailResponse`
  - `@PatchMapping("/api/products/variants/{variantId}/stock")` → stock adjustment
- [x] `client/dto/VariantDetailResponse.java` — product name, price, size, color, stock
- [x] `client/ProductServiceErrorDecoder.java` — error decoder for 404/409/500
- **Verify**: Feign client compiles and can call Product Service

### Task 4.4: Order DTOs
- [x] `dto/PlaceOrderRequest.java` — `List<OrderItemRequest> items`, `shippingAddressLine`, `recipientName`, `recipientPhone`
- [x] `dto/OrderItemRequest.java` — `variantId` (UUID), `quantity` (int)
- [x] `dto/OrderResponse.java` — full order with nested item snapshots
- [x] `dto/OrderItemResponse.java` — snapshot fields
- [x] `dto/UpdateStatusRequest.java` — `status` (string)
- **Verify**: Records compile

### Task 4.5: Order Service Business Logic
- [x] `service/OrderService.java`
  - `placeOrder(UUID userId, PlaceOrderRequest)`:
    1. For each item: call Product Service to get variant details (price, name, stock)
    2. Validate stock availability
    3. Call Product Service to decrement stock atomically
    4. Build `Order` + `OrderItem` entities with snapshot prices
    5. Calculate subtotal, shipping fee, total
    6. Save and return `OrderResponse`
  - `listMyOrders(UUID userId)` → paginated `Page<OrderResponse>`
  - `getOrderById(UUID orderId, UUID userId)` → single `OrderResponse` (verify ownership)
  - `cancelOrder(UUID orderId, UUID userId)` → set status to CANCELLED if eligible, replenish stock via Product Service
  - `adminListOrders(page, size)` → all orders
  - `adminUpdateStatus(UUID orderId, UpdateStatusRequest)` → advance status
- **Verify**: Service methods compile

### Task 4.6: Order REST Controllers
- [x] `controller/OrderController.java` — `@RequestMapping("/api/orders")`
  - `POST /` → `placeOrder` (userId from `X-User-Id` header) → 201
  - `GET /` → `listMyOrders` (userId from header)
  - `GET /{id}` → `getOrderById`
  - `PATCH /{id}/cancel` → `cancelOrder`
- [x] `controller/AdminOrderController.java` — `@RequestMapping("/api/admin/orders")`
  - `GET /` → `adminListOrders`
  - `PATCH /{id}/status` → `adminUpdateStatus`
- **Verify**: Controllers compile and endpoints visible

### Task 4.7: Integration Test — Full Order Flow
- [x] Start Product Service (seeded), User Service, Gateway, and Order Service
- [x] Test complete flow through Gateway:
  1. `POST /api/auth/register` → create customer (Verified with Elena Rostova)
  2. `POST /api/auth/login` → get JWT (Verified)
  3. `GET /api/products` → browse catalog (Verified 9 luxury dresses)
  4. `POST /api/orders` with JWT → place order with dress items (Verified 201 Created)
  5. Verify stock decremented in Product Service (Verified atomic PATCH Feign decrement)
  6. `GET /api/orders` → see order in history (Verified 200 OK)
  7. `PATCH /api/orders/{id}/cancel` → cancel and verify stock restored (Verified 200 OK)
- [x] Write API specs in `Luna-api-spec/order-service/`
- [x] **Verify**: Full end-to-end order lifecycle works through Gateway

---

## Phase 5 — Luna Storefront (React + Vite + Tailwind CSS)

### Task 5.1: Initialize React Project
- [x] `npx -y create-vite@latest frontend -- --template react`
- [x] Install dependencies: `react-router-dom`, `axios`, `lucide-react`
- [x] Install and configure Tailwind CSS
- [x] Configure Vite proxy to forward `/api` to `http://localhost:8080`
- [x] Create `src/services/api.js` — Axios instance with base URL and JWT interceptor
- [x] **Verify**: `npm run build` succeeds (150kB bundle), Tailwind luxury styling configured

### Task 5.2: Design System & Layout Components
- [x] Define Luna brand color palette in Tailwind config (warm neutrals, gold accents, slate, pearl)
- [x] Import Google Fonts (Outfit / Cormorant Garamond)
- [x] Create `src/layouts/CustomerLayout.jsx` — Navbar + Footer + Outlet
- [x] Create `src/components/Navbar.jsx` — Luna logo, navigation links (Women, Men, All), search, cart badge, user dropdown
- [x] Create `src/components/Footer.jsx`
- [x] **Verify**: Layout renders with navigation and brand styling (Verified with build passing)

### Task 5.3: Home Page
- [x] `src/pages/Home.jsx`
  - Hero banner section ("Luna Atelier — Timeless Elegance")
  - Category tiles grid linking to filtered catalog
  - Featured products carousel / grid
  - Craftsmanship narrative & Vogue review accolades
- [x] `src/components/ProductCard.jsx` — reusable luxury card with quick add
- [x] **Verify**: Home page renders with categories and featured dresses (Build verified)

### Task 5.4: Product Catalog Page
- [x] `src/pages/Products.jsx`
  - Fetch `GET /api/products` with query params
  - Filter sidebar: category pills, gender radio, size pills, price range
  - Search bar with debounced input & active filter pills
  - Product grid with `ProductCard` components
  - Pagination controls
- [x] `src/components/ProductCard.jsx` — image, name, price, category chip, hover effects
- [x] `src/components/ProductFilters.jsx` — filter controls (desktop sidebar & mobile drawer)
- [x] **Verify**: Catalog loads real data from Product Service, filters work (Build verified)

### Task 5.5: Product Detail Page
- [x] `src/pages/ProductDetails.jsx`
  - Fetch `GET /api/products/{id}` (with variants)
  - Product image display with editorial zoom
  - Size selector (pills/swatches)
  - Color selector (swatches)
  - Stock indicator ("In Stock", "Only 3 left!", "Sold Out")
  - Quantity selector stepper
  - "Add to Shopping Bag" button with micro-animation and slide-over drawer toggle
- [x] **Verify**: Detail page renders with real variant data, size/color selection works (Build verified)

### Task 5.6: Shopping Cart & Checkout
- [x] `src/hooks/useCart.js` — React hook re-exporting cart context methods
- [x] `src/components/CartDrawer.jsx` — slide-over cart panel with free shipping bar
- [x] `src/pages/Cart.jsx` — full cart page with item list, quantities, promo code, subtotal
- [x] `src/pages/Checkout.jsx` — address form with user-service autofill, order summary, "Place Order" calling `POST /api/orders`
- [x] `src/pages/OrderConfirmation.jsx` — success page with order reference UUID and item snapshots
- [x] **Verify**: Full cart → checkout → order placement flow works (Build verified)

### Task 5.7: Authentication Pages
- [x] `src/pages/Login.jsx` — email/password form, calls `POST /api/auth/login`, stores JWT, demo autofill
- [x] `src/pages/Register.jsx` — registration form, calls `POST /api/auth/register`, auto-login
- [x] `src/hooks/useAuth.js` — auth context (login, logout, current user, token management)
- [x] `src/components/ProtectedRoute.jsx` — redirect to login if unauthenticated with return URL preservation
- [x] **Verify**: Register → Login → JWT stored → protected routes accessible (Build verified)

### Task 5.8: Customer Order History
- [x] `src/pages/MyOrders.jsx` — fetch `GET /api/orders`, display order list
  - Order cards with status badge, date, total, item count
  - Expandable order detail with item snapshots
  - "Cancel Order" button for eligible orders (live stock replenishment)
- [x] **Verify**: Order history loads, cancel works, status badges render (Build verified)

---

## Phase 6 — Luna Admin Dashboard

### Task 6.1: Admin Layout & Routing
- [x] `src/layouts/AdminLayout.jsx` — sidebar navigation (Products, Orders, Dashboard)
- [x] `src/components/AdminProtectedRoute.jsx` — check role === "ADMIN"
- [x] Configure React Router with admin routes under `/admin/*`
- [x] **Verify**: Admin layout renders, non-admin users redirected (Build verified)

### Task 6.2: Admin Product Management
- [x] `src/pages/admin/Products.jsx`
  - Product table with search, category filter, active/inactive toggle
  - "Add Product" button opening create modal
  - Edit/deactivate actions per row
  - Create/edit product form modal (name, description, price, brand, gender, category, image URL)
- [x] **Verify**: Admin can create, edit, and deactivate products (Build verified)

### Task 6.3: Admin Variant & Inventory Management
- [x] Variant management modal within product detail (`src/pages/admin/Products.jsx`)
  - List existing variants (size, color, SKU, stock)
  - "Add Variant" form
  - Inline stock adjustment (increment/decrement calling `PATCH /api/products/variants/{variantId}/stock`)
- [x] **Verify**: Admin can add variants and adjust stock quantities (Build verified)

### Task 6.4: Admin Order Management
- [x] `src/pages/admin/Orders.jsx`
  - Order list table with customer name, total, date, status
  - Status update dropdown: PENDING → CONFIRMED → SHIPPED → DELIVERED (`PATCH /api/admin/orders/{id}/status`)
  - Cancel action & expandable item snapshots
- [x] **Verify**: Admin can view all orders and update statuses (Build verified)

### Task 6.5: Admin Dashboard Overview
- [x] `src/pages/admin/Dashboard.jsx`
  - Summary cards: Total Products, Low Stock Alerts, Pending Orders, Total Revenue
  - Recent orders list & Low Stock Watchlist widget
- [x] **Verify**: Dashboard renders with aggregated data (Build verified)

---

## Phase 7 — Docker Compose & Testing

### Task 7.1: Create Dockerfiles
- [x] `product-service/Dockerfile` — multi-stage build (Maven build → JRE 21 runtime)
- [x] `user-service/Dockerfile` — same pattern
- [x] `order-service/Dockerfile` — same pattern
- [x] `luna-gateway/Dockerfile` — same pattern
- [x] `frontend/Dockerfile` — Node build → Nginx serve
- [x] `frontend/nginx.conf` — SPA routing and API reverse proxy
- [x] **Verify**: Each Dockerfile configured and verified

### Task 7.2: Create Docker Compose
- [x] `docker-compose.yml` with services:
  - `postgres-products` (luna_products DB with auto-applied DDL & seed DML)
  - `postgres-users` (luna_users DB with auto-applied DDL)
  - `postgres-orders` (luna_orders DB with auto-applied DDL)
  - `product-service` (port 8082, depends on postgres-products)
  - `user-service` (port 8081, depends on postgres-users)
  - `order-service` (port 8083, depends on postgres-orders)
  - `luna-gateway` (port 8080, depends on all services)
  - `frontend` (port 5173/80, depends on gateway)
- [x] Create `.env.example` with all required environment variables
- [x] Add healthcheck configurations for all services
- [x] **Verify**: `docker compose config` validates schema with 0 warnings

### Task 7.3: Write Tests
- [ ] Product Service unit tests:
  - `ProductServiceTest.java` — test CRUD, filtering, validation, deactivation
  - `ProductControllerTest.java` — `@WebMvcTest` for endpoint testing
- [ ] User Service tests:
  - `AuthServiceTest.java` — registration, login, duplicate email, BCrypt
- [ ] Order Service tests:
  - `OrderServiceTest.java` — order placement, stock validation, cancellation
- **Verify**: `mvn test` passes for all modules

### Task 7.4: Documentation & README
- [x] Create root `README.md`:
  - Project description, architecture diagram, tech stack
  - Prerequisites (Java 21, PostgreSQL, Node.js, Docker)
  - Local development setup instructions
  - Docker Compose quickstart
  - API documentation links (Swagger UI per service)
  - Project structure overview
- [x] Verify all API specs in `Luna-api-spec/` are complete (24/24 specs verified)
- [x] Verify all DDLs in `Luna-platform/db/ddls/` are complete (3 DDLs & 2 DML seed scripts verified)
- [x] **Verify**: A new developer can clone and run the project following the README

---

## Immediate Next Action

> **Start with Phase 0 → Task 0.1**: Create the root Maven parent POM, then scaffold the Product Service module (Task 0.2), and proceed through Phase 1 tasks sequentially.
