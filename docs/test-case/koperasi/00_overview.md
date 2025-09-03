# E2E Test Overview — Koperasi

Modul yang dicakup (Koperasi + Core):
- Auth & User Management (login/refresh/logout)
- Dashboard Koperasi (`/coop/dashboard/*`)
- Membership (pendaftaran, verifikasi, status, kartu anggota/QR)
- Savings (setoran/penarikan + verifikasi)
- Loan (apply/approve/disburse/pay/release-letter)
- Sharia Financing (alur syariah setara loan)
- SHU (input tahunan, simulasi, distribusi, riwayat)
- RAT (jadwal, notifikasi, dokumen, voting, hasil)
- Cashbook (entri kas manual, ringkasan, ekspor)
- Asset (CRUD, depresiasi, status, ekspor)
- Reporting (finance/billing/cashflow/profit-loss/balance-sheet)
- Notifications & Ticket (operasional lintas modul)
 - Finance/Transactions (pencatatan kas generik)
 - Tenant & Roles/Permissions (operasional tenant sendiri)
 - Billing Client (tagihan tenant, pembayaran manual, status subscription)

## Prasyarat Umum
- Header: `Authorization: Bearer <token>` dan `X-Tenant-ID: <tenant_koperasi_id>` untuk semua endpoint non-publik.
- Akun uji:
  - `coop_admin` (role: admin koperasi)
- Data contoh:
  - `tenant_koperasi_id`
  - `member_id`, `savings_transaction_id`, `loan_id`, `installment_id` akan terbentuk dalam alur uji

## Urutan Disarankan (Happy-path)
1) Auth (login admin koperasi) → token.
2) Membership: register anggota → verify → generate kartu → validate QR.
3) Savings: setoran manual → verifikasi → penarikan → approve.
4) Loan/Sharia: apply → approve → disburse → pay → release-letter (bila lunas).
5) SHU: input tahunan → simulasi → distribusi → riwayat.
6) RAT: jadwalkan → notify → upload dokumen → buat voting → vote → lihat hasil.
7) Cashbook: buat entri manual → ringkasan → ekspor.
8) Asset: CRUD → depresiasi → status → ekspor.
9) Reporting: lihat ringkasan/report sesuai periode.
10) Finance/Transactions: catat transaksi kas umum + ekspor.
11) Tenant & Roles/Permissions: atur modul & peran pengguna.
12) Billing Client: tinjau tagihan layananan SaaS dan unggah bukti pembayaran.
13) Notifications & Ticket: kirim notifikasi internal, buat tiket dukungan.
 