# User Service - Get User Profile By ID

Retrieves an existing customer account and saved address book by their unique user UUID. Used for admin customer support and inter-service user lookup.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/users/{id}` | Yes | `ADMIN` / Authenticated | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8081` (direct User Service)

---

## 2. Summary

- Accepts a user's UUID path parameter.
- Returns customer identity attributes (full name, email, phone number, role) and their full collection of saved delivery addresses.
- Used by administrators to inspect customer account state.

---

## 3. Request

### 3.1 Path Parameters
| Name | Type | Required | Description | Example |
|:---- |:---- |:-------- |:----------- |:------- |
| `id` | UUID | Yes | Unique identifier of the user account | `74bd62d5-3879-4910-b9bb-d5881569f770` |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Authorization | Yes | Admin or authenticated Bearer JWT | `Bearer eyJhbGciOiJIUzI1NiJ9...` |

### 3.4 Body
NIL (GET request has no body)

---

## 4. Response

### 4.1 Success Response (`200 OK`)

```json
{
  "id": "74bd62d5-3879-4910-b9bb-d5881569f770",
  "fullName": "Elena Rostova",
  "email": "elena.rostova@example.com",
  "phoneNumber": "+1-555-0199",
  "role": "CUSTOMER",
  "addresses": [
    {
      "id": "e8123456-789a-bcde-f012-3456789abcde",
      "addressLine1": "742 Evergreen Terrace",
      "addressLine2": "Apt 4B",
      "city": "Springfield",
      "state": "IL",
      "postalCode": "62704",
      "country": "US",
      "isDefault": true
    }
  ],
  "createdAt": "2026-10-27T06:55:12Z",
  "updatedAt": "2026-10-27T06:55:12Z"
}
```

### 4.2 Error Responses

| Status Code | Error Type | Condition |
|:----------- |:---------- |:--------- |
| `400 Bad Request` | `https://luna.com/errors/invalid-argument` | Supplied user ID is not a valid UUID format. |
| `401 Unauthorized` | `https://luna.com/errors/unauthorized` | Missing or invalid JWT bearer token. |
| `403 Forbidden` | `https://luna.com/errors/forbidden` | Caller does not possess sufficient privileges (`ADMIN`). |
| `404 Not Found` | `https://luna.com/errors/user-not-found` | No user exists matching the provided UUID. |
