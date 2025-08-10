Product Requirement Document (PRD) - Dashboard Admin PWA Koperasi 
Product Name: Dashboard Admin PWA Koperasi Serba Usaha (KSU) 
Product Manager: Yosh Wakatta 
Shipping Date: [TBD] 
Stage: Planning 
Status: Draft 
Teams: Backend Developer, Frontend Developer, QA Tester, UI/UX Designer, Data Analyst 
 
DESCRIPTION 
Dashboard ini merupakan pusat kendali administratif dari aplikasi PWA Koperasi Serba Usaha. 
Fungsinya adalah untuk membantu pengurus koperasi dalam mengelola seluruh lini operasi: 
keanggotaan, simpanan, pinjaman/pembiayaan, SHU, dan rapat anggota secara terstruktur dan 
efisien. 
 
MODULE DETAIL 
Dashboard Utama (Home) 
Deskripsi 
Halaman utama yang menyajikan ringkasan metrik kunci (KPI) koperasi dan navigasi cepat 
untuk tindakan administratif penting. Tujuannya adalah memberikan gambaran instan tentang 
kesehatan finansial dan operasional koperasi. 
Fitur Utama 
1. Statistik Ringkas (Metric Cards) 
○ Jumlah Anggota Aktif: total anggota dengan status aktif. 
○ Total Simpanan: akumulasi seluruh jenis simpanan (Rp). 
○ Total Pinjaman: akumulasi seluruh pinjaman yang berjalan (Rp). 
○ SHU Tahun Berjalan: Sisa Hasil Usaha yang belum didistribusikan (Rp). 
2. Grafik Tren (Trends Charts) 
○ Line Chart Simpanan vs Pinjaman: per bulan, menampilkan dua garis untuk 
perbandingan. 
○ Filter Periode: opsi [Bulan, Kuartal, Tahun] untuk mengubah rentang data. 
3. Shortcut Aksi Cepat (Quick Actions) 
○ Verifikasi Anggota Baru → navigasi ke modul manajemen keanggotaan. 
○ Proses Pengajuan Pembiayaan → navigasi ke modul pinjaman. 
4. Notifikasi Singkat 
○ Tampilkan badge jumlah permohonan pinjaman baru, penarikan simpanan 
pending, dan angsuran jatuh tempo hari ini. 
Use Cases 
● Admin masuk ke dashboard dan segera memeriksa total simpanan dan pinjaman. 
● Admin memfilter grafik tren ke 'Kuartal' untuk presentasi rapat. 
● Admin klik 'Proses Pengajuan Pembiayaan' dari Quick Actions untuk menangani 
aplikasi baru. 
Requirements 
● Performance: summary metrics harus muncul dalam ≤1.5 detik. 


● Charting Library: menggunakan Chart.js atau Recharts. 
● Authentication: hanya admin terautentikasi dapat mengakses. 
● Responsive Design: optimal pada desktop dan tablet. 
Acceptance Criteria 
1. Metrics Cards menunjukkan nilai yang sesuai dengan database dan load time ≤2 detik. 
2. Grafik tren dapat di filter dan menampilkan update data berdasarkan filter. 
3. Quick Actions memicu navigasi modul yang benar. 
4. Notifikasi badge akurat dan diperbarui real-time.
 


Manajemen Keanggotaan 
Deskripsi 
Modul untuk mengelola data anggota koperasi: pendaftaran, verifikasi, dan pemeliharaan profil. 
Fitur Utama 
1. Daftar Anggota 
○ Tabel anggota lengkap dengan kolom: ID, Nama, Email, Tgl Bergabung, (Icon; 
Profil, Simpanan, Pinjaman/Pembiayaan jika Syariah, SHU)  
○ Filter: Pencarian nama. 
2. Verifikasi Anggota Baru 
○ Tampilan daftar pendaftar baru dengan opsi Approve/Reject. 
○ Preview detail dokumen pendaftaran. 
3. Profil Anggota 
○ Detail tiap Icon: Profil, Simpanan, Pinjaman, Pembiayaan jika Syariah, dan SHU. 
Profil; ID, Nama Lengkap, NIK, Nomor HP, Email, Status, Tanggal Bergabung, 
Pekerjaan, Jenis Kelamin, Status Perkawinan, Tanggal Lahir, Alamat Lengkap, 
Foto Profil 
Simpanan; Simpanan Pokok, Simpanan Wajib, Simpanan Sukarela (Riwayat; 
setiap simpanan memiliki riwayat masing masing yang bisa dilihat) 
Pinjaman; Limit Pinjaman, Sisa Limit Pinjaman, Pinjaman Aktif, Riwayat 
Pembayaran (Detail Riwayat: ID Angsuran, Total Pinjaman, Jatuh Tempo, Tanggal 
Pembayaran, Status: Dibayar, Belum Dibayar, Terlambat) (Detail Pinjaman Aktif: Pokok 
Pinjaman, Bunga Pinjaman, Biaya Admin Pinjaman, Total Pinjaman, Sudah Dibayar, 
Belum Dibayar, Jumlah Angsuran, Sisa Angsuran, Angsuran per Bulan, Jatuh Tempo)  
Pembiayaan (Syariah); Jenis Pembiayaan, Limit Pembiayaan, Sisa Limit 
Pembiayaan, Pembiayaan Aktif, Riwayat Pembayaran (Detail Riwayat: ID 
Angsuran, Total Pembiayaan, Jatuh Tempo, Tanggal Pembayaran, Status: Dibayar, 
Belum Dibayar, Terlambat) (Detail Pembiayaan Aktif: Pokok Pembiayaan, Margin 
Pembiayaan, Biaya Admin Pembiayaan, Total Pembiayaan, Sudah Dibayar, Belum 
Dibayar, Jumlah Angsuran, Sisa Angsuran, Angsuran per Bulan, Jatuh Tempo).  
SHU; Total SHU, Persentase Pembagian, SHU Didapatkan, Tahun 
Use Cases 
● Admin melihat daftar pendaftar baru dan menekan Approve untuk aktivasi. 
● Admin mencari anggota dengan kata kunci "Budi" untuk melihat data. 
Requirements 
● Performance: Tabel daftar anggota memuat maksimal 1000 record dalam <2 detik. 
● Responsive: Modul tampil baik di desktop dan tablet. 
Acceptance Criteria 
1. Tombol Approve/Reject mengubah status anggota di database. 
2. Detail profil muncul lengkap dengan histori interaksi. 
 
 


Manajemen Simpanan Non-Syariah 
🎯 Objective 
Memungkinkan admin koperasi mengelola simpanan Pokok, Wajib, dan Sukarela yang 
dilakukan melalui digital maupun tunai, dengan sistem penerimaan otomatis, validasi 
manual, laporan lengkap, dan tanda terima digital non-PDF. 
🔑 Fitur Utama yang Disesuaikan 
1. Dashboard Ringkasan Simpanan 
● Tabel Total Simpanan (semua anggota) 
● Total Simpanan Simpanan Pokok, Wajib, Sukarela 
● Jumlah setoran hari ini 
● Jumlah penarikan hari ini 
● Permintaan penarikan 
2. Input & Verifikasi Setoran Tunai 
● Form Manual Entry: 
○ Nomor Anggota (ID) 
○ Nama anggota (autocomplete) 
○ Jenis Simpanan (dropdown) 
○ Jumlah Setoran 
○ Tanggal 
○ Metode: Tunai (default) 
○ Tombol: Simpan + Cetak Bukti (text digital) 
● Verifikasi Manual: 
○ Admin klik “Verifikasi” untuk setoran manual 
Setelah verifikasi, sistem otomatis mengirim tanda terima ke anggota: 
 
🧾 Bukti Setoran Simpanan 
● Nomor Anggota: 0461 
● Nama: Siti Rahma 
● Tanggal: 28 April 2025 
● Jenis: Simpanan Wajib 
● Jumlah: Rp50.000 
● Metode: Manual 
● ID Transaksi: #SMPN-0027 
3. Integrasi Digital Setoran Otomatis 
● Sistem menerima setoran via: 
○ QRIS 
● Status otomatis = “Terverifikasi” 
● Tanda terima otomatis tampil di PWA Anggota + notifikasi untuk Admin 
4. Manajemen Penarikan Simpanan Sukarela 
● Hanya berlaku untuk jenis “Sukarela” 


● Dashboard admin menampilkan: 
○ Permintaan penarikan baru 
○ Saldo anggota (otomatis) 
○ Tombol “Cairkan” → update status jadi “Selesai” 
○ Tanda terima cair otomatis dikirim ke anggota 
5. Riwayat & Detail Simpanan Anggota 
Admin bisa cari anggota & lihat detail: 
Kolom 
Isi 
Nama 
Nama lengkap 
Jenis Simpanan 
Pokok / Wajib / Sukarela 
Jumlah Setoran 
Rp 
Tanggal Setoran 
dd-mm-yyyy 
Status 
Terverifikasi / Belum Diverifikasi / Ditolak 
Metode 
QRIS / VA / Tunai 
Aksi 
Lihat / Cetak Tanda Terima / Verifikasi / Edit 
 
6. Pengaturan Sistem Simpanan 
Admin dapat mengatur: 
● Batas minimum simpanan wajib 
● Jadwal setoran wajib (default: bulanan) 
● Penarikan sukarela bisa kapan saja (checklist) 
● Notifikasi otomatis H-1 untuk setoran wajib 
7. Pelaporan 
● Filter data [jenis simpanan, periode, status] 
● Laporan: 
○ Simpanan per anggota 
○ Total per jenis (pokok, wajib, sukarela) 
○ Permintaan penarikan 
● Ekspor ke Excel  
📌 Use Case - Disesuaikan Flow 
Aktor 
Use Case 
Admin 
Input setoran tunai anggota di kantor 
Admin 
Verifikasi setoran digital yang tertunda 
Admin 
Melihat permintaan penarikan sukarela 


Admin 
Cairkan dana ke anggota via sistem 
Admin 
Unduh laporan total simpanan sukarela untuk RAT 
Anggota Menyetor simpanan digital (QRIS/VA) dan langsung dapat notifikasi 
Anggota Menyetor tunai dan mendapatkan bukti setoran digital (non-PDF) 
Anggota Mengajukan penarikan simpanan sukarela 
🧪 Acceptance Criteria 
Fitur 
Kriteria 
Manual Entry Aktif 
Admin bisa input setoran tunai dan sistem mencetak bukti text 
digital 
Tanda Terima Otomatis 
Setoran digital maupun manual menghasilkan tanda terima 
instan 
Penarikan Sukarela Valid 
Hanya sukarela yang bisa ditarik, sistem cek saldo otomatis 
Semua transaksi tercatat 
Riwayat lengkap tampil per anggota, bisa difilter dan diekspor 
Admin bisa ubah 
kebijakan 
Default simpanan & penarikan dapat dikonfigurasi oleh pengurus 
⚙ Teknologi Pendukung 
Modul 
Fungsi 
Manual Entry Module 
Input setoran tunai dan validasi manual 
Auto Transaction Sync 
QRIS masuk otomatis ke dashboard 
In-App Receipt Viewer 
Anggota bisa melihat tanda terima langsung di aplikasi 
Withdrawal Validator 
Memastikan penarikan hanya dilakukan bila saldo mencukupi 
Notif Scheduler 
Notifikasi pengingat setoran wajib / penarikan 
 
 


Manajemen Simpanan Syariah 
🧩 Fitur-Fitur Dashboard – Berdasarkan Flow 
🎯 Objective 
Menyediakan sistem dashboard terintegrasi untuk pengelolaan simpanan syariah koperasi 
secara transparan, efisien, dan sesuai prinsip: 
● Wadiah Yad Dhamanah (Pokok & Wajib) 
 
● Mudharabah Muthlaqah (Sukarela) 
1. 📊 Dashboard Ringkasan Simpanan 
Menampilkan: 
● Total Simpanan per jenis (Pokok, Wajib, Sukarela) 
● Jumlah Simpanan Aktif, Dalam Proses, Ditarik 
● Jumlah Setoran Hari Ini 
● Estimasi Total Bagi Hasil Bulan Ini 
● Grafik Tren Simpanan / Bagi Hasil 
Filter: Bulan / Tahun / Jenis Simpanan 
2. 🧾 Pencatatan Setoran (Digital & Manual) 
Mode 
Fitur 
Digital 
Setoran otomatis dari VA/QRIS langsung masuk sistem 
Manual 
Admin input via form → sistem mengirim bukti digital ringan 
🔖 Format Bukti Setoran: 
🧾 Bukti Setoran Simpanan 
Nomor Anggota: 0461 
Nama: Siti Rahma 
Tanggal: 28 April 2025 
Jenis: Simpanan Wajib 
Jumlah: Rp50.000 
Metode: QRIS 
ID Transaksi: #SMPN-0027 
● Tersedia via riwayat transaksi, dikirim ke email 
3. 🔍 Detail & Riwayat Simpanan Anggota 
Tabel lengkap dengan filter: 
Kolom 
Keterangan 
Tanggal 
Setoran 
DD/MM/YYYY 
Nama Anggota 
Autocomplete searchable 


