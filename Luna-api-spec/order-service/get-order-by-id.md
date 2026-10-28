# Order Service - Get Order By Id

Retrieves complete details of a specific order by its unique UUID, enforcing customer ownership security.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/orders/{id}` | Yes | `CUSTOMER`, `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8083` (direct Order Service)

---

## 2. Summary

- Fetches full details for an order including pricing snapshots, item quantities, and delivery address.
- Strictly validates that the requesting customer owns the order (`order.userId == X-User-Id`); returns `404 Not Found` if another user attempts access.

---

## 3. Request

### 3.1 Path Parameters
| Name | Type | Required | Description | Example |
|:---- |:---- |:-------- |:----------- |:------- |
| `id` | UUID | Yes | Unique identifier of the order | `c3d4e5f6-a7b8-9012-cdef-123456789012` |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Authorization | Yes | Customer Bearer JWT Token | `Bearer eyJhbGciOiJIUzI1NiJ9...` |
| X-User-Id | Yes | Injected automatically by Gateway | `b2c8df34-f4ca-4149-ada4-dcda35e71dca` |

### 3.4 Body
NIL

---

## 4. Response

### 4.1 Success Response: `200 OK`
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "userId": "b2c8df34-f4ca-4149-ada4-dcda35e71dca",
  "status": "PENDING",
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
  "updatedAt": "2026-10-26T22:40:00Z"
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **401 Unauthorized** | Missing or invalid Bearer token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **404 Not Found** | Order UUID does not exist or belongs to another user | `{"type":"https://luna.com/errors/order-not-found","title":"Order Not Found","status":404,"detail":"Order not found with id: c3d4e5f6-a7b8-9012-cdef-123456789012"}` |
| **500 Internal Error** | Database connection or unexpected server error | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
