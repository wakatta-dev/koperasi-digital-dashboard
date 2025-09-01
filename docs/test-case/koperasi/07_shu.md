# Test Case — SHU (Koperasi)

Catatan rujukan: `docs/modules/shu.md`, `internal/modules/shu/*`

## Input → Simulasi → Distribusi → Riwayat

### KOP-SHU-001 — Input total SHU tahunan
- POST `/coop/shu/yearly` body `{ "year": 2025, "total_shu": 50000000 }` → 201 `data` YearlySHU.

### KOP-SHU-002 — Simulasi distribusi
- POST `/coop/shu/yearly/2025/simulate` → 200 `data[]` SHUDistribution.

### KOP-SHU-003 — Distribusi aktual
- POST `/coop/shu/yearly/2025/distribute` body `{ "method": "transfer", "description": "Distribusi SHU 2025" }` → 200 `{ "status": "ok" }` (Finance `CashOut` tercatat).

### KOP-SHU-004 — Riwayat tahunan
- GET `/coop/shu/history` → 200 `data[]` YearlySHU.

### KOP-SHU-005 — Riwayat per anggota
- GET `/coop/shu/member/{member_id}` → 200 `data[]` SHUDistribution.

### KOP-SHU-006 — Ekspor SHU tahunan
- GET `/coop/shu/export/2025` → 200 `{ "status": "exported", "year": "2025" }`.

## Negative & Validasi

### KOP-SHU-020 — Year/total invalid
- `year` non-angka atau `total_shu<=0` → 400.

### KOP-SHU-021 — Akses tanpa header/cross-tenant
- 401/403/404 sesuai middleware/isolasi.