Nomor Anggota 
Unique ID Anggota 
Jenis Simpanan Pokok, Wajib, Sukarela 
Jumlah 
Nilai transaksi 
Metode Setoran QRIS / VA / Tunai 
Status 
Aktif / Tertunda / Ditarik 
Nisbah (%) 
Jika Sukarela – tampil nisbah real 
Aksi 
Detail / Edit / Setujui / Cetak Bukti / Hapus 
4. ⚖ Pengelolaan Dana Berdasarkan Akad 
Akad 
Fungsi Otomatis di Dashboard Admin 
Wadiah 
Tidak menghasilkan imbal hasil, hanya dicatat & ditampilkan di ringkasan 
Mudharabah 
Disiapkan untuk distribusi hasil → sistem menghitung & menampilkan 
estimasi 
5. 📈 Perhitungan & Distribusi Bagi Hasil (Simpanan Sukarela) 
● Admin input laba kotor koperasi (bulanan/kuartalan) 
● Sistem menghitung pembagian hasil: 
○ Total dana kelolaan anggota 
○ Nisbah: misal 60% Anggota : 40% Koperasi 
● Otomatis menambahkan saldo ke simpanan anggota 
● Ditampilkan dalam riwayat dengan jenis: Distribusi Bagi Hasil 
🧮 Distribusi Bagi Hasil 
Periode: April 2025 
Total Dana Anggota: Rp 150.000.000 
Nisbah: 60% : 40% 
Jumlah Distribusi: Rp 9.000.000 
6. 💸 Proses Penarikan Simpanan (Khusus Sukarela) 
● Permintaan penarikan masuk dashboard admin 
● Sistem tampilkan saldo terakhir + status simpanan 
● Admin klik “Cairkan”: 
○ Status berubah jadi “Selesai” 
○ Tanda terima transaksi keluar otomatis dibuat 
7. 📁 Laporan & Evaluasi Berkala 
● Laporan per Anggota: 
○ Total simpanan, riwayat, nisbah, distribusi 
 
● Laporan per Kategori Simpanan: 


○ Ringkasan Pokok / Wajib / Sukarela 
 
● Format Ekspor: 
○ Excel, CSV, PDF (khusus RAT atau audit) 
⚙ Pengaturan Modul 
Konfigurasi 
Fungsi 
Jadwal Wajib Setoran 
Default: bulanan (bisa di kustomisasi) 
Nisbah Default Sukarela 
Contoh: 60:40 (anggota : koperasi) 
Batas Minimum Simpanan 
Pokok (Rp1.000.000), Wajib (Rp50.000), Sukarela (opsional) 
Jadwal Distribusi Bagi Hasil 
Bulanan / Kuartalan / Tahunan 
Tooltip Edukasi Syariah 
Teks untuk edukasi di halaman anggota 
 
✅ Acceptance Criteria 
Fitur 
Kriteria Terpenuhi 
Semua transaksi tercatat 
Baik manual maupun digital, otomatis tersimpan dan muncul 
di log 
Bagi hasil otomatis 
Sistem menghitung dan menambahkan nilai ke akun anggota 
Penarikan diverifikasi sistem 
Sistem menolak penarikan wajib/pokok dan menyetujui 
sukarela saja 
Bukti transaksi muncul instan 
Bukti ringan tampil di dashboard, bisa di-copy / .txt 
Data transparan dan bisa 
diekspor 
Laporan lengkap & bisa digunakan saat RAT / audit 
🧩 Fitur Pendukung – Ringkasan 
Fitur 
Keterangan 
Bukti Simpanan 
Ringan 
non-PDF, muncul di riwayat & dashboard anggota 
Manual & Digital Sync 
Input tunai manual, QRIS/VA masuk otomatis 
Real-time Riwayat 
Semua data disajikan real-time dan bisa dicari/filter 
Nisbah Engine 
Hitung otomatis nisbah & distribusi berdasarkan akad Mudharabah 


Withdrawal Validator 
Validasi sistem untuk penarikan, hanya berlaku pada simpanan 
sukarela 
 
 
 


Manajemen Pinjaman Non Syariah 
🎯 Objective 
Menyediakan sistem admin dashboard digital untuk memantau, memproses, menyetujui, dan 
mengelola pinjaman anggota koperasi secara otomatis dan tanpa intervensi manual, 
termasuk pengawasan angsuran, denda, dan laporan menyeluruh. 
🔑 Fitur Utama Dashboard Admin 
1. Dashboard Ringkasan 
Menampilkan KPI harian/bulanan: 
● Jumlah pengajuan pinjaman masuk 
● Jumlah pinjaman disetujui / ditolak 
● Total dana pinjaman yang berjalan 
● Total denda keterlambatan berjalan 
● Status pinjaman aktif (grafik status) 
2. Monitoring Permohonan Pinjaman 
● Status Permohonan: 
○ Sedang Diproses / Disetujui / Ditolak / Manual Review 
● Data ditampilkan: 
○ Nama anggota 
○ Nomor Pinjaman 
○ Tanggal Pengajuan 
○ Jumlah pinjaman 
○ Tujuan 
○ Skor pinjaman (otomatis) 
● Aksi Admin: 
○ Setujui 
○ Tolak 
○ Kembalikan untuk Revisi 
Tooltip: "Permohonan baru akan muncul di sini secara real-time setelah pengajuan 
online oleh anggota." 
3. Verifikasi & Akad Digital 
● Jika disetujui, sistem langsung: 
○ Generate dokumen akad digital (.PDF) 
○ Kirim ke akun anggota 
○ Tanda tangan via OTP / Digital Signature 
● Admin dapat melihat preview akad 
4. Pencairan Dana 
● Jika sistem belum terhubung ke API bank: 
○ Admin klik "Siap Cairkan" → status dana: "Menunggu Transfer" 
● Jika API aktif: 
○ Dana dicairkan otomatis tanpa intervensi 
5. Manajemen Jadwal Angsuran 
Dashboard akan menampilkan: 


● Rincian Jadwal Angsuran: 
○ Nomor Pinjaman 
○ Angsuran ke- 
○ Tanggal Jatuh Tempo 
○ Nominal 
○ Status (Sudah Dibayar / Belum Dibayar / Terlambat) 
○ Sisa Angsuran 
● Fitur: 
○ Export Excel / CSV 
○ Filter per bulan / status / nama anggota 
6. Perhitungan Denda Otomatis 
Denda dikenakan otomatis jika terlambat membayar, berdasarkan: 
● Tanggal jatuh tempo 
● Tanggal pembayaran aktual 
● Rumus: 
 Denda = Persentase × Angsuran / hari × Jumlah hari keterlambatan 
Pengaturan Denda: 
● Persentase default: 1% per hari (bisa dikonfigurasi) 
● Maksimum denda per angsuran (opsional) 
Tampilan di dashboard: 
Nama Anggota 
Pinjaman 
Angsuran 
Status 
Denda (Rp) 
Hari Telat 
 
7. Reminder & Notifikasi 
● Reminder otomatis ke anggota: 
○ H-3, H-1, Hari-H 
○ Reminder Denda jika telat 
● Admin tidak perlu mengirim notifikasi manual 
8. Penutupan & Surat Lunas Otomatis 
● Jika semua angsuran = lunas: 
○ Sistem generate Surat Lunas PDF 
○ Status otomatis: “Lunas” 
○ Notifikasi otomatis ke anggota 
○ Admin dapat unduh surat lunas via dashboard 
9. Riwayat & Riwayat Pembayaran 
● Riwayat Pinjaman per Anggota: 
○ Nomor Pinjaman, Status, Jumlah, Tujuan, Akad 
○ Dokumen Akad (PDF) & Surat Lunas 
● Riwayat Pembayaran: 
○ Tanggal 
○ Metode: Transfer, QRIS, Tunai 
○ Status: Lunas / Tertunda 
○ Jumlah 
○ Denda (jika ada) 


10. Laporan 
● Total Pinjaman Aktif 
● Jumlah Pinjaman Disetujui / Ditolak 
● Total Angsuran Masuk Bulan Ini 
● Total Denda Diterima 
● Status Kolektibilitas Anggota 
● Ekspor laporan: Excel 
⚙ Pengaturan Admin Dashboard 
Item 
Fungsi 
Rasio Denda Harian 
Default 1% per hari, bisa diubah 
Ambang Batas Skor Pinjaman 
<70 masuk manual review 
Jumlah Maksimum Pinjaman 
Limit per anggota (konfigurasi per profil risiko) 
Jangka Waktu Default 
Misal 12 bulan, bisa diedit admin per pengajuan 
Notifikasi Pembayaran 
Konfigurasi H-3/H-1/H diaktifkan 
✅ Acceptance Criteria 
Fitur 
Kriteria Terpenuhi 
Permohonan masuk 
otomatis 
Sistem menangkap dan menampilkan permohonan 
pinjaman 
Akad digital otomatis 
Sistem membuat PDF akad dan mengirim ke anggota 
setelah persetujuan 
Jadwal angsuran otomatis 
Tampil sesuai tenor, tanpa perlu input manual 
Denda otomatis 
Sistem hitung denda jika angsuran telat 
Surat lunas otomatis 
Saat semua lunas, surat diterbitkan & status berubah 
otomatis 
Riwayat & laporan dapat 
diunduh 
Semua histori dan laporan dapat diekspor dari dashboard 
 
🧩 Teknologi Pendukung 
Modul 
Fungsi 
Auto Loan Analyzer 
Menghitung skor kredit dan saran persetujuan 


In-App Reminder 
Notifikasi pembayaran via sistem, tanpa third-party 
Auto-Akad Generator 
PDF akad terbit otomatis sesuai template yang telah 
ditentukan 
Penjadwalan 
Angsuran 
Menyusun dan menampilkan angsuran otomatis 
Denda Engine 
Hitung denda berbasis keterlambatan harian 
Surat Lunas 
Otomatis 
Terbitkan surat lunas dalam format PDF 
 


Manajemen Pembiayaan Syariah 
🎯 Objective 
Menyediakan sistem dashboard berbasis web untuk admin koperasi syariah dalam mengelola 
proses pembiayaan anggota secara digital dan otomatis, berdasarkan akad-akad sah seperti 
Murabahah, Mudharabah, Musyarakah, dan Ijarah, tanpa menggunakan sistem bunga (riba), 
dan sepenuhnya sesuai prinsip syariah. 
🔑 Fitur Utama Admin Dashboard 
1. Dashboard Pengajuan Pembiayaan 
● Menampilkan semua permohonan baru dengan status: 
○ Disetujui Otomatis (Skor Risiko Tinggi) 
○ Perlu Review Manual (Skor Menengah) 
○ Ditolak Otomatis (Skor Rendah) 
● Kolom Tabel: | Nama Anggota | Jenis Akad | Jumlah Pembiayaan | Skor Risiko | Status | 
Aksi | 
● Aksi: Lihat Detail | Setujui | Tolak | Kembalikan untuk Revisi 
2. Skoring Risiko Otomatis 
● Sistem menghitung otomatis berdasarkan: 
○ Durasi dan status keanggotaan 
○ Riwayat pelunasan pembiayaan sebelumnya 
○ Pendapatan dan rasio cicilan 
○ Tujuan pembiayaan 
○ Kelengkapan dokumen 
● Kategori: 
○ ≥ 85: Disetujui Otomatis 
○ 65–84: Perlu Review Admin 
○ < 65: Ditolak Otomatis 
● Admin dapat melihat skor terperinci (tidak bisa mengedit skor) 
3. Manajemen Akad Digital 
● Berdasarkan jenis: 
○ Murabahah – margin tetap 
○ Mudharabah – nisbah bagi hasil 
○ Musyarakah – kemitraan modal 
○ Ijarah – sewa guna usaha 
● Sistem otomatis membuat PDF akad dari template 
● Tanda tangan digital dilakukan oleh anggota via OTP / Checkbox persetujuan 
● Semua dokumen tersimpan otomatis 
4. Pencairan Dana / Barang 
● Jika pembiayaan dana (Mudharabah/Musyarakah): sistem kirim ke bank (API) 
● Jika pembiayaan barang (Murabahah/Ijarah): sistem catat permintaan ke vendor 
● Admin dapat memverifikasi status pencairan dan pengiriman barang 
5. Manajemen Jadwal & Status Pembayaran 
● Sistem membuat jadwal cicilan otomatis berdasarkan akad 


● Menampilkan: 
○ Nomor Angsuran, Tanggal, Nominal 
○ Status: Sudah Dibayar / Belum / Terlambat 
○ Total cicilan, saldo tersisa 
● Bisa difilter berdasarkan akad, nama, tanggal, status 
6. Perhitungan Denda Keterlambatan (Ta’widh) 
● Berlaku hanya untuk akad Murabahah dan Ijarah 
Rumus denda: 
Denda = Prosentase x Jumlah Angsuran x Hari Keterlambatan 
● Default: 0,5%/hari (editable) 
● Maksimal denda: 10% (optional config) 
● Denda tercatat dalam riwayat anggota dan laporan admin 
● Tidak berlaku untuk akad Mudharabah dan Musyarakah 
7. Reminder & Notifikasi 
● Sistem otomatis kirim pengingat: 
○ H-3, H-1, dan Hari-H 
● Notifikasi muncul di dashboard anggota 
● Admin tidak perlu intervensi manual 
● Reminder juga untuk: 
○ Pelaporan usaha (Mudharabah/Musyarakah) 
○ Pengunggahan dokumen tambahan (jika perlu) 
8. Pelunasan & Surat Lunas Otomatis 
● Jika seluruh angsuran sudah lunas: 
○ Status otomatis menjadi “Lunas” 
○ Sistem generate Surat Lunas PDF 
○ Surat bisa diakses dan diunduh dari dashboard 
○ Tidak ada proses cetak manual oleh admin 
9. Riwayat & Arsip Pembiayaan 
● Riwayat per anggota: 
○ Detail pembiayaan, status, akad, jadwal, riwayat pembayaran 
○ Dokumen akad dan surat lunas 
● Admin bisa cari dan filter berdasarkan nama, akad, tahun 
10. Laporan Pembiayaan & Angsuran 
● Tipe laporan: 
○ Rekap pembiayaan aktif & lunas 
○ Distribusi jenis akad 
○ Jumlah denda terkumpul 
○ Status kolektibilitas 
 
● Ekspor: 
○ Excel 
⚙ Pengaturan Dashboard Admin 


Pengaturan 
Fungsi 
Default Margin Murabahah 
Contoh: 10% (editable per pengajuan) 
Default Nisbah Mudharabah 
Contoh: 60% anggota : 40% koperasi 
Default Durasi Ijarah 
Contoh: 12 bulan 
Persentase Denda Ta’widh 
Default 0.5% per hari (syariah) 
Ambang Skor Disetujui Otomatis 
≥ 85 
Ambang Skor Manual Review 
65–84 
Akad Aktif 
Bisa aktif/nonaktifkan jenis akad tertentu 
Reminder Angsuran 
H-3, H-1, H (otomatis) 
Reminder Laporan Usaha 
Per bulan (khusus Mudharabah, Musyarakah) 
 
