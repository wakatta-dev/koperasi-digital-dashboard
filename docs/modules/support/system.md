# System Settings API — Panduan Integrasi Frontend (Singkat)

Modul system settings menampung konfigurasi global platform (domain default, brand, SLA, dan mode maintenance). Endpoint tunggal berada di bawah prefix `/system-settings` dan biasanya hanya diakses oleh vendor super admin.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; middleware dapat membatasi role (`SuperAdminVendor`).

## Ringkasan Endpoint

- GET `/system-settings` — `vendor super admin`: baca konfigurasi → 200 `APIResponse<Settings>`
- PUT `/system-settings` — `vendor super admin`: ubah konfigurasi → 200 `APIResponse<Settings>`

> Endpoint mengembalikan `{}` jika belum ada konfigurasi tersimpan. Alias lama `/vendor/system-settings` telah digantikan oleh path baru ini.

## Skema Data Ringkas

- Settings: `default_domain?:string`, `default_brand_name?:string`, `default_brand_logo_url?:string`, `sla_response_hours?:number`, `support_email?:string`, `maintenance_mode:boolean`, `maintenance_message?:string`, `created_at:Rfc3339`, `updated_at:Rfc3339`.

> `sla_response_hours` dipakai untuk penetapan SLA tiket default; perhatikan integrasinya dengan modul ticket.

## Payload Utama

- SettingsRequest (PUT `/system-settings`):
  - `{ default_domain?: string, default_brand_name?: string, default_brand_logo_url?: string, sla_response_hours?: number, support_email?: string, maintenance_mode?: boolean, maintenance_message?: string }`

## Bentuk Response

- Menggunakan `APIResponse<Settings>`; mutasi mengembalikan konfigurasi terbaru.
- GET mengembalikan data kosong (`{}`) saat konfigurasi belum dibuat.

## TypeScript Types (Request & Response)

```ts
type Rfc3339String = string;

type Meta = {
  request_id: string;
  timestamp: Rfc3339String;
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
};

type SystemSettings = {
  default_domain?: string;
  default_brand_name?: string;
  default_brand_logo_url?: string;
  sla_response_hours?: number;
  support_email?: string;
  maintenance_mode: boolean;
  maintenance_message?: string;
  created_at?: Rfc3339String;
  updated_at?: Rfc3339String;
};

type SystemSettingsRequest = Partial<Omit<SystemSettings, 'created_at' | 'updated_at'>>;

type SystemSettingsResponse = APIResponse<SystemSettings>;
```

> FE dapat menyimpan properti tambahan (misal `maintenance_mode`) pada store global untuk menampilkan banner maintenance.

## Paginasi (Cursor)

- Tidak ada paginasi; konfigurasi dikembalikan sebagai satu objek.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (domain/email bukan format benar, SLA negatif).
- 403: role tidak diizinkan mengubah konfigurasi.
- 500: kegagalan penyimpanan atau akses database.

## Checklist Integrasi FE

- Validasi domain & email sebelum submit untuk menghindari error 400.
- Gunakan toggle maintenance di UI untuk menyesuaikan tampilan portal publik bila `maintenance_mode=true`.
- Tampilkan fallback brand default jika respons `data` kosong.

## Tautan Teknis (Opsional)

- `internal/modules/support/system/handler.go` — implementasi GET/PUT.
- `internal/modules/support/system/service.go` — logika penyimpanan settings.
- `internal/modules/support/system/entity.go` — struktur `Settings`.
