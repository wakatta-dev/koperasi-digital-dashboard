# Asset Schedule API — Panduan Integrasi Frontend (Singkat)

Sub-modul Schedule menyimpan jadwal penggunaan aset (blok waktu) untuk membantu menghindari benturan sewa. Endpoint digunakan oleh pengelola aset.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Endpoint menggunakan prefix `/bumdes/assets/:id/schedules` dan menerima ID aset di path.

- GET `/bumdes/assets/:id/schedules` — `viewer keuangan`: daftar jadwal aset → 200 `APIResponse<RentalSchedule[]>`
- POST `/bumdes/assets/:id/schedules` — `pengelola aset`: buat jadwal → 201 `APIResponse<RentalSchedule>`

> Middleware `AssetManagerOnly` membatasi endpoint POST, sedangkan GET dapat diakses role viewer keuangan.

## Skema Data Ringkas

- RentalSchedule: `id:number`, `asset_id:number`, `start_time:Rfc3339`, `end_time:Rfc3339`, `created_at:Rfc3339`, `updated_at:Rfc3339`

> Tidak ada validasi bawaan untuk memastikan `start_time < end_time`; FE wajib memastikan sebelum mengirim request.

## Payload Utama

- ScheduleRequest (create):
  - `start_time` (RFC3339 datetime, wajib)
  - `end_time` (RFC3339 datetime, wajib)

- Tidak ada payload status lain maupun query khusus.

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<RentalSchedule>` atau `APIResponse<RentalSchedule[]>` tanpa `meta.pagination`.

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
type RentalSchedule = {
  id: number;
  asset_id: number;
  start_time: Rfc3339String;
  end_time: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

// Requests
type ScheduleRequest = {
  start_time: Rfc3339String;
  end_time: Rfc3339String;
};

// Responses
type ListScheduleResponse = APIResponse<RentalSchedule[]>;
type CreateScheduleResponse = APIResponse<RentalSchedule>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Endpoint list mengembalikan seluruh jadwal untuk aset terkait tanpa cursor.

## Error Singkat yang Perlu Ditangani

- 400: body tidak dapat diparse (tanggal tidak valid).
- 401/403: token salah atau role tidak sesuai (khususnya POST).
- 404: aset tidak ditemukan.

## Checklist Integrasi FE

- Validasi `end_time` lebih besar dari `start_time` di UI karena backend tidak melakukannya otomatis.
- Gunakan jadwal sebagai referensi saat membuat Rental agar periode booking tidak bertabrakan.
- Pertimbangkan penyesuaian zona waktu di UI; backend menyimpan nilai sesuai timezone request.
- Refresh jadwal setelah membuat entri baru untuk menampilkan hasil terbaru.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/asset/schedule/handler.go — implementasi endpoint REST.
- internal/modules/bumdes/asset/schedule/service.go — logika penyimpanan jadwal.
