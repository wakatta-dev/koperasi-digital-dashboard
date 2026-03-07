# Panduan Penggunaan Modul Accounting

Dokumen ini menjelaskan cara menggunakan modul accounting di frontend BUMDes dari sisi pengguna operasional dan admin akuntansi.

## Tujuan Modul

Modul accounting dipakai untuk:

- memantau posisi keuangan harian dari dashboard accounting,
- mengelola piutang pelanggan melalui `Invoicing (AR)`,
- mengelola hutang vendor melalui `Vendor Bills (AP)`,
- memantau kas dan rekening bank serta proses rekonsiliasi,
- membuat dan meninjau jurnal akuntansi,
- membaca laporan keuangan dan ledger,
- memantau kewajiban pajak,
- mengatur master data akuntansi seperti COA, pajak, mata uang, dan anggaran analitik.

## Audiens

### 1. Pengguna Operasional / Staff Keuangan

Biasanya memakai modul untuk:

- membuat invoice,
- mencatat pembayaran,
- membuat vendor bill,
- melakukan batch payment,
- mengimpor mutasi bank,
- melakukan rekonsiliasi,
- membuat jurnal manual,
- membaca laporan keuangan.

### 2. Admin Akuntansi / Finance Lead

Biasanya memakai modul untuk:

- menyiapkan Chart of Accounts,
- menyiapkan pajak,
- menyiapkan mata uang,
- menyiapkan analytic budget,
- melakukan period lock,
- mengawasi audit trail,
- memastikan laporan siap dipakai manajemen.

## Struktur Menu Utama

| Area | Route Utama | Fungsi |
| --- | --- | --- |
| Dashboard | `/bumdes/accounting/dashboard` | Ringkasan KPI accounting dan transaksi terbaru |
| Invoicing AR | `/bumdes/accounting/invoicing-ar` | Piutang pelanggan dan invoice |
| Vendor Bills AP | `/bumdes/accounting/vendor-bills-ap` | Hutang vendor dan pembayaran vendor |
| Bank & Cash | `/bumdes/accounting/bank-cash` | Rekening bank, kas, mutasi, rekonsiliasi |
| Journal | `/bumdes/accounting/journal` | Daftar jurnal, jurnal manual, audit log |
| Reporting | `/bumdes/accounting/reporting` | Statement report dan ledger report |
| Tax | `/bumdes/accounting/tax/summary` | Ringkasan pajak, PPN, PPh, e-Faktur |
| Settings | `/bumdes/accounting/settings` | COA, pajak, mata uang, analytic budget |

## Alur Penggunaan yang Disarankan

### Alur Harian Pengguna Operasional

1. Buka dashboard accounting untuk melihat KPI hari ini.
2. Kelola invoice pelanggan di `Invoicing (AR)`.
3. Kelola tagihan vendor di `Vendor Bills (AP)`.
4. Impor mutasi bank dan lakukan rekonsiliasi di `Bank & Cash`.
5. Buat jurnal manual jika ada transaksi penyesuaian.
6. Cek laporan `Profit and Loss`, `Cash Flow`, `Balance Sheet`, dan ledger sesuai kebutuhan.

### Alur Setup Awal Admin Akuntansi

1. Siapkan `Chart of Accounts`.
2. Siapkan master pajak.
3. Siapkan mata uang aktif dan kurs.
4. Siapkan analytic budget jika diperlukan.
5. Pastikan akun kas/bank, pendapatan, HPP, dan persediaan tersedia.
6. Gunakan period lock saat periode sudah ditutup.

## Panduan per Area

### Dashboard Accounting

Route: `/bumdes/accounting/dashboard`

Fungsi utama:

- melihat KPI utama seperti pendapatan, pengeluaran, laba bersih, dan saldo kas,
- melihat transaksi terbaru,
- melihat ringkasan periode aktif.

Catatan:

- dashboard membaca data overview reporting,
- bila belum ada transaksi, tabel transaksi terbaru dapat kosong,
- dashboard dipakai untuk monitoring cepat, bukan untuk entry transaksi.

### Invoicing (AR)

Route utama: `/bumdes/accounting/invoicing-ar`

Halaman yang tersedia:

- daftar invoice,
- buat invoice baru,
- detail invoice,
- create credit note,
- record payment,
- halaman gabungan credit notes dan payments.

Fungsi utama:

- membuat invoice pelanggan,
- memantau status invoice `Draft`, `Sent`, `Paid`, dan `Overdue`,
- membuat credit note,
- mencatat penerimaan pembayaran.

