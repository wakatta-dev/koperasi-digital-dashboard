### 

**[Modul Dashboard Utama	2](#modul-dashboard-utama)**

[1\. Description	2](#1.-description)

[2\. Objectives & Success Metrics	2](#2.-objectives-&-success-metrics)

[3\. Features	3](#3.-features)

[4\. Use Case	4](#4.-use-case)

[5\. Dependencies	4](#5.-dependencies)

[6\. Requirements	5](#6.-requirements)

[**Modul Inventaris	7**](#modul-inventaris)

[1\. Description	7](#1.-description-1)

[2\. Objectives & Success Metrics	7](#2.-objectives-&-success-metrics-1)

[3\. Features	8](#3.-features-1)

[4\. Use Case	9](#4.-use-case-1)

[5\. Dependencies	9](#5.-dependencies-1)

[6\. Requirements	9](#6.-requirements-1)

[**Modul Kasir (Point of Sale)	12**](#modul-kasir-\(point-of-sale\))

[1\. Description	12](#1.-description-2)

[2\. Objectives & Success Metrics	12](#2.-objectives-&-success-metrics-2)

[3\. Features	13](#3.-features-2)

[4\. Use Case	14](#4.-use-case-2)

[5\. Dependencies	14](#5.-dependencies-2)

[6\. Requirements	14](#6.-requirements-2)

[**Modul Marketplace (Toko Online)	17**](#modul-marketplace-\(toko-online\))

[1\. Description	17](#1.-description-3)

[2\. Objectives & Success Metrics	17](#2.-objectives-&-success-metrics-3)

[3\. Features	18](#3.-features-3)

[4\. Use Case	19](#4.-use-case-3)

[5\. Dependencies	19](#5.-dependencies-3)

[6\. Requirements	19](#6.-requirements-3)

[**Modul Manajemen Aset & Jadwal Sewa	22**](#modul-manajemen-aset-&-jadwal-sewa)

[1\. Description	22](#1.-description-4)

[2\. Objectives & Success Metrics	22](#2.-objectives-&-success-metrics-4)

[3\. Features	23](#3.-features-4)

[4\. Use Case	23](#4.-use-case-4)

[5\. Dependencies	24](#5.-dependencies-4)

[6\. Requirements	24](#6.-requirements-4)

[**Modul Laporan	27**](#modul-laporan)

[1\. Description	27](#1.-description-5)

[2\. Objectives & Success Metrics	27](#2.-objectives-&-success-metrics-5)

[3\. Features	28](#3.-features-5)

[4\. Use Case	29](#4.-use-case-5)

[5\. Dependencies	29](#5.-dependencies-5)

[6\. Requirements	30](#6.-requirements-5)

[**Modul Landing Page (Adaptif)	33**](#modul-landing-page-\(adaptif\))

[1\. Description	33](#1.-description-6)

[2\. Objectives & Success Metrics	33](#2.-objectives-&-success-metrics-6)

[3\. Features (Adaptif per Jenis Klien)	34](#3.-features-\(adaptif-per-jenis-klien\))

[4\. Use Case	35](#4.-use-case-6)

[5\. Dependencies	36](#5.-dependencies-6)

[6\. Requirements	36](#6.-requirements-6)

### 

### **Modul Dashboard Utama** {#modul-dashboard-utama}

|  |  |  |
| :---- | :---- | :---- |
|  | **Product Name** | Modul Dashboard Utama (PWA SaaS) |
|  | **Product Manager** | Yosh Wakatta |
|  | **Shipping Date** | 30 September 2025 |
|  | **Stage** | Development |
|  | **Status** | In Refinement |
|  | **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\.** Description {#1.-description}

Dashboard Utama adalah halaman pertama yang dilihat pengguna setelah berhasil login ke dalam aplikasi PWA. Halaman ini berfungsi sebagai pusat informasi visual yang menyajikan ringkasan data dan metrik kinerja terpenting dari bisnis klien (Koperasi, BUMDes, atau UMKM Toko Bangunan) secara *real-time*. Tujuannya adalah untuk memberikan gambaran kondisi bisnis "at-a-glance" (sekali lihat) dan memungkinkan pengguna mengambil keputusan cepat serta mengakses modul lain dengan lebih efisien.

---

#### **2\.** Objectives & Success Metrics {#2.-objectives-&-success-metrics}

**Objectives**

* **Menyediakan "Health Check" Bisnis Cepat:** Memungkinkan pemilik bisnis memahami kondisi usahanya dalam waktu kurang dari 30 detik.  
* **Meningkatkan Keterlibatan Pengguna:** Mendorong pengguna untuk menjelajahi modul lain melalui pintasan dan notifikasi yang relevan.  
* **Mendorong Pengambilan Keputusan Berbasis Data:** Menyajikan data kunci yang dapat memicu tindakan, seperti mengisi ulang stok atau menindaklanjuti pesanan.

**Success Metrics**

* **Engagement Rate:** Tingginya *Click-Through Rate (CTR)* pada widget notifikasi atau pintasan menuju modul lain (\>30%).  
* **User Retention:** Tingginya frekuensi login harian oleh pengguna untuk memeriksa dashboard.  
* **Qualitative Feedback:** Mendapatkan ulasan positif dari minimal 80% pengguna yang diwawancara, yang menyatakan bahwa dashboard membantu mereka memonitor bisnis secara efisien.

---

#### **3\.** Features {#3.-features}

Dashboard akan terdiri dari beberapa widget interaktif dalam tata letak (layout) berbasis grid yang responsif.

1. **Widget Ringkasan Performa Utama**  
   * Menampilkan 3-4 metrik kunci dalam bentuk *Key Performance Indicator (KPI) Cards*.  
   * Contoh: "Penjualan Hari Ini", "Total Transaksi Hari Ini", "Pesanan Online Baru".  
   * Setiap kartu menampilkan angka besar dan perbandingan dengan periode sebelumnya (misal: "↑5% dari kemarin").  
2. **Widget Grafik Penjualan Mingguan**  
   * Grafik batang (bar chart) sederhana yang menampilkan total pendapatan selama 7 hari terakhir.  
   * Memberikan visualisasi tren penjualan jangka pendek.  
   * Terdapat link "Lihat Laporan Lengkap" yang mengarah ke modul Laporan.  
3. **Widget Notifikasi & Tindakan Cepat (Actionable Alerts)**  
   * Area dinamis yang menampilkan pemberitahuan penting.  
   * Contoh notifikasi:  
     * "Anda memiliki **3 pesanan online** baru yang perlu diproses." (Link ke Manajemen Pesanan)  
     * "**5 produk** akan segera habis." (Link ke Manajemen Inventaris)  
     * (Untuk Koperasi) "Ada **10 angsuran** yang jatuh tempo hari ini." (Link ke Manajemen Pinjaman)  
4. **Widget Produk Terlaris**  
   * Menampilkan daftar 5 produk dengan penjualan tertinggi dalam 30 hari terakhir.  
   * Membantu pemilik bisnis dalam strategi stok dan promosi.  
5. **Widget Pintasan (Shortcuts)**  
   * Tombol (CTA Buttons) untuk aksi yang paling sering dilakukan.  
   * Contoh: "+ Penjualan Baru (POS)", "+ Tambah Produk", "+ Buat Pengeluaran".

---

#### **4\.** Use Case {#4.-use-case}

---

#### **5\.** Dependencies {#5.-dependencies}

* **API Endpoints:** Ketersediaan API dari tim Backend untuk menyediakan data teragregasi (penjualan, stok, pesanan).  
* **UI/UX Design:** Desain final dari UI/UX Designer untuk setiap widget dan keseluruhan layout dashboard.  
* **Data Source:** Modul lain (Inventaris, POS, Marketplace, Keuangan) harus sudah fungsional untuk menyediakan data yang akurat ke dashboard.

---

#### **6\.** Requirements {#6.-requirements}

Tabel berikut merinci Epics dan User Stories untuk pengembangan Modul Dashboard Utama.

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Visualisasi Kinerja Bisnis** | Sebagai pemilik bisnis, saya ingin melihat ringkasan metrik utama di dashboard | Sebagai pemilik bisnis, ketika saya membuka dashboard, maka saya akan melihat total penjualan, jumlah transaksi, dan pesanan baru hari ini. | Highest | \- Widget menampilkan data "Penjualan Hari Ini" dengan benar. \- Widget menampilkan "Total Transaksi Hari Ini". \- Data yang ditampilkan sesuai dengan data aktual dari modul terkait. \- Data dapat diperbarui secara otomatis atau dengan tombol *refresh*. |
|  | sehingga saya bisa mengetahui kondisi bisnis saya dengan cepat. |  |  |  |
| **Notifikasi Proaktif** | Sebagai pengguna, saya ingin mendapatkan notifikasi penting di dashboard | Sebagai pengguna, ketika ada stok produk yang menipis atau ada pesanan online baru, maka saya akan melihat notifikasi di dashboard. | Highest | \- Notifikasi muncul jika jumlah stok produk ≤ batas minimum. \- Notifikasi muncul jika ada pesanan dengan status "Baru". \- Setiap notifikasi memiliki link yang mengarahkan ke halaman relevan (detail produk atau manajemen pesanan). \- Notifikasi akan hilang setelah tindakan dilakukan (misal: pesanan diproses). |
|  | sehingga saya bisa segera mengambil tindakan yang diperlukan. |  |  |  |
| **Akses Cepat ke Fitur Lain** | Sebagai pengguna, saya ingin ada tombol pintasan untuk fitur yang sering saya pakai | Sebagai pengguna, ketika saya berada di dashboard, maka saya bisa langsung menekan tombol untuk membuat penjualan baru (POS). | High | \- Terdapat tombol/CTA "+ Penjualan Baru (POS)". \- Menekan tombol tersebut akan langsung mengarahkan pengguna ke halaman kasir (POS). \- Tombol pintasan lain (seperti "+ Tambah Produk") berfungsi sesuai tujuannya. |
|  | sehingga alur kerja saya menjadi lebih efisien. |  |  |  |

### 

### **Modul Inventaris** {#modul-inventaris}

|  |  |
| :---- | :---- |
| **Product Name** | Modul Inventaris (PWA SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Oktober 2025 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description** {#1.-description-1}

Modul Inventaris adalah sistem pusat untuk pengelolaan seluruh data produk dan stok. Modul ini memungkinkan klien (Koperasi, BUMDes, UMKM Toko Bangunan) untuk membuat, mengatur, melacak, dan mengelola katalog produk atau layanan yang mereka tawarkan. Fungsi utamanya mencakup pendefinisian detail produk, pemantauan jumlah stok secara *real-time*, dan penetapan harga beli (modal) serta harga jual. Modul ini menjadi sumber data utama yang akan dikonsumsi oleh Modul Kasir (POS) dan Modul Marketplace.

---

#### **2\. Objectives & Success Metrics** {#2.-objectives-&-success-metrics-1}

**Objectives**

* **Menyediakan Katalog Produk yang Terpusat & Mudah Digunakan:** Memberikan satu sumber kebenaran (*single source of truth*) untuk semua data produk, mengurangi redundansi dan kesalahan input.  
* **Memastikan Pelacakan Stok yang Akurat:** Secara otomatis menyinkronkan level stok di semua channel penjualan (offline dan online) untuk mencegah *over-selling* atau *stockout*.  
* **Menyederhanakan Manajemen Harga & Profitabilitas:** Memudahkan pengguna untuk menetapkan harga dan melihat harga modal untuk membantu perhitungan laba kotor per produk.

**Success Metrics**

* **High Adoption & Data Richness:** \>90% klien aktif telah menambahkan minimal 10 produk dalam 30 hari pertama. \>70% produk yang ditambahkan memiliki data harga beli dan batas minimum stok.  
* **Stock Accuracy:** Tingkat akurasi sinkronisasi stok setelah penjualan (dari POS/Marketplace) mencapai 99.9%.  
* **User Efficacy:** Waktu rata-rata yang dibutuhkan pengguna untuk menambahkan produk baru kurang dari 60 detik.

---

#### **3\. Features** {#3.-features-1}

1. **Daftar Produk (Halaman Utama Modul)**  
   * Tampilan tabel yang informatif dan mudah dicari, berisi kolom: Foto, Nama Produk, SKU, Kategori, Stok Saat Ini, Harga Jual.  
   * Fitur Pencarian berdasarkan Nama Produk atau SKU.  
   * Fitur Filter berdasarkan Kategori Produk.  
   * Tombol aksi utama: "+ Tambah Produk".  
2. **Formulir Tambah & Edit Produk**  
   * Sebuah formulir komprehensif untuk mendefinisikan produk:  
     * **Nama Produk:** (Wajib)  
     * **SKU (Stock Keeping Unit):** Dapat diisi manual atau digenerate otomatis oleh sistem.  
     * **Kategori:** Pengguna dapat memilih dari kategori yang ada atau membuat yang baru.  
     * **Satuan:** Input teks (misal: Pcs, Kg, Sak, Liter, Meter, Batang).  
     * **Harga Beli:** Harga modal produk.  
     * **Harga Jual:** Harga yang akan digunakan di POS/Marketplace (Wajib).  
     * **Deskripsi:** Informasi detail produk untuk ditampilkan di Marketplace.  
     * **Foto Produk:** Fitur untuk mengunggah gambar produk.  
   * **Bagian Manajemen Stok:**  
     * **Lacak Stok?:** *Checkbox* untuk membedakan produk (barang) dan jasa. Jika tidak dicentang, stok tidak akan dilacak.  
     * **Stok Awal:** Jumlah stok saat produk pertama kali dimasukkan.  
     * **Batas Minimum Stok:** Angka untuk memicu notifikasi stok menipis di Dashboard.  
3. **Fitur Manajemen Stok Lanjutan**  
   * **Penyesuaian Stok (Stok Opname):** Fitur untuk menyamakan data stok di sistem dengan jumlah fisik di gudang. Pengguna memasukkan "Jumlah Fisik Sebenarnya", dan sistem akan otomatis membuat catatan penyesuaian (misal: Selisih \+5 atau \-2).  
   * **Riwayat Stok:** Catatan log terperinci untuk setiap produk yang menunjukkan semua pergerakan stok (Penjualan POS, Penjualan Marketplace, Penyesuaian, dll.) lengkap dengan tanggal dan perubahan kuantitas.

---

#### **4\. Use Case** {#4.-use-case-1}

1. **Admin Toko Bangunan Menambahkan Produk Semen**  
   * **Aktor:** Admin Toko Bangunan.  
   * **Skenario:** Toko baru saja menyetok produk "Semen Garuda". Admin membuka Modul Inventaris, klik "+ Tambah Produk". Ia mengisi nama, SKU, harga beli per sak, dan harga jual. Pada kolom Satuan ia mengisi "Sak". Ia juga mengatur batas minimum stok sebanyak 10 sak.  
   * **Hasil:** Produk semen berhasil ditambahkan dan siap dijual melalui POS. Jika stoknya nanti di bawah 10 sak, notifikasi akan muncul di Dashboard.  
2. **Pengurus Koperasi Melakukan Stok Opname Bulanan**  
   * **Aktor:** Pengurus Koperasi.  
   * **Skenario:** Di akhir bulan, pengurus menghitung sisa stok sabun cuci di unit usaha toko. Di sistem tercatat 50 pcs, namun fisik hanya 48 pcs. Ia masuk ke detail produk sabun, memilih fitur "Penyesuaian Stok", dan memasukkan angka 48\.  
   * **Hasil:** Sistem secara otomatis memperbarui jumlah stok menjadi 48 dan membuat catatan riwayat "Penyesuaian: \-2".

---

#### **5\. Dependencies** {#5.-dependencies-1}

* **Modul Dashboard:** Modul ini akan mengambil data dari Inventaris untuk notifikasi stok menipis.  
* **Modul Kasir (POS) & Marketplace:** Kedua modul ini sangat bergantung pada data harga jual dan akan mengirim perintah untuk mengurangi stok setelah terjadi penjualan.  
* **UI/UX Design:** Desain final untuk halaman daftar produk, formulir tambah/edit, dan alur stok opname.

---

#### **6\. Requirements** {#6.-requirements-1}

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pengelolaan Katalog Produk** | Sebagai pemilik bisnis, saya ingin bisa menambahkan dan mengedit detail produk saya dengan mudah | Sebagai pemilik bisnis, ketika saya mengisi formulir tambah produk dengan data yang lengkap, maka produk tersebut akan tersimpan dan muncul di daftar inventaris saya. | Highest | \- Pengguna dapat mengisi semua field di form tambah produk. \- Validasi input berjalan (misal: harga jual tidak boleh kosong). \- Produk yang baru ditambahkan langsung muncul di halaman Daftar Produk. \- Pengguna dapat mengklik produk di daftar untuk masuk ke mode edit. |
|  | sehingga saya bisa menjaga katalog saya tetap up-to-date. |  |  |  |
| **Sinkronisasi Stok Otomatis** | Sebagai pengguna, saya ingin stok produk berkurang secara otomatis setiap kali ada penjualan | Sebagai pengguna, ketika sebuah produk terjual melalui Kasir (POS) atau Marketplace, maka jumlah stok produk tersebut di sistem akan langsung berkurang sesuai jumlah yang terjual. | Highest | \- Penjualan 2 pcs produk X di POS akan mengurangi stok produk X sebanyak 2\. \- Penjualan 1 pcs produk Y di Marketplace akan mengurangi stok produk Y sebanyak 1\. \- Perubahan stok tercatat di Riwayat Stok produk tersebut. \- Jika stok 0, produk tidak bisa ditambahkan ke keranjang POS/Marketplace. |
|  | agar data inventaris saya selalu akurat dan terhindar dari penjualan barang yang sudah habis. |  |  |  |
| **Penyesuaian Stok Manual** | Sebagai pengguna, saya ingin bisa melakukan stok opname dan menyesuaikan jumlah stok di sistem | Sebagai pengguna, ketika saya menemukan perbedaan antara stok fisik dan stok di sistem, maka saya bisa memasukkan angka stok fisik yang benar untuk memperbarui data di sistem. | High | \- Terdapat fitur "Penyesuaian Stok" di halaman detail produk. \- Pengguna dapat memasukkan angka kuantitas fisik. \- Sistem menghitung selisih dan memperbarui kuantitas "Stok Saat Ini". \- Sebuah entri baru tercatat di "Riwayat Stok" dengan tipe "Penyesuaian". |
|  | agar data saya kembali akurat dengan kondisi nyata di lapangan. |  |  |  |

### **Modul Kasir (Point of Sale)** {#modul-kasir-(point-of-sale)}

|  |  |
| :---- | :---- |
| **Product Name** | Modul Kasir (Point of Sale) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 30 November 2025 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description** {#1.-description-2}

Modul Kasir (POS) adalah versi digital dari mesin kasir konvensional, yang dirancang untuk digunakan pada berbagai perangkat seperti tablet atau komputer di toko fisik. Modul ini menyediakan antarmuka yang cepat, intuitif, dan efisien bagi staf di garis depan (kasir) untuk melakukan dan mencatat transaksi penjualan. Setiap transaksi yang berhasil akan secara otomatis memperbarui jumlah stok di Modul Inventaris dan menyumbangkan data ke Modul Laporan, menciptakan ekosistem bisnis yang terintegrasi.

---

#### **2\. Objectives & Success Metrics** {#2.-objectives-&-success-metrics-2}

**Objectives**

* **Mempercepat Proses Checkout:** Mengurangi waktu antrean dan meningkatkan kepuasan pelanggan dengan alur transaksi yang cepat.  
* **Meminimalkan Kesalahan Manusia:** Menghilangkan kesalahan perhitungan manual dan memastikan setiap transaksi tercatat dengan akurat.  
* **Menjamin Integritas Data Lintas Modul:** Memastikan setiap penjualan tercermin secara *real-time* pada data stok dan laporan keuangan.

**Success Metrics**

* **Transaction Speed:** Waktu rata-rata per transaksi (dari penambahan produk pertama hingga struk tercetak/terkirim) adalah di bawah 60 detik.  
* **Accuracy Rate:** Tingkat akurasi data penjualan yang masuk ke sistem adalah 100% tanpa memerlukan koreksi manual.  
* **User Adoption & Satisfaction:** Staf kasir dapat menggunakan sistem secara mandiri dengan pelatihan kurang dari 15 menit dan memberikan rating kemudahan penggunaan 4/5 atau lebih tinggi.

---

#### **3\. Features** {#3.-features-2}

1. **Antarmuka Transaksi Utama**  
   * **Grid Produk:** Tampilan visual produk yang paling sering dijual dalam bentuk kartu/grid yang mudah disentuh (*touch-friendly*).  
   * **Pencarian Cepat:** Sebuah bar pencarian yang selalu terlihat untuk mencari produk berdasarkan Nama atau SKU. Mendukung pencarian dengan *barcode scanner*.  
   * **Keranjang Belanja (Cart):** Daftar item yang sedang dibeli oleh pelanggan. Di sini kasir dapat:  
     * Mengubah jumlah (kuantitas) per item.  
     * Memberikan diskon per item (dalam % atau nominal).  
     * Menghapus item dari keranjang.  
   * **Ringkasan Pembayaran:** Kalkulasi otomatis untuk Subtotal, Diskon, Pajak (jika diaktifkan), dan Total Akhir.  
2. **Alur Proses Pembayaran**  
   * Tombol "Bayar" yang jelas dan besar untuk memulai proses pembayaran.  
   * **Pilihan Metode Pembayaran:** Pilihan visual untuk metode pembayaran yang umum (Tunai, QRIS, Kartu Debit/Kredit).  
   * **Pembayaran Tunai:** Sistem menyediakan *input field* untuk "Jumlah Uang Diterima" dan secara otomatis menghitung "Uang Kembali".  
   * **Pembayaran Non-Tunai:** Opsi untuk menandai pembayaran sebagai lunas (sistem tidak menghitung kembalian).  
3. **Pencetakan dan Pengiriman Struk**  
   * Setelah pembayaran berhasil, layar konfirmasi akan muncul.  
   * Opsi penyelesaian transaksi:  
     * **Cetak Struk:** Mengirim perintah cetak ke *thermal printer* yang terhubung.  
     * **Kirim Struk via WhatsApp:** Menghasilkan link `wa.me` dengan pesan berisi struk digital.  
     * **Transaksi Baru:** Menyelesaikan transaksi tanpa struk dan langsung memulai transaksi baru.  
4. **Manajemen Sesi Kasir (Opsional untuk MVP Lanjutan)**  
   * Fitur "Buka Kasir" di awal hari dengan modal awal.  
   * Fitur "Tutup Kasir" di akhir hari dengan ringkasan penjualan selama sesi tersebut.

---

#### **4\. Use Case** {#4.-use-case-2}

1. **Kasir Koperasi Melayani Anggota yang Berbelanja Rutin**  
   * **Aktor:** Kasir Koperasi.  
   * **Skenario:** Seorang anggota membeli beberapa kebutuhan pokok. Kasir dengan cepat mengetuk produk pada Grid Produk. Pelanggan membayar dengan uang tunai.  
   * **Hasil:** Kasir memasukkan jumlah uang yang diterima, sistem menampilkan jumlah kembalian, dan kasir menyelesaikan transaksi sambil memberikan struk cetak. Stok barang otomatis berkurang.  
2. **Kasir Toko Bangunan Melayani Pesanan Besar**  
   * **Aktor:** Kasir Toko Bangunan.  
   * **Skenario:** Seorang kontraktor membeli 50 sak semen, 10 batang besi, dan 5 kaleng cat. Kasir menggunakan fitur pencarian untuk menemukan item tersebut dengan cepat dan mengubah kuantitasnya di keranjang. Pembayaran dilakukan via transfer.  
   * **Hasil:** Kasir memilih metode pembayaran "Transfer" dan menandai lunas. Ia mencetak struk sebagai bukti bayar untuk kontraktor.

---

#### **5\. Dependencies** {#5.-dependencies-2}

* **Modul Inventaris:** **Ketergantungan Kritis.** Modul POS tidak dapat berfungsi tanpa akses ke daftar produk, harga, dan jumlah stok dari Modul Inventaris.  
* **Perangkat Keras (Hardware):** Desain harus mempertimbangkan kompatibilitas dengan perangkat keras umum seperti *barcode scanner* (via input USB/Bluetooth) dan *thermal printer* (via koneksi USB atau Bluetooth).  
* **Modul Laporan:** Semua data transaksi dari POS akan menjadi input utama untuk laporan penjualan dan laba/rugi.  
* **UI/UX Design:** Desain antarmuka harus sangat dioptimalkan untuk kecepatan, visibilitas yang baik di berbagai kondisi cahaya, dan interaksi sentuhan yang minimalis.

---

#### **6\. Requirements** {#6.-requirements-2}

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pembuatan Transaksi Penjualan** | Sebagai seorang kasir, saya ingin dapat dengan cepat menambahkan produk ke dalam keranjang pelanggan | Sebagai seorang kasir, ketika saya mencari atau memilih produk, maka produk tersebut akan ditambahkan ke keranjang dan total belanja akan diperbarui secara otomatis. | Highest | \- Produk dapat ditambahkan ke keranjang melalui pencarian atau klik pada grid produk. \- Kuantitas produk dalam keranjang dapat diubah. \- Item dapat dihapus dari keranjang. \- Subtotal dan Total Akhir terhitung dengan benar. |
|  | agar saya bisa melayani pelanggan tanpa membuat mereka menunggu lama. |  |  |  |
| **Proses Pembayaran** | Sebagai seorang kasir, saya ingin bisa menerima pembayaran tunai dan menghitung kembalian secara otomatis | Sebagai seorang kasir, ketika pelanggan membayar dengan uang tunai dan saya memasukkan jumlah uang yang diterima, maka sistem akan secara otomatis menghitung dan menampilkan jumlah uang kembali. | Highest | \- Tombol "Bayar" membuka *modal* pembayaran. \- Terdapat opsi pembayaran "Tunai". \- *Input field* untuk "Jumlah Uang Diterima" berfungsi. \- Angka "Uang Kembali" ditampilkan dengan benar. \- Transaksi berhasil tersimpan setelah pembayaran dikonfirmasi. |
|  | sehingga saya tidak membuat kesalahan dalam perhitungan uang kembalian. |  |  |  |
| **Penyelesaian Transaksi dan Struk** | Sebagai seorang kasir, saya ingin bisa memberikan bukti pembelian kepada pelanggan setelah transaksi selesai | Sebagai seorang kasir, ketika pembayaran telah berhasil, maka saya akan diberikan pilihan untuk mencetak struk atau mengirimnya secara digital. | High | \- Setelah pembayaran, layar konfirmasi muncul dengan opsi struk. \- Tombol "Cetak Struk" mengirimkan data ke printer. \- Tombol "Kirim via WhatsApp" membuka tab baru dengan link `wa.me` yang sudah terisi pesan struk. \- Penjualan tercatat dalam riwayat transaksi. |
|  | agar pelanggan memiliki bukti pembelian yang sah. |  |  |  |

### **Modul Marketplace (Toko Online)** {#modul-marketplace-(toko-online)}

|  |  |
| :---- | :---- |
| **Product Name** | Modul Marketplace (Toko Online) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 15 Desember 2025 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description** {#1.-description-3}

Modul Marketplace menyediakan setiap klien (Koperasi, BUMDes, UMKM Toko Bangunan) sebuah etalase digital atau "toko online" pribadi yang dapat diakses publik melalui URL unik. Fitur ini memungkinkan klien untuk memperluas jangkauan pasar mereka di luar toko fisik, menampilkan produk mereka kepada audiens yang lebih luas, dan menerima pesanan secara online 24/7. Bagi pelanggan akhir, ini memberikan kemudahan untuk menelusuri produk dan melakukan pembelian dari mana saja.

---

#### **2\. Objectives & Success Metrics** {#2.-objectives-&-success-metrics-3}

**Objectives**

* **Menciptakan Saluran Penjualan Baru:** Memberikan klien alat yang mudah digunakan untuk meningkatkan pendapatan melalui penjualan online.  
* **Memberikan Pengalaman Belanja yang Intuitif:** Merancang alur belanja yang sederhana dan cepat bagi pelanggan akhir untuk mendorong konversi.  
* **Menjamin Integrasi Data yang Sempurna:** Memastikan setiap pesanan online tercatat dengan benar, dan data stok selalu sinkron dengan Modul Inventaris.

**Success Metrics**

* **Module Adoption & Sales Impact:** \>50% klien mengaktifkan Modul Marketplace. Rata-rata, setiap marketplace yang aktif menghasilkan minimal 5 pesanan per bulan.  
* **Conversion Rate:** Tingkat konversi (jumlah pengunjung yang melakukan checkout dibagi total pengunjung) mencapai \>2%.  
* **Data Integrity:** 100% pesanan dari marketplace tercatat secara akurat di sistem back-office. 0 kasus *overselling* (menjual barang yang stoknya sudah habis).

---

#### **3\. Features** {#3.-features-3}

1. **Halaman Toko Digital (Storefront)**  
   * **URL Unik:** Sistem secara otomatis menghasilkan URL yang unik dan mudah dibagikan untuk setiap toko (contoh: `domainanda.com/toko-amanah`).  
   * **Header Toko:** Menampilkan Logo , Nama Bisnis, dan kontak yang bisa dihubungi (misal: tombol WhatsApp ).  
   * **Katalog Produk:** Tampilan galeri produk yang telah ditandai "Tampilkan di Marketplace" dari Modul Inventaris. Setiap kartu menampilkan gambar, nama, dan harga produk.  
   * **Fitur Pencarian Sederhana:** Bar pencarian untuk mencari produk berdasarkan nama.  
2. **Halaman Detail Produk**  
   * Menampilkan gambar produk yang lebih besar, nama, harga, dan deskripsi produk yang diambil dari Modul Inventaris.  
   * Menampilkan status ketersediaan stok (misal: "Stok Tersedia" atau "Stok Habis").  
   * Tombol "Tambah ke Keranjang" beserta kolom untuk menentukan jumlah.  
3. **Alur Keranjang Belanja dan Checkout**  
   * **Keranjang Belanja:** Ikon keranjang yang selalu terlihat dan menampilkan jumlah item. Halaman keranjang memungkinkan pelanggan untuk meninjau pesanan dan mengubah kuantitas.  
   * **Formulir Checkout:** Sebuah formulir satu halaman yang sederhana untuk diisi pelanggan:  
     * Nama Lengkap  
     * Nomor HP/WA (untuk konfirmasi pesanan)  
     * Opsi Pengiriman: Pilihan antara "Ambil di Toko" atau "Kirim ke Alamat" (jika diaktifkan oleh klien).  
     * Alamat Lengkap (jika opsi kirim dipilih).  
   * Tombol "Buat Pesanan" untuk mengirimkan pesanan ke sistem.  
4. **Halaman Konfirmasi Pesanan**  
   * Halaman "Terima Kasih" yang muncul setelah pesanan berhasil dibuat.  
   * Menampilkan ringkasan pesanan, nomor pesanan, dan total yang harus dibayar.  
   * Memberikan instruksi selanjutnya (contoh: "Admin kami akan segera menghubungi Anda di nomor WhatsApp yang terdaftar untuk konfirmasi pembayaran.").

---

#### **4\. Use Case** {#4.-use-case-3}

1. **Pelanggan Umum Memesan Barang dari Marketplace Koperasi**  
   * **Aktor:** Pelanggan Umum.  
   * **Skenario:** Seorang pelanggan melihat promosi toko Koperasi di media sosial dan mengklik link marketplace yang tertera. Ia menelusuri produk, menambahkan beberapa item ke keranjang, dan menyelesaikan checkout untuk diantar ke rumahnya.  
   * **Hasil:** Pesanan masuk ke sistem Koperasi. Admin Koperasi menerima notifikasi dan menghubungi pelanggan untuk mengatur pengiriman.  
2. **Kontraktor Memastikan Ketersediaan Stok di Toko Bangunan**  
   * **Aktor:** Kontraktor (Calon Pelanggan).  
   * **Skenario:** Sebelum pergi ke toko bangunan, seorang kontraktor membuka halaman marketplace toko tersebut untuk memastikan stok cat merek tertentu tersedia.  
   * **Hasil:** Ia melihat produk tersedia, lalu langsung datang ke toko untuk membeli atau memesan via WhatsApp setelah melihat info kontak di halaman tersebut.

---

#### **5\. Dependencies** {#5.-dependencies-3}

* **Modul Inventaris:** **KETERGANTUNGAN KRITIS.** Marketplace sepenuhnya bergantung pada data produk, harga, deskripsi, gambar, dan jumlah stok dari modul ini.  
* **Modul Manajemen Pesanan Online:** Setiap pesanan yang dibuat melalui marketplace harus secara otomatis membuat entri baru di modul backend ini agar dapat diproses oleh pemilik bisnis.  
* **UI/UX Design:** Desain harus *mobile-first*, bersih, cepat dimuat, dan membangun kepercayaan pelanggan untuk mendorong transaksi.

---

#### **6\. Requirements** {#6.-requirements-3}

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Penemuan Produk oleh Pelanggan** | Sebagai seorang pelanggan, saya ingin dapat dengan mudah menelusuri dan mencari produk di toko online | Sebagai seorang pelanggan, ketika saya membuka halaman marketplace, maka saya akan melihat katalog produk yang bisa saya cari dan filter. | Highest | \- Halaman utama marketplace menampilkan produk dalam bentuk galeri. \- Terdapat bar pencarian yang berfungsi. \- Setiap produk dapat diklik untuk melihat halaman detailnya. \- Produk dengan stok 0 menampilkan label "Stok Habis" dan tidak bisa ditambahkan ke keranjang. |
|  | agar saya bisa menemukan barang yang saya inginkan dengan cepat. |  |  |  |
| **Proses Checkout Sederhana** | Sebagai seorang pelanggan, saya ingin proses checkout yang cepat dan tidak rumit | Sebagai seorang pelanggan, ketika saya siap membayar, maka saya akan mengisi satu formulir singkat untuk menyelesaikan pesanan saya. | Highest | \- Tombol "Tambah ke Keranjang" berfungsi dari halaman detail produk.\- Halaman checkout adalah satu halaman tunggal.\- Formulir hanya meminta informasi esensial (Nama , Kontak , Alamat ).\- Tombol "Buat Pesanan" berhasil mengirim data dan mengarahkan ke halaman konfirmasi. |
|  | agar saya tidak membatalkan pembelian saya. |  |  |  |
| **Notifikasi Pesanan untuk Penjual** | Sebagai pemilik bisnis, saya ingin langsung tahu jika ada pesanan baru masuk dari marketplace saya | Sebagai pemilik bisnis, ketika seorang pelanggan membuat pesanan di marketplace saya, maka sebuah pesanan baru akan muncul di dashboard manajemen pesanan saya. | Highest | \- Pesanan yang berhasil dibuat pelanggan akan menghasilkan entri baru di "Manajemen Pesanan Online" dengan status "Baru". \- Data pesanan (info pelanggan, produk yang dipesan, kuantitas) tercatat dengan akurat. \- Jumlah stok untuk produk yang dipesan akan otomatis berkurang (atau dialokasikan) dari Modul Inventaris. |
|  | agar saya dapat segera memprosesnya. |  |  |  |

### **Modul Manajemen Aset & Jadwal Sewa** {#modul-manajemen-aset-&-jadwal-sewa}

|  |  |
| :---- | :---- |
| **Product Name** | Modul Manajemen Aset & Jadwal Sewa |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 30 Juni 2026 |
| **Stage** | Scoping |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description** {#1.-description-4}

Modul Manajemen Aset & Jadwal Sewa adalah sebuah alat bantu komprehensif yang dirancang untuk klien, terutama BUMDes, dalam mengelola aset fisik yang dapat disewakan. Modul ini memungkinkan pengguna untuk mendaftarkan aset (seperti gedung, kendaraan, atau peralatan), mengatur jadwal ketersediaan melalui kalender visual, mengelola proses pemesanan (booking), dan mencatat pendapatan dari aktivitas penyewaan. Fitur ini bertujuan untuk mendigitalkan dan merapikan proses penyewaan, memaksimalkan utilisasi aset, dan menciptakan aliran pendapatan yang transparan.

---

#### **2\. Objectives & Success Metrics** {#2.-objectives-&-success-metrics-4}

**Objectives**

* **Mendigitalkan Proses Penyewaan:** Menghilangkan pencatatan manual berbasis buku untuk mengurangi risiko kesalahan seperti jadwal ganda (*double-booking*).  
* **Menciptakan Aliran Pendapatan Baru yang Terkelola:** Memberikan alat yang mudah untuk mengelola bisnis penyewaan dan mencatat pendapatannya secara akurat.  
* **Memberikan Visibilitas Penuh atas Aset:** Memudahkan pengelola untuk melihat aset mana yang sedang disewa, kapan tersedia, dan seberapa sering aset tersebut digunakan.

**Success Metrics**

* **Feature Adoption:** \>70% klien BUMDes yang memiliki unit usaha penyewaan mengaktifkan dan menggunakan modul ini secara aktif.  
* **Reduction in Manual Work:** Pengguna melaporkan penurunan waktu administrasi untuk mengelola penyewaan lebih dari 50% dibandingkan metode manual.  
* **Data-Driven Insights:** Klien dapat menggunakan data dari modul ini untuk menentukan aset mana yang paling menguntungkan dan mana yang kurang diminati.

---

#### **3\. Features** {#3.-features-4}

1. **Manajemen Katalog Aset Sewa**  
   * Halaman khusus untuk "Tambah/Edit Aset" yang terpisah dari inventaris produk jual.  
   * *Field* yang harus diisi: Nama Aset (misal: "Gedung Serbaguna Amanah"), Kode Aset, Foto, Deskripsi, dan Tarif Sewa (dengan pilihan periode: per Jam / per Hari / per Acara).  
2. **Kalender Penjadwalan Visual**  
   * Tampilan kalender interaktif (dengan view Bulanan dan Mingguan).  
   * Setiap jadwal sewa yang sudah dibuat akan muncul di kalender sebagai blok waktu yang terisi, menampilkan nama aset dan nama penyewa.  
   * Pengguna dapat mengklik tanggal atau slot waktu yang kosong untuk langsung membuat jadwal sewa baru.  
   * Terdapat kode warna untuk status jadwal: "Dipesan", "Sedang Berlangsung", "Selesai", "Dibatalkan".  
3. **Alur Pembuatan Jadwal Sewa (Booking)**  
   * Sebuah formulir untuk membuat pemesanan baru, berisi:  
     * Pilih Aset yang akan disewa (dari katalog aset).  
     * Pilih Pelanggan/Penyewa (terintegrasi dengan Modul Kontak).  
     * Tentukan Tanggal & Waktu Mulai Sewa.  
     * Tentukan Tanggal & Waktu Selesai Sewa.  
     * Total Biaya Sewa (otomatis dihitung berdasarkan tarif dan durasi).  
     * Catatan tambahan untuk pemesanan.  
4. **Manajemen Pemesanan & Penagihan**  
   * Halaman daftar yang berisi semua riwayat pemesanan (yang akan datang, sedang berjalan, dan yang sudah selesai).  
   * Kemampuan untuk mengubah status pemesanan (misalnya dari "Dipesan" menjadi "Selesai").  
   * Tombol "Buat Tagihan" pada setiap pemesanan untuk menghasilkan faktur sederhana yang bisa dicetak atau dikirim ke penyewa. Pendapatan dari tagihan ini tercatat otomatis di laporan keuangan.

---

#### **4\. Use Case** {#4.-use-case-4}

1. **Admin BUMDes Menyewakan Gedung Serbaguna**  
   * **Aktor:** Admin BUMDes.  
   * **Skenario:** Seorang warga desa datang untuk menyewa gedung serbaguna untuk acara pernikahan. Admin membuka Kalender Penjadwalan, melihat tanggal yang diinginkan masih kosong, lalu mengklik tanggal tersebut untuk membuat jadwal sewa baru. Ia memasukkan data warga sebagai penyewa dan detail acara.  
   * **Hasil:** Jadwal sewa tersimpan, slot waktu di kalender terisi, dan admin dapat langsung mencetak tagihan uang sewa untuk diberikan kepada warga tersebut.  
2. **Manajer BUMDes Memeriksa Utilisasi Aset**  
   * **Aktor:** Manajer BUMDes.  
   * **Skenario:** Di akhir bulan, manajer ingin tahu seberapa sering traktor milik BUMDes disewa oleh petani. Ia membuka halaman daftar pemesanan dan memfilter berdasarkan aset "Traktor Tangan".  
   * **Hasil:** Manajer dapat melihat daftar semua penyewaan traktor selama sebulan, lengkap dengan total pendapatan yang dihasilkan, untuk bahan evaluasi efektivitas aset.

---

#### **5\. Dependencies** {#5.-dependencies-4}

* **Modul Manajemen Kontak:** Diperlukan untuk memilih siapa yang menyewa aset.  
* **Modul Laporan:** Pendapatan dari sewa harus terintegrasi ke dalam Laporan Laba/Rugi dan Laporan Arus Kas.  
* **Modul Manajemen Unit Usaha:** Setiap aset harus dapat dialokasikan ke unit usaha tertentu (misal: "Unit Usaha Jasa & Penyewaan").  
* **UI/UX Design:** Desain kalender yang intuitif dan mudah digunakan pada perangkat mobile maupun desktop adalah kunci keberhasilan adopsi fitur ini.

---

#### **6\. Requirements** {#6.-requirements-4}

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pengelolaan Katalog Aset Sewa** | Sebagai Manajer BUMDes, saya ingin bisa mendaftarkan semua aset yang bisa disewakan beserta tarifnya | Sebagai Manajer BUMDes, ketika saya membuka modul aset, maka saya bisa menambahkan aset baru seperti "Gedung Serbaguna" dengan tarif sewa per hari. | Highest | \- Terdapat menu "Manajemen Aset Sewa". \- Pengguna dapat membuat aset baru dengan mengisi nama, deskripsi, dan tarif sewa. \- Aset yang dibuat akan muncul di daftar aset dan dapat dipilih saat membuat jadwal sewa. |
|  | agar saya memiliki daftar inventaris aset yang jelas. |  |  |  |
| **Penjadwalan Sewa Visual** | Sebagai Admin, saya ingin melihat semua jadwal sewa dalam bentuk kalender | Sebagai Admin, ketika saya membuka Kalender Penjadwalan, maka saya akan melihat blok-blok waktu yang sudah dipesan beserta nama penyewanya. | Highest | \- Halaman kalender menampilkan jadwal sewa yang sudah dibuat dengan benar. \- Tidak mungkin membuat jadwal baru yang tumpang tindih dengan jadwal yang sudah ada untuk aset yang sama. \- Kalender dapat menampilkan view bulanan dan mingguan. |
|  | agar saya dapat dengan cepat mengetahui ketersediaan aset dan menghindari jadwal ganda. |  |  |  |
| **Proses Pembuatan Jadwal Sewa** | Sebagai Admin, saya ingin bisa dengan mudah membuat jadwal sewa baru untuk pelanggan | Sebagai Admin, ketika saya membuat jadwal sewa baru, maka saya bisa memilih aset, pelanggan, tanggal, dan sistem akan menghitung biayanya secara otomatis. | High | \- Formulir pembuatan jadwal sewa berfungsi dengan baik. \- Total biaya sewa terhitung otomatis berdasarkan tarif aset dan durasi sewa. \- Jadwal yang baru dibuat langsung muncul di Kalender Penjadwalan. \- Pendapatan dari sewa ini tercatat di laporan keuangan setelah pembayaran dikonfirmasi. |
|  | agar proses pemesanan tercatat dengan rapi dan akurat. |  |  |  |

### **Modul Laporan** {#modul-laporan}

|  |  |
| :---- | :---- |
| **Product Name** | Modul Laporan (PWA SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Januari 2026 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description** {#1.-description-5}

Modul Laporan adalah pusat intelijen bisnis dari PWA. Modul ini berfungsi untuk mengagregasi, mengolah, dan menyajikan semua data transaksional dari modul lain (Kasir, Marketplace, Inventaris, Keuangan) ke dalam format laporan yang terstruktur dan mudah dipahami. Tujuannya adalah untuk memberikan para pemilik bisnis wawasan mendalam mengenai kinerja penjualan, profitabilitas, dan kesehatan keuangan usaha mereka, sehingga dapat mendukung pengambilan keputusan strategis yang berbasis data.

---

#### **2\. Objectives & Success Metrics** {#2.-objectives-&-success-metrics-5}

**Objectives**

* **Menyediakan Gambaran Finansial yang Jelas:** Menyajikan laporan keuangan kunci (Laba/Rugi, Arus Kas, Neraca Sederhana) yang akurat dan mudah dimengerti.  
* **Memfasilitasi Analisis Kinerja:** Memungkinkan pengguna untuk menganalisis tren, mengidentifikasi produk terlaris, dan memahami struktur biaya mereka.  
* **Meningkatkan Literasi Finansial Pengguna:** Menjadi alat bantu bagi pemilik bisnis untuk lebih memahami kesehatan dan potensi usaha mereka.

**Success Metrics**

* **Data Accuracy:** Tingkat akurasi data pada laporan adalah 99.9% jika dibandingkan dengan kalkulasi manual dari data transaksi sumber.  
* **Feature Usage:** Lebih dari 70% klien aktif membuka Modul Laporan setidaknya sekali seminggu. Fitur filter periode tanggal digunakan pada mayoritas sesi.  
* **User Confidence:** Berdasarkan survei, \>80% pengguna merasa lebih percaya diri dalam mengambil keputusan bisnis setelah menggunakan laporan di PWA ini.

---

#### **3\. Features** {#3.-features-5}

1. **Filter Universal**  
   * Komponen filter berdasarkan rentang tanggal (Hari Ini, 7 Hari Terakhir, Bulan Ini, 3 Bulan Terakhir, Kustom) yang berlaku untuk semua jenis laporan.  
   * Kemampuan untuk membandingkan dengan periode sebelumnya (opsional untuk versi awal).  
2. **Laporan Laba/Rugi**  
   * Menampilkan ringkasan pendapatan dan pengeluaran dalam periode yang dipilih.  
   * Struktur:  
     * **Pendapatan (Penjualan Bersih)**  
     * **(-) Harga Pokok Penjualan (HPP)**  
     * **(=) Laba Kotor**  
     * **(-) Beban Operasional** (Total dari pencatatan pengeluaran)  
     * **(=) Laba Bersih (Sebelum Pajak)**  
3. **Laporan Arus Kas (Metode Langsung)**  
   * Melaporkan semua uang tunai yang masuk dan keluar.  
   * Struktur:  
     * **Arus Kas dari Aktivitas Operasi:**  
       * *Penerimaan Kas:* dari pelanggan (penjualan tunai).  
       * *Pembayaran Kas:* ke pemasok, untuk gaji, untuk biaya operasional.  
     * **Arus Kas dari Aktivitas Pendanaan:**  
       * *Penerimaan Kas:* dari setoran modal pemilik.  
     * **Kenaikan/Penurunan Kas Bersih**  
     * **Saldo Kas Awal & Akhir Periode**  
4. **Neraca Sederhana (Laporan Posisi Keuangan)**  
   * Memberikan potret keuangan bisnis pada akhir periode yang dipilih.  
   * Struktur Sederhana:  
     * **ASET**  
       * *Aset Lancar:* Kas dan Setara Kas, Nilai Persediaan (Stok).  
     * **LIABILITAS & EKUITAS**  
       * *Liabilitas:* (Kosong untuk MVP awal, dapat diisi Utang Usaha di masa depan).  
       * *Ekuitas:* Modal Disetor, Laba Ditahan (Akumulasi Laba Bersih).  
   * Selalu menampilkan validasi sederhana: **Total Aset \= Total Liabilitas \+ Ekuitas**.  
5. **Laporan Penjualan Rinci**  
   * Laporan yang lebih fokus pada analisis penjualan.  
   * Tampilan:  
     * **Ringkasan Penjualan:** Omzet Total, Jumlah Transaksi, Rata-Rata Belanja per Transaksi.  
     * **Analisis Produk:** Daftar produk terlaris berdasarkan kuantitas dan pendapatan.  
     * **Analisis per Channel:** Perbandingan penjualan dari Kasir (POS) vs Marketplace.  
6. **Fitur Ekspor**  
   * Tombol "Ekspor ke CSV/Excel" pada setiap halaman laporan, memungkinkan pengguna mengolah data lebih lanjut.

---

#### **4\. Use Case** {#4.-use-case-5}

1. **Pemilik Toko Bangunan Mengevaluasi Kinerja Bulanan**  
   * **Aktor:** Pemilik Toko Bangunan.  
   * **Skenario:** Di awal bulan, pemilik membuka Modul Laporan, memilih periode "Bulan Lalu", dan membuka Laporan Laba/Rugi.  
   * **Hasil:** Ia melihat laba bersih yang dihasilkan. Kemudian ia membuka Laporan Penjualan Rinci untuk melihat produk semen mana yang paling laku, dan memutuskan untuk menambah stok produk tersebut.  
2. **Bendahara Koperasi Menyiapkan Laporan untuk Rapat Anggota**  
   * **Aktor:** Bendahara Koperasi.  
   * **Skenario:** Menjelang Rapat Anggota Tahunan, bendahara menggunakan PWA untuk menghasilkan Laporan Laba/Rugi, Arus Kas, dan Neraca Sederhana untuk periode satu tahun.  
   * **Hasil:** Ia mengekspor semua laporan ke dalam format Excel untuk kemudian digabungkan ke dalam materi presentasi rapat, menghemat waktu rekapitulasi manual.

---

#### **5\. Dependencies** {#5.-dependencies-5}

* **Ketergantungan Data Kritis:** Modul ini sepenuhnya bergantung pada data yang akurat dan lengkap dari Modul **Inventaris** (untuk HPP), **Kasir (POS)**, **Marketplace** (untuk Pendapatan), dan **Pencatatan Keuangan** (untuk Beban dan Modal).  
* **Logika Backend:** Membutuhkan logika kalkulasi dan agregasi data yang kompleks dan teruji di sisi backend untuk memastikan semua angka akurat.  
* **UI/UX Design:** Desainer harus mampu menyajikan data finansial yang padat menjadi visualisasi (grafik, tabel) yang bersih, menarik, dan mudah dimengerti.

---

#### **6\. Requirements** {#6.-requirements-5}

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pelaporan Profitabilitas** | Sebagai pemilik bisnis, saya ingin bisa melihat Laporan Laba/Rugi untuk periode waktu tertentu | Sebagai pemilik bisnis, ketika saya memilih periode waktu dan membuka Laporan Laba/Rugi, maka saya akan melihat rincian pendapatan, HPP, dan beban untuk mengetahui laba bersih saya. | Highest | \- Laporan menampilkan semua komponen L/R dengan benar. \- Data dapat difilter berdasarkan rentang tanggal. \- Angka Pendapatan cocok dengan total penjualan di Laporan Penjualan. \- Angka Beban cocok dengan total di pencatatan pengeluaran. \- Kalkulasi Laba Kotor dan Laba Bersih akurat. |
|  | agar saya tahu apakah bisnis saya untung atau rugi. |  |  |  |
| **Analisis Penjualan** | Sebagai manajer, saya ingin tahu produk mana yang paling laku terjual | Sebagai manajer, ketika saya membuka Laporan Penjualan Rinci, maka saya akan melihat daftar produk yang diurutkan berdasarkan penjualan tertinggi. | High | \- Laporan Penjualan memiliki bagian "Produk Terlaris". \- Pengurutan dapat dilakukan berdasarkan "Jumlah Terjual" atau "Total Pendapatan". \- Data penjualan dapat diekspor ke format CSV/Excel. \- Data cocok dengan catatan transaksi individual. |
|  | sehingga saya bisa membuat strategi promosi dan pembelian stok yang lebih baik. |  |  |  |
| **Pemahaman Posisi Keuangan** | Sebagai pemilik bisnis, saya ingin melihat ringkasan aset dan modal yang saya miliki dalam bisnis | Sebagai pemilik bisnis, ketika saya membuka laporan Neraca Sederhana, maka saya akan melihat nilai total dari kas dan persediaan barang saya, serta total modal saya. | High | \- Laporan Neraca Sederhana menampilkan komponen Aset (Kas, Persediaan) dan Ekuitas (Modal, Laba Ditahan). \- Nilai Persediaan dihitung berdasarkan Harga Beli (modal) dari produk yang tersisa. \- Persamaan `Aset = Liabilitas + Ekuitas` harus seimbang. \- Angka Laba Ditahan cocok dengan akumulasi Laba Bersih dari Laporan L/R. |
|  | agar saya dapat mengukur kesehatan keuangan bisnis saya secara keseluruhan. |  |  |  |

### **Modul Landing Page (Adaptif)** {#modul-landing-page-(adaptif)}

|  |  |
| :---- | :---- |
| **Product Name** | Modul Landing Page (Adaptif untuk Klien SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 15 Juli 2025 |
| **Stage** | Scoping & Design |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description** {#1.-description-6}

Modul Landing Page adalah fitur yang menyediakan halaman depan (*storefront*) publik yang profesional dan menarik untuk setiap klien PWA. Halaman ini bersifat adaptif, artinya konten, penawaran, dan *call-to-action* (CTA) akan secara otomatis menyesuaikan dengan jenis bisnis klien (Koperasi, UMKM Toko Bangunan, atau BUMDes). Tujuannya adalah untuk memperkenalkan bisnis klien kepada audiens yang relevan, membangun kepercayaan, dan menjadi gerbang utama untuk akuisisi pelanggan atau anggota baru.

---

#### **2\. Objectives & Success Metrics** {#2.-objectives-&-success-metrics-6}

**Objectives**

* **Meningkatkan Visibilitas Online Klien:** Memberikan setiap klien "wajah digital" yang profesional.  
* **Mendorong Akuisisi Sesuai Target:**  
  * **Koperasi:** Meningkatkan jumlah pendaftaran anggota baru.  
  * **Toko Bangunan:** Menghasilkan *leads* (calon pembeli) dan mendorong penelusuran katalog online.  
  * **BUMDes:** Meningkatkan kesadaran publik dan mempromosikan potensi desa.  
* **Menyediakan Akses Informasi yang Cepat:** Memudahkan audiens target untuk memahami layanan dan keunggulan yang ditawarkan oleh klien.

**Success Metrics**

* **Conversion Rate:** Tingkat konversi CTA utama \> 3% untuk semua jenis klien.  
* **Bounce Rate:** Angka pentalan (pengunjung yang langsung pergi) di bawah 60%.  
* **Client Satisfaction:** \>85% klien merasa landing page mereka secara akurat dan menarik merepresentasikan bisnis mereka.

---

#### **3\. Features (Adaptif per Jenis Klien)** {#3.-features-(adaptif-per-jenis-klien)}

Struktur halaman akan sama, namun konten di dalamnya akan dinamis.

| Section | Konten untuk Koperasi (Baseline) | Konten untuk UMKM Toko Bangunan | Konten untuk BUMDes |  |
| :---- | :---- | :---- | :---- | :---- |
| **1\. Header** | Logo Koperasi, Menu Navigasi, CTA "Gabung Koperasi" | Logo Toko, Menu, CTA "Lihat Produk" | Logo BUMDes, Menu, CTA "Jelajahi Unit Usaha" |  |
| **2\. Hero Section** |  | **Headline:** "Gabung Koperasi, Kuatkan Ekonomi Bersama". Ilustrasi kebersamaan/gotong royong. | **Headline:** "Toko Bangunan Anda Kini Online\! Jangkau Lebih Banyak Pelanggan". Foto fasad toko atau proyek konstruksi. | **Headline:** "Majukan Ekonomi Desa. Temukan Potensi Lokal di Sini". Foto produk unggulan desa atau pemandangan ikonik. |
| **3\. Tentang Bisnis** | Visi & Misi Koperasi, Sejarah, Legalitas. | Sejarah Singkat Toko, Keunggulan (Kenapa Beli di Sini?), Daftar Merek yang Dijual. | Profil Desa, Tujuan Pendirian BUMDes, Struktur Organisasi. |  |
| **4\. Layanan/Produk Unggulan** | Simpanan (Pokok, Wajib, Sukarela), Pembiayaan, Unit Usaha. | **Kategori Produk Terlaris:** Semen & Pasir, Cat & Perlengkapan, Pipa & Sanitasi. **Layanan:** Pengantaran, Konsultasi. | **Unit Usaha Unggulan:** Desa Wisata, Toko Kelontong Desa, Sewa Aset, Kerajinan Lokal. |  |
| **5\. Keunggulan/Manfaat** | Bagi Hasil (SHU), Transparansi, Mendukung Ekonomi Lokal. | Harga Kompetitif, Stok Lengkap & Ready, Layanan Cepat & Profesional. | Transparansi Pengelolaan, Memberdayakan Warga Lokal, Mendukung Pendapatan Asli Desa (PADes). |  |
| **6\. Testimoni** | Kutipan dari anggota aktif. | Kutipan dari pelanggan setia (kontraktor atau pemilik rumah). | Kutipan dari warga desa, tokoh masyarakat, atau wisatawan. |  |
| **7\. Formulir CTA** |  | **Formulir Pendaftaran Anggota:** Nama, Kontak, Alamat. CTA: "Kirim & Hubungi Saya". | **Formulir "Minta Penawaran":** Nama, Kontak, Kebutuhan Material. CTA: "Kirim Permintaan". | **Formulir "Kontak Kami":** Nama, Kontak, Pesan/Pertanyaan. CTA: "Kirim Pesan". |

---

#### **4\. Use Case** {#4.-use-case-6}

1. **Calon Anggota Mendaftar ke Koperasi (Baseline)**  
   * **Aktor:** Calon anggota.  
   * **Skenario:** Calon anggota membuka landing page, tertarik dengan manfaat yang ditawarkan, lalu mengisi formulir pendaftaran.  
   * **Hasil:** Data terkirim ke admin koperasi untuk di-follow up.  
2. **Kontraktor Mencari Supplier Material Bangunan**  
   * **Aktor:** Kontraktor Bangunan.  
   * **Skenario:** Kontraktor mencari toko bangunan terdekat via Google dan menemukan landing page klien. Ia melihat kategori produk yang dijual dan testimoni dari pelanggan lain, lalu mengisi form "Minta Penawaran" untuk proyeknya.  
   * **Hasil:** Admin toko bangunan menerima notifikasi berisi daftar kebutuhan material dan segera menghubungi kontraktor tersebut.  
3. **Wisatawan Mencari Informasi Desa Wisata**  
   * **Aktor:** Wisatawan Domestik.  
   * **Skenario:** Wisatawan berencana mengunjungi sebuah daerah dan menemukan landing page BUMDes. Ia melihat informasi tentang unit usaha "Desa Wisata", melihat foto-foto menarik, dan mengirim pesan melalui form kontak untuk menanyakan paket wisata.  
   * **Hasil:** Admin BUMDes menerima pertanyaan dan membalas dengan informasi paket wisata, berpotensi menghasilkan pendapatan baru untuk desa.

---

#### **5\. Dependencies** {#5.-dependencies-6}

* Konten profil, layanan, dan foto dari setiap klien.  
* Akses ke email atau sistem CRM klien untuk integrasi formulir.  
* Desain UI/UX yang memiliki komponen "slot" yang dapat diisi konten dinamis sesuai jenis klien.

---

#### **6\. Requirements** {#6.-requirements-6}

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Akuisisi Klien/Anggota Baru** | Sebagai calon klien/anggota, saya ingin bisa mendaftar atau menghubungi bisnis dengan mudah melalui landing page | Sebagai calon klien/anggota, ketika saya mengisi formulir kontak/pendaftaran di landing page, maka data saya akan terkirim ke pemilik bisnis dan saya akan menerima konfirmasi. | Highest | \- Landing page menampilkan formulir yang sesuai dengan jenis bisnis (Pendaftaran/Penawaran/Kontak).\- Validasi input pada formulir berfungsi dengan baik.\- Setelah submit, sistem mengirimkan notifikasi ke email admin klien. \- Pengunjung melihat halaman "Terima Kasih" atau pesan konfirmasi. |
|  | sehingga saya bisa dengan cepat terhubung dengan bisnis tersebut. |  |  |  |
| **Tampilan Informasi Adaptif** | Sebagai pemilik bisnis, saya ingin landing page saya secara otomatis menampilkan informasi yang relevan dengan jenis bisnis saya | Sebagai pemilik bisnis, ketika saya memilih jenis bisnis (misal: "Toko Bangunan") saat setup awal, maka landing page saya akan otomatis menggunakan template headline, layanan, dan CTA yang sesuai untuk toko bangunan. | Highest | \- Sistem memiliki template konten yang berbeda untuk Koperasi, UMKM Toko Bangunan, dan BUMDes. \- Pemilihan jenis bisnis saat onboarding akan menentukan template mana yang digunakan. \- Semua bagian (Hero, Layanan, CTA) berubah sesuai template yang dipilih. |
|  | agar halaman saya terlihat profesional dan tepat sasaran tanpa perlu mengedit manual secara ekstensif. |  |  |  |

