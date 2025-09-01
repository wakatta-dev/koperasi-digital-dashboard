# Test Case — Loan (Koperasi)

Catatan rujukan: `docs/modules/loan.md`, `internal/modules/loan/*`

## Aplikasi → Persetujuan → Pencairan

### KOP-LOAN-001 — Ajukan pinjaman
- Langkah: POST `/coop/loans/apply` body `{ "member_id": <id>, "amount": 10000000, "tenor": 12, "rate": 12.5, "purpose": "Modal kerja" }`.
- Hasil: 201 `data` LoanApplication `status=pending`.

### KOP-LOAN-002 — Setujui pinjaman (generate angsuran)
- Langkah: POST `/coop/loans/{id}/approve`.
- Hasil: 200 `data.status`=`approved`; `installments` berisi `tenor` entri dengan `due_date` bulanan.

### KOP-LOAN-003 — Cairkan pinjaman
- Langkah: POST `/coop/loans/{id}/disburse` body `{ "method": "transfer" }`.
- Hasil: 204; transaksi Finance `CashOut` tercatat; status aplikasi `disbursed`.

### KOP-LOAN-004 — Approve dua kali (idempotensi)
- Langkah: POST `/coop/loans/{id}/approve` ulang pada status `approved`.
- Hasil: 409/200 no-op sesuai implementasi.

### KOP-LOAN-005 — Disburse dua kali (ditolak)
- Langkah: POST `/coop/loans/{id}/disburse` ulang pada status `disbursed`.
- Hasil: 409/400 error bisnis, tidak ada pencatatan ganda.

## Pembayaran Angsuran & Denda

### KOP-LOAN-010 — Bayar angsuran tepat waktu
- Langkah: POST `/coop/loans/installments/{installment_id}/pay` body `{ "amount": 900000, "date": "2025-09-30T00:00:00Z", "method": "transfer" }`.
- Hasil: 200; `paid_amount` bertambah; jika >= `amount` maka `status=paid` dan `paid_at` terisi.

### KOP-LOAN-011 — Bayar angsuran terlambat (kena penalty)
- Langkah: POST dengan `date` > `due_date`.
- Hasil: 200; `penalty` dihitung `amount * 0.01 * daysLate`.

## Surat Lunas

### KOP-LOAN-020 — Dapatkan surat lunas (seluruh angsuran paid)
- Pra-syarat: semua angsuran `paid`.
- Langkah: GET `/coop/loans/{id}/release-letter`.
- Hasil: 200 `{ "message": "Loan {id} settled" }`.

### KOP-LOAN-021 — Surat lunas ditolak bila belum lunas
- Hasil: error sesuai implementasi (400/422) dengan pesan jelas.

## Negative & Validasi

### KOP-LOAN-030 — Apply invalid
- `amount<=0` atau `tenor<=0` atau field wajib kosong → 400.

### KOP-LOAN-031 — Approve/Disburse pada status tidak tepat
- Misalnya disburse sebelum approve → 400/409 sesuai error bisnis.

### KOP-LOAN-032 — Pay installment invalid
- `amount<=0` atau `{id}` non-angka → 400.

### KOP-LOAN-033 — Header/cross-tenant invalid
- Hilang Authorization/X-Tenant-ID atau lintas tenant → 401/403/404.
### KOP-LOAN-012 — Bayar melebihi jumlah (overpay)
- Langkah: bayar `amount` > sisa `amount` angsuran.
- Hasil: 200; `status=paid` dan `paid_amount` tidak melewati `amount` (kelebihan ditangani sesuai kebijakan; catat perilaku).

### KOP-LOAN-013 — Bayar bertahap (partial → paid)
- Langkah: lakukan 2x pembayaran hingga `paid_amount>=amount`.
- Hasil: angsuran berpindah ke `paid` pada pembayaran kedua.

### KOP-LOAN-014 — Bayar angsuran salah ID/loan
- Path id bukan angka atau installment bukan milik tenant → 400/404.
