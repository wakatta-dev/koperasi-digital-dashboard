# Asset Rental API — Panduan Integrasi Frontend (Singkat)

Sub-modul Rental mencatat penyewaan aset BUMDes, status pembayaran, dan keterkaitan dengan unit usaha. Digunakan oleh pengelola aset untuk memonitor sewa berjalan.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Endpoint berada di prefix `/api/bumdes/assets/:id/rentals` dan mengambil ID aset pada path.

- GET `/api/bumdes/assets/:id/rentals` — `viewer keuangan`: daftar sewa untuk aset → 200 `APIResponse<Rental[]>`
- POST `/api/bumdes/assets/:id/rentals` — `pengelola aset`: buat sewa baru → 201 `APIResponse<Rental>`
- PUT `/api/bumdes/assets/:id/rentals/:rental_id/status` — `pengelola aset`: perbarui status pembayaran → 200 `APIResponse<Rental>`

> Validasi backend mencegah periode sewa saling tumpang tindih dan perubahan status dari `paid` kembali ke `unpaid`.

## Skema Data Ringkas

- Rental: `id:number`, `tenant_id:number`, `asset_id:number`, `business_unit_id?:number`, `renter_name:string`, `rent_start:Rfc3339`, `rent_end:Rfc3339`, `fee:number`, `payment_status:'unpaid'|'paid'`, `created_at:Rfc3339`, `updated_at:Rfc3339`

> `payment_status` awal selalu `unpaid`; transisi ke `paid` dapat memicu pencatatan transaksi keuangan dan notifikasi.

## Payload Utama

- RentalRequest (create):
  - `renter_name` (string, wajib)
  - `rent_start` (RFC3339 datetime, wajib)
  - `rent_end` (RFC3339 datetime, wajib; harus lebih besar dari `rent_start`)
  - `fee` (number, wajib)
  - `business_unit_id?` (number)

- StatusRequest (update status):
  - `{ payment_status: 'unpaid' | 'paid' }`

- Tidak ada payload tambahan; list bebas parameter query.

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<Rental>` atau `APIResponse<Rental[]>` tanpa `meta.pagination`.
- Saat status berubah menjadi `paid`, service dapat mengembalikan payload sewa terbaru setelah sinkronisasi ke modul keuangan.

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
type Rental = {
  id: number;
  tenant_id: number;
  asset_id: number;
  business_unit_id?: number;
  renter_name: string;
  rent_start: Rfc3339String;
  rent_end: Rfc3339String;
  fee: number;
  payment_status: 'unpaid' | 'paid';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

// Requests
type RentalRequest = {
  renter_name: string;
  rent_start: Rfc3339String;
  rent_end: Rfc3339String;
  fee: number;
  business_unit_id?: number;
};

type StatusRequest = {
  payment_status: 'unpaid' | 'paid';
};

// Responses
type ListRentalResponse = APIResponse<Rental[]>;
type CreateRentalResponse = APIResponse<Rental>;
type UpdateRentalStatusResponse = APIResponse<Rental>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Endpoint daftar mengembalikan seluruh sewa untuk aset yang dimaksud tanpa cursor.

## Error Singkat yang Perlu Ditangani

- 400: validasi body gagal (`rent_start >= rent_end`, `fee <= 0`, status di luar enum).
- 401/403: token salah atau role tidak memenuhi middleware.
- 404: aset atau rental tidak ditemukan (ID pada path tidak cocok).
- 409: service dapat mengembalikan pesan error 400 dengan teks "rental period overlaps"; tangani sebagai konflik jadwal di UI.

## Checklist Integrasi FE

- Pastikan pemilihan periode sewa di UI mencegah overlap sebelum submit (contoh: gunakan kalender dengan highlight sewa aktif).
- Jangan tampilkan opsi mengganti status dari `paid` ke `unpaid`, karena backend akan menolak.
- Setelah status `paid`, refresh data agar nilai `payment_status` konsisten dengan hasil service.
- Gunakan `business_unit_id` untuk mengaitkan sewa dengan unit usaha tertentu jika diperlukan laporan.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/asset/rental/handler.go — detail parsing request dan response.
- internal/modules/bumdes/asset/rental/service.go — logika validasi overlap, integrasi finance, dan notifikasi.