Tombol utama di halaman index:

- `Create Invoice`
- `Create Credit Note`
- `Record Payment`

Saran penggunaan:

- gunakan `Create Invoice` untuk penagihan standar,
- gunakan `Create Credit Note` bila ada koreksi nilai tagihan,
- gunakan `Record Payment` setelah pembayaran diterima.

### Vendor Bills (AP)

Route utama: `/bumdes/accounting/vendor-bills-ap`

Halaman yang tersedia:

- daftar vendor bill,
- detail bill,
- batch payment,
- OCR review,
- payment confirmation.

Fungsi utama:

- membuat vendor bill,
- memantau tagihan vendor,
- memilih beberapa bill untuk pembayaran batch,
- membuat bill dari OCR upload dokumen.

Tombol utama di halaman index:

- `New Bill`
- `OCR Upload`
- `Batch Payment`

Saran penggunaan:

- gunakan `New Bill` untuk input manual,
- gunakan `OCR Upload` bila menerima invoice vendor dalam bentuk dokumen,
- gunakan `Batch Payment` untuk membayar beberapa bill sekaligus.

### Bank & Cash

Route utama: `/bumdes/accounting/bank-cash`

Halaman yang tersedia:

- overview bank and cash,
- reconciliation,
- detail transaksi per account.

Fungsi utama:

- menambah rekening bank,
- mengimpor bank statement,
- melihat transaksi belum rekonsiliasi,
- melakukan matching antara mutasi bank dan system ledger,
- mengekspor transaksi account tertentu.

Tombol utama di overview:

- `Add Bank Account`
- `Import Statement`

Fungsi utama di reconciliation:

- melihat selisih rekonsiliasi,
- memilih bank lines dan system lines,
- menjalankan suggested match,
- melakukan confirm reconciliation.

Saran penggunaan:

- impor mutasi bank terlebih dahulu,
- cocokkan transaksi yang benar-benar setara,
- baru lakukan konfirmasi rekonsiliasi saat selisih sudah wajar.

### Journal

Route utama: `/bumdes/accounting/journal`

Halaman yang tersedia:

- daftar journal entries,
- create manual journal,
- journal detail,
- audit log.

Fungsi utama:

- meninjau jurnal yang sudah terbentuk,
- memfilter jurnal berdasarkan kata kunci, tanggal, tipe, dan status,
- membuat jurnal manual,
- melihat history perubahan pada audit log,
- melakukan lock accounting period.

Tombol dan aksi utama:

- `New Journal Entry`
- akses `Audit Log`
- buka detail jurnal dari nomor jurnal,
- period lock dari halaman daftar jurnal.

Aturan penting:

- jurnal manual harus seimbang antara debit dan kredit,
- metadata minimal harus terisi,
- period lock akan mencegah entry atau perubahan jurnal pada periode yang sudah dikunci.

Catatan audit:

- halaman audit log dipakai untuk menelusuri siapa melakukan perubahan,
- aksi export CSV pada audit log masih ditandai belum tersedia.

### Reporting

Route utama: `/bumdes/accounting/reporting`

Kelompok laporan:

- Statement Reports:
  - `Profit and Loss`
  - `Cash Flow Statement`
  - `Balance Sheet`
  - `P&L Comparative`
- Ledgers:
  - `Trial Balance`
  - `General Ledger`
  - `Account Ledger`

Fungsi utama:

- membaca laporan periodik,
- membandingkan laba rugi antar periode,
- membaca saldo per akun,
- melakukan drill-down ke akun tertentu.

Catatan perilaku report terbaru:

- data reporting accounting sekarang mengikuti jurnal yang diposting,
- transaksi marketplace yang selesai dan penyewaan aset yang selesai akan ikut tercermin pada jurnal dan laporan,
- `Cash Flow` dan `Balance Sheet` tidak lagi dibiarkan kosong total,
- bila periode yang dipilih tidak punya data, sistem dapat otomatis menampilkan periode terakhir yang punya data,
- frontend akan menampilkan banner saat fallback periode terjadi,
- bila tenant benar-benar belum punya histori, laporan tetap tampil dengan struktur nilai nol agar halaman tidak blank.

Implikasi untuk user:

- jika melihat banner fallback, artinya periode yang dipilih tidak memiliki data reportable,
- jika tabel berisi nilai nol, artinya struktur laporan tetap ditampilkan walau belum ada histori transaksi.

### Tax

Route utama: `/bumdes/accounting/tax/summary`

Halaman yang tersedia:

