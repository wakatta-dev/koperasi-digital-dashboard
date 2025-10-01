### **Modul Manajemen Unit Usaha Terpisah**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Manajemen Unit Usaha Terpisah |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 30 April 2026 |
| **Stage** | Scoping |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Manajemen Unit Usaha Terpisah adalah sebuah fitur tingkat lanjut yang memungkinkan satu akun bisnis untuk mengelola beberapa lini usaha atau cabang secara independen. Fungsi utamanya adalah untuk memisahkan data operasional dan keuangan—seperti produk, penjualan, dan biaya—untuk setiap unit usaha. Hal ini memungkinkan manajer untuk menganalisis kinerja setiap unit secara terpisah serta melihat laporan konsolidasi dari seluruh perusahaan. Fitur ini sangat krusial bagi BUMDes yang memiliki beragam unit (toko, wisata, sewa) dan memerlukan pelaporan yang akuntabel per unitnya.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Memberikan Kejelasan Operasional & Finansial:** Memastikan data dari setiap unit usaha tidak tercampur, sehingga analisis menjadi akurat.  
* **Menyederhanakan Pelaporan Pertanggungjawaban:** Memudahkan manajer BUMDes untuk membuat laporan kinerja per unit kepada pemerintah desa atau pemangku kepentingan lainnya.  
* **Mendukung Pengambilan Keputusan Strategis:** Membantu manajemen mengidentifikasi unit mana yang paling profitabel dan unit mana yang memerlukan perbaikan.

**Success Metrics**

* **Feature Adoption:** \>80% dari total klien BUMDes mengaktifkan dan menggunakan modul ini.  
* **Reporting Usage:** Fitur filter "Unit Usaha" pada Modul Laporan digunakan secara rutin oleh klien yang mengaktifkan modul ini.  
* **Qualitative Feedback:** Klien BUMDes menyatakan bahwa modul ini "sangat penting" dan "memudahkan" proses pelaporan pertanggungjawaban mereka.

---

#### **3\. Features**

1. **Pengaturan Unit Usaha (Di Halaman Pengaturan)**  
   * Halaman untuk membuat, mengedit, dan menonaktifkan "Unit Usaha".  
   * Setiap unit usaha memiliki nama yang unik (misal: "Unit Toko Sembako", "Unit Wisata Curug", "Unit Sewa Traktor").  
2. **Penandaan (Tagging) Data per Unit Usaha**  
   * **Integrasi dengan Inventaris:** Saat menambah/mengedit produk, terdapat *field* wajib "Milik Unit Usaha" untuk mengalokasikan produk tersebut.  
   * **Integrasi dengan Keuangan:** Saat mencatat pengeluaran atau pemasukan lain, pengguna wajib memilih unit usaha terkait.  
   * **Integrasi dengan Pengguna:** Admin dapat memberikan hak akses kepada pengguna hanya untuk unit usaha tertentu.  
3. **Filter Global Unit Usaha**  
   * Sebuah *dropdown menu* utama yang selalu ada di bagian atas aplikasi (header).  
   * Pengguna (terutama Admin) dapat beralih tampilan antara:  
     * **"Semua Unit Usaha (Konsolidasi)"**: Menampilkan data gabungan.  
     * **"\[Nama Unit Usaha\]"**: Hanya menampilkan data yang relevan dengan unit yang dipilih.  
   * Pilihan pada filter ini akan secara otomatis mengubah data yang ditampilkan di semua modul lain (Dashboard, Inventaris, Laporan, dll.).  
4. **Integrasi Laporan yang Mendalam**  
   * Modul Laporan akan sepenuhnya "sadar" akan unit usaha.  
   * Pengguna dapat melihat Laporan Laba/Rugi, Arus Kas, dan Penjualan untuk:  
     * **Satu unit usaha spesifik.**  
     * **Seluruh perusahaan (konsolidasi).**  
   * Kemungkinan adanya laporan baru: "Laporan Perbandingan Kinerja Antar Unit Usaha".

---

#### **4\. Use Case**