✅ Acceptance Criteria 
Fitur 
Kriteria 
Pengajuan muncul otomatis 
Semua permohonan tampil tanpa input ulang 
Skoring berjalan otomatis 
Sistem memberikan skor lengkap dan rekomendasi 
Akad tergenerate otomatis 
PDF akad tersedia segera setelah disetujui 
Jadwal angsuran otomatis 
Jadwal muncul sesuai akad dan durasi 
Reminder otomatis 
Anggota menerima notifikasi tepat waktu 
Denda dihitung sistem 
Denda ta’widh muncul otomatis sesuai keterlambatan 
Surat lunas otomatis 
Sistem membuat surat lunas tanpa input manual 
Laporan lengkap bisa 
diekspor 
Data pembiayaan dan denda bisa diekspor Excel 
 
🧩 Teknologi Pendukung 
Modul 
Fungsi 
Auto Risk Analyzer 
Hitung skor risiko anggota dari profil digital 


Digital Akad Generator 
Membuat dokumen akad sesuai jenis dan persetujuan 
OTP Signature Engine 
Verifikasi dan persetujuan akad 
Auto Payment Tracker 
Mendeteksi pembayaran dan memperbarui status 
Denda Engine (Syariah) 
Menghitung denda tanpa riba, hanya ta’widh 
Reminder System 
Kirim notifikasi jatuh tempo secara otomatis 
Report Exporter 
Menyediakan laporan pembiayaan dan angsuran 
 
📋 Use Case (Sisi Admin) 
Use Case 
Deskripsi 
Admin melihat permohonan pembiayaan 
baru 
Sistem menampilkan daftar pengajuan lengkap 
dengan skor risiko 
Admin menyetujui pengajuan dengan 
skor menengah 
Admin klik Setujui, sistem lanjut ke akad 
Admin melihat jadwal angsuran & status 
Admin pantau semua pembayaran dan 
keterlambatan 
Admin meninjau laporan denda 
Sistem hitung dan tampilkan semua denda 
otomatis 
Admin mengekspor laporan bulanan 
Admin ekspor Excel untuk RAT dan evaluasi 
 
 


Manajemen SHU (Sisa Hasil Usaha) 
Deskripsi 
Modul untuk menghitung, mengelola, dan mendistribusikan Sisa Hasil Usaha (SHU) koperasi 
kepada anggota berdasarkan kontribusi simpanan dan partisipasi. 
Fitur Utama 
1. Input Nilai SHU Tahunan 
○ Form untuk memasukkan total SHU yang dapat dibagikan. 
○ Opsi pembagian berdasarkan persentase simpanan, partisipasi, atau kriteria 
khusus. 
2. Simulasi Perhitungan SHU 
○ Preview distribusi SHU ke anggota berdasarkan formula. 
○ Grafik ringkasan porsi SHU per kelompok (simpanan pokok, wajib, sukarela). 
3. Distribusi Otomatis 
○ Proses pembagian nilai SHU ke akun anggota. 
○ Notifikasi otomatis ke anggota. 
4. Riwayat dan Laporan SHU 
○ Daftar SHU per tahun per anggota: Tahun, Total Diterima, Persentase. 
○ Export laporan SHU ke Excel. 
Use Cases 
● Admin input total SHU tahun 2024 sebesar Rp1.000.000.000 dan memilih nisbah 
simpanan 70% dan partisipasi 30%. 
● Admin menjalankan simulasi untuk melihat distribusi terkecil dan terbesar. 
● Admin proses distribusi SHU dan anggota menerima notifikasi saldo bertambah. 
Data dan Integrasi 
● Calculation Service: modul terpisah untuk menghitung alokasi berdasarkan aturan. 
Requirements 
● Performance: simulasi SHU untuk 10k anggota dieksekusi ≤5 detik. 
● Security: validasi total SHU dan alokasi rule. 
● Responsive: modul dapat diakses di desktop dan tablet. 
Acceptance Criteria 
1. Admin dapat input dan simulasikan distribusi SHU dengan akurat. 
2. Distribusi otomatis menambahkan nilai SHU ke akun anggota. 
3. History SHU menampilkan data per tahun. 
4. Export laporan mencakup kolom: Anggota, Tahun, Total SHU, Persentase. 
 


Manajemen Rapat Anggota (RAT) 
Deskripsi 
Modul ini digunakan untuk mengelola Rapat Anggota Tahunan (RAT), mulai dari penjadwalan, 
publikasi agenda, pelaksanaan voting digital, hingga dokumentasi hasil rapat. 
Fitur Utama 
1. Penjadwalan & Agenda Rapat 
○ Input tanggal dan waktu RAT. 
○ Unggah agenda dan materi presentasi. 
○ Notifikasi ke seluruh anggota. 
2. Voting Digital 
○ Pembuatan item voting: jenis suara (ya/tidak, pilihan ganda), durasi voting. 
○ Validasi identitas anggota sebelum memberikan suara. 
○ Hasil voting ditampilkan secara real-time. 
3. Notulen & Dokumentasi 
○ Upload notulen dan ringkasan hasil rapat. 
○ Penyimpanan file dokumentasi RAT (PDF, Excel, gambar). 
4. Riwayat RAT & Laporan 
○ Daftar RAT terdahulu. 
○ Statistik partisipasi anggota. 
Use Cases 
● Admin membuat jadwal RAT tahun 2025 dan mengunggah agenda + materi presentasi. 
● Admin mengaktifkan voting digital pemilihan pengurus baru. 
● Admin mengarsipkan notulen rapat dan hasil voting. 
Requirements 
● Performance: voting dapat menampung hingga 5.000 suara tanpa delay. 
● Security: one-member-one-vote, hasil terenkripsi. 
● Responsive: optimal di desktop dan mobile. 
Acceptance Criteria 
1. Admin dapat menjadwalkan RAT dan membagikan agenda ke anggota. 
2. Voting digital dapat dibuat dan dijalankan sesuai durasi. 
3. Hasil voting dapat dilihat real-time dan terenkripsi. 
4. Notulen dapat diunduh dan diakses oleh seluruh anggota. 
5. Statistik kehadiran dan partisipasi dapat diekspor. 
6. Distribusi otomatis menambahkan nilai SHU ke akun anggota. 
7. History SHU menampilkan data per tahun. 
8. Export laporan mencakup kolom: Anggota, Tahun, Total SHU, Persentase.
 


Manajemen Aset dan Penyusutan Koperasi 
Produk: Dashboard Admin Koperasi 
Fitur: Manajemen Aset 
Peran Utama: Pengurus Koperasi (Admin) 
Tujuan: Mengelola, memantau, dan melacak semua aset milik koperasi secara digital dan 
terstruktur. 
 
🎯 Objective 
Memudahkan pengurus koperasi dalam: 
● Mencatat aset yang dimiliki koperasi (berwujud & tidak berwujud) 
● Memantau kondisi dan lokasi aset 
● Melacak histori pemakaian dan status aset 
● Mendukung audit dan transparansi manajemen aset 
 
🧩 Jenis Aset yang Didukung 
Kategori Aset 
Contoh 
Aset Tetap 
Tanah, bangunan, kendaraan, alat 
produksi 
Aset Bergerak 
Laptop, printer, perlengkapan kantor 
Aset Digital 
Domain, software, lisensi, akun cloud 
Aset Keuangan (Opsional) Deposito, saham, investasi lain 
 
📌 Fitur Utama 
1. 📋 Daftar Aset 
● Tabel yang menampilkan seluruh aset koperasi 
● Kolom: 
○ ID Aset 
○ Nama Aset 
○ Jenis Aset 
○ Nilai Perolehan (Rp) 
○ Tanggal Perolehan 
○ Lokasi Aset 
○ Status: [Aktif, Dalam Perawatan, Rusak, Dijual] 
○ Tanggal Update Terakhir 
○ Aksi: [Lihat, Edit, Hapus] 
 
2. ➕ Tambah Aset Baru 
● Form input: 
○ Nama Aset 
○ Jenis Aset (Dropdown: Tetap, Bergerak, Digital, dll.) 


○ Kategori (Sub-kategori: misal Kendaraan, Elektronik) 
○ Tanggal Perolehan 
○ Nilai Aset (Rp) 
○ Lokasi penyimpanan 
○ Keterangan tambahan (opsional) 
○ Upload foto/dokumen pendukung 
 
3. 🛠 Update Status Aset 
● Ganti status aset: 
 
○ Aktif 
○ Dalam Perawatan 
○ Rusak 
○ Dijual / Disusutkan 
● Catat tanggal update status & deskripsi peristiwa 
 
4. 📜 Histori Perubahan Aset 
● Lacak perubahan status, pemindahan lokasi, atau pemakaian aset 
● Riwayat mencakup: 
○ Waktu 
○ Jenis Perubahan 
○ Keterangan 
○ User/Admin yang melakukan perubahan 
 
5. 📤 Export & Pelaporan 
● Tombol untuk: 
○ Export Excel / PDF 
○ Filter berdasarkan status, lokasi, jenis aset 
○ Rekap nilai total aset per kategori 
 
6. 📎 Lampiran & Dokumen 
● Upload dokumen pendukung: 
○ Bukti pembelian 
○ Surat kepemilikan 
○ Garansi 
● Disimpan terhubung ke ID Aset 
 
🧾 Contoh Tabel Daftar Aset 
ID 
Aset 
Nama Aset 
Jenis 
Aset 
Nilai (Rp) 
Status 
Lokasi 
Terakhir 
Update 
AST00
1 
Motor Honda 
Vario 
Bergera
k 
18.500.0
00 
Aktif 
Kantor 
Cabang 1 
01/06/2025 


AST00
2 
Hosting 
Website 
Digital 
1.200.00
0 
Aktif 
Online 
01/06/2025 
AST00
3 
Komputer 
Kasir 
Tetap 
6.500.00
0 
Dalam 
Perawatan 
Kantor 
Pusat 
25/05/2025 
 
✅ Acceptance Criteria 
Fitur 
Kriteria Keberhasilan 
Tambah Aset 
Data lengkap disimpan, muncul di daftar aset 
Update Status 
Status terbaru tercatat dan ditampilkan 
Lihat Riwayat Aset 
Semua perubahan status dan lokasi tampil 
kronologis 
Export Data 
File excel/pdf sesuai filter dan format 
Unggah Dokumen 
Pendukung 
File tersimpan dan bisa diakses kembali 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Tambah, ubah, hapus, export, unggah 
dokumen 
Super Admin 
Monitoring lintas koperasi (jika multi-KSU) 
 
📝 Tooltip / Istilah Penting 
● Aset Tetap: Barang tidak mudah berpindah & memiliki usia pakai panjang (≥1 tahun) 
● Aset Digital: Properti berbasis sistem, seperti domain, software, lisensi 
● Riwayat Aset: Semua catatan histori perubahan, penggunaan, atau perawatan 
● Lokasi Aset: Tempat fisik atau digital penyimpanan aset 
 


🎯 Objective 
Menyediakan laporan aset koperasi yang real-time dan terintegrasi dengan perhitungan 
penyusutan agar: 
● Nilai aset selalu termutakhir. 
● Laporan keuangan mencerminkan kondisi sebenarnya. 
● Proses pelaporan audit & RAT lebih efisien. 
● https://klikpajak.id/blog/cara-penghitungan-biaya-penyusutan-fiskal/ (ref) 
 
Struktur Laporan Aset 
1. Data Aset Tetap 
● Nama Aset 
● Kode Aset 
● Tanggal Perolehan 
● Harga Perolehan 
● Kategori Aset: [Peralatan, Kendaraan, Bangunan, dll] 
● Lokasi Aset 
● Metode Penyusutan: Garis Lurus / Saldo Menurun 
● Umur Manfaat (tahun) 
● Akumulasi Penyusutan 
● Nilai Buku Saat Ini 
 
📋 Contoh Tampilan Laporan 
Kode 
Aset 
Nama Aset 
Tgl 
Perolehan 
Harga 
Perolehan 
Umu
r 
Nilai Buku 
Penyusutan / 
Tahun 
AST-00
1 
Laptop 
Akuntansi 
01/01/2023 
Rp 
10.000.000 
3 th 
Rp 
6.666.667 
Rp 3.333.333 
AST-00
2 
Printer 
Kantor 
01/01/2022 
Rp 2.000.000 
4 th 
Rp 
1.000.000 
Rp 500.000 
Nilai buku otomatis berkurang setiap akhir bulan sesuai metode penyusutan. 
 
🧾 Fitur Utama 
1. 🎯 Data Master Aset 
● Tambah aset manual (form input) 
● Impor aset massal (Excel) 
● Penandaan aset aktif/non-aktif 
2. 🔁 Perhitungan Penyusutan Otomatis 
● Metode: Garis Lurus (Straight Line) default 
● Opsi metode lain (Saldo Menurun) jika diaktifkan 
● Sistem menghitung otomatis penyusutan bulanan 
● Update nilai buku secara otomatis 


3. 🗂 Filter & Kategori Aset 
● Berdasarkan jenis aset: [Kendaraan, Peralatan, Properti] 
● Berdasarkan lokasi 
● Berdasarkan status (aktif, rusak, dijual) 
4. 📤 Export & Riwayat 
● Ekspor laporan ke Excel & PDF 
● Riwayat nilai buku per bulan 
● Catatan pemeliharaan / status (jika dicatat) 
5. 🔔 Reminder Otomatis 
● Notifikasi untuk aset yang mendekati umur manfaat akhir 
● Notifikasi aset dengan nilai buku nol 
 
