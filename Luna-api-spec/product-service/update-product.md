# Product Service - Update Product

Updates an existing product's attributes including title, description, price, brand, gender, category, and image URL.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| PUT | `/api/products/{id}` | Yes | `ADMIN` | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Modifies general product details for an existing active product.
- Validates that the product ID exists and is currently active.
- Verifies that the replacement category slug exists.
- Updates `updatedAt` audit timestamp automatically.
- Does not modify existing product variants (use variant endpoints for inventory and SKU adjustments).

---

## 3. Request

### 3.1 Path Parameters
| Name | Required | Type | Description |
|:---- |:-------- |:---- |:----------- |
| id | Yes | UUID | Unique identifier of the product to update. |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Content-Type | Yes | Request payload media type | `application/json` |
| Authorization | Yes | Admin Bearer JWT Token | `Bearer eyJhbGciOi...` |

### 3.4 Body
```json
{
  "name": "Aurelia Silk Slip Evening Dress - Updated Edition",
  "description": "Refined 100% pure mulberry silk slip dress with reinforced French seams and an updated tailored fit.",
  "price": 199.99,
  "brand": "Luna",
  "gender": "WOMEN",
  "categorySlug": "evening-dresses",
  "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
}
```

---

## 4. Response

### 4.1 Success - 200 OK
```json
{
  "id": "a0000001-0000-0000-0000-000000000001",
  "name": "Aurelia Silk Slip Evening Dress - Updated Edition",
  "description": "Refined 100% pure mulberry silk slip dress with reinforced French seams and an updated tailored fit.",
  "price": 199.99,
  "brand": "Luna",
  "gender": "WOMEN",
  "category": {
    "id": 1,
    "name": "Evening Dresses",
    "slug": "evening-dresses",
    "description": "Elegant gowns and luxury floor-length dresses for gala and formal events.",
    "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
  },
  "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
  "active": true,
  "availableSizes": ["M", "S", "XS"],
  "availableColors": ["Champagne Gold", "Emerald Green"],
  "totalStock": 90,
  "createdAt": "2026-10-26T15:00:00Z",
  "updatedAt": "2026-10-26T15:45:00Z"
}
```

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 400 Bad Request | Validation Error | `price`: Price must be greater than 0.00 |
| 404 Not Found | Product Not Found | Product not found with ID: a0000001-0000-0000-0000-000000000099 |
| 404 Not Found | Category Not Found | Category not found with slug: invalid-category |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
