# Product Service - List Categories

Retrieves all clothing product categories available in the store (e.g. Evening Dresses, Cocktail & Party, Casual Summer Dresses).

---

## 1. Endpoint

| Method | URL | Auth Required | Permission/Scope | Idempotent |
|:------ |:--- |:------------- |:---------------- |:-----------|
| GET | `/api/categories` | No | Public / Anonymous | Yes |

**Base URL:** `http://localhost:8080` (via Luna Gateway) or `http://localhost:8082` (direct Product Service)

---

## 2. Summary

- Retrieves the full list of clothing categories for storefront navigation bars, dropdown menus, and home hero banners.
- Includes unique category slug, name, description, and cover image URL.

---

## 3. Request

### 3.1 Path Parameters
NIL

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
[
  {
    "id": 1,
    "name": "Evening Dresses",
    "slug": "evening-dresses",
    "description": "Elegant gowns and luxury floor-length dresses for gala and formal events.",
    "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
  },
  {
    "id": 2,
    "name": "Cocktail & Party",
    "slug": "cocktail-party",
    "description": "Chic partywear, metallic slips, and stunning cocktail dresses.",
    "imageUrl": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800"
  },
  {
    "id": 3,
    "name": "Casual Summer Dresses",
    "slug": "casual-summer-dresses",
    "description": "Breezy linens, sundresses, and effortless daywear for warm weather.",
    "imageUrl": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"
  },
  {
    "id": 4,
    "name": "Maxi & Midi Dresses",
    "slug": "maxi-midi-dresses",
    "description": "Flowing silhouettes and versatile lengths for everyday elegance.",
    "imageUrl": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800"
  },
  {
    "id": 5,
    "name": "Work & Formal",
    "slug": "work-formal",
    "description": "Tailored blazer dresses, structured sheaths, and polished office attire.",
    "imageUrl": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800"
  }
]
```

### 4.2 Error Responses

| HTTP | Error | Message |
|:---- |:----- |:------- |
| 500 Internal Server Error | Internal Server Error | An unexpected internal error occurred |
