## Dasbor Billing

| Product Name | Dasbor Billing |
| :---- | :---- |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 1 September 2025 (Estimasi) |
| **Stage** | Development |
| **Status** | In Progress |
| **Teams** | Designer, Developer \[BE\], \[FE\], QA Tester |

---

**Deskripsi** Dasbor Billing adalah dasbor terpusat yang memungkinkan administrator vendor untuk mengelola klien yang berlangganan produk SaaS. Klien saat ini meliputi Koperasi Swasta, Bumdes, dan UMKM Toko Bangunan, dengan potensi untuk klien lainnya. Dasbor ini bertujuan untuk menyediakan fungsionalitas komprehensif bagi administrator vendor, termasuk pelacakan klien, manajemen izin pengguna, pengelolaan produk, penanganan tagihan (invoice), penerbitan notifikasi, dan penyelesaian tiket masalah.

**FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)** **Tujuan:**

* Memberikan administrator vendor platform terpusat untuk mengelola operasi produk SaaS.  
* Meningkatkan efisiensi dalam mengelola klien, modul produk, tagihan, dan tiket masalah.  
* Menyediakan visibilitas yang jelas mengenai status klien dan metrik bisnis penting lainnya.

**FITUR (FEATURES):**

1. **Dashboard Beranda (Home)**  
   * Ringkasan visual metrik utama (misalnya, jumlah klien aktif, pendapatan, tiket terbuka).  
   * Tampilan notifikasi dan aktivitas terbaru.  
2. **Manajemen Modul (Product)**  
   * **Modul MVP (Minimum Viable Product):**  
     * Dashboard Utama  
     * Manajemen Akun  
     * Manajemen Modul  
     * Manajemen Inventaris  
     * POS  
     * Marketplace  
     * Laporan Keuangan  
     * Landing Page  
     * Pengaturan  
     * FAQ  
   * **Modul Lanjutan:**  
     * Manajemen Harga Bertingkat  
     * Manajemen Unit Usaha  
     * Manajemen Aset & Jadwal Sewa  
     * Modul Simpanan (Syariah dan Non)  
     * Modul Pinjaman dan Pembiayaan Syariah  
     * Modul Pembagian SHU  
     * Modul Manajemen Anggota  
   * Administrator dapat membuat, mengedit, atau menonaktifkan modul untuk klien tertentu.  
3. **Manajemen Klien (Clients)**  
   * Daftar semua klien yang berlangganan.  
   * Informasi detail klien (nama, jenis klien, status langganan, tanggal bergabung).  
   * Kemampuan untuk mencari dan memfilter klien berdasarkan kriteria tertentu.  
4. **Manajemen Tagihan (Invoices)**  
   * Daftar semua tagihan yang dihasilkan, dengan status (belum dibayar, dibayar, jatuh tempo).  
   * Opsi untuk membuat tagihan baru, melihat detail, dan mengirim ulang tagihan.  
5. **Manajemen Pengguna (User Management)**  
   * Pengelolaan izin dan peran pengguna untuk akses dasbor.  
   * Menambahkan, mengedit, atau menghapus akun pengguna administrator vendor.  
6. **Notifikasi (Notifications)**  
   * Sistem untuk membuat dan menerbitkan notifikasi ke satu atau beberapa klien.  
   * Riwayat notifikasi yang telah dikirim.  
7. **Tiket Masalah (Trouble Tickets)**  
   * Sistem terintegrasi untuk melacak tiket masalah yang diajukan oleh klien.  
   * Status tiket (terbuka, sedang diproses, selesai).  
   * Administrator dapat menetapkan tiket kepada tim yang sesuai dan memperbarui status.

**USE CASE**

1. **Administrator Vendor Mengelola Langganan Klien**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator masuk ke dasbor, memilih "Clients", dan melihat daftar klien. Dia dapat mengklik klien tertentu untuk melihat detail langganan dan status pembayaran.  
   * **Hasil:** Administrator dapat memantau status semua klien dan mengambil tindakan yang diperlukan, seperti memperbarui paket langganan.  
2. **Administrator Vendor Membuat dan Mengirim Tagihan**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator masuk ke dasbor, memilih "Invoices", dan membuat tagihan baru untuk klien. Dia memasukkan detail biaya dan mengirimkannya melalui sistem.  
   * **Hasil:** Tagihan yang akurat dan terperinci dibuat dan dikirimkan kepada klien.  
3. **Administrator Vendor Menyelesaikan Tiket Masalah Klien**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Klien mengajukan tiket masalah. Administrator melihat notifikasi tiket baru, membuka tiket di dasbor, dan menugaskannya kepada tim dukungan. Setelah masalah selesai, administrator memperbarui status tiket menjadi "selesai".  
   * **Hasil:** Masalah klien ditangani dan diselesaikan secara efisien, dengan riwayat komunikasi yang tercatat.

**DEPENDENCIES**

