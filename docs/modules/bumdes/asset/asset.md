# Asset API — Panduan Integrasi Frontend (Singkat)

Sub-modul Asset menangani CRUD aset milik BUMDes (kode, nilai perolehan, umur ekonomis). Endpoint dikelola oleh role pengelola aset dan setiap response memakai `APIResponse<T>`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Endpoint tersedia di prefix `/api/bumdes/assets`.

- GET `/api/bumdes/assets` — `viewer keuangan`: daftar aset → 200 `APIResponse<VillageAsset[]>`
- POST `/api/bumdes/assets` — `pengelola aset`: buat aset → 201 `APIResponse<VillageAsset>`
- GET `/api/bumdes/assets/:id` — `viewer keuangan`: detail aset → 200 `APIResponse<VillageAsset>`
- PUT `/api/bumdes/assets/:id` — `pengelola aset`: ubah aset → 200 `APIResponse<VillageAsset>`

> Middleware `AssetManagerOnly` membatasi POST/PUT pada role pengelola aset, sedangkan GET dapat diakses role keuangan.

## Skema Data Ringkas

- VillageAsset: `id:number`, `code:string`, `name:string`, `asset_type:string`, `location:string|null`, `acquisition_value:number`, `acquisition_date:Rfc3339 date`, `useful_life_months:number`, `residual_value:number`, `status:'active'|'inactive'`, `created_at:Rfc3339`, `updated_at:Rfc3339`

> Field `status` hanya menerima `active`/`inactive`; service secara default menetapkan `active` jika request kosong.

## Payload Utama

- AssetRequest (create/update):
  - `code` (string, wajib & unik)
  - `name` (string, wajib)
  - `asset_type` (string, wajib)
  - `location?` (string)
  - `acquisition_value` (number > 0)
  - `acquisition_date` (RFC3339 date)
  - `useful_life_months` (number > 0)
  - `residual_value?` (number ≥ 0, tidak boleh melebihi `acquisition_value`)
  - `status?` (`'active'|'inactive'`)

- Tidak ada payload status terpisah; perubahan status dilakukan lewat PUT dengan body yang sama.

## Bentuk Response

- Seluruh endpoint mengembalikan `APIResponse<T>`; list menggunakan array langsung (`data` berupa `VillageAsset[]` tanpa pembungkus `items`).
- `meta.pagination` tidak diberikan.

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

// Entities
type VillageAsset = {
  id: number;
  code: string;
  name: string;
  asset_type: string;
  location: string | null;
  acquisition_value: number;
  acquisition_date: Rfc3339String;
  useful_life_months: number;
  residual_value: number;
  status: 'active' | 'inactive';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

// Requests
type AssetRequest = {
  code: string;
  name: string;
  asset_type: string;
  location?: string;
  acquisition_value: number;
  acquisition_date: Rfc3339String;
  useful_life_months: number;
  residual_value?: number;
  status?: 'active' | 'inactive';
};

// Responses
type ListAssetsResponse = APIResponse<VillageAsset[]>;
type CreateAssetResponse = APIResponse<VillageAsset>;
type GetAssetResponse = APIResponse<VillageAsset>;
type UpdateAssetResponse = APIResponse<VillageAsset>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Endpoint daftar mengembalikan seluruh aset tanpa cursor atau `limit`.

## Error Singkat yang Perlu Ditangani

- 400: validasi gagal (`code`, `name`, tanggal, atau `residual_value` > `acquisition_value`).
- 401/403: token invalid atau role tidak memenuhi middleware pengelola aset.
- 404: aset tidak ditemukan saat GET/PUT dengan ID tidak valid.

## Checklist Integrasi FE

- Pastikan UI memaksa input tanggal ke format `YYYY-MM-DD` sebelum dikirim ke backend.
- Validasi pada FE bahwa `residual_value` tidak melebihi nilai perolehan untuk menghindari roundtrip error.
- Tampilkan status aset sebagai toggle agar memudahkan aktivasi/non-aktivasi tanpa body tambahan.
- Gunakan kode aset unik; tampilkan pesan error backend bila duplikat.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/asset/asset/handler.go — definisi endpoint HTTP.
- internal/modules/bumdes/asset/asset/service.go — validasi bisnis dan normalisasi status.
