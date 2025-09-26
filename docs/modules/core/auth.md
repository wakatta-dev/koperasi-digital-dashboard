# Auth API — Panduan Integrasi Frontend (Singkat)

Modul auth menyediakan login, pembaruan token akses, dan logout bagi pengguna tenant internal. Semua response memakai `APIResponse<T>` dan bergantung pada identitas tenant melalui header multi-tenant.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>` (wajib untuk refresh & logout; tidak diperlukan saat login)
- `X-Tenant-ID`: `number` (ikonfirmasi tenant yang aktif)
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Semua endpoint berada di bawah prefix `/auth` untuk seluruh tenant.

- POST `/auth/login` — `internal user`: login dan menerima pasangan token → 200 `APIResponse<LoginResponse>`
- POST `/auth/refresh` — `internal user`: perbarui access token menggunakan refresh token → 200 `APIResponse<RefreshResponse>`
- POST `/auth/logout` — `internal user`: cabut refresh token aktif → 200 `APIResponse<{ message: string }>`

> Login menerima header `X-Tenant-ID` agar akun diarahkan ke tenant yang tepat meskipun Authorization belum tersedia.

## Skema Data Ringkas

- LoginResponse: `id:number`, `nama:string`, `role:string`, `jenis_tenant:string`, `email:string`, `access_token:string`, `refresh_token:string`, `expires_at:number`
- RefreshResponse: `access_token:string`

> Field `expires_at` merupakan epoch detik; gunakan untuk menjadwalkan refresh sebelum token kedaluwarsa.

## Payload Utama

- LoginRequest (login):
  - `email` (string, format email); `password` (string)

- RefreshRequest (refresh token):
  - `{ refresh_token: string }`

- LogoutRequest (cabut token):
  - `{ refresh_token: string }`

- Tidak ada payload tambahan

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` tanpa `meta.pagination`.
- Response logout mengembalikan `{ message: string }` di dalam `data` untuk konfirmasi pencabutan token.

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
type LoginResponse = {
  id: number;
  nama: string;
  role: string;
  jenis_tenant: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix timestamp (seconds)
};

type RefreshResponse = {
  access_token: string;
};

// Requests
type LoginRequest = {
  email: string;
  password: string;
};

type RefreshRequest = {
  refresh_token: string;
};

type LogoutRequest = RefreshRequest;

// Responses
type LoginAPIResponse = APIResponse<LoginResponse>;
type RefreshAPIResponse = APIResponse<RefreshResponse>;
type LogoutAPIResponse = APIResponse<{ message: string }>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Modul auth tidak menyediakan endpoint daftar; `meta.pagination` selalu `undefined`.

## Error Singkat yang Perlu Ditangani

- 400: body tidak dapat diparse atau validasi gagal (`email`, `password`, `refresh_token`).
- 401: kredensial salah saat login atau refresh token tidak valid.
- 403: user dinonaktifkan atau tenant tidak diizinkan masuk.
- 500: kegagalan internal (`login failed`, `refresh failed`).

## Checklist Integrasi FE

- Simpan `access_token` dan `refresh_token` dari login; jadwalkan refresh sebelum `expires_at` habis.
- Selalu kirim header `X-Tenant-ID` saat memanggil endpoint multi-tenant.
- Pastikan logout menghapus token lokal dan memanggil endpoint server agar refresh token dicabut.
- Tampilkan pesan berbeda untuk kredensial salah, akun dinonaktifkan, atau error jaringan.

## Tautan Teknis (Opsional)

- `internal/modules/core/auth/handler.go` — detail pemetaan HTTP.
- `internal/modules/core/auth/service.go` — logika login, refresh, dan logout.