1. Akses ke database klien dan informasi langganan.  
2. Integrasi dengan sistem pembayaran untuk pemrosesan tagihan.  
3. Infrastruktur server dan hosting yang stabil.  
4. Tim dukungan pelanggan untuk menindaklanjuti tiket masalah.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Klien & Tagihan | Sebagai administrator vendor, saya ingin melihat dan mengelola klien serta tagihan mereka secara terpusat. | Sebagai administrator vendor, ketika saya masuk ke dasbor, maka saya akan melihat daftar klien dan tagihan mereka. | Highest | \- Dasbor menampilkan daftar klien dengan informasi kunci.  \- Terdapat modul "Invoices" yang menampilkan semua tagihan.  \- Administrator dapat mencari, memfilter, dan melihat detail klien serta tagihan. |
| Manajemen Notifikasi | Sebagai administrator vendor, saya ingin mengirim notifikasi penting ke klien tanpa harus menggunakan email eksternal. | Sebagai administrator vendor, ketika saya membuat notifikasi baru, maka notifikasi tersebut akan terkirim ke klien yang dituju dan tercatat dalam sistem. | High | \- Administrator dapat menulis dan mengirim notifikasi.  \- Notifikasi dapat ditargetkan ke klien spesifik atau semua klien.  \- Riwayat notifikasi yang dikirimkan tersimpan. |
| Resolusi Tiket Masalah | Sebagai administrator vendor, saya ingin melacak dan menyelesaikan masalah yang dilaporkan klien. | Sebagai administrator vendor, ketika klien mengajukan tiket masalah, maka saya akan menerima notifikasi dan dapat mengelola tiket tersebut hingga selesai. | Highest | \- Sistem notifikasi untuk tiket baru.  \- Administrator dapat menetapkan tiket ke tim yang tepat.  \- Administrator dapat memperbarui status tiket dan menambahkan catatan.  \- Klien dapat melihat status tiket mereka. |

## Dasbor Beranda (Home)

**Nama Fitur:** Dasbor Beranda (Home) 

**Manajer Produk:** Yosh Wakatta 

**Tanggal Pengiriman:** 1 Desember 2025 (Estimasi) 

**Tahap:** Development 

**Status:** In Progress 

**Tim:**

* Designer  
* Developer \[BE\], \[FE\]  
* QA Tester

**Deskripsi** Fitur "Home" adalah halaman utama Dasbor Billing yang berfungsi sebagai titik awal bagi administrator vendor. Halaman ini menyediakan ringkasan visual dan metrik penting secara

*real-time* untuk memberikan gambaran umum tentang status bisnis, klien, dan operasional. Tujuannya adalah untuk memungkinkan administrator memantau status secara cepat dan efisien.

**FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)** **Tujuan:**

* Memberikan ringkasan metrik utama secara  
   *real-time*.  
* Menyediakan akses cepat ke informasi penting seperti jumlah klien aktif, pendapatan, dan tiket terbuka.  
* Meningkatkan efisiensi administrator dengan menampilkan aktivitas dan notifikasi terbaru.

**FITUR (FEATURES):**

1. **Ringkasan Metrik Utama (Key Metrics Summary)**  
   * **Jumlah Klien Aktif:** Menampilkan total jumlah klien dengan langganan aktif.  
   * **Pendapatan (Revenue):** Menampilkan total pendapatan (misalnya, per bulan atau per kuartal) dari semua klien.  
   * **Tiket Terbuka (Open Tickets):** Menampilkan jumlah tiket masalah yang belum diselesaikan.  
   * **Klien Baru (New Clients):** Menampilkan jumlah klien baru yang bergabung dalam periode waktu tertentu (misalnya, 30 hari terakhir).  
2. **Grafik Pertumbuhan (Growth Chart)**  
   * **Jenis Grafik:** Grafik garis (line chart) yang dapat menampilkan pertumbuhan jumlah klien atau pendapatan.  
   * **Filter Waktu:** Pengguna dapat memfilter tampilan grafik berdasarkan periode waktu (misalnya, mingguan, bulanan, tahunan).  
3. **Tampilan Notifikasi dan Aktivitas Terbaru (Recent Notifications & Activities)**  
   * **Notifikasi:** Bagian ini menampilkan daftar notifikasi penting yang diterbitkan oleh sistem atau administrator.  
   * **Aktivitas:** Menampilkan log aktivitas terbaru, seperti tagihan yang dibayarkan, tiket masalah yang ditutup, atau modul baru yang diaktifkan.

**USE CASE**

1. **Administrator Vendor Memantau Kesehatan Bisnis**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Setelah masuk ke Dasbor Billing, administrator langsung menuju halaman "Home" untuk melihat ringkasan metrik. Dia melihat jumlah klien aktif dan pendapatan untuk menilai kesehatan bisnis.  
   * **Hasil:** Administrator mendapatkan pemahaman cepat tentang kinerja bisnis secara keseluruhan.  
2. **Administrator Vendor Merespons Tiket Masalah Mendesak**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator masuk ke dasbor dan melihat bagian "Tiket Terbuka" pada halaman "Home". Dia melihat ada tiket baru yang memerlukan perhatian segera.  
   * **Hasil:** Administrator dapat dengan cepat mengklik tiket tersebut dan memulai proses penyelesaian.

**DEPENDENCIES**

1. Data *real-time* dari database klien, tagihan, dan tiket masalah.  
2. Integrasi modul Manajemen Klien, Invoices, dan Trouble Tickets.  
3. Desain UI/UX untuk visualisasi data yang jelas.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Dashboard Beranda | Sebagai administrator vendor, saya ingin melihat ringkasan metrik utama bisnis agar saya dapat memantau status secara *real-time*. | Sebagai administrator vendor, ketika saya membuka halaman "Home", maka saya akan melihat metrik utama seperti jumlah klien aktif, pendapatan, dan tiket terbuka. | Highest | \- Metrik ditampilkan secara jelas dengan angka yang diperbarui secara *real-time*.  \- Data metrik akurat dan konsisten dengan modul lainnya.  \- Setiap metrik dapat diklik untuk melihat detail lebih lanjut. |
| Ringkasan Aktivitas | Sebagai administrator vendor, saya ingin melihat notifikasi dan aktivitas terbaru agar saya tidak ketinggalan informasi penting. | Sebagai administrator vendor, ketika ada aktivitas baru atau notifikasi, maka akan muncul di halaman "Home". | High | \- Bagian "Notifikasi & Aktivitas Terbaru" memuat daftar item terbaru.  \- Setiap item aktivitas menyertakan stempel waktu dan deskripsi singkat.  \- Terdapat tautan untuk mengarahkan pengguna ke halaman terkait (misalnya, detail tagihan atau tiket). |

## Manajemen Modul Produk (Product)

