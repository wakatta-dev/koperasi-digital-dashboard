## Modul Dashboard Utama Admin

**Product Name:** Modul Dashboard Utama Admin 

**Product Manager:** Yosh Wakatta 

**Shipping Date:** 30 September 2025 

**Stage:** Development 

**Status:** In Refinement 

**Teams:** Designer, Developer (\[BE\], \[FE\]), QA Tester 

1\. Description

Dashboard Utama Admin adalah halaman pertama yang dilihat administrator vendor setelah berhasil login ke dalam Dasbor Billing. Halaman ini berfungsi sebagai pusat informasi visual yang menyajikan ringkasan data dan metrik kinerja terpenting dari seluruh bisnis klien secara

*real-time*. Tujuannya adalah untuk memberikan gambaran kondisi bisnis secara keseluruhan "at-a-glance" (sekali lihat), memungkinkan administrator mengambil keputusan cepat, dan mengakses modul lain dengan lebih efisien.

2\. Objectives & Success Metrics

Objectives:

* **Menyediakan "Health Check" Bisnis Cepat:** Memungkinkan pemilik bisnis memahami kondisi usahanya dalam waktu kurang dari 30 detik.  
* **Meningkatkan Keterlibatan Pengguna:** Mendorong pengguna untuk menjelajahi modul lain melalui pintasan dan notifikasi yang relevan.  
* **Mendorong Pengambilan Keputusan Berbasis Data:** Menyajikan data kunci yang dapat memicu tindakan, seperti mengisi ulang stok atau menindaklanjuti pesanan.

**Success Metrics:**

* **Engagement Rate:** Tingginya *Click-Through Rate* (CTR) pada widget notifikasi atau pintasan menuju modul lain (\>30%).  
* **User Retention:** Tingginya frekuensi *login* harian oleh pengguna untuk memeriksa dasbor.  
* **Qualitative Feedback:** Mendapatkan ulasan positif dari minimal 80% pengguna yang diwawancarai, yang menyatakan bahwa dasbor membantu mereka memonitor bisnis secara efisien.

3\. Features

Dasbor akan terdiri dari beberapa widget interaktif dalam tata letak (

*layout*) berbasis *grid* yang responsif.

1. **Widget Ringkasan Performa Utama**  
   * Menampilkan 3-4 metrik kunci dalam bentuk  
      *Key Performance Indicator* (KPI) Cards.  
   * Contoh: "Penjualan Hari Ini", "Total Transaksi Hari Ini", "Pesanan Online Baru".  
   * Setiap kartu menampilkan angka besar dan perbandingan dengan periode sebelumnya (misal: "15% dari kemarin").  
2. **Widget Grafik Penjualan Mingguan**  
   * Grafik batang (  
     *bar chart*) sederhana yang menampilkan total pendapatan selama 7 hari terakhir.  
   * Memberikan visualisasi tren penjualan jangka pendek.  
   * Terdapat tautan "Lihat Laporan Lengkap" yang mengarah ke modul Laporan.  
3. **Widget Notifikasi & Tindakan Cepat (Actionable Alerts)**  
   * Area dinamis yang menampilkan pemberitahuan penting. Contoh notifikasi:  
     * "Anda memiliki 3 pesanan online baru yang perlu diproses." (Link ke Manajemen Pesanan)  
     * "5 produk akan segera habis." (Link ke Manajemen Inventaris)   
     * (Untuk Koperasi) "Ada 10 angsuran yang jatuh tempo hari ini." (Link ke Manajemen Pinjaman)   
4. **Widget Produk Terlaris**  
   * Menampilkan daftar 5 produk dengan penjualan tertinggi dalam 30 hari terakhir.  
   * Membantu pemilik bisnis dalam strategi stok dan promosi.  
5. **Widget Pintasan (Shortcuts)**  
   * Tombol (  
     *CTA Buttons*) untuk aksi yang paling sering dilakukan.  
   * Contoh: "+ Penjualan Baru (POS)", "+ Tambah Produk", "+ Buat Pengeluaran".

**4\. Use Case**

1. **Pemilik Toko Bangunan Melakukan Pengecekan Pagi**  
   * **Aktor:** Pemilik Toko.  
   * **Skenario:** Pemilik toko login di pagi hari. Dia langsung melihat widget Ringkasan Performa dan Notifikasi.  
   * **Hasil:** Dia mengetahui total penjualan kemarin, melihat ada 2 pesanan online baru yang masuk semalam, dan mendapat notifikasi bahwa stok semen tersisa sedikit. Dia langsung mengklik notifikasi stok untuk merencanakan pembelian.  
2. **Admin Koperasi Memonitor Aktivitas Harian**  
   * **Aktor:** Admin Koperasi.  
   * **Skenario:** Admin membuka dashboard untuk memantau aktivitas. Dia melihat grafik penjualan dan notifikasi anggota.  
   * **Hasil:** Admin melihat bahwa unit usaha toko koperasi sedang ramai. Dia juga melihat notifikasi pendaftaran anggota baru dan langsung mengklik untuk memprosesnya.

**5\. Dependencies**

* **API Endpoints:** Ketersediaan API dari tim *Backend* untuk menyediakan data teragregasi (penjualan, stok, pesanan).  
* **UI/UX Design:** Desain final dari UI/UX Designer untuk setiap widget dan keseluruhan *layout* dasbor.  
* **Data Source:** Modul lain (Inventaris, POS, Marketplace, Keuangan) harus sudah fungsional untuk menyediakan data yang akurat ke dasbor.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Visualisasi Kinerja Bisnis  | Sebagai pemilik bisnis, saya ingin melihat ringkasan metrik utama di dashboard sehingga saya bisa mengetahui kondisi bisnis saya dengan cepat. | Sebagai pemilik bisnis, ketika saya membuka dashboard, maka saya akan melihat total penjualan, jumlah transaksi, dan pesanan baru hari ini. | Highest  | \- Widget menampilkan data "Penjualan Hari Ini" dengan benar.  \- Widget menampilkan "Total Transaksi Hari Ini"  \- Data yang ditampilkan sesuai dengan data aktual dari modul terkait  \- Data dapat diperbarui secara otomatis atau dengan tombol refresh. |
| Notifikasi Proaktif  | Sebagai pengguna, saya ingin mendapatkan notifikasi penting di dashboard yang menipis atau ada pesanan online baru, sehingga saya bisa segera mengambil tindakan yang diperlukan. | Sebagai pengguna, ketika ada stok produk yang menipis atau ada pesanan online baru, maka saya akan melihat notifikasi di dashboard. | Highest 52 | \- Notifikasi muncul jika jumlah stok produk kurang dari atau sama dengan batas minimum.  \- Notifikasi muncul jika ada pesanan dengan status "Baru" \- Setiap notifikasi memiliki link yang mengarahkan ke halaman relevan (detail produk atau manajemen pesanan) \- Notifikasi akan hilang setelah tindakan dilakukan (misal: pesanan diproses). |
| Akses Cepat ke Fitur Lain  | Sebagai pengguna, saya ingin ada tombol pintasan untuk fitur yang sering saya pakai sehingga alur kerja saya menjadi lebih efisien. | Sebagai pengguna, ketika saya berada di dashboard, maka saya bisa langsung menekan tombol untuk membuat penjualan baru (POS). | High  | \- Terdapat tombol/CTA "+ Penjualan Baru (POS)" \- Menekan tombol tersebut akan langsung mengarahkan pengguna ke halaman kasir (POS) \- Tombol pintasan lain (seperti "+ Tambah Produk") berfungsi sesuai tujuannya. |

## Modul Manajemen Akun & Pengguna

Product Name: Modul Manajemen Akun & Pengguna (PWA SaaS)

Product Manager: Yosh Wakatta

Shipping Date: 31 Agustus 2025

Stage: Development

Status: In Progress

Teams: Designer, Developer (\[BE\], \[FE\]), QA Tester

1\. Description

Modul Manajemen Akun & Pengguna adalah gerbang utama bagi seluruh klien untuk masuk dan menggunakan PWA. Modul ini mencakup alur kerja krusial mulai dari pendaftaran bisnis baru (onboarding), autentikasi pengguna yang aman (login), pengelolaan informasi dasar bisnis (profil bisnis), hingga pengaturan hak akses untuk setiap anggota tim (manajemen peran). Keamanan, keandalan, dan kemudahan penggunaan adalah pilar utama dari modul ini karena menjadi fondasi bagi seluruh ekosistem aplikasi.

2\. Objectives & Success Metrics

Objectives:

* Menyediakan Onboarding yang Mulus & Aman: Memastikan klien baru dapat mendaftarkan bisnisnya dengan mudah, cepat, dan dengan verifikasi yang valid.  
* Menjamin Akses yang Aman & Andal: Memberikan proses login yang terproteksi dan mudah bagi pengguna terdaftar, termasuk penanganan lupa password.  
* Memberdayakan Klien untuk Mengelola Tim: Memungkinkan pemilik bisnis (Admin) untuk mendelegasikan tugas dengan aman dengan cara memberikan hak akses yang berbeda kepada anggotanya.

