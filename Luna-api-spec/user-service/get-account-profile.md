# User Service - Get Account Profile

Retrieves the authenticated customer's account profile details using their active JWT Bearer token.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/account` | Yes | `CUSTOMER`, `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Identifies the authenticated customer securely from the JWT `sub` (userId) claim.
- Returns account profile information including unique UUID, full name, email, role, phone number, and account creation timestamp.
- Protects customer data isolation so users cannot inspect other accounts.

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
{
  "id": "b2c8df34-f4ca-4149-ada4-dcda35e71dca",
  "name": "Elena Rostova",
  "email": "elena.rostova@example.com",
  "role": "CUSTOMER",
  "phone": "+1-555-0199",
  "active": true,
  "createdAt": "2026-10-26T20:45:00Z"
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **401 Unauthorized** | Missing, malformed, or expired Bearer token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **404 Not Found** | User ID stored in valid token does not exist in the database | `{"type":"https://luna.com/errors/user-not-found","title":"User Not Found","status":404,"detail":"User not found with id: b2c8df34-f4ca-4149-ada4-dcda35e71dca"}` |
| **500 Internal Error** | Unexpected server or database exception | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
