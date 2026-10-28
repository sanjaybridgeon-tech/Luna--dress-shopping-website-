# Product Service - Get Product By ID

Retrieves complete details for a single dress or clothing item by its UUID, including category metadata, live pricing, stock summary, and all size/color inventory variants.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/products/{id}` | No | Public / Anonymous | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Fetches full product information for the Product Detail Page (PDP).
- Eagerly fetches the associated `category` and all `product_variants` in a single query with `JOIN FETCH` to eliminate N+1 overhead.
- Only active products (`active = true`) are returned to public customers. If deactivated, returns `404 Not Found`.
- Variant records include individual SKU numbers, sizes, color names, and live stock quantities.

---

## 3. Request

### 3.1 Path Parameters
| Name | Required | Type | Description |
|:---- |:-------- |:---- |:----------- |
| id | Yes | UUID | Unique identifier of the product (e.g., `a0000001-0000-0000-0000-000000000001`). |

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
  "id": "a0000001-0000-0000-0000-000000000001",
  "name": "Aurelia Silk Slip Evening Dress",
  "description": "Cut from luminous 100% mulberry silk, the Aurelia dress features a delicate cowl neckline and gentle bias drape.",
  "price": 189.99,
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
  "variants": [
    {
      "id": "b0000001-0000-0000-0000-000000000001",
      "size": "XS",
      "color": "Emerald Green",
      "sku": "LUNA-AUR-GRN-XS",
      "stockQuantity": 12
    },
    {
      "id": "b0000001-0000-0000-0000-000000000002",
      "size": "S",
      "color": "Emerald Green",
      "sku": "LUNA-AUR-GRN-S",
      "stockQuantity": 20
    },
    {
      "id": "b0000001-0000-0000-0000-000000000003",
      "size": "M",
      "color": "Emerald Green",
      "sku": "LUNA-AUR-GRN-M",
      "stockQuantity": 15
    },
    {
      "id": "b0000001-0000-0000-0000-000000000004",
      "size": "S",
      "color": "Champagne Gold",
      "sku": "LUNA-AUR-GLD-S",
      "stockQuantity": 18
    },
    {
      "id": "b0000001-0000-0000-0000-000000000005",
      "size": "M",
      "color": "Champagne Gold",
      "sku": "LUNA-AUR-GLD-M",
      "stockQuantity": 25
    }
  ],
  "createdAt": "2026-10-26T15:00:00Z",
  "updatedAt": "2026-10-26T15:00:00Z"
}
```

**Notes:**
- `totalStock` is dynamically calculated as the sum of all variant `stockQuantity` values.
- `availableSizes` and `availableColors` are sorted, deduplicated lists computed from active variants.

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 400 Bad Request | Invalid Argument | Failed to convert value of type 'java.lang.String' to required type 'java.util.UUID' |
| 404 Not Found | Product Not Found | Product not found with ID: a0000001-0000-0000-0000-000000000099 |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
