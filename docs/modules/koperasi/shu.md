# SHU API — Panduan Integrasi Frontend (Singkat)

Modul SHU (Sisa Hasil Usaha) koperasi mengelola input total SHU tahunan, simulasi distribusi kepada anggota, eksekusi distribusi, histori tahunan, histori per anggota, dan ekspor laporan. Endpoint berada di prefix `/api/koperasi/shu`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; role keuangan koperasi bertanggung jawab atas distribusi SHU.

## Ringkasan Endpoint

- POST `/api/koperasi/shu/yearly` — `bendahara`: input total SHU tahun berjalan → 201 `APIResponse<YearlySHU>`
- POST `/api/koperasi/shu/yearly/:year/simulate` — `manajemen` : simulasi distribusi SHU per anggota → 200 `APIResponse<SHUDistribution[]>`
- POST `/api/koperasi/shu/yearly/:year/distribute` — `bendahara`: eksekusi distribusi (`method`, `description`) → 200 `APIResponse<{ status: string }>`
- GET `/api/koperasi/shu/history?term=&year=&limit=&cursor=` — `bendahara`: histori input SHU tahunan → 200 `APIResponse<YearlySHU[]>`
- GET `/api/koperasi/shu/member/:member_id?term=&year=&limit=&cursor=` — `anggota/pengurus`: histori SHU per anggota → 200 `APIResponse<SHUDistribution[]>`
- GET `/api/koperasi/shu/export/:year?format=` — `bendahara`: ekspor laporan SHU (PDF/XLSX) → 200 file

> Distribusi hanya dapat dilakukan setelah input total SHU tahun tersebut tersedia. Simulasi menggunakan data transaksi partisipasi & simpanan anggota.

## Skema Data Ringkas

- YearlySHU: `id:number`, `tenant_id:number`, `year:number`, `total_shu:number`, `allocation_savings:number`, `allocation_participation:number`, `status:'draft'|'distributed'`, `created_at:Rfc3339`, `updated_at:Rfc3339`
- SHUDistribution: `id:number`, `year:number`, `member_id:number`, `member_name:string`, `simpanan:number`, `partisipasi:number`, `amount:number`, `status:'simulated'|'allocated'`, `created_at:Rfc3339`
- SHUReportPayload (ekspor): `year:number`, `total_shu:number`, `allocation_savings:number`, `allocation_participation:number`, `distributions:SHUDistribution[]`

> Field `allocation_*` menandakan presentase/porsi pembagian sehingga FE dapat menampilkan ringkasan pie chart sebelum distribusi.

## Payload Utama

- YearlySHURequest:
  - `{ year: number, total_shu: number, allocation_savings?: number, allocation_participation?: number }`

- DistributionRequest:
  - `{ method: string, description?: string }`

- Filter histori: `term` (cari tahun/keterangan), `year`, `limit` (default 10), `cursor` (ID entri).
- Filter histori anggota: `term`, `year`, `limit` (default 10), `cursor` (ID distribusi).

## Bentuk Response

- Semua endpoint (kecuali ekspor) mengembalikan `APIResponse<T>` dengan `meta.pagination` pada histori.
- Ekspor menghasilkan stream file; header `X-SHU-Year` dan `X-SHU-Total` ikut dikirim sebagai metadata.

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

type YearlySHU = {
  id: number;
  tenant_id: number;
  year: number;
  total_shu: number;
  allocation_savings: number;
  allocation_participation: number;
  status: 'draft' | 'distributed';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type SHUDistribution = {
  id: number;
  year: number;
  member_id: number;
  member_name: string;
  simpanan: number;
  partisipasi: number;
  amount: number;
  status: 'simulated' | 'allocated';
  created_at: Rfc3339String;
};

type YearlySHURequest = {
  year: number;
  total_shu: number;
  allocation_savings?: number;
  allocation_participation?: number;
};

type DistributionRequest = {
  method: string;
  description?: string;
};

type YearlySHUResponse = APIResponse<YearlySHU>;
type SHUDistributionResponse = APIResponse<SHUDistribution[]>;
type SHUHistoryResponse = APIResponse<YearlySHU[]>;
type SHUMemberHistoryResponse = APIResponse<SHUDistribution[]>;
```

> Saat menjalankan simulasi, FE dapat menyimpan hasilnya untuk menampilkan preview sebelum tombol distribusi ditekan.

## Paginasi (Cursor)

- `GET /api/koperasi/shu/history` dan `/api/koperasi/shu/member/:member_id` memakai cursor numerik (`id`). Simpan `meta.pagination.next_cursor` untuk request berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (tahun bukan angka, total SHU <= 0, format cursor salah, format ekspor tidak didukung).
- 401/403: role tidak memiliki akses distribusi.
- 404: data SHU tahunan/distribusi tidak ditemukan.
- 409: distribusi sudah dilakukan (`status distributed`) sehingga tidak dapat dieksekusi lagi.
- 500: kegagalan simulasi atau ekspor (integrasi storage).

## Checklist Integrasi FE

- Validasi total SHU dan porsi alokasi sebelum menyimpan.
- Tampilkan hasil simulasi dalam tabel dan beri opsi ekspor sebelum distribusi riil.
- Pastikan distribusi hanya dapat dilakukan sekali dan tampilkan status `distributed`.
- Sediakan halaman histori anggota agar anggota dapat melihat penerimaan SHU tahun sebelumnya.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/shu/handler.go` — endpoint input, simulasi, distribusi, histori, ekspor.
- `internal/modules/koperasi/shu/service.go` — logika perhitungan, integrasi finance, dan ekspor.
- `internal/modules/koperasi/shu/repository.go` — penyimpanan SHU tahunan dan distribusi anggota.
