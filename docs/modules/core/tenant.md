# Tenants API — Panduan Integrasi Frontend (Singkat)

Modul tenants menangani self-registration tenant (publik) dan aktivasi/deaktivasi oleh admin vendor. Response dibungkus `APIResponse<T>` dengan struktur konsisten.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Public endpoint (`POST /api/tenants`, `POST /api/tenants/verify`): tanpa Authorization, tetap kirim `Content-Type`/`Accept`.
- Secured endpoint (`PATCH /api/tenants/:id/status`):
  - Authorization: `Bearer <token>` (role `admin_vendor`)
  - `X-Tenant-ID`: `number`
  - `Content-Type`: `application/json`
  - `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

- POST `/api/tenants` — `public`: daftar tenant baru, kirim data lengkap → 201 `APIResponse<{ registration_id: string }>`
- POST `/api/tenants/verify` — `public`: verifikasi OTP registrasi → 200 `APIResponse<void>`
- PATCH `/api/tenants/:id/status` — `vendor admin`: ubah status tenant (`active|inactive|suspended`) → 200 `APIResponse<{ status: string; is_active: boolean }>`

> Registrasi menghasilkan `registration_id` yang berlaku selama OTP belum diverifikasi. Request status memerlukan role `admin_vendor`, ditolak jika tidak sesuai (`forbidden`).

## Skema Data Ringkas

- TenantRegistration (transien): `id:string`, `name`, `legal_entity`, `address`, `domain`, `type`, `pic_name`, `pic_phone`, `pic_email`, `full_name`, `email`, `primary_plan_id`, `addon_plan_ids:number[]`, `otp:string`, `email_otp:string`, `whatsapp_otp:string`, `created_at:Rfc3339`
- UpdateStatus payload: `status:'active'|'inactive'|'suspended'`

> Field `legacy` (`legalitas`, `alamat`) masih diterima untuk kompatibilitas form lama; backend mengkonversi ke field modern.

## Payload Utama

- RegisterRequest:
  - `name` (string), `legal_entity` (string), `address` (string), `domain` (string), `type` (string — contoh: `koperasi`, `bumdes`), `pic_name` (string), `pic_phone` (string), `pic_email` (string), `full_name` (string), `email` (string), `password` (string), `primary_plan_id` (number), `addon_plan_ids` (number[])
  - Opsional: `legalitas`, `alamat` sebagai alias lama untuk `legal_entity`/`address`

- VerifyRequest:
  - `{ registration_id: string, otp: string }` — nilai `otp` boleh berasal dari email maupun WhatsApp (keduanya 6 digit).

- UpdateStatusRequest:
  - `{ status: 'active' | 'inactive' | 'suspended' }`

## Bentuk Response

- Registrasi mengembalikan `{ registration_id }` di dalam `data`; gunakan untuk langkah OTP.
- OTP dikirim melalui email (`email_otp`) dan WhatsApp (`whatsapp_otp`, bila `pic_phone` terisi). Keduanya valid untuk verifikasi.
- Verifikasi sukses mengembalikan `data = null` dengan `success = true`.
- Update status mengembalikan `{ status, is_active }` agar UI langsung menyesuaikan toggle.

## TypeScript Types (Request & Response)

```ts
// Common
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

// Requests
type RegisterTenantRequest = {
  name: string;
  legal_entity: string;
  address: string;
  domain: string;
  type: string;
  pic_name: string;
  pic_phone: string;
  pic_email: string;
  full_name: string;
  email: string;
  password: string;
  primary_plan_id: number;
  addon_plan_ids: number[];
};

type VerifyTenantRequest = {
  registration_id: string;
  otp: string;
};

type UpdateTenantStatusRequest = {
  status: 'active' | 'inactive' | 'suspended';
};

// Responses
type RegisterTenantResponse = APIResponse<{ registration_id: string }>;
type VerifyTenantResponse = APIResponse<null>;
type UpdateTenantStatusResponse = APIResponse<{ status: string; is_active: boolean }>;
```

> FE lama yang masih mengirim `legalitas`/`alamat` dapat mempertahankan payload; backend mengisi otomatis ke field baru.

## Paginasi (Cursor)

- Tidak ada endpoint daftar; paginasi tidak digunakan.

## Error Singkat yang Perlu Ditangani

- 400: body invalid, OTP salah, domain/email duplikat (`ErrRegistrationDomainExists`, `ErrRegistrationEmailExists`).
- 401/403: akses status tanpa token vendor admin → pesan `forbidden`.
- 404: tidak applicable (ID tidak ditemukan menghasilkan 400/500 sesuai implementasi repository).
- 500: kegagalan internal (hash password, pengiriman OTP, audit log) — tampilkan pesan umum dan arahkan pengguna mencoba lagi.

## Checklist Integrasi FE

- Validasi keunikan domain/email di sisi UI bila memungkinkan sebelum submit; tetap tangani pesan error backend.
- Setelah registrasi sukses, simpan `registration_id` untuk form OTP sekaligus dukung resend OTP (menggunakan endpoint notifikasi bila tersedia). Beri opsi pengguna memilih kode dari email atau WhatsApp.
- Masking OTP input dan sediakan countdown sebelum resend.
- Panel admin vendor tampilkan status terbaru (badge `active/inactive/suspended`) dan sinkronkan setelah PATCH berhasil.

## Tautan Teknis (Opsional)

- `internal/modules/core/tenant/vendor_handler.go` — implementasi endpoint publik & secured.
- `internal/modules/core/tenant/vendor_service.go` — proses registrasi, verifikasi, dan update status.
- `internal/modules/core/tenant/routes.go` — pemetaan route publik vs secured.
