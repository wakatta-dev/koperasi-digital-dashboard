# Asset API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan contoh request.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/assets` — buat aset baru → 201 `Asset` (objek langsung, tanpa wrapper)
- PUT `/assets/:id` — ubah aset → 200 `Asset` (objek langsung)
- DELETE `/assets/:id` — hapus aset → 204 (tanpa body)
- GET `/assets?limit=..&cursor=..` — daftar aset → 200 `APIResponse{ data=[Asset], meta.pagination }`
- GET `/assets/:id/depreciation?limit=..&cursor=..` — histori depresiasi → 200 `APIResponse{ data=[AssetDepreciation], meta.pagination }`
- PATCH `/assets/:id/status` — ubah status `active|inactive` → 204 (tanpa body)
- GET `/assets/export` — placeholder `{ "message": "export not implemented" }`

## Payload Utama

- AssetRequest (POST/PUT):
  - `code` (string), 
  - `name` (string), 
  - `category` (string)
  - `acquisition_date` (RFC3339), 
  - `acquisition_cost` (number)
  - `depreciation_method` (`straight_line|declining_balance`), 
  - `useful_life_months` (int)
  - `location` (string, opsional)

  Catatan: `acquisition_date` memakai format waktu RFC3339 (contoh: `2025-08-01T00:00:00Z`).

- StatusRequest (PATCH status):
  - `{ "status": "active" | "inactive" }`

## Bentuk Response

- Standar list/histori (dibungkus `APIResponse`):
  - `success` (bool), 
  - `message` (string), 
  - `data` (array), 
  - `meta.pagination` (`next_cursor`, `has_next`, `has_prev`, `limit`), 
  - `errors`

- POST/PUT: objek `Asset` langsung (tidak dibungkus `APIResponse`).
- DELETE/PATCH status: `204 No Content` (tanpa body JSON).

## TypeScript Types (Request & Response)

```ts
// Common
export type Rfc3339String = string;
export type DepreciationMethod = 'straight_line' | 'declining_balance';

// Payloads
export interface AssetRequest {
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: DepreciationMethod;
  useful_life_months: number;
  location?: string;
}

export interface StatusRequest {
  status: 'active' | 'inactive';
}

// Entities
export interface Asset {
  id: number;
  tenant_id: number;
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: DepreciationMethod;
  useful_life_months: number;
  location?: string;
  status: 'active' | 'inactive';
  created_at: Rfc3339String;
}

export interface AssetDepreciation {
  id: number;
  asset_id: number;
  period: Rfc3339String;
  depreciation_amount: number;
  accumulated_depreciation: number;
  book_value: number;
  created_at: Rfc3339String;
}

// API wrapper for list/history endpoints
export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
}

// Endpoint-specific shapes
export type CreateAssetRequest = AssetRequest; // POST /assets
export type CreateAssetResponse = Asset; // 201

export type UpdateAssetRequest = AssetRequest; // PUT /assets/:id
export type UpdateAssetResponse = Asset; // 200

export type DeleteAssetResponse = void; // 204

export interface ListAssetsQuery { // GET /assets
  limit: number;
  cursor?: string;
}
export type ListAssetsResponse = APIResponse<Asset[]>; // 200

export interface GetDepreciationQuery { // GET /assets/:id/depreciation
  limit: number;
  cursor?: string;
}
export type DepreciationHistoryResponse = APIResponse<AssetDepreciation[]>; // 200

export type UpdateAssetStatusRequest = StatusRequest; // PATCH /assets/:id/status
export type UpdateAssetStatusResponse = void; // 204

export interface ExportAssetsResponse { // GET /assets/export
  message: string; // "export not implemented"
}

// Error union you may encounter on POST/PUT/DELETE/PATCH
export type HttpError =
  | APIResponse<null> // when backend uses standardized wrapper
  | { error: string }; // Fiber default error handler
```

## Paginasi (Cursor)

- Kirim `limit` (wajib, int) dan opsional `cursor` (string angka id terakhir).
- Baca `meta.pagination.next_cursor`; jika ada dan `has_next=true`, gunakan nilainya untuk request berikutnya (`cursor=<next_cursor>`).

## Error Singkat yang Perlu Ditangani

- 400 (validasi, untuk list/histori): `APIResponse` dengan `errors` per field, contoh: `{ "errors": { "limit": ["limit is required"] } }`
- 400 (POST/PUT body tidak valid): error JSON standar Fiber dengan pesan singkat.
- 401/403: token salah/tenant tidak aktif.
- 404: resource tidak ditemukan.

## Checklist Integrasi FE

- Pastikan header `Authorization` dan `X-Tenant-ID` selalu dikirim.
- Kirim `acquisition_date` dalam format RFC3339.
- Handle 204 (DELETE/PATCH) tanpa mencoba parse JSON.
- Untuk list/histori, ambil `meta.pagination.next_cursor` dan `has_next` untuk tombol "Muat lebih banyak"/infinite scroll.
- Simpan/mapping `status` (`active|inactive`) untuk kontrol tampilan.

Tautan teknis (opsional): implementasi ada di `internal/modules/asset/*.go` bila diperlukan detail lebih lanjut.