✅ Acceptance Criteria 
Fitur 
Hasil yang Diharapkan 
Perhitungan penyusutan 
otomatis 
Nilai buku tiap bulan diperbarui otomatis berdasarkan 
metode 
Laporan aset dapat diekspor 
Excel dan PDF tersedia dan dapat dicetak 
Filter dan pencarian berfungsi 
baik 
Data bisa disaring berdasarkan kategori, lokasi, status 
Reminder berjalan 
Pengingat muncul untuk aset mendekati umur manfaat 
atau rusak 
Data konsisten dengan Neraca 
Total nilai buku = total Aset Tetap di Neraca 
 
📦 Integrasi 
● Modul Akuntansi (Neraca) → Total nilai buku aset = Aktiva Tetap 
● Modul Transaksi → Pembelian aset otomatis tercatat di sini 
● Modul Laporan RAT → Laporan aset & penyusutan ditarik ke laporan tahunan 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Lihat, tambah, edit aset, ekspor, proses 
penyusutan 
Super Admin 
Monitoring lintas koperasi (jika sistem multi-KSU) 
Viewer / Auditor 
Lihat & ekspor laporan, tanpa bisa mengedit aset 
 


📝 Tooltip Istilah 
● Nilai Buku: Harga perolehan dikurangi akumulasi penyusutan 
● Umur Manfaat: Periode waktu aset diakui bernilai (biasanya dalam tahun) 
● Metode Garis Lurus: Penyusutan tetap setiap tahun 
● Metode Saldo Menurun: Penyusutan menurun setiap tahun 
 
🧩 Fitur Opsional (Roadmap) 
● Upload gambar aset & dokumen perolehan 
● Tracking pemeliharaan aset 
● QR Code per aset untuk scan identifikasi lapangan 
● Pelabelan status aset: aktif, rusak, dijual
 


Manajemen Transaksi Koperasi 
Modul: Dashboard Admin 
Fitur: Manajemen Transaksi 
Pengguna: Pengurus Koperasi (Admin) 
Tujuan: Menyediakan pencatatan dan pelacakan seluruh aktivitas kas masuk dan keluar 
koperasi secara terstruktur, real-time, dan transparan. 
 
🎯 Objective 
Menyediakan sistem pencatatan transaksi digital yang mencakup seluruh jenis aktivitas 
keuangan koperasi seperti simpanan, pinjaman, pembiayaan syariah, pembagian SHU, hingga 
transaksi non-simpan-pinjam. 
 
📌 Fitur Utama 
1. 📊 Ringkasan Kas (Statistik Utama) 
● Saldo Awal Periode 
● Total Penerimaan Kas 
● Total Pengeluaran Kas 
● Saldo Akhir (otomatis dihitung) 
 
2. 📋 Daftar Transaksi 
Tabel utama menampilkan semua transaksi kas koperasi dengan kolom: 
Kolom 
Keterangan 
Tanggal Transaksi 
Format: DD/MM/YYYY 
Kategori Transaksi 
Simpanan / Pinjaman / Pembiayaan / SHU / Bagi Hasil / Non 
Simpan-Pinjam 
Jenis Transaksi 
Penerimaan / Pengeluaran 
Keterangan 
Deskripsi transaksi 
Nominal 
Jumlah dalam Rupiah 
Terkait Anggota 
Nama / ID anggota (jika relevan) 
Metode 
Pembayaran 
Tunai / Transfer / QRIS / VA / Internal Wallet 
Referensi / Bukti 
Nomor referensi atau lampiran bukti transfer 
Aksi 
[Lihat], [Edit], [Hapus] 
 
3. 🔍 Filter & Pencarian 
● Rentang waktu: Hari, Minggu, Bulan, Custom Date 


● Jenis Transaksi: Penerimaan / Pengeluaran 
● Kategori: Simpanan, Pinjaman, Pembiayaan, SHU, dll. 
● Nama Anggota / ID Anggota 
● Nominal minimum/maksimum 
 
4. ➕ Input Transaksi Manual 
Form untuk input transaksi baru: 
Field 
Tipe 
Tanggal Transaksi 
Date Picker 
Jenis Transaksi 
Dropdown: Penerimaan / Pengeluaran 
Kategori Transaksi Dropdown: Simpanan, Pinjaman, dll. 
Nominal (Rp) 
Input Angka 
Anggota Terkait 
Autocomplete Nama / ID Anggota (jika ada) 
Keterangan 
Text area 
Upload Bukti 
Optional Upload (jpg/png/pdf) 
Setelah submit, transaksi langsung muncul di daftar dan mempengaruhi ringkasan 
kas. 
 
5. 🧾 Detail Transaksi 
Jika admin klik transaksi → buka modal detail: 
● Semua field readonly 
● Tampilkan juga history pengubahan (jika pernah di-edit) 
 
6. 📤 Export & Pelaporan 
● Tombol Export: 
○ Export ke Excel 
○ Export ke PDF 
● Berdasarkan filter aktif 
● Template laporan kas koperasi lengkap (header koperasi, periode, total masuk/keluar) 
 
7. 📝 Kategori Transaksi (Default) 
Kategori 
Jenis 
Deskripsi 
Simpanan 
Masuk 
Pokok, Wajib, Sukarela 
Pinjaman 
Masuk/Keluar Pencairan & angsuran pinjaman anggota 


Pembiayaan 
Syariah 
Masuk/Keluar Mudharabah, Murabahah, dll. 
Pembagian SHU 
Keluar 
Distribusi SHU ke anggota 
Bagi Hasil 
Masuk/Keluar Khusus Mudharabah (dari/ke anggota) 
Non 
Simpan-Pinjam 
Masuk/Keluar Hibah, iuran, pembayaran operasional, pembelian aset, 
dll. 
 
✅ Acceptance Criteria 
Skenario 
Kriteria Keberhasilan 
Input transaksi berhasil 
Tampil di daftar dan update saldo kas otomatis 
Filter berfungsi 
Tabel menampilkan hasil sesuai filter 
Export sukses 
File dapat diunduh dengan format rapi dan 
lengkap 
Edit transaksi 
Perubahan tercatat dan update kas direkalkulasi 
Lampiran bukti bisa diakses Dapat di-download dari halaman detail transaksi 
 
🧾 Struktur Tabel (Contoh DB) 
Tabel: transaksi_koperasi 
Kolom 
Tipe 
Keterangan 
id_transaks
i 
UUID 
ID unik 
tanggal 
DATE 
Tanggal transaksi 
jenis 
ENUM 
Penerimaan / Pengeluaran 
kategori 
ENUM 
Simpanan / Pinjaman / SHU / dll. 
nominal 
DECIMAL 
Jumlah transaksi 
id_anggota 
UUID (null) 
Nullable jika bukan anggota 
keterangan 
TEXT 
Catatan tambahan 
bukti_url 
TEXT (url) 
Link ke file bukti pembayaran 
created_by 
UUID 
ID admin yang input 


 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Full: tambah, edit, filter, hapus, export 
Super Admin 
Monitoring laporan lintas koperasi 
Viewer/Staff 
View-only & filter transaksi 
 
 
 


Kartu Anggota Koperasi 
Produk: Dashboard Admin Koperasi 
Fitur: Kartu Anggota Digital 
Digunakan Oleh: Pengurus Koperasi 
Tujuan: Mempermudah verifikasi identitas anggota, meningkatkan profesionalisme, dan 
menyediakan kartu identitas koperasi yang seragam dan digital. 
 
🎯 Objective 
Menyediakan sistem pembuatan, pengelolaan, dan distribusi Kartu Anggota Digital koperasi 
yang dapat: 
● Dicetak (opsional) 
● Diakses secara online oleh anggota 
● Digunakan untuk keperluan administrasi, validasi keanggotaan, dan pendataan internal 
 
📌 Fitur Utama 
1. 🎫 Pembuatan Kartu Anggota Digital 
● Admin dapat membuat kartu untuk setiap anggota dari data yang telah terdaftar 
● Sistem otomatis mengambil data: 
○ Nama Lengkap 
○ ID Anggota / Nomor Registrasi 
○ Foto Profil (diunggah atau default) 
○ Jenis Keanggotaan 
○ Tanggal Bergabung 
○ QR Code unik untuk verifikasi keanggotaan 
● Template kartu standar koperasi dengan logo & warna institusi 
 
2. 🧾 Detail Tampilan Kartu (Preview Digital) 
● Tampilan digital seperti ID card 
● Kolom yang ditampilkan: 
○ Foto 
○ Nama Anggota 
○ ID Anggota 
○ Tanggal Bergabung 
○ QR Code / Barcode 
○ Status: Aktif / Tidak Aktif 
● Opsi download sebagai: 
○ PNG 
○ PDF (ukuran ID Card) 
○ Dicetak langsung (jika diperlukan) 
 
3. 🔍 Pencarian & Filter Anggota 
● Cari berdasarkan: 


○ Nama Anggota 
○ Nomor ID 
○ Status Keanggotaan 
● Filter: [Aktif] [Tidak Aktif] [Belum Cetak] 
 
4. ⚙ Konfigurasi Template Kartu 
● Admin dapat memilih: 
○ Warna tema kartu 
○ Logo koperasi 
○ Posisi elemen (drag-and-drop layout editor — opsional) 
○ Tambahan kolom: Email / No HP / TTL (opsional) 
 
5. 📥 Download / Cetak Massal 
● Admin dapat memilih beberapa anggota dan klik: 
○ [Download Semua Kartu (ZIP PNG)] 
○ [Export PDF Kartu (1 Lembar 8 Kartu)] 
● Untuk pencetakan fisik atau pembagian offline 
 
6. 📲 Integrasi QR Code Anggota 
● Setiap QR Code dapat discan untuk: 
○ Verifikasi data anggota (via aplikasi mobile admin) 
○ Tampilkan informasi dasar anggota 
○ Status aktif/nonaktif 
 
🧾 Contoh Tabel Data Anggota (Backend) 
ID Anggota 
Nama 
Status 
Foto 
Tgl Bergabung 
QR Code (link) 
001-2023 
Siti Rahma 
Aktif 
siti.jpg 
15/04/2023 
/qr/001-2023 
002-2023 
Agus 
Santoso 
Tidak Aktif 
agus.pn
g 
10/02/2022 
/qr/002-2023 
 
✅ Acceptance Criteria 
Fitur 
Kriteria Keberhasilan 
Buat kartu dari data anggota 
Semua field terisi otomatis dan bisa di-preview 
Cetak & ekspor kartu 
Kartu bisa diunduh sebagai PNG / PDF sesuai 
template 
QR code berfungsi 
Scan menampilkan info anggota & status 


Edit template berhasil 
Perubahan langsung tampil di preview dan hasil 
ekspor 
Riwayat pencetakan 
tersimpan 
Admin tahu siapa, kapan, berapa kartu dicetak 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Buat, edit, cetak, ekspor kartu 
Super Admin (Ops) Monitoring lintas koperasi (opsional untuk multi-instansi) 
 
📝 Tooltip & Istilah 
● Kartu Anggota: Identitas digital resmi anggota koperasi 
● QR Code: Kode unik untuk keperluan validasi keanggotaan koperasi 
● Status Aktif: Anggota yang aktif membayar simpanan & bisa menggunakan layanan 
 
🔧 Fitur Opsional (Roadmap) 
● Tanda tangan digital anggota di kartu 
● Versi kartu mini untuk display di aplikasi anggota
 


Laporan Neraca Koperasi 
Modul: Dashboard Admin Koperasi 
Fitur: Laporan Neraca (Balance Sheet) 
Digunakan Oleh: Pengurus Koperasi, Bendahara 
Tujuan: Menyediakan ringkasan posisi keuangan koperasi secara berkala berdasarkan prinsip 
akuntansi, termasuk aktiva, kewajiban, dan ekuitas. 
 
🎯 Objective 
Menyediakan laporan neraca digital yang akurat, real-time, dan bisa diekspor untuk keperluan 
audit, transparansi ke anggota, dan pelaporan RAT. 
 
📌 Komponen Neraca 
Laporan Neraca menampilkan tiga bagian utama: 
1. Aktiva (Aset) 
● Aktiva Lancar: 
○ Kas dan Bank 
○ Piutang Anggota 
○ Piutang Usaha 
○ Persediaan 
● Aktiva Tetap: 
○ Tanah dan Bangunan 
○ Kendaraan 
○ Peralatan 
○ Akumulasi Penyusutan 
2. Kewajiban (Liabilitas) 
● Kewajiban Jangka Pendek: 
○ Hutang Usaha 
○ Hutang Pinjaman 
○ Kewajiban Jangka Pendek Lain 
● Kewajiban Jangka Panjang: 
○ Pinjaman Bank Jangka Panjang 
○ Kewajiban Karyawan 
3. Ekuitas 
● Simpanan Anggota (Pokok, Wajib, Sukarela) 
● Cadangan Umum 
● Laba Ditahan 
● Sisa Hasil Usaha (SHU) Tahun Berjalan 
 
🧾 Tampilan Laporan Neraca 
Kategori 
Sub-Kategori 
Jumlah (Rp) 


Aktiva Lancar 
Kas di Bank 
Rp25.000.000 
 
Piutang Anggota 
Rp10.000.000 
Aktiva Tetap 
Tanah & Bangunan 
Rp100.000.000 
 
Akumulasi Penyusutan (-) (Rp20.000.000) 
Total Aktiva 
 
Rp115.000.000 
Kewajiban 
Hutang Usaha 
Rp15.000.000 
 
Pinjaman Bank 
Rp20.000.000 
Ekuitas 
Simpanan Anggota 
Rp50.000.000 
 
SHU Belum Dibagi 
Rp30.000.000 
Total Pasiva 
 
Rp115.000.000 
Neraca harus selalu seimbang: Total Aktiva = Total Kewajiban + Ekuitas 
 
🔍 Fitur Pendukung 
1. 🗓 Filter Periode 
● Pilihan: [Bulan Ini], [Kuartal], [Tahun Ini], [Custom Date] 
● Data diperbarui otomatis dari jurnal transaksi 
2. 📊 Ringkasan Visual 
● Pie Chart: Komposisi Aktiva vs Kewajiban & Ekuitas 
● Bar Chart: Perbandingan Neraca antar bulan/tahun 
3. 📤 Export & Unduh 
● Format: Excel, PDF 
● Header laporan dengan nama koperasi, periode, dan total 
4. 📁 Riwayat Laporan 
● Menyimpan laporan sebelumnya 
● Bisa dibuka ulang, dibagikan ke email pengurus, atau dicetak 
 
