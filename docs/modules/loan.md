# Modul Loan

Dokumentasi ini menjelaskan peran, arsitektur, dan alur bisnis dari modul Loan. Modul ini saat ini menyediakan layanan internal untuk pencatatan pencairan pinjaman (disbursement) dengan integrasi ke modul Finance.

Referensi implementasi utama terdapat pada:
- `internal/modules/loan/service.go`

## Ringkasan Peran per Tenant

- Vendor: tidak langsung menggunakan layanan ini.
- Koperasi/UMKM/BUMDes: sistem memanggil service ini saat terjadi pencairan pinjaman agar tercatat di transaksi kas dan ledger.

## Arsitektur & Komponen

- Service: `DisburseLoan(tenantID, userID, amount, method, description)` memanggil `finance.CreateTransaction` bertipe `CashOut` kategori `pinjaman` dengan pasangan debit/kredit akunnya.

## Entitas & Skema Data

- Tidak menambah entitas baru; menggunakan entitas transaksi dari modul Finance.

## Alur Bisnis Utama

1) Pencairan Pinjaman
- Mencatat transaksi kas keluar (`CashOut`) kategori `pinjaman`.
- Entri ledger dibuat via Finance: Debit `Loan Receivable` (piutang pinjaman), Kredit `Cash`.

## Endpoint API

- Tidak ada endpoint HTTP publik untuk modul ini saat ini; dipanggil secara internal oleh modul/fitur lain.

## Contoh Pemanggilan (Service)

```go
err := loanSvc.DisburseLoan(tenantID, userID, 1_000_000, "transfer", "Pencairan pinjaman #123")
```

## Status & Transisi

- Tidak ada status khusus; fokus pada pencatatan transaksi.

## Paginasi & Response

- Tidak relevan.

## Integrasi & Dampak ke Modul Lain

- Finance: membuat `cash_transactions` dan `ledger_entries` melalui `CreateTransaction`.

## Keamanan

- Keamanan mengikuti konteks pemanggil service (tenant/user) yang disuplai saat pemanggilan.

## Catatan Implementasi

- Service akan mengembalikan `nil` jika port Finance belum di-wire (opsional pada pengujian/lingkungan tertentu).

## Peran Modul Loan per Jenis Tenant (Rangkuman)

- Koperasi/UMKM/BUMDes: pencatatan akuntansi saat pencairan pinjaman.

## Skenario Penggunaan

1. Petugas melakukan pencairan pinjaman; sistem memanggil service untuk mencatat kas keluar dan ledger terkait.