Nama Fitur: Manajemen Modul Produk

Manajer Produk: Yosh Wakatta

Tanggal Pengiriman: 1 Desember 2025 (Estimasi)

Tahap: Development

Status: In Progress

Tim:

* Designer  
* Developer \[BE\], \[FE\]  
* QA Tester

Deskripsi

Fitur "Manajemen Modul Produk" adalah inti dari Dasbor Billing yang memungkinkan administrator vendor untuk mengelola semua modul yang tersedia untuk ditawarkan kepada klien. Fitur ini dirancang untuk memberikan fleksibilitas kepada administrator dalam membuat, mengedit, menonaktifkan, atau mengaktifkan modul produk, serta mengkategorikannya ke dalam modul awal (MVP) dan modul lanjutan.

FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)

Tujuan:

* Menyediakan antarmuka yang intuitif untuk mengelola semua modul produk.  
* Memungkinkan administrator untuk mengklasifikasikan modul ke dalam kategori yang berbeda (MVP dan Lanjutan).  
* Memfasilitasi proses penawaran dan pengelolaan modul produk kepada klien.

**FITUR (FEATURES):**

1. **Daftar Modul**  
   * Menampilkan daftar semua modul yang tersedia.  
   * Modul dibagi menjadi dua kategori:  
     * **Modul MVP (Minimum Viable Product):**  
       * Dashboard Utama   
       * Manajemen Akun   
       * Manajemen Modul   
       * Manajemen Inventaris   
       * POS   
       * Marketplace  
       * Laporan Keuangan   
       * Landing Page   
       * Pengaturan   
       * FAQ   
     * **Modul Lanjutan:**  
       * Manajemen Harga Bertingkat   
       * Manajemen Unit Usaha   
       * Manajemen Aset & Jadwal Sewa   
       * Modul Simpanan (Syariah dan Non)   
       * Modul Pinjaman dan Pembiayaan Syariah   
       * Modul Pembagian SHU   
       * Modul Manajemen Anggota   
2. **Manajemen Modul**  
   * **Buat Modul Baru:** Administrator dapat menambahkan modul produk baru dengan detail seperti nama, deskripsi, dan harga.  
   * **Edit Modul:** Mengubah detail modul yang sudah ada.  
   * **Aktifkan/Nonaktifkan Modul:** Mengontrol ketersediaan modul untuk ditawarkan kepada klien.

**USE CASE**

1. **Administrator Menambahkan Modul Baru**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator ingin menambahkan modul "Manajemen Stok Lanjutan" ke daftar produk. Dia mengklik tombol "Tambah Modul", mengisi detail, dan menyimpannya.  
   * **Hasil:** Modul baru berhasil ditambahkan dan dapat ditawarkan kepada klien.  
2. **Administrator Mengelola Ketersediaan Modul**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator memutuskan untuk sementara menonaktifkan modul "Manajemen Harga Bertingkat" karena sedang dalam pemeliharaan. Dia pergi ke daftar modul dan mengklik tombol "Nonaktifkan" untuk modul tersebut.  
   * **Hasil:** Modul "Manajemen Harga Bertingkat" tidak lagi tersedia untuk klien baru sampai diaktifkan kembali.

**DEPENDENCIES**

1. Antarmuka database untuk menyimpan detail modul.  
2. Desain UI/UX yang jelas untuk pengelolaan modul.  
3. Integrasi dengan modul "Klien" untuk memungkinkan administrator mengaktifkan atau menonaktifkan modul untuk klien tertentu.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Modul Produk | Sebagai administrator vendor, saya ingin melihat, membuat, dan mengedit modul produk yang akan ditawarkan ke klien. | Sebagai administrator vendor, ketika saya masuk ke Dasbor Billing dan memilih "Product", maka saya dapat melihat daftar modul yang tersedia. | Highest | \- Antarmuka menampilkan daftar semua modul.  \- Terdapat opsi untuk membuat, mengedit, dan menghapus modul.  \- Modul diklasifikasikan ke dalam kategori MVP dan Lanjutan. |
| Aktivasi/Nonaktifasi Modul | Sebagai administrator vendor, saya ingin dapat mengaktifkan atau menonaktifkan modul produk untuk mengontrol ketersediaannya. | Sebagai administrator vendor, ketika saya mengklik tombol "Nonaktifkan" pada suatu modul, maka modul tersebut tidak akan tersedia lagi untuk klien. | High | \- Terdapat tombol atau *toggle* untuk mengaktifkan/menonaktifkan setiap modul.  \- Status modul (aktif/nonaktif) terlihat jelas.  \- Perubahan status modul akan segera tercermin di sistem. |

## Manajemen Klien (Clients)

Nama Fitur: Manajemen Klien (Clients)

Manajer Produk: Yosh Wakatta

Tanggal Pengiriman: 1 Desember 2025 (Estimasi)

Tahap: Development

Status: In Progress

Tim:

* Designer  
* Developer \[BE\], \[FE\]  
* QA Tester

Deskripsi

Fitur "Manajemen Klien" adalah modul penting dalam Dasbor Billing yang memungkinkan administrator vendor untuk mengelola semua klien yang berlangganan produk SaaS. Modul ini menyediakan antarmuka terpusat untuk melihat, melacak, dan mengelola informasi detail setiap klien, status langganan, dan riwayat interaksi. Tujuannya adalah untuk memberikan administrator kontrol penuh dan visibilitas terhadap basis klien mereka.

FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)

Tujuan:

* Menyediakan daftar klien yang terorganisir dan mudah diakses.  
* Memungkinkan administrator untuk melihat informasi detail setiap klien.  
* Memfasilitasi pelacakan status langganan klien.

**FITUR (FEATURES):**

