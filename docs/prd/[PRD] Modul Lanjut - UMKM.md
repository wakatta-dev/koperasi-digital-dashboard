### **Modul Manajemen Harga Bertingkat**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Manajemen Harga Bertingkat |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 28 Februari 2026 |
| **Stage** | Scoping |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Manajemen Harga Bertingkat adalah fitur lanjutan yang memungkinkan klien untuk menetapkan beberapa level harga jual (misalnya, Eceran, Grosir, Kontraktor) untuk produk yang sama. Sistem ini terintegrasi secara mendalam dengan Modul Inventaris, Manajemen Kontak, dan Kasir (POS) untuk mengotomatisasi penerapan harga yang tepat berdasarkan segmen pelanggan saat transaksi, menghilangkan kebutuhan akan diskon manual dan mengurangi potensi kesalahan.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Memberikan Fleksibilitas Strategi Harga:** Memungkinkan klien untuk menerapkan harga yang berbeda kepada kelompok pelanggan yang berbeda untuk meningkatkan loyalitas dan volume penjualan.  
* **Mengotomatisasi Proses Penjualan:** Mengurangi kesalahan kasir dan mempercepat layanan dengan penerapan harga yang benar secara otomatis di Point of Sale.  
* **Meningkatkan Retensi Pelanggan Bisnis (B2B):** Memberikan nilai lebih kepada pelanggan setia (seperti kontraktor) melalui harga khusus yang terkelola dengan baik.

**Success Metrics**

* **Feature Adoption:** \>60% klien dari segmen UMKM Toko Bangunan mengaktifkan dan menggunakan modul ini dalam 3 bulan pertama setelah dirilis.  
* **Error Reduction:** Penurunan \>90% dalam penggunaan fitur diskon manual pada transaksi untuk pelanggan yang telah ditetapkan dalam tingkatan harga khusus.  
* **User Feedback:** Klien memberikan feedback positif bahwa fitur ini secara signifikan membantu dalam mengelola hubungan dengan pelanggan utama mereka.

---

#### **3\. Features**

1. **Pengaturan Tingkatan Harga (Di Halaman Pengaturan)**  
   * Kemampuan untuk membuat, menamai, dan mengedit tingkatan harga (misal: "Harga Grosir", "Harga Proyek").  
   * "Harga Eceran" adalah tingkatan default yang tidak dapat dihapus dan berlaku untuk pelanggan umum.  
2. **Penetapan Harga pada Produk (Perubahan di Modul Inventaris)**  
   * Pada halaman "Tambah/Edit Produk", di bawah "Harga Jual" (yang kini menjadi harga eceran default), akan ada bagian baru untuk "Harga Bertingkat".  
   * Admin dapat memasukkan harga spesifik untuk setiap tingkatan yang telah dibuat (misal: Harga Grosir Rp9.000, Harga Proyek Rp8.500).  
   * Jika harga untuk tingkatan tertentu tidak diisi, maka akan otomatis menggunakan Harga Eceran.  
3. **Penetapan Tingkatan pada Pelanggan (Perubahan di Modul Kontak)**  
   * Pada halaman "Tambah/Edit Kontak (Pelanggan)", ditambahkan sebuah *dropdown menu* baru bernama "Tingkatan Harga".  
   * Admin dapat menetapkan setiap pelanggan ke tingkatan harga tertentu. Pelanggan baru secara default akan masuk ke "Harga Eceran".  
4. **Integrasi dengan Modul Kasir (POS) (Perubahan di Modul POS)**  
   * Di antarmuka Kasir, sebelum menambahkan produk, ditambahkan tombol "Pilih Pelanggan".  
   * Ketika kasir memilih seorang pelanggan yang terdaftar, sistem secara otomatis akan menggunakan harga dari tingkatan yang telah ditetapkan untuk pelanggan tersebut pada semua produk yang ditambahkan ke keranjang.  
   * Jika tidak ada pelanggan yang dipilih, sistem akan menggunakan "Harga Eceran".  
   * Nama pelanggan akan tercetak di struk untuk validasi.

---

#### **4\. Use Case**