**Success Metrics:**

* Registration Funnel Conversion: Tingkat penyelesaian registrasi dari halaman pendaftaran hingga verifikasi email berhasil mencapai \> 85%.  
* Security & Reliability: Angka keberhasilan login \> 99%. Tidak ada insiden keamanan terkait kredensial pengguna pada 3 bulan pertama pasca-rilis.  
* Feature Adoption: Minimal 50% klien yang memiliki lebih dari satu karyawan aktif menggunakan fitur penambahan peran pengguna (misal: menambah Kasir) dalam 2 bulan pertama.

3\. Features

Fitur dibagi menjadi empat komponen utama:

1. **Alur Registrasi Klien Baru**  
   * Formulir pendaftaran dengan field: Nama Lengkap Pemilik, Nama Bisnis, Jenis Bisnis (Dropdown: Koperasi, BUMDes, UMKM Toko Bangunan), Email, Nomor WhatsApp, dan Password.  
   * Validasi kekuatan password secara real-time (misal: minimal 8 karakter, kombinasi huruf besar, kecil, dan angka).  
   * Mekanisme verifikasi email: Sistem mengirimkan link unik atau OTP ke email terdaftar yang harus dikonfirmasi untuk mengaktifkan akun.  
2. **Alur Login & Autentikasi**  
   * Halaman login dengan field: Email dan Password.  
   * Fitur "Lupa Password?" yang mengirimkan link reset password ke email pengguna.  
   * Fitur "Ingat Saya" (Remember Me) menggunakan persistent cookie.  
   * Proteksi Brute Force Attack (misal: mengunci akun selama beberapa menit setelah 5 kali gagal login).  
3. **Pengelolaan Profil Bisnis**  
   * Halaman "Profil Bisnis" yang dapat diakses oleh pengguna dengan peran Admin.  
   * Pengguna dapat mengedit informasi: Logo Bisnis, Nama Bisnis, Alamat Lengkap Kantor, Email Kontak, Nomor Telepon/WA Admin.  
4. **Pengelolaan Pengguna & Peran (Roles)**  
   * Hanya dapat diakses oleh peran "Admin".  
   * Admin dapat: Melihat daftar semua pengguna yang terdaftar di bawah bisnisnya, mengundang pengguna baru melalui email untuk bergabung sebagai "Kasir", mengubah peran pengguna, dan menonaktifkan akses pengguna.  
   * Definisi Peran Awal:  
     * Admin: Akses penuh ke semua modul yang dilanggan oleh bisnis, termasuk pengaturan, keuangan, dan manajemen pengguna.  
     * Kasir: Akses terbatas hanya pada "Modul Kasir (POS)". Tidak bisa melihat laporan keuangan, mengubah pengaturan, atau mengelola pengguna lain.

**4\. Use Case**

1. **Pemilik Koperasi Mendaftarkan Bisnisnya**  
   * **Aktor:** Calon Klien (Pemilik Koperasi).  
   * **Skenario:** Pemilik koperasi menemukan PWA Anda dan memutuskan untuk mendaftar. Ia mengisi formulir registrasi, lalu membuka emailnya untuk mengklik link verifikasi.  
   * **Hasil:** Akun bisnis koperasi berhasil dibuat. Akun pemilik otomatis menjadi "Admin" dan ia langsung diarahkan ke halaman Profil Bisnis untuk melengkapi data.  
2. **Kasir Toko Bangunan Login untuk Mulai Bekerja**  
   * **Aktor:** Karyawan (Kasir).  
   * **Skenario:** Seorang kasir tiba di toko, membuka PWA di perangkat kasir, dan memasukkan email serta password yang diberikan oleh pemilik toko.  
   * **Hasil:** Kasir berhasil login dan sistem langsung mengarahkannya ke halaman "Kasir (POS)". Ia tidak dapat melihat atau mengakses menu lain seperti Laporan atau Pengaturan.  
3. **Admin BUMDes Menambahkan Karyawan Baru**  
   * **Aktor:** Admin BUMDes.  
   * **Skenario:** BUMDes merekrut seorang petugas baru untuk menjaga unit toko. Admin membuka menu "Pengaturan Pengguna", mengklik "Undang Pengguna", memasukkan email petugas baru, dan memilih peran "Kasir".  
   * **Hasil:** Sistem mengirimkan email undangan kepada petugas baru. Setelah petugas tersebut menyelesaikan pendaftarannya, akunnya akan otomatis terhubung dengan BUMDes tersebut dengan hak akses sebagai Kasir.

**5\. Dependencies**

* Layanan Pihak Ketiga: Integrasi dengan layanan email transaksional (seperti Mailgun, SendGrid) untuk pengiriman email verifikasi dan reset password.  
* UI/UX Design: Desain final dan mockup untuk semua alur (registrasi, login, lupa password, halaman profil, halaman manajemen pengguna) dari tim desainer.  
* Infrastruktur Backend: Penyiapan database yang aman dengan enkripsi (hashing) untuk password pengguna.

6\. Requirements

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Onboarding Klien Baru | Sebagai pemilik bisnis baru, saya ingin bisa mendaftarkan bisnis saya dengan mudah melalui formulir online sehingga saya dapat segera menggunakan aplikasi. | Sebagai pemilik bisnis baru, ketika saya mengisi formulir pendaftaran dengan data yang valid dan melakukan verifikasi email, maka akun bisnis saya akan aktif dan saya bisa login sebagai Admin. | Highest | \- Formulir pendaftaran memvalidasi semua input (format email, kekuatan password). \- Email verifikasi berhasil terkirim setelah submit formulir.  \- Akun tidak dapat digunakan untuk login sebelum email diverifikasi. \- Setelah verifikasi, akun pemilik otomatis berstatus "Admin". |
| Manajemen Tim Internal | Sebagai Admin, saya ingin bisa menambahkan karyawan saya sebagai "Kasir" sehingga mereka dapat membantu operasional tanpa melihat data sensitif. | Sebagai Admin, ketika saya mengundang pengguna baru dengan peran "Kasir", maka pengguna tersebut akan menerima undangan dan setelah mendaftar, hanya bisa mengakses Modul Kasir (POS). | Highest | \- Admin memiliki menu "Pengaturan Pengguna". \- Terdapat tombol "Undang Pengguna" yang memicu pengiriman email undangan.  \- Pengguna yang diundang dan mendaftar akan memiliki peran "Kasir".  \- Saat login, pengguna dengan peran "Kasir" hanya melihat dan dapat mengakses menu/halaman POS.  \- Semua menu lain (Laporan, Pengaturan, dll) tersembunyi atau tidak dapat diakses. |
| Keamanan Akun | Sebagai pengguna, saya ingin bisa mereset password saya jika saya lupa sehingga saya bisa mendapatkan kembali akses ke akun saya dengan aman. | Sebagai pengguna, ketika saya mengklik "Lupa Password?" dan memasukkan email saya, maka saya akan menerima link untuk membuat password baru. | Highest | \- Link "Lupa Password?" tersedia di halaman login.  \- Sistem hanya akan mengirimkan email jika email tersebut terdaftar.  \- Link reset password yang dikirim bersifat unik dan memiliki masa kadaluarsa (misal: 1 jam).  \- Pengguna berhasil mengubah password dan dapat login menggunakan password baru tersebut. |

## Modul Manajemen Modul & Langganan

| Product Name | Modul Manajemen Modul & Langganan (PWA SaaS) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 30 September 2025 |
| Stage | Development |
| Status | In Progress |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester |

1\. Description

Modul Manajemen Modul & Langganan memberikan administrator vendor kemampuan untuk mengelola langganan aplikasi. Modul ini memungkinkan administrator untuk mengaktifkan atau menonaktifkan modul fitur, dan memberikan transparansi penuh mengenai biaya dan rincian tagihan secara real-time.

2\. Objectives & Success Metrics

Objectives:

* Memberikan fleksibilitas kepada administrator untuk memilih fitur yang sesuai dengan kebutuhan bisnisnya.  
* Memberikan transparansi biaya yang jelas dan *real-time*.  
* Menyederhanakan proses pengelolaan langganan.

**Success Metrics:**

* Tingkat adopsi modul berbayar yang tinggi (\>40% dari total pengguna).  
* Tingkat kepuasan pengguna terhadap transparansi biaya (skor NPS \> 7).  
* Jumlah *support ticket* terkait pertanyaan *billing* berkurang sebesar 20% dalam 3 bulan setelah rilis.

**3\. Features**

1. **Katalog Modul (Modul Catalog)**  
   * Tampilan galeri (kartu) untuk setiap modul yang tersedia, berisi nama, deskripsi singkat, harga per bulan, label status visual (Aktif/Tidak Aktif), dan tombol saklar Aktif/Nonaktif.  
   * Klien dapat melihat semua modul yang tersedia, terlepas dari apakah mereka sudah berlangganan atau tidak.  