⚙ Integrasi Data Otomatis 
● Mengambil data dari: 
○ Transaksi kas masuk/keluar 
○ Modul simpanan dan pinjaman 
○ Modul aset tetap 
○ Modul pembiayaan syariah 
○ Modul SHU 
● Semua pencatatan otomatis masuk ke sistem jurnal → neraca disusun sistematis 
 


✅ Acceptance Criteria 
Skenario 
Kriteria Keberhasilan 
Laporan neraca tampil 
otomatis 
Berdasarkan transaksi berjalan dan jurnal yang 
dicatat 
Total aktiva = pasiva 
Sistem validasi untuk keseimbangan neraca 
Laporan bisa diunduh 
File rapi sesuai format akuntansi 
Riwayat laporan disimpan 
Admin bisa mengakses laporan terdahulu 
Integrasi ke laporan RAT 
Bisa dipakai sebagai bahan presentasi RAT tahunan 
 
🧩 Komponen UI (Admin Dashboard) 
● Sidebar: “📘 Akuntansi → Neraca” 
● Halaman utama: 
○ Filter waktu 
○ Tabel Laporan Neraca 
○ Tombol: [📥 Export PDF], [📊 Tampilkan Grafik], [🕘 Riwayat Laporan] 
● Tooltip istilah akuntansi: hover untuk edukasi singkat 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Lihat, cetak, unduh laporan 
Akuntan/Internal Auditor 
Akses penuh ke semua periode & 
ekspor 
Super Admin 
Monitoring lintas koperasi 
 
📚 Tooltip Istilah Penting 
● Aktiva Lancar: Aset yang dapat dicairkan dalam waktu dekat 
● Aktiva Tetap: Aset yang digunakan jangka panjang 
● Ekuitas: Hak milik anggota atas kekayaan koperasi 
● SHU: Sisa Hasil Usaha, sisa laba bersih koperasi
 


Laporan Laba Rugi Koperasi 
Modul: Dashboard Admin Koperasi 
Fitur: Laporan Laba Rugi 
Digunakan Oleh: Pengurus Koperasi, Bendahara, Auditor Internal 
Tujuan: Menyediakan laporan keuangan periodik untuk melihat performa usaha koperasi 
berdasarkan pendapatan dan beban operasional yang terjadi selama periode tertentu. 
 
🎯 Objective 
Memfasilitasi pengurus koperasi dalam: 
● Menganalisis keuntungan atau kerugian bersih koperasi. 
● Memantau pendapatan dan beban operasional secara real-time. 
● Menyusun laporan keuangan untuk Rapat Anggota Tahunan (RAT), akuntabilitas publik, 
dan audit. 
 
📌 Struktur Laporan Laba Rugi 
Laporan disusun secara otomatis oleh sistem berdasarkan transaksi yang telah tercatat di 
modul-modul lain (transaksi kas, simpanan, pinjaman, pembiayaan, dll). 
1. Pendapatan (Revenue) 
● Pendapatan dari: 
○ Jasa Pinjaman 
○ Bagi Hasil Pembiayaan Syariah 
○ Penjualan Produk/Usaha 
○ Pendapatan Lainnya (hibah, donasi, dividen investasi) 
2. Beban Operasional (Expenses) 
● Beban Administrasi 
● Beban Karyawan 
● Beban Operasional Usaha 
● Beban Penyusutan Aset Tetap 
● Beban Lainnya 
3. Laba/Rugi Usaha 
Total Pendapatan – Total Beban 
 
📊 Contoh Tampilan Laporan 
Kategori 
Sub-Kategori 
Nominal (Rp) 
Pendapatan 
Jasa Pinjaman 
Rp 15.000.000 
 
Penjualan Toko 
Koperasi 
Rp 25.000.000 
Total Pendapatan 
 
Rp 40.000.000 


Beban 
Operasional 
Gaji & Honorarium 
Rp 10.000.000 
 
Sewa & Utilitas 
Rp 5.000.000 
 
Administrasi Bank 
Rp 500.000 
Total Beban 
 
Rp 15.500.000 
Laba Bersih 
 
Rp 24.500.000 
 
🧾 Fitur Utama 
1. 🗓 Filter Periode 
● Pilihan: [Bulan], [Kuartal], [Tahun], [Custom Date] 
● Default: Bulan berjalan 
2. 📈 Tampilan Ringkas 
● Total Pendapatan 
● Total Beban 
● Grafik Perbandingan Pendapatan vs Beban 
● Indikator Laba Rugi (positif = hijau, negatif = merah) 
3. 📤 Export Laporan 
● Format: PDF & Excel 
● Dapat dicetak dan dibagikan pada RAT 
● Header: Nama Koperasi, Logo, Periode, dan Total Laba/Rugi 
4. 📁 Riwayat Laporan 
● Sistem menyimpan riwayat laporan berdasarkan waktu 
● Bisa dibuka kembali kapan saja 
 
🧩 Integrasi Data Otomatis 
Sumber data laporan: 
● Modul Transaksi Kas 
● Modul Pinjaman & Pembiayaan 
● Modul Aset Tetap (penyusutan) 
● Modul Pendapatan Usaha / Unit Bisnis Koperasi 
 
✅ Acceptance Criteria 
Fitur 
Kriteria Keberhasilan 
Laporan otomatis tersusun 
Berdasarkan transaksi yang tercatat selama periode 
tertentu 


Pendapatan & Beban dipisah 
jelas 
Disusun dalam format standar akuntansi 
Nilai Laba/Rugi dihitung tepat 
Tidak boleh minus di total jika sistem tidak valid 
Export berhasil & rapi 
File dapat digunakan dalam RAT atau keperluan 
pelaporan 
Bisa diakses lintas periode 
Riwayat laporan dapat dibuka dan dibagikan ulang 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Full akses lihat + export 
Super Admin 
Lihat seluruh koperasi (jika multi instance) 
Auditor Internal 
Lihat + unduh laporan 
 
📝 Tooltip Edukasi 
● Laba Bersih = Pendapatan – Beban 
● Pendapatan Usaha = Semua pemasukan dari kegiatan produktif koperasi 
● Beban Operasional = Semua pengeluaran rutin & kebutuhan pengurus 
● Penyusutan Aset = Alokasi penurunan nilai aset tetap (otomatis dari modul aset) 
 
🧮 Struktur Tabel (Data Sumber) 
ID Transaksi 
Tanggal 
Jenis 
Kategori 
Nominal 
Keterangan 
TXN001 
01/01/25 Pendapata
n 
Jasa 
Pinjaman 
2.000.00
0 
Angsuran 
Januari 
TXN002 
05/01/25 Beban 
Gaji 
Pengurus 
3.000.00
0 
Gaji Januari 
 
🔧 Fitur Opsional Selanjutnya 
● Breakdown Laba per Unit Usaha (jika multi-unit) 
● Simulasi Proyeksi Laba Rugi (forecasting) 
● Validasi laporan sebelum RAT (approve oleh bendahara)
 


Laporan Arus Kas Koperasi 
Modul: Dashboard Admin Koperasi 
Fitur: Laporan Arus Kas 
Digunakan Oleh: Pengurus Koperasi (Bendahara, Akuntan, Ketua) 
Tujuan: Menyajikan data masuk dan keluar kas koperasi secara periodik berdasarkan aktivitas 
operasional, investasi, dan pendanaan, agar pengurus bisa mengambil keputusan keuangan 
yang tepat. 
 
🎯 Objective 
Menyediakan laporan arus kas digital yang lengkap dan real-time untuk membantu pengurus: 
● Mengetahui posisi kas koperasi 
● Melacak sumber dan penggunaan kas 
● Menilai likuiditas dan perencanaan keuangan jangka pendek 
 
🔄 Struktur Arus Kas 
Dibagi dalam tiga kategori utama: 
1. Arus Kas dari Aktivitas Operasi 
Aktivitas ini mencerminkan kas masuk dan keluar dari kegiatan utama koperasi, seperti 
pelayanan simpan pinjam atau penjualan barang. 
Jenis akun: 
● Penerimaan kas dari anggota (simpanan wajib, simpanan pokok, simpanan sukarela) 
● Penerimaan kas dari penjualan barang atau jasa 
● Pembayaran kepada pemasok atau mitra usaha 
● Pembayaran gaji karyawan 
● Pembayaran beban operasional (listrik, air, telepon, sewa, dll) 
● Penerimaan atau pembayaran bunga dan dividen (jika diklasifikasikan sebagai operasi) 
● Penerimaan/pembayaran pinjaman jangka pendek operasional 
 
2. Arus Kas dari Aktivitas Investasi 
Aktivitas ini berkaitan dengan perolehan dan pelepasan aset jangka panjang atau investasi 
lainnya. 
Jenis akun: 
● Pembelian/penerimaan hasil penjualan aset tetap (tanah, gedung, kendaraan) 
● Investasi pada unit usaha baru 
● Pembelian/penerimaan hasil investasi jangka panjang 
● Penerimaan dividen dari investasi saham koperasi lain (jika ada) 
 
3. Arus Kas dari Aktivitas Pendanaan 
Aktivitas ini menunjukkan transaksi yang menyebabkan perubahan pada struktur permodalan 
koperasi. 
Jenis akun: 
● Penerimaan modal dari anggota (misal: simpanan pokok awal anggota baru) 


● Pembayaran sisa hasil usaha (SHU) kepada anggota 
● Penerimaan pinjaman jangka panjang 
● Pelunasan pinjaman jangka panjang 
● Penerbitan surat utang (jika koperasi berskala besar) 
● Perubahan modal penyertaan 
4. Ringkasan 
● Total Kas Masuk 
● Total Kas Keluar 
● Kenaikan/Penurunan Kas Bersih 
● Saldo Awal & Akhir 
 
📋 Tampilan Data 
Kategori 
Tanggal 
Uraian 
Masuk (Rp) 
Keluar (Rp) 
Operasiona
l 
01/01/2025 Penerimaan angsuran 
pinjaman 
5.000.000 
- 
Operasiona
l 
02/01/2025 Gaji Pengurus 
- 
3.000.000 
Investasi 
05/01/2025 Pembelian laptop 
- 
8.000.000 
Pendanaan 
07/01/2025 Setoran Simpanan Wajib 
2.000.000 
- 
 
📊 Fitur Utama 
1. 📆 Filter Waktu 
● Rentang filter: [Bulan], [Kuartal], [Tahun], [Custom Date] 
● Default: Bulan berjalan 
2. 📈 Ringkasan Visual 
● Grafik batang: Arus masuk vs keluar 
● Grafik garis: Saldo kas per minggu/bulan 
● Indikator saldo akhir: Hijau (positif), Merah (negatif) 
3. 📁 Riwayat Laporan & Ekspor 
● Semua laporan arus kas tersimpan berdasarkan periode 
● Bisa diekspor dalam: 
○ Excel (.xlsx) 
○ PDF (dengan kop koperasi dan summary) 
4. 🔍 Kategori & Pencarian Transaksi 
● Filter berdasarkan: 
○ Aktivitas: Operasional / Investasi / Pendanaan 
○ Metode: Tunai, Transfer, QRIS, dll 
● Kolom keterangan transaksi 


● Search transaksi berdasarkan kata kunci 
 
✅ Acceptance Criteria 
Skenario 
Kriteria Keberhasilan 
Laporan otomatis tampil 
Berdasarkan transaksi yang tercatat 
Laporan lengkap 3 kategori 
Operasional, Investasi, dan Pendanaan 
Export berhasil 
Format rapi, mudah dibaca, bisa digunakan untuk 
RAT 
Filter bekerja sesuai waktu & jenis 
Hasil sesuai permintaan pengguna 
Grafik tampil otomatis 
Terupdate sesuai data real-time 
 
🧩 Integrasi Data 
● Modul Transaksi Kas 
● Modul Simpanan (pokok, wajib, sukarela) 
● Modul Pinjaman / Pembiayaan 
● Modul Investasi Aset & Unit Usaha 
● Modul Notifikasi (untuk pengingat laporan mingguan) 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Lihat, cetak, ekspor laporan 
Super Admin 
Monitoring lintas koperasi 
Bendahara 
Akses penuh + buat catatan 
internal 
 
📝 Tooltip & Istilah Akuntansi 
● Arus Kas Operasional: Transaksi harian koperasi 
● Arus Kas Investasi: Pembelian dan penjualan aset tetap 
● Arus Kas Pendanaan: Dana dari/ke anggota & pihak ketiga 
● Saldo Awal: Sisa kas dari laporan periode sebelumnya 
● Saldo Akhir: Posisi kas terakhir setelah semua transaksi 
 
💡 Fitur Opsional (Pengembangan Berikutnya) 
● Reminder otomatis ke pengurus jika ada defisit kas 


● Simulasi proyeksi kas 3–6 bulan ke depan 
● Integrasi dengan grafik interaktif (contoh: ChartJS atau ApexCharts)
 


Integrasi Transaksi ke Laporan Keuangan 
Modul Terkait: 
● Transaksi 
 
● Akuntansi (Neraca, Laba Rugi, Arus Kas, Penyusutan) 
 
● Kategori Transaksi 
 
● Aset Tetap 
 
Digunakan oleh: 
● Admin Koperasi (Akuntansi, Keuangan) 
 
● Super Admin (Monitoring lintas koperasi) 
 
 
🎯 Objective 
● Memastikan semua laporan keuangan tersusun otomatis berdasarkan transaksi yang 
tercatat. 
 
● Meminimalisir input manual dalam penyusunan laporan. 
 
