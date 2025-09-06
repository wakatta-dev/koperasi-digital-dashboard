# Auth API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, dan contoh request. Struktur dan poin mengikuti template Asset agar konsisten di semua modul.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

Catatan: Endpoint Auth (login/refresh/logout) tidak memerlukan `Authorization` header, namun tetap memerlukan `X-Tenant-ID` untuk konteks tenant.

## Ringkasan Endpoint

- POST `/auth/login` — autentikasi, terima `access_token` + `refresh_token` → 200 `APIResponse<LoginResponse>`
- POST `/auth/refresh` — buat `access_token` baru dari `refresh_token` → 200 `APIResponse<RefreshResponse>`
- POST `/auth/logout` — hapus `refresh_token` aktif → 200 `APIResponse<{ message: string }>`

## Skema Data Ringkas

- LoginResponse: `id`, `nama`, `role`, `jenis_tenant`, `email`, `access_token`, `refresh_token`, `expires_at`
- RefreshResponse: `access_token`
- JWT Claims (impl): `user_id`, `tenant_id`, `tenant_type`, `role`, `exp`, `iat`

## Payload Utama

- LoginRequest (POST /auth/login):
  - `email` (string, wajib, email valid)
  - `password` (string, wajib)

- RefreshRequest (POST /auth/refresh, /auth/logout):
  - `refresh_token` (string, wajib)

## Bentuk Response

- Semua endpoint pada modul Auth dibungkus `APIResponse<T>`:
  - `success` (bool), `message` (string), `data` (objek), `meta` (`request_id`, `timestamp`), `errors`

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

// Payloads
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

// Responses
export interface LoginResponse {
  id: number;
  nama: string;
  role: string;
  jenis_tenant: string; // vendor|koperasi|umkm|bumdes
  email: string;
  access_token: string;
  refresh_token: string; // only returned on login
  expires_at: number; // unix seconds
}

export interface RefreshResponse {
  access_token: string;
}

// Endpoint-specific
export type LoginEndpointResponse = APIResponse<LoginResponse>;
export type RefreshEndpointResponse = APIResponse<RefreshResponse>;
export type LogoutEndpointResponse = APIResponse<{ message: string }>;

// Error union possibly returned
export type HttpError = APIResponse<null>;
```

## Paginasi (Cursor)

- Tidak ada paginasi pada modul Auth. Abaikan `meta.pagination`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field (validasi body).
- 401: kredensial salah (`invalid credentials`) atau refresh token tidak valid/kedaluwarsa.
- 403/404: konteks tenant tidak aktif/tidak ditemukan saat resolve `X-Tenant-ID`.

## Checklist Integrasi FE

- Selalu kirim header `X-Tenant-ID` pada auth endpoints.
- Simpan `access_token` dan `refresh_token` secara aman; jangan di-commit.
- Gunakan `expires_at` untuk menjadwalkan refresh token (silent refresh).
- Tangani 401 dengan prompt login ulang bila refresh gagal.
- Jangan kirim `Authorization` header ke endpoint login/refresh/logout.

Tautan teknis (opsional): implementasi ada di `internal/modules/core/auth/*.go` bila diperlukan detail lebih lanjut.
