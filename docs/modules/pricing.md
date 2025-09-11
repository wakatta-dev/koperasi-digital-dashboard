# Pricing API — Panduan Integrasi Frontend (Singkat)

Modul Pricing (UMKM) mengatur level harga (tier) dan harga per varian produk per level.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/price-levels?limit=&cursor=` — daftar level → 200 `APIResponse<PriceLevel[]>`
- POST `/price-levels` — buat level → 201 `APIResponse<PriceLevel>`
- PATCH `/price-levels/:id` — ubah level → 200 `APIResponse<PriceLevel>`
- DELETE `/price-levels/:id` — hapus level → 204 `APIResponse<null>`
- POST `/product-prices` — set harga varian per level → 201 `APIResponse<ProductPrice>`
- GET `/product-prices/:variant_id/:level_id` — ambil harga → 200 `APIResponse<ProductPrice>`

## Skema Data Ringkas

Catatan: properti entity menggunakan camelCase (sesuai Swagger).

- PriceLevel: `id`, `tenantID`, `name`, `isDefault`
- ProductPrice: `id`, `tenantID`, `productVariantID`, `priceLevelID`, `price`

## Payload Utama

- PriceLevelRequest:
  - `{ name: string, is_default?: boolean }`

- ProductPriceRequest:
  - `{ variant_id: number, level_id: number, price: number }`

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>`; endpoint list menyediakan `meta.pagination`.

## TypeScript Types (Request & Response)

```ts
export type Rfc3339String = string;
export interface Pagination { next_cursor?: string; prev_cursor?: string; has_next: boolean; has_prev: boolean; limit: number }
export interface Meta { request_id: string; timestamp: Rfc3339String; pagination?: Pagination }
export interface APIResponse<T> { success: boolean; message: string; data: T | null; meta: Meta; errors: Record<string, string[]> | null }

export interface PriceLevel { id: number; tenantID: number; name: string; isDefault: boolean }
export interface ProductPrice { id: number; tenantID: number; productVariantID: number; priceLevelID: number; price: number }

export interface PriceLevelRequest { name: string; is_default?: boolean }
export interface ProductPriceRequest { variant_id: number; level_id: number; price: number }

export type ListPriceLevelsResponse = APIResponse<PriceLevel[]>;
export type CreatePriceLevelResponse = APIResponse<PriceLevel>;
export type UpdatePriceLevelResponse = APIResponse<PriceLevel>;
export type GetPriceResponse = APIResponse<ProductPrice>;
export type AssignPriceResponse = APIResponse<ProductPrice>;
```

## Paginasi (Cursor)

- Endpoint list menggunakan cursor numerik (`id`) dan `limit` opsional (default `10`).
- Gunakan `meta.pagination.next_cursor` untuk memuat data berikutnya saat `has_next = true`.

## Error Singkat

- 400: body/query invalid (mis. `limit`, `cursor`).
- 401/403: token salah/tenant tidak aktif.
- 404: level/harga tidak ditemukan.

## Checklist Integrasi FE

- Tentukan level harga default (`is_default`) bila diperlukan.
- Hubungkan pemilihan level di UI pelanggan agar harga varian mengikuti level tersebut.
- Gunakan endpoint `GET /product-prices/:variant_id/:level_id` untuk mengambil harga saat transaksi.

Tautan teknis: `internal/modules/umkm/pricing/`.