● Menjamin konsistensi antara data transaksi dan laporan formal (Neraca, Laba Rugi, 
Arus Kas). 
 
 
🧩 Fitur Utama & Integrasi Modul 
1. Kategori Transaksi Terstruktur (Master Data) 
Setiap transaksi harus memilih kategori dari master kategori_transaksi yang telah 
dipetakan ke: 
● Jenis laporan: Neraca, Laba Rugi, Arus Kas, Aset 
 
● Klasifikasi akun: Aktiva, Kewajiban, Ekuitas, Pendapatan, Beban 
 
● Aktivitas kas: Operasional, Investasi, Pendanaan (khusus untuk Arus Kas) 
 
🔁 Tabel Master: kategori_transaksi Terdapat default 30+ kategori sistem, editable oleh 
super admin. 
 
2. Integrasi ke Neraca 
🔷 Sumber Data: 


● Transaksi → kategori dengan tipe_laporan = neraca 
 
● Modul Aset Tetap (nilai buku) 
 
🔷 Mapping Otomatis: 
Klasifikasi 
Contoh Kategori Transaksi 
Aktiva Lancar 
Kas & Bank, Piutang Anggota, 
Persediaan 
Aktiva Tetap 
Pembelian Aset Tetap, Penyusutan Aset 
Kewajiban 
Hutang Pinjaman, Hutang Usaha 
Ekuitas 
Simpanan Anggota, SHU Belum Dibagi 
 
3. Integrasi ke Laba Rugi 
🔷 Sumber Data: 
● Transaksi → kategori tipe_laporan = laba_rugi 
🔷 Mapping Otomatis: 
Jenis 
Laporan 
Kategori Transaksi 
Pendapatan 
Jasa Pinjaman, Bagi Hasil, Usaha 
Koperasi 
Beban 
Gaji, Utilitas, Administrasi, Penyusutan 
 
4. Integrasi ke Arus Kas 
🔷 Sumber Data: 
● Transaksi → kategori aktivitas_kas harus diisi 
🔷 Mapping ke Tiga Aktivitas: 
Aktivitas 
Contoh Kategori 
Operasional 
Setoran Simpanan, Gaji, Beban Operasional 
Investasi 
Pembelian Aset, Investasi Unit Usaha 
Pendanaan 
Modal Anggota, SHU Dibagikan, Pinjaman 
Bank 
🔁 Kas Masuk / Keluar ditentukan dari jenis transaksi: penerimaan atau pengeluaran 
 
5. Integrasi ke Penyusutan Aset 


🔷 Sumber Data: 
● Modul Aset Tetap 
● Penyusutan bulanan otomatis 
● Transaksi otomatis tercatat: 
○ Kredit ke Akumulasi Penyusutan 
○ Debit ke Beban Penyusutan 
 
✅ Acceptance Criteria 
Skenario 
Hasil yang Diinginkan 
Input transaksi baru dengan kategori 
valid 
Otomatis masuk ke laporan sesuai klasifikasi 
Transaksi dengan kategori Simpanan 
Pokok 
Masuk ke Neraca → Ekuitas 
Pembayaran Gaji 
Masuk ke Laba Rugi (Beban), Arus Kas Operasional 
Beli Laptop 
Masuk ke Neraca (Aktiva Tetap), Arus Kas Investasi 
Penyusutan otomatis dijalankan 
Muncul di Laba Rugi (Beban), mengurangi Nilai 
Buku Aset 
 
🧾 Tabel Relasi Penting 
📁 kategori_transaksi 
Kolom 
Deskripsi 
id 
ID unik kategori 
nama_kategori 
Nama kategori transaksi 
tipe_laporan 
neraca, laba_rugi, arus_kas, aset 
klasifikasi 
aktiva, ekuitas, pendapatan, beban, 
dll. 
aktivitas_kas 
operasional, investasi, pendanaan 
(nullable) 
kode_akun 
Kode akun akuntansi (integrasi laporan 
formal) 
 
🧩 Integrasi Sistem 


Modul Sumber 
Modul Tujuan 
Transaksi 
Neraca, Laba Rugi, Arus Kas 
Aset Tetap 
Neraca (Nilai Buku), Laba Rugi (Beban Penyusutan) 
Pembiayaan 
Syariah 
Arus Kas (Pendanaan / Operasional) 
Simpanan 
Neraca (Ekuitas), Arus Kas Operasional 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Input transaksi, edit kategori (jika diizinkan), lihat laporan 
Super Admin 
Kelola master kategori, verifikasi laporan, lihat lintas koperasi 
 
📝 Catatan 
● Transaksi harus divalidasi terhadap kategori yang sesuai. 
● Jika tidak memiliki kategori_transaksi, sistem akan memberi peringatan. 
● Penyusunan laporan dilakukan real-time setiap transaksi tersimpan. 
📚 Sumber Modul Keuangan & Relasinya 
Modul Asal Data 
Output Akuntansi (Mapping) 
💵 Modul Transaksi 
Neraca (Aktiva, Kewajiban), Arus Kas 
🧾 Modul Simpanan 
Aktiva (Kas/Bank), Ekuitas (Simpanan Anggota) 
📦 Modul Pinjaman 
Piutang Anggota (Aktiva), Kewajiban (utang) jika 
eksternal 
💰 Modul Pembiayaan Syariah 
Piutang / Dana Kelolaan / Bagi Hasil 
📊 Modul Penyusutan Aset 
Akumulasi Penyusutan (Aktiva Tetap) 
📈 Modul SHU & Laba Rugi 
Ekuitas, Laba Ditahan, SHU Berjalan 
🧾 Modul Pembayaran / 
Operasional 
Beban Operasional, Gaji, dll (Laba Rugi & Arus Kas) 
🏢 Modul Pembelian Aset 
Aktiva Tetap 


 
🔧 Daftar Kategori Transaksi (Master List) 
Gunakan dropdown Kategori Transaksi (wajib dipilih saat input transaksi manual / otomatis 
dari sistem): 
🔹 1. Kategori Neraca (Balance Sheet) 
Aktiva (Aset) 
● Kas dan Bank 
● Piutang Anggota 
● Piutang Usaha 
● Persediaan 
● Aset Tetap – Tanah & Bangunan 
● Aset Tetap – Kendaraan 
● Aset Tetap – Peralatan 
● Akumulasi Penyusutan 
Kewajiban (Liabilitas) 
● Hutang Usaha 
● Hutang Pinjaman 
● Kewajiban Karyawan 
● Pinjaman Bank Jangka Panjang 
Ekuitas 
● Simpanan Pokok 
● Simpanan Wajib 
● Simpanan Sukarela 
● Cadangan Umum 
● Laba Ditahan 
● SHU Tahun Berjalan 
 
🔹 2. Kategori Laba Rugi (Profit & Loss) 
Pendapatan 
● Pendapatan Jasa Pinjaman 
● Pendapatan Penjualan (unit usaha) 
● Pendapatan Bagi Hasil (syariah) 
● Pendapatan Lain (hibah, donasi, bunga bank) 
 


Beban 
● Beban Operasional 
● Beban Gaji & Karyawan 
● Beban Administrasi & Bank 
● Beban Penyusutan 
● Beban Lainnya 
 
🔹 3. Kategori Arus Kas 
Disesuaikan dengan klasifikasi: 
● Aktivitas Operasional 
● Aktivitas Investasi 
● Aktivitas Pendanaan 
 
📌 Sistem dapat auto-deteksi jenis arus kas berdasarkan kategori utama. 
 
📥 Contoh Implementasi pada Form Transaksi 
Field 
Contoh Input 
Tanggal Transaksi 
01/06/2025 
Kategori Transaksi 
Beban Operasional 
Sub-Kategori (optional) 
Listrik & Air 
Nominal (Rp) 
1.200.000 
Metode Pembayaran 
Transfer Bank 
Terkait Anggota 
— 
Aset Terkait 
(jika pembelian aset tetap) 
Output: 
Beban Listrik akan masuk ke Laba Rugi & Arus Kas Operasi 
 
🗂 Tabel: kategori_transaksi 
Kolom 
Tipe Data 
Deskripsi 


id 
UUID / INT 
ID unik kategori 
nama_katego
ri 
VARCHAR 
Nama kategori transaksi (mis: Simpanan Wajib, Gaji, 
Penjualan Produk) 
tipe_lapora
n 
ENUM 
neraca, laba_rugi, arus_kas, aset 
klasifikasi 
ENUM 
Misalnya: aktiva, kewajiban, ekuitas, 
pendapatan, beban, dll. 
aktivitas_k
as 
ENUM 
(nullable) 
operasional, investasi, pendanaan (hanya untuk 
arus kas) 
kode_akun 
VARCHAR 
Kode akun akuntansi (untuk laporan formal) 
nama_akun 
VARCHAR 
Nama akun (bisa sama dengan nama_kategori atau lebih 
formal) 
is_default 
BOOLEAN 
Menandai apakah kategori ini bawaan sistem 
is_editable 
BOOLEAN 
Apakah admin bisa ubah nama atau hapus 
created_at 
TIMESTAMP 
Waktu pembuatan 
updated_at 
TIMESTAMP 
Waktu terakhir diperbarui 
 
🔁 Contoh Data kategori_transaksi 
i
d 
nama_kategori 
tipe_lapora
n 
klasifika
si 
aktivitas_k
as 
kode_aku
n 
nama_akun 
1 
Simpanan 
Pokok 
neraca 
ekuitas 
pendanaan 
3010 
Simpanan Pokok 
2 
Gaji Karyawan 
laba_rugi 
beban 
operasional 
5020 
Beban Gaji dan 
Honorarium 
3 
Pembelian 
Laptop 
neraca 
aktiva 
investasi 
1501 
Aset Tetap - 
Peralatan 
4 
Jasa Pinjaman 
laba_rugi 
pendapat
an 
operasional 
4010 
Pendapatan 
Jasa Pinjaman 


5 
Penarikan 
Sukarela 
neraca 
ekuitas 
pendanaan 
3050 
Penarikan 
Simpanan 
Sukarela 
6 
Bagi Hasil 
Mudharabah 
laba_rugi 
pendapat
an 
operasional 
4015 
Pendapatan 
Bagi Hasil 
7 
SHU Dibagikan 
neraca 
ekuitas 
pendanaan 
3090 
Pembayaran 
SHU 
8 
Penyusutan 
Komputer 
aset 
penyusut
an 
— 
1509 
Akumulasi 
Penyusutan 
Komputer 
 
📥 Tabel Relasi: transaksi 
Kolom 
Tipe Data 
Deskripsi 
id_transaksi 
UUID / INT 
ID transaksi 
tanggal 
DATE 
Tanggal transaksi 
id_kategori_transa
ksi 
FK → 
kategori_transaksi.id 
Kategori terkait 
nominal 
DECIMAL 
Nilai transaksi 
jenis_transaksi 
ENUM 
penerimaan / pengeluaran 
keterangan 
TEXT 
Deskripsi / catatan 
metode_pembayaran 
ENUM 
tunai, transfer, qris, va, 
wallet 
id_anggota (opsional) 
UUID 
Relasi ke anggota (nullable) 
bukti_url 
TEXT 
Link ke bukti pembayaran 
(opsional) 
created_by 
UUID 
Admin/staff yang menginput 
created_at 
TIMESTAMP 
Timestamp input 
 


📊 Cara Kerja Auto-Mapping 
1. Admin atau sistem input transaksi dengan memilih kategori_transaksi. 
 
2. Sistem otomatis: 
 
○ Klasifikasikan ke laporan neraca/laba rugi/arus kas/aset 
 
○ Menambahkan nominal ke kolom sesuai laporan 
 
3. Tidak perlu input manual lagi untuk laporan keuangan → semua terhubung dari 
transaksi ke laporan. 
 


Manajemen Notifikasi & Pengingat 
Deskripsi Modul 
Modul ini bertugas memberikan informasi langsung di dalam sistem (in-app) kepada 
anggota dan admin koperasi berupa: 
● Notifikasi waktu nyata (real-time) atas aktivitas penting 
● Pengingat terjadwal terkait kegiatan dan kewajiban 
● Semua berjalan menggunakan sistem internal — tanpa integrasi dengan WhatsApp, 
Email Gateway eksternal, atau pihak ketiga lainnya 
 
🧩 Fitur Utama 
1. Notifikasi untuk Admin 
○ Permohonan anggota baru 
○ Pengajuan pinjaman/pembiayaan 
○ Permintaan penarikan simpanan 
○ RAT terjadwal 
○ Angsuran jatuh tempo hari ini 
2. Notifikasi untuk Anggota 
○ Status pendaftaran keanggotaan 
○ Persetujuan pembiayaan/simpanan 
○ Bagi hasil SHU diterima 
○ Angsuran mendekati jatuh tempo (H-3, H-1, H) 
 
3. Pengingat Terjadwal 
○ Jadwal RAT 
○ Deadline laporan pengurus 
○ Pembayaran angsuran bulanan 
4. Manajemen Notifikasi 
○ Riwayat notifikasi per user 
○ Status (baru, dibaca, diarsip) 
○ Pengaturan jadwal notifikasi otomatis 
○ Pembuatan pengingat manual oleh admin 
 
🎯 Use Cases 
● Admin login dan melihat badge "5 pengajuan baru" dari anggota. 
 
● Anggota menerima notifikasi pembiayaan disetujui pada halaman dashboard. 
 
● Admin membuat pengingat RAT untuk semua anggota muncul 3 hari sebelum jadwal. 
 
● Anggota membuka riwayat notifikasi, melihat status angsuran, pembiayaan, dan 
SHU. 
Epics 
User Story 
US Framework 
Priorit
y 
Acceptance 
Criteria 


