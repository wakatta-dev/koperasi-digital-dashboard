# Modul Savings

Dokumentasi ini menjelaskan peran, arsitektur, dan alur bisnis dari modul Savings. Modul ini menyediakan layanan internal untuk pencatatan setoran (deposit) dan penarikan (withdrawal) simpanan dengan integrasi ke modul Finance.

Referensi implementasi utama terdapat pada:
- `internal/modules/savings/service.go`

## Ringkasan Peran per Tenant

- Vendor: tidak langsung menggunakan layanan ini.
- Koperasi/UMKM/BUMDes: sistem memanggil service ini saat terjadi setoran/penarikan simpanan agar tercatat di transaksi kas dan ledger.

## Arsitektur & Komponen

- Service:
  - `RecordDeposit(tenantID, userID, amount, method, description)` → transaksi `CashIn` kategori `simpanan`.
  - `RecordWithdrawal(tenantID, userID, amount, method, description)` → transaksi `CashOut` kategori `simpanan`.
  - Keduanya memanggil `finance.CreateTransaction` dengan pasangan akun debit/kredit yang sesuai.

## Entitas & Skema Data

- Tidak menambah entitas baru; menggunakan entitas transaksi dari modul Finance.

## Alur Bisnis Utama

1) Setoran Simpanan
- `CashIn` kategori `simpanan`.
- Ledger: Debit `Cash`, Kredit `Savings`.

2) Penarikan Simpanan
- `CashOut` kategori `simpanan`.
- Ledger: Debit `Savings`, Kredit `Cash`.

## Endpoint API

- Tidak ada endpoint HTTP publik untuk modul ini saat ini; dipanggil secara internal oleh modul/fitur lain.

## Contoh Pemanggilan (Service)

```go
_ = savingsSvc.RecordDeposit(tenantID, userID, 250_000, "tunai", "Setoran rutin")
_ = savingsSvc.RecordWithdrawal(tenantID, userID, 100_000, "tunai", "Penarikan")
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

## Peran Modul Savings per Jenis Tenant (Rangkuman)

- Koperasi/UMKM/BUMDes: pencatatan akuntansi setoran/penarikan simpanan.

## Skenario Penggunaan

1. Anggota melakukan setoran; sistem mencatat transaksi kas masuk dan ledger terkait.
2. Anggota melakukan penarikan; sistem mencatat transaksi kas keluar dan ledger terkait.

