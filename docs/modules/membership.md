# Modul Membership

Modul Membership mengelola pendaftaran anggota, verifikasi, profil, status keanggotaan, dan kartu anggota berbasis QR.

Referensi implementasi utama terdapat pada:
- `internal/modules/membership/entity.go`
- `internal/modules/membership/repository.go`
- `internal/modules/membership/service.go`
- `internal/modules/membership/card_service.go`
- `internal/modules/membership/handler.go`
- `internal/modules/membership/routes.go`

## Ringkasan Peran per Tenant

- Koperasi/UMKM/BUMDes: operasional pendaftaran/verifikasi anggota dan kartu anggota.

## Arsitektur & Komponen

- Repository: simpan anggota dan dokumen.
- Service: alur registrasi, verifikasi, pembaruan status.
- CardService: generasi dan validasi QR kartu anggota.
- Handler: endpoint pendaftaran, verifikasi, profil, status, kartu, validasi.

## Entitas & Skema Data

- Member: `id`, `tenant_id`, `user_id`, `no_anggota`, `status`, timestamps
- MemberDocument: `id`, `member_id`, `type`, `file_url`

## Alur Penggunaan

1. Calon anggota mengirim data pendaftaran melalui `POST /members/register` beserta dokumen pendukung.
2. Petugas koperasi meninjau dan menyetujui/menolak pendaftaran via `POST /members/{id}/verify`.
3. Setelah disetujui, profil anggota bisa diambil dengan `GET /members/{id}` untuk menampilkan atau memeriksa data.
4. Status keanggotaan dapat diperbarui kapan saja menggunakan `PATCH /members/{id}/status` (misal aktif/nonaktif).
5. Anggota yang aktif dapat meminta pembuatan kartu anggota digital/fisik lewat `POST /members/{id}/card`.
6. Kartu dengan QR dapat divalidasi petugas saat digunakan melalui `GET /members/card/validate/{qr}`.

## Endpoint API

Semua endpoint dilindungi `Bearer` + `X-Tenant-ID`.

- `POST /members/register` — pendaftaran anggota.
- `POST /members/{id}/verify` — verifikasi/tolak pendaftaran.
- `GET /members/{id}` — profil anggota.
- `PATCH /members/{id}/status` — ubah status.
- `POST /members/{id}/card` — buat kartu anggota (QR) dan kembalikan info kartu.
- `GET /members/card/validate/{qr}` — validasi QR kartu.

## Rincian Endpoint

- `POST /members/register`
  - Body RegisterMemberRequest: `user_id`, `no_anggota`, `initial_deposit?`, `documents[]`
    - `documents[]` elemennya: `{ "type": "…", "data": "<bytes>" }` (diunggah via storage dan disimpan sebagai `file_url` di server)
  - Response 201: `data` Member

- `POST /members/{id}/verify`
  - Body VerifyMemberRequest: `{ "approve": true|false, "reason?": "..." }`
  - Response 200: sukses (tanpa body khusus)

- `GET /members/{id}` → `data` profil

- `PATCH /members/{id}/status` → body `{ "status": "ACTIVE|INACTIVE|SUSPENDED|..." }`

- `POST /members/{id}/card` → `data` info kartu (termasuk QR)

- `GET /members/card/validate/{qr}` → `data` info anggota hasil validasi QR

## Contoh Payload & Response

- Register Member
```json
POST /members/register
{
  "user_id": 101,
  "no_anggota": "AGG-2025-001",
  "initial_deposit": 100000,
  "documents": [
    {"type": "ktp", "file_url": "https://cdn.example.com/ktp.jpg"}
  ]
}
```
Contoh response: `201 Created` body berisi data Member yang terdaftar.

- Verify Member
```json
POST /members/12/verify
{ "approve": true }
```
Response: `200 OK`

- Update Status
```json
PATCH /members/12/status
{ "status": "ACTIVE" }
```
Response: `200 OK`

- Generate Card
```json
POST /members/12/card
```
Contoh response:
```json
{
  "member_id": 12,
  "qr": "MEMBER-12-QR-ENCODED",
  "issued_at": "2025-09-01T10:00:00Z"
}
```

- Validate Card
```http
GET /members/card/validate/MEMBER-12-QR-ENCODED
```
Response: data profil ringkas anggota terkait QR.

## Tautan Cepat

- Savings: [savings.md](savings.md)
- Loan: [loan.md](loan.md)
- Risk: [risk.md](risk.md)
- Notifications: [notification.md](notification.md)