1. **Manajer BUMDes Menganalisis Kinerja untuk Rapat Internal**  
   * **Aktor:** Manajer BUMDes (Admin).  
   * **Skenario:** Manajer ingin tahu unit mana yang paling menguntungkan bulan lalu. Ia membuka Modul Laporan, lalu menggunakan Filter Global untuk melihat Laporan Laba/Rugi untuk "Unit Toko Sembako". Setelah itu, ia beralih filter ke "Unit Wisata Curug" untuk membandingkan.  
   * **Hasil:** Manajer mendapatkan data laba/rugi yang terpisah untuk setiap unit, memudahkannya dalam menyusun strategi untuk bulan berikutnya.  
2. **Kasir Loket Wisata Hanya Mengakses Data Relevan**  
   * **Aktor:** Petugas Kasir Loket Wisata.  
   * **Skenario:** Petugas tersebut login ke PWA. Oleh Admin, akunnya telah diatur agar hanya memiliki akses ke "Unit Wisata Curug". Saat ia membuka Modul Kasir (POS), produk yang muncul hanyalah "Tiket Masuk Dewasa" dan "Tiket Masuk Anak".  
   * **Hasil:** Petugas tidak bisa melihat atau menjual produk dari "Unit Toko Sembako", sehingga mencegah kesalahan operasional dan menjaga kerahasiaan data antar unit.

---

#### **5\. Dependencies**

* **Perubahan Arsitektur Database:** Ketergantungan kritis pada penambahan kolom `unit_usaha_id` pada hampir semua tabel data transaksional (produk, penjualan, biaya, pengguna, dll.).  
* **Refactoring Modul Lain:** Semua modul yang ada (Dashboard, Inventaris, POS, Laporan, dll.) harus di-refactor agar dapat memfilter data berdasarkan Filter Global Unit Usaha.  
* **UI/UX Design:** Memerlukan desain yang sangat jelas untuk alur pemilihan unit usaha, baik pada filter global maupun pada saat input data, agar tidak membingungkan pengguna.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Konfigurasi dan Isolasi Data Unit Usaha** | Sebagai Manajer BUMDes, saya ingin bisa mendefinisikan unit-unit usaha saya di dalam sistem dan mengalokasikan setiap produk dan biaya ke unit yang sesuai | Sebagai Manajer BUMDes, ketika saya menambahkan produk baru, maka saya harus memilih unit usaha mana yang memiliki produk tersebut. | Highest | \- Admin dapat membuat, mengedit, dan menghapus Unit Usaha di Pengaturan. \- Saat membuat produk, biaya, atau transaksi manual lainnya, terdapat *field* wajib untuk memilih Unit Usaha. \- Data yang sudah dialokasikan tidak dapat dilihat oleh pengguna yang tidak memiliki akses ke unit tersebut. |
|  | agar data operasional dan keuangan setiap unit tidak tercampur. |  |  |  |
| **Analisis Kinerja Terpisah** | Sebagai Manajer BUMDes, saya ingin bisa melihat laporan keuangan (seperti Laba/Rugi) hanya untuk satu unit usaha saja | Sebagai Manajer BUMDes, ketika saya memilih "Unit Wisata" pada Filter Global dan membuka Laporan Laba/Rugi, maka laporan yang ditampilkan hanya berisi pendapatan dan beban dari "Unit Wisata". | Highest | \- Terdapat Filter Global untuk memilih Unit Usaha. \- Semua halaman laporan (L/R, Penjualan, dll) merespons perubahan pada Filter Global. \- Angka pada laporan yang difilter sesuai dengan jumlah transaksi yang ditandai dengan unit usaha tersebut. |
|  | sehingga saya dapat mengevaluasi kinerja setiap unit secara independen. |  |  |  |
| **Akses Terbatas untuk Staf Unit** | Sebagai Admin, saya ingin bisa membatasi akses seorang karyawan hanya untuk unit usaha tempatnya bekerja | Sebagai Admin, ketika saya menetapkan "User A" hanya untuk "Unit Toko", maka saat "User A" login, ia tidak bisa melihat atau berinteraksi dengan data dari "Unit Wisata". | High | \- Di Manajemen Pengguna, Admin dapat mengalokasikan satu atau lebih Unit Usaha untuk setiap pengguna. \- Pengguna yang dibatasi hanya akan melihat data dari unit yang dialokasikan kepadanya. \- Filter Global akan dinonaktifkan atau hanya menampilkan unit yang menjadi hak aksesnya. |
|  | demi keamanan dan untuk mencegah kesalahan operasional. |  |  |  |

