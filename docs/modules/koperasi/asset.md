# Asset API — Panduan Integrasi Frontend (Singkat)

Modul aset koperasi menangani pendataan aset tetap, riwayat penyusutan, pencatatan penggunaan, perubahan status, dan ekspor laporan aset. Endpoint berada di bawah prefix `/koperasi/assets`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; middleware `AssetManagerOnly` dan `FinanceViewerOnly` mengatur hak akses.

## Ringkasan Endpoint

- POST `/koperasi/assets` — `manajer aset`: tambah aset → 201 `Asset`
- PUT `/koperasi/assets/:id` — `manajer aset`: ubah aset → 200 `Asset`
- DELETE `/koperasi/assets/:id` — `manajer aset`: hapus aset → 204
- GET `/koperasi/assets?term=&category=&status=&start_date=&end_date=&limit=&cursor=` — `viewer keuangan`: daftar aset → 200 `APIResponse<Asset[]>`
- GET `/koperasi/assets/:id/depreciation?term=&start_date=&end_date=&limit=&cursor=` — `viewer keuangan`: riwayat penyusutan → 200 `APIResponse<AssetDepreciation[]>`
- POST `/koperasi/assets/:id/usages` — `manajer aset`: catat penggunaan → 201 `AssetUsage`
- GET `/koperasi/assets/:id/usages?term=&start_date=&end_date=&limit=&cursor=` — `viewer keuangan`: riwayat penggunaan → 200 `APIResponse<AssetUsage[]>`
- PATCH `/koperasi/assets/:id/status` — `manajer aset`: ubah status aset → 204
- GET `/koperasi/assets/export?type=&format=&term=&category=&status=&start_date=&end_date=` — `viewer keuangan`: ekspor aset/depresiasi (PDF/XLSX) → 200 file

> Endpoint ekspor menghasilkan berkas biner dengan nama `assets_{timestamp}.pdf/xlsx` atau `depreciations_{timestamp}` sesuai parameter `type`.

## Skema Data Ringkas

- Asset: `id:number`, `tenant_id:number`, `code:string`, `name:string`, `category:string`, `acquisition_date:Rfc3339`, `acquisition_cost:number`, `depreciation_method:string`, `useful_life_months:number`, `location:string`, `status:'active'|'inactive'`, audit timestamp.
- AssetDepreciation: `id:number`, `asset_id:number`, `period:Rfc3339`, `amount:number`, `accumulated:number`
- AssetUsage: `id:number`, `asset_id:number`, `used_by:string`, `purpose:string`, `start_time:Rfc3339`, `end_time?:Rfc3339`, `notes:string`

> Penyusutan dihitung secara periodik dan tersimpan terpisah; panggil endpoint penyusutan untuk menampilkan grafik nilai buku.

## Payload Utama

- AssetRequest:
  - `{ code: string, name: string, category: string, acquisition_date: Rfc3339String, acquisition_cost: number, depreciation_method: string, useful_life_months: number, location: string }`

- StatusRequest:
  - `{ status: 'active' | 'inactive' }`

- AssetUsageRequest:
  - `{ used_by: string, purpose: string, start_time: Rfc3339String, end_time?: Rfc3339String, notes?: string }`

- Filter list aset: `term`, `category`, `status`, `start_date`, `end_date`, `limit` (default 10), `cursor` (ID aset).
- Filter penyusutan/penggunaan mirip dengan tambahan `term` (ID/peruntukan).

## Bentuk Response

- `Create/Update` mengembalikan objek `Asset` langsung (legacy). Endpoint list/riwayat memakai `APIResponse<T>` beserta `meta.pagination`.
- `Export` mengembalikan stream file; perhatikan header `Content-Disposition` untuk nama file.

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

type Asset = {
  id: number;
  tenant_id: number;
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: string;
  useful_life_months: number;
  location: string;
  status: 'active' | 'inactive';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type AssetDepreciation = {
  id: number;
  asset_id: number;
  period: Rfc3339String;
  amount: number;
  accumulated: number;
};

type AssetUsage = {
  id: number;
  asset_id: number;
  used_by: string;
  purpose: string;
  start_time: Rfc3339String;
  end_time?: Rfc3339String;
  notes?: string;
};

type AssetRequest = {
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: string;
  useful_life_months: number;
  location: string;
};

type AssetUsageRequest = {
  used_by: string;
  purpose: string;
  start_time: Rfc3339String;
  end_time?: Rfc3339String;
  notes?: string;
};

type AssetListResponse = APIResponse<Asset[]>;
type AssetDepreciationResponse = APIResponse<AssetDepreciation[]>;
type AssetUsageResponse = APIResponse<AssetUsage[]>;
```

> Pastikan FE memastikan format tanggal `RFC3339` untuk filter tanggal agar tidak ditolak backend (`invalid start_date/end_date`).

## Paginasi (Cursor)

- `GET /koperasi/assets`, `/:id/depreciation`, dan `/:id/usages` memakai cursor numerik (`id`) dengan `limit` default 10. Gunakan `meta.pagination.next_cursor` untuk permintaan berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (`acquisition_cost <= 0`, tanggal salah format, cursor bukan angka), format ekspor tidak didukung.
- 401/403: role tidak memenuhi middleware (mis. `FinanceViewerOnly`).
- 404: aset/riwayat tidak ditemukan.
- 500: kegagalan ekspor atau pencatatan (integrasi storage/finance).

## Checklist Integrasi FE

- Gunakan form validasi untuk memastikan nilai numerik dan tanggal sebelum submit.
- Tampilkan status aset (`active/inactive`) dan sediakan aksi toggle via endpoint status.
- Saat menampilkan penyusutan, gunakan data `amount` dan `accumulated` untuk menghitung nilai buku.
- Sediakan opsi ekspor (PDF/XLSX) dengan indikator loading karena response berupa file.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/asset/handler.go` — endpoint CRUD aset, penyusutan, penggunaan, ekspor.
- `internal/modules/koperasi/asset/service.go` — logika bisnis penyusutan otomatis & ekspor.
- `internal/modules/koperasi/asset/repository.go` — kueri aset, penyusutan, dan penggunaan.
