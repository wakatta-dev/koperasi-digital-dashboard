
# Blueprint Penyempurnaan Sistem Accounting untuk Integrasi Marketplace dan Penyewaan Aset
**Versi dokumen:** 1.0  
**Tanggal:** 2026-03-07  
**Bahasa:** Indonesia  
**Tujuan:** menjadi pedoman desain, implementasi, kontrol, dan roadmap penyempurnaan sistem accounting yang saat ini memiliki menu inti: Dashboard, Invoicing (AR), Vendor Bills (AP), Bank & Cash, Journal, Tax, Reporting, dan Settings.

## Daftar isi

1. [Ringkasan eksekutif](#1-ringkasan-eksekutif)
2. [Cara membaca dokumen ini](#2-cara-membaca-dokumen-ini)
3. [Prinsip accounting yang harus menjadi fondasi sistem](#3-prinsip-accounting-yang-harus-menjadi-fondasi-sistem)
4. [Penilaian atas struktur modul Anda saat ini](#4-penilaian-atas-struktur-modul-anda-saat-ini)
5. [Struktur target modul yang disarankan](#5-struktur-target-modul-yang-disarankan)
6. [Alur penggunaan sebenarnya untuk setiap modul yang ada saat ini](#6-alur-penggunaan-sebenarnya-untuk-setiap-modul-yang-ada-saat-ini)
7. [Dashboard](#7-dashboard)
8. [Invoicing (AR)](#8-invoicing-ar)
9. [Vendor Bills (AP)](#9-vendor-bills-ap)
10. [Bank & Cash](#10-bank--cash)
11. [Journal](#11-journal)
12. [Tax](#12-tax)
13. [Reporting](#13-reporting)
14. [Settings](#14-settings)
15. [Modul yang sebaiknya ditambahkan](#15-modul-yang-sebaiknya-ditambahkan)
16. [Modul yang sebaiknya dipertahankan tetapi diperjelas](#16-modul-yang-sebaiknya-dipertahankan-tetapi-diperjelas)
17. [Desain akun (COA) tingkat tinggi](#17-desain-akun-coa-tingkat-tinggi-yang-direkomendasikan)
18. [Posting matrix](#18-posting-matrix-dari-modul-ke-jurnal)
19. [Integrasi marketplace](#19-integrasi-marketplace-desain-accounting-yang-benar)
20. [Integrasi penyewaan aset](#20-integrasi-penyewaan-aset-desain-accounting-yang-benar)
21. [Inventory & COGS integration](#21-inventory--cogs-integration-bila-marketplace-menjual-barang-fisik)
22. [Deferred revenue, deferred expense, dan advances](#22-deferred-revenue-deferred-expense-dan-advances)
23. [Customer deposits dan security deposits](#23-customer-deposits-dan-security-deposits)
24. [Tax architecture yang sebaiknya dipakai](#24-tax-architecture-yang-sebaiknya-dipakai)
25. [Dimensi analitik yang direkomendasikan](#25-dimensi-analitik-yang-direkomendasikan)
26. [Rekomendasi report lanjutan](#26-rekomendasi-report-lanjutan)
27. [Pengendalian internal dan audit trail](#27-pengendalian-internal-dan-audit-trail)
28. [Month-end close dan year-end close](#28-month-end-close-dan-year-end-close)
29. [Dashboard & KPI yang sebaiknya ditambahkan](#29-dashboard--kpi-yang-sebaiknya-ditambahkan)
30. [Role & permission matrix](#30-role--permission-matrix-yang-direkomendasikan)
31. [Migrasi data](#31-migrasi-data-apa-yang-wajib-dipindahkan-ke-sistem-baruyang-disempurnakan)
32. [UAT / test scenarios](#32-uat--test-scenarios-minimum-sebelum-go-live)
33. [Checklist “jangan lakukan ini”](#33-checklist-jangan-lakukan-ini)
34. [Rekomendasi implementasi teknis untuk integrasi](#34-rekomendasi-implementasi-teknis-untuk-integrasi)
35. [Rekomendasi prioritas 90 hari](#35-rekomendasi-prioritas-90-hari)
36. [Roadmap 6–12 bulan](#36-rekomendasi-roadmap-612-bulan)
37. [Struktur target menu: usulan final yang efisien](#37-struktur-target-menu-usulan-final-yang-efisien)
38. [Kesimpulan besar](#38-kesimpulan-besar)
39. [Appendix A — Daftar kontrol minimum per area](#39-appendix-a--daftar-kontrol-minimum-per-area)
40. [Appendix B — Contoh KPI dashboard yang konkret](#40-appendix-b--contoh-kpi-dashboard-yang-konkret)
41. [Appendix C — Saran field master data minimum](#41-appendix-c--saran-field-master-data-minimum)
42. [Appendix D — Rujukan eksternal](#42-appendix-d--rujukan-eksternal-yang-dipakai-sebagai-benchmark-desain)
43. [Penutup](#43-penutup)

---


---

## 1. Ringkasan eksekutif

Sistem Anda sudah memiliki fondasi **core accounting** yang benar: ada siklus pendapatan, siklus pengeluaran, kas/bank, jurnal umum, pajak, pelaporan, dan konfigurasi dasar. Namun, agar sistem benar-benar siap dipakai untuk operasi yang kompleks—khususnya bila diintegrasikan dengan **marketplace** dan **penyewaan aset**—fondasi ini perlu dinaikkan menjadi **arsitektur akuntansi yang berorientasi subledger, event, rekonsiliasi, dan kontrol periode**.

Secara praktis, arah penyempurnaan yang disarankan adalah:

1. **Pertahankan modul inti yang ada**, tetapi perjelas perannya.
2. **Kurangi ketergantungan pada jurnal manual**; transaksi operasional seharusnya lahir dari modul sumber.
3. **Tambahkan modul atau layer yang belum tampak**, terutama:
   - Customer Receipts / Customer Payments
   - Vendor Payments / Payment Run
   - Fixed Assets / Asset Register
   - Deferred Revenue / Deferred Expense
   - Customer Deposits / Advances
   - Marketplace Settlement / Clearing
   - Rental Contracts / Billing Schedule
   - Period Closing / Lock Dates
   - Approval Workflow
   - Attachments & Audit Trail
   - Inventory & COGS integration (bila marketplace menjual barang fisik)
4. **Gunakan akun perantara (clearing accounts)** untuk alur yang tidak 1:1, seperti settlement marketplace, payment gateway, outstanding receipts/payments, dan deposit.
5. **Pastikan semua laporan keuangan ditopang oleh rekonsiliasi** antara subledger dan general ledger.
6. **Jadikan pajak sebagai tax engine yang configurable**, bukan angka/tarif yang di-hardcode.
7. **Bangun dimensi analitik** sejak awal agar profitabilitas bisa dibaca per channel, cabang, marketplace, lokasi aset, kategori aset, kontrak, atau cost center.

Dokumen ini dirancang untuk membantu Anda menyempurnakan sistem secara **benar secara ilmu accounting** sekaligus **realistis untuk implementasi sistem keuangan**.

---

## 2. Cara membaca dokumen ini

Dokumen ini dibagi menjadi empat lapisan:

1. **Lapisan prinsip accounting**  
   Menjelaskan aturan main yang harus dijaga agar sistem benar secara akuntansi.

2. **Lapisan modul dan alur penggunaan**  
   Menjelaskan fungsi modul yang ada, bagaimana semestinya dipakai, apa input-output-nya, dan kontrol yang harus ada.

3. **Lapisan integrasi bisnis**  
   Menjelaskan bagaimana marketplace dan penyewaan aset dihubungkan ke accounting tanpa merusak kualitas laporan.

4. **Lapisan implementasi sistem**  
   Menjelaskan struktur target menu, akun, dimensi, control matrix, month-end close, UAT, migrasi, dan roadmap prioritas.

---

## 3. Prinsip accounting yang harus menjadi fondasi sistem

### 3.1 Basis akrual
Sistem harus dibangun di atas **basis akrual**, bukan kas. Artinya:
- pendapatan diakui saat kewajiban pelaksanaan dipenuhi / hak tagih timbul,
- beban diakui saat manfaat ekonomi dikonsumsi / kewajiban timbul,
- bukan semata saat kas diterima atau dibayar.

Ini penting karena:
- invoice penjualan belum tentu langsung dibayar,
- vendor bill belum tentu langsung dibayar,
- settlement marketplace sering tertunda,
- sewa aset bisa dibayar di muka tetapi pendapatannya baru “earned” per periode.

### 3.2 Double-entry bookkeeping
Setiap transaksi harus mempengaruhi minimal dua akun dan total debit harus sama dengan total kredit. Implikasinya:
- tidak boleh ada transaksi “single-sided”,
- setiap modul operasional harus menghasilkan jurnal yang seimbang,
- audit trail harus menunjuk ke sumber transaksi.

### 3.3 Pemisahan subledger dan general ledger
General ledger tidak boleh menjadi tempat utama input transaksi operasional. Yang ideal:
- **AR subledger** untuk customer invoice, receipt, credit note, aging,
- **AP subledger** untuk vendor bill, payment, debit note, aging,
- **Bank subledger** untuk statement, transfer, rekonsiliasi,
- **Tax subledger** untuk PPN/PPh,
- **Fixed asset subledger** untuk aset, depresiasi, disposal,
- **Marketplace settlement subledger** untuk payout/fee/refund,
- **Rental subledger** untuk kontrak, billing schedule, deposit.

General ledger berfungsi sebagai buku besar final yang menerima hasil posting dari subledger, bukan tempat user operasional “menciptakan” transaksi bisnis.

### 3.4 Cut-off dan recognition event
Sistem harus tegas soal **kapan** suatu event bisnis boleh menjadi event akuntansi. Contoh:
- order marketplace **dibuat** belum tentu berarti pendapatan sudah boleh diakui,
- pembayaran deposit sewa **diterima** bukan berarti pendapatan sewa,
- barang dikirim atau diterima mungkin memicu COGS atau pengakuan aset, tergantung kebijakan dan titik transfer kontrol.

### 3.5 Reconciliation as a first-class citizen
Laporan keuangan yang rapi bukan hanya soal jurnal yang “terposting”, tetapi soal **keseimbangan antara detail dan saldo buku besar**. Karena itu sistem harus mempunyai rekonsiliasi yang kuat untuk:
- bank vs statement,
- AR aging vs akun piutang,
- AP aging vs akun utang,
- tax detail vs akun pajak,
- asset register vs akun aset/akumulasi depresiasi,
- deferred revenue schedule vs akun kewajiban pendapatan ditangguhkan,
- deposit detail vs akun deposit pelanggan,
- marketplace settlement detail vs akun clearing marketplace.

### 3.6 Posted transactions should be reversible, not deletable
Begitu transaksi sudah posted dan apalagi sudah dipakai untuk pelaporan:
- jangan dihapus,
- jangan diedit bebas,
- koreksi dilakukan dengan **reversal, credit note, debit note, adjustment journal**, atau mekanisme resmi lain.

### 3.7 Control accounts harus dilindungi
Akun kontrol seperti:
- Piutang Usaha,
- Utang Usaha,
- PPN Keluaran / Masukan,
- Deposit Pelanggan,
- Deferred Revenue,
- Clearing Marketplace,
- Akumulasi Depresiasi,

idealnya **tidak bisa diposting manual oleh user biasa**, kecuali oleh role accounting/controller dengan approval yang jelas.

### 3.8 Dimensi analitik wajib
Sistem akan jauh lebih berguna bila selain akun, setiap baris transaksi juga memiliki dimensi seperti:
- entity / company
- branch / lokasi
- channel penjualan
- marketplace
- cost center
- project
- asset / asset category
- kontrak rental
- customer / vendor
- currency

Tanpa dimensi, laporan hanya menunjukkan “berapa”, tetapi tidak menjawab “dari mana” dan “oleh siapa”.


### 3.9 Rujukan prinsip standar akuntansi
Secara konsep, desain dalam dokumen ini diselaraskan dengan prinsip yang lazim dalam SAK/PSAK yang berkiblat ke IFRS, terutama untuk area berikut:

#### A. Pendapatan
Untuk penjualan barang/jasa dan transaksi marketplace, pengakuan pendapatan sebaiknya mengikuti prinsip **transfer of control** dan **performance obligation**. Ini penting untuk menentukan kapan order marketplace boleh menjadi revenue, bagaimana menangani komisi, dan kapan pembayaran di muka harus menjadi deferred revenue.

#### B. Fixed assets
Untuk aset yang dipakai lebih dari satu periode—termasuk aset yang **disewakan kepada pihak lain**—pengakuan awal, pengukuran biaya, dan depresiasi harus mengikuti prinsip aset tetap. Depresiasi harus merefleksikan pola konsumsi manfaat ekonomi, bukan sekadar pola pendapatan.

#### C. Rental / lease accounting
Untuk bisnis penyewaan aset, bedakan:
- operating rental/operating lease,
- finance lease/hire purchase,
- dan bundle lease + non-lease services.

Bila Anda sebagai pemilik aset menyewakan aset secara operasional, aset pada umumnya tetap berada di neraca Anda dan terus disusutkan. Pendapatan sewa kemudian diakui sepanjang masa sewa dengan basis yang sistematis dan konsisten dengan substansi kontrak.

#### D. Principal vs agent
Untuk model marketplace, penentuan apakah entitas bertindak sebagai principal atau agent sangat mempengaruhi apakah revenue dicatat gross atau net. Karena itu, desain posting harus dimulai dari analisis substansi transaksi, bukan dari kebiasaan operasional saja.

### 3.10 Kebijakan materialitas
Sistem yang baik tetap membutuhkan kebijakan materialitas dari manajemen. Kebijakan ini mempengaruhi:
- batas kapitalisasi aset,
- kapan write-off kecil boleh otomatis,
- kapan approval wajib berlapis,
- kapan accrual dibuat,
- kapan perbedaan rekonsiliasi kecil boleh di-clearkan.

Tanpa kebijakan materialitas, sistem akan cenderung terlalu kaku atau justru terlalu longgar.


---

## 4. Penilaian atas struktur modul Anda saat ini

Berikut penilaian atas modul yang sudah tampak dari menu sistem Anda.

| Modul saat ini | Fungsi inti | Kekuatan | Gap utama | Arah penyempurnaan |
|---|---|---|---|---|
| Dashboard | Monitoring | Sudah tepat sebagai ringkasan | Sering terlalu statis bila tanpa KPI operasional | Jadikan dashboard sebagai cockpit keuangan |
| Invoicing (AR) | Tagihan customer & piutang | Core revenue cycle sudah ada | Belum tampak receipt, follow-up, customer advances | Perlu diperluas menjadi Sales & Receivables |
| Vendor Bills (AP) | Tagihan vendor & utang | Core expenditure cycle sudah ada | Belum tampak payment run, WHT flow, approval | Perlu diperluas menjadi Purchases & Payables |
| Bank & Cash | Mutasi kas/bank & rekonsiliasi | Sudah sangat penting | Perlu outstanding receipts/payments, auto-match rules | Jadikan Bank & Treasury |
| Journal | Jurnal umum/penyesuaian | Penting untuk closing | Berisiko disalahgunakan untuk transaksi operasional | Batasi untuk accounting adjustments |
| Tax | PPN, PPh, export | Sudah sangat bagus sebagai fondasi lokal | Perlu versioning, adapter, tax exception handling | Pertahankan tapi buat tax engine configurable |
| Reporting | FS & ledger | Fondasi laporan sudah benar | Kurang custom reports operasional | Tambah subledger tie-out & KPI reports |
| Settings | COA, pajak, currency, analytic | Fondasi master data ada | Perlu partner master, approval, lock, docs | Bagi menjadi Master Data & Configuration |

### Kesimpulan penilaian
Fondasi core accounting **sudah benar**, tetapi masih terasa seperti sistem accounting “inti” yang belum lengkap untuk operasi real-world yang kompleks. Kebutuhan terbesar ada pada:
- pembayaran dan settlement,
- aset tetap dan penyewaan aset,
- deposit dan deferred revenue,
- integrasi marketplace,
- approval dan period close,
- audit trail dan dokumen,
- inventory/HPP bila menjual barang fisik.

---

## 5. Struktur target modul yang disarankan

Struktur target berikut lebih efisien, lebih mudah dipahami user, dan lebih siap untuk integrasi.

```text
Accounting
├─ Dashboard
├─ Sales & Receivables
│  ├─ Customer Invoices
│  ├─ Customer Receipts
│  ├─ Credit Notes / Refunds
│  ├─ Collections / Follow-up
│  └─ AR Aging
├─ Purchases & Payables
│  ├─ Vendor Bills
│  ├─ Vendor Payments
│  ├─ Debit Notes
│  ├─ Withholding Tax
│  └─ AP Aging
├─ Bank & Treasury
│  ├─ Bank Accounts
│  ├─ Cash / Petty Cash
│  ├─ Internal Transfers
│  ├─ Statement Import
│  ├─ Reconciliation
│  └─ Cash Forecast
├─ Marketplace Settlement
│  ├─ Orders Summary
│  ├─ Payout / Settlement
│  ├─ Fees & Charges
│  ├─ Refunds / Disputes
│  └─ Clearing Reconciliation
├─ Assets & Rental
│  ├─ Fixed Assets Register
│  ├─ Depreciation
│  ├─ Rental Contracts
│  ├─ Billing Schedule
│  ├─ Security Deposits
│  ├─ Maintenance
│  └─ Disposal / Write-off
├─ General Ledger
│  ├─ Journal Entries
│  ├─ Recurring Entries
│  ├─ Accrual / Deferral
│  ├─ FX Revaluation
│  └─ Period Closing / Lock Dates
├─ Tax
│  ├─ Summary & Period
│  ├─ PPN Details
│  ├─ PPh Records
│  ├─ Tax Reconciliation
│  ├─ Export History
│  └─ Tax Export Adapter (e-Faktur / e-Bupot / Coretax-ready)
├─ Reporting
│  ├─ Profit & Loss
│  ├─ Balance Sheet
│  ├─ Cash Flow Statement
│  ├─ Comparative Reports
│  ├─ Trial Balance
│  ├─ General Ledger
│  ├─ Account Ledger
│  ├─ AR/AP Aging
│  ├─ Bank Reconciliation Report
│  ├─ Fixed Asset Rollforward
│  ├─ Deferred Revenue Rollforward
│  ├─ Deposit Outstanding
│  ├─ Marketplace Settlement Reconciliation
│  └─ Analytic / Budget Reports
└─ Master Data & Configuration
   ├─ Chart of Accounts
   ├─ Customers
   ├─ Vendors
   ├─ Products & Services
   ├─ Taxes
   ├─ Currencies
   ├─ Payment Terms & Methods
   ├─ Analytic Dimensions
   ├─ Asset Categories
   ├─ Approval Rules
   ├─ Numbering & Sequences
   ├─ Lock Dates
   └─ Attachments / Reason Codes / Audit Policies
```

### Catatan simplifikasi menu
Beberapa menu bisa dirapikan:
- **Journal** sebaiknya dinamai **General Ledger / Journal Entries** agar user paham ini bukan tempat input semua transaksi.
- **General Ledger** dan **Account Ledger** bisa tetap dipertahankan, tetapi sebaiknya satu report engine yang sama dengan filter berbeda.
- **e-Faktur Export** sebaiknya diposisikan sebagai bagian dari **Tax Export Adapter**, bukan logika pajak utama yang di-hardcode.

---

## 6. Alur penggunaan sebenarnya untuk setiap modul yang ada saat ini

Bagian ini menjelaskan alur operasional “yang benar” untuk modul yang sudah ada.

---

## 7. Dashboard

### 7.1 Tujuan
Dashboard harus menjadi **cockpit** untuk CFO, finance manager, accountant, tax lead, dan treasury, bukan sekadar tampilan angka.

### 7.2 Yang seharusnya tampil
Dashboard ideal memuat tiga lapisan:

#### A. Ringkasan keuangan
- saldo kas & bank per rekening
- total AR outstanding
- total AP outstanding
- pendapatan bulan berjalan
- laba/rugi bulan berjalan
- posisi deferred revenue
- posisi customer deposit
- posisi marketplace clearing

#### B. Peringatan operasional
- invoice overdue
- bill overdue
- transaksi bank belum direkonsiliasi
- settlement marketplace belum match
- aset belum disusutkan
- kontrak rental akan jatuh tempo
- periode pajak belum direview
- periode akuntansi belum dilock

#### C. KPI manajerial
- DSO
- DPO
- collection rate
- gross-to-net revenue
- cash burn / net cash movement
- utilization aset rental
- maintenance cost per asset
- aging marketplace payouts

### 7.3 Yang tidak boleh dilakukan oleh dashboard
Dashboard bukan tempat:
- melakukan posting jurnal utama,
- mengubah master data,
- bypass approval.

### 7.4 Rekomendasi tambahan
Tambahkan widget:
- **Bank Reconciliation Completion %**
- **Marketplace Settlement Pending**
- **Deferred Revenue to Recognize This Month**
- **Deposit Outstanding**
- **Asset Utilization %**
- **Tax Exceptions**

---

## 8. Invoicing (AR)

### 8.1 Tujuan
Modul ini mengelola **piutang usaha dan penagihan customer**.

### 8.2 Aktor
- Sales Admin / Billing Admin
- AR Officer
- Accountant
- Tax Officer
- Collection Officer
- Treasury (untuk receipt allocation)

### 8.3 Data master minimum
Setiap customer idealnya memiliki:
- nama legal
- NPWP / tax ID
- alamat penagihan
- payment terms
- default currency
- default tax code
- channel / marketplace
- branch
- customer group
- status aktif/nonaktif
- akun piutang default
- analytic tags / dimension defaults

### 8.4 Dokumen sumber
Invoice AR seharusnya lahir dari salah satu sumber berikut:
- sales order yang sudah fulfilled,
- kontrak jasa,
- billing schedule rental,
- order marketplace yang sudah mencapai recognition event,
- manual invoice yang diotorisasi.

### 8.5 Alur penggunaan yang benar
1. **Trigger billing**  
   Sistem menerima trigger dari sales, kontrak, atau billing schedule.

2. **Draft invoice dibuat**  
   Item, harga, tax code, revenue account, dan dimensi analitik terisi otomatis dari master/mapping.

3. **Validasi sebelum posting**  
   Dicek:
   - tanggal invoice,
   - cut-off period,
   - customer status,
   - tax ID bila perlu,
   - akun pendapatan,
   - analytic dimensions,
   - nomor dokumen,
   - approval bila nilainya material.

4. **Posting invoice**  
   Secara umum:
   - Debit Piutang Usaha
   - Kredit Pendapatan
   - Kredit PPN Keluaran (bila relevan)

5. **Invoice dikirim / dipublikasikan**  
   Tergantung model bisnis:
   - ke customer langsung,
   - ke sistem pengiriman dokumen,
   - atau tetap internal bila penjualan berasal dari marketplace dan dokumen pajak dikelola terpisah.

6. **Pembayaran diterima**  
   Penerimaan kas sebaiknya tercatat sebagai event terpisah, bukan melekat ke invoice secara paksa.

7. **Allocation / matching receipt**  
   Payment dialokasikan ke satu atau banyak invoice.

8. **Follow-up / collections**  
   Invoice overdue masuk ke workflow reminder.

9. **Credit note / refund**  
   Koreksi invoice dilakukan dengan credit note, bukan edit invoice posted.

10. **Aging review dan write-off policy**  
   Piutang macet harus mengikuti kebijakan approval.

### 8.6 Jurnal umum
#### A. Invoice penjualan biasa
- Dr Piutang Usaha
- Cr Pendapatan
- Cr PPN Keluaran

#### B. Pembayaran customer
- Dr Kas/Bank atau Outstanding Receipts
- Cr Piutang Usaha

#### C. Overpayment customer
- Dr Kas/Bank
- Cr Liabilitas Uang Muka / Customer Advance

#### D. Credit note
- Dr Retur Penjualan / Contra Revenue
- Dr PPN Keluaran (reversal bila relevan)
- Cr Piutang Usaha

### 8.7 Kontrol yang wajib ada
- nomor invoice unik
- customer tidak boleh dibuat on-the-fly tanpa minimum data
- akun pendapatan ditentukan oleh product/service mapping, bukan selalu dipilih manual
- invoice posted tidak boleh diedit bebas
- semua perubahan harus loggable
- aging piutang harus sama dengan saldo akun AR control

### 8.8 Fitur yang disarankan ditambahkan
- Customer Receipts / Payments
- follow-up reminders / collection steps
- customer credit limit
- customer advances
- write-off workflow
- installment plan / payment schedule
- outstanding receipts account

### 8.9 Catatan khusus untuk marketplace
Untuk penjualan via marketplace, jangan langsung jurnal:
- Dr Bank
- Cr Pendapatan

Alur yang lebih benar biasanya:
- Dr Marketplace Clearing Receivable
- Cr Pendapatan
- (dan COGS bila barang fisik)
lalu saat payout:
- Dr Bank
- Dr Fee Marketplace / expense lain
- Cr Marketplace Clearing Receivable

### 8.10 Catatan khusus untuk rental
Untuk rental:
- invoice periodik boleh timbul dari billing schedule,
- bila tagihan dibayar di muka untuk beberapa bulan, pertimbangkan **Deferred Revenue**,
- deposit pelanggan jangan masuk pendapatan.

---

## 9. Vendor Bills (AP)

### 9.1 Tujuan
Mengelola tagihan vendor, utang, dan beban/aset yang dibeli.

### 9.2 Aktor
- Procurement / Purchase Admin
- AP Officer
- Tax Officer
- Accountant
- Treasury

### 9.3 Data master minimum vendor
- nama legal
- NPWP / tax ID
- payment terms
- currency
- default tax code
- withholding tax profile
- akun utang default
- bank details
- vendor category

### 9.4 Sumber vendor bill
- purchase order / penerimaan barang
- kontrak jasa
- biaya utilitas
- maintenance aset rental
- biaya marketplace / vendor eksternal
- invoice vendor manual

### 9.5 Alur penggunaan yang benar
1. **Bill capture**  
   Bill masuk dari email, OCR, upload, integrasi, atau input manual.

2. **Mapping akun**  
   Line bill dipetakan ke:
   - persediaan,
   - beban,
   - prepaid expense,
   - aset tetap,
   - maintenance,
   - pajak.

3. **Validasi**  
   Dicek:
   - nominal,
   - tanggal bill,
   - due date,
   - vendor,
   - tax invoice/supporting document,
   - apakah perlu withholding tax,
   - apakah perlu approval.

4. **Posting bill**  
   Umumnya:
   - Dr Persediaan/Beban/Aset/Prepaid
   - Dr PPN Masukan
   - Cr Utang Usaha

5. **Payment proposal / payment run**  
   Bill yang due disiapkan dalam batch pembayaran.

6. **Pembayaran**  
   Event pembayaran terpisah dari pengakuan bill.

7. **Rekonsiliasi pembayaran**  
   Cocokkan dengan statement bank.

8. **Debit note / reversal**  
   Bila ada retur, diskon, dispute.

### 9.6 Jurnal umum
#### A. Tagihan beban biasa
- Dr Beban
- Dr PPN Masukan
- Cr Utang Usaha

#### B. Tagihan aset tetap
- Dr Fixed Asset / CIP
- Dr PPN Masukan
- Cr Utang Usaha

#### C. Pembayaran vendor
- Dr Utang Usaha
- Cr Kas/Bank atau Outstanding Payments

#### D. Withholding tax bila relevan
Tergantung desain dan jenis pajak, pembayaran vendor dapat mengandung pemotongan:
- Dr Utang Usaha (nilai penuh tagihan)
- Cr Kas/Bank (net dibayar)
- Cr Utang PPh Dipotong / pajak terutang

### 9.7 Kontrol yang wajib ada
- nomor bill vendor + vendor unik untuk cegah duplikasi
- due date otomatis
- attachment wajib untuk jenis biaya tertentu
- approval berlapis sesuai nominal
- saldo AP aging harus sama dengan akun AP control

### 9.8 Fitur yang disarankan ditambahkan
- Vendor Payments / batch payment
- withholding tax workflow
- approval matrix
- OCR/doc capture
- three-way match (bila ada PO dan goods receipt)
- vendor advance / prepayment
- debit note

### 9.9 Catatan khusus untuk rental aset
Tagihan maintenance harus dibedakan:
- **routine maintenance** → beban,
- **major overhaul / refurbishment** yang memperpanjang masa manfaat → bisa dikapitalisasi sesuai kebijakan materialitas.

### 9.10 Catatan khusus untuk integrasi aset
Bila bill mengandung pembelian aset:
- jangan berhenti di akun beban,
- buat asset register,
- tentukan kategori aset,
- umur manfaat,
- metode depresiasi,
- lokasi,
- asset tag/serial number.

---

## 10. Bank & Cash

### 10.1 Tujuan
Mengelola semua mutasi kas dan bank, termasuk rekonsiliasi.

### 10.2 Struktur yang ideal
- satu journal per rekening bank
- satu journal per kas kecil/petty cash
- journal khusus payment gateway / wallet bila material
- journal khusus internal transfer bila perlu

### 10.3 Submenu yang sudah tampak
- Overview
- Rekonsiliasi

### 10.4 Alur penggunaan yang benar
1. **Statement diimpor setiap hari**  
   Dari bank feed, file statement, atau input manual terkontrol.

2. **Auto-matching**  
   Sistem mencoba mencocokkan mutasi bank dengan:
   - invoice receipts,
   - vendor payments,
   - transfer antar bank,
   - bank charges,
   - interest,
   - tax payment,
   - marketplace payouts,
   - refund.

3. **Exception handling**  
   Transaksi yang tidak match masuk queue exception.

4. **Manual reconciliation dengan kontrol**  
   User boleh pilih transaksi target atau buat write-off kecil sesuai limit.

5. **Month-end bank reconciliation**  
   Saldo buku bank = saldo menurut statement ± reconciling items.

### 10.5 Konsep yang sangat penting
#### A. Outstanding Receipts / Outstanding Payments
Jangan selalu langsung:
- Dr Bank / Cr Piutang
atau
- Dr Utang / Cr Bank

Pada banyak sistem, saat user “register payment”, yang lebih sehat adalah:
- Dr Outstanding Receipts
- Cr Piutang
atau
- Dr Utang
- Cr Outstanding Payments

Baru saat statement bank datang:
- Dr Bank
- Cr Outstanding Receipts
atau
- Dr Outstanding Payments
- Cr Bank

Keuntungannya:
- proses register payment terpisah dari mutasi bank,
- lebih rapi untuk rekonsiliasi,
- cocok untuk cek/giro, transfer pending, gateway, dan settlement marketplace.

### 10.6 Jurnal umum
#### A. Biaya admin bank
- Dr Bank Charges Expense
- Cr Bank

#### B. Bunga bank
- Dr Bank
- Cr Interest Income

#### C. Transfer antar rekening
- Dr Bank Tujuan / Transfer Clearing
- Cr Bank Asal / Transfer Clearing

### 10.7 Kontrol yang wajib ada
- statement import diberi nomor batch
- tidak boleh duplicate statement line
- ada auto-match rule yang terdokumentasi
- closing harus menyisakan daftar reconciling items
- saldo GL bank harus tie ke bank reconciliation report

### 10.8 Fitur yang disarankan ditambahkan
- statement import multi-bank
- bank rule engine
- outstanding receipts/payments
- cash forecast
- internal transfer workflow
- petty cash imprest
- payment gateway clearing
- marketplace payout recon view

### 10.9 Catatan khusus untuk marketplace
Ini area paling krusial. Umumnya 1 payout marketplace berisi:
- banyak order,
- potongan fee,
- refund,
- promo,
- biaya layanan,
- kadang chargeback atau reserve.

Karena itu, **jangan treat payout sebagai satu transaksi pendapatan bersih**. Harus ada:
- akun clearing marketplace,
- settlement ID,
- breakdown fee/refund,
- report recon antara order dan payout.

### 10.10 Catatan khusus untuk rental
Bank & Cash harus mampu menangani:
- deposit masuk,
- deposit keluar saat refund,
- pembayaran sewa bulanan,
- denda keterlambatan,
- tagihan kerusakan yang dibebankan ke penyewa.

---

## 11. Journal

### 11.1 Tujuan
Modul Journal dipakai untuk **jurnal manual, jurnal penyesuaian, accrual, reclass, correction, closing**.

### 11.2 Kapan dipakai
Journal dipakai bila transaksi:
- tidak memiliki modul sumber,
- merupakan penyesuaian period-end,
- merupakan accrual,
- merupakan deferral,
- merupakan reclassifikasi,
- merupakan koreksi audit,
- merupakan opening balance.

### 11.3 Kapan tidak boleh dipakai
Journal **tidak ideal** untuk transaksi operasional rutin seperti:
- invoice customer,
- vendor bill,
- pembayaran customer,
- pembayaran vendor,
- bank statement,
- depresiasi aset,
- settlement marketplace,
- deposit pelanggan,
- recurring rental billing.

Semua itu seharusnya datang dari modul khusus.

### 11.4 Tipe jurnal yang sebaiknya ada
- Miscellaneous Journal
- Accrual Journal
- Reversal Journal
- FX Revaluation Journal
- Closing Journal
- Opening Balance Journal
- Tax Adjustment Journal

### 11.5 Alur penggunaan yang benar
1. User membuat draft journal.
2. Memo, source reference, dan attachment wajib.
3. Journal line wajib lengkap:
   - account
   - description
   - analytic dimension
   - tax handling bila perlu
4. Approval bila menyentuh akun sensitif.
5. Posting.
6. Bila jurnal accrual, sediakan auto-reversal next period.

### 11.6 Kontrol yang wajib ada
- role terbatas
- approval wajib untuk nominal material
- dilarang posting manual ke akun kontrol tertentu tanpa permission khusus
- audit log perubahan
- reference source wajib
- recurring journals dengan template

### 11.7 Fitur yang disarankan ditambahkan
- recurring journal templates
- auto-reversal
- journal approval matrix
- restriction by account
- reason codes
- attachment policy
- accrual schedule
- deferral schedule

### 11.8 Contoh jurnal yang wajar
#### A. Accrued expense listrik bulan berjalan, invoice belum diterima
- Dr Beban Utilitas
- Cr Accrued Expenses

#### B. Reclass dari beban ke aset
- Dr Fixed Asset
- Cr Beban

#### C. Penyesuaian selisih kurs akhir bulan
- Dr/Cr Unrealized FX Gain/Loss
- Cr/Dr AR/AP/Bank Revaluation Reserve (sesuai desain)

---

## 12. Tax

### 12.1 Tujuan
Modul pajak mengelola **jejak pajak dari transaksi accounting**, bukan berdiri sendiri tanpa sumber.

### 12.2 Submenu yang sudah ada
- Summary & Period
- PPN Details
- PPh Records
- Export History
- e-Faktur Export

### 12.3 Prinsip desain tax engine
Tax engine yang baik harus:
- memakai **tax code** dengan tanggal efektif,
- memisahkan pajak keluaran, pajak masukan, withholding, final tax, dan pajak non-kreditabel,
- menyimpan basis pengenaan pajak,
- mampu menangani harga inclusive/exclusive,
- mendukung reversal/credit note,
- menyimpan identitas lawan transaksi,
- mempunyai export adapter yang versioned.

### 12.4 Alur penggunaan yang benar
1. **Tax setup** dilakukan di master.
2. Saat invoice/bill diposting, sistem membuat tax detail.
3. Tax detail masuk ke tax subledger.
4. Pada akhir masa, user review:
   - completeness,
   - partner tax ID,
   - transaksi pembatalan/retur,
   - mapping tax code,
   - dokumen pendukung.
5. Data diekspor ke format kepatuhan.
6. Periode yang sudah dilaporkan dilock.

### 12.5 Summary & Period
Dipakai untuk:
- melihat total DPP,
- melihat total PPN masukan/keluaran,
- melihat status masa,
- melihat exception,
- menandai period ready to report / reported / locked.

### 12.6 PPN Details
Harus bisa menunjukkan:
- per invoice / per bill,
- tax base,
- rate,
- tanggal pajak,
- customer/vendor tax data,
- status export/reporting.

### 12.7 PPh Records
Harus bisa menunjukkan:
- vendor yang dipotong,
- jenis PPh,
- dasar pemotongan,
- nominal potong,
- tanggal setor/lapor,
- reference bill/payment.

### 12.8 Export History
Penting untuk audit:
- file apa diekspor,
- kapan,
- oleh siapa,
- untuk periode apa,
- versi schema apa,
- apakah sudah final.

### 12.9 e-Faktur Export
Secara desain, fitur ini baik, tetapi sebaiknya diposisikan sebagai **adapter**. Maksudnya:
- business rules pajak tetap berada di tax engine,
- ekspor hanyalah salah satu format output,
- sistem bisa beradaptasi saat format/regulasi berubah.

### 12.10 Implikasi lokal Indonesia
Untuk Indonesia, desain tax module perlu siap dengan:
- perubahan parameter tarif atau formula,
- perubahan format export,
- alur administrasi DJP yang terus dimodernisasi,
- kebutuhan integrasi dengan e-Faktur, e-Bupot, atau kanal yang mengikuti ekosistem DJP yang berlaku saat implementasi.

### 12.11 Kontrol yang wajib ada
- tax code versioning by effective date
- tax lock by period
- partner tax data validation
- no direct edit after export without audit trail
- reconciliation tax detail ke akun GL

### 12.12 Fitur yang disarankan ditambahkan
- tax exception dashboard
- tax reconciliation report
- withholding tax from AP payment flow
- versioned export schema
- Coretax-ready connector layer
- document completeness checklist
- tax-only lock date

---

## 13. Reporting

### 13.1 Tujuan
Reporting adalah lapisan output untuk:
- manajemen,
- audit,
- kepatuhan,
- analisis profitabilitas,
- kontrol operasional.

### 13.2 Submenu yang sudah ada
- Profit and Loss
- Cash Flow Statement
- Balance Sheet
- P&L Comparative
- Trial Balance
- General Ledger
- Account Ledger

### 13.3 Peran masing-masing laporan
#### A. Profit and Loss
Menjawab: perusahaan untung atau rugi, dan dari mana sumber margin.

#### B. Cash Flow Statement
Menjawab: kas bergerak ke mana; sangat penting bila settlement marketplace tertunda dan rental banyak dibayar di muka.

#### C. Balance Sheet
Menjawab: posisi aset, kewajiban, dan ekuitas saat tanggal tertentu.

#### D. P&L Comparative
Menjawab: perubahan vs periode sebelumnya, budget, branch, channel, atau asset category.

#### E. Trial Balance
Menjawab: apakah saldo akun secara keseluruhan balance dan siap direview.

#### F. General Ledger
Detail seluruh jurnal untuk audit trail.

#### G. Account Ledger
Fokus ke satu akun tertentu, misalnya:
- Marketplace Clearing
- Customer Deposit
- Deferred Revenue
- Rental Revenue
- Maintenance Expense
- Accumulated Depreciation

### 13.4 Report tambahan yang sangat disarankan
- AR Aging
- AP Aging
- Bank Reconciliation Report
- Tax Reconciliation Report
- Fixed Asset Register & Rollforward
- Deferred Revenue Rollforward
- Customer Deposit Outstanding
- Marketplace Settlement Reconciliation
- Gross-to-Net Revenue Bridge
- Revenue by Channel / Marketplace
- Rental Revenue by Asset / Contract
- Asset Utilization Report
- Maintenance Cost by Asset
- Budget vs Actual by Analytic Dimension

### 13.5 Karakteristik report yang baik
- bisa drill-down ke source document
- bisa filter by entity/branch/channel/asset
- menunjukkan posted only vs posted+draft bila perlu
- memiliki “as of date”
- memiliki audit-friendly numbering
- memiliki tie-out ke GL control accounts

### 13.6 Kontrol yang wajib ada
- report AR aging harus sama dengan akun Piutang Usaha
- report AP aging harus sama dengan akun Utang Usaha
- bank reconciliation report harus sama dengan akun bank
- fixed asset rollforward harus sama dengan akun aset dan akumulasi depresiasi
- deferred revenue rollforward harus sama dengan akun kewajiban deferred revenue
- deposit report harus sama dengan akun deposit pelanggan
- marketplace settlement report harus sama dengan akun clearing marketplace

---

## 14. Settings

### 14.1 Chart of Accounts
COA adalah tulang punggung sistem. Prinsip COA yang baik:
- cukup detail untuk pelaporan penting,
- tidak terlalu gemuk,
- stabil,
- mudah dimapping dari modul sumber.

Untuk bisnis Anda, COA harus mampu memisahkan:
- penjualan direct
- penjualan marketplace
- pendapatan sewa
- fee marketplace
- ongkir
- refund
- customer deposit
- deferred revenue
- aset rental
- penyusutan aset rental
- maintenance aset rental
- pajak output/input
- withholding tax
- cash/bank/clearing

### 14.2 Taxes
Master tax harus menyimpan:
- tax code
- tax type
- formula base
- rate
- effective date
- recoverable/non-recoverable
- payable/receivable account
- export mapping
- inclusive/exclusive flag

### 14.3 Currencies
Untuk multi-currency:
- simpan transaction currency dan functional currency,
- simpan exchange rate policy,
- lakukan revaluation untuk open AR/AP/bank saat closing,
- pisahkan realized vs unrealized FX.

### 14.4 Analytic & Budget
Ini sangat penting dan harus diperlakukan serius.

#### Analytic dimensions yang direkomendasikan
- Company / Entity
- Branch / Location
- Sales Channel
- Marketplace
- Cost Center
- Product Line
- Asset Category
- Asset ID
- Rental Contract
- Project
- Customer Group

#### Budget
Gunakan analytic budget untuk:
- budget pendapatan per channel,
- budget maintenance per asset category,
- budget biaya per branch,
- budget cash collection target,
- budget capex aset rental.

### 14.5 Master data lain yang idealnya ada
Bila belum ada, tambahkan:
- Customer Master
- Vendor Master
- Product/Service Master
- Payment Terms
- Payment Methods
- Bank Accounts
- Asset Categories
- Approval Rules
- Lock Dates
- Reason Codes
- Attachment Policies

---

## 15. Modul yang sebaiknya ditambahkan

Bagian ini adalah inti penyempurnaan. Modul-modul berikut sangat disarankan.

### 15.1 Customer Receipts / Customer Payments
**Kenapa perlu:** invoice dan penerimaan kas adalah dua event berbeda.  
**Fungsi:** receipt, partial receipt, overpayment, allocation, refund.  
**Manfaat:** AR aging lebih bersih, bank reconciliation lebih mudah.

### 15.2 Vendor Payments / Payment Run
**Kenapa perlu:** AP tanpa payment run akan tetap manual.  
**Fungsi:** due list, batch payment, approval, partial payment, withholding, remittance.  
**Manfaat:** treasury lebih efisien, kontrol pembayaran lebih kuat.

### 15.3 Fixed Assets / Asset Register
**Kenapa perlu:** bisnis rental aset hampir selalu butuh register aset.  
**Fungsi:** asset card, capitalization, depreciation, transfer, maintenance linkage, disposal.  
**Manfaat:** aset rental tidak tercecer dalam jurnal manual.

### 15.4 Deferred Revenue / Deferred Expense
**Kenapa perlu:** pembayaran di muka tidak selalu langsung jadi pendapatan/beban periode ini.  
**Fungsi:** schedule recognition per bulan/periode.  
**Manfaat:** P&L tidak loncat-loncat.

### 15.5 Customer Deposit / Advance
**Kenapa perlu:** deposit sewa harus jadi kewajiban sampai dikembalikan/forfeited.  
**Fungsi:** receipt, application, refund, forfeiture, aging by contract.  
**Manfaat:** mencegah deposit salah dicatat sebagai pendapatan.

### 15.6 Marketplace Settlement / Clearing
**Kenapa perlu:** payout marketplace hampir tidak pernah 1:1 dengan order.  
**Fungsi:** settlement import, fee breakdown, refund handling, payout match, clearing reconciliation.  
**Manfaat:** cash receipt, revenue, fee, dan refund tidak bercampur.

### 15.7 Rental Contracts / Billing Schedule
**Kenapa perlu:** billing rental harus berasal dari kontrak dan jadwal, bukan manual tiap bulan.  
**Fungsi:** contract header, line items, rental term, renewal, escalation, billing cycle, deposit, penalty.  
**Manfaat:** pendapatan rental lebih akurat dan scalable.

### 15.8 Inventory & COGS Integration
**Kenapa perlu:** bila marketplace menjual barang fisik, accounting perlu HPP.  
**Fungsi:** stock movement, inventory valuation, COGS recognition, sales return.  
**Manfaat:** laba kotor menjadi benar.

### 15.9 Period Closing / Lock Dates
**Kenapa perlu:** laporan tidak boleh berubah terus setelah ditutup.  
**Fungsi:** closing checklist, lock period, reopen with approval.  
**Manfaat:** disiplin closing dan audit lebih kuat.

### 15.10 Approval Workflow
**Kenapa perlu:** mengendalikan invoice, bill, jurnal, payment, write-off.  
**Fungsi:** maker-checker-approver, limit nominal, exception approval.  
**Manfaat:** kontrol internal.

### 15.11 Attachments & Audit Trail
**Kenapa perlu:** transaksi keuangan harus bisa ditelusuri.  
**Fungsi:** lampiran dokumen, log perubahan, before-after values, user/time stamps.  
**Manfaat:** audit, investigasi, dan pembuktian pajak lebih mudah.

### 15.12 Collections / Dunning
**Kenapa perlu:** AR overdue perlu proses follow-up sistematis.  
**Fungsi:** reminder, escalation, stop-service rules.  
**Manfaat:** cash collection naik.

---

## 16. Modul yang sebaiknya dipertahankan tetapi diperjelas

### 16.1 Journal
Pertahankan, tetapi batasi. Jangan dijadikan jalur utama operasional.

### 16.2 General Ledger vs Account Ledger
Boleh dipertahankan dua nama, tetapi dari sisi engine report bisa satu. User tinggal pilih mode:
- semua akun,
- satu akun tertentu.

### 16.3 e-Faktur Export
Jangan dihapus, tetapi ubah paradigma:
- dari “menu pajak statis”
- menjadi “salah satu tax export adapter”.

---

## 17. Desain akun (COA) tingkat tinggi yang direkomendasikan

Contoh struktur COA ringkas:

### 17.1 Aset
- 1000 Kas & Bank
- 1100 Piutang Usaha
- 1110 Piutang Usaha - Direct Sales
- 1120 Piutang / Clearing - Marketplace
- 1130 Piutang Lain-lain
- 1140 Prepaid Expenses
- 1150 Pajak Masukan / PPN Masukan
- 1200 Persediaan
- 1300 Aset Tetap - Rental
- 1310 Akumulasi Depresiasi - Rental
- 1320 Aset Tetap - Office/Support
- 1330 Akumulasi Depresiasi - Office/Support
- 1400 Deferred Expense / Prepaid Long-term

### 17.2 Liabilitas
- 2000 Utang Usaha
- 2100 Accrued Expenses
- 2110 Pajak Keluaran / PPN Keluaran
- 2120 Utang PPh / Withholding Payable
- 2130 Customer Deposits
- 2140 Deferred Revenue
- 2150 Refund Liability / Claims Payable
- 2160 Outstanding Payments
- 2170 Marketplace Reserve / Retention (bila ada)

### 17.3 Ekuitas
- 3000 Modal
- 3100 Laba Ditahan
- 3200 Laba/Rugi Tahun Berjalan

### 17.4 Pendapatan
- 4000 Penjualan Direct
- 4010 Penjualan Marketplace
- 4020 Pendapatan Sewa
- 4030 Pendapatan Denda / Late Fee
- 4040 Pendapatan Recovery Kerusakan
- 4050 Pendapatan Jasa Lain
- 4090 Contra Revenue / Sales Returns / Discounts

### 17.5 HPP & Beban
- 5000 HPP Barang
- 5100 Fee Marketplace
- 5110 Payment Gateway Fee
- 5120 Shipping Subsidy / Delivery Expense
- 5200 Beban Maintenance Aset Rental
- 5300 Beban Depresiasi Aset Rental
- 5310 Beban Depresiasi Aset Non-Rental
- 5400 Beban Gaji
- 5410 Beban Administrasi
- 5420 Beban Bank
- 5430 Kerugian Piutang
- 5440 Gain/Loss Disposal Asset
- 5450 Selisih Kurs

### 17.6 Catatan penting COA
- **Clearing marketplace sebaiknya dipisah per channel besar** bila volume tinggi.
- **Deposit pelanggan wajib akun liabilitas**, bukan pendapatan.
- **Deferred revenue wajib liabilitas**, bukan langsung revenue.
- **Revenue dan contra revenue** sebaiknya dipisah, bukan saling overwrite.
- **Aset rental** pisah dari aset kantor.
- **Maintenance** pisah dari depreciation agar unit economics rental bisa dianalisis.

---

## 18. Posting matrix: dari modul ke jurnal

| Sumber transaksi | Journal / subledger | Akun utama | Dampak laporan |
|---|---|---|---|
| Customer Invoice | AR | AR, Revenue, Tax | AR Aging, P&L, BS, Tax |
| Customer Receipt | AR/Bank | Outstanding Receipts, AR, Bank | AR Aging, Cash, Bank Recon |
| Vendor Bill | AP | AP, Expense/Asset, Tax | AP Aging, P&L/BS, Tax |
| Vendor Payment | AP/Bank | AP, Outstanding Payments, Bank | AP Aging, Cash, Bank Recon |
| Bank Charges | Bank | Bank, Expense | Cash, P&L |
| Manual Accrual | Journal | Accrual/Expense | P&L, BS |
| Deferred Revenue Recognition | GL/Deferral | Deferred Revenue, Revenue | P&L, BS |
| Fixed Asset Purchase | AP/FA | Asset, AP/Bank | BS |
| Depreciation | FA | Depreciation, Accumulated Depreciation | P&L, BS |
| Marketplace Sale | Integration/AR | Clearing Marketplace, Revenue, COGS | P&L, BS |
| Marketplace Payout | Bank/Settlement | Bank, Clearing, Fee | Cash, P&L, BS |
| Rental Deposit Receipt | Deposit/Bank | Bank, Deposit Liability | BS |
| Rental Invoice Monthly | AR/Rental | AR, Rental Revenue | P&L, BS |
| Rental Prepaid Billing | AR/Deferral | AR, Deferred Revenue | BS |
| Rental Revenue Recognition | Deferral | Deferred Revenue, Revenue | P&L, BS |

---

## 19. Integrasi marketplace: desain accounting yang benar

Bagian ini penting karena banyak sistem accounting menjadi kacau saat dihubungkan dengan marketplace.

### 19.1 Dua model bisnis marketplace yang harus dibedakan

#### Model A — Anda menjual barang/jasa Anda sendiri melalui marketplace pihak ketiga
Dalam model ini, Anda biasanya adalah **principal** atas barang/jasa yang dijual. Revenue sering kali dicatat **gross**, sedangkan fee marketplace dicatat terpisah sebagai beban, tergantung hasil analisis principal-vs-agent.

#### Model B — Anda mengoperasikan platform marketplace dan hanya memperoleh komisi/fee
Dalam model ini, Anda bisa jadi hanya **agent**. Revenue Anda mungkin hanya sebesar komisi/fee bersih, bukan total nilai transaksi gross.

### 19.2 Keputusan kunci: principal vs agent
Sebelum merancang jurnal, tentukan dulu apakah Anda:
- mengendalikan barang/jasa sebelum dialihkan ke customer,
- bertanggung jawab utama ke customer,
- menanggung risiko persediaan/penyediaan,
- punya keleluasaan harga.

**Jangan** langsung mengasumsikan semua penjualan marketplace adalah pendapatan gross. Ini harus dianalisis berdasarkan substansi transaksi.

### 19.3 Event bisnis marketplace yang idealnya ditangkap sistem
Field minimum yang perlu masuk ke accounting/integration layer:
- marketplace/channel
- store/account
- external order ID
- order date
- payment date
- shipment date / delivery date
- customer info minimum
- item/sku
- quantity
- gross sales amount
- seller-funded discount
- marketplace-funded subsidy
- shipping charged to customer
- shipping subsidy/cost
- marketplace fee
- payment processing fee
- refund amount
- dispute/chargeback amount
- payout ID
- payout date
- currency
- tax attributes

### 19.4 Recognition event yang benar
Jangan post pendapatan hanya karena:
- order dibuat,
- customer check-out,
- pembayaran diotorisasi.

Pilih event yang sesuai kebijakan pengakuan:
- saat kontrol barang/jasa berpindah,
- saat order delivered,
- atau status lain yang secara bisnis dan akuntansi paling merefleksikan transfer kontrol.

### 19.5 Arsitektur yang disarankan
#### Layer 1 — Order subledger
Menyimpan detail order dan item level.

#### Layer 2 — Settlement subledger
Menyimpan payout, fee, refund, reserve, chargeback.

#### Layer 3 — Accounting posting engine
Mengubah event menjadi jurnal.

#### Layer 4 — Reconciliation layer
Memastikan:
- order recognized
- = net movement clearing
- = payout/refund/fees yang muncul di bank dan P&L.

### 19.6 Akun yang wajib disiapkan
- Marketplace Clearing Receivable
- Marketplace Fee Expense
- Payment Processing Fee
- Refund / Sales Returns
- Shipping Income
- Shipping Expense / Subsidy
- Marketplace Reserve / Withheld Balance (bila ada)
- Inventory / COGS (bila barang fisik)

### 19.7 Alur accounting untuk seller di marketplace (umum)
#### A. Saat penjualan diakui
Jika Anda principal dan menjual barang Anda sendiri:
- Dr Marketplace Clearing Receivable
- Cr Sales Revenue
- Cr Output Tax (bila relevan)

Bila barang fisik:
- Dr COGS
- Cr Inventory

#### B. Saat payout diterima
- Dr Bank
- Dr Marketplace Fee Expense
- Dr Fee lain / Refund offset bila ada
- Cr Marketplace Clearing Receivable

#### C. Saat ada refund
- Dr Contra Revenue / Sales Returns
- Dr Output Tax reversal bila relevan
- Cr Marketplace Clearing Receivable / Bank / Refund Liability

#### D. Saat ada chargeback/dispute
Tergantung status final:
- bisa ke clearing,
- bisa ke refund liability,
- bisa ke expense bila tidak recoverable.

### 19.8 Alur accounting untuk operator marketplace (komisi)
Jika Anda hanya operator platform:
- revenue Anda mungkin hanya komisi/fee,
- GMV tetap perlu dilaporkan operasional, tetapi **belum tentu** masuk pendapatan di P&L.

Contoh:
- Dr Receivable/Clearing
- Cr Commission Revenue

### 19.9 Discount, voucher, dan promo
Bedakan dengan tegas:
- **seller-funded discount**,
- **marketplace-funded subsidy**,
- **campaign expense**,
- **cashback**,
- **shipping subsidy**.

Jangan campur semuanya ke satu akun “discount”.

### 19.10 Pilihan tingkat posting
Ada tiga pendekatan:

#### A. Per order detail
Kelebihan: sangat detail.  
Kekurangan: volume GL besar.

#### B. Per payout/settlement
Kelebihan: GL ramping.  
Kekurangan: sulit audit order-level.

#### C. Hybrid (disarankan)
- order disimpan detail di subledger,
- GL diposting per batch harian / settlement,
- drill-down tetap tersedia.

Untuk volume marketplace menengah-besar, model hybrid paling seimbang.

### 19.11 Rekonsiliasi marketplace yang wajib
Setiap periode harus ada report:
- total order recognized
- minus refund
- minus marketplace fee
- minus chargeback/reserve
- sama dengan movement clearing
- yang kemudian tie ke payout bank + ending clearing balance

### 19.12 Kesalahan desain yang paling sering terjadi
- payout dibukukan langsung sebagai pendapatan bersih
- fee marketplace tidak dipisah
- refund tidak dibedakan dari diskon
- tidak ada clearing account
- GMV dicampur dengan revenue akuntansi
- promo seller vs marketplace tidak dipisah
- order dibuat langsung jadi pendapatan walau belum fulfilled

---

## 20. Integrasi penyewaan aset: desain accounting yang benar

Bagian ini penting untuk memastikan bisnis rental tidak dicampur dengan logika penjualan biasa.

### 20.1 Tiga model bisnis yang harus dibedakan
#### A. Operating rental of owned assets
Anda memiliki aset dan menyewakannya. Ini yang paling umum untuk rental operasional. Aset biasanya tetap berada di neraca Anda dan disusutkan.

#### B. Finance lease / hire purchase
Bila substansi kontrak memindahkan secara signifikan risiko dan manfaat, perlakuannya berbeda. Ini perlu treatment tersendiri.

#### C. Rental + service bundle
Misalnya sewa alat + maintenance + operator + delivery. Komponen lease dan non-lease bisa perlu dipisah untuk tujuan pricing dan accounting.

### 20.2 Untuk kebanyakan bisnis rental operasional
Default desain yang paling aman:
- aset dicatat di **Fixed Assets**,
- pendapatan sewa dicatat periodik,
- deposit pelanggan dicatat sebagai kewajiban,
- maintenance dicatat sebagai beban atau dikapitalisasi sesuai sifatnya,
- depresiasi diposting bulanan,
- kontrak menghasilkan billing schedule.

### 20.3 Data master minimum untuk rental
#### Asset master
- asset ID
- kategori aset
- serial number / tag
- lokasi
- tanggal perolehan
- biaya perolehan
- umur manfaat
- nilai residu
- metode depresiasi
- status: available / rented / maintenance / disposed
- customer current / contract current
- analytic dimension defaults

#### Contract master
- contract ID
- customer
- asset ID atau asset group
- tanggal mulai
- tanggal akhir
- billing frequency
- tarif
- deposit
- penalty rules
- billing in advance / arrears
- renewal terms

### 20.4 Alur penggunaan yang benar
1. **Beli aset**
   - dari AP/bank
   - masuk asset register

2. **Aktivasi aset**
   - tentukan kategori, umur manfaat, metode depresiasi, lokasi

3. **Buat kontrak rental**
   - pelanggan, aset, term, rate, deposit, penalty, SLA

4. **Terima deposit jika ada**
   - masuk liability, bukan revenue

5. **Mulai masa sewa / handover**
   - status aset berubah menjadi rented
   - billing schedule aktif

6. **Generate invoice sesuai schedule**
   - bulanan di muka / di belakang sesuai kontrak

7. **Terima pembayaran**
   - masuk AR/Bank

8. **Recognize revenue bila dibayar di muka**
   - gunakan deferred revenue schedule

9. **Posting depresiasi aset**
   - bulanan

10. **Catat maintenance**
   - expense atau capitalize sesuai kebijakan

11. **Tagihkan kerusakan / penalti bila perlu**
   - invoice terpisah atau penggunaan deposit

12. **Akhiri kontrak / return**
   - cek kerusakan
   - refund deposit atau forfeit sebagian
   - ubah status aset
   - lanjut maintenance / re-rent / disposal

### 20.5 Jurnal umum rental
#### A. Pembelian aset
- Dr Fixed Asset
- Dr PPN Masukan (bila relevan)
- Cr AP / Bank

#### B. Depresiasi bulanan
- Dr Depreciation Expense
- Cr Accumulated Depreciation

#### C. Deposit diterima
- Dr Bank
- Cr Customer Deposit Liability

#### D. Invoice sewa bulanan (in arrears)
- Dr AR
- Cr Rental Revenue

#### E. Tagihan 12 bulan dibayar di muka
Saat invoice:
- Dr AR
- Cr Deferred Revenue

Saat pembayaran:
- Dr Bank
- Cr AR

Setiap bulan:
- Dr Deferred Revenue
- Cr Rental Revenue

#### F. Refund deposit saat kontrak selesai
- Dr Customer Deposit Liability
- Cr Bank

#### G. Deposit dipakai untuk menutup kerusakan
Pilihan tergantung policy dan hak hukum sudah pasti. Secara umum:
- Dr Customer Deposit Liability
- Cr Other Income / Damage Recovery / AR
Jika ada tagihan kerusakan formal, bisa juga:
- Dr AR
- Cr Damage Recovery
lalu:
- Dr Customer Deposit Liability
- Cr AR

### 20.6 Maintenance: expense vs capitalization
#### Expense
Routine maintenance, service rutin, penggantian minor:
- Dr Maintenance Expense
- Cr AP / Bank

#### Capitalization
Jika pengeluaran:
- memperpanjang masa manfaat,
- meningkatkan kapasitas,
- meningkatkan performa,
- material secara kebijakan,
maka dapat dipertimbangkan:
- Dr Fixed Asset
- Cr AP / Bank

### 20.7 Depresiasi
Untuk aset rental, jangan gunakan basis “revenue-based depreciation”. Pilih metode yang merefleksikan pola konsumsi manfaat ekonomi, misalnya:
- straight-line,
- diminishing balance,
- usage/consumption-based bila didukung data penggunaan yang kuat.

### 20.8 Report yang wajib ada untuk rental
- asset register
- depreciation schedule
- rental revenue by asset
- asset utilization
- maintenance cost by asset
- deposit outstanding by contract
- contract aging / expiry
- profitability per asset / asset class

### 20.9 Kesalahan desain yang paling sering terjadi
- aset rental diperlakukan sebagai beban biasa
- deposit dicatat sebagai pendapatan
- pembayaran di muka seluruhnya diakui sebagai pendapatan bulan itu
- tidak ada link antara kontrak dan aset
- maintenance tidak dibedakan antara expense dan capex
- depresiasi dicatat manual tanpa asset register
- aset tidak punya status operasional

---

## 21. Inventory & COGS integration (bila marketplace menjual barang fisik)

Bila sistem marketplace Anda menjual **barang fisik**, maka accounting baru akan lengkap jika ada integrasi dengan inventory/stock.

### 21.1 Kenapa ini penting
Tanpa inventory integration:
- revenue bisa tercatat,
- tetapi HPP tidak tercatat benar,
- gross margin menjadi salah,
- retur barang tidak tercermin,
- neraca persediaan salah.

### 21.2 Event minimum yang harus diintegrasikan
- goods receipt
- stock adjustment
- transfer stock
- shipment / delivery
- sales return
- purchase return
- inventory valuation adjustments

### 21.3 Jurnal umum perpetual inventory
#### Saat pembelian barang
- Dr Inventory
- Dr PPN Masukan
- Cr AP

#### Saat penjualan diakui
- Dr AR / Marketplace Clearing
- Cr Sales Revenue
- Cr Output Tax

#### Saat barang keluar / control transferred
- Dr COGS
- Cr Inventory

#### Saat retur penjualan dengan barang kembali layak jual
- Dr Inventory
- Cr COGS
- dan reverse revenue sesuai credit note

### 21.4 Bila inventory dikelola di sistem lain
Anda tidak wajib membangun modul inventory di accounting, tetapi wajib membangun:
- interface stock movement,
- valuation method policy,
- reconciliation antara stock system dan GL.

---

## 22. Deferred revenue, deferred expense, dan advances

### 22.1 Deferred revenue
Dipakai bila kas/AR timbul lebih dulu daripada pendapatan yang sudah earned.  
Contoh:
- pembayaran sewa tahunan di muka,
- warranty/layanan berperiode,
- membership periodik.

### 22.2 Deferred expense
Dipakai bila biaya dibayar di muka tetapi manfaatnya dikonsumsi beberapa periode.  
Contoh:
- asuransi tahunan,
- sewa dibayar di muka,
- lisensi software.

### 22.3 Customer advance vs deferred revenue
Dua hal ini sering bercampur, padahal beda:
- **Customer advance**: uang muka dari customer sebelum invoice / sebelum performance obligation jelas.
- **Deferred revenue**: kewajiban atas revenue yang sudah ditagih atau diterima tetapi belum earned.

### 22.4 Rekomendasi desain
- simpan schedule per kontrak/invoice line,
- buat journal otomatis periodik,
- sediakan rollforward report,
- link ke revenue account tujuan.

---

## 23. Customer deposits dan security deposits

### 23.1 Prinsip
Deposit pelanggan umumnya adalah **liability** sampai:
- dikembalikan, atau
- hak perusahaan untuk menahan/menggunakannya menjadi pasti.

### 23.2 Yang wajib disimpan
- contract ID
- customer
- tanggal terima
- amount
- reason/purpose
- expected return date
- status
- applied amount
- refunded amount
- forfeited amount

### 23.3 Report minimum
- deposit outstanding by contract
- aged deposits
- deposits due for refund
- movement report

### 23.4 Kontrol
- tidak boleh dipakai sembarang untuk offset tanpa referensi kontrak
- penggunaan deposit harus melalui workflow khusus
- ending detail harus sama dengan akun deposit liability

---

## 24. Tax architecture yang sebaiknya dipakai

### 24.1 Jangan hardcode tarif
Tarif dan formula pajak harus berada di master data dengan:
- effective start date
- effective end date
- basis formula
- export code
- recoverability
- posting account

### 24.2 Simpan tiga lapisan data pajak
#### A. Master tax rules
Tarif, type, formula, mapping.

#### B. Transaction tax details
Timbul dari invoice/bill/payment.

#### C. Reporting/export layer
Menyusun file/rekap untuk pelaporan.

### 24.3 Versi dan adapter
Desain yang aman adalah:
- tax rules versioned,
- export schema versioned,
- adapter terpisah untuk masing-masing kanal compliance.

### 24.4 Tax exception dashboard
Sangat disarankan ada daftar:
- invoice tanpa tax ID lawan transaksi
- transaksi tanpa tax code
- tax code invalid untuk jenis transaksi
- dokumen belum lengkap
- transaksi sudah dilapor tapi diubah
- mismatch tax subledger vs GL

---

## 25. Dimensi analitik yang direkomendasikan

Tanpa analitik, Anda hanya punya laporan finansial dasar. Dengan analitik, Anda bisa mendapatkan managerial accounting.

### 25.1 Dimensi utama
| Dimensi | Wajib untuk | Contoh penggunaan |
|---|---|---|
| Entity / Company | semua | multi-company |
| Branch / Location | semua | cabang, gudang, kota |
| Channel | sales & revenue | direct, marketplace, rental |
| Marketplace | channel marketplace | Shopee, Tokopedia, website, dsb. |
| Cost Center | expenses | Finance, Ops, Sales |
| Product Line | revenue & COGS | kategori produk |
| Asset Category | rental & maintenance | alat berat, kendaraan, mesin |
| Asset ID | rental specific | profit per aset |
| Contract ID | rental | billing, deposit, deferred revenue |
| Project | optional | implementasi/proyek khusus |

### 25.2 Dimensi wajib per jenis transaksi
| Jenis transaksi | Dimensi minimum |
|---|---|
| Customer invoice direct sales | entity, branch, channel, customer, product/service |
| Customer invoice marketplace | entity, branch, channel, marketplace, customer group, product/service |
| Rental invoice | entity, branch/location, channel=rental, contract ID, asset ID/asset category |
| Maintenance expense | entity, branch, cost center, asset ID (jika attributable) |
| Marketplace settlement | entity, channel, marketplace, payout ID |
| Fixed asset purchase | entity, branch/location, asset category |
| Journal accrual | entity, branch/cost center minimum |

---

## 26. Rekomendasi report lanjutan

### 26.1 Laporan wajib untuk operasional marketplace
- Order recognized vs payout received
- Marketplace clearing aging
- Fee bridge
- Refund & dispute report
- Gross-to-net revenue bridge
- Revenue per marketplace/channel
- Seller-funded vs marketplace-funded discount report

### 26.2 Laporan wajib untuk rental
- Asset register
- Depreciation rollforward
- Asset utilization
- Rental revenue by asset
- Contract billing status
- Security deposit outstanding
- Maintenance cost by asset
- Profitability by asset category
- Assets in maintenance / downtime

### 26.3 Laporan wajib untuk kontrol keuangan
- Unreconciled bank items
- AR/AP aging
- Open accruals
- Deferred revenue waterfall
- Tax reconciliation
- Period close checklist status
- Manual journal exception report

---

## 27. Pengendalian internal dan audit trail

### 27.1 Segregation of duties
Pisahkan minimal fungsi:
- create master data
- create transaction
- approve transaction
- release payment
- reconcile bank
- close period
- system admin

### 27.2 Approval matrix yang disarankan
| Area | Trigger approval |
|---|---|
| Customer invoice manual | invoice tanpa source document / nominal besar |
| Vendor bill | nominal besar / vendor baru / account sensitif |
| Manual journal | selalu, atau minimal untuk akun sensitif |
| Payment run | selalu |
| Write-off AR/AP | selalu |
| Deposit forfeiture | selalu |
| Asset disposal | selalu |
| Reopen period | hanya controller/CFO |

### 27.3 Audit trail minimum
Simpan:
- created by / at
- modified by / at
- approved by / at
- posted by / at
- old value vs new value
- source system
- external reference ID
- reversal reference

### 27.4 Dokumen yang wajib dilampirkan
| Jenis transaksi | Attachment minimum |
|---|---|
| Vendor bill | invoice vendor / supporting |
| Customer invoice manual | kontrak/PO/approval |
| Fixed asset purchase | invoice + BAST/serial |
| Deposit usage | return report / damage report |
| Marketplace adjustment | settlement file / refund evidence |
| Manual journal material | memo + support detail |

### 27.5 Locking policy
- daily soft lock untuk operasi yang sudah diproses
- month-end close lock
- tax period lock
- year-end lock
- reopen hanya dengan approval tinggi dan audit reason

---

## 28. Month-end close dan year-end close

### 28.1 Tujuan
Menutup buku dengan disiplin agar laporan stabil, dapat diaudit, dan tidak berubah diam-diam.

### 28.2 Checklist month-end close yang disarankan

#### Hari kerja 1–2
- semua sales invoice dan vendor bill periode masuk
- import statement bank
- posting customer/vendor payments
- review transaksi outstanding

#### Hari kerja 2–3
- rekonsiliasi bank minimum 80–90%
- review AR aging
- review AP aging
- posting accruals penting

#### Hari kerja 3–4
- posting depreciation
- posting deferred revenue/expense
- review marketplace clearing
- review customer deposits
- review inventory/HPP (bila relevan)

#### Hari kerja 4–5
- review tax
- revaluation FX
- review P&L dan BS
- final tie-out subledger ke GL

#### Hari kerja 5–7
- management review
- post final adjustments
- lock period
- release management reports

### 28.3 Checklist year-end
- final AR/AP review
- bad debt provision/write-off policy
- full bank reconciliation
- stock count & valuation review
- fixed asset existence/disposal review
- tax reconciliation & annual data prep
- retained earnings / closing entries sesuai policy sistem
- final year lock

### 28.4 Prinsip penutupan
- close bukan hanya “tombol lock”
- close harus berbasis checklist dan sign-off
- setiap akun material harus punya owner review

---

## 29. Dashboard & KPI yang sebaiknya ditambahkan

### 29.1 KPI keuangan umum
- revenue growth
- gross margin
- EBITDA proxy / operating margin
- cash balance
- DSO
- DPO
- operating cash flow
- budget vs actual

### 29.2 KPI marketplace
- GMV
- recognized revenue
- take rate (bila operator platform)
- marketplace fee %
- refund rate
- payout lag days
- clearing outstanding
- gross-to-net bridge

### 29.3 KPI rental
- utilization %
- occupancy / on-rent days
- revenue per asset
- maintenance cost ratio
- downtime days
- deposit outstanding
- average contract length
- bad debt rate per contract

### 29.4 KPI kontrol
- bank reconciliation completion %
- manual journal % of total postings
- tax exceptions open
- overdue invoices amount
- overdue vendor bills
- close completed on time

---

## 30. Role & permission matrix yang direkomendasikan

| Fungsi | AR Admin | AP Admin | Treasury | Tax | Accountant | Controller | System Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| Create customer invoice | ✔ |  |  |  |  |  |  |
| Approve customer invoice manual |  |  |  |  | ✔ | ✔ |  |
| Create vendor bill |  | ✔ |  |  |  |  |  |
| Approve vendor bill material |  |  |  |  | ✔ | ✔ |  |
| Register customer receipt | ✔ |  | ✔ |  |  |  |  |
| Execute vendor payment |  |  | ✔ |  |  | approve |  |
| Reconcile bank |  |  | ✔ |  | ✔ review |  |  |
| Post manual journal |  |  |  |  | ✔ | ✔ |  |
| Edit tax setup |  |  |  | ✔ | ✔ | approve |  |
| Close/reopen period |  |  |  |  |  | ✔ |  |
| Change COA / sequences |  |  |  |  |  | approve | ✔ (technical) |

---

## 31. Migrasi data: apa yang wajib dipindahkan ke sistem baru/yang disempurnakan

### 31.1 AR
Migrate **invoice-level open items**, bukan hanya saldo global.

### 31.2 AP
Migrate **bill-level open items**, bukan hanya saldo global.

### 31.3 Bank
Migrate opening balance per rekening dan daftar reconciling items jika ada.

### 31.4 Fixed Assets
Migrate per asset:
- acquisition cost
- accumulated depreciation
- start depreciation date
- remaining useful life
- location
- status

### 31.5 Deferred revenue / expense
Migrate per schedule.

### 31.6 Customer deposits
Migrate per kontrak/customer.

### 31.7 Marketplace clearing
Migrate outstanding settlement/clearing balance secara detail, idealnya per payout/order batch.

### 31.8 Tax
Migrate opening tax position dan period status.

### 31.9 Budgets
Migrate current year budget per dimension.

---

## 32. UAT / test scenarios minimum sebelum go-live

Berikut skenario minimum yang sebaiknya diuji.

| No | Skenario | Hasil yang harus lolos |
|---|---|---|
| 1 | Customer invoice normal | AR, revenue, tax benar |
| 2 | Partial payment customer | invoice tersisa open sesuai saldo |
| 3 | Overpayment customer | selisih masuk customer advance |
| 4 | Credit note penjualan | AR dan revenue reverse benar |
| 5 | Vendor bill dengan PPN | AP dan tax benar |
| 6 | Vendor payment partial | AP open balance benar |
| 7 | Vendor bill dengan withholding | net payment dan utang pajak benar |
| 8 | Bank import dan auto-match | outstanding accounts bersih benar |
| 9 | Bank charge otomatis | expense bank benar |
| 10 | Marketplace sale + payout net of fee | clearing tie ke bank dan fee |
| 11 | Marketplace refund | contra revenue / clearing benar |
| 12 | Rental deposit receipt | deposit masuk liability |
| 13 | Rental prepaid 12 bulan | deferred revenue schedule benar |
| 14 | Monthly revenue recognition | deferred revenue turun, revenue naik |
| 15 | Asset purchase & capitalization | asset register terbentuk |
| 16 | Monthly depreciation | expense dan accum dep benar |
| 17 | Asset maintenance expense | expense masuk asset analytic bila relevan |
| 18 | Deposit refund / forfeiture | liability turun sesuai workflow |
| 19 | Period lock | transaksi backdate tertahan |
| 20 | Reopen with approval | audit trail lengkap |
| 21 | FX revaluation | unrealized gain/loss benar |
| 22 | AR/AP aging tie-out | sama dengan control account |
| 23 | Tax export period | history, status, lock bekerja |
| 24 | Manual journal restricted account | user non-authorized gagal post |
| 25 | Drill-down report | semua saldo bisa ditelusuri ke source |

---

## 33. Checklist “jangan lakukan ini”

Ini adalah daftar desain yang paling sering membuat sistem accounting tidak efisien.

### 33.1 Jangan jurnal manual untuk semua hal
Jika user setiap hari masuk ke Journal untuk memasukkan penjualan, pembelian, pembayaran, dan bank, berarti modul operasional Anda belum memadai.

### 33.2 Jangan campur deposit dengan revenue
Deposit pelanggan bukan pendapatan sampai ada dasar yang jelas untuk mengakuinya.

### 33.3 Jangan campur payout marketplace dengan pendapatan bersih
Payout adalah hasil akhir settlement; revenue, fee, refund, dan reserve harus terpisah.

### 33.4 Jangan edit transaksi posted sembarangan
Gunakan reversal/credit note/debit note.

### 33.5 Jangan hardcode tax rate
Gunakan master dengan effective date.

### 33.6 Jangan posting manual ke akun kontrol sembarangan
Lindungi AR/AP/Tax/Deposit/Deferred Revenue/Clearing/Accumulated Depreciation.

### 33.7 Jangan abaikan closing dan lock dates
Tanpa lock, laporan historis selalu bisa berubah.

### 33.8 Jangan abaikan dimensi analitik
Tanpa dimensi, Anda tidak bisa membaca profitabilitas per channel, per asset, atau per contract.

### 33.9 Jangan gabungkan asset purchase dengan opex tanpa policy
Material capex harus masuk asset register, bukan tenggelam di beban.

### 33.10 Jangan treat semua marketplace sale sebagai gross revenue
Pastikan principal-vs-agent analysis terlebih dahulu.

---

## 34. Rekomendasi implementasi teknis untuk integrasi

### 34.1 Gunakan staging layer
Semua data dari marketplace atau rental system sebaiknya masuk ke staging dulu sebelum diposting ke accounting.

### 34.2 Gunakan external reference yang unik
Contoh:
- order_id
- payout_id
- refund_id
- contract_id
- asset_id

Agar sistem bisa:
- mencegah duplikasi,
- melakukan reprocessing,
- melakukan trace back.

### 34.3 Gunakan idempotent posting
Jika file/API yang sama masuk dua kali, sistem tidak boleh membuat jurnal ganda.

### 34.4 Gunakan reversal, bukan overwrite
Untuk event pembatalan atau koreksi, simpan jejak histori.

### 34.5 Pisahkan status operasional vs status akuntansi
Contoh:
- order “paid” secara operasional belum tentu “recognized” secara akuntansi,
- contract “active” belum tentu seluruh pendapatannya sudah earned.

### 34.6 Simpan line-level dimensions
Bukan hanya header-level, karena profitabilitas sering perlu dianalisis per item/baris.

### 34.7 Sediakan error queue
Semua transaksi gagal posting harus masuk queue exception dengan alasan yang jelas:
- tax code missing
- account mapping missing
- customer/vendor invalid
- closed period
- duplicate reference

---

## 35. Rekomendasi prioritas 90 hari

### Prioritas 1 — rapikan fondasi
- COA review
- customer/vendor master
- payment terms & tax setup
- dimensi analitik
- lock dates
- approval matrix

### Prioritas 2 — stabilkan transaksi inti
- customer receipts
- vendor payments
- outstanding receipts/payments
- bank import & reconciliation rules

### Prioritas 3 — bangun kontrol operasional penting
- attachments
- audit trail
- closing checklist
- AR/AP aging tie-out
- tax reconciliation

### Prioritas 4 — integrasi bisnis
- marketplace clearing
- payout reconciliation
- rental contracts
- customer deposits
- deferred revenue

### Prioritas 5 — aset dan reporting
- fixed asset register
- depreciation engine
- asset utilization reporting
- marketplace and rental profitability dashboard

---

## 36. Rekomendasi roadmap 6–12 bulan

### Fase 1 — Core accounting hardening
Tujuan: membuat modul yang ada benar-benar stabil.  
Output:
- clean COA
- partner master
- payment layer
- bank reconciliation
- period closing

### Fase 2 — Compliance & control
Tujuan: memperkuat pajak, audit, dan approval.  
Output:
- tax engine versioning
- tax reconciliation
- audit trail
- attachments
- maker-checker

### Fase 3 — Marketplace accounting integration
Tujuan: memisahkan GMV, revenue, fee, payout, refund, clearing.  
Output:
- settlement subledger
- payout matching
- gross-to-net reports

### Fase 4 — Rental asset accounting integration
Tujuan: menghubungkan asset register, kontrak, billing, deposit, depreciation.  
Output:
- rental contract module
- deposit management
- deferred revenue
- asset profitability

### Fase 5 — Advanced management reporting
Tujuan: dari financial accounting menjadi managerial accounting.  
Output:
- dashboards
- budgets
- analytic P&L
- asset/unit economics
- forecast

---

## 37. Struktur target menu: usulan final yang efisien

Jika tujuan Anda adalah efisiensi, kejelasan, dan skalabilitas, berikut saran naming yang lebih natural:

| Menu sekarang | Saran menu target |
|---|---|
| Dashboard | Dashboard |
| Invoicing (AR) | Sales & Receivables |
| Vendor Bills (AP) | Purchases & Payables |
| Bank & Cash | Bank & Treasury |
| Journal | General Ledger / Journal Entries |
| Tax | Tax |
| Reporting | Reporting |
| Settings | Master Data & Configuration |

Tambahan menu:
- Marketplace Settlement
- Assets & Rental
- Period Closing
- Audit & Documents (atau masuk ke configuration + report log)

---

## 38. Kesimpulan besar

Sistem accounting Anda **sudah benar sebagai fondasi**, tetapi untuk mencapai bentuk yang benar-benar matang, efisien, dan siap menopang integrasi marketplace serta penyewaan aset, ada beberapa prinsip besar yang harus dijaga:

1. **Transaksi operasional harus lahir dari modul sumber, bukan jurnal manual.**
2. **Kas, invoice, settlement, deposit, dan deferred revenue harus dipisah sebagai event yang berbeda.**
3. **Marketplace harus memakai clearing account dan settlement reconciliation.**
4. **Rental aset harus memakai asset register, kontrak, billing schedule, deposit, dan depresiasi.**
5. **Tax harus configurable dan siap menghadapi perubahan regulasi / format pelaporan.**
6. **Setiap control account wajib punya subledger dan tie-out report.**
7. **Period closing, approval, attachment, dan audit trail bukan fitur tambahan—mereka bagian dari fondasi.**
8. **Analytic dimensions adalah kunci agar sistem accounting menjadi alat manajemen, bukan sekadar alat pembukuan.**

Bila semua poin di atas diterapkan, sistem Anda akan berubah dari “sekadar software accounting” menjadi **platform keuangan yang siap diaudit, siap berkembang, dan siap menjadi single source of truth untuk bisnis marketplace dan rental**.

---

## 39. Appendix A — Daftar kontrol minimum per area

| Area | Kontrol minimum |
|---|---|
| AR | invoice unique, approval manual invoice, aging tie-out, receipts allocation |
| AP | duplicate vendor bill check, payment approval, WHT handling, aging tie-out |
| Bank | statement import batch, auto-match rules, unreconciled queue, month-end recon |
| Journal | restricted roles, auto-reversal, attachment, reason code |
| Tax | tax code versioning, partner validation, export history, tax period lock |
| Fixed Assets | asset card, depreciation schedule, disposal approval, GL tie-out |
| Marketplace | external reference unique, clearing, payout match, refund handling |
| Rental | contract ID, deposit ledger, billing schedule, asset status |
| Closing | checklist, sign-off, lock date, reopen log |
| Reporting | drill-down, period integrity, dimension filters, subledger tie-out |

---

## 40. Appendix B — Contoh KPI dashboard yang konkret

### Finance overview
- Cash on hand
- AR outstanding
- AP outstanding
- Net working capital
- Current month revenue
- Current month operating profit

### AR panel
- Overdue invoices
- Top 10 customers overdue
- DSO trend
- Collection rate

### AP panel
- Due this week
- Overdue vendor bills
- DPO trend

### Bank panel
- Unreconciled bank lines
- Bank recon completion %
- Large unmatched items

### Marketplace panel
- Payout pending
- Clearing balance
- Refund rate
- Fee %

### Rental panel
- On-rent assets
- Available assets
- Utilization %
- Deposit outstanding
- Maintenance cost this month

### Tax panel
- Transactions missing tax code
- Open tax exceptions
- Period ready/not ready

---

## 41. Appendix C — Saran field master data minimum

### Customer
- customer_code
- legal_name
- tax_id
- billing_address
- payment_terms
- currency
- revenue_default
- AR_account
- tax_profile
- channel_default
- branch_default
- active_flag

### Vendor
- vendor_code
- legal_name
- tax_id
- payment_terms
- AP_account
- default_expense_account / category
- tax_profile
- withholding_profile
- bank_info
- active_flag

### Product/Service
- sku/service_code
- description
- revenue_account
- expense/cogs_account
- inventory_flag
- rental_flag
- tax_code_default
- analytic_default
- asset_category_default (bila capex-related)

### Asset
- asset_id
- category
- serial_no
- acquisition_date
- acquisition_cost
- useful_life
- salvage_value
- depreciation_method
- location
- status
- current_contract_id
- analytic_default

### Marketplace settlement
- channel
- payout_id
- payout_date
- order_count
- gross_sales
- fees
- refunds
- reserve
- net_payout
- bank_reference
- posting_status

### Rental contract
- contract_id
- customer_id
- asset_id
- start_date
- end_date
- billing_frequency
- rental_rate
- deposit_amount
- billing_in_advance_flag
- penalty_rule
- status

---

## 42. Appendix D — Rujukan eksternal yang dipakai sebagai benchmark desain

> Catatan: daftar ini dipakai sebagai referensi konseptual dan benchmark implementasi. Untuk go-live, parameter pajak dan pelaporan lokal harus diverifikasi ulang sesuai regulasi yang berlaku saat implementasi.

### A. Regulasi dan sumber resmi pajak Indonesia
1. Direktorat Jenderal Pajak — Coretax  
   https://www.pajak.go.id/id/reformdjp/coretax

2. Direktorat Jenderal Pajak — e-Faktur  
   https://www.pajak.go.id/id/efakturdjp

3. Direktorat Jenderal Pajak — PPh Pasal 23/26  
   https://www.pajak.go.id/id/pph-pasal-2326

4. Direktorat Jenderal Pajak — Pemotongan Pajak Penghasilan Pasal 23  
   https://www.pajak.go.id/id/pemotongan-pajak-penghasilan-pasal-23

5. Direktorat Jenderal Pajak — PMK 131/2024: Tarif PPN Sebelas-Dua Belas  
   https://www.pajak.go.id/id/artikel/pmk-1312024-tarif-ppn-sebelas-dua-belas

### B. Standar dan referensi accounting internasional
6. IFRS Foundation — IFRS 15 Revenue from Contracts with Customers  
   https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/

7. IFRS Foundation — IAS 16 Property, Plant and Equipment  
   https://www.ifrs.org/issued-standards/list-of-standards/ias-16-property-plant-and-equipment/

8. IFRS Foundation — IFRS 16 Leases  
   https://www.ifrs.org/issued-standards/list-of-standards/ifrs-16-leases/

9. IFRS Foundation — Principal versus Agent (IFRS 15)  
   https://www.ifrs.org/projects/completed-projects/2022/principal-versus-agent-software-reseller-ifrs-15/

### C. Benchmark implementasi ERP/accounting system
10. Odoo Documentation — Accounting and Invoicing  
    https://www.odoo.com/documentation/19.0/applications/finance/accounting.html

11. Odoo Documentation — Payments  
    https://www.odoo.com/documentation/18.0/applications/finance/accounting/payments.html

12. Odoo Documentation — Bank Reconciliation  
    https://www.odoo.com/documentation/19.0/applications/finance/accounting/bank/reconciliation.html

13. Odoo Documentation — Deferred Revenues  
    https://www.odoo.com/documentation/19.0/applications/finance/accounting/customer_invoices/deferred_revenues.html

14. Odoo Documentation — Non-current assets and fixed assets  
    https://www.odoo.com/documentation/18.0/applications/finance/accounting/vendor_bills/assets.html

15. Odoo Documentation — Analytic Accounting  
    https://www.odoo.com/documentation/18.0/applications/finance/accounting/reporting/analytic_accounting.html

16. Odoo Documentation — Budgets  
    https://www.odoo.com/documentation/19.0/applications/finance/accounting/reporting/budget.html

17. Odoo Documentation — Year-end Closing  
    https://www.odoo.com/documentation/19.0/applications/finance/accounting/reporting/year_end.html

18. Microsoft Learn — Fixed assets home page  
    https://learn.microsoft.com/en-us/dynamics365/finance/fixed-assets/fixed-assets

19. Microsoft Learn — Set up fixed assets  
    https://learn.microsoft.com/en-us/dynamics365/finance/fixed-assets/set-up-fixed-assets

20. Microsoft Learn — Reconcile bank statements by using advanced bank reconciliation  
    https://learn.microsoft.com/en-us/dynamics365/finance/cash-bank-management/reconcile-bank-statements-advanced-bank-reconciliation

21. Microsoft Learn — Close the fiscal year  
    https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/tasks/close-fiscal-year

---

## 43. Penutup

Dokumen ini dapat dipakai sebagai:
- blueprint improvement sistem,
- bahan diskusi dengan developer / product owner / finance team,
- checklist implementasi,
- acuan desain modul baru,
- dasar penyusunan SOP dan UAT.

Saran praktis terakhir:
- mulai dari **rapikan fondasi**,
- bangun **payment + reconciliation**,
- lalu buat **marketplace clearing**,
- lanjutkan dengan **fixed assets + rental contracts + deposits + deferred revenue**,
- dan tutup dengan **reporting analitik dan dashboard KPI**.

Jika urutannya dibalik—misalnya langsung membuat dashboard cantik tanpa subledger, clearing, dan close discipline—sistem akan terlihat bagus tetapi angka keuangannya tetap rapuh.
