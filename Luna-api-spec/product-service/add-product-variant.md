# Product Service - Add Product Variant

Creates a new size, color, and SKU inventory variant for an existing product.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| POST | `/api/products/{id}/variants` | Yes | `ADMIN` | No |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Attaches a new size/color variant to an existing active product.
- Enforces globally unique SKUs.
- Enforces non-negative initial inventory quantity.
- Returns `201 Created` with the created variant details.

---

## 3. Request

### 3.1 Path Parameters
| Name | Required | Type | Description |
|:---- |:-------- |:---- |:----------- |
| id | Yes | UUID | Unique identifier of the parent product. |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Content-Type | Yes | Request payload media type | `application/json` |
| Authorization | Yes | Admin Bearer JWT Token | `Bearer eyJhbGciOi...` |

### 3.4 Body
```json
{
  "size": "L",
  "color": "Emerald Green",
  "sku": "LUNA-AUR-GRN-L",
  "stockQuantity": 15
}
```

---

## 4. Response

### 4.1 Success - 201 Created
```json
{
  "id": "b0000001-0000-0000-0000-000000000009",
  "size": "L",
  "color": "Emerald Green",
  "sku": "LUNA-AUR-GRN-L",
  "stockQuantity": 15
}
```

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 400 Bad Request | Validation Error | `sku`: SKU is required |
| 400 Bad Request | Validation Error | `stockQuantity`: Stock quantity cannot be negative |
| 404 Not Found | Product Not Found | Product not found with ID: a0000001-0000-0000-0000-000000000099 |
| 409 Conflict | SKU Conflict | Duplicate SKU key value violates unique constraint 'unique_variants_sku' |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
