# Inventory API — Panduan Integrasi Frontend (Singkat)

Modul inventory menyediakan pengelolaan produk, stok, serta pergerakan stok untuk tenant UMKM, BUMDes, dan koperasi (dengan fitur diaktifkan). Endpoint memerlukan peran tertentu serta, untuk tenant multi-unit, header `X-Business-Unit-ID`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- `X-Business-Unit-ID`: `number` (opsional; wajib untuk tenant BUMDes atau saat mengelola stok per unit)
- Tidak ada header tambahan

## Ringkasan Endpoint

Seluruh route berada di prefix `/api/products`, `/api/stocks`, dan `/api/stock-movements`.

- POST `/api/products` — `inventory manager`: buat produk beserta varian → 201 `APIResponse<Product>`
- POST `/api/products/:id/media` — `inventory manager`: unggah media produk → 200 `APIResponse<Product>`
- GET `/api/products?q=&limit=&cursor=` — `inventory staff`: daftar produk tenant → 200 `APIResponse<ListProductsResponse>`
- PATCH `/api/products/:id` — `inventory manager`: perbarui produk → 200 `APIResponse<Product>`
- DELETE `/api/products/:id` — `inventory manager`: hapus produk → 204 (body kosong)
- GET `/api/stocks/:variant_id` — `inventory staff`: stok terkini varian → 200 `APIResponse<StockLevel>`
- GET `/api/stock-movements?variant_id=&type=&limit=&cursor=` — `inventory staff`: histori pergerakan stok → 200 `APIResponse<StockMovement[]>`
- POST `/api/stock-movements` — `inventory staff`: catat pergerakan stok (`operation=in|out`) → 201 `APIResponse<AdjustStockResponse>`

> Middleware membatasi akses per peran (`super_admin_umkm`, `admin_umkm`, `pemilik_toko`, `staff_gudang`, `kasir`, dsb). Tenant koperasi harus diwhitelist (`IsKoperasiInventoryEnabled`).

## Skema Data Ringkas

- Product: `id:number`, `tenant_id:number`, `business_unit_id?:number`, `category_id?:number`, `sku:string`, `name:string`, `description?:string`, `base_unit:string`, `attributes:Record<string,unknown>`, `is_active:boolean`, `media:ProductMedia[]`, `variants:ProductVariant[]`, audit metadata
- ProductVariant: `id:number`, `product_id:number`, `sku:string`, `name:string`, `attributes:Record<string,unknown>`, `is_active:boolean`, `prices:ProductPrice[]`
- ProductPrice: `id:number`, `price_level_id:number`, `price:number`
- ProductMedia: `id:number`, `url:string`, `type?:string`, `metadata?:Record<string,unknown>`, `created_at:Rfc3339`
- ListProductsResponse: `{ items: Product[] }`
- StockLevel: `id:number`, `business_unit_id?:number`, `product_variant_id:number`, `current_qty:number`
- StockMovement: `id:number`, `product_variant_id:number`, `business_unit_id?:number`, `qty_change:number`, `type:string`, `reference:string`, `note?:string`, `created_by?:number`, `created_at:Rfc3339`
- AdjustStockResponse: `{ movement: StockMovement, stock: StockLevel }`

> Field `attributes` disimpan sebagai JSON map fleksibel; FE harus menjaga konsistensi format (misal `color`, `size`). Harga per varian direlasikan via `price_level_id` untuk tiering.

## Payload Utama

- CreateProductRequest / UpdateProductRequest:
  - `category_id` (number), `sku` (string), `name` (string), `description?` (string), `base_unit` (string), `attributes?` (Record), `media?` (`{ url:string, type?:string, metadata?:Record }[]`), `variants` (`VariantRequest[]`)
  - VariantRequest: `{ sku:string, name:string, attributes?:Record, prices?:{ level_id:number, price:number }[] }`

- UploadProductMedia:
  - Multipart `form-data` dengan field `file` (MIME gambar, ≤2 MB). Response membawa produk terbaru beserta media.

- AdjustStockRequest:
  - `{ variant_id: number, business_unit_id?: number, qty: number (>0), operation: 'in'|'out', type: string, reference: string, note?: string }`

- Header `X-Business-Unit-ID` dapat menggantikan field `business_unit_id` bila diteruskan via middleware; tetap sertakan di payload untuk movement jika dibutuhkan historinya.

