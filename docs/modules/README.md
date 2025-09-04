# Dokumentasi Modul

Dokumen ini merangkum seluruh modul pada sistem dan menautkan ke detail masing-masing modul. Semua endpoint mengikuti pola autentikasi Bearer + X-Tenant-ID (kecuali endpoint publik yang disebutkan di dokumen modul terkait) dan menggunakan response standar `APIResponse`, kecuali disebutkan berbeda.

## Daftar Modul

- Core
  - [Auth](auth.md) - autentikasi dan manajemen token.
  - [Tenant](tenant.md) - pengelolaan data tenant.
  - [Roles & Permissions](authorization.md) - konfigurasi peran serta hak akses.
  - [Users](user.md) - manajemen pengguna dalam tenant.

- Finance & Billing
  - [Billing](billing.md) - penagihan paket dan pembayaran.
  - [Finance/Transactions](finance_transactions.md) - pencatatan transaksi keuangan.
  - [Cashbook](cashbook.md) - pencatatan kas manual.
  - [Reporting](reporting.md) - ringkasan laporan keuangan dan billing.
  - [Asset](asset.md) - manajemen aset tetap.
  - [SHU](shu.md) - perhitungan sisa hasil usaha.

- Operasional Anggota
  - [Membership](membership.md) - registrasi dan status anggota.
  - [Savings](savings.md) - transaksi simpanan anggota.
  - [Loan](loan.md) - pengajuan dan angsuran pinjaman.
  - [Sharia Financing](sharia.md) - pembiayaan syariah.
  - [Risk](risk.md) - penilaian risiko anggota.

- Governance & Support
  - [RAT](rat.md) - rapat anggota tahunan.
  - [Notifications](notification.md) - pengiriman notifikasi in-app.
  - [Ticket](ticket.md) - sistem tiket dukungan.
  - [Livechat](livechat.md) - komunikasi real-time dengan agen.
  - [Dashboard](dashboard.md) - ringkasan metrik operasional.
  - [Vendor Analytics & Usage](dashboard.md#vendor-analytics--usage) - statistik klien untuk vendor.

## Konvensi Umum

- Keamanan
  - Authorization: `Bearer <token>`
  - `X-Tenant-ID`: ID tenant (atau resolusi domain, bila diaktifkan)
- Paginasi
  - Semua endpoint list menggunakan query `cursor` & `limit`
  - Numerik: `cursor` berbasis integer (umumnya untuk entitas dengan PK auto-increment)
  - String: `cursor` berbasis UUID/string (umumnya untuk ID bertipe UUID)
- Response
  - `APIResponse` dengan bidang `data`, `meta.pagination` (bila ada), dan `errors` (bila ada)