2. **Mekanisme Aktivasi & Deaktivasi**  
   * Tombol saklar (toggle button) pada setiap kartu modul.  
   * Saat mengaktifkan atau menonaktifkan modul, sebuah modal konfirmasi akan muncul.  
   * Setelah konfirmasi, menu navigasi di aplikasi akan diperbarui secara otomatis dalam waktu maksimal 5 detik.  
3. **Panel Billing Dinamis**  
   * Panel ringkasan yang selalu terlihat di sidebar modul, menampilkan rincian biaya: Paket Dasar, modul yang sedang aktif, dan total estimasi tagihan bulan berikutnya yang dihitung secara *real-time*.  
4. **Halaman Riwayat Tagihan (Billing History)**  
   * Tampilan tabel yang menampilkan semua tagihan yang sudah dikeluarkan, berisi Nomor Tagihan, Tanggal Tagihan, Periode Langganan, Total Biaya, dan Status Pembayaran.

**4\. Use Case**

1. **Pemilik UMKM Mengaktifkan Modul Marketplace**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Pemilik UMKM ingin mulai menjual produknya secara online. Dia membuka modul Manajemen Modul, menemukan kartu modul "Marketplace", dan mengklik tombol saklar untuk mengaktifkannya. Setelah konfirmasi, biaya bulanan akan ditambahkan ke total tagihan dan menu "Marketplace" akan muncul di navigasi.  
   * **Hasil:** Pemilik UMKM sekarang dapat mengakses modul "Marketplace" dan biaya untuk modul tersebut secara otomatis terhitung di tagihan bulan berikutnya.  
2. **Admin Koperasi Mengecek Total Tagihan Bulanan**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Admin Koperasi ingin mengetahui berapa total biaya langganan yang harus ia bayar bulan depan. Dia membuka modul Manajemen Modul dan melihat Panel Billing Dinamis di sidebar.  
   * **Hasil:** Admin dapat melihat rincian biaya dengan jelas dan transparan, termasuk paket dasar dan modul-modul yang sedang aktif, serta total biaya bulan depan.

**5\. Dependencies**

* Backend: Logika perhitungan biaya, manajemen status modul per klien, dan API untuk mengambil data katalog modul dan riwayat tagihan.  
* Frontend: Komponen UI untuk tombol saklar, modal konfirmasi, dan tampilan panel *billing*.  
* Integrasi: Sistem *billing* yang dapat memperbarui total biaya secara *real-time* berdasarkan aktivasi/deaktivasi modul.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Langganan Fleksibel | Sebagai administrator vendor, saya ingin bisa mengaktifkan atau menonaktifkan modul kapan pun sehingga saya hanya membayar fitur yang saya gunakan. | Sebagai administrator vendor, ketika saya mengaktifkan sebuah modul, maka modul tersebut akan aktif dan biaya akan otomatis ditambahkan ke total tagihan bulan depan. | Highest | \- Admin dapat melihat semua modul yang tersedia dalam bentuk kartu.  \- Setiap modul memiliki tombol saklar yang berfungsi untuk mengaktifkan/menonaktifkan modul.  \- Aktivasi/deaktivasi modul harus meminta konfirmasi melalui modal.  \- Setelah aktivasi, menu navigasi akan menampilkan tautan ke modul yang baru diaktifkan. |
| Transparansi Biaya | Sebagai administrator vendor, saya ingin melihat rincian biaya langganan secara *real-time* sehingga saya bisa mengontrol pengeluaran. | Sebagai administrator vendor, ketika saya melihat halaman Manajemen Modul & Langganan, maka saya akan melihat total estimasi tagihan bulan depan berdasarkan modul yang saya aktifkan. | Highest | \- Panel *billing* dinamis menampilkan rincian biaya paket dasar dan biaya modul yang aktif.  \- Total estimasi tagihan akan diperbarui secara *real-time* setiap kali ada perubahan status modul.  \- Halaman riwayat tagihan menampilkan daftar tagihan lama dengan detail yang akurat. |
| Pengelolaan Langganan Efisien | Sebagai administrator vendor, saya ingin modul ini mudah digunakan sehingga saya dapat mengelola langganan tanpa perlu bantuan dari tim *support*. | Sebagai administrator vendor, ketika saya mengaktifkan atau menonaktifkan modul, maka prosesnya akan cepat dan perubahan terlihat secara instan. | High | \- Perubahan status modul di backend berlangsung cepat (\<2 detik).  \- Menu navigasi diperbarui dalam 5 detik setelah perubahan.  \- Proses aktivasi/deaktivasi tidak memerlukan proses manual dari tim *support*. |

## Modul Inventaris

| Product Name | Modul Inventaris (PWA SaaS) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 31 Oktober 2025 |
| Stage | Development |
| Status | To Do |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester |

1\. Description

Modul Inventaris adalah sistem pusat untuk pengelolaan seluruh data produk dan stok. Modul ini memungkinkan klien (Koperasi, BUMDes, UMKM Toko Bangunan) untuk membuat, mengatur, melacak, dan mengelola katalog produk atau layanan yang mereka tawarkan. Fungsi utamanya mencakup pendefinisian detail produk, pemantauan jumlah stok secara

*real-time*, dan penetapan harga beli (modal) serta harga jual. Modul ini menjadi sumber data utama yang akan dikonsumsi oleh Modul Kasir (POS) dan Modul Marketplace.

2\. Objectives & Success Metrics

Objectives:

* Menyediakan Katalog Produk yang Terpusat & Mudah Digunakan.  
* Memastikan Pelacakan Stok yang Akurat.  
* Menyederhanakan Manajemen Harga & Profitabilitas.

**Success Metrics:**

* *High Adoption & Data Richness*: \>90% klien aktif telah menambahkan minimal 10 produk dalam 30 hari pertama.  
* *Stock Accuracy*: Tingkat akurasi sinkronisasi stok setelah penjualan (dari POS/Marketplace) mencapai 99.9%.  
* *User Efficacy*: Waktu rata-rata yang dibutuhkan pengguna untuk menambahkan produk baru kurang dari 60 detik.

**3\. Features**

1. **Daftar Produk (Halaman Utama Modul)**   
   * Tampilan tabel yang informatif dan mudah dicari, berisi kolom: Foto, Nama Produk, SKU, Kategori, Stok Saat Ini, Harga Jual.  
   * Fitur Pencarian berdasarkan Nama Produk atau SKU.  
   * Fitur Filter berdasarkan Kategori Produk.  
   * Tombol aksi utama: "+ Tambah Produk".  
2. **Formulir Tambah & Edit Produk**   
   * Sebuah formulir komprehensif untuk mendefinisikan produk.  
   * Bagian Manajemen Stok: Lacak Stok? (Checkbox), Stok Awal, Batas Minimum Stok.  
3. **Fitur Manajemen Stok Lanjutan**   
   * Penyesuaian Stok (Stok Opname): Fitur untuk menyamakan data stok di sistem dengan jumlah fisik di gudang.  
   * Riwayat Stok: Catatan log terperinci untuk setiap pergerakan stok.

**4\. Use Case**

1. **Admin Toko Bangunan Menambahkan Produk Semen**   
   * **Aktor:** Admin Toko Bangunan.  
   * **Skenario:** Admin menambahkan produk "Semen Garuda" dan mengisi detailnya, termasuk harga beli, harga jual, dan batas minimum stok.  
   * **Hasil:** Produk berhasil ditambahkan, dan notifikasi akan muncul di *Dashboard* jika stoknya di bawah batas minimum.  
2. **Pengurus Koperasi Melakukan Stok Opname Bulanan**   
   * **Aktor:** Pengurus Koperasi.  
   * **Skenario:** Pengurus menemukan perbedaan antara stok di sistem dan stok fisik. Dia menggunakan fitur "Penyesuaian Stok" untuk memperbarui data.  
   * **Hasil:** Sistem memperbarui jumlah stok dan membuat catatan riwayat "Penyesuaian: \-2".

**5\. Dependencies**

* Modul Dashboard: Mengambil data dari Inventaris untuk notifikasi stok menipis.  
* Modul Kasir (POS) & Marketplace: Sangat bergantung pada data harga jual dan akan mengurangi stok setelah terjadi penjualan.  
* UI/UX Design: Desain final untuk halaman daftar produk, formulir tambah/edit, dan alur stok opname.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Pengelolaan Katalog Produk | Sebagai pemilik bisnis, saya ingin bisa menambahkan dan mengedit detail produk saya dengan mudah sehingga saya bisa menjaga katalog saya tetap up-to-date. | Sebagai pemilik bisnis, ketika saya mengisi formulir tambah produk dengan data yang lengkap, maka produk tersebut akan tersimpan dan muncul di daftar inventaris saya. | Highest | \- Pengguna dapat mengisi semua field di form tambah produk. \- Validasi input berjalan (misal: harga jual tidak boleh kosong) . \- Produk yang baru ditambahkan langsung muncul di halaman Daftar Produk. \- Pengguna dapat mengklik produk di daftar untuk masuk ke mode edit. |
| Sinkronisasi Stok Otomatis | Sebagai pengguna, saya ingin stok produk berkurang secara otomatis setiap kali ada penjualan agar data inventaris saya selalu akurat. | Sebagai pengguna, ketika sebuah produk terjual melalui Kasir (POS) atau Marketplace, maka jumlah stok produk tersebut di sistem akan langsung berkurang sesuai jumlah yang terjual. | Highest | \- Penjualan 2 pcs produk X di POS akan mengurangi stok produk X sebanyak 2\. \- Penjualan 1 pcs produk Y di Marketplace akan mengurangi stok produk Y sebanyak 1 . \- Perubahan stok tercatat di Riwayat Stok produk tersebut . \- Jika stok 0, produk tidak bisa ditambahkan ke keranjang POS/Marketplace. |
| Penyesuaian Stok Manual | Sebagai pengguna, saya ingin bisa melakukan stok opname dan menyesuaikan jumlah stok di sistem agar data saya kembali akurat. | Sebagai pengguna, ketika saya menemukan perbedaan antara stok fisik dan stok di sistem, maka saya bisa memasukkan angka stok fisik yang benar untuk memperbarui data di sistem. | High | \- Terdapat fitur "Penyesuaian Stok" di halaman detail produk. \- Pengguna dapat memasukkan angka kuantitas fisik . \- Sistem menghitung selisih dan memperbarui kuantitas "Stok Saat Ini". \- Sebuah entri baru tercatat di "Riwayat Stok" dengan tipe "Penyesuaian". |

## Modul Kasir (Point of Sale)

| Product Name | Modul Kasir (Point of Sale) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 30 November 2025 |
| Stage | Development |
| Status | To Do |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester |

1\. Description

Modul Kasir (POS) adalah versi digital dari mesin kasir konvensional, yang dirancang untuk digunakan pada berbagai perangkat seperti tablet atau komputer di toko fisik. Modul ini menyediakan antarmuka yang cepat, intuitif, dan efisien bagi staf di garis depan (kasir) untuk melakukan dan mencatat transaksi penjualan. Setiap transaksi yang berhasil akan secara otomatis memperbarui jumlah stok di Modul Inventaris dan menyumbangkan data ke Modul Laporan, menciptakan ekosistem bisnis yang terintegrasi.

2\. Objectives & Success Metrics

Objectives:

* Mempercepat Proses *Checkout*: Mengurangi waktu antrean dan meningkatkan kepuasan pelanggan dengan alur transaksi yang cepat.  
* Meminimalkan Kesalahan Manusia: Menghilangkan kesalahan perhitungan manual dan memastikan setiap transaksi tercatat dengan akurat.  
* Menjamin Integritas Data Lintas Modul: Memastikan setiap penjualan tercermin secara *real-time* pada data stok dan laporan keuangan.

**Success Metrics:**

* *Transaction Speed*: Waktu rata-rata per transaksi adalah di bawah 60 detik.  
* *Accuracy Rate*: Tingkat akurasi data penjualan yang masuk ke sistem adalah 100% tanpa memerlukan koreksi manual.  
* *User Adoption & Satisfaction*: Staf kasir dapat menggunakan sistem secara mandiri dengan pelatihan kurang dari 15 menit dan memberikan rating kemudahan penggunaan 4/5 atau lebih tinggi.

**3\. Features**

1. **Antarmuka Transaksi Utama**  
   * Grid Produk: Tampilan visual produk yang paling sering dijual dalam bentuk kartu/grid yang mudah disentuh (*touch-friendly*).  
   * Pencarian Cepat: Sebuah bar pencarian yang selalu terlihat untuk mencari produk berdasarkan Nama atau SKU. Mendukung pencarian dengan *barcode scanner*.  
   * Keranjang Belanja (*Cart*): Daftar item yang sedang dibeli oleh pelanggan. Kasir dapat mengubah kuantitas per item, memberikan diskon per item, dan menghapus item dari keranjang.  
   * Ringkasan Pembayaran: Kalkulasi otomatis untuk Subtotal, Diskon, Pajak (jika diaktifkan), dan Total Akhir.  
2. **Alur Proses Pembayaran**  
   * Tombol "Bayar" yang jelas dan besar untuk memulai proses pembayaran.  
   * Pilihan Metode Pembayaran: Pilihan visual untuk metode pembayaran yang umum (Tunai, QRIS, Kartu Debit/Kredit).  
   * Pembayaran Tunai: Sistem menyediakan *input field* untuk "Jumlah Uang Diterima" dan secara otomatis menghitung "Uang Kembali".  
   * Pembayaran Non-Tunai: Opsi untuk menandai pembayaran sebagai lunas.  
3. **Pencetakan dan Pengiriman Struk**  
   * Setelah pembayaran berhasil, layar konfirmasi akan muncul.  
   * Opsi penyelesaian transaksi: Cetak Struk (ke *thermal printer*), Kirim Struk via *WhatsApp* (menghasilkan *link* *wa.me*), dan Transaksi Baru (menyelesaikan transaksi tanpa struk).  
4. **Manajemen Sesi Kasir (Opsional untuk MVP Lanjutan)**  
   * Fitur "Buka Kasir" di awal hari dengan modal awal.  
   * Fitur "Tutup Kasir" di akhir hari dengan ringkasan penjualan selama sesi tersebut.

**4\. Use Case**

1. **Kasir Koperasi Melayani Anggota yang Berbelanja Rutin**  
   * **Aktor:** Kasir Koperasi.  
   * **Skenario:** Seorang anggota membeli beberapa kebutuhan pokok. Kasir dengan cepat mengetuk produk pada Grid Produk. Pelanggan membayar dengan uang tunai.  
   * **Hasil:** Kasir memasukkan jumlah uang yang diterima, sistem menampilkan jumlah kembalian, dan kasir menyelesaikan transaksi sambil memberikan struk cetak. Stok barang otomatis berkurang.  
2. **Kasir Toko Bangunan Melayani Pesanan Besar**  
   * **Aktor:** Kasir Toko Bangunan.  
   * **Skenario:** Seorang kontraktor membeli 50 sak semen, 10 batang besi, dan 5 kaleng cat. Kasir menggunakan fitur pencarian untuk menemukan item tersebut dengan cepat dan mengubah kuantitasnya di keranjang. Pembayaran dilakukan via transfer.  
   * **Hasil:** Kasir memilih metode pembayaran "Transfer" dan menandai lunas. Ia mencetak struk sebagai bukti bayar untuk kontraktor.

**5\. Dependencies**

* Modul Inventaris: Ketergantungan Kritis. Modul POS tidak dapat berfungsi tanpa akses ke daftar produk, harga, dan jumlah stok dari Modul Inventaris.  
* Perangkat Keras (*Hardware*): Desain harus mempertimbangkan kompatibilitas dengan *barcode scanner* dan *thermal printer*.  
* Modul Laporan: Semua data transaksi dari POS akan menjadi input utama untuk laporan penjualan dan laba/rugi.  
* UI/UX Design: Desain antarmuka harus sangat dioptimalkan untuk kecepatan, visibilitas yang baik, dan interaksi sentuhan yang minimalis.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Pembuatan Transaksi Penjualan | Sebagai seorang kasir, saya ingin dapat dengan cepat menambahkan produk ke dalam keranjang pelanggan agar saya bisa melayani pelanggan tanpa membuat mereka menunggu lama. | Sebagai seorang kasir, ketika saya mencari atau memilih produk, maka produk tersebut akan ditambahkan ke keranjang dan total belanja akan diperbarui secara otomatis. | Highest | \- Produk dapat ditambahkan ke keranjang melalui pencarian atau klik pada grid produk.  \- Kuantitas produk dalam keranjang dapat diubah.  \- Item dapat dihapus dari keranjang.  \- Subtotal dan Total Akhir terhitung dengan benar. |
| Proses Pembayaran | Sebagai seorang kasir, saya ingin bisa menerima pembayaran tunai dan menghitung kembalian secara otomatis sehingga saya tidak membuat kesalahan dalam perhitungan uang kembalian. | Sebagai seorang kasir, ketika pelanggan membayar dengan uang tunai dan saya memasukkan jumlah uang yang diterima, maka sistem akan secara otomatis menghitung dan menampilkan jumlah uang kembali. | Highest | \- Tombol "Bayar" membuka modal pembayaran.  \- Terdapat opsi pembayaran "Tunai".  \- Input field untuk "Jumlah Uang Diterima" berfungsi.  \- Angka "Uang Kembali" ditampilkan dengan benar.  \- Transaksi berhasil tersimpan setelah pembayaran dikonfirmasi. |
| Penyelesaian Transaksi dan Struk | Sebagai seorang kasir, saya ingin bisa memberikan bukti pembelian kepada pelanggan setelah transaksi selesai agar pelanggan memiliki bukti pembelian yang sah. | Sebagai seorang kasir, ketika pembayaran telah berhasil, maka saya akan diberikan pilihan untuk mencetak struk atau mengirimnya secara digital. | High | \- Setelah pembayaran, layar konfirmasi muncul dengan opsi struk.  \- Tombol "Cetak Struk" mengirimkan data ke printer.  \- Tombol "Kirim via WhatsApp" membuka tab baru dengan link wa.me yang sudah terisi pesan struk.  \- Penjualan tercatat dalam riwayat transaksi. |

## Modul Marketplace (Toko Online)

| Product Name | Modul Marketplace (Toko Online) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 15 Desember 2025 |
| Stage | Development |
| Status | To Do |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester |

1\. Description

Modul Marketplace menyediakan setiap klien (Koperasi, BUMDes, UMKM Toko Bangunan) sebuah etalase digital atau "toko online" pribadi yang dapat diakses publik melalui URL unik. Fitur ini memungkinkan klien untuk memperluas jangkauan pasar mereka di luar toko fisik, menampilkan produk mereka kepada audiens yang lebih luas, dan menerima pesanan secara online 24/7. Bagi pelanggan akhir, ini memberikan kemudahan untuk menelusuri produk dan melakukan pembelian dari mana saja.

2\. Objectives & Success Metrics

Objectives:

* Menciptakan Saluran Penjualan Baru: Memberikan klien alat yang mudah digunakan untuk meningkatkan pendapatan melalui penjualan online.  
* Memberikan Pengalaman Belanja yang Intuitif: Merancang alur belanja yang sederhana dan cepat bagi pelanggan akhir untuk mendorong konversi.  
* Menjamin Integrasi Data yang Sempurna: Memastikan setiap pesanan online tercatat dengan benar, dan data stok selalu sinkron dengan Modul Inventaris.

**Success Metrics:**

* Module Adoption & Sales Impact: \>50% klien mengaktifkan Modul Marketplace. Rata-rata, setiap marketplace yang aktif menghasilkan minimal 5 pesanan per bulan.  
* Conversion Rate: Tingkat konversi (jumlah pengunjung yang melakukan checkout dibagi total pengunjung) mencapai \>2%.  
* Data Integrity: 100% pesanan dari marketplace tercatat secara akurat di sistem back-office. 0 kasus overselling (menjual barang yang stoknya sudah habis).

**3\. Features**

1. **Halaman Toko Digital (Storefront)**  
   * URL Unik: Sistem secara otomatis menghasilkan URL yang unik dan mudah dibagikan untuk setiap toko.  
   * Header Toko: Menampilkan Logo, Nama Bisnis, dan kontak yang bisa dihubungi (misal: tombol WhatsApp).  
   * Katalog Produk: Tampilan galeri produk yang telah ditandai "Tampilkan di Marketplace" dari Modul Inventaris.  
   * Fitur Pencarian Sederhana: Bar pencarian untuk mencari produk berdasarkan nama.  
2. **Halaman Detail Produk**  
   * Menampilkan gambar produk yang lebih besar, nama, harga, dan deskripsi produk yang diambil dari Modul Inventaris.  
   * Menampilkan status ketersediaan stok (misal: "Stok Tersedia" atau "Stok Habis").  
   * Tombol "Tambah ke Keranjang" beserta kolom untuk menentukan jumlah.  
3. **Alur Keranjang Belanja dan Checkout**  
   * Keranjang Belanja: Ikon keranjang yang selalu terlihat dan menampilkan jumlah item.  
   * Formulir Checkout: Formulir satu halaman yang sederhana untuk diisi pelanggan.  
4. **Halaman Konfirmasi Pesanan**  
   * Halaman "Terima Kasih" yang muncul setelah pesanan berhasil dibuat.  
   * Menampilkan ringkasan pesanan, nomor pesanan, dan total yang harus dibayar.

**4\. Use Case**

1. **Pelanggan Umum Memesan Barang dari Marketplace Koperasi**  
   * **Aktor:** Pelanggan Umum.  
   * **Skenario:** Seorang pelanggan melihat promosi toko Koperasi di media sosial dan mengklik link marketplace yang tertera. Ia menelusuri produk, menambahkan beberapa item ke keranjang, dan menyelesaikan checkout.  
   * **Hasil:** Pesanan masuk ke sistem Koperasi. Admin Koperasi menerima notifikasi dan menghubungi pelanggan untuk mengatur pengiriman.  
2. **Kontraktor Memastikan Ketersediaan Stok di Toko Bangunan**  
   * **Aktor:** Kontraktor (Calon Pelanggan).  
   * **Skenario:** Kontraktor membuka halaman marketplace toko tersebut untuk memastikan stok cat merek tertentu tersedia sebelum pergi ke toko.  
   * **Hasil:** Ia melihat produk tersedia, lalu langsung datang ke toko untuk membeli atau memesan via WhatsApp.

**5\. Dependencies**

* Modul Inventaris: KETERGANTUNGAN KRITIS. Marketplace sepenuhnya bergantung pada data produk, harga, deskripsi, gambar, dan jumlah stok dari modul ini.  
* Modul Manajemen Pesanan Online: Setiap pesanan yang dibuat melalui marketplace harus secara otomatis membuat entri baru di modul backend ini agar dapat diproses oleh pemilik bisnis.  
* UI/UX Design: Desain harus mobile-first, bersih, cepat dimuat, dan membangun kepercayaan pelanggan untuk mendorong transaksi.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Penemuan Produk oleh Pelanggan | Sebagai seorang pelanggan, saya ingin dapat dengan mudah menelusuri dan mencari produk di toko online agar saya bisa menemukan barang yang saya inginkan dengan cepat. | Sebagai seorang pelanggan, ketika saya membuka halaman marketplace, maka saya akan melihat katalog produk yang bisa saya cari dan filter. | Highest | \- Halaman utama marketplace menampilkan produk dalam bentuk galeri.  \- Terdapat bar pencarian yang berfungsi.  \- Setiap produk dapat diklik untuk melihat halaman detailnya.  \- Produk dengan stok 0 menampilkan label "Stok Habis" dan tidak bisa ditambahkan ke keranjang. |
| Proses Checkout Sederhana | Sebagai seorang pelanggan, saya ingin proses checkout yang cepat dan tidak rumit agar saya tidak membatalkan pembelian saya. | Sebagai seorang pelanggan, ketika saya siap membayar, maka saya akan mengisi satu formulir singkat untuk menyelesaikan pesanan saya. | Highest | \- Tombol "Tambah ke Keranjang" berfungsi dari halaman detail produk.  \- Halaman checkout adalah satu halaman tunggal.  \- Formulir hanya meminta informasi esensial (Nama, Kontak, Alamat).  \- Tombol "Buat Pesanan" berhasil mengirim data dan mengarahkan ke halaman konfirmasi. |
| Notifikasi Pesanan untuk Penjual | Sebagai pemilik bisnis, saya ingin langsung tahu jika ada pesanan baru masuk dari marketplace saya agar saya dapat segera memprosesnya. | Sebagai pemilik bisnis, ketika seorang pelanggan membuat pesanan di marketplace saya, maka sebuah pesanan baru akan muncul di dashboard manajemen pesanan saya. | Highest | \- Pesanan yang berhasil dibuat pelanggan akan menghasilkan entri baru di "Manajemen Pesanan Online" dengan status "Baru".  \- Data pesanan (info pelanggan, produk yang dipesan, kuantitas) tercatat dengan akurat.  \- Jumlah stok untuk produk yang dipesan akan otomatis berkurang (atau dialokasikan) dari Modul Inventaris. |

## Modul Laporan

| Product Name | Modul Laporan (PWA SaaS) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 31 Januari 2026 |
| Stage | Development |
| Status | To Do |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester |

1\. Description

Modul Laporan adalah pusat intelijen bisnis dari PWA. Modul ini berfungsi untuk mengagregasi, mengolah, dan menyajikan semua data transaksional dari modul lain (Kasir, Marketplace, Inventaris, Keuangan) ke dalam format laporan yang terstruktur dan mudah dipahami. Tujuannya adalah untuk memberikan para pemilik bisnis wawasan mendalam mengenai kinerja penjualan, profitabilitas, dan kesehatan keuangan usaha mereka, sehingga dapat mendukung pengambilan keputusan strategis yang berbasis data.

2\. Objectives & Success Metrics

Objectives:

* Menyediakan Gambaran Finansial yang Jelas: Menyajikan laporan keuangan kunci (Laba/Rugi, Arus Kas, Neraca Sederhana) yang akurat dan mudah dimengerti.  
* Memfasilitasi Analisis Kinerja: Memungkinkan pengguna untuk menganalisis tren, mengidentifikasi produk terlaris, dan memahami struktur biaya mereka.  
* Meningkatkan Literasi Finansial Pengguna: Menjadi alat bantu bagi pemilik bisnis untuk lebih memahami kesehatan dan potensi usaha mereka.

**Success Metrics:**

* Data Accuracy: Tingkat akurasi data pada laporan adalah 99.9% jika dibandingkan dengan kalkulasi manual dari data transaksi sumber.  
* Feature Usage: Lebih dari 70% klien aktif membuka Modul Laporan setidaknya sekali seminggu. Fitur filter periode tanggal digunakan pada mayoritas sesi.  
* User Confidence: Berdasarkan survei, \>80% pengguna merasa lebih percaya diri dalam mengambil keputusan bisnis setelah menggunakan laporan di PWA ini.

