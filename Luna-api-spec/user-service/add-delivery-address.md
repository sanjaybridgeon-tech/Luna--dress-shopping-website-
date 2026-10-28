# User Service - Add Delivery Address

Adds a new shipping and delivery address to the authenticated customer's address book.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| POST | `/api/account/addresses` | Yes | `CUSTOMER`, `ADMIN` | No |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Validates required address fields (`line1`, `city`, `state`, `postalCode`).
- Sets `country` to `"US"` by default if unspecified.
- Automatic default address logic:
  - If `isDefault` is set to `true`, any previously default address for this user is automatically unmarked (`isDefault = false`).
  - If this is the customer's very first saved address, it is automatically marked as default (`isDefault = true`).
- Returns `201 Created` with the newly assigned address UUID and timestamps.

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
  "line1": "742 Evergreen Terrace",
  "line2": "Apartment 4B",
  "city": "Springfield",
  "state": "IL",
  "postalCode": "62704",
  "country": "US",
  "isDefault": true
}
```

#### Field Specifications:
- `line1` (string, required): Primary street address (max 255 characters).
- `line2` (string, optional): Suite, apartment, unit, or building number (max 255 characters).
- `city` (string, required): City / municipality name (max 100 characters).
- `state` (string, required): State, region, or province (max 100 characters).
- `postalCode` (string, required): Postal or ZIP code (max 20 characters).
- `country` (string, optional): Country name (default: `"US"`, max 100 characters).
- `isDefault` (boolean, optional): Whether this address is the default delivery destination.

---

## 4. Response

### 4.1 Success Response: `201 Created`
```json
{
  "id": "7f8b9e6a-3c12-4d56-8a90-b1c2d3e4f5a6",
  "line1": "742 Evergreen Terrace",
  "line2": "Apartment 4B",
  "city": "Springfield",
  "state": "IL",
  "postalCode": "62704",
  "country": "US",
  "isDefault": true,
  "createdAt": "2026-10-26T20:47:00Z"
}
```

---

### 4.2 Error Responses

| Status Code | Reason / Condition | Error Response Payload Example |
|:----------- |:------------------ |:------------------------------ |
| **400 Bad Request** | Missing required fields (line1, city, state, or postal code) | `{"type":"https://luna.com/errors/validation-failed","title":"Validation Error","status":400,"errors":{"city":"City is required"}}` |
| **401 Unauthorized** | Missing or invalid Bearer token | `{"type":"https://luna.com/errors/unauthorized","title":"Unauthorized","status":401,"detail":"Full authentication is required to access this resource"}` |
| **404 Not Found** | User ID in token does not exist in the database | `{"type":"https://luna.com/errors/user-not-found","title":"User Not Found","status":404,"detail":"User not found with id: b2c8df34-f4ca-4149-ada4-dcda35e71dca"}` |
| **500 Internal Error** | Unexpected server or database exception | `{"type":"https://luna.com/errors/internal-server-error","title":"Internal Server Error","status":500,"detail":"An unexpected internal error occurred"}` |
