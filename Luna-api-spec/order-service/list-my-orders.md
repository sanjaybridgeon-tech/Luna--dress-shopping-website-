# Order Service - List My Orders

Retrieves a paginated collection of past and active orders for the currently authenticated customer, ordered by creation date descending.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/orders` | Yes | `CUSTOMER`, `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8083` (direct Order Service)

---

## 2. Summary

- Allows customers to view their full order history.
- Resolves customer identity from the `X-User-Id` gateway header.
- Returns full order items with their immutable snapshots (name, color, size, price paid).
- Supports standard pagination with `page`, `size`, and `sort` query parameters.

---

## 3. Request

### 3.1 Path Parameters
NIL

### 3.2 Query Parameters
| Name | Type | Required | Default | Description | Example |
|:---- |:---- |:-------- |:------- |:----------- |:------- |
| `page` | Integer | No | `0` | Zero-indexed page number | `0` |
| `size` | Integer | No | `10` | Records per page | `10` |
| `sort` | String | No | `createdAt,desc` | Sort field and direction | `createdAt,desc` |

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
  "content": [
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "userId": "b2c8df34-f4ca-4149-ada4-dcda35e71dca",
      "status": "CONFIRMED",
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
        }
      ],
      "createdAt": "2026-10-26T22:40:00Z",
      "updatedAt": "2026-10-26T22:42:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "size": 10,
  "number": 0,
  "empty": false
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **401 Unauthorized** | Missing or invalid Bearer authentication token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **500 Internal Error** | Database connection or unexpected server error | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
