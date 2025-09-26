# Pricing API — Panduan Integrasi Frontend (Singkat)

Modul pricing UMKM menyediakan pengelolaan level harga, penetapan harga per varian produk, serta preferensi harga per kontak. Semua endpoint berada di prefix `/umkm/pricing` (secara internal diregistrasi di modul `internal/modules/umkm/pricing`).

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; role pengelola katalog UMKM wajib.

## Ringkasan Endpoint

- POST `/umkm/pricing/price-levels` — `admin UMKM`: buat level harga → 201 `PriceLevel`
- GET `/umkm/pricing/price-levels?limit=&cursor=` — `admin UMKM`: daftar level harga → 200 `APIResponse<PriceLevel[]>`
- PATCH `/umkm/pricing/price-levels/:id` — `admin UMKM`: ubah level harga → 200 `PriceLevel`
- DELETE `/umkm/pricing/price-levels/:id` — `admin UMKM`: hapus level harga → 204
- POST `/umkm/pricing/price-levels/contact-levels` — `admin UMKM`: tetapkan level harga default untuk kontak → 200 `ContactPricePreference`
- POST `/umkm/pricing/product-prices` — `admin UMKM`: tetapkan harga untuk varian produk di level tertentu → 201 `ProductPrice`
- GET `/umkm/pricing/product-prices/:variant_id/:level_id` — `admin UMKM`: ambil harga varian pada level tertentu → 200 `ProductPrice`

> Level harga dapat ditandai `is_default` untuk fallback ketika kontak belum punya preferensi khusus.

## Skema Data Ringkas

- PriceLevel: `id:number`, `tenant_id:number`, `name:string`, `code:string`, `is_default:boolean`
- ProductPrice: `id:number`, `tenant_id:number`, `product_variant_id:number`, `price_level_id:number`, `price:number`
- ContactPricePreference: `id:number`, `tenant_id:number`, `contact_id:number`, `price_level_id:number`, `created_at:Rfc3339`, `updated_at:Rfc3339`

> Repository memastikan kombinasi `(tenant_id, code)` unik sehingga FE harus menolak kode duplikat sebelum submit.

## Payload Utama

- PriceLevelRequest:
  - `{ name: string, code?: string, is_default?: boolean }`

- ProductPriceRequest:
  - `{ variant_id: number, level_id: number, price: number }`

- AssignContactLevelRequest:
  - `{ contact_id: number, level_id: number }`

- List level query: `limit` (default 10), `cursor` (ID level).

## Bentuk Response

- `CreateLevel/UpdateLevel/AssignPrice/AssignContactLevel` mengembalikan objek yang baru dibuat tanpa `APIResponse` wrapper (legacy). Endpoint list dan get price menggunakan `APIResponse<T>`.

## TypeScript Types (Request & Response)

```ts
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

type PriceLevel = {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
  is_default: boolean;
};

type ProductPrice = {
  id: number;
  tenant_id: number;
  product_variant_id: number;
  price_level_id: number;
  price: number;
};

type ContactPricePreference = {
  id: number;
  tenant_id: number;
  contact_id: number;
  price_level_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type PriceLevelRequest = {
  name: string;
  code?: string;
  is_default?: boolean;
};

type ProductPriceRequest = {
  variant_id: number;
  level_id: number;
  price: number;
};

type AssignContactLevelRequest = {
  contact_id: number;
  level_id: number;
};

type PriceLevelListResponse = APIResponse<PriceLevel[]>;
type ProductPriceResponse = APIResponse<ProductPrice>;
```

> Setelah menetapkan harga baru, FE sebaiknya melakukan refresh data varian agar harga sesuai level muncul pada katalog.

## Paginasi (Cursor)

- `GET /umkm/pricing/price-levels` memakai cursor numerik (`id`) dengan `limit` default 10.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (`price <= 0`, ID bukan angka, cursor salah format), kode level duplikat.
- 401/403: role tidak diizinkan mengatur pricing.
- 404: level, varian produk, atau kontak tidak ditemukan.
- 409: mencoba menghapus level default yang sedang dipakai (dikembalikan sebagai error 400 dengan pesan spesifik).
- 500: kegagalan penyimpanan harga atau pembaruan preferensi.

## Checklist Integrasi FE

- Validasi kode level agar unik di sisi klien untuk menghindari roundtrip error.
- Saat mengubah level default, refresh daftar kontak untuk memperlihatkan level harga baru.
- Pastikan UI menampilkan harga berbeda berdasarkan kombinasi level dan varian.
- Tampilkan indikator saat menyimpan perubahan agar user tahu update berhasil.

## Tautan Teknis (Opsional)

- `internal/modules/umkm/pricing/handler.go` — endpoint level, harga, dan preferensi kontak.
- `internal/modules/umkm/pricing/service.go` — logika bisnis dan integrasi repository.
- `internal/modules/umkm/pricing/repository.go` — kueri level, harga, preferensi kontak.
