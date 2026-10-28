# Product Service - Adjust Variant Stock

Atomically increments or decrements inventory stock for a specific size/color variant. Utilized during order reservation, order cancellation, and warehouse restocking.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| PATCH | `/api/products/variants/{variantId}/stock` | Yes | `ORDER_SERVICE` / `ADMIN` | No |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Safely modifies inventory under high-concurrency environments (e.g. flash sales).
- Uses **atomic conditional SQL** execution (`UPDATE ... WHERE stock_quantity >= :qty`) to eliminate race conditions and prevent negative stock balances.
- Supported operations:
  - `DECREMENT`: Reduces stock by the specified quantity. Returns `409 Conflict` if available stock is insufficient.
  - `INCREMENT`: Increases stock by the specified quantity (e.g. on order cancellation, returns, or restocking).
- Returns the updated variant representation.

---

## 3. Request

### 3.1 Path Parameters
| Name | Required | Type | Description |
|:---- |:-------- |:---- |:----------- |
| variantId | Yes | UUID | Unique identifier of the product variant. |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Content-Type | Yes | Request payload media type | `application/json` |
| Authorization | Yes | Bearer Token | `Bearer eyJhbGciOi...` |

### 3.4 Body
```json
{
  "quantity": 2,
  "adjustmentType": "DECREMENT"
}
```

---

## 4. Response

### 4.1 Success - 200 OK
```json
{
  "id": "b0000001-0000-0000-0000-000000000001",
  "size": "XS",
  "color": "Emerald Green",
  "sku": "LUNA-AUR-GRN-XS",
  "stockQuantity": 10
}
```

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 400 Bad Request | Validation Error | `adjustmentType`: Adjustment type must be either INCREMENT or DECREMENT |
| 400 Bad Request | Validation Error | `quantity`: Adjustment quantity must be at least 1 |
| 404 Not Found | Variant Not Found | Product variant not found with ID: b0000001-0000-0000-0000-000000000099 |
| 409 Conflict | Insufficient Stock | Insufficient stock for variant ID b0000001-0000-0000-0000-000000000001. Requested: 2, Available: 0 |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
