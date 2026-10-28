# Product Service - Create Product

Creates a new clothing product in the catalog with category association and optional initial size/color inventory variants.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| POST | `/api/products` | Yes | `ADMIN` | No |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Allows store administrators to publish a new dress or apparel item to the catalog.
- Validates that the specified category slug exists before saving.
- If initial variants are provided in the payload, they are saved transactionally with the product (`cascade = CascadeType.ALL`).
- SKUs must be globally unique across all variants.
- Product `active` status defaults to `true`.
- Returns `201 Created` with the newly created product representation.

---

## 3. Request

### 3.1 Path Parameters
NIL

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
  "name": "Elysian Backless Silk Midi",
  "description": "Luxurious heavyweight mulberry silk featuring a draped neckline and delicate criss-cross straps.",
  "price": 210.00,
  "brand": "Luna",
  "gender": "WOMEN",
  "categorySlug": "evening-dresses",
  "imageUrl": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
  "variants": [
    {
      "size": "S",
      "color": "Midnight Black",
      "sku": "LUNA-ELY-BLK-S",
      "stockQuantity": 15
    },
    {
      "size": "M",
      "color": "Midnight Black",
      "sku": "LUNA-ELY-BLK-M",
      "stockQuantity": 20
    },
    {
      "size": "S",
      "color": "Champagne Rose",
      "sku": "LUNA-ELY-RSE-S",
      "stockQuantity": 10
    }
  ]
}
```

---

## 4. Response

### 4.1 Success - 201 Created
```json
{
  "id": "c1000001-0000-0000-0000-000000000001",
  "name": "Elysian Backless Silk Midi",
  "description": "Luxurious heavyweight mulberry silk featuring a draped neckline and delicate criss-cross straps.",
  "price": 210.00,
  "brand": "Luna",
  "gender": "WOMEN",
  "category": {
    "id": 1,
    "name": "Evening Dresses",
    "slug": "evening-dresses",
    "description": "Elegant gowns and luxury floor-length dresses for gala and formal events.",
    "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
  },
  "imageUrl": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
  "active": true,
  "availableSizes": ["M", "S"],
  "availableColors": ["Champagne Rose", "Midnight Black"],
  "totalStock": 45,
  "createdAt": "2026-10-26T15:30:00Z",
  "updatedAt": "2026-10-26T15:30:00Z"
}
```

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 400 Bad Request | Validation Error | `name`: Product name cannot exceed 150 characters |
| 400 Bad Request | Validation Error | `price`: Price must be greater than 0.00 |
| 404 Not Found | Category Not Found | Category not found with slug: wedding-dresses |
| 409 Conflict | SKU Conflict | Duplicate SKU key value violates unique constraint 'unique_variants_sku' |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
