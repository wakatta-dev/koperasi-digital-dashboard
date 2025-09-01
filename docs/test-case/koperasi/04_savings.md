# Test Case — Savings (Koperasi)

Catatan rujukan: `docs/modules/savings.md`, `internal/modules/savings/*`

## Setoran & Verifikasi

### KOP-SAV-001 — Buat setoran manual (pending)
- Langkah: POST `/coop/savings/{member_id}/deposit` body `{ "type": "pokok", "amount": 100000, "method": "manual", "fee": 2000 }`.
- Hasil: 201 `data` SavingsTransaction `type=setoran` `status=pending`.

### KOP-SAV-002 — Verifikasi setoran manual
- Langkah: POST `/coop/savings/{transaction_id}/verify`.
- Hasil: 200 `data.status`=`verified`, `proof_url` terisi, saldo bertambah.

### KOP-SAV-003 — Setoran non-manual (langsung verified)
- Langkah: POST deposit dengan `method` selain `manual`.
- Hasil: 201 `status`=`verified`, saldo bertambah.

### KOP-SAV-004 — Verifikasi setoran yang bukan `setoran`
- Langkah: POST `/coop/savings/{transaction_id}/verify` pada transaksi `penarikan`.
- Hasil: 400/409 error bisnis (tidak dapat diverifikasi).

## Penarikan & Persetujuan

### KOP-SAV-010 — Ajukan penarikan
- Langkah: POST `/coop/savings/{member_id}/withdraw` body `{ "type": "pokok", "amount": 50000, "method": "transfer", "fee": 1000 }`.
- Hasil: 201 `data` SavingsTransaction `type=penarikan` `status=pending`.

### KOP-SAV-011 — Setujui penarikan
- Langkah: POST `/coop/savings/{transaction_id}/approve`.
- Hasil: 200 `data.status`=`approved`, `proof_url` ada, saldo berkurang.

### KOP-SAV-012 — Setujui penarikan dua kali (idempotensi)
- Langkah: POST approve pada transaksi yang sudah `approved`.
- Hasil: 409/200 no-op sesuai implementasi; verifikasi tidak ada perubahan saldo ganda.

## Riwayat & Bukti

### KOP-SAV-020 — List transaksi anggota
- Langkah: GET `/coop/savings/{member_id}/transactions`.
- Hasil: 200 `data[]` transaksi.

### KOP-SAV-021 — Ambil proof transaksi
- Langkah: GET `/coop/savings/{transaction_id}/proof`.
- Hasil: 200 `{ "proof": "<url>" }`.

## Negative & Validasi

### KOP-SAV-030 — Deposit invalid
- Amount <= 0 atau field wajib kosong → 400.

### KOP-SAV-031 — Withdraw invalid (saldo kurang)
- Ajukan `amount` > saldo → 400 error bisnis sesuai implementasi.

### KOP-SAV-032 — Path ID bukan angka
- `{member_id}`/`{transaction_id}` invalid → 400.

### KOP-SAV-033 — Akses tanpa header/cross-tenant
- 401/403/404 sesuai middleware dan isolasi.

### KOP-SAV-034 — Deposit dengan tipe simpanan tidak dikenal
- `type` diluar konvensi → 200/400 sesuai kebijakan; catat perilaku yang diharapkan.

### KOP-SAV-035 — Fee negatif atau amount nol
- Body `fee<0` atau `amount<=0` → 400.