1. **Pemilik Toko Menetapkan Harga untuk Kontraktor**  
   * **Aktor:** Pemilik Toko Bangunan (Admin).  
   * **Skenario:** Pemilik toko membuat tingkatan harga baru bernama "Harga Kontraktor". Kemudian, ia membuka produk "Semen ABC", menetapkan Harga Eceran Rp55.000 dan Harga Kontraktor Rp52.000. Terakhir, ia membuka kontak "Bapak Budi" dan mengubah tingkatannya menjadi "Harga Kontraktor".  
   * **Hasil:** Bapak Budi kini secara resmi terdaftar sebagai pelanggan dengan harga khusus di dalam sistem.  
2. **Kasir Melayani Transaksi Pelanggan Kontraktor**  
   * **Aktor:** Kasir.  
   * **Skenario:** Bapak Budi datang ke toko untuk membeli 10 sak Semen ABC. Kasir menekan "Pilih Pelanggan" di POS, mencari dan memilih "Bapak Budi". Kemudian, ia menambahkan 10 Semen ABC ke keranjang.  
   * **Hasil:** Harga yang muncul di keranjang adalah Rp52.000 per sak, bukan Rp55.000. Transaksi berjalan cepat dan akurat tanpa kasir perlu mengingat harga khusus atau memberikan diskon manual.

---

#### **5\. Dependencies**

* **Modul Inventaris:** Perlu dimodifikasi untuk dapat menyimpan beberapa field harga jual per produk.  
* **Modul Manajemen Kontak:** Perlu dimodifikasi untuk dapat menyimpan atribut "Tingkatan Harga" per pelanggan.  
* **Modul Kasir (POS):** Perlu dimodifikasi secara signifikan untuk menyertakan alur pemilihan pelanggan dan logika pengambilan harga dinamis.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Konfigurasi Aturan Harga** | Sebagai Admin, saya ingin bisa membuat beberapa tingkatan harga dan menetapkan harga yang berbeda untuk setiap tingkatan pada produk saya | Sebagai Admin, ketika saya mengedit sebuah produk, maka saya bisa memasukkan harga untuk tingkat Eceran dan Grosir secara terpisah. | Highest | \- Admin dapat membuat dan memberi nama tingkatan harga di halaman Pengaturan. \- Di halaman Edit Produk, terdapat input field untuk setiap tingkatan harga yang telah dibuat. \- Harga yang disimpan untuk setiap tingkatan berhasil ditarik oleh sistem lain. |
|  | agar saya bisa menerapkan strategi harga yang berbeda untuk pelanggan yang berbeda. |  |  |  |
| **Segmentasi Pelanggan** | Sebagai Admin, saya ingin dapat menetapkan seorang pelanggan ke dalam tingkatan harga tertentu | Sebagai Admin, ketika saya mengedit data seorang pelanggan, maka saya bisa memilih tingkatan harganya (misal: "Grosir") dari sebuah daftar. | Highest | \- Di halaman Edit Kontak, terdapat *dropdown* "Tingkatan Harga". \- *Dropdown* tersebut berisi semua tingkatan harga yang telah dibuat di Pengaturan. \- Penetapan tingkatan pada pelanggan berhasil disimpan. |
|  | sehingga sistem tahu harga mana yang harus diberikan kepadanya. |  |  |  |
| **Aplikasi Harga Otomatis di POS** | Sebagai Kasir, saat saya memilih pelanggan di awal transaksi, saya ingin sistem otomatis menerapkan harga khusus untuknya | Sebagai Kasir, ketika saya memilih pelanggan "Bapak Budi" (Grosir) dan menambahkan produk "Semen ABC" ke keranjang, maka harga yang muncul adalah Harga Grosir, bukan Harga Eceran. | Highest | \- Tombol "Pilih Pelanggan" ada di antarmuka POS. \- Saat pelanggan dengan tingkatan khusus dipilih, harga produk di keranjang otomatis menyesuaikan. \- Jika tidak ada pelanggan yang dipilih, harga yang digunakan adalah Harga Eceran. \- Harga akhir di struk sesuai dengan harga yang diterapkan. |
|  | agar transaksi lebih cepat dan akurat. |  |  |  |

