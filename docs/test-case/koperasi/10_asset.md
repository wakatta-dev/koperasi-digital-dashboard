# Test Case — Asset (Koperasi)

Catatan rujukan: `docs/modules/asset.md`, `internal/modules/asset/*`

## CRUD, Depresiasi, Status, Ekspor

### KOP-AST-001 — Tambah aset
- POST `/coop/assets` body `{ "name": "Laptop Kasir", "code": "AST-001", "category": "Elektronik", "purchase_date": "2025-08-01T00:00:00Z", "purchase_price": 12000000, "useful_life_months": 36 }` → 201.

### KOP-AST-002 — Perbarui aset
- PUT `/coop/assets/{id}` body lengkap → 200.

### KOP-AST-003 — Daftar aset
- GET `/coop/assets` → 200 `data[]`.

### KOP-AST-004 — Riwayat depresiasi
- GET `/coop/assets/{id}/depreciation` → 200 `data[]`.

### KOP-AST-005 — Ubah status aset
- PATCH `/coop/assets/{id}/status` body `{ "status": "inactive" }` → 204.

### KOP-AST-006 — Hapus aset
- DELETE `/coop/assets/{id}` → 204.

### KOP-AST-007 — Ekspor aset (placeholder)
- GET `/coop/assets/export` → 200 placeholder.

## Negative & Validasi

### KOP-AST-020 — Body/path invalid
- Field wajib kosong, format tanggal salah, ID non-angka → 400.

### KOP-AST-021 — Kode aset duplikat (unik)
- POST dua aset dengan `code` identik → request kedua gagal 409/400.

### KOP-AST-022 — Harga/umur manfaat tidak valid
- `purchase_price<=0` atau `useful_life_months<=0` → 400.
