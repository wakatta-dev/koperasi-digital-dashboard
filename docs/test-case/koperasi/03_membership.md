# Test Case — Membership (Koperasi)

Catatan rujukan: `docs/modules/membership.md`, `internal/modules/membership/*`

## Pendaftaran & Verifikasi

### KOP-MEM-001 — Register anggota
- Langkah: POST `/coop/members/register` body `{ "user_id": <uid>, "no_anggota": "AGG-2025-001", "initial_deposit": 100000, "documents": [{"type":"ktp","file_url":"https://cdn/ktp.jpg"}] }`.
- Hasil: 201 `data` Member (status awal sesuai service, mis. `PENDING`).

### KOP-MEM-002 — Verifikasi anggota (approve)
- Langkah: POST `/coop/members/{id}/verify` body `{ "approve": true }`.
- Hasil: 200 (status jadi `ACTIVE`).

### KOP-MEM-003 — Verifikasi ditolak (reject)
- Langkah: POST `/coop/members/{id}/verify` body `{ "approve": false, "reason": "data tidak valid" }`.
- Hasil: 200 (status `REJECTED`/setara sesuai implementasi).

## Profil, Status, Kartu

### KOP-MEM-010 — Ambil profil anggota
- Langkah: GET `/coop/members/{id}`.
- Hasil: 200 `data` profil anggota.

### KOP-MEM-011 — Ubah status anggota
- Langkah: PATCH `/coop/members/{id}/status` body `{ "status": "SUSPENDED" }`.
- Hasil: 200.

### KOP-MEM-012 — Generate kartu anggota (QR)
- Langkah: POST `/coop/members/{id}/card`.
- Hasil: 200 `data.qr` tersedia.

### KOP-MEM-013 — Validasi QR kartu
- Langkah: GET `/coop/members/card/validate/{qr}`.
- Hasil: 200 data anggota ringkas terkait QR.

### KOP-MEM-014 — Generate kartu dua kali (idempotensi)
- Langkah: POST `/coop/members/{id}/card` dua kali.
- Hasil: 200; QR sama atau diperbarui sesuai kebijakan service (divalidasi konsistensinya).

## Negative & Validasi

### KOP-MEM-020 — Register dengan field wajib kosong
- Hasil: 400 `validation error`.

### KOP-MEM-021 — Verifikasi dengan ID tidak valid
- Path `{id}` bukan angka → 400.

### KOP-MEM-022 — Akses tanpa header atau cross-tenant
- Hilang Authorization/X-Tenant-ID → 401/403; akses tenant lain → 403/404.

### KOP-MEM-023 — No_anggota duplikat
- Langkah: Register dua anggota berbeda dengan `no_anggota` sama.
- Hasil: request kedua gagal 409/400 (unik `no_anggota`).

### KOP-MEM-024 — Validasi QR tidak dikenal/expired
- Langkah: GET `/coop/members/card/validate/QR-TIDAK-DIKENAL`.
- Hasil: 404 atau 400 sesuai implementasi.