1. **Daftar Klien (Clients List)**  
   * Tampilan tabel yang menampilkan semua klien yang berlangganan.  
   * Kolom informasi yang ditampilkan: Nama Klien, Jenis Klien (Koperasi, Bumdes, UMKM), Status Langganan (Aktif, Nonaktif, Jatuh Tempo), Tanggal Bergabung.  
   * Fungsi pencarian untuk mencari klien berdasarkan nama atau ID.  
   * Filter untuk menyaring daftar klien berdasarkan Status Langganan atau Jenis Klien.  
   * Paginasi untuk menangani daftar klien dalam jumlah besar.  
2. **Detail Klien (Client Details)**  
   * Halaman khusus untuk setiap klien yang menampilkan informasi terperinci, termasuk:  
     * **Profil:** Nama lengkap, alamat, nomor kontak, email, dan nama kontak utama.  
     * **Langganan:** Status langganan saat ini, paket yang diambil, tanggal mulai, dan tanggal jatuh tempo.  
     * **Riwayat:** Log aktivitas klien, seperti riwayat pembayaran, tiket masalah yang pernah diajukan, dan notifikasi yang diterima.  
     * **Modul Aktif:** Daftar modul produk yang saat ini diaktifkan untuk klien tersebut.  
3. **Manajemen Klien**  
   * **Edit Profil:** Administrator dapat mengedit informasi dasar klien.  
   * **Ubah Status Langganan:** Mengubah status langganan klien (misalnya, dari "Aktif" menjadi "Nonaktif").  
   * **Aktifkan/Nonaktifkan Modul:** Mengaktifkan atau menonaktifkan modul produk untuk klien tertentu.

**USE CASE**

1. **Administrator Vendor Melacak Status Klien**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator ingin memeriksa klien mana yang langganannya akan segera jatuh tempo. Dia masuk ke Dasbor Billing, memilih modul "Clients", dan menggunakan filter "Jatuh Tempo".  
   * **Hasil:** Sistem menampilkan daftar klien yang langganannya akan segera berakhir, memungkinkan administrator untuk proaktif menindaklanjuti.  
2. **Administrator Vendor Memperbarui Informasi Klien**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Seorang klien menghubungi administrator untuk memperbarui nomor kontak mereka. Administrator mencari nama klien, membuka halaman detail, dan mengedit informasi kontak yang baru.  
   * **Hasil:** Informasi klien diperbarui secara akurat di dalam sistem.

**DEPENDENCIES**

1. Integrasi dengan database klien untuk mengambil dan menyimpan data.  
2. Integrasi dengan modul "Invoices" dan "Trouble Tickets" untuk menampilkan riwayat aktivitas klien.  
3. Desain UI/UX yang jelas dan mudah dinavigasi.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Klien | Sebagai administrator vendor, saya ingin melihat daftar klien yang terorganisir untuk memantau status langganan mereka. | Sebagai administrator vendor, ketika saya masuk ke Dasbor Billing dan memilih "Clients", maka saya akan melihat daftar klien dengan detail yang relevan. | Highest | \- Daftar klien menampilkan nama, jenis, dan status langganan.  \- Fitur pencarian dan filter berfungsi dengan baik untuk menyaring klien.  \- Paginasi diterapkan pada daftar klien. |
| Detail Klien | Sebagai administrator vendor, saya ingin melihat informasi detail setiap klien, termasuk riwayat mereka, agar saya dapat memberikan layanan yang lebih baik. | Sebagai administrator vendor, ketika saya mengklik nama klien dari daftar, maka saya akan diarahkan ke halaman detail yang menampilkan semua informasi terkait. | Highest | \- Halaman detail klien menampilkan profil, status langganan, dan riwayat. \- Administrator dapat mengedit informasi klien dari halaman ini.  \- Informasi modul yang diaktifkan untuk klien juga terlihat. |

## Manajemen Tagihan (Invoices)

Nama Fitur: Manajemen Tagihan (Invoices)

Manajer Produk: Yosh Wakatta

Tanggal Pengiriman: 1 Desember 2025 (Estimasi)

Tahap: Development

Status: In Progress

Tim:

* Designer  
* Developer \[BE\], \[FE\]  
* QA Tester

Deskripsi

Fitur "Manajemen Tagihan" adalah modul krusial dalam Dasbor Billing yang dirancang untuk mengelola siklus penagihan secara efisien. Modul ini memungkinkan administrator vendor untuk membuat, melihat, dan melacak semua tagihan (invoice) yang dihasilkan untuk klien. Tujuannya adalah untuk menyederhanakan proses penagihan, memastikan akurasi data finansial, dan memberikan visibilitas penuh terhadap status pembayaran.

FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)

Tujuan:

* Memungkinkan administrator untuk membuat tagihan baru dengan mudah.  
* Menyediakan pelacakan status pembayaran yang jelas dan *real-time*.  
* Mempermudah administrator untuk melihat, mengunduh, dan mengirim ulang tagihan.

**FITUR (FEATURES):**

1. **Daftar Tagihan (Invoices List)**  
   * Tampilan tabel yang menampilkan semua tagihan yang dihasilkan.  
   * Kolom informasi yang ditampilkan: Nomor Tagihan, Nama Klien, Tanggal Dibuat, Tanggal Jatuh Tempo, Jumlah, Status Pembayaran (Belum Dibayar, Dibayar, Jatuh Tempo).  
   * Fungsi pencarian berdasarkan Nomor Tagihan atau Nama Klien.  
   * Filter untuk menyaring daftar tagihan berdasarkan Status Pembayaran atau Tanggal Jatuh Tempo.  
   * Opsi pengurutan (sorting) berdasarkan tanggal atau jumlah.  