Notifikasi 
Anggota 
Sebagai anggota, saya 
ingin diberi notifikasi 
ketika pembiayaan saya 
disetujui agar saya tahu 
status permohonan 
saya. 
Ketika status 
pengajuan berubah 
menjadi “disetujui”, 
sistem langsung kirim 
notifikasi ke anggota. 
High 
Notifikasi muncul 
di dashboard 
anggota maksimal 
1 menit setelah 
persetujuan. 
Pengingat 
Angsuran 
Sebagai anggota, saya 
ingin diingatkan saat 
angsuran jatuh tempo 
agar saya tidak lupa 
membayar. 
Sistem mengirim 
notifikasi otomatis 
H-3, H-1, dan H+1 
jika belum dibayar. 
High 
Notifikasi muncul 
sesuai jadwal dan 
dapat ditandai 
“dibaca”. 
Panel 
Riwayat 
Notifikasi 
Sebagai admin, saya 
ingin melihat riwayat 
notifikasi yang dikirim 
agar saya bisa 
memantau sistem. 
Riwayat notifikasi 
dapat disaring 
berdasarkan tanggal 
dan status. 
Mediu
m 
Admin dapat 
melihat log 12 
bulan terakhir dan 
mengunduh 
sebagai PDF. 
Reminder 
Manual 
Sebagai admin, saya 
ingin membuat 
pengingat RAT secara 
manual agar bisa 
menjangkau semua 
anggota koperasi. 
Admin input judul, 
deskripsi, tanggal, 
lalu sistem kirim ke 
semua anggota pada 
H-3 otomatis. 
Mediu
m 
Semua anggota 
menerima 
notifikasi pada 
waktu yang 
ditentukan admin. 
 
 


Pengaturan Sistem & Akses 
📌 Deskripsi Modul 
Modul ini memungkinkan admin utama untuk mengelola pengaturan sistem aplikasi dan 
mengatur hak akses (permissions) bagi pengguna internal seperti petugas koperasi. 
Fungsinya mencakup: 
● Pengaturan parameter sistem (nama koperasi, alamat, logo, tahun buku) 
 
● Manajemen pengguna internal dan peran (roles) 
 
● Kontrol akses terhadap modul & fitur 
 
● Keamanan akun dan audit trail aktivitas pengguna 
 
 
🧩 Fitur Utama 
1. Pengaturan Umum Sistem 
 
○ Nama Koperasi 
 
○ Alamat & Kontak 
 
○ Tahun Buku Berjalan 
 
○ Upload Logo Koperasi 
 
○ Tanggal tutup buku (untuk kunci pembukuan otomatis) 
 
2. Manajemen Pengguna Internal 
 
○ Tambah/Edit/Hapus pengguna admin, staf koperasi 
 
○ Reset password pengguna internal 
 
○ Status akun (aktif/nonaktif) 
 
3. Role & Permission Management 
 
○ Role bawaan: Super Admin, Admin Keanggotaan, Admin Keuangan, Viewer 
 
○ Role kustom: dapat ditambah sesuai kebutuhan koperasi 
 
○ Set modul mana saja yang dapat diakses per role 
 


4. Audit Log (Riwayat Aktivitas Pengguna) 
 
