# Asset Report API — Panduan Integrasi Frontend (Singkat)

Sub-modul Report menyediakan ringkasan aset (nilai perolehan, akumulasi penyusutan, nilai buku) dan kemampuan ekspor ke XLSX/PDF serta perubahan status aset.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Endpoint berada di bawah prefix `/bumdes/assets` dengan pembagian role: update status hanya untuk pengelola aset, laporan untuk viewer keuangan.

- PUT `/bumdes/assets/:id/status` — `pengelola aset`: ubah status aset → 204 (tanpa body)
- GET `/bumdes/assets/report` — `viewer keuangan`: ringkasan aset (`status`, `type`) → 200 `APIResponse<Summary>`
- GET `/bumdes/assets/report/export` — `viewer keuangan`: unduh laporan (`status`, `type`, `format=pdf|xlsx`) → 200 file stream

> Query `status` menerima `active`/`inactive`; `type` menyaring berdasarkan tipe aset; `format` default `xlsx`.

## Skema Data Ringkas

- Summary: `total_value:number`, `total_depreciation:number`, `total_book_value:number`, `count:number`, `assets:AssetReportRow[]`
- AssetReportRow: `id:number`, `code:string`, `name:string`, `asset_type:string`, `acquisition_date:Rfc3339`, `acquisition_value:number`, `useful_life_months:number`, `residual_value:number`, `status:'active'|'inactive'`, `accumulated_depreciation:number`, `book_value:number`

> `book_value` dipotong agar tidak lebih kecil dari nilai residu. Gunakan untuk menampilkan nilai buku terkini pada UI.

## Payload Utama

- StatusUpdatePayload (update status):
  - `{ status: 'active' | 'inactive' }`

- Laporan & ekspor memakai query string:
  - `status?` (`'active'|'inactive'`)
  - `type?` (string)
  - `format?` (`'xlsx'|'pdf'`, default `xlsx`)

- Tidak ada payload tambahan.

## Bentuk Response

- Update status mengembalikan HTTP 204 tanpa body.
- Ringkasan laporan mengemas data di `APIResponse<Summary>` tanpa `meta.pagination`.
- Ekspor mengirim binary stream dengan header `Content-Disposition`; FE harus menangani download manual.

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
type AssetReportRow = {
  id: number;
  code: string;
  name: string;
  asset_type: string;
  acquisition_date: Rfc3339String;
  acquisition_value: number;
  useful_life_months: number;
  residual_value: number;
  status: 'active' | 'inactive';
  accumulated_depreciation: number;
  book_value: number;
};

type Summary = {
  total_value: number;
  total_depreciation: number;
  total_book_value: number;
  count: number;
  assets: AssetReportRow[];
};

// Requests
type StatusUpdatePayload = {
  status: 'active' | 'inactive';
};

// Responses
type AssetSummaryResponse = APIResponse<Summary>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Ringkasan laporan mengembalikan seluruh aset yang sesuai filter tanpa cursor.

## Error Singkat yang Perlu Ditangani

- 400: status tidak valid, format ekspor tidak didukung, atau query tidak dapat diparse.
- 401/403: token salah atau role tidak memenuhi middleware.
- 404: aset tidak ditemukan saat mengubah status.
- 500: kegagalan generate file (laporkan ke tim backoffice bila terjadi).

## Checklist Integrasi FE

- Gunakan permintaan GET laporan untuk menampilkan tabel sebelum pengguna menekan tombol ekspor.
- Pastikan UI mengunduh file dari respons `arraybuffer` dan menamai file sesuai header `Content-Disposition`.
- Batasi opsi format ke `xlsx` dan `pdf` agar pengguna tidak mengirim nilai tak didukung.
- Sinkronkan status aset yang diubah dengan memuat ulang daftar aset utama.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/asset/report/handler.go — implementasi endpoint & validasi format.
- internal/modules/bumdes/asset/report/service.go — perhitungan summary dan generator XLSX/PDF.