2. **Detail Tagihan (Invoice Details)**  
   * Halaman khusus untuk setiap tagihan yang menampilkan informasi terperinci, termasuk:  
     * **Informasi Dasar:** Nomor Tagihan, Nama Klien, Alamat Klien, Tanggal Dibuat, Tanggal Jatuh Tempo.  
     * **Item Tagihan:** Daftar item yang ditagih (misalnya, langganan modul A, biaya tambahan) dengan deskripsi, jumlah, dan total.  
     * **Ringkasan Pembayaran:** Subtotal, pajak, diskon, dan total yang harus dibayar.  
     * **Riwayat Pembayaran:** Jika tagihan sudah dibayar, detail pembayaran (metode, tanggal, jumlah) akan tercatat.  
3. **Aksi Tagihan (Invoice Actions)**  
   * **Buat Tagihan Baru:** Formulir yang memungkinkan administrator untuk membuat tagihan manual untuk klien, dengan detail seperti nama klien, item yang ditagih, dan tanggal jatuh tempo.  
   * **Kirim/Kirim Ulang Tagihan:** Opsi untuk mengirim tagihan melalui email ke klien.  
   * **Perbarui Status Pembayaran:** Administrator dapat memperbarui status tagihan menjadi "Dibayar" secara manual jika pembayaran diterima di luar sistem.  
   * **Cetak/Unduh Tagihan:** Opsi untuk mengunduh tagihan dalam format PDF.

**USE CASE**

1. **Administrator Vendor Melacak Pembayaran yang Belum Diterima**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator ingin melihat semua tagihan yang sudah jatuh tempo namun belum dibayar. Dia masuk ke modul "Invoices" dan menggunakan filter "Jatuh Tempo".  
   * **Hasil:** Sistem menampilkan daftar tagihan yang perlu ditindaklanjuti, membantu administrator untuk mengirimkan pengingat pembayaran.  
2. **Administrator Vendor Membuat Tagihan Manual**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Seorang klien membutuhkan tagihan untuk biaya tambahan yang tidak termasuk dalam langganan reguler. Administrator membuat tagihan baru, mengisi detail, dan mengirimkannya ke klien.  
   * **Hasil:** Klien menerima tagihan yang akurat untuk biaya tambahan tersebut.

**DEPENDENCIES**

1. Integrasi dengan database tagihan untuk menyimpan dan mengambil data.  
2. Integrasi dengan modul "Klien" untuk menarik informasi klien.  
3. Integrasi dengan sistem email untuk pengiriman tagihan.  
4. Desain UI/UX yang jelas untuk formulir pembuatan tagihan dan daftar.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Tagihan | Sebagai administrator vendor, saya ingin melihat dan mengelola semua tagihan yang dibuat untuk klien. | Sebagai administrator vendor, ketika saya masuk ke modul "Invoices", maka saya akan melihat daftar tagihan dengan status pembayaran yang jelas. | Highest | \- Daftar tagihan ditampilkan dalam tabel dengan informasi kunci.  \- Fitur pencarian dan filter berfungsi dengan baik.  \- Status pembayaran (Belum Dibayar, Dibayar, Jatuh Tempo) terlihat jelas. |
| Detail dan Aksi Tagihan | Sebagai administrator vendor, saya ingin dapat membuat, melihat detail, dan mengambil tindakan (seperti mengirim ulang) pada setiap tagihan. | Sebagai administrator vendor, ketika saya mengklik sebuah tagihan, maka saya akan melihat detail lengkapnya dan dapat melakukan aksi terkait. | High | \- Halaman detail tagihan menampilkan informasi lengkap.  \- Terdapat tombol untuk membuat tagihan baru.  \- Terdapat opsi untuk mengirim ulang tagihan melalui email.  \- Tagihan dapat diunduh dalam format PDF. |

## Manajemen Pengguna (User Management)

Nama Fitur: Manajemen Pengguna (User Management)

Manajer Produk: Yosh Wakatta

Tanggal Pengiriman: 1 Desember 2025 (Estimasi)

Tahap: Development

Status: In Progress

Tim:

* Designer  
* Developer \[BE\], \[FE\]  
* QA Tester

Deskripsi

Fitur "Manajemen Pengguna" adalah modul penting dalam Dasbor Billing yang memberikan administrator vendor kemampuan untuk mengelola akses pengguna ke sistem. Modul ini memungkinkan administrator untuk membuat, mengedit, dan menghapus akun pengguna, serta mengontrol hak akses mereka melalui peran (roles) dan izin (permissions). Tujuannya adalah untuk memastikan keamanan sistem, membatasi akses ke data sensitif, dan mengatur alur kerja internal dengan efisien.

FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)

Tujuan:

* Memungkinkan administrator untuk mengelola akun pengguna internal (tim vendor) secara terpusat.  
* Memberikan kontrol granular terhadap hak akses pengguna melalui sistem peran dan izin.  
* Meningkatkan keamanan sistem dengan memastikan hanya pengguna yang berwenang yang memiliki akses ke data dan fungsi tertentu.

**FITUR (FEATURES):**

1. **Daftar Pengguna (User List)**  
   * Tampilan tabel yang menampilkan semua pengguna yang memiliki akses ke dasbor.  
   * Kolom informasi yang ditampilkan: Nama Pengguna, Email, Peran (Role), Status Akun (Aktif/Nonaktif), Tanggal Dibuat.  
   * Fungsi pencarian untuk mencari pengguna berdasarkan nama atau email.  
   * Paginasi untuk menangani daftar pengguna dalam jumlah besar.  
2. **Manajemen Pengguna**  
   * **Buat Pengguna Baru:** Formulir yang memungkinkan administrator untuk menambahkan pengguna baru dengan detail seperti nama, email, kata sandi, dan peran yang ditugaskan.  
   * **Edit Pengguna:** Administrator dapat mengubah informasi pengguna yang sudah ada, termasuk nama, email, dan peran.  
   * **Aktifkan/Nonaktifkan Akun:** Administrator dapat menonaktifkan akun pengguna sementara atau menghapusnya secara permanen.  
   * **Ubah Kata Sandi:** Opsi untuk mereset kata sandi pengguna jika diperlukan.  
