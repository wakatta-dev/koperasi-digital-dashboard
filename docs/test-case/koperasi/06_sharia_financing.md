# Test Case — Sharia Financing (Koperasi)

Catatan rujukan: `docs/modules/sharia.md`, `internal/modules/sharia/*`

## Pengajuan → Persetujuan → Pencairan

### KOP-SHF-001 — Ajukan pembiayaan syariah
- POST `/coop/sharia-financings/apply` body `{ "member_id": <id>, "application": { "amount": 10000000, "tenor": 12, "rate": 10.5, "purpose": "Modal kerja" } }` → 201.

### KOP-SHF-002 — Setujui pembiayaan
- POST `/coop/sharia-financings/{id}/approve` → 200 status approved + jadwal.

### KOP-SHF-003 — Cairkan pembiayaan
- POST `/coop/sharia-financings/{id}/disburse` body `{ "method": "transfer" }` → 204.

## Angsuran & Surat Lunas

### KOP-SHF-010 — Bayar angsuran (tepat waktu)
- POST `/coop/sharia-financings/installments/{id}/pay` body `{ "amount": 900000, "date": "2025-09-30T00:00:00Z", "method": "transfer" }` → 200.

### KOP-SHF-011 — Surat lunas (bila seluruh angsuran paid)
- GET `/coop/sharia-financings/{id}/release-letter` → 200 `{ "message": "..." }`.

## Negative & Validasi

### KOP-SHF-020 — Apply/approve/disburse invalid
- Field wajib kosong/ID non-angka/status tidak tepat → 400/409.

### KOP-SHF-021 — Pay installment invalid
- `amount<=0` atau format tanggal salah → 400.

