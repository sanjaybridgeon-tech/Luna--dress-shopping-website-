# Product Service - Get Variant By ID

Retrieves detailed size, color, SKU, price, and current inventory stock for a single dress variant by its unique UUID. Used by storefront variant selectors and for inter-service validation by Order Service.

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/products/variants/{variantId}` | No | Public / Inter-Service | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Accepts a product variant UUID as a path parameter.
- Returns the variant's attributes including `productId`, `productName`, `price`, `size`, `color`, `sku`, and `stockQuantity`.
- Called synchronously by `order-service` via OpenFeign before placing orders to verify pricing and stock availability.
- Publicly accessible so frontend clients can fetch live stock levels when customers select a size/color swatch.

---

## 3. Request

### 3.1 Path Parameters
| Name | Type | Required | Description | Example |
|:---- |:---- |:-------- |:----------- |:------- |
| `variantId` | UUID | Yes | Unique identifier of the product variant | `8e53960c-0c14-4c9b-b87d-9d7d78256812` |

### 3.2 Query Parameters
NIL

### 3.3 Headers
| Name | Required | Description | Example |
|:---- |:-------- |:----------- |:------- |
| Accept | No | Desired response format | `application/json` |

### 3.4 Body
NIL (GET request has no body)

---

## 4. Response

### 4.1 Success Response (`200 OK`)

```json
{
  "id": "8e53960c-0c14-4c9b-b87d-9d7d78256812",
  "productId": "a0000001-0000-0000-0000-000000000001",
  "productName": "Aurelia Silk Slip Evening Dress",
  "price": 189.99,
  "size": "XS",
  "color": "Emerald Green",
  "sku": "LUNA-AUR-GRN-XS",
  "stockQuantity": 11
}
```

#### Field Descriptions:
* `id` (`UUID`): Variant unique ID.
* `productId` (`UUID`): Parent dress unique ID.
* `productName` (`String`): Parent dress display name.
* `price` (`BigDecimal`): Current unit retail price in USD.
* `size` (`String`): Size representation (`XS`, `S`, `M`, `L`, `XL`).
* `color` (`String`): Colorway title (e.g. `Emerald Green`).
* `sku` (`String`): Inventory stock keeping unit code.
* `stockQuantity` (`Integer`): Remaining physical stock count.

### 4.2 Error Responses

| Status Code | Error Type | Condition |
|:----------- |:---------- |:--------- |
| `400 Bad Request` | `https://luna.com/errors/invalid-argument` | `variantId` is not a valid UUID format. |
| `404 Not Found` | `https://luna.com/errors/variant-not-found` | No variant exists with the supplied UUID. |
| `500 Internal Server Error` | `https://luna.com/errors/internal-server-error` | Unexpected database or server exception. |
