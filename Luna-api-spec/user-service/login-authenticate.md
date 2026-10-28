# User Service - Login Authenticate

Authenticates existing customer or administrator credentials (email and password) and returns a signed JWT Bearer session token.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| POST | `/api/auth/login` | No | Public | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Accepts customer email and plaintext password.
- Looks up user account by email (case-insensitive); compares BCrypt hashed password.
- Verifies that the user account is active (`active = true`).
- Generates a signed JWT Bearer token encoding user UUID (`sub`), `email`, and `role`.
- Returns `200 OK` with the token, expiration time, and sanitized profile.

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

### 3.4 Body
```json
{
  "email": "elena.rostova@example.com",
  "password": "Password123!"
}
```

#### Field Specifications:
- `email` (string, required): Registered customer email address.
- `password` (string, required): Account plaintext password.

---

## 4. Response

### 4.1 Success Response: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMmM4ZGYzNC1mNGNhLTQxNDktYWRhNC1kY2RhMzVlNzFkY2EiLCJlbWFpbCI6ImVsZW5hLnJvc3RvdmFAZXhhbXBsZS5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE2OTgzNzg0MDAsImV4cCI6MTY5ODQ2NDgwMH0...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": "b2c8df34-f4ca-4149-ada4-dcda35e71dca",
    "name": "Elena Rostova",
    "email": "elena.rostova@example.com",
    "role": "CUSTOMER",
    "phone": "+1-555-0199",
    "active": true,
    "createdAt": "2026-10-26T20:45:00Z"
  }
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **400 Bad Request** | Missing email or password in request body | `{"type":"https://luna.com/errors/validation-failed","title":"Validation Error","status":400,"errors":{"password":"Password is required"}}` |
| **401 Unauthorized** | Email not found or incorrect password | `{"type":"https://luna.com/errors/invalid-credentials","title":"Invalid Credentials","status":401,"detail":"Invalid email or password"}` |
| **401 Unauthorized** | Account has been deactivated | `{"type":"https://luna.com/errors/invalid-credentials","title":"Invalid Credentials","status":401,"detail":"User account is inactive. Please contact support."}` |
| **500 Internal Error** | Unexpected server or database exception | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