**3\. Features**

1. **Filter Universal**  
   * Komponen filter berdasarkan rentang tanggal (Hari Ini, 7 Hari Terakhir, Bulan Ini, 3 Bulan Terakhir, Kustom) yang berlaku untuk semua jenis laporan.  
2. **Laporan Laba/Rugi**  
   * Menampilkan ringkasan pendapatan dan pengeluaran dalam periode yang dipilih.  
   * Struktur: Pendapatan, Harga Pokok Penjualan (HPP), Laba Kotor, Beban Operasional, dan Laba Bersih.  
3. **Laporan Arus Kas (Metode Langsung)**  
   * Melaporkan semua uang tunai yang masuk dan keluar.  
   * Struktur: Arus Kas dari Aktivitas Operasi (Penerimaan dan Pembayaran Kas), Arus Kas dari Aktivitas Pendanaan, Kenaikan/Penurunan Kas Bersih, serta Saldo Kas Awal & Akhir Periode.  
4. **Neraca Sederhana (Laporan Posisi Keuangan)**  
   * Memberikan potret keuangan bisnis pada akhir periode yang dipilih.  
   * Struktur: Aset (Kas dan Setara Kas, Nilai Persediaan), Liabilitas, dan Ekuitas (Modal Disetor, Laba Ditahan).  
   * Selalu menampilkan validasi sederhana: Total Aset \= Total Liabilitas \+ Ekuitas.  
5. **Laporan Penjualan Rinci**  
   * Laporan yang lebih fokus pada analisis penjualan.  
   * Tampilan: Ringkasan Penjualan (Omzet Total, Jumlah Transaksi), Analisis Produk (produk terlaris), dan Analisis per Channel (Kasir vs Marketplace).  
6. **Fitur Ekspor**  
   * Tombol "Ekspor ke CSV/Excel" pada setiap halaman laporan, memungkinkan pengguna mengolah data lebih lanjut.

**4\. Use Case**

1. **Pemilik Toko Bangunan Mengevaluasi Kinerja Bulanan**  
   * **Aktor:** Pemilik Toko Bangunan.  
   * **Skenario:** Di awal bulan, pemilik membuka Modul Laporan, memilih periode "Bulan Lalu", dan membuka Laporan Laba/Rugi.  
   * **Hasil:** Ia melihat laba bersih yang dihasilkan dan kemudian membuka Laporan Penjualan Rinci untuk melihat produk terlaris.  
2. **Bendahara Koperasi Menyiapkan Laporan untuk Rapat Anggota**  
   * **Aktor:** Bendahara Koperasi.  
   * **Skenario:** Menjelang Rapat Anggota Tahunan, bendahara menggunakan PWA untuk menghasilkan Laporan Laba/Rugi, Arus Kas, dan Neraca Sederhana untuk periode satu tahun.  
   * **Hasil:** Ia mengekspor semua laporan ke dalam format Excel untuk digabungkan ke dalam materi presentasi rapat, menghemat waktu rekapitulasi manual.

**5\. Dependencies**

* Ketergantungan Data Kritis: Modul ini sepenuhnya bergantung pada data yang akurat dan lengkap dari Modul Inventaris (untuk HPP), Kasir (POS), Marketplace (untuk Pendapatan), dan Pencatatan Keuangan (untuk Beban dan Modal).  
* Logika Backend: Membutuhkan logika kalkulasi dan agregasi data yang kompleks dan teruji di sisi *backend* untuk memastikan semua angka akurat.  
* UI/UX Design: Desainer harus mampu menyajikan data finansial yang padat menjadi visualisasi (grafik, tabel) yang bersih, menarik, dan mudah dimengerti.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Pelaporan Profitabilitas | Sebagai pemilik bisnis, saya ingin bisa melihat Laporan Laba/Rugi untuk periode waktu tertentu agar saya tahu apakah bisnis saya untung atau rugi. | Sebagai pemilik bisnis, ketika saya memilih periode waktu dan membuka Laporan Laba/Rugi, maka saya akan melihat rincian pendapatan, HPP, dan beban untuk mengetahui laba bersih saya. | Highest | \- Laporan menampilkan semua komponen L/R dengan benar.  \- Data dapat difilter berdasarkan rentang tanggal.  \- Angka Pendapatan cocok dengan total penjualan di Laporan Penjualan.  \- Angka Beban cocok dengan total di pencatatan pengeluaran.  \- Kalkulasi Laba Kotor dan Laba Bersih akurat. |
| Analisis Penjualan | Sebagai manajer, saya ingin tahu produk mana yang paling laku terjual sehingga saya bisa membuat strategi promosi dan pembelian stok yang lebih baik. | Sebagai manajer, ketika saya membuka Laporan Penjualan Rinci, maka saya akan melihat daftar produk yang diurutkan berdasarkan penjualan tertinggi. | High | \- Laporan Penjualan memiliki bagian "Produk Terlaris".  \- Pengurutan dapat dilakukan berdasarkan "Jumlah Terjual" atau "Total Pendapatan".  \- Data penjualan dapat diekspor ke format CSV/Excel.  \- Data cocok dengan catatan transaksi individual. |
| Pemahaman Posisi Keuangan | Sebagai pemilik bisnis, saya ingin melihat ringkasan aset dan modal yang saya miliki dalam bisnis agar saya dapat mengukur kesehatan keuangan bisnis saya secara keseluruhan. | Sebagai pemilik bisnis, ketika saya membuka laporan Neraca Sederhana, maka saya akan melihat nilai total dari kas dan persediaan barang saya, serta total modal saya. | High | \- Laporan Neraca Sederhana menampilkan komponen Aset (Kas, Persediaan) dan Ekuitas (Modal, Laba Ditahan).  \- Nilai Persediaan dihitung berdasarkan Harga Beli (modal) dari produk yang tersisa.  \- Persamaan Aset \= Liabilitas \+ Ekuitas harus seimbang.  \- Angka Laba Ditahan cocok dengan akumulasi Laba Bersih dari Laporan L/R. |

## Modul Landing Page (Adaptif)

| Product Name | Modul Landing Page (Adaptif untuk Klien SaaS) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 15 Juli 2025 |
| Stage | Scoping & Design |
| Status | To Do |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester |

1\. Description

Modul Landing Page adalah fitur yang menyediakan halaman depan (storefront) publik yang profesional dan menarik untuk setiap klien PWA. Halaman ini bersifat adaptif, artinya konten, penawaran, dan call-to-action (CTA) akan secara otomatis menyesuaikan dengan jenis bisnis klien (Koperasi, UMKM Toko Bangunan, atau BUMDes). Tujuannya adalah untuk memperkenalkan bisnis klien kepada audiens yang relevan, membangun kepercayaan, dan menjadi gerbang utama untuk akuisisi pelanggan atau anggota baru.

2\. Objectives & Success Metrics

Objectives:

* Meningkatkan Visibilitas Online Klien: Memberikan setiap klien "wajah digital" yang profesional.  
* Mendorong Akuisisi Sesuai Target: Meningkatkan jumlah pendaftaran anggota baru untuk Koperasi, menghasilkan *leads* dan mendorong penelusuran katalog online untuk Toko Bangunan, dan meningkatkan kesadaran publik untuk BUMDes.  
* Menyediakan Akses Informasi yang Cepat: Memudahkan audiens target untuk memahami layanan dan keunggulan yang ditawarkan oleh klien.

**Success Metrics:**

* Conversion Rate: Tingkat konversi CTA utama \> 3% untuk semua jenis klien.  
* Bounce Rate: Angka pentalan (pengunjung yang langsung pergi) di bawah 60%.  
* Client Satisfaction: \>85% klien merasa *landing page* mereka secara akurat dan menarik merepresentasikan bisnis mereka.

3\. Features (Adaptif per Jenis Klien)

Struktur halaman akan sama, namun konten di dalamnya akan dinamis.

1. **Header:** Menampilkan Logo, Menu Navigasi, dan CTA yang disesuaikan dengan jenis bisnis.  
2. **Hero Section:** Menampilkan *headline* dan ilustrasi yang sesuai dengan jenis bisnis.  
3. **Tentang Bisnis:** Menyajikan informasi tentang sejarah, visi & misi, atau profil desa yang relevan.  
4. **Layanan/Produk Unggulan:** Menampilkan layanan (simpanan, pembiayaan) untuk Koperasi, kategori produk terlaris untuk Toko Bangunan, atau unit usaha unggulan untuk BUMDes.  
5. **Keunggulan/Manfaat:** Menyoroti keunggulan yang relevan (misal: bagi hasil untuk Koperasi, harga kompetitif untuk Toko Bangunan, pemberdayaan warga untuk BUMDes).  
6. **Testimoni:** Menampilkan kutipan dari anggota aktif, pelanggan setia, atau warga desa.  
7. **Formulir CTA:** Menyediakan formulir yang berbeda-beda sesuai jenis bisnis, seperti "Formulir Pendaftaran Anggota" untuk Koperasi, "Formulir Minta Penawaran" untuk Toko Bangunan, atau "Formulir Kontak Kami" untuk BUMDes.