3. **Manajemen Peran dan Izin (Roles & Permissions Management)**  
   * **Definisi Peran:** Administrator dapat menentukan peran (misalnya, "Admin", "Support", "Editor").  
   * **Penugasan Izin:** Setiap peran memiliki serangkaian izin yang spesifik (misalnya, "Admin" memiliki akses ke semua modul, "Support" hanya memiliki akses ke modul "Trouble Tickets").  
   * **Daftar Izin:** Daftar lengkap izin yang tersedia di setiap modul (misalnya, clients.read, clients.create, invoices.edit).

**USE CASE**

1. **Administrator Vendor Menambahkan Anggota Tim Baru**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator merekrut anggota tim baru untuk tim dukungan. Dia masuk ke modul "User Management", membuat pengguna baru dengan nama dan email, lalu menetapkan peran "Support" kepadanya.  
   * **Hasil:** Anggota tim baru memiliki akun dengan hak akses yang sesuai untuk menjalankan tugasnya.  
2. **Administrator Vendor Memodifikasi Izin Pengguna**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Seorang anggota tim dukungan dipromosikan menjadi manajer. Administrator masuk ke modul "User Management", mencari pengguna tersebut, dan mengubah perannya dari "Support" menjadi "Admin" untuk memberikan akses yang lebih luas.  
   * **Hasil:** Hak akses pengguna tersebut diperbarui sesuai dengan tanggung jawab barunya.

**DEPENDENCIES**

1. Sistem otentikasi dan otorisasi yang aman.  
2. Database pengguna dan tabel peran/izin.  
3. Desain UI/UX yang jelas untuk pengelolaan pengguna dan peran.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Pengguna | Sebagai administrator vendor, saya ingin membuat, mengedit, dan mengelola pengguna agar dapat mengontrol akses ke dasbor. | Sebagai administrator vendor, ketika saya masuk ke modul "User Management", maka saya akan melihat daftar pengguna dan dapat mengelola akun mereka. | Highest | \- Daftar pengguna menampilkan informasi kunci (nama, email, peran).  \- Terdapat opsi untuk membuat, mengedit, dan menghapus pengguna.  \- Proses pembuatan pengguna baru mencakup penugasan peran. |
| Manajemen Peran & Izin | Sebagai administrator vendor, saya ingin mendefinisikan peran dengan izin yang spesifik agar saya dapat mengontrol hak akses pengguna secara granular. | Sebagai administrator vendor, ketika saya membuat peran baru, maka saya dapat menetapkan izin yang berbeda untuk peran tersebut. | Highest | \- Administrator dapat membuat dan mengelola peran.  \- Setiap peran memiliki izin yang dapat disesuaikan.  \- Hak akses pengguna didasarkan pada peran yang ditugaskan. |

## Notifikasi (Notifications)

Nama Fitur: Notifikasi (Notifications)

Manajer Produk: Yosh Wakatta

Tanggal Pengiriman: 1 Desember 2025 (Estimasi)

Tahap: Development

Status: In Progress

Tim:

* Designer  
* Developer \[BE\], \[FE\]  
* QA Tester

Deskripsi

Fitur "Notifikasi" adalah modul penting yang memungkinkan administrator vendor untuk berkomunikasi secara efektif dengan klien. Modul ini dirancang untuk mengirimkan pengumuman penting, pembaruan produk, pengingat pembayaran, atau pesan lainnya kepada klien secara langsung melalui dasbor mereka. Tujuannya adalah untuk memastikan klien selalu mendapatkan informasi terbaru dan relevan tanpa harus beralih ke platform komunikasi eksternal.

FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)

Tujuan:

* Menyediakan saluran komunikasi internal yang efisien dari vendor ke klien.  
* Memungkinkan administrator untuk membuat dan mengirim notifikasi yang ditargetkan atau massal.  
* Memastikan klien menerima informasi penting dan tidak melewatkannya.

**FITUR (FEATURES):**

1. **Buat Notifikasi Baru (Create New Notification)**  
   * **Formulir Notifikasi:** Administrator dapat membuat notifikasi dengan mengisi formulir yang berisi:  
     * **Judul:** Judul singkat dari notifikasi.  
     * **Isi:** Pesan notifikasi yang terperinci.  
     * **Tipe:** Kategori notifikasi (misalnya, "Pembaruan Produk", "Pengingat Pembayaran", "Pengumuman").  
     * **Target:** Opsi untuk menargetkan notifikasi ke:  
       * Semua Klien  
       * Klien Spesifik (Administrator dapat memilih klien dari daftar)  
       * Jenis Klien (misalnya, hanya untuk Koperasi)  
2. **Daftar Notifikasi Terkirim (Sent Notifications List)**  
   * Tampilan tabel yang menampilkan semua notifikasi yang telah dikirim oleh administrator.  
   * Kolom informasi yang ditampilkan: Judul Notifikasi, Tanggal Dikirim, Target Notifikasi, Status Pengiriman.  
   * Fungsi pencarian dan filter untuk menemukan notifikasi yang sudah lama.  
3. **Tampilan Notifikasi di Sisi Klien**  
   * **Kotak Notifikasi:** Klien memiliki ikon notifikasi (misalnya, lonceng) di dasbor mereka. Ikon ini akan menampilkan lencana (badge) yang menunjukkan jumlah notifikasi yang belum dibaca.  
   * **Daftar Notifikasi:** Saat mengklik ikon notifikasi, klien akan melihat daftar semua notifikasi yang mereka terima, dengan status "Dibaca" atau "Belum Dibaca".  
   * **Detail Notifikasi:** Klien dapat mengklik notifikasi untuk melihat judul dan isi lengkap.

**USE CASE**

