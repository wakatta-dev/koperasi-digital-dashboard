# Membership API — Panduan Integrasi Frontend (Singkat)

Modul membership koperasi mengelola registrasi anggota, verifikasi, pemutakhiran profil, status keanggotaan, serta kartu anggota berbasis QR yang dapat dipakai untuk absensi RAT. Endpoint tersedia di prefix `/koperasi/members` dan hanya dapat diakses tenant bertipe koperasi.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; middleware memastikan tenant tipe `koperasi`.

## Ringkasan Endpoint

- GET `/koperasi/members?term=&status=&start_date=&end_date=&limit=&cursor=` — `petugas keanggotaan`: daftar anggota → 200 `APIResponse<MemberListItem[]>`
- POST `/koperasi/members/register` — `petugas keanggotaan`: registrasi anggota baru → 201 `Member`
- POST `/koperasi/members/:id/verify` — `komite koperasi`: verifikasi/tolak registrasi → 200 (tanpa body)
- GET `/koperasi/members/:id` — `petugas keanggotaan`: profil anggota → 200 `Profile`
- PUT `/koperasi/members/:id` — `petugas keanggotaan`: ubah profil → 200 `APIResponse<Member>`
- PATCH `/koperasi/members/:id/status` — `petugas keanggotaan`: ubah status (`active|nonaktif|keluar`) → 200 (tanpa body)
- POST `/koperasi/members/:id/card` — `petugas keanggotaan`: generate kartu QR → 200 `MemberCard`
- GET `/koperasi/members/:id/card` — `anggota/petugas`: ambil kartu terbaru → 200 `MemberCard`
- GET `/koperasi/members/card/validate/:qr?rat_id=` — `petugas RAT`: validasi QR dan catat absensi → 200 `Member`

> Endpoint card akan menolak jika user bukan bagian dari tenant atau tidak memiliki peran pengelola kartu (`SuperAdmin`, `AdminKeanggotaan`, `AdminKeuangan`, `Bendahara`). Tambahkan `rat_id` saat memindai untuk mencatat kehadiran RAT.

## Skema Data Ringkas

- Member: `id:number`, `tenant_id:number`, `user_id:number`, `no_anggota:string`, `full_name:string`, `email:string`, `phone:string`, `address:string`, `city:string`, `province:string`, `postal_code:string`, `identity_type:string`, `identity_number:string`, `occupation:string`, `status:'pending'|'active'|'nonaktif'|'keluar'`, `join_date:Rfc3339`, audit timestamp.
- MemberListItem: `id:number`, `no_anggota:string`, `full_name:string`, `email:string`, `status:string`, `join_date:Rfc3339`, `user:{ full_name:string, email:string }`, metadata alamat.
- Profile: `member:Member`, `savings_summary:{ total_deposit:number, total_withdrawal:number, balance:number }`, `loan_summary:{ active_loans:number, outstanding:number }`, `attendance:{ rat_attended:number, last_attended?:Rfc3339 }`.
- MemberCard: `member_id:number`, `qr_code:string`, `qr_url:string`, `issued_at:Rfc3339`, `expired_at?:Rfc3339`.

> Status awal registrasi adalah `pending`. Verifikasi `approve=false` akan menolak dan mengubah status ke `nonaktif` dengan alasan di service.

## Payload Utama

- RegisterMemberRequest:
  - `{ user_id: number, no_anggota: string, full_name: string, email: string, phone: string, address: string, city: string, province: string, postal_code: string, identity_type: string, identity_number: string, occupation?: string, family_name?: string, family_relationship?: string, family_phone?: string, initial_deposit?: number, documents?: Array<{ type: string, data: base64 }> }`

- VerifyMemberRequest:
  - `{ approve: boolean }`

- UpdateProfileRequest (PUT/PATCH `/members/:id`):
  - seluruh field optional seperti `full_name?`, `email?`, `phone?`, `address?`, `city?`, `province?`, `postal_code?`, `occupation?`, `family_name?`, `family_relationship?`, `family_phone?`

