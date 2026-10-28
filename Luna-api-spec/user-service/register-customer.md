# User Service - Register Customer

Registers a new customer account, hashes the password using BCrypt, assigns the `CUSTOMER` role, and returns an authenticated JWT session token.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| POST | `/api/auth/register` | No | Public | No |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Validates incoming customer registration data (valid email, min 8-character password, full name).
- Verifies that the email is unique across the system (case-insensitive); returns `409 Conflict` if already registered.
- Encrypts password using BCrypt hashing before storing in the `users` table.
- Issues a signed JWT Bearer token with 24-hour expiration for immediate customer login.
- Returns `201 Created` with the JWT token and sanitized customer profile representation.

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
  "name": "Elena Rostova",
  "email": "elena.rostova@example.com",
  "password": "Password123!",
  "phone": "+1-555-0199"
}
```

#### Field Specifications:
- `name` (string, required): Full name of the customer (max 100 characters).
- `email` (string, required): Valid RFC-compliant email address (max 150 characters, unique).
- `password` (string, required): Plaintext password (min 8, max 100 characters).
- `phone` (string, optional): Contact telephone number (max 30 characters).

---

## 4. Response

### 4.1 Success Response: `201 Created`
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

#### Notes:
- `expiresIn` is provided in milliseconds (86,400,000 ms = 24 hours).
- Passwords and password hashes are never exposed in any API response.

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **400 Bad Request** | Missing name, invalid email syntax, or password < 8 characters | `{"type":"https://luna.com/errors/validation-failed","title":"Validation Error","status":400,"errors":{"email":"Email must be a valid email address"}}` |
| **409 Conflict** | Email address is already registered | `{"type":"https://luna.com/errors/email-already-exists","title":"Email Already Exists","status":409,"detail":"An account with email already exists: elena.rostova@example.com"}` |
| **500 Internal Error** | Database connection or cryptographic signing failure | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