1. **Administrator Vendor Mengirim Pembaruan Produk**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator ingin mengumumkan modul baru yang telah dirilis. Dia masuk ke modul "Notifications", membuat notifikasi baru dengan tipe "Pembaruan Produk", dan mengirimkannya ke semua klien.  
   * **Hasil:** Semua klien menerima notifikasi di dasbor mereka, memberitahu mereka tentang modul baru.  
2. **Administrator Vendor Mengirim Pengingat Pembayaran**  
   * **Aktor:** Administrator Vendor  
   * **Skenario:** Administrator ingin mengirimkan pengingat pembayaran ke klien tertentu yang tagihannya sudah jatuh tempo. Dia masuk ke modul "Notifications", memilih klien tersebut sebagai target, dan mengirimkan notifikasi.  
   * **Hasil:** Klien yang bersangkutan menerima pengingat pembayaran di dasbor mereka.

**DEPENDENCIES**

1. Integrasi dengan database notifikasi untuk menyimpan data notifikasi.  
2. Integrasi dengan modul "Klien" untuk menargetkan notifikasi.  
3. Desain UI/UX untuk antarmuka pembuatan dan tampilan notifikasi.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Notifikasi | Sebagai administrator vendor, saya ingin membuat dan mengirim notifikasi kepada klien untuk mengkomunikasikan informasi penting. | Sebagai administrator vendor, ketika saya masuk ke modul "Notifications", maka saya dapat membuat notifikasi baru dan mengirimkannya ke klien. | Highest | \- Administrator dapat membuat notifikasi dengan judul, isi, dan tipe.  \- Notifikasi dapat ditargetkan ke semua klien atau klien spesifik.  \- Terdapat riwayat notifikasi yang telah dikirim. |
| Penerimaan Notifikasi Klien | Sebagai klien, saya ingin menerima notifikasi penting dari vendor di dasbor saya agar tidak ketinggalan informasi. | Sebagai klien, ketika administrator vendor mengirim notifikasi, maka notifikasi tersebut akan muncul di dasbor saya. | Highest | \- Klien memiliki kotak notifikasi yang menampilkan jumlah notifikasi yang belum dibaca.  \- Notifikasi yang diterima dapat dibuka dan dibaca.  \- Status notifikasi berubah menjadi "Dibaca" setelah dibuka. |

## Tiket Masalah (Trouble Tickets)

Nama Fitur: Tiket Masalah (Trouble Tickets)

Manajer Produk: Yosh Wakatta

Tanggal Pengiriman: 1 Desember 2025 (Estimasi)

Tahap: Development

Status: In Progress

Tim:

* Designer  
* Developer \[BE\], \[FE\]  
* QA Tester

Deskripsi

Fitur "Tiket Masalah" adalah sistem terintegrasi dalam Dasbor Billing yang memungkinkan administrator vendor untuk mengelola dan menyelesaikan masalah yang diajukan oleh klien. Modul ini dirancang untuk menyediakan alur kerja yang terstruktur mulai dari pembuatan tiket, penetapan, hingga penyelesaian masalah. Tujuannya adalah untuk meningkatkan efisiensi tim dukungan, memastikan setiap masalah klien ditangani dengan cepat, dan menyediakan riwayat komunikasi yang tercatat.

FITUR, TUJUAN & KESUKSESAN (FEATURES GOALS & SUCCESS)

Tujuan:

* Menyediakan platform terpusat untuk mengelola semua tiket masalah klien.  
* Memungkinkan administrator untuk melacak status setiap tiket secara *real-time*.  
* Memastikan proses penyelesaian masalah yang efisien dan transparan.  
* Meningkatkan kecepatan respons dengan penugasan otomatis dan pelacakan SLA.  
* Memberikan wawasan berbasis data melalui dashboard statistik.

**FITUR (FEATURES):**

1. **Daftar & Manajemen Tiket**  
   * Tampilan tabel yang menampilkan semua tiket masalah yang diajukan oleh klien.  
   * Kolom informasi yang ditampilkan: Nomor Tiket, Klien, Judul Masalah, Prioritas (Rendah, Sedang, Tinggi), Status (Terbuka, Dalam Proses, Selesai), Tanggal Dibuat.  
   * Fungsi pencarian untuk mencari tiket berdasarkan nomor tiket atau nama klien.  
   * Filter untuk menyaring daftar berdasarkan Prioritas atau Status.  
   * Opsi pengurutan berdasarkan tanggal atau prioritas.  
2. **Detail & Aksi Tiket**  
   * Halaman khusus untuk setiap tiket yang menampilkan informasi terperinci, termasuk:  
     * **Informasi Dasar:** Nomor Tiket, Klien, Tanggal Dibuat.  
     * **Deskripsi Masalah:** Deskripsi lengkap masalah yang diajukan oleh klien.  
     * **Riwayat Komentar & Log Aktivitas:** Semua komunikasi dan pembaruan status terkait tiket.  
     * **Lampiran:** Opsi untuk melihat dan mengunduh file yang dilampirkan oleh klien atau tim dukungan.  
   * **Aksi Tiket (Ticket Actions)**  
     * **Ubah Status:** Administrator dapat mengubah status tiket (misalnya, dari "Terbuka" menjadi "Dalam Proses").  
     * **Tambahkan Komentar Internal:** Tim dukungan dapat menambahkan catatan atau komentar internal yang tidak terlihat oleh klien.  
     * **Balas Klien:** Administrator dapat mengirimkan balasan langsung kepada klien.  
     * **Tetapkan (Assign) Tiket:** Opsi untuk menetapkan tiket ke anggota tim dukungan yang bertanggung jawab.  
