# Product Service - Deactivate Product

Soft-deletes a product from the active catalog by setting its `active` flag to `false`.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| DELETE | `/api/products/{id}` | Yes | `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Performs a **soft-delete** of the product (`active = false`).
- Hard deletions (`DELETE FROM products`) are strictly prohibited to preserve historical referential integrity for past customer orders and financial snapshots.
- Once deactivated, the product will no longer appear in storefront search, catalog listings, or category views.
- Returns `204 No Content` upon successful deactivation.

---

## 3. Request

### 3.1 Path Parameters
| Name | Required | Type | Description |
|:---- |:-------- |:---- |:----------- |
| id | Yes | UUID | Unique identifier of the product to deactivate. |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Authorization | Yes | Admin Bearer JWT Token | `Bearer eyJhbGciOi...` |

### 3.4 Body
NIL

---

## 4. Response

### 4.1 Success - 204 No Content
*No content body returned.*

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 400 Bad Request | Invalid Argument | Failed to convert value of type 'java.lang.String' to required type 'java.util.UUID' |
| 404 Not Found | Product Not Found | Product not found with ID: a0000001-0000-0000-0000-000000000099 |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
