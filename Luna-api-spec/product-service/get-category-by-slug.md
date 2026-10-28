# Product Service - Get Category By Slug

Retrieves a single clothing category by its unique URL slug.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/categories/{slug}` | No | Public / Anonymous | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Fetches category details when a customer navigates to a specific category page (e.g. `luna.com/category/evening-dresses`).
- Used by storefront category headers to render title, description, and hero banner image.

---

## 3. Request

### 3.1 Path Parameters
| Name | Required | Type | Description |
|:---- |:-------- |:---- |:----------- |
| slug | Yes | string | Unique category slug identifier (e.g., `evening-dresses`). |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Accept | No | Accepted media type | `application/json` |

### 3.4 Body
NIL

---

## 4. Response

### 4.1 Success - 200 OK
```json
{
  "id": 1,
  "name": "Evening Dresses",
  "slug": "evening-dresses",
  "description": "Elegant gowns and luxury floor-length dresses for gala and formal events.",
  "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
}
```

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 404 Not Found | Category Not Found | Category not found with slug: wedding-dresses |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
