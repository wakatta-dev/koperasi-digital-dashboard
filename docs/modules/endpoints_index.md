# Indeks Endpoint per Modul

Ringkasan endpoint utama yang didokumentasikan. Seluruh endpoint memerlukan `Authorization: Bearer <token>` dan `X-Tenant-ID` jika tidak disebutkan lain.

| Modul | Endpoint | Deskripsi |
|-------|----------|-----------|
| [Dashboard](dashboard.md) | GET /dashboard/summary | Ringkasan metrik tenant |
| | GET /dashboard/trend | Tren simpanan/pinjaman |
| | GET /dashboard/notifications | Notifikasi terbaru |
| | GET /dashboard | Ringkasan dashboard vendor |
| [Livechat](livechat.md) | POST /livechat/sessions | Mulai sesi chat |
| | POST /livechat/sessions/{id}/messages | Kirim pesan |
| | GET /livechat/sessions/{id}/messages | Riwayat pesan |
| [Reporting](reporting.md) | GET /reports/finance | Ringkasan kas |
| | GET /reports/billing | Ringkasan billing |
| | GET /reports/cashflow | Arus kas per kategori |
| | GET /reports/profit-loss | Laporan laba rugi |
| | GET /reports/balance-sheet | Neraca |
| | GET /reports/export | Ekspor laporan tenant |
| | GET /reports/history | Riwayat ekspor tenant |
| | GET /reports/financial | Ringkasan keuangan vendor |
| | GET /reports/usage | Ringkasan penggunaan modul/tenant |
| | POST /reports/export | Ekspor laporan vendor |
| | GET /reports/exports | Daftar ekspor vendor |
| [SHU](shu.md) | POST /shu/yearly | Input total SHU tahunan |
| | POST /shu/yearly/{year}/simulate | Simulasi distribusi SHU |
| | POST /shu/yearly/{year}/distribute | Distribusi aktual SHU |
| | GET /shu/history | Daftar nilai SHU tahunan |
| | GET /shu/member/{member_id} | Riwayat SHU per anggota |
| | GET /shu/export/{year} | Ekspor laporan SHU per tahun |
| [Ticket](ticket.md) | POST /tickets | Buat tiket baru |
| | GET /tickets | Daftar tiket tenant atau agen |
| | GET /tickets/{id} | Detail tiket tenant |
| | POST /tickets/{id}/replies | Balas tiket |
| | PATCH /tickets/{id} | Perbarui status/penugasan |
| | GET /tickets/{id}/activities | Riwayat aktivitas tiket |
| | GET /tickets/{id}/replies | Daftar balasan tiket (vendor) |
| | POST /tickets/sla | Atur SLA kategori tiket |
| | GET /tickets/sla | Daftar konfigurasi SLA |
| [Asset](asset.md) | GET /assets | Daftar aset |
| | GET /assets/{id}/depreciation | Riwayat depresiasi aset |
| [Risk](risk.md) | GET /risk/config | Daftar aturan risiko |
| [Savings](savings.md) | GET /savings/{member_id}/transactions | Riwayat transaksi simpanan |
| [RAT](rat.md) | GET /rat/history | Riwayat RAT |
| [Sharia Financing](sharia.md) | GET /sharia-financings/{id}/installments | Angsuran pembiayaan syariah |
| [Notifications](notification.md) | GET /notifications | Daftar notifikasi |
| [Loan](loan.md) | GET /loans/{id}/installments | Angsuran pinjaman |
| [Finance/Transactions](finance_transactions.md) | GET /transactions | Daftar transaksi keuangan |
| | GET /transactions/{id}/history | Riwayat transaksi |
| [Billing](billing.md) | GET /plans | Daftar plan |
| | GET /invoices | Daftar invoice |
| | GET /client/invoices | Daftar invoice tenant |
| | GET /client/invoices/{id}/audits | Audit invoice tenant |
| | GET /subscriptions | Daftar subscription |
| | GET /audits | Audit status |