**4\. Use Case**

1. **Calon Anggota Mendaftar ke Koperasi (Baseline)**  
   * **Aktor:** Calon anggota.  
   * **Skenario:** Calon anggota membuka *landing page* Koperasi, tertarik dengan manfaat yang ditawarkan, lalu mengisi formulir pendaftaran.  
   * **Hasil:** Data terkirim ke admin koperasi untuk di-*follow up*.  
2. **Kontraktor Mencari *Supplier* Material Bangunan**  
   * **Aktor:** Kontraktor Bangunan.  
   * **Skenario:** Kontraktor menemukan *landing page* Toko Bangunan, melihat kategori produk yang dijual, dan mengisi formulir "Minta Penawaran".  
   * **Hasil:** Admin toko bangunan menerima notifikasi berisi daftar kebutuhan material dan segera menghubungi kontraktor tersebut.  
3. **Wisatawan Mencari Informasi Desa Wisata**  
   * **Aktor:** Wisatawan Domestik.  
   * **Skenario:** Wisatawan menemukan *landing page* BUMDes, melihat informasi tentang unit usaha "Desa Wisata", dan mengirim pesan melalui formulir kontak untuk menanyakan paket wisata.  
   * **Hasil:** Admin BUMDes menerima pertanyaan dan membalas dengan informasi paket wisata.

**5\. Dependencies**

* Konten profil, layanan, dan foto dari setiap klien.  
* Akses ke *email* atau sistem CRM klien untuk integrasi formulir.  
* Desain UI/UX yang memiliki komponen "slot" yang dapat diisi konten dinamis sesuai jenis klien.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Akuisisi Klien/Anggota Baru | Sebagai calon klien/anggota, saya ingin bisa mendaftar atau menghubungi bisnis dengan mudah melalui landing page sehingga saya bisa dengan cepat terhubung dengan bisnis tersebut. | Sebagai calon klien/anggota, ketika saya mengisi formulir kontak/pendaftaran di landing page, maka data saya akan terkirim ke pemilik bisnis dan saya akan menerima konfirmasi. | Highest | \- Landing page menampilkan formulir yang sesuai dengan jenis bisnis (Pendaftaran/Penawaran/Kontak).  \- Validasi input pada formulir berfungsi dengan baik.  \- Setelah submit, sistem mengirimkan notifikasi ke email admin klien.  \- Pengunjung melihat halaman "Terima Kasih" atau pesan konfirmasi. |
| Tampilan Informasi Adaptif | Sebagai pemilik bisnis, saya ingin landing page saya secara otomatis menampilkan informasi yang relevan dengan jenis bisnis saya agar halaman saya terlihat profesional dan tepat sasaran. | Sebagai pemilik bisnis, ketika saya memilih jenis bisnis (misal: "Toko Bangunan") saat setup awal, maka landing page saya akan otomatis menggunakan template headline, layanan, dan CTA yang sesuai untuk toko bangunan. | Highest | \- Sistem memiliki template konten yang berbeda untuk Koperasi, UMKM Toko Bangunan, dan BUMDes.  \- Pemilihan jenis bisnis saat onboarding akan menentukan template mana yang digunakan.  \- Semua bagian (Hero, Layanan, CTA) berubah sesuai template yang dipilih. |

## Modul Pengaturan

| Product Name | Modul Pengaturan (PWA SaaS) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 15 Oktober 2025 (Estimasi Awal) |
| Stage | Development |
| Status | In progress |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester |

1\. Description

Modul Pengaturan adalah pusat kontrol terpusat yang hanya dapat diakses oleh pengguna dengan peran "Admin". Modul ini memungkinkan admin untuk mengkonfigurasi, menyesuaikan, dan mengelola semua aspek fungsional dan operasional aplikasi, mulai dari informasi dasar bisnis, manajemen pengguna, hingga aturan-aturan spesifik untuk setiap modul yang diaktifkan. Pengaturan akan diorganisir ke dalam sub-menu yang logis untuk memastikan kemudahan navigasi dan penggunaan.

2\. Objectives & Success Metrics

Objectives:

* Menyediakan satu lokasi terpusat untuk semua konfigurasi aplikasi.  
* Memberdayakan admin untuk menyesuaikan PWA agar sesuai dengan proses bisnis unik mereka.  
* Menyajikan antarmuka pengaturan yang terstruktur, intuitif, dan mudah dinavigasi.

**Success Metrics:**

* Rendahnya jumlah tiket bantuan yang menanyakan lokasi sebuah pengaturan.  
* Tingginya tingkat penggunaan fitur-fitur konfigurasi oleh klien.  
* Pengguna dapat menemukan dan mengubah pengaturan spesifik dalam waktu singkat.

3\. Features

Antarmuka Pengaturan akan dibagi menjadi beberapa bagian utama.

1. **Pengaturan Umum**  
   * **Profil Bisnis:** Mengedit informasi dasar bisnis seperti Logo, Nama Bisnis, Alamat, dan Kontak (Email, Nomor Telepon).  
   * **Pengguna & Hak Akses:** Mengundang pengguna baru melalui email dan mengelola pengguna yang ada dengan menetapkan peran (misal: Admin, Kasir).  
   * **Langganan & Modul:** Terdapat *link* menuju "Modul Manajemen Modul & Langganan" untuk mengaktifkan/menonaktifkan fitur dan melihat tagihan.  
2. **Pengaturan Penjualan**  
   * **Kasir (POS):** Kustomisasi teks di bagian *header* dan *footer* struk serta mengaktifkan/menonaktifkan perhitungan pajak dan mengatur persentasenya.  
   * **Harga Bertingkat:** Membuat, mengedit, dan menghapus tingkatan harga (misal: "Harga Grosir", "Harga Kontraktor").  
3. **Pengaturan Inventaris**  
   * **Kategori Produk:** Membuat, mengedit, dan menghapus kategori untuk pengorganisasian produk.  
   * **Satuan Produk:** Membuat daftar satuan yang sering digunakan (misal: Pcs, Kg, Sak) untuk mempercepat input produk.  
4. **Pengaturan Koperasi** (Hanya tampil jika jenis bisnis adalah "Koperasi")  
   * **Simpanan:** Menetapkan nominal Simpanan Pokok yang wajib dibayar sekali dan Simpanan Wajib yang harus dibayar berkala.  
   * **Pinjaman & Pembiayaan:** Menetapkan Suku Bunga *default* untuk pinjaman konvensional dan mengkonfigurasi parameter untuk Penilaian Risiko Otomatis.  
   * **Sisa Hasil Usaha (SHU):** Menetapkan persentase alokasi SHU sesuai AD/ART.  
5. **Pengaturan BUMDes** (Hanya tampil jika jenis bisnis adalah "BUMDes")  
   * **Unit Usaha:** Membuat, mengedit, dan mengelola unit-unit usaha yang dimiliki.  
   * **Aset Sewa:** Mengelola kategori aset dan pengaturan *default* untuk Modul Manajemen Aset.

**4\. Use Case**

1. **Admin Koperasi Menetapkan Aturan SHU**  
   * **Aktor:** Admin Koperasi.  
   * **Skenario:** Setelah Rapat Anggota Tahunan (RAT), Admin membuka Pengaturan \> Pengaturan Koperasi \> SHU, lalu memasukkan persentase pembagian SHU yang baru disepakati.  
   * **Hasil:** Sistem menyimpan aturan alokasi baru yang akan digunakan oleh Modul SHU pada saat perhitungan di akhir tahun.  
2. **Admin Toko Bangunan Menambah Peran Pengguna Baru**  
   * **Aktor:** Admin Toko Bangunan.  
   * **Skenario:** Admin merekrut kasir baru. Ia masuk ke Pengaturan \> Pengaturan Umum \> Pengguna & Hak Akses, lalu mengundang *email* kasir baru dengan peran "Kasir".  
   * **Hasil:** Kasir baru menerima undangan, dan setelah mendaftar, akunnya hanya memiliki akses ke Modul Kasir (POS).

**5\. Dependencies**

