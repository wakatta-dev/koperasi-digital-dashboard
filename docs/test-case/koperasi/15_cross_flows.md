# Test Case — Cross Flows (Koperasi E2E)

Alur menyeluruh lintas modul untuk memvalidasi integrasi operasional koperasi.

## KOP-XF-001 — Anggota baru → Setoran → Dashboard & Reporting
- 1) Membership register (KOP-MEM-001) → verify (KOP-MEM-002) → `member_id` aktif.
- 2) Savings deposit manual (KOP-SAV-001) → verify (KOP-SAV-002) → saldo bertambah.
- 3) Dashboard summary (KOP-DASH-001) memperlihatkan kenaikan `total_savings`/`active_members`.
- 4) Reporting finance (KOP-REPT-001/002) mencerminkan kas masuk.

## KOP-XF-002 — Apply pinjaman → Approve → Disburse → Pay (late) → Reporting
- 1) Loan apply (KOP-LOAN-001) → approve (KOP-LOAN-002) → disburse (KOP-LOAN-003).
- 2) Pay installment terlambat (KOP-LOAN-011) → penalty terhitung.
- 3) Reporting finance/cashflow (KOP-REPT-020) menampilkan kas masuk dari angsuran & kas keluar dari disbursement.
- 4) Dashboard trend (KOP-DASH-002) menampilkan aktivitas pinjaman.

## KOP-XF-003 — SHU tahunan → Distribusi → Reporting
- 1) Input SHU (KOP-SHU-001) → simulasi (KOP-SHU-002) → distribusi (KOP-SHU-003).
- 2) Reporting finance/cashflow (KOP-REPT-020) mencerminkan kas keluar distribusi SHU.
- 3) SHU member history (KOP-SHU-005) menampilkan alokasi.

## KOP-XF-004 — RAT lengkap + Notifikasi
- 1) Jadwalkan RAT (KOP-RAT-001) → notify (KOP-RAT-002) → upload dokumen (KOP-RAT-003).
- 2) Voting (KOP-RAT-010/011) → hasil (KOP-RAT-012).
- 3) Notifications list (KOP-NOTF-003) memuat pemberitahuan terkait.

## KOP-XF-005 — Asset & Cashbook → Reporting
- 1) Tambah aset (KOP-AST-001) → ubah status (KOP-AST-005).
- 2) Entri cashbook in/out (KOP-CBK-001/002) → summary/export (KOP-CBK-003/004).
- 3) Reporting cashflow (KOP-REPT-020) mengagregasi transaksi kas.

## KOP-XF-006 — Transaksi → Pelaporan → Notifikasi
- 1) Lakukan transaksi keuangan.
- 2) Ekspor/lihat laporan terkait transaksi.
- 3) Sistem mengirim notifikasi ke anggota/tenant.

