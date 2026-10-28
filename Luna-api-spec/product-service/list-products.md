# Product Service - List Products

Paginated and filterable catalog listing of active clothing products. Supports full-text keyword search, multi-criteria attribute filtering (category, gender, size, price range), and sorting.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/products` | No | Public / Anonymous | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Retrieves a paginated list of catalog products for the storefront catalog and search interfaces.
- Only products with `active = true` are returned to public customers.
- Queries against `products` table joined with `categories` and `product_variants`.
- Dynamic specifications allow flexible combinations of all filters (e.g. searching "silk", filtered by `WOMEN`, category `dresses`, size `M`, and price between `$100` and `$300`).
- Results are ordered by `createdAt DESC` by default, with custom sort options supported.

---

## 3. Request

### 3.1 Path Parameters
NIL

### 3.2 Query Parameters
| Name | Required | Type | Default | Description |
|:---- |:-------- |:---- |:------- |:----------- |
| search | No | string | NIL | Case-insensitive keyword search matching against product `name` and `description`. |
| category | No | string | NIL | Category slug filter (e.g., `evening-dresses`, `casual-dresses`, `linen-shirts`). |
| gender | No | string | NIL | Target gender filter. Allowed values: `MEN`, `WOMEN`, `UNISEX`. |
| size | No | string | NIL | Variant size filter (e.g., `XS`, `S`, `M`, `L`, `XL`, `XXL`). Matches products with at least one variant of this size in stock. |
| minPrice | No | number (decimal) | NIL | Minimum product unit price filter (inclusive, e.g., `50.00`). |
| maxPrice | No | number (decimal) | NIL | Maximum product unit price filter (inclusive, e.g., `500.00`). |
| page | No | integer | 0 | 0-based page index (minimum: `0`). |
| size | No | integer | 12 | Number of items per page (range: `1`–`100`, default: `12`). |
| sort | No | string | `createdAt,desc` | Sort field and direction (e.g., `price,asc`, `price,desc`, `createdAt,desc`). |

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
  "page": 0,
  "size": 12,
  "totalElements": 28,
  "totalPages": 3,
  "first": true,
  "last": false,
  "items": [
    {
      "id": "e4b93198-1111-4a2a-89aa-098765432101",
      "name": "Luna Silk Evening Dress",
      "description": "Floor-length 100% mulberry silk gown with an elegant draped cowl neckline and side slit.",
      "price": 289.00,
      "brand": "Luna",
      "gender": "WOMEN",
      "category": {
        "id": 1,
        "name": "Evening Dresses",
        "slug": "evening-dresses"
      },
      "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
      "active": true,
      "availableSizes": ["XS", "S", "M", "L"],
      "availableColors": ["Champagne", "Midnight Black", "Emerald Green"],
      "totalStock": 45,
      "createdAt": "2026-10-24T10:15:30Z",
      "updatedAt": "2026-10-25T14:20:10Z"
    },
    {
      "id": "a1f82210-2222-4b3b-90bb-109876543202",
      "name": "Velvet Cocktail Midi Dress",
      "description": "Luxe plush velvet midi dress tailored with subtle shoulder definition and a contoured silhouette.",
      "price": 195.00,
      "brand": "Luna",
      "gender": "WOMEN",
      "category": {
        "id": 1,
        "name": "Evening Dresses",
        "slug": "evening-dresses"
      },
      "imageUrl": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
      "active": true,
      "availableSizes": ["S", "M", "L", "XL"],
      "availableColors": ["Ruby Wine", "Sapphire Navy"],
      "totalStock": 28,
      "createdAt": "2026-10-23T11:00:00Z",
      "updatedAt": "2026-10-24T09:30:00Z"
    },
    {
      "id": "c3d74430-3333-4c4c-91cc-210987654303",
      "name": "Linen Wrap Sundress",
      "description": "Breezy French linen wrap dress with waist tie and delicate flutter sleeves, perfect for resort and casual wear.",
      "price": 145.00,
      "brand": "Luna",
      "gender": "WOMEN",
      "category": {
        "id": 2,
        "name": "Casual Dresses",
        "slug": "casual-dresses"
      },
      "imageUrl": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80",
      "active": true,
      "availableSizes": ["XS", "S", "M", "L"],
      "availableColors": ["Warm Oat", "Sage Mist", "Terracotta"],
      "totalStock": 60,
      "createdAt": "2026-10-22T08:45:00Z",
      "updatedAt": "2026-10-22T08:45:00Z"
    }
  ]
}
```

Notes:
- `gender` enum values:
  - `WOMEN` — Women's collection.
  - `MEN` — Men's collection.
  - `UNISEX` — Unisex clothing.
- `price` is always formatted with 2 decimal places (`BigDecimal`).
- `availableSizes` and `availableColors` are derived aggregated sets from active variants with `stock_quantity > 0`.
- `totalStock` is the aggregate count of stock across all active variants for quick storefront stock indication.

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 400 | `INVALID_PAGE_OR_SIZE` | Page index must be >= 0 and size must be between 1 and 100. |
| 400 | `INVALID_PRICE_RANGE` | minPrice cannot be greater than maxPrice or negative. |
| 400 | `INVALID_GENDER` | Gender must be one of: MEN, WOMEN, UNISEX. |
| 500 | `INTERNAL_ERROR` | Unexpected server issue occurred while querying products. |