○ Melacak siapa melakukan apa dan kapan (ex: "Admin A menghapus pengajuan 
pinjaman pada 25/04/2025 14:32 WIB") 
 
○ Dapat di filter per pengguna, modul, atau tanggal 
 
 
🎯 Use Cases 
● Super Admin mengatur nama koperasi dan tahun buku dari halaman pengaturan. 
 
● Admin Keuangan diatur hanya bisa mengakses Modul Simpanan dan Pembiayaan. 
 
● Admin reset password untuk petugas lapangan yang lupa akun. 
 
● Admin memeriksa audit trail untuk melihat siapa yang menyetujui pinjaman besar 
minggu lalu. 
Epics 
User Story 
US Framework 
Priorit
y 
Acceptance 
Criteria 
Sistem 
Identitas 
Koperasi 
Sebagai admin utama, 
saya ingin mengatur 
nama dan tahun buku 
agar tampil di semua 
laporan resmi 
koperasi. 
Saat admin input nama 
koperasi dan tahun 
buku, sistem 
menyimpan dan 
menampilkannya di 
semua laporan. 
High 
Nama & tahun 
buku tersimpan, 
tampil otomatis di 
header laporan 
dan dashboard. 
Role-based 
Access 
Control 
Sebagai pengurus, 
saya ingin membatasi 
akses staf hanya ke 
modul yang relevan. 
Saat membuat akun, 
admin bisa memilih role 
dan hak akses yang 
sesuai. 
High 
Pengguna hanya 
bisa mengakses 
modul sesuai 
rolenya, sistem 
menolak akses 
tidak sah. 
Audit Trail 
Sebagai super admin, 
saya ingin tahu siapa 
yang mengubah data 
penting untuk 
memastikan 
akuntabilitas. 
Semua aksi pengguna 
dicatat dan bisa dicari 
berdasarkan filter. 
High 
Log aktivitas 
tersedia per 
pengguna, 
tanggal, dan jenis 
aksi. 
Manajemen 
Akun 
Internal 
Sebagai super admin, 
saya ingin menambah 
Admin dapat buat akun, 
reset password, dan 
ubah status. 
Mediu
m 
Akun aktif hanya 
bisa login, akun 


atau menonaktifkan 
akun petugas. 
nonaktif diblokir 
otomatis. 
🔐 Keamanan & Akses 
● Super Admin memiliki akses penuh ke semua modul dan pengaturan. 
 
● Role “Viewer” hanya bisa membaca data tanpa bisa mengubah apa pun. 
 
● Seluruh perubahan pengaturan dan akses tercatat di log.
 


Fitur Tagihan & Produk Add-Ons (Untuk Pengurus Koperasi) 
Produk: Dashboard Koperasi (Client Side) 
Fitur: Tagihan & Produk Tambahan 
Peran Pengguna: Pengurus Koperasi (Admin Utama) 
Tujuan: Memudahkan koperasi untuk: 
● Melihat dan mengelola tagihan langganan 
● Mengetahui masa berlaku layanan 
● Menjelajahi dan membeli add-on/produk tambahan dari vendor SaaS 
 
🎯 Objective 
1. Transparansi atas tagihan aktif dan masa aktif layanan koperasi. 
2. Mendorong koperasi mengadopsi fitur-fitur tambahan sesuai kebutuhan. 
3. Menyediakan mekanisme pembayaran, upgrade/downgrade layanan, dan reminder 
otomatis. 
 
📌 Fitur Utama 
1. 📄 Halaman Tagihan Aktif 
● Tabel Daftar Tagihan dengan kolom: 
○ Nama Paket 
○ Nomor Invoice 
○ Tanggal Aktif 
○ Tanggal Jatuh Tempo 
○ Status Pembayaran: Lunas / Belum Dibayar / Auto-Pause 
○ Aksi: [💳 Bayar Sekarang], [🧾 Lihat Tagihan] 
● Informasi Tambahan: 
○ Tersedia notifikasi H-30, H-7, H-1 sebelum jatuh tempo 
○ Jika belum dibayar → sistem auto-pause fitur terkait 
○ Bisa upload bukti bayar manual jika offline 
2. 📦 Produk Add-Ons 
● Daftar produk tambahan yang bisa dibeli oleh koperasi: 
○ Modul Akuntansi (Neraca, Laba Rugi, Arus Kas, Penyusutan) 
○ Manajemen Aset 
○ Digital RAT / Voting 
○ Notifikasi SMS / Email Gateway 
○ Custom Domain & Branding 
○ API Integrasi ke Bank / Lembaga Keuangan 
● Tampilan: 
○ Kartu produk berisi: 
■ Nama Add-On 
■ Deskripsi Singkat 
■ Harga / tahun 
■ [ℹ Lihat Detail] [🛒 Beli Sekarang] 
3. 📆 Reminder & Status 
● Status layanan aktif: menampilkan masa berlaku tiap fitur 


● Notifikasi & reminder internal: 
○ Aktif otomatis saat fitur mendekati habis masa aktifnya 
○ Tombol “Perpanjang” atau “Upgrade” 
4. 🧾 Tagihan Historis & Bukti Pembayaran 
● Tabel riwayat: 
○ Nomor Invoice 
○ Paket / Add-on 
○ Jumlah Dibayar 
○ Tanggal Pembayaran 
○ Bukti Transfer (jika manual) 
○ Status: Lunas / Tertunda 
● Tombol: [📁 Unduh Invoice PDF], [📤 Upload Bukti Transfer] 
 
✅ Acceptance Criteria 
Fitur 
Kriteria Keberhasilan 
Tagihan Aktif 
Menampilkan semua tagihan yang sedang berjalan 
Reminder 
Notifikasi otomatis muncul H-30, H-7, H-1 sebelum jatuh tempo 
Pembayaran 
Admin bisa klik "Bayar" dan diarahkan ke gateway / upload bukti 
Auto Pause 
Layanan dinonaktifkan otomatis jika lewat jatuh tempo tanpa bayar 
Pembelian 
Add-Ons 
Add-on baru muncul di dashboard setelah dibeli 
Riwayat Tagihan 
Riwayat lengkap dan bisa diekspor (PDF/Excel) 
 
📐 Struktur UI (komponen halaman) 
Halaman: 📋 Tagihan & Langganan 
● Section 1: Status Langganan Saat Ini (badge status + masa aktif) 
● Section 2: Tabel Tagihan Aktif 
● Section 3: Produk Add-On Tersedia 
● Section 4: Riwayat Pembayaran & Bukti Bayar 
 
🔐 Hak Akses 
Role 
Akses 
Admin Koperasi 
Full akses fitur tagihan & pembelian add-on 
Super Admin 
Monitoring seluruh koperasi 


Viewer 
Hanya melihat status aktif, tidak bisa beli atau 
bayar 
 
📝 Tooltip & Istilah 
● Auto Pause: Sistem otomatis menonaktifkan fitur saat tagihan belum dibayar. 
● Add-On: Fitur tambahan berbayar yang bisa dibeli secara terpisah dari paket utama. 
● Masa Aktif: Periode layanan aktif hingga tanggal jatuh tempo. 
 
📎 Integrasi Sistem 
● Modul Tagihan & Paket Super Admin 
● Gateway Pembayaran / Validasi Manual 
● Modul Aktivasi Layanan (untuk mematikan/menyalakan layanan sesuai pembayaran) 
 


Live Chat Support & Billing 
🎯 Objective 
Memudahkan Pengurus Koperasi dalam mengajukan pertanyaan teknis, permintaan bantuan 
teknis, maupun pertanyaan tagihan secara langsung ke tim vendor melalui dashboard, tanpa 
perlu menggunakan kanal eksternal seperti WhatsApp atau email. 
 
🖥 Modul & Letak 
● Modul: Bantuan & Dukungan 
● Lokasi: Menu Sidebar → “💬 Dukungan” 
● Halaman: “Kirim Tiket” → diperluas dengan fitur live chat real-time 
 
🧠 Fitur Utama 
1. 🧾 Form Kirim Tiket (Seperti Gambar Referensi) 
● Dropdown Departemen: Technical Support / Billing / Akun & Akses 
● Dropdown Prioritas: Rendah, Sedang, Tinggi 
● Dropdown Produk/Layanan: (Opsional – Akuntansi, Simpanan, Pembiayaan, dll.) 
● Judul & Pesan: Text field & rich text editor 
● Lampiran: Tombol “Tambah Lampiran” 
● Tombol Aksi: Kirim Tiket & Reset Formulir 
2. 💬 Live Chat Sidebar (Real-time Chat Interface) 
● Dapat diakses dari tombol [💬 Buka Live Chat] di pojok kanan atas halaman “Kirim 
Tiket” 
● Fitur Chat: 
○ Balasan real-time dari tim vendor 
○ Riwayat percakapan tersimpan 
○ Notifikasi suara & visual saat ada balasan 
○ Upload file / gambar langsung via chat 
○ Tampilkan nama agent yang sedang melayani (misal: “Dian - Billing Support”) 
○ Waktu tanggapan estimasi (“Rata-rata balasan 5 menit”) 
● Mode Offline: 
○ Jika tidak ada agent online, pengguna tetap bisa kirim pesan 
○ Sistem otomatis konversi ke “Tiket” dan masuk ke daftar tiket aktif 
3. 🗃 Riwayat Tiket & Chat 
● Halaman “Riwayat Dukungan”: 
○ Tampilkan daftar semua tiket & chat sebelumnya 
○ Status: [Menunggu Balasan], [Dibalas], [Ditutup] 
○ Aksi: [Lihat Detail] untuk membuka kembali percakapan 
 
✅ Acceptance Criteria 
Fitur 
Kriteria 


Form Tiket 
Data lengkap tersimpan & masuk ke sistem support 
Live Chat 
Balasan muncul real-time, tidak perlu refresh 
Notifikasi 
Muncul di dashboard jika ada balasan dari tim 
Offline 
Sistem auto-konversi pesan ke tiket jika agent offline 
Upload File 
Pengguna dapat mengirim file pendukung dalam tiket & chat 
Riwayat 
Admin bisa melihat & membuka kembali riwayat percakapan 
 
🔐 Role & Hak Akses 
Role 
Akses 
Pengurus Koperasi 
Full akses: kirim tiket, buka chat, upload file 
Super Admin 
Monitoring semua riwayat percakapan 
Tim Vendor (Admin Support) 
Akses chat dan tiket masuk 
 
🔔 Notifikasi 
● Pengurus menerima notifikasi: 
○ Saat tiket dijawab 
○ Jika chat dibalas agent 
● Vendor menerima notifikasi saat ada tiket/chat baru dari koperasi 
 
📦 Integrasi 
● Sistem Ticketing Internal 
● Module Billing → bisa auto-tag chat sebagai “Tagihan” 
● Sistem Notifikasi Internal → digunakan untuk trigger alert 
 
📝 Tooltip 
● Prioritas: "Pilih prioritas berdasarkan urgensi masalah Anda." 
● Departemen: "Pilih tujuan pengiriman pesan: Tim Teknis atau Tim Tagihan." 
● Produk/Layanan: "Pilih modul koperasi yang terkait dengan masalah Anda." 
 


Kustomisasi Tema Warna & Layout Halaman Depan 
Modul: Pengaturan Visual 
Pengguna: Super Admin 
Tujuan: Memungkinkan Super Admin melakukan personalisasi tampilan PWA koperasi sesuai 
identitas visual dan preferensi koperasi masing-masing. 
 
🎯 Objective 
● Menyediakan fleksibilitas branding dan visual bagi koperasi pengguna SaaS. 
● Memastikan seluruh bagian PWA (dashboard dan landing page) bisa dikustomisasi 
tanpa mengganggu konten atau fungsionalitas utama. 
● Meningkatkan profesionalisme dan daya tarik visual koperasi terhadap 
anggota/pengunjung. 
 
🧩 Fitur Utama 
1. 🎨 Kustomisasi Warna Tema (Dashboard & PWA) 
● Jumlah Opsi Warna: 9 warna tema (misalnya: Biru Default, Merah Maroon, Hijau Tua, 
Kuning Emas, Abu-abu Gelap, Ungu, Navy, Teal, Cokelat) 
● Sistem menggunakan skema warna global yang memengaruhi: 
○ Navigasi utama 
○ Tombol aksi utama 
○ Warna teks judul & ikon utama 
○ Link aktif 
● Fitur: 
○ Dropdown atau grid selector untuk memilih warna 
○ ✅ Live preview: menampilkan simulasi antarmuka sebelum disimpan 
○ Tombol Simpan Tema 
○ Warna yang dipilih tersimpan di Global UI Setting DB 
 
2. 📐 Pemilihan Layout Halaman Depan (Landing Page) 
● Jumlah Layout: 10 pilihan layout 
○ Klasik: Satu halaman statik dengan Hero CTA dan profil koperasi 
○ Modern: Scroll animasi dengan efek parallax, ilustrasi 
○ Minimalis: Clean, CTA sentral, warna dominan 
○ Gallery: Fokus pada galeri produk/kegiatan 
○ Form-Aware: Landing page dengan prioritas form pendaftaran 
○ Dll... 
● Fitur: 
○ Carousel pratinjau visual dari layout 
○ Pilih layout → preview aktif → tombol Terapkan Layout 
○ Sistem tidak menghapus konten seperti gambar, teks, atau form 
○ Layout dapat diganti sewaktu-waktu 
 


✅ Acceptance Criteria (AC) 
Epic 
User Story 
Framework 
Priority 
Acceptance Criteria 
Kustomisasi 
Tema 
Sebagai Super Admin, saya 
ingin mengubah warna tema 
PWA agar sesuai identitas 
koperasi. 
US01 
Medium 
Warna diterapkan 
langsung setelah klik 
simpan dan berlaku global. 
Data tersimpan di DB 
Pemilihan 
Layout 
Sebagai Super Admin, saya 
ingin memilih layout landing 
page koperasi agar cocok 
dengan gaya komunikasi kami. 
US02 
Medium 
Layout baru langsung aktif 
setelah disimpan, tanpa 
menghapus konten 
sebelumnya 
 
🛠 Backend Requirement 
● Tabel: settings_ui 
○ theme_color (string) 
○ layout_id (int) 
○ updated_by (user_id) 
○ updated_at (timestamp) 
● Semua perubahan harus dicatat dalam activity_log untuk pelacakan audit. 
 
🔐 Role & Akses 
Role 
Akses 
Super Admin 
Full akses untuk ubah tema & layout 
Admin Koperasi 
Hanya bisa melihat pratinjau tema (opsional) 
Viewer 
Tidak ada akses 
 
📝 Tooltip Istilah UI 
● Tema Warna: Palet visual yang digunakan untuk tombol, menu, dan komponen UI di 
seluruh sistem 
● Layout: Struktur tampilan halaman depan website koperasi 
● Live Preview: Fitur untuk melihat simulasi tampilan sebelum menyimpan perubahan


Landing Page 
Deskripsi Modul 
Modul ini memungkinkan Admin Koperasi untuk mengelola konten dinamis pada halaman 
landing page koperasi tanpa harus mengubah langsung kode program. Dengan fitur ini, admin 
dapat memperbarui teks, gambar, link, dan CTA melalui dashboard. 
🎯 Tujuan 
● Memberi fleksibilitas bagi koperasi untuk memperbarui informasi publik secara mandiri. 
● Mempercepat proses pembaruan konten (visi, misi, layanan, testimoni, form 
pendaftaran). 
● Menyediakan pengalaman frontend yang tetap rapi meski konten berubah. 
🧩 Fitur Utama 
1. Editor Konten Header & Hero Section 
○ Input Logo (upload) 
○ Menu Navigasi (editable label & urutan) 
○ Headline & Subheadline 
○ Gambar Hero (upload) 
○ CTA Button Label & Link 
2. Editor Konten Tentang Kami 
○ Field Visi & Misi (textarea) 
○ Sejarah Singkat (textarea) 
○ Struktur Organisasi (upload gambar / tabel) 
3. Manajemen Layanan 
○ Tambah/Ubah jenis layanan: [Simpanan, Pembiayaan, Unit Usaha] 
○ Deskripsi masing-masing layanan (rich text) 
○ Ikon layanan (upload) 
4. Manajemen Manfaat & Testimoni 
○ Tambah/Ubah poin manfaat koperasi 
○ Tambah Testimoni Anggota 
■ Nama Anggota 
■ Foto (opsional) 
■ Kutipan singkat 
■ Status Tampilkan/Sembunyikan 
5. Form Pendaftaran 
○ Aktifkan/nonaktifkan form 
○ Konfigurasi field (wajib/tidak) 
○ Template pesan konfirmasi otomatis 
○ Alamat tujuan data form (email / CRM internal) 
6. Kontak & Footer 
○ Alamat lengkap 
○ Nomor telepon / WA 
○ Link media sosial 
○ Teks copyright 
7. Pratinjau & Simpan Perubahan 


○ Preview langsung tampilan landing page 
○ Tombol “Simpan & Terapkan” 
○ Riwayat revisi (opsional) 
🎯 Use Cases 
1. Admin mengubah headline dan gambar hero karena ada kampanye baru. 
2. Admin menambahkan testimoni baru dari anggota aktif. 
3. Admin mengganti CTA link untuk diarahkan ke Google Form saat sistem form 
maintenance. 
4. Admin menonaktifkan formulir pendaftaran sementara waktu. 
5. Admin memperbarui daftar layanan koperasi dengan unit usaha baru. 
✅ Requirements Table 
Epics 
User Story 
US Framework 
Priority 
Acceptance Criteria 
Kontrol 
Konten 
Landing Page 
Sebagai admin, saya 
ingin mengubah teks 
dan gambar landing 
page agar bisa 
menyesuaikan dengan 
promosi terbaru. 
Saat admin menyimpan 
perubahan pada editor 
konten, sistem 
langsung menampilkan 
pembaruan di halaman 
publik. 
Highest 
Perubahan disimpan 
dan bisa dilihat di 
landing page <5 detik. 
Manajemen 
Testimoni 
Sebagai admin, saya 
ingin menambah 
testimoni dari anggota 
agar landing page lebih 
kredibel. 
Saat admin input nama 
& kutipan lalu klik 
simpan, testimoni 
tampil dalam carousel 
testimoni. 
Medium 
Testimoni baru 
muncul setelah 
refresh landing page, 
bisa disembunyikan 
dengan toggle. 
Kontrol Form 
Pendaftaran 
Sebagai admin, saya 
ingin bisa 
menonaktifkan form 
pendaftaran sementara 
agar tidak ada 
pendaftaran masuk saat 
maintenance. 
Admin klik toggle 
"nonaktifkan form", 
maka form 
disembunyikan dari 
tampilan publik. 
High 
Landing page tidak 
menampilkan form, 
dan link CTA 
diarahkan ke halaman 
alternatif (jika diset). 
Preview 
Perubahan 
Sebelum 
Diterapkan 
Sebagai admin, saya 
ingin melihat pratinjau 
landing page sebelum 
menyimpan agar yakin 
tampilannya sudah 
sesuai. 
Setelah mengubah 
konten, admin klik 
“Preview” dan melihat 
tampilan seperti 
pengguna publik. 
Medium 
Sistem menampilkan 
halaman preview 
dengan konten 
terbaru yang belum 
disimpan. 
🔐 Keamanan & Akses 
● Hanya admin dengan role “Super Admin” atau “Editor Landing Page” yang dapat 
mengubah isi. 
● Semua perubahan tercatat dengan timestamp dan user ID yang melakukan update. 


🧾 Catatan Tambahan 
● Perubahan konten tidak akan mengubah struktur teknis UI frontend. 
● Fitur ini tidak mengatur desain atau CSS secara bebas, hanya pengaturan konten yang 
bersifat dinamis. 
● Perubahan ditampilkan menggunakan cache control agar tetap cepat saat dibuka 
banyak pengunjung.
 


Automasi Penilaian Resiko 
🎯 Objective 
Menyediakan sistem otomasi penilaian risiko digital dalam proses pembiayaan syariah, yang: 
● Menilai pengajuan pembiayaan secara objektif dan cepat 
● Menggunakan bobot dan kriteria risiko yang dapat dikonfigurasi 
● Menyediakan dashboard admin untuk memodifikasi soal, jawaban, skor, dan tindakan 
sistem 
🔧 Fitur Utama 
1. Dashboard Admin – Risk Assessment Manager 
Admin dapat: 
● Menambah / menghapus / mengedit aspek penilaian 
● Menambah / menghapus / mengedit jawaban dan skor 
● Mengubah bobot maksimum per aspek 
● Mengubah tindakan otomatis berdasarkan skor akhir 
Contoh Tabel Konfigurasi: 
Aspek 
Pertanyaan 
Bobot 
Maks 
Status Keanggotaan 
Berapa lama anggota terdaftar di koperasi dan status 
aktifnya? 
20 
Riwayat Pembiayaan 
Bagaimana riwayat pembiayaan sebelumnya? 
20 
Kemampuan 
Keuangan 
Berapa perbandingan cicilan dengan pendapatan per 
bulan? 
25 
Tujuan Pembiayaan 
Untuk apa pembiayaan ini digunakan? 
15 
Kelengkapan 
Dokumen 
Dokumen apa saja yang sudah diunggah? 
20 
2. Editor Jawaban per Aspek 
Admin dapat mengatur opsi jawaban dan skor per pertanyaan: 
Aspek 
Jawaban 
Skor 
Status Keanggotaan 
< 6 bulan 
2 
Status Keanggotaan 
6–12 bulan 
5 
Status Keanggotaan 
> 12 bulan 
10 
Status Keanggotaan 
Anggota Aktif 
10 
Status Keanggotaan 
Tidak Aktif 
0 


... 
... 
... 
 
3. Tabel Kategori Risiko dan Tindakan Sistem 
Admin dapat mengatur klasifikasi berdasarkan skor akhir: 
Skor 
Minimum 
Skor 
Maksimum 
Kategori 
Risiko 
Tindakan Sistem 
85 
100 
Rendah Risiko 
Disetujui Otomatis 
65 
84 
Menengah 
Risiko 
Masuk Review Manual oleh Admin 
<65 
64 
Tinggi Risiko 
Ditolak Otomatis atau diminta revisi 
anggota 
Default bisa digunakan sebagai baseline, admin dapat mengeditnya. 
 
✅ Acceptance Criteria 
Fitur 
Kriteria Terpenuhi 
Admin dapat menambah 
aspek 
Aspek baru ditambahkan dan muncul di form pengajuan 
pembiayaan anggota 
Admin dapat edit bobot dan 
skor 
Semua perubahan langsung diterapkan dalam hitungan skor 
otomatis 
Skor dihitung otomatis 
Berdasarkan total nilai dari semua jawaban yang dipilih 
Tindakan sistem mengikuti 
skor 
Jika skor ≥85 → langsung disetujui, jika <65 → langsung 
ditolak 
Admin dapat ubah tindakan 
sistem 
Tindakan bisa disesuaikan dengan kondisi koperasi atau per 
kebijakan terbaru 
 
🧩 Struktur Data 
Table: assessment_aspek 
Field 
Type 
Description 
id 
UUID 
ID unik aspek 
nama_aspek 
VARCHAR 
Misal: Status Keanggotaan 
bobot_max 
INTEGER 
Bobot maksimum aspek 


urutan 
INTEGER 
Posisi tampil 
 
Table: assessment_jawaban 
Field 
Type 
Description 
id 
UUID 
ID unik jawaban 
aspek_id 
UUID 
FK ke assessment_aspek 
jawaban 
TEXT 
Isi jawaban 
skor 
INTEGER 
Skor jika jawaban dipilih 
 
Table: assessment_kategori 
Field 
Type 
Description 
id 
UUID 
ID unik kategori 
min_skor 
INTEGER 
Rentang bawah 
max_skor 
INTEGER 
Rentang atas 
label 
TEXT 
Misal: "Tinggi Risiko" 
tindakan_sistem 
TEXT 
"Disetujui", "Masuk Review", "Ditolak" 
 
📊 Perhitungan Skor Otomatis (Di Sistem) 
total_skor = SUM(semua_jawaban_terpilih) 
kategori = FIND(assessment_kategori WHERE min_skor <= total_skor <= 
max_skor) 
🎨 UI/UX Komponen Utama 
● Editor Form Aspek Penilaian 
 ➤ Tambah/Edit/Hapus aspek 
 ➤ Set bobot max 
 
● Editor Jawaban per Aspek 
 ➤ Tambah/Edit/Hapus jawaban 
 ➤ Atur skor 
 


● Editor Kategori Risiko 
 ➤ Tentukan skor minimum–maksimum 
 ➤ Atur tindakan sistem otomatis 
🧪 Contoh Kasus Penggunaan 
1. Admin ingin menambahkan aspek baru: "Sumber Dana Cicilan" → Tambah di dashboard 
2. Admin ingin ubah skor “Tujuan Konsumtif” dari 5 menjadi 3 → Edit skor 
3. Sistem mendeteksi skor akhir = 89 → Langsung disetujui otomatis 
4. Skor akhir pengajuan anggota lain = 70 → Masuk halaman review admin 
5. Skor akhir pengajuan ke-3 = 58 → Ditolak sistem secara otomatis 
 
