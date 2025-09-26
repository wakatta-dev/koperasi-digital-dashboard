# Asset Depreciation API — Panduan Integrasi Frontend (Singkat)

Sub-modul Depreciation menghitung penyusutan aset per periode dan menyediakan histori per aset. Endpoint dirancang untuk dijalankan oleh pengelola aset dari UI administrasi.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Endpoint berbagi prefix `/bumdes/assets` bersama sub-modul aset.

- POST `/bumdes/assets/depreciations/process` — `pengelola aset`: jalankan perhitungan penyusutan (`period`) → 202 `APIResponse<null>`
- GET `/bumdes/assets/:id/depreciations` — `viewer keuangan`: histori penyusutan per aset (`start_date`, `end_date`) → 200 `APIResponse<VillageAssetDepreciation[]>`

> `period` direkomendasikan berupa awal bulan (`YYYY-MM-01T00:00:00Z`); service akan menormalkan ke hari pertama.

## Skema Data Ringkas

- VillageAssetDepreciation: `id:number`, `asset_id:number`, `period_date:Rfc3339 date`, `amount:number`, `accumulated_amount:number`, `created_at:Rfc3339`, `updated_at:Rfc3339`

> Field `accumulated_amount` menunjukkan total penyusutan sampai periode tersebut; gunakan untuk menampilkan nilai buku.

## Payload Utama

- DepreciationProcessRequest (process):
  - `period` (RFC3339 datetime, wajib)

- Query histori:
  - `start_date?` (RFC3339 datetime)
  - `end_date?` (RFC3339 datetime)

- Tidak ada payload tambahan.

## Bentuk Response

- `Process` mengembalikan `APIResponse<null>` dengan status 202 untuk menandakan job selesai sinkron; tidak ada data.
- `History` mengembalikan `APIResponse<VillageAssetDepreciation[]>` tanpa `meta.pagination`.

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
type VillageAssetDepreciation = {
  id: number;
  asset_id: number;
  period_date: Rfc3339String;
  amount: number;
  accumulated_amount: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

// Requests
type DepreciationProcessRequest = {
  period: Rfc3339String;
};

// Responses
type ProcessDepreciationResponse = APIResponse<null>;
type DepreciationHistoryResponse = APIResponse<VillageAssetDepreciation[]>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Histori tidak memakai cursor; gunakan filter tanggal untuk membatasi volume data.

## Error Singkat yang Perlu Ditangani

- 400: `period`, `start_date`, atau `end_date` bukan RFC3339 yang valid.
- 401/403: token salah atau role tidak memenuhi middleware.
- 404: aset tidak ditemukan (ID tidak valid).

## Checklist Integrasi FE

- Kunci tombol proses penyusutan terhadap periode yang sudah pernah dipicu agar tidak terjadi duplikasi visual.
- Konversi input periode UI menjadi waktu UTC awal bulan sebelum dikirim.
- Tampilkan nilai buku (`acquisition_value - accumulated_amount`) agar operator memahami dampak penyusutan.
- Gunakan filter tanggal untuk menghindari pengambilan histori yang panjang pada UI.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/asset/depreciation/handler.go — parsing request & response.
- internal/modules/bumdes/asset/depreciation/service.go — algoritma perhitungan dan idempotensi.
