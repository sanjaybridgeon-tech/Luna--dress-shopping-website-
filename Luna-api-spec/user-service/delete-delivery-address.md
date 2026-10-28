# User Service - Delete Delivery Address

Deletes a saved shipping address from the authenticated customer's address book.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| DELETE | `/api/account/addresses/{addressId}` | Yes | `CUSTOMER`, `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Permanently removes a delivery address from the customer's account.
- Enforces strict ownership: verifies that the address belongs to the authenticated user; users cannot delete another customer's address.
- Returns `204 No Content` upon successful deletion.

---

## 3. Request

### 3.1 Path Parameters
| Name | Type | Required | Description | Example |
|:---- |:---- |:-------- |:----------- |:------- |
| `addressId` | UUID | Yes | Unique identifier of the address to delete | `7f8b9e6a-3c12-4d56-8a90-b1c2d3e4f5a6` |

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

### 4.1 Success Response: `204 No Content`
No response body returned.

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **401 Unauthorized** | Missing or invalid Bearer token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **404 Not Found** | Address ID does not exist or does not belong to the user | `{"type":"https://luna.com/errors/address-not-found","title":"Address Not Found","status":404,"detail":"Address not found with id: 7f8b9e6a-3c12-4d56-8a90-b1c2d3e4f5a6"}` |
| **500 Internal Error** | Unexpected server or database exception | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
