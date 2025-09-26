# Booking API — Panduan Integrasi Frontend (Singkat)

Modul booking menyediakan tampilan kalender pemakaian aset/unit yang dihasilkan dari data order marketplace. Endpoint hanya membaca data dan membantu UI menampilkan keterisian per hari/minggu.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Endpoint berada di prefix `/bumdes/bookings` dengan akses role `SuperAdmin|Manajer|Admin BUMDes|Admin Unit|Kasir Unit`.

- GET `/bumdes/bookings/calendar` — `pengelola unit`: kalender pemakaian (`view=weekly|monthly`, `start`, `end`, `unit_id`) → 200 `APIResponse<CalendarView>`

> Parameter `start` dan `end` opsional; bila kosong service menghitung periode sesuai `view`. `unit_id` menyaring booking per unit usaha.

## Skema Data Ringkas

- CalendarView: `view:'weekly'|'monthly'`, `period_start:Rfc3339`, `period_end:Rfc3339`, `unit_id?:number`, `weeks:CalendarWeek[]`, `days:CalendarDay[]`
- CalendarWeek: `start:Rfc3339`, `end:Rfc3339`, `days:CalendarDay[]`
- CalendarDay: `date:Rfc3339`, `weekday:string`, `bookings:CalendarEntry[]`, `occupancy:number(0-1)`, `is_current_month:boolean`
- CalendarEntry: `id:number`, `order_id:number`, `business_unit_id?:number`, `unit_name?:string`, `status:'reserved'|'confirmed'|'paid'`, `start_date?:Rfc3339`, `end_date?:Rfc3339`

> `occupancy` merepresentasikan rasio keterisian (0–1). UI dapat mengubahnya menjadi persentase.

## Payload Utama

- Tidak ada body request; gunakan query string:
  - `view` default `weekly` (`monthly` menambahkan daftar `days` lengkap satu bulan)
  - `start`, `end` (format `YYYY-MM-DD`) menimpa rentang default
  - `unit_id` (number) membatasi kalender untuk unit tertentu

- Tidak ada payload status atau endpoint tambahan.

## Bentuk Response

- Response tunggal `APIResponse<CalendarView>`; `meta.pagination` selalu `undefined`.
- Field `weeks` berisi susunan minggu untuk tampilan monthly; UI bebas memilih memakai `weeks` atau `days`.

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
type CalendarEntry = {
  id: number;
  order_id: number;
  business_unit_id?: number;
  unit_name?: string;
  status: 'reserved' | 'confirmed' | 'paid';
  start_date?: Rfc3339String;
  end_date?: Rfc3339String;
};

type CalendarDay = {
  date: Rfc3339String;
  weekday: string;
  bookings: CalendarEntry[];
  occupancy: number; // 0..1
  is_current_month: boolean;
};

type CalendarWeek = {
  start: Rfc3339String;
  end: Rfc3339String;
  days: CalendarDay[];
};

type CalendarView = {
  view: 'weekly' | 'monthly';
  period_start: Rfc3339String;
  period_end: Rfc3339String;
  unit_id?: number;
  weeks: CalendarWeek[];
  days: CalendarDay[];
};

// Responses
type CalendarAPIResponse = APIResponse<CalendarView>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Endpoint kalender tidak mendukung cursor, `limit`, maupun pagination lainnya.

## Error Singkat yang Perlu Ditangani

- 400: `view` tidak dikenal, `start/end` bukan `YYYY-MM-DD`, atau `unit_id` bukan angka positif.
- 401/403: token salah atau role tidak memenuhi middleware `RequireRoles`.

## Checklist Integrasi FE

- Gunakan default `view=weekly` untuk dashboard; ubah ke `monthly` hanya bila perlu tampilan kalender penuh.
- Terapkan fallback ketika `bookings` kosong agar UI tetap menampilkan grid tanggal tanpa error.
- Interpretasi `occupancy` sebagai persentase (misal `occupancy * 100`) untuk indikator kapasitas.
- Sinkronkan filter tanggal UI dengan parameter `start`/`end` agar respons tidak perlu difilter ulang di FE.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/booking/handler.go — parsing query dan response JSON.
- internal/modules/bumdes/booking/service.go — logika pembentukan kalender & agregasi occupancy.