- summary,
- PPN details,
- PPh records,
- export history,
- e-Faktur export.

Fungsi utama:

- memantau kewajiban pajak,
- melihat ringkasan per periode,
- membuka detail transaksi PPN,
- membuka catatan PPh,
- membuat antrean generate tax report,
- membuka halaman export e-Faktur.

Tombol utama:

- `Generate Tax Report`
- `Export e-Faktur`

Saran penggunaan:

- gunakan summary untuk memantau periode pajak,
- gunakan halaman detail saat butuh validasi transaksi atau data dasar sebelum ekspor.

### Settings

Route utama: `/bumdes/accounting/settings`

Sub-menu:

- `Chart of Accounts`
- `Taxes`
- `Currencies`
- `Analytic Budgets`

#### Chart of Accounts

Route: `/bumdes/accounting/settings/chart-of-accounts`

Dipakai admin untuk:

- menambah akun,
- mengubah akun,
- menghapus akun,
- mengatur parent account dan tipe akun.

Catatan penting:

- pastikan akun kas/bank, pendapatan, HPP, persediaan, liabilitas, dan ekuitas tersedia,
- akun-akun ini penting untuk posting jurnal otomatis dan kualitas laporan.

#### Taxes

Route: `/bumdes/accounting/settings/taxes`

Dipakai admin untuk:

- membuat tax baru,
- mengubah tax,
- mengaktifkan/nonaktifkan tax,
- menduplikasi tax,
- menghapus tax.

#### Currencies

Route: `/bumdes/accounting/settings/currencies`

Dipakai admin untuk:

- menambah mata uang,
- memperbarui kurs,
- mengatur auto rate update bila didukung backend.

#### Analytic Budgets

Route: `/bumdes/accounting/settings/analytic-budgets`

Dipakai admin untuk:

- membuat budget,
- mengubah budget,
- menghapus budget,
- menambah analytic account.

## Panduan Peran

### Pengguna Operasional

Gunakan terutama:

- dashboard accounting,
- invoicing AR,
- vendor bills AP,
- bank & cash,
- journal entry manual bila dibutuhkan,
- reporting untuk pengecekan hasil transaksi.

Hindari perubahan berikut kecuali memang bertanggung jawab:

- mengubah COA,
- mengubah tax master,
- mengubah currency master,
- melakukan period lock tanpa persetujuan finance lead.

### Admin Akuntansi

Bertanggung jawab pada:

- setup dan pemeliharaan master accounting,
- closing period dan period lock,
- validasi struktur akun untuk integrasi otomatis,
- monitoring audit trail,
- memastikan laporan dapat dibaca manajemen.

## Integrasi Marketplace dan Penyewaan Aset

Untuk perilaku pelaporan terbaru:

- order marketplace yang mencapai status `COMPLETED` akan menghasilkan jurnal otomatis,
- booking penyewaan aset yang mencapai status `COMPLETED` akan menghasilkan jurnal otomatis,
- jurnal otomatis tersebut menjadi bagian dari source of truth untuk reporting accounting,
- akibatnya data marketplace dan penyewaan aset akan ikut muncul di:
  - `Cash Flow Statement`
  - `Balance Sheet`
  - `Profit and Loss`
  - `Trial Balance`
  - `General Ledger`
  - `Account Ledger`

Jika data belum muncul:

- cek apakah transaksi benar-benar sudah `COMPLETED`,
- cek apakah akun COA yang dibutuhkan tersedia,
- cek apakah periode yang dibuka memang memuat tanggal jurnal terkait,
- cek apakah frontend sedang menampilkan fallback periode.

## Troubleshooting Singkat

### Halaman laporan kosong atau nol

Periksa:

- apakah tenant memang belum punya histori jurnal,
- apakah periode yang dipilih benar,
- apakah ada banner fallback periode,
- apakah transaksi sumber sudah berstatus final.

### Gagal membuat jurnal manual

Periksa:

- debit dan kredit harus seimbang,
- tanggal dan referensi jurnal wajib diisi,
- periode mungkin sedang dikunci.

### Data tax atau settings tidak berubah

Periksa:

- error banner di halaman,
- validasi backend,
- hak akses pengguna,
- refetch setelah mutasi berhasil.

## Catatan Implementasi Frontend

Dokumentasi ini mengikuti halaman yang tersedia di `frontend/src/app/(mvp)/bumdes/accounting` dan komponen module accounting di `frontend/src/modules/accounting`.

Hak akses final, validasi final, dan hasil mutasi tetap mengikuti backend dan policy tenant yang aktif.