- UpdateMemberStatusRequest:
  - `{ status: 'active' | 'nonaktif' | 'keluar', effective_date?: Rfc3339String, reason?: string }`

- List query: `term` (nama/no anggota), `status`, `start_date`, `end_date`, `limit` (default 10), `cursor` (ID anggota).

## Bentuk Response

- `Register` mengembalikan objek `Member` langsung (legacy). Endpoint lain memakai `APIResponse<T>` dengan `meta.pagination` pada daftar.
- Ketika profil diperbarui, response mengembalikan `APIResponse<Member>` dengan data terbaru.
- Validasi QR mengembalikan `Member` dan otomatis mencatat absensi RAT bila `rat_id` dikirim.

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

type Member = {
  id: number;
  tenant_id: number;
  user_id: number;
  no_anggota: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  identity_type: string;
  identity_number: string;
  occupation?: string;
  status: 'pending' | 'active' | 'nonaktif' | 'keluar';
  join_date: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type MemberListItem = {
  id: number;
  tenant_id: number;
  user_id: number;
  no_anggota: string;
  full_name: string;
  email: string;
  status: string;
  join_date: Rfc3339String;
  phone: string;
  city: string;
  province: string;
  user: {
    full_name: string;
    email: string;
  };
};

type MemberCard = {
  member_id: number;
  qr_code: string;
  qr_url: string;
  issued_at: Rfc3339String;
  expired_at?: Rfc3339String;
};

type RegisterMemberRequest = {
  user_id: number;
  no_anggota: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  identity_type: string;
  identity_number: string;
  occupation?: string;
  family_name?: string;
  family_relationship?: string;
  family_phone?: string;
  initial_deposit?: number;
  documents?: Array<{ type: string; data: string }>;
};

type VerifyMemberRequest = {
  approve: boolean;
};

type UpdateProfileRequest = Partial<{
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  occupation: string;
  family_name: string;
  family_relationship: string;
  family_phone: string;
}>;

type UpdateMemberStatusRequest = {
  status: 'active' | 'nonaktif' | 'keluar';
  effective_date?: Rfc3339String;
  reason?: string;
};

type MemberListResponse = APIResponse<MemberListItem[]>;
type MemberProfileResponse = APIResponse<Member>;
type MemberCardResponse = APIResponse<MemberCard>;
```

> Gunakan `Partial` pada update profil agar hanya field yang berubah yang dikirim. Backend menolak request tanpa perubahan (`no changes provided`).

## Paginasi (Cursor)

- `GET /koperasi/members` memakai cursor numerik (`id`) dengan `limit` default 10.
- Simpan `meta.pagination.next_cursor` dan kirim kembali ketika memuat halaman berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (email/phone salah format, tanggal join invalid, QR query `rat_id` bukan angka).
- 401/403: tenant bukan koperasi atau role tidak berhak akses/ubah anggota/kartu.
- 404: anggota/kartu tidak ditemukan.
- 409: status yang diajukan sama dengan status saat ini (disampaikan sebagai validation error).
- 500: kegagalan penyimpanan atau pembuatan kartu.

## Checklist Integrasi FE

- Validasi form registrasi sebelum submit (email, nomor identitas, panjang alamat).
- Tampilkan indikator status (`pending`, `active`, `nonaktif`, `keluar`) dan sediakan aksi sesuai status.
- Simpan QR code yang diterima setelah generate card; hindari memanggil ulang endpoint kecuali diperlukan.
- Saat absensi RAT menggunakan QR, kirimkan `rat_id` agar absensi tercatat otomatis.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/membership/handler.go` — detail routing & validasi.
- `internal/modules/koperasi/membership/service.go` — logika registrasi, profil, dan status.
- `internal/modules/koperasi/membership/card_service.go` — pembuatan kartu & validasi QR.