3. **Pengajuan & Pelacakan Klien**  
   * **Formulir Pengajuan Tiket:** Klien memiliki akses ke formulir sederhana untuk mengajukan masalah, dengan kolom seperti Judul Masalah, Deskripsi, dan Lampiran.  
   * **Notifikasi Pengajuan:** Saat klien mengajukan tiket, administrator akan menerima notifikasi.  
   * **Tampilan Tiket di Sisi Klien:** Klien dapat melihat status dan riwayat komunikasi dari tiket yang mereka ajukan.  
4. **Penugasan Otomatis & SLA Tracker**  
   * **Penugasan Otomatis:** Sistem akan secara otomatis menetapkan tiket ke agen yang sesuai berdasarkan kategori masalah yang dipilih oleh klien.  
   * **SLA Tracker:** Sistem akan melacak lama waktu respons dan penyelesaian tiket untuk memastikan kepatuhan terhadap Service Level Agreement (SLA).  
5. **Dashboard Statistik Trouble Tickets**  
   * Menampilkan dashboard visual dengan metrik kunci, seperti:  
     * Jumlah tiket masuk (per hari, minggu, bulan).  
     * Status tiket (persentase tiket Terbuka, Dalam Proses, Selesai).  
     * Lama rata-rata respons.  
     * Lama rata-rata penyelesaian tiket.

**USE CASE**

**Administrator Vendor Menangani Tiket Baru**

* **Aktor:** Administrator Vendor  
* **Skenario:** Klien mengajukan tiket masalah mengenai bug di modul Inventaris. Sistem secara otomatis menetapkan tiket tersebut ke tim pengembang. Administrator menerima notifikasi, melihat tiket di daftar, dan memantau statusnya.  
* **Hasil:** Tiket masalah ditangani oleh tim yang tepat dengan cepat dan efisien.

**Administrator Vendor Berkomunikasi dengan Klien**

* **Aktor:** Administrator Vendor  
* **Skenario:** Tim pengembang telah memperbaiki bug yang dilaporkan. Administrator membuka tiket, menambahkan komentar yang menjelaskan solusi, dan mengubah status tiket menjadi "Selesai".  
* **Hasil:** Klien menerima pembaruan bahwa masalah mereka telah diselesaikan.

**Administrator Vendor Memantau Kinerja Tim**

* **Aktor:** Administrator Vendor  
* **Skenario:** Administrator masuk ke dasbor statistik "Trouble Tickets" untuk melihat kinerja tim. Dia melihat jumlah tiket yang diselesaikan dalam sebulan dan lama rata-rata respons.  
* **Hasil:** Administrator mendapatkan wawasan mendalam tentang efisiensi tim dan dapat mengambil keputusan untuk meningkatkan layanan.

**Klien Mengajukan Tiket dan Melacak Status**

* **Aktor:** Klien  
* **Skenario:** Klien mengalami masalah dan menggunakan formulir pengajuan tiket di dasbor mereka. Setelah mengajukan, mereka dapat melihat status tiket berubah dari "Terbuka" menjadi "Dalam Proses" di riwayat tiket mereka.  
* **Hasil:** Klien mendapatkan *update* yang transparan dan dapat melacak penyelesaian masalah mereka.

**DEPENDENCIES**

1. Database untuk menyimpan tiket masalah dan riwayat komunikasi.  
2. Integrasi dengan modul "Klien" untuk mengidentifikasi klien yang mengajukan tiket.  
3. Sistem notifikasi untuk memberitahu administrator tentang tiket baru.  
4. Logika penugasan otomatis dan algoritma pelacakan SLA.

**REQUIREMENTS**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Manajemen Tiket Masalah | Sebagai administrator vendor, saya ingin melihat, melacak, dan mengelola tiket masalah klien secara terpusat. | Sebagai administrator vendor, ketika saya masuk ke modul "Trouble Tickets", maka saya akan melihat daftar semua tiket dan dapat mengambil tindakan. | Highest | \- Daftar tiket menampilkan semua tiket dengan informasi kunci.  \- Administrator dapat memfilter tiket berdasarkan status atau prioritas.  \- Terdapat halaman detail untuk setiap tiket. |
| Penugasan Otomatis | Sebagai administrator vendor, saya ingin tiket masalah secara otomatis ditugaskan ke agen yang tepat agar proses penyelesaian lebih cepat. | Sebagai administrator vendor, ketika klien mengajukan tiket dengan kategori tertentu, maka tiket tersebut akan secara otomatis ditugaskan ke agen yang bertanggung jawab atas kategori tersebut. | High | \- Sistem memiliki logika penugasan otomatis berdasarkan kategori.  \- Administrator dapat mengkonfigurasi aturan penugasan otomatis.  \- Tiket baru secara otomatis ditugaskan dan notifikasi dikirimkan ke agen terkait. |
| Pelacakan SLA & Statistik | Sebagai administrator vendor, saya ingin melacak waktu respons dan penyelesaian tiket serta melihat statistik keseluruhan. | Sebagai administrator vendor, ketika saya melihat detail tiket, maka saya akan melihat metrik waktu yang sudah berjalan dan saya dapat mengakses dashboard statistik. | High | \- Setiap tiket menampilkan metrik waktu respons dan penyelesaian.  \- Dashboard statistik menampilkan data visual mengenai jumlah tiket masuk dan statusnya.  \- Dashboard juga menampilkan lama rata-rata respons dan penyelesaian tiket. |
| Pengajuan dan Pelacakan Tiket | Sebagai klien, saya ingin dapat mengajukan tiket masalah dengan mudah dan melacak statusnya. | Sebagai klien, ketika saya mengajukan tiket, maka saya akan menerima konfirmasi dan dapat melihat statusnya diperbarui oleh vendor. | Highest | \- Klien memiliki antarmuka yang sederhana untuk mengajukan tiket.  \- Klien menerima notifikasi atau konfirmasi saat tiket berhasil diajukan.  \- Klien dapat melihat status tiket yang mereka ajukan. |