* **Manajemen Akun:** Hanya pengguna dengan peran "Admin" yang dapat mengakses Modul Pengaturan.  
* **Semua Modul Lainnya:** Modul Pengaturan berisi konfigurasi untuk hampir semua modul lain. Perubahan di sini akan secara langsung memengaruhi cara kerja modul-modul tersebut.  
* **UI/UX Design:** Membutuhkan desain tata letak yang sangat terstruktur agar pengguna tidak bingung dengan banyaknya pilihan.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Konfigurasi Bisnis & Tim | Sebagai Admin, saya ingin bisa mengatur informasi dasar bisnis saya dan mengelola akses tim saya. | Sebagai Admin, ketika saya membuka halaman Pengaturan, maka saya bisa mengubah logo bisnis saya dan mengundang pengguna baru sebagai "Kasir". | Highest | \- Admin dapat mengubah Nama Bisnis, Alamat, dan Logo.  \- Admin dapat mengundang pengguna baru via email dan menetapkan peran "Kasir".  \- Pengguna dengan peran "Kasir" hanya bisa mengakses fitur yang diizinkan (misal: POS). |
| Konfigurasi Aturan Operasional | Sebagai Admin Toko Bangunan, saya ingin bisa membuat beberapa tingkatan harga jual untuk pelanggan yang berbeda. | Sebagai Admin, ketika saya masuk ke Pengaturan Penjualan, maka saya bisa membuat tingkatan harga baru bernama "Grosir". | High | \- Terdapat sub-menu "Harga Bertingkat" di dalam Pengaturan Penjualan.  \- Admin dapat menambahkan tingkatan harga baru.  \- Tingkatan harga yang baru dibuat ini akan tersedia sebagai pilihan di Modul Inventaris. |
| Konfigurasi Spesifik Koperasi | Sebagai Admin Koperasi, saya ingin bisa menetapkan jumlah Simpanan Pokok dan Simpanan Wajib sesuai AD/ART. | Sebagai Admin, ketika saya membuka Pengaturan Koperasi, maka saya dapat memasukkan nominal untuk Simpanan Pokok dan Simpanan Wajib. | High | \- Terdapat halaman "Pengaturan Koperasi" yang hanya bisa diakses oleh klien tipe Koperasi.  \- Terdapat input field untuk mengatur nominal Simpanan Pokok dan Simpanan Wajib.  \- Nilai yang disimpan di sini akan digunakan di seluruh aplikasi (misal: saat pendaftaran anggota baru). |

## Modul FAQ (Pusat Bantuan)

| Product Name | Modul FAQ (Pusat Bantuan) |
| :---- | :---- |
| Product Manager | Yosh Wakatta |
| Shipping Date | 31 Maret 2026 (Estimasi) |
| Stage | Scoping |
| Status | To Do |
| Teams | Designer, Developer (\[BE\], \[FE\]), QA Tester, Content Writer |

1\. Description

Modul FAQ (Pusat Bantuan) adalah sebuah halaman informasional terpusat yang dapat diakses oleh semua pengguna PWA. Modul ini berfungsi sebagai pusat bantuan mandiri (self-service) yang berisi daftar pertanyaan yang sering diajukan beserta jawabannya yang jelas dan terstruktur. Tujuannya adalah untuk memberdayakan pengguna agar dapat menyelesaikan masalah dan menjawab pertanyaan mereka sendiri secara cepat, sekaligus mengurangi volume pertanyaan yang masuk ke tim layanan pelanggan (customer support).

2\. Objectives & Success Metrics

Objectives:

* Mengurangi Volume Tiket Bantuan: Menurunkan jumlah pertanyaan repetitif dan "cara penggunaan" yang diterima oleh tim *customer support*.  
* Meningkatkan Kepuasan & Kemandirian Pengguna: Memberikan pengguna alat untuk menemukan solusi secara instan tanpa harus menunggu balasan dari tim *support*.  
* Menyediakan Sumber Dokumentasi yang Terstruktur: Menciptakan satu sumber kebenaran untuk semua panduan penggunaan aplikasi yang mudah dikelola dan diperbarui.

**Success Metrics:**

* Penurunan jumlah tiket bantuan terkait "cara penggunaan" sebesar \>20% dalam 3 bulan setelah peluncuran.  
* Tingkat kepuasan "Jawaban Membantu" pada artikel FAQ mencapai \>75%.  
* Waktu yang dibutuhkan tim internal untuk mempublikasikan atau memperbarui artikel FAQ kurang dari 5 menit.

3\. Features

3.1. Sisi Pengguna: Halaman FAQ (User-Facing)

1. **Pencarian Cepat (*Live Search*):** Sebuah bar pencarian yang diletakkan di bagian atas halaman. Hasil pencarian akan langsung muncul dan terfilter saat pengguna mengetik, mencari kata kunci pada judul pertanyaan dan isi jawaban.  
2. **Struktur Kategori:** Pertanyaan dikelompokkan ke dalam kategori yang logis untuk memudahkan navigasi, seperti "Memulai (Pendaftaran & Login)", "Akun & Langganan", "Manajemen Inventaris", "Kasir (POS)", "Laporan & Analitik", dan "Pengaturan Koperasi".  
3. **Tampilan Pertanyaan (*Accordion*):** Saat pertanyaan diklik, area di bawahnya akan mengembang untuk menampilkan jawaban. Jawaban dapat berisi teks, gambar (*screenshot*), atau GIF.  
4. **Mekanisme Umpan Balik Sederhana:** Di akhir setiap jawaban, terdapat pertanyaan "Apakah artikel ini membantu?" dengan tombol "Ya" dan "Tidak".

**3.2. Sisi Admin: Sistem Manajemen Konten (CMS) FAQ**

1. **Manajemen Artikel FAQ:** Antarmuka khusus bagi admin atau tim konten untuk melakukan CRUD (*Create, Read, Update, Delete*) pada artikel FAQ. Menggunakan *Rich Text Editor* untuk memformat jawaban (bold, italic, list, memasukkan gambar).  
2. **Manajemen Kategori:** Admin dapat membuat, mengubah nama, dan menghapus kategori FAQ.  
3. **Dasbor Analitik FAQ:** Menampilkan data sederhana untuk setiap artikel, seperti jumlah total berapa kali artikel dilihat dan hasil umpan balik (jumlah klik "Ya" vs "Tidak"). Ini membantu tim mengidentifikasi artikel yang paling dibutuhkan dan yang perlu diperbaiki.

**4\. Use Case**

1. **Kasir Baru Lupa Cara Cetak Struk**  
   * **Aktor:** Kasir.  
   * **Skenario:** Seorang kasir baru lupa langkah-langkah untuk mencetak ulang struk transaksi yang sudah lewat. Ia membuka menu "Bantuan/FAQ", mengetik "cetak struk" di pencarian.  
   * **Hasil:** Artikel yang relevan muncul, menunjukkan langkah-langkah dengan gambar. Kasir dapat menyelesaikan tugasnya tanpa perlu menelepon manajernya.  
2. **Pemilik BUMDes Ingin Mengaktifkan Modul Baru**  
   * **Aktor:** Admin BUMDes.  
   * **Skenario:** Pemilik ingin mencoba Modul Aset & Sewa namun tidak yakin bagaimana caranya. Ia membuka FAQ, masuk ke kategori "Akun & Langganan", dan menemukan pertanyaan "Bagaimana cara mengaktifkan modul baru?".  
   * **Hasil:** Artikel menjelaskan langkah-langkah untuk masuk ke halaman langganan dan mengaktifkan modul.

**5\. Dependencies**

* Konten: Keberhasilan modul ini sangat bergantung pada ketersediaan konten yang berkualitas, jelas, dan relevan. Membutuhkan alokasi waktu dari tim produk atau *content writer*.  
* UI/UX Design: Desain antarmuka yang bersih, intuitif, dan sangat fungsional untuk pencarian adalah krusial.

**6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Pencarian Jawaban Mandiri | Sebagai pengguna, ketika saya memiliki pertanyaan, saya ingin dapat mencari dan menemukan jawabannya sendiri di dalam aplikasi agar saya dapat menyelesaikan masalah saya dengan cepat. | Sebagai pengguna, ketika saya mengakses halaman FAQ, maka saya dapat mencari pertanyaan saya menggunakan kata kunci atau menelusuri berdasarkan kategori. | Highest | \- Terdapat halaman "FAQ" atau "Pusat Bantuan". \- Halaman memiliki bar pencarian yang fungsional. \- Pertanyaan dikelompokkan dalam kategori yang logis. \- Mengklik pertanyaan akan menampilkan jawabannya dalam format akordion. |
| Manajemen Konten FAQ | Sebagai tim support, saya ingin bisa dengan mudah menambah dan mengubah artikel bantuan. | Sebagai tim support, ketika saya membuka CMS FAQ, maka saya bisa membuat artikel baru, menulis jawabannya, dan mengaturnya ke dalam sebuah kategori. | Highest | \- Terdapat halaman admin untuk manajemen FAQ. \- Terdapat formulir untuk membuat/mengedit artikel dengan rich text editor. \- Admin dapat membuat, mengedit, dan menghapus kategori. \- Perubahan yang disimpan akan langsung tampil di halaman FAQ untuk pengguna. |
| Peningkatan Kualitas Bantuan | Sebagai manajer produk, saya ingin tahu artikel bantuan mana yang paling efektif dan mana yang tidak agar saya bisa terus meningkatkan kualitas dokumentasi. | Sebagai manajer produk, ketika saya membuka dasbor analitik FAQ, maka saya bisa melihat jumlah view dan skor "membantu" untuk setiap artikel. | High | \- Setiap jawaban memiliki tombol umpan balik "Ya/Tidak". \- Klik pada tombol tersebut akan disimpan di database. \- Terdapat halaman admin yang menampilkan statistik per artikel (jumlah view, jumlah "Ya", jumlah "Tidak"). |

