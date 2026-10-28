# Order Service - Place Order

Validates cart items against Product Service stock, atomically decrements inventory via OpenFeign, creates immutable product and price snapshots, calculates shipping totals, and stores the order in `luna_orders`.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| POST | `/api/orders` | Yes | `CUSTOMER`, `ADMIN` | No |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8083` (direct Order Service)

---

## 2. Summary

- Accepts order items (variant UUID and quantity), delivery address, and recipient contact information.
- Authenticated user ID is extracted securely from the `X-User-Id` gateway header.
- Queries `product-service` via OpenFeign to verify dress variant existence, current price, and available stock.
- Atomically decrements variant inventory using conditional SQL (`stock_quantity >= :qty`). If any item fails, previously decremented items are compensated/restored.
- Calculates subtotal and shipping fees (orders $\ge \$150.00$ qualify for free standard shipping; otherwise $\$15.00$).
- Stores immutable snapshots of dress name, size, color, and unit price in `order_items` table.
- Returns `201 Created` with the complete order representation.

---

## 3. Request

### 3.1 Path Parameters
NIL

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Content-Type | Yes | Payload media type | `application/json` |
| Authorization | Yes | Customer Bearer JWT Token | `Bearer eyJhbGciOiJIUzI1NiJ9...` |
| X-User-Id | Yes | Injected automatically by Gateway | `b2c8df34-f4ca-4149-ada4-dcda35e71dca` |

### 3.4 Body
```json
{
  "items": [
    {
      "variantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "quantity": 1
    },
    {
      "variantId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "quantity": 2
    }
  ],
  "shippingAddressLine": "742 Evergreen Terrace, Apt 4B, Springfield, IL 62704, US",
  "recipientName": "Elena Rostova",
  "recipientPhone": "+1-555-0199"
}
```

#### Field Specifications:
- `items` (array, required): Non-empty array of items to purchase.
  - `variantId` (UUID, required): Clothing variant UUID.
  - `quantity` (integer, required): Quantity to purchase ($\ge 1$).
- `shippingAddressLine` (string, required): Full formatted delivery address (max 500 characters).
- `recipientName` (string, required): Full name of delivery recipient (max 100 characters).
- `recipientPhone` (string, optional): Contact telephone number (max 30 characters).

---

## 4. Response

### 4.1 Success Response: `201 Created`
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "userId": "b2c8df34-f4ca-4149-ada4-dcda35e71dca",
  "status": "PENDING",
  "subtotal": 390.00,
  "shippingFee": 0.00,
  "totalAmount": 390.00,
  "shippingAddressLine": "742 Evergreen Terrace, Apt 4B, Springfield, IL 62704, US",
  "recipientName": "Elena Rostova",
  "recipientPhone": "+1-555-0199",
  "items": [
    {
      "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
      "productId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "variantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "productName": "Elysian Backless Silk Midi",
      "size": "M",
      "color": "Midnight Black",
      "unitPrice": 210.00,
      "quantity": 1,
      "lineTotal": 210.00
    },
    {
      "id": "e5f6a7b8-c9d0-1234-ef12-345678901234",
      "productId": "7c2deb4d-2a6c-4cad-8add-1b0d7b3dcb5c",
      "variantId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "productName": "Aura Linen Tiered Sundress",
      "size": "S",
      "color": "Terracotta",
      "unitPrice": 90.00,
      "quantity": 2,
      "lineTotal": 180.00
    }
  ],
  "createdAt": "2026-10-26T22:40:00Z",
  "updatedAt": "2026-10-26T22:40:00Z"
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **400 Bad Request** | Missing items, quantity < 1, or blank recipient address | `{"type":"https://luna.com/errors/validation-failed","title":"Validation Error","status":400,"errors":{"items":"Order must contain at least one item"}}` |
| **401 Unauthorized** | Missing or invalid authentication token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **404 Not Found** | Variant UUID does not exist in catalog | `{"type":"https://luna.com/errors/variant-not-found","title":"Variant Not Found","status":404,"detail":"Product variant not found with id: a1b2c3d4-e5f6-7890-abcd-ef1234567890"}` |
| **409 Conflict** | Insufficient stock in inventory | `{"type":"https://luna.com/errors/insufficient-stock","title":"Insufficient Stock","status":409,"detail":"Insufficient stock for dress variant a1b2c3d4... (requested: 5)"}` |
| **503 Unavailable** | Product Service unreachable via OpenFeign | `{"type":"https://luna.com/errors/product-service-unavailable","title":"Product Service Unavailable","status":503,"detail":"Product Service is currently unavailable"}` |
