# Luna Project Guidelines (Automatic Antigravity Rulebook)

This workspace contains the **Luna — Dress Shop E-commerce Microservices** project.
Always follow the mandatory standards defined in [1. project-standards.md](file:///Users/sanjaya/Documents/DressShoppingWebsite/Luna-rule/1.%20project-standards.md):

## 1. Directory Structure Conventions
- **`Luna-plan/`**: Architecture blueprints, data flows, and roadmap documents.
- **`Luna-api-spec/`**: Markdown API specs categorized by service subfolder (e.g. `product-service/`).
- **`Luna-platform/`**: Database design, DDLs, and DML seed scripts (`db/ddls/`, `db/dmls/`).
- **`Luna-rule/`**: Project standards and engineering guidelines.
- **Microservices**: `luna-gateway/`, `product-service/`, `user-service/`, `order-service/`, and `frontend/`.

## 2. DDL Rules (Strict Constraint & Index Grouping)
Whenever writing DDLs in `Luna-platform/db/ddls/`:
1. Define the table with core columns, explicit data types, UUID/bigserial IDs, and timestamps.
2. Group **all constraints** (`fk_...`, `unique_...`, `chk_...`) immediately after the table definition using `ALTER TABLE`.
3. Group **all indexes** (`idx_...`) immediately after the constraints block.
4. Monetary values must use `numeric(12, 2)`.

## 3. API Specification Rules
Whenever writing API specs in `Luna-api-spec/`:
1. Strict Markdown format: `# [Domain] - [Action]`.
2. Sections: `1. Endpoint` (table + base URL), `2. Summary`, `3. Request` (Path params, Query params, Headers, Body), `4. Response` (4.1 Success code + JSON + Notes, 4.2 Error Responses table).

## 4. Architecture & Engineering Rules
1. **Strict Database Isolation**: `luna_products`, `luna_users`, `luna_orders`. Never join or query another service's database directly.
2. **OpenFeign for Inter-Service REST**: Synchronous calls between services.
3. **Price & Product Snapshots**: Order items must store snapshot copies of name, price, size, and color.
4. **Atomic Concurrency**: Decrement inventory using atomic conditional SQL (`WHERE stock_quantity >= :qty`).
5. **Java 21 & Spring Boot 3**: Use Java Records for DTOs, never expose JPA entities in REST controllers.
