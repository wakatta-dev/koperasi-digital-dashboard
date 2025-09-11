# Inventory API — Panduan Integrasi Frontend (Singkat)

Modul Inventory (UMKM) mengelola produk, varian, harga per level, level stok, dan pergerakan stok.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/products?limit=&cursor=` — daftar produk → 200 `APIResponse<Product[]>`
- POST `/products` — buat produk + varian → 201 `APIResponse<Product>`
- PATCH `/products/:id` — ubah produk → 200 `APIResponse<Product>`
- DELETE `/products/:id` — hapus produk → 204 `APIResponse<null>`
- GET `/stocks/:variant_id` — lihat stok varian → 200 `APIResponse<StockLevel>`
- POST `/stock-movements` — penyesuaian stok → 201 `APIResponse<AdjustStockResponse>`

## Skema Data Ringkas

Catatan: properti entity menggunakan camelCase (sesuai Swagger).

- Product: `id`, `tenantID`, `categoryID?`, `sku`, `name`, `description`, `baseUnit`, `isActive`, `createdBy?`, `updatedBy?`, `createdAt`, `updatedAt`, preload `variants[]`
- ProductVariant: `id`, `tenantID`, `productID`, `sku`, `name`, `isActive`, `createdBy?`, `updatedBy?`, `createdAt`, `updatedAt`, preload `prices[]`
- ProductPrice: `id`, `tenantID`, `productVariantID`, `priceLevelID`, `price`
- StockLevel: `id`, `tenantID`, `productVariantID`, `currentQty`
- StockMovement: `id`, `tenantID`, `productVariantID`, `qtyChange`, `type`, `reference`, `note?`, `createdBy?`, `createdAt`, `updatedAt`

## Payload Utama

- CreateProductRequest:
  - `category_id` (number), `sku` (string), `name` (string), `description?` (string), `base_unit` (string)
  - `variants[]`: `{ sku: string, name: string }`

- AdjustStockRequest:
  - `{ variant_id: number, qty: number, type: string, reference: string, note?: string }`

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>`; endpoint list menyediakan `meta.pagination`.

## TypeScript Types (Request & Response)

```ts
export type Rfc3339String = string;
export interface Pagination { next_cursor?: string; prev_cursor?: string; has_next: boolean; has_prev: boolean; limit: number }
export interface Meta { request_id: string; timestamp: Rfc3339String; pagination?: Pagination }
export interface APIResponse<T> { success: boolean; message: string; data: T | null; meta: Meta; errors: Record<string, string[]> | null }

export interface ProductPrice { id: number; tenantID: number; productVariantID: number; priceLevelID: number; price: number }
export interface ProductVariant {
  id: number; tenantID: number; productID: number; sku: string; name: string; isActive: boolean;
  createdBy?: number; updatedBy?: number; createdAt: Rfc3339String; updatedAt: Rfc3339String;
  prices: ProductPrice[];
}
export interface Product {
  id: number; tenantID: number; categoryID?: number; sku: string; name: string; description?: string; baseUnit: string; isActive: boolean;
  createdBy?: number; updatedBy?: number; createdAt: Rfc3339String; updatedAt: Rfc3339String; variants: ProductVariant[];
}
export interface StockLevel { id: number; tenantID: number; productVariantID: number; currentQty: number }
export interface StockMovement {
  id: number; tenantID: number; productVariantID: number; qtyChange: number; type: string; reference: string; note?: string;
  createdBy?: number; createdAt: Rfc3339String; updatedAt: Rfc3339String;
}

export interface VariantRequest { sku: string; name: string }
export interface CreateProductRequest { category_id: number; sku: string; name: string; description?: string; base_unit: string; variants: VariantRequest[] }
export interface AdjustStockRequest { variant_id: number; qty: number; type: string; reference: string; note?: string }
export interface AdjustStockResponse { movement: StockMovement; stock: StockLevel }

export type ListProductsResponse = APIResponse<Product[]>;
export type CreateProductResponse = APIResponse<Product>;
export type UpdateProductResponse = APIResponse<Product>;
export type GetStockResponse = APIResponse<StockLevel>;
export type CreateMovementResponse = APIResponse<AdjustStockResponse>;
```

## Paginasi (Cursor)

- Endpoint list menggunakan cursor numerik (`id`) dan `limit` opsional (default `10`).
- Gunakan `meta.pagination.next_cursor` untuk memuat halaman berikutnya saat `has_next = true`.

## Error Singkat

- 400: body/query invalid (mis. `limit`, `cursor`).
- 401/403: token salah/tenant tidak aktif.
- 404: produk/varian tidak ditemukan.

## Checklist Integrasi FE

- Pastikan kirim `Authorization` dan `X-Tenant-ID` pada semua request.
- Buat produk beserta varian secara bersamaan; harga per level dikelola di modul Pricing.
- Sesuaikan tipe (camelCase) untuk entity ketika memetakan data di FE.
- Pada penyesuaian stok, pastikan `reference` dan `type` bermakna; gunakan nilai negatif untuk pengurangan stok.

Tautan teknis: `internal/modules/umkm/inventory/`.
