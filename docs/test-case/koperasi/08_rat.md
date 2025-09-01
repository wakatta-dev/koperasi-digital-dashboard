# Test Case — RAT (Rapat Anggota Tahunan)

Catatan rujukan: `docs/modules/rat.md`, `internal/modules/rat/*`

## Jadwal, Notifikasi, Dokumen

### KOP-RAT-001 — Jadwalkan RAT
- POST `/coop/rat` body `{ "year": 2025, "date": "2025-11-20T09:00:00Z", "agenda": "RAT Tahunan" }` → 201 `data` RAT.

### KOP-RAT-002 — Kirim notifikasi RAT
- POST `/coop/rat/{id}/notify` body `{ "message": "RAT dimulai 20 Nov 2025" }` → 200.

### KOP-RAT-003 — Unggah dokumen RAT
- POST `/coop/rat/{id}/documents` body `{ "type": "notulen", "file_url": "https://cdn/notulen.pdf" }` → 201.

## Voting

### KOP-RAT-010 — Buat item voting
- POST `/coop/rat/{id}/voting` body `{ "question": "Setuju laporan keuangan?", "type": "single_choice", "options": ["Setuju", "Tidak"], "open_at": "2025-11-20T09:00:00Z", "close_at": "2025-11-20T12:00:00Z" }` → 201.

### KOP-RAT-011 — Voting oleh anggota
- POST `/coop/rat/voting/{item_id}/vote` body `{ "member_id": <id>, "selected_option": "Setuju" }` → 201.

### KOP-RAT-012 — Hasil voting
- GET `/coop/rat/voting/{item_id}/result` → 200 `data` hasil.

## Riwayat

### KOP-RAT-020 — Riwayat RAT
- GET `/coop/rat/history` → 200 `data[]` RAT.

## Negative & Validasi

### KOP-RAT-030 — Validasi waktu/opsi
- `open_at>close_at` atau opsi kosong → 400 `validation error`.

### KOP-RAT-031 — Voting berganda/di luar waktu
- Lakukan vote dua kali atau di luar window → 400/409 sesuai aturan service.

### KOP-RAT-032 — Akses tanpa header/cross-tenant
- 401/403/404 sesuai middleware/isolasi.

### KOP-RAT-033 — Voting oleh non-anggota/anggota tidak aktif
- `member_id` tidak valid atau status anggota tidak memenuhi → 400/403.

### KOP-RAT-034 — Opsi voting tidak valid
- `selected_option` tidak termasuk dalam daftar opsi → 400.