## Bentuk Response

- Semua endpoint menggunakan `APIResponse<T>` kecuali DELETE (204 tanpa body).
- `GET /products` mengembalikan `ListProductsResponse` di dalam `data` plus `meta.pagination`.
- Stok dan pergerakan menampilkan entitas lengkap termasuk relasi awal (varians, media).

## TypeScript Types (Request & Response)

```ts
// Common
type Rfc3339String = string;

type Pagination = {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
};

type Meta = {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
};

type MediaResource = {
  url: string;
  type?: string;
  metadata?: Record<string, unknown>;
};

type PriceRequest = {
  level_id: number;
  price: number;
};

type Variant = {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  attributes?: Record<string, unknown>;
  is_active: boolean;
  prices: { id: number; price_level_id: number; price: number }[];
};

type Product = {
  id: number;
  tenant_id: number;
  business_unit_id?: number;
  category_id?: number;
  sku: string;
  name: string;
  description?: string;
  base_unit: string;
  attributes?: Record<string, unknown>;
  is_active: boolean;
  media?: MediaResource[];
  variants: Variant[];
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type ListProductsResponse = {
  items: Product[];
};

type StockLevel = {
  id: number;
  business_unit_id?: number;
  product_variant_id: number;
  current_qty: number;
};

type StockMovement = {
  id: number;
  product_variant_id: number;
  business_unit_id?: number;
  qty_change: number;
  type: string;
  reference: string;
  note?: string;
  created_by?: number;
  created_at: Rfc3339String;
};

type AdjustStockResponse = {
  movement: StockMovement;
  stock: StockLevel;
};

// Requests
type CreateProductRequest = {
  category_id?: number;
  sku: string;
  name: string;
  description?: string;
  base_unit: string;
  attributes?: Record<string, unknown>;
  media?: MediaResource[];
  variants: Array<{
    sku: string;
    name: string;
    attributes?: Record<string, unknown>;
    prices?: PriceRequest[];
  }>;
};

type UpdateProductRequest = CreateProductRequest;

type AdjustStockRequest = {
  variant_id: number;
  business_unit_id?: number;
  qty: number;
  operation: 'in' | 'out';
  type: string;
  reference: string;
  note?: string;
};

// Responses
type ProductListResponse = APIResponse<ListProductsResponse>;
type ProductMutationResponse = APIResponse<Product>;
type StockLevelResponse = APIResponse<StockLevel>;
type AdjustStockResponseWrapper = APIResponse<AdjustStockResponse>;
```

> Gunakan type alias agar selaras dengan definisi FE SDK dan memudahkan reuse pada modul POS/Marketplace yang berbagi entitas produk.

## Paginasi (Cursor)

- `GET /products` memakai cursor numerik (`id`) dengan `limit` default 10.
- `meta.pagination.next_cursor` dikirim saat memiliki data lanjutan; kirim kembali sebagai query `cursor`.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid, `limit/cursor` salah, atau header `X-Business-Unit-ID` tidak berupa angka.
- 401: konteks tenant/user hilang (`tenant not set`, `user not set`).
- 403: role tidak berhak (`ErrRoleForbidden`) atau inventory tidak diaktifkan untuk tenant.
- 404: produk/varian tidak ditemukan saat update/hapus/stok.
- 500: kegagalan internal (repositori, auditing) — tampilkan pesan umum dan sarankan pengguna mencoba ulang.

## Checklist Integrasi FE

- Sertakan header `X-Business-Unit-ID` untuk tenant multi-unit agar stok tercatat pada unit tepat.
- Terapkan validasi SKU unik di sisi UI sebelum submit untuk mengurangi error backend.
- Sinkronkan stok setelah melakukan movement; tampilkan history movement bila diperlukan.
- Gunakan `operation` dan `type` untuk membedakan sumber pergerakan (pembelian, penyesuaian, retur, dll).
- Sesuaikan form varian dengan struktur `prices` untuk level pelanggan (grosir, ecer).

## Tautan Teknis (Opsional)

- `internal/modules/core/inventory/handler.go` — implementasi endpoint & guard role.
- `internal/modules/core/inventory/service.go` — logika bisnis produk dan stok.
- `internal/modules/core/inventory/entity.go` — definisi entitas produk/varian/stok.
