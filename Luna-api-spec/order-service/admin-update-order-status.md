# Order Service - Admin Update Order Status

Advances the fulfillment status of an existing order or executes an administrative order cancellation.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| PATCH | `/api/admin/orders/{id}/status` | Yes | `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8083` (direct Order Service)

---

## 2. Summary

- Allows store administrators to update the lifecycle progress of an order (`CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- Enforces state safety: orders already in terminal status (`DELIVERED` or `CANCELLED`) cannot be modified further.
- If the administrator transitions an order to `CANCELLED`, inventory stock for all variant items is automatically replenished back into `product-service` via OpenFeign.
- Returns `200 OK` with the refreshed order representation.

---

## 3. Request

### 3.1 Path Parameters
| Name | Type | Required | Description | Example |
|:---- |:---- |:-------- |:----------- |:------- |
| `id` | UUID | Yes | Unique identifier of the order to update | `c3d4e5f6-a7b8-9012-cdef-123456789012` |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Content-Type | Yes | Payload media type | `application/json` |
| Authorization | Yes | Administrator Bearer JWT Token | `Bearer eyJhbGciOiJIUzI1NiJ9...` |

### 3.4 Body
```json
{
  "status": "SHIPPED"
}
```

#### Field Specifications:
- `status` (string, required): Target status. Valid values: `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

---

## 4. Response

### 4.1 Success Response: `200 OK`
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "userId": "b2c8df34-f4ca-4149-ada4-dcda35e71dca",
  "status": "SHIPPED",
  "subtotal": 210.00,
  "shippingFee": 0.00,
  "totalAmount": 210.00,
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
    }
  ],
  "createdAt": "2026-10-26T22:40:00Z",
  "updatedAt": "2026-10-26T22:45:00Z"
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **400 Bad Request** | Missing or invalid status value | `{"type":"https://luna.com/errors/validation-failed","title":"Validation Error","status":400,"errors":{"status":"Order status is required"}}` |
| **401 Unauthorized** | Missing or invalid Bearer token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **403 Forbidden** | User does not possess `ADMIN` role | `{"type":"https://luna.com/errors/forbidden","title":"Forbidden","status":403,"detail":"Access denied: Administrator privileges required"}` |
| **404 Not Found** | Order UUID does not exist | `{"type":"https://luna.com/errors/order-not-found","title":"Order Not Found","status":404,"detail":"Order not found with id: c3d4e5f6-a7b8-9012-cdef-123456789012"}` |
| **409 Conflict** | Order is already in terminal state (`DELIVERED` or `CANCELLED`) | `{"type":"https://luna.com/errors/invalid-order-state","title":"Invalid Order State","status":409,"detail":"Cannot modify an order in terminal state: CANCELLED"}` |
| **500 Internal Error** | Database connection or inventory replenishment error | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
