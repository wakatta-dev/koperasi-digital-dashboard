# SHU API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/shu/yearly` — input SHU tahunan → 201 `APIResponse<YearlySHU>`
- POST `/shu/yearly/:year/simulate` — simulasi distribusi → 200 `APIResponse<SHUDistribution[]>`
- POST `/shu/yearly/:year/distribute` — distribusi aktual → 200 `APIResponse<{ status: string }>`
- GET `/shu/history` — riwayat SHU tahunan → 200 `APIResponse<YearlySHU[]>` (query: `term?`, `year?`, `limit?`, `cursor?`)
- GET `/shu/member/:member_id` — riwayat SHU anggota → 200 `APIResponse<SHUDistribution[]>` (query: `term?`, `year?`, `limit?`, `cursor?`)
- GET `/shu/export/:year` — ekspor laporan → 200 file

## Skema Data Ringkas

- YearlySHU: `id`, `tenant_id`, `year`, `total_shu`, `status`, `created_at`
- SHUDistribution: `id`, `shu_year_id`, `member_id`, `contribution_savings`, `contribution_participation`, `distributed_amount`, `distributed_at?`

## Payload Utama

- YearlySHURequest:
  - `year` (number), `total_shu` (number)

- DistributionRequest:
  - `method` (string), `description` (string)

## Bentuk Response

- Semua endpoint di atas mengembalikan `APIResponse<T>` kecuali ekspor (file).

## TypeScript Types (Request & Response)

```ts
// Common
export type Rfc3339String = string;

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

// Entities
export interface YearlySHU {
  id: number;
  tenant_id: number;
  year: number;
  total_shu: number;
  status: string;
  created_at: Rfc3339String;
}

export interface SHUDistribution {
  id: number;
  shu_year_id: number;
  member_id: number;
  contribution_savings: number;
  contribution_participation: number;
  distributed_amount: number;
  distributed_at?: Rfc3339String;
}

// Requests
export interface YearlySHURequest { year: number; total_shu: number }
export interface DistributionRequest { method: string; description: string }

// Responses
export type InputYearlySHUResponse = APIResponse<YearlySHU>;
export type SimulateSHUResponse = APIResponse<SHUDistribution[]>;
export type DistributeSHUResponse = APIResponse<{ status: string }>;
export type ListYearlySHUResponse = APIResponse<YearlySHU[]>;
export type MemberSHUHistoryResponse = APIResponse<SHUDistribution[]>;
// Export returns a file
```

## Paginasi (Cursor)

Endpoint `/shu/history` dan `/shu/member/:member_id` mendukung paginasi berbasis cursor.

- Query: `limit` (default 10), `cursor` (ID terakhir), `term` (pencarian tahun), `year` (filter tahun)
- Response `meta.pagination` berisi `next_cursor`, `has_next`, `has_prev`, dan `limit`.

## Error Singkat yang Perlu Ditangani

- 400: body/path tidak valid.
- 401/403: token salah/tenant tidak aktif.
- 404: data tahun/anggota tidak ditemukan.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Jalankan simulasi sebelum distribusi untuk memvalidasi alokasi.
- Tangani output file pada ekspor (unduhan).

Tautan teknis (opsional): implementasi ada di `internal/modules/koperasi/shu/*.go` bila diperlukan detail lebih lanjut.

