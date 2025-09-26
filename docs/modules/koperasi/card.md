# Digital Card API — Panduan Integrasi Frontend (Singkat)

Modul kartu digital koperasi menyediakan preview, regenerasi QR, unduhan kartu, dan validasi QR untuk anggota. Endpoint berada di prefix `/koperasi/card` dan memanfaatkan data anggota dari modul membership.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Accept`: `application/json`
- Tidak ada header tambahan; middleware `RequireRoles` mengizinkan `SuperAdminKoperasi`, `AdminKeanggotaan`, `AdminKeuangan`, `Bendahara`, dan `Anggota` (akses terbatas).

## Ringkasan Endpoint

- GET `/koperasi/card/members/:id/preview` — `admin/anggota`: lihat snapshot kartu (generate otomatis jika belum ada) → 200 `APIResponse<MemberCard>`
- POST `/koperasi/card/members/:id/refresh` — `admin kartu`: regenerasi QR dan kartu → 200 `APIResponse<MemberCard>`
- GET `/koperasi/card/members/:id/download` — `admin/anggota`: unduh kartu PNG → 200 file
- GET `/koperasi/card/validate/:qr` — `admin/anggota`: validasi QR dan ambil info anggota → 200 `APIResponse<Member>`

> Anggota (`role=Anggota`) hanya dapat mengakses kartu miliknya sendiri. Petugas harus berada dalam tenant yang sama dengan anggota.

## Skema Data Ringkas

- MemberCard: `member_id:number`, `qr_code:string`, `qr_url:string`, `issued_at:Rfc3339`, `expired_at?:Rfc3339`
- Member (ringkas): `id:number`, `tenant_id:number`, `no_anggota:string`, `full_name:string`, `status:string`

> Preview dan refresh menggunakan `membership.Service` yang sama, sehingga output sejalan dengan modul membership.

## Payload Utama

- Tidak ada body request (semua endpoint menggunakan path parameter).

## Bentuk Response

- Preview, refresh, dan validate mengembalikan `APIResponse<T>` dengan data kartu atau anggota.
- Unduhan kartu mengirim biner `image/png` dengan header `Content-Disposition`.

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

type MemberCard = {
  member_id: number;
  qr_code: string;
  qr_url: string;
  issued_at: Rfc3339String;
  expired_at?: Rfc3339String;
};

type MemberSummary = {
  id: number;
  tenant_id: number;
  no_anggota: string;
  full_name: string;
  status: string;
};

type MemberCardResponse = APIResponse<MemberCard>;
type ValidateCardResponse = APIResponse<MemberSummary>;
```

> Unduhan PNG tidak dibungkus `APIResponse`; FE harus menangani response biner secara langsung (blob).

## Paginasi (Cursor)

- Tidak ada paginasi; operasi berbasis resource tunggal.

## Error Singkat yang Perlu Ditangani

- 400: `member id`/`qr` tidak valid atau token QR tidak dikenali.
- 401/403: user tidak berada dalam tenant yang sama atau tidak memiliki role yang diizinkan.
- 404: anggota/kartu belum tersedia.
- 500: kegagalan generasi kartu atau layanan storage.

## Checklist Integrasi FE

- Tampilkan opsi regenerate hanya untuk admin yang berwenang; anggota cukup menggunakan preview/download.
- Setelah refresh, muat ulang data kartu agar QR terbaru ditampilkan.
- Saat memindai QR, panggil endpoint validate dan tampilkan informasi anggota serta status keanggotaannya.
- Pastikan unduhan PNG menggunakan permintaan `blob` agar file tersimpan dengan benar.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/card/handler.go` — endpoint preview, refresh, download, validate.
- `internal/modules/koperasi/card/service.go` — pembuatan kartu, snapshot, dan validasi QR.
- `internal/modules/koperasi/membership/repository.go` — akses data anggota yang digunakan modul kartu.
