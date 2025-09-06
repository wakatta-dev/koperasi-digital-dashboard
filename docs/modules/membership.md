# Membership API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/members/register` — daftar anggota → 201 `Member`
- POST `/members/:id/verify` — verifikasi/tolak → 200 (tanpa body)
- GET `/members/:id` — profil → 200 `Profile`
- PATCH `/members/:id/status` — ubah status → 200 (tanpa body atau map singkat)
- POST `/members/:id/card` — buat kartu (QR) → 200 `APIResponse<{ member_id: number; qr: string; issued_at: string }>`
- GET `/members/card/validate/:qr` — validasi QR → 200 `APIResponse<Member>`

## Skema Data Ringkas

- Member: `id`, `tenant_id`, `user_id`, `no_anggota`, `status`, `join_date`, `qr_code`, `qr_expired_at`, `created_at`, `updated_at`, preload `user`, `documents[]`
- MemberDocument: `id`, `member_id`, `type`, `file_url`, `created_at`
- Profile: `member`, `savings`, `loans`, `shu`

## Payload Utama

- RegisterMemberRequest:
  - `user_id` (number), `no_anggota` (string), `initial_deposit?` (number), `documents[]` (`type`, `data` byte base64)

- VerifyMemberRequest:
  - `{ approve: boolean }`

- UpdateMemberStatusRequest:
  - `{ status: string }` (contoh: `active|nonaktif` sesuai service)

## Bentuk Response

- Beberapa endpoint mengembalikan objek langsung, beberapa dibungkus `APIResponse<T>` (sesuai implementasi handler).

## TypeScript Types (Request & Response)

```ts
// Common
export type Rfc3339String = string;

export interface MemberDocumentUpload { type: string; data: string }

export interface Member {
  id: number;
  tenant_id: number;
  user_id: number;
  no_anggota: string;
  status: string;
  join_date: Rfc3339String;
  qr_code: string;
  qr_expired_at: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface MemberDocument { id: number; member_id: number; type: string; file_url: string; created_at: Rfc3339String }

export interface Profile { member: Member; savings: number; loans: number; shu: number }

export interface RegisterMemberRequest {
  user_id: number;
  no_anggota: string;
  initial_deposit?: number;
  documents: MemberDocumentUpload[];
}

export interface VerifyMemberRequest { approve: boolean }
export interface UpdateMemberStatusRequest { status: string }

// Responses
export type RegisterMemberResponse = Member;
export type VerifyMemberResponse = void; // 200 tanpa body
export type GetMemberProfileResponse = Profile;
export type UpdateMemberStatusResponse = void; // 200
export type CreateMemberCardResponse = APIResponse<{ member_id: number; qr: string; issued_at: Rfc3339String }>;
export type ValidateMemberCardResponse = APIResponse<Member>;
```

## Paginasi (Cursor)

- Tidak ada paginasi; endpoint profil/kartu bersifat individual.

## Error Singkat yang Perlu Ditangani

- 400: body tidak valid.
- 401/403: token salah/tenant tidak aktif.
- 404: anggota tidak ditemukan (profil/validasi QR).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Validasi format QR saat pemindaian dan tangani kedaluwarsa (`qr_expired_at`).
- Pastikan status keanggotaan tersinkron setelah verifikasi/perubahan status.

Tautan teknis (opsional): implementasi ada di `internal/modules/koperasi/membership/*.go` bila diperlukan detail lebih lanjut.
