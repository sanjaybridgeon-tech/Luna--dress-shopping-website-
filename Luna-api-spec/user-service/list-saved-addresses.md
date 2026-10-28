# User Service - List Saved Addresses

Retrieves all saved shipping and delivery addresses associated with the authenticated customer's account.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/account/addresses` | Yes | `CUSTOMER`, `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Enables checkout screens and the customer profile address book to display all saved shipping destinations.
- Returns addresses ordered by creation timestamp, showing which address is designated as the primary default.
- Strict data isolation: customers can only view addresses linked to their account UUID.

---

## 3. Request

### 3.1 Path Parameters
NIL

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Authorization | Yes | Customer or Admin Bearer JWT Token | `Bearer eyJhbGciOiJIUzI1NiJ9...` |

### 3.4 Body
NIL

---

## 4. Response

### 4.1 Success Response: `200 OK`
```json
[
  {
    "id": "7f8b9e6a-3c12-4d56-8a90-b1c2d3e4f5a6",
    "line1": "742 Evergreen Terrace",
    "line2": "Apartment 4B",
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62704",
    "country": "US",
    "isDefault": true,
    "createdAt": "2026-10-26T20:45:00Z"
  },
  {
    "id": "3a1b2c4d-5e6f-7081-92a3-b4c5d6e7f809",
    "line1": "100 Fashion Avenue",
    "line2": "Suite 800",
    "city": "New York",
    "state": "NY",
    "postalCode": "10018",
    "country": "US",
    "isDefault": false,
    "createdAt": "2026-10-26T20:46:00Z"
  }
]
```

#### Notes:
- If the customer has not saved any delivery addresses yet, an empty array `[]` is returned with status `200 OK`.

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **401 Unauthorized** | Missing or invalid Bearer token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **404 Not Found** | User ID in token does not exist | `{"type":"https://luna.com/errors/user-not-found","title":"User Not Found","status":404,"detail":"User not found with id: b2c8df34-f4ca-4149-ada4-dcda35e71dca"}` |
| **500 Internal Error** | Unexpected server or database exception | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
