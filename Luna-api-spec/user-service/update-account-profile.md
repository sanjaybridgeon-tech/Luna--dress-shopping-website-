# User Service - Update Account Profile

Updates the authenticated customer's account profile information (such as full name and contact phone number).

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| PUT | `/api/account` | Yes | `CUSTOMER`, `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Allows logged-in users to update their personal contact details.
- Validates that the customer name is not blank.
- Updates the `updated_at` audit timestamp automatically.
- Returns `200 OK` with the refreshed profile representation.

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
| Authorization | Yes | Customer or Admin Bearer JWT Token | `Bearer eyJhbGciOiJIUzI1NiJ9...` |

### 3.4 Body
```json
{
  "name": "Elena Rostova-Vance",
  "phone": "+1-555-0248"
}
```

#### Field Specifications:
- `name` (string, required): Updated customer full name (max 100 characters).
- `phone` (string, optional): Updated telephone number (max 30 characters).

---

## 4. Response

### 4.1 Success Response: `200 OK`
```json
{
  "id": "b2c8df34-f4ca-4149-ada4-dcda35e71dca",
  "name": "Elena Rostova-Vance",
  "email": "elena.rostova@example.com",
  "role": "CUSTOMER",
  "phone": "+1-555-0248",
  "active": true,
  "createdAt": "2026-10-26T20:45:00Z"
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **400 Bad Request** | Blank customer name | `{"type":"https://luna.com/errors/validation-failed","title":"Validation Error","status":400,"errors":{"name":"Name cannot be blank"}}` |
| **401 Unauthorized** | Missing or invalid Bearer token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **404 Not Found** | User ID in token does not match any record | `{"type":"https://luna.com/errors/user-not-found","title":"User Not Found","status":404,"detail":"User not found with id: b2c8df34-f4ca-4149-ada4-dcda35e71dca"}` |
| **500 Internal Error** | Unexpected server or database exception | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
