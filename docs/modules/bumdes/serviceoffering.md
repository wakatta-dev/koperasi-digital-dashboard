# Service Offering API — Panduan Integrasi Frontend (Singkat)

Modul Service Offering mengelola katalog layanan/jasa per unit usaha BUMDes, lengkap dengan harga dasar, durasi layanan, metadata, dan status aktif. Endpoint mendukung pagination cursor dan wajib menggunakan header unit usaha.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `X-Business-Unit-ID`: `number` (wajib untuk semua endpoint)
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Endpoint tersedia di prefix `/bumdes/service-offerings`. Role pengelola (`SuperAdmin|Manajer|Admin BUMDes|Admin Unit`) dapat membuat/mengubah/hapus; role kasir hanya dapat membaca.

- GET `/bumdes/service-offerings` — `pengguna unit`: daftar layanan (`limit`, `cursor`, `q`, `only_active`) → 200 `APIResponse<ListResponse>`
- POST `/bumdes/service-offerings` — `pengelola unit`: buat layanan baru → 201 `APIResponse<ServiceOffering>`
- GET `/bumdes/service-offerings/:id` — `pengguna unit`: detail layanan → 200 `APIResponse<ServiceOffering>`
- PATCH `/bumdes/service-offerings/:id` — `pengelola unit`: ubah layanan → 200 `APIResponse<ServiceOffering>`
- DELETE `/bumdes/service-offerings/:id` — `pengelola unit`: hapus layanan → 204 (tanpa body)

> Header `X-Business-Unit-ID` menentukan konteks unit. Backend menolak jika request body memakai unit berbeda.

## Skema Data Ringkas

- ServiceOffering: `id:number`, `tenant_id:number`, `business_unit_id:number`, `name:string`, `description:string`, `base_price:number`, `duration_minutes:number|null`, `metadata:Record<string,any>`, `is_active:boolean`, `created_at:Rfc3339`, `updated_at:Rfc3339`
- ListResponse: `items:ServiceOffering[]`

> Field `metadata` bertipe JSON bebas; gunakan objek rata untuk menyimpan atribut tambahan (misal: kategori, tag).

## Payload Utama

- CreateRequest (create):
  - `business_unit_id` (number, wajib; harus sama dengan header)
  - `name` (string, wajib)
  - `description?` (string)
  - `base_price` (number ≥ 0)
  - `duration_minutes?` (number > 0)
  - `metadata?` (object)
  - `is_active?` (boolean, default `true`)

- UpdateRequest (partial update via PATCH):
  - `name?` (string ≥ 1)
  - `description?` (string)
  - `base_price?` (number ≥ 0)
  - `duration_minutes?` (number > 0)
  - `metadata?` (object)
  - `is_active?` (boolean)

- Tidak ada payload status terpisah; ubah aktif/nonaktif melalui PATCH dengan `is_active`.

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` kecuali DELETE (204).
- List endpoint mengembalikan `meta.pagination` dengan `next_cursor`, `has_next`, `has_prev`, `limit`; `cursor` adalah ID numerik terakhir.

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
type ServiceOffering = {
  id: number;
  tenant_id: number;
  business_unit_id: number;
  name: string;
  description: string | null;
  base_price: number;
  duration_minutes: number | null;
  metadata: Record<string, unknown> | null;
  is_active: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type ListResponse = {
  items: ServiceOffering[];
};

// Requests
type CreateServiceOfferingRequest = {
  business_unit_id: number;
  name: string;
  description?: string;
  base_price: number;
  duration_minutes?: number;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
};

type UpdateServiceOfferingRequest = {
  name?: string;
  description?: string;
  base_price?: number;
  duration_minutes?: number;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
};

// Responses
type ListServiceOfferingResponse = APIResponse<ListResponse>;
type CreateServiceOfferingResponse = APIResponse<ServiceOffering>;
type GetServiceOfferingResponse = APIResponse<ServiceOffering>;
type UpdateServiceOfferingResponse = APIResponse<ServiceOffering>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- `limit` default 10 bila tidak diisi; kirim nilai positif > 0.
- `cursor` adalah ID terakhir pada batch sebelumnya; FE harus meneruskan `meta.pagination.next_cursor` untuk memuat halaman berikutnya.
- `has_prev` bernilai true bila request memakai `cursor` non nol, tetapi backend belum menyediakan endpoint balikan mundur.

## Error Singkat yang Perlu Ditangani

- 400: header `X-Business-Unit-ID` hilang/tidak valid, body gagal validasi, `limit` bukan angka positif, atau `cursor` bukan angka.
- 401/403: token salah atau role tidak memenuhi middleware.
- 404: layanan tidak ditemukan atau tidak sesuai unit.
- 409: mismatch `business_unit_id` antara header dan body menghasilkan 400 dengan pesan `business_unit_id mismatch` (perlakukan sebagai konflik input).

## Checklist Integrasi FE

- Kirim header `X-Business-Unit-ID` di seluruh request; simpannya di session konten dashboard unit.
- Saat membuat atau mengubah layanan, sinkronkan `business_unit_id` pada body dengan header untuk menghindari error.
- Gunakan `only_active=true` untuk katalog pelanggan agar layanan nonaktif tidak tampil.
- Implementasi pencarian pakai parameter `q` yang cocok terhadap `name` dan `description`.
- Simpan `next_cursor` dan `has_next` untuk tombol "Muat lebih"; kosongkan daftar ketika filter berubah.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/serviceoffering/handler.go — validasi header dan routing.
- internal/modules/bumdes/serviceoffering/service.go — logika bisnis dan pembuatan pagination meta.
- internal/modules/bumdes/serviceoffering/repository.go — implementasi filter dan cursor pada level database.
