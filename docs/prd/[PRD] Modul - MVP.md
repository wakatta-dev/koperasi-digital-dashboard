### **Product Requirement Document (PRD):** 

### **Modul Dashboard Utama**

|  |  |  |
| :---- | :---- | :---- |
|  | **Product Name** | Modul Dashboard Utama (PWA SaaS) |
|  | **Product Manager** | Yosh Wakatta |
|  | **Shipping Date** | 30 September 2025 |
|  | **Stage** | Development |
|  | **Status** | In Refinement |
|  | **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\.** Description

Dashboard Utama adalah halaman pertama yang dilihat pengguna setelah berhasil login ke dalam aplikasi PWA. Halaman ini berfungsi sebagai pusat informasi visual yang menyajikan ringkasan data dan metrik kinerja terpenting dari bisnis klien (Koperasi, BUMDes, atau UMKM Toko Bangunan) secara *real-time*. Tujuannya adalah untuk memberikan gambaran kondisi bisnis "at-a-glance" (sekali lihat) dan memungkinkan pengguna mengambil keputusan cepat serta mengakses modul lain dengan lebih efisien.

---

#### **2\.** Objectives & Success Metrics

**Objectives**

* **Menyediakan "Health Check" Bisnis Cepat:** Memungkinkan pemilik bisnis memahami kondisi usahanya dalam waktu kurang dari 30 detik.  
* **Meningkatkan Keterlibatan Pengguna:** Mendorong pengguna untuk menjelajahi modul lain melalui pintasan dan notifikasi yang relevan.  
* **Mendorong Pengambilan Keputusan Berbasis Data:** Menyajikan data kunci yang dapat memicu tindakan, seperti mengisi ulang stok atau menindaklanjuti pesanan.

**Success Metrics**

* **Engagement Rate:** Tingginya *Click-Through Rate (CTR)* pada widget notifikasi atau pintasan menuju modul lain (\>30%).  
* **User Retention:** Tingginya frekuensi login harian oleh pengguna untuk memeriksa dashboard.  
* **Qualitative Feedback:** Mendapatkan ulasan positif dari minimal 80% pengguna yang diwawancara, yang menyatakan bahwa dashboard membantu mereka memonitor bisnis secara efisien.

---

#### **3\.** Features

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

#### **4\.** Use Case

1. **Pemilik Toko Bangunan Melakukan Pengecekan Pagi**  
   * **Aktor:** Pemilik Toko.  
   * **Skenario:** Pemilik toko login di pagi hari. Ia langsung melihat widget Ringkasan Performa dan Notifikasi.  
   * **Hasil:** Ia mengetahui total penjualan kemarin, melihat ada 2 pesanan online baru yang masuk semalam, dan mendapat notifikasi bahwa stok semen tersisa sedikit. Ia langsung mengklik notifikasi stok untuk merencanakan pembelian.  
2. **Admin Koperasi Memonitor Aktivitas Harian**  
   * **Aktor:** Admin Koperasi.  
   * **Skenario:** Admin membuka dashboard untuk memantau aktivitas. Ia melihat grafik penjualan dan notifikasi anggota.  
   * **Hasil:** Admin melihat bahwa unit usaha toko koperasi sedang ramai. Ia juga melihat notifikasi pendaftaran anggota baru dan langsung mengklik untuk memprosesnya.  
3.  **Manajer BUMDes Mempersiapkan Laporan Mingguan**  
   * **Aktor:** Manajer/Admin BUMDes.  
   * **Skenario:** Manajer BUMDes login ke PWA pada hari Senin pagi untuk melihat performa keseluruhan dari semua unit usaha (misalnya: unit toko, unit sewa aset, dan unit wisata) sebelum rapat mingguan dengan Kepala Desa.  
   * **Hasil:** Melalui Dashboard Utama, manajer dengan cepat melihat total pendapatan gabungan dari semua unit. Ia melihat notifikasi bahwa ada jadwal sewa gedung yang akan datang dan grafik penjualan menunjukkan bahwa unit toko sedang meningkat pesat. Informasi ini langsung ia gunakan sebagai bahan utama untuk laporan kemajuan BUMDes kepada pemerintah desa.

   

---

#### **5\.** Dependencies

* **API Endpoints:** Ketersediaan API dari tim Backend untuk menyediakan data teragregasi (penjualan, stok, pesanan).  
* **UI/UX Design:** Desain final dari UI/UX Designer untuk setiap widget dan keseluruhan layout dashboard.  
* **Data Source:** Modul lain (Inventaris, POS, Marketplace, Keuangan) harus sudah fungsional untuk menyediakan data yang akurat ke dashboard.

---

#### **6\.** Requirements

Tabel berikut merinci Epics dan User Stories untuk pengembangan Modul Dashboard Utama.

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Visualisasi Kinerja Bisnis** | Sebagai pemilik bisnis, saya ingin melihat ringkasan metrik utama di dashboard | Sebagai pemilik bisnis, ketika saya membuka dashboard, maka saya akan melihat total penjualan, jumlah transaksi, dan pesanan baru hari ini. | Highest | \- Widget menampilkan data "Penjualan Hari Ini" dengan benar. \- Widget menampilkan "Total Transaksi Hari Ini". \- Data yang ditampilkan sesuai dengan data aktual dari modul terkait. \- Data dapat diperbarui secara otomatis atau dengan tombol *refresh*. |
|  | sehingga saya bisa mengetahui kondisi bisnis saya dengan cepat. |  |  |  |
| **Notifikasi Proaktif** | Sebagai pengguna, saya ingin mendapatkan notifikasi penting di dashboard | Sebagai pengguna, ketika ada stok produk yang menipis atau ada pesanan online baru, maka saya akan melihat notifikasi di dashboard. | Highest | \- Notifikasi muncul jika jumlah stok produk ≤ batas minimum. \- Notifikasi muncul jika ada pesanan dengan status "Baru". \- Setiap notifikasi memiliki link yang mengarahkan ke halaman relevan (detail produk atau manajemen pesanan). \- Notifikasi akan hilang setelah tindakan dilakukan (misal: pesanan diproses). |
|  | sehingga saya bisa segera mengambil tindakan yang diperlukan. |  |  |  |
| **Akses Cepat ke Fitur Lain** | Sebagai pengguna, saya ingin ada tombol pintasan untuk fitur yang sering saya pakai | Sebagai pengguna, ketika saya berada di dashboard, maka saya bisa langsung menekan tombol untuk membuat penjualan baru (POS). | High | \- Terdapat tombol/CTA "+ Penjualan Baru (POS)". \- Menekan tombol tersebut akan langsung mengarahkan pengguna ke halaman kasir (POS). \- Tombol pintasan lain (seperti "+ Tambah Produk") berfungsi sesuai tujuannya. |
|  | sehingga alur kerja saya menjadi lebih efisien. |  |  |  |

### **Product Requirement Document (PRD):** 

### **Modul Manajemen Akun & Pengguna**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Manajemen Akun & Pengguna (PWA SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Agustus 2025 |
| **Stage** | Development |
| **Status** | In Progress |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description**

Modul Manajemen Akun & Pengguna adalah gerbang utama bagi seluruh klien untuk masuk dan menggunakan PWA. Modul ini mencakup alur kerja krusial mulai dari pendaftaran bisnis baru (onboarding), autentikasi pengguna yang aman (login), pengelolaan informasi dasar bisnis (profil bisnis), hingga pengaturan hak akses untuk setiap anggota tim (manajemen peran). Keamanan, keandalan, dan kemudahan penggunaan adalah pilar utama dari modul ini karena menjadi fondasi bagi seluruh ekosistem aplikasi.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Menyediakan Onboarding yang Mulus & Aman:** Memastikan klien baru dapat mendaftarkan bisnisnya dengan mudah, cepat, dan dengan verifikasi yang valid.  
* **Menjamin Akses yang Aman & Andal:** Memberikan proses login yang terproteksi dan mudah bagi pengguna terdaftar, termasuk penanganan lupa password.  
* **Memberdayakan Klien untuk Mengelola Tim:** Memungkinkan pemilik bisnis (Admin) untuk mendelegasikan tugas dengan aman dengan cara memberikan hak akses yang berbeda kepada anggotanya.

**Success Metrics**

* **Registration Funnel Conversion:** Tingkat penyelesaian registrasi dari halaman pendaftaran hingga verifikasi email berhasil mencapai \> 85%.  
* **Security & Reliability:** Angka keberhasilan login \> 99%. Tidak ada insiden keamanan terkait kredensial pengguna pada 3 bulan pertama pasca-rilis.  
* **Feature Adoption:** Minimal 50% klien yang memiliki lebih dari satu karyawan aktif menggunakan fitur penambahan peran pengguna (misal: menambah Kasir) dalam 2 bulan pertama.

---

#### **3\. Features**

Fitur dibagi menjadi empat komponen utama:

1. **Alur Registrasi Klien Baru**  
   * Formulir pendaftaran dengan field: Nama Lengkap Pemilik, Nama Bisnis, Jenis Bisnis (Dropdown: Koperasi, BUMDes, UMKM Toko Bangunan), Email, Nomor WhatsApp, dan Password.  
   * Validasi kekuatan password secara real-time (misal: minimal 8 karakter, kombinasi huruf besar, kecil, dan angka).  
   * Mekanisme verifikasi email: Sistem mengirimkan link unik atau OTP ke email terdaftar yang harus dikonfirmasi untuk mengaktifkan akun.  
2. **Alur Login & Autentikasi**  
   * Halaman login dengan field: Email dan Password.  
   * Fitur "Lupa Password?" yang mengirimkan link reset password ke email pengguna.  
   * Fitur "Ingat Saya" (Remember Me) menggunakan *persistent cookie*.  
   * Proteksi *Brute Force Attack* (misal: mengunci akun selama beberapa menit setelah 5 kali gagal login).  
3. **Pengelolaan Profil Bisnis**  
   * Halaman "Profil Bisnis" yang dapat diakses oleh pengguna dengan peran Admin.  
   * Pengguna dapat mengedit informasi:  
     * Logo Bisnis  
     * Nama Bisnis  
     * Alamat Lengkap Kantor  
     * Email Kontak  
     * Nomor Telepon/WA Admin  
4. **Pengelolaan Pengguna & Peran (Roles)**  
   * Hanya dapat diakses oleh peran "Admin".  
   * Admin dapat:  
     * Melihat daftar semua pengguna yang terdaftar di bawah bisnisnya.  
     * Mengundang pengguna baru melalui email untuk bergabung sebagai "Kasir".  
     * Mengubah peran pengguna (jika ada peran baru di masa depan).  
     * Menonaktifkan akses pengguna (misal: untuk karyawan yang sudah berhenti).  
   * **Definisi Peran Awal:**  
     * **Admin:** Akses penuh ke semua modul yang dilanggan oleh bisnis, termasuk pengaturan, keuangan, dan manajemen pengguna.  
     * **Kasir:** Akses terbatas hanya pada "Modul Kasir (POS)". Tidak bisa melihat laporan keuangan, mengubah pengaturan, atau mengelola pengguna lain.

---

#### **4\. Use Case**

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

---

#### **5\. Dependencies**

* **Layanan Pihak Ketiga:** Integrasi dengan layanan email transaksional (seperti Mailgun, SendGrid) untuk pengiriman email verifikasi dan reset password.  
* **UI/UX Design:** Desain final dan *mockup* untuk semua alur (registrasi, login, lupa password, halaman profil, halaman manajemen pengguna) dari tim desainer.  
* **Infrastruktur Backend:** Penyiapan database yang aman dengan enkripsi (hashing) untuk password pengguna.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Onboarding Klien Baru** | Sebagai pemilik bisnis baru, saya ingin bisa mendaftarkan bisnis saya dengan mudah melalui formulir online | Sebagai pemilik bisnis baru, ketika saya mengisi formulir pendaftaran dengan data yang valid dan melakukan verifikasi email, maka akun bisnis saya akan aktif dan saya bisa login sebagai Admin. | Highest | \- Formulir pendaftaran memvalidasi semua input (format email, kekuatan password). \- Email verifikasi berhasil terkirim setelah submit formulir. \- Akun tidak dapat digunakan untuk login sebelum email diverifikasi. \- Setelah verifikasi, akun pemilik otomatis berstatus "Admin". |
|  | sehingga saya dapat segera menggunakan aplikasi. |  |  |  |
| **Manajemen Tim Internal** | Sebagai Admin, saya ingin bisa menambahkan karyawan saya sebagai "Kasir" | Sebagai Admin, ketika saya mengundang pengguna baru dengan peran "Kasir", maka pengguna tersebut akan menerima undangan dan setelah mendaftar, hanya bisa mengakses Modul Kasir (POS). | Highest | \- Admin memiliki menu "Pengaturan Pengguna". \- Terdapat tombol "Undang Pengguna" yang memicu pengiriman email undangan. \- Pengguna yang diundang dan mendaftar akan memiliki peran "Kasir". \- Saat login, pengguna dengan peran "Kasir" hanya melihat dan dapat mengakses menu/halaman POS. Semua menu lain (Laporan, Pengaturan, dll) tersembunyi atau tidak dapat diakses. |
|  | sehingga mereka dapat membantu operasional tanpa melihat data sensitif. |  |  |  |
| **Keamanan Akun** | Sebagai pengguna, saya ingin bisa mereset password saya jika saya lupa | Sebagai pengguna, ketika saya mengklik "Lupa Password?" dan memasukkan email saya, maka saya akan menerima link untuk membuat password baru. | Highest | \- Link "Lupa Password?" tersedia di halaman login. \- Sistem hanya akan mengirimkan email jika email tersebut terdaftar. \- Link reset password yang dikirim bersifat unik dan memiliki masa kedaluwarsa (misal: 1 jam). \- Pengguna berhasil mengubah password dan dapat login menggunakan password baru tersebut. |
|  | sehingga saya bisa mendapatkan kembali akses ke akun saya dengan aman. |  |  |  |

### **Modul Manajemen Modul & Langganan**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Manajemen Modul & Langganan (PWA SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 15 Oktober 2025 |
| **Stage** | Development |
| **Status** | In progress |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description**

Modul Manajemen Modul & Langganan adalah pusat kendali komersial bagi klien. Halaman ini berfungsi sebagai *self-service marketplace* internal di mana klien dapat dengan bebas menelusuri, mengaktifkan, dan menonaktifkan berbagai modul fungsional sesuai dengan kebutuhan bisnis mereka. Sistem secara otomatis menghitung dan menampilkan total biaya langganan bulanan secara transparan dan dinamis, mewujudkan model bisnis "Bayar Sesuai Pertumbuhan Anda" (*Pay-As-You-Grow*).

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Memberdayakan Klien dengan Fleksibilitas:** Memberikan kontrol penuh kepada klien untuk menyesuaikan fungsionalitas aplikasi dan anggaran mereka.  
* **Menciptakan Proses Billing yang Transparan:** Menghilangkan kebingungan terkait biaya dengan menampilkan kalkulasi *real-time* yang jelas.  
* **Meningkatkan *Average Revenue Per User* (ARPU):** Memudahkan proses *upselling* dengan cara membuat modul lanjutan mudah ditemukan dan diaktifkan.

**Success Metrics**

* **Module Adoption Rate:** Lebih dari 40% klien mengaktifkan setidaknya satu modul berbayar tambahan dalam 60 hari pertama penggunaan.  
* **Billing-Related Support Tickets:** Jumlah tiket bantuan terkait pertanyaan tagihan kurang dari 5% dari total tiket masuk.  
* **ARPU Growth:** Terjadi peningkatan ARPU sebesar rata-rata 5% per kuartal seiring klien mengaktifkan lebih banyak modul.

---

#### **3\. Features**

Fitur ini terpusat pada satu halaman pengaturan yang dapat diakses oleh Admin.

1. **Katalog Modul**  
   * Tampilan galeri (menggunakan kartu/card) untuk setiap modul yang tersedia.  
   * Setiap kartu modul wajib berisi:  
     * Nama Modul (Contoh: "Manajemen Koperasi").  
     * Deskripsi singkat mengenai fungsi dan manfaatnya.  
     * Harga per bulan.  
     * Label status visual: "Aktif" atau "Tidak Aktif".  
     * **Tombol saklar (toggle) Aktif/Nonaktif**.  
   * Pengelompokan modul ke dalam kategori: "Modul Dasar" dan "Modul Lanjutan/Spesialisasi".  
2. **Mekanisme Aktivasi & Deaktivasi**  
   * Saat Admin menekan tombol untuk **mengaktifkan** modul, sebuah *modal konfirmasi* akan muncul: *"Anda akan mengaktifkan Modul \[Nama Modul\] seharga \[Harga\]/bulan. Biaya akan ditambahkan pada tagihan Anda berikutnya. Lanjutkan?"*  
   * Saat **menonaktifkan**, *modal konfirmasi* juga muncul: *"Fitur dari Modul \[Nama Modul\] tidak akan dapat diakses lagi. Perubahan biaya akan berlaku pada periode tagihan berikutnya. Lanjutkan?"*  
   * Setelah konfirmasi, menu navigasi utama di aplikasi akan langsung diperbarui (menu modul baru muncul atau menu yang dinonaktifkan hilang).  
3. **Panel Billing Dinamis**  
   * Sebuah panel ringkasan yang selalu terlihat di halaman.  
   * Menampilkan rincian biaya:  
     * Paket Dasar (Sistem Inti): Rp \[Harga Dasar\]  
     * Daftar modul yang sedang aktif beserta biayanya.  
     * **Total Estimasi Tagihan Bulan Berikutnya:** Jumlah total yang dihitung secara *real-time*.  
   * Total biaya ini akan langsung berubah setiap kali Admin mengaktifkan atau menonaktifkan modul.

---

#### **4\. Use Case**

1. **Klien Toko Bangunan Baru Memilih Paket Awalnya**  
   * **Aktor:** Pemilik Toko Bangunan (Admin).  
   * **Skenario:** Setelah mendaftar, pemilik toko masuk ke halaman "Langganan". Dia melihat semua modul. Dia memutuskan butuh "Kasir (POS)" dan "Marketplace". Dia mengaktifkan tombol pada kedua modul tersebut.  
   * **Hasil:** Panel Billing Dinamis langsung menjumlahkan harga Paket Dasar \+ Modul POS \+ Modul Marketplace. Menu "Kasir" dan "Marketplace" langsung muncul di navigasi samping aplikasinya.  
2. **Koperasi Siap Digitalisasi Simpan Pinjam**  
   * **Aktor:** Admin Koperasi.  
   * **Skenario:** Setelah 3 bulan menggunakan modul dasar, koperasi siap untuk mengelola simpan pinjam secara digital. Admin membuka halaman "Langganan" dan mengaktifkan "Modul Manajemen Simpanan & Pinjaman".  
   * **Hasil:** Sistem mengkonfirmasi aktivasi dan penambahan biaya. Menu baru untuk "Simpanan" dan "Pinjaman" kini tersedia untuk digunakan oleh admin koperasi.  
3. **BUMDes Melakukan Efisiensi Anggaran**  
   * **Aktor:** Manajer BUMDes (Admin).  
   * **Skenario:** Manajer BUMDes merasa "Modul Marketplace" jarang digunakan dan ingin menghemat biaya. Dia masuk ke halaman "Langganan" dan menonaktifkan modul tersebut.  
   * **Hasil:** Panel Billing menampilkan estimasi tagihan bulan berikutnya yang lebih rendah. Menu "Marketplace" hilang dari navigasi, namun semua data terkait tetap tersimpan di server (tidak dihapus) jika suatu saat ingin diaktifkan kembali.

---

#### **5\. Dependencies**

* **Payment Gateway:** Integrasi penuh dengan penyedia layanan pembayaran pihak ketiga yang mendukung *recurring payment* (pembayaran berulang) untuk menagih klien setiap bulan secara otomatis.  
* **Arsitektur Modular:** Backend dan Frontend harus dirancang secara modular agar fitur (hak akses ke API dan komponen UI) dapat "dicabut-pasang" sesuai status langganan klien.  
* **Konfigurasi Terpusat:** Diperlukan sebuah sistem konfigurasi di backend untuk mengelola daftar modul, deskripsi, dan harganya.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Penemuan & Aktivasi Modul** | Sebagai Admin, saya ingin melihat katalog semua modul yang tersedia dan bisa mengaktifkannya dengan mudah | Sebagai Admin, ketika saya membuka halaman langganan dan mengaktifkan sebuah modul, maka modul tersebut akan berstatus aktif dan fiturnya bisa langsung saya gunakan. | Highest | \- Halaman menampilkan daftar semua modul beserta harga dan deskripsi. \- Tombol *toggle* berfungsi untuk mengubah status modul. \- Muncul *modal* konfirmasi sebelum aktivasi. \- Menu navigasi di aplikasi diperbarui secara dinamis setelah modul diaktifkan. |
|  | sehingga saya bisa menyesuaikan aplikasi sesuai kebutuhan bisnis saya. |  |  |  |
| **Transparansi Biaya Langganan** | Sebagai Admin, saya ingin melihat perubahan total biaya langganan secara langsung saat saya mengubah pilihan modul | Sebagai Admin, ketika saya mengaktifkan atau menonaktifkan modul, maka panel ringkasan billing akan langsung memperbarui total estimasi tagihan bulanan saya. | Highest | \- Terdapat panel ringkasan billing yang selalu terlihat. \- Total biaya berubah secara *real-time* sesuai dengan status *toggle* modul. \- Rincian biaya (paket dasar \+ setiap modul aktif) ditampilkan dengan jelas. |
|  | sehingga tidak ada kejutan pada saat tagihan datang. |  |  |  |
| **Deaktivasi Modul** | Sebagai Admin, saya ingin bisa menonaktifkan modul yang tidak lagi saya perlukan | Sebagai Admin, ketika saya menonaktifkan sebuah modul, maka fitur-fitur dari modul tersebut tidak lagi dapat diakses dan biaya langganan saya untuk periode berikutnya akan berkurang. | Highest | \- Tombol *toggle* berfungsi untuk menonaktifkan modul. \- Muncul *modal* konfirmasi sebelum deaktivasi. \- Menu navigasi terkait modul tersebut hilang dari aplikasi. \- Panel billing dinamis menunjukkan pengurangan biaya untuk tagihan selanjutnya. |
|  | agar saya bisa menghemat anggaran. |  |  |  |

### **Modul Inventaris**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Inventaris (PWA SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Oktober 2025 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Inventaris adalah sistem pusat untuk pengelolaan seluruh data produk dan stok. Modul ini memungkinkan klien (Koperasi, BUMDes, UMKM Toko Bangunan) untuk membuat, mengatur, melacak, dan mengelola katalog produk atau layanan yang mereka tawarkan. Fungsi utamanya mencakup pendefinisian detail produk, pemantauan jumlah stok secara *real-time*, dan penetapan harga beli (modal) serta harga jual. Modul ini menjadi sumber data utama yang akan dikonsumsi oleh Modul Kasir (POS) dan Modul Marketplace.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Menyediakan Katalog Produk yang Terpusat & Mudah Digunakan:** Memberikan satu sumber kebenaran (*single source of truth*) untuk semua data produk, mengurangi redundansi dan kesalahan input.  
* **Memastikan Pelacakan Stok yang Akurat:** Secara otomatis menyinkronkan level stok di semua channel penjualan (offline dan online) untuk mencegah *over-selling* atau *stockout*.  
* **Menyederhanakan Manajemen Harga & Profitabilitas:** Memudahkan pengguna untuk menetapkan harga dan melihat harga modal untuk membantu perhitungan laba kotor per produk.

**Success Metrics**

* **High Adoption & Data Richness:** \>90% klien aktif telah menambahkan minimal 10 produk dalam 30 hari pertama. \>70% produk yang ditambahkan memiliki data harga beli dan batas minimum stok.  
* **Stock Accuracy:** Tingkat akurasi sinkronisasi stok setelah penjualan (dari POS/Marketplace) mencapai 99.9%.  
* **User Efficacy:** Waktu rata-rata yang dibutuhkan pengguna untuk menambahkan produk baru kurang dari 60 detik.

---

#### **3\. Features**

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

#### **4\. Use Case**

1. **Admin Toko Bangunan Menambahkan Produk Semen**  
   * **Aktor:** Admin Toko Bangunan.  
   * **Skenario:** Toko baru saja menyetok produk "Semen Garuda". Admin membuka Modul Inventaris, klik "+ Tambah Produk". Ia mengisi nama, SKU, harga beli per sak, dan harga jual. Pada kolom Satuan ia mengisi "Sak". Ia juga mengatur batas minimum stok sebanyak 10 sak.  
   * **Hasil:** Produk semen berhasil ditambahkan dan siap dijual melalui POS. Jika stoknya nanti di bawah 10 sak, notifikasi akan muncul di Dashboard.  
2. **Pengurus Koperasi Melakukan Stok Opname Bulanan**  
   * **Aktor:** Pengurus Koperasi.  
   * **Skenario:** Di akhir bulan, pengurus menghitung sisa stok sabun cuci di unit usaha toko. Di sistem tercatat 50 pcs, namun fisik hanya 48 pcs. Ia masuk ke detail produk sabun, memilih fitur "Penyesuaian Stok", dan memasukkan angka 48\.  
   * **Hasil:** Sistem secara otomatis memperbarui jumlah stok menjadi 48 dan membuat catatan riwayat "Penyesuaian: \-2".

---

#### **5\. Dependencies**

* **Modul Dashboard:** Modul ini akan mengambil data dari Inventaris untuk notifikasi stok menipis.  
* **Modul Kasir (POS) & Marketplace:** Kedua modul ini sangat bergantung pada data harga jual dan akan mengirim perintah untuk mengurangi stok setelah terjadi penjualan.  
* **UI/UX Design:** Desain final untuk halaman daftar produk, formulir tambah/edit, dan alur stok opname.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pengelolaan Katalog Produk** | Sebagai pemilik bisnis, saya ingin bisa menambahkan dan mengedit detail produk saya dengan mudah | Sebagai pemilik bisnis, ketika saya mengisi formulir tambah produk dengan data yang lengkap, maka produk tersebut akan tersimpan dan muncul di daftar inventaris saya. | Highest | \- Pengguna dapat mengisi semua field di form tambah produk. \- Validasi input berjalan (misal: harga jual tidak boleh kosong). \- Produk yang baru ditambahkan langsung muncul di halaman Daftar Produk. \- Pengguna dapat mengklik produk di daftar untuk masuk ke mode edit. |
|  | sehingga saya bisa menjaga katalog saya tetap up-to-date. |  |  |  |
| **Sinkronisasi Stok Otomatis** | Sebagai pengguna, saya ingin stok produk berkurang secara otomatis setiap kali ada penjualan | Sebagai pengguna, ketika sebuah produk terjual melalui Kasir (POS) atau Marketplace, maka jumlah stok produk tersebut di sistem akan langsung berkurang sesuai jumlah yang terjual. | Highest | \- Penjualan 2 pcs produk X di POS akan mengurangi stok produk X sebanyak 2\. \- Penjualan 1 pcs produk Y di Marketplace akan mengurangi stok produk Y sebanyak 1\. \- Perubahan stok tercatat di Riwayat Stok produk tersebut. \- Jika stok 0, produk tidak bisa ditambahkan ke keranjang POS/Marketplace. |
|  | agar data inventaris saya selalu akurat dan terhindar dari penjualan barang yang sudah habis. |  |  |  |
| **Penyesuaian Stok Manual** | Sebagai pengguna, saya ingin bisa melakukan stok opname dan menyesuaikan jumlah stok di sistem | Sebagai pengguna, ketika saya menemukan perbedaan antara stok fisik dan stok di sistem, maka saya bisa memasukkan angka stok fisik yang benar untuk memperbarui data di sistem. | High | \- Terdapat fitur "Penyesuaian Stok" di halaman detail produk. \- Pengguna dapat memasukkan angka kuantitas fisik. \- Sistem menghitung selisih dan memperbarui kuantitas "Stok Saat Ini". \- Sebuah entri baru tercatat di "Riwayat Stok" dengan tipe "Penyesuaian". |
|  | agar data saya kembali akurat dengan kondisi nyata di lapangan. |  |  |  |

### **Modul Kasir (Point of Sale)**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Kasir (Point of Sale) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 30 November 2025 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description**

Modul Kasir (POS) adalah versi digital dari mesin kasir konvensional, yang dirancang untuk digunakan pada berbagai perangkat seperti tablet atau komputer di toko fisik. Modul ini menyediakan antarmuka yang cepat, intuitif, dan efisien bagi staf di garis depan (kasir) untuk melakukan dan mencatat transaksi penjualan. Setiap transaksi yang berhasil akan secara otomatis memperbarui jumlah stok di Modul Inventaris dan menyumbangkan data ke Modul Laporan, menciptakan ekosistem bisnis yang terintegrasi.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Mempercepat Proses Checkout:** Mengurangi waktu antrean dan meningkatkan kepuasan pelanggan dengan alur transaksi yang cepat.  
* **Meminimalkan Kesalahan Manusia:** Menghilangkan kesalahan perhitungan manual dan memastikan setiap transaksi tercatat dengan akurat.  
* **Menjamin Integritas Data Lintas Modul:** Memastikan setiap penjualan tercermin secara *real-time* pada data stok dan laporan keuangan.

**Success Metrics**

* **Transaction Speed:** Waktu rata-rata per transaksi (dari penambahan produk pertama hingga struk tercetak/terkirim) adalah di bawah 60 detik.  
* **Accuracy Rate:** Tingkat akurasi data penjualan yang masuk ke sistem adalah 100% tanpa memerlukan koreksi manual.  
* **User Adoption & Satisfaction:** Staf kasir dapat menggunakan sistem secara mandiri dengan pelatihan kurang dari 15 menit dan memberikan rating kemudahan penggunaan 4/5 atau lebih tinggi.

---

#### **3\. Features**

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

#### **4\. Use Case**

1. **Kasir Koperasi Melayani Anggota yang Berbelanja Rutin**  
   * **Aktor:** Kasir Koperasi.  
   * **Skenario:** Seorang anggota membeli beberapa kebutuhan pokok. Kasir dengan cepat mengetuk produk pada Grid Produk. Pelanggan membayar dengan uang tunai.  
   * **Hasil:** Kasir memasukkan jumlah uang yang diterima, sistem menampilkan jumlah kembalian, dan kasir menyelesaikan transaksi sambil memberikan struk cetak. Stok barang otomatis berkurang.  
2. **Kasir Toko Bangunan Melayani Pesanan Besar**  
   * **Aktor:** Kasir Toko Bangunan.  
   * **Skenario:** Seorang kontraktor membeli 50 sak semen, 10 batang besi, dan 5 kaleng cat. Kasir menggunakan fitur pencarian untuk menemukan item tersebut dengan cepat dan mengubah kuantitasnya di keranjang. Pembayaran dilakukan via transfer.  
   * **Hasil:** Kasir memilih metode pembayaran "Transfer" dan menandai lunas. Ia mencetak struk sebagai bukti bayar untuk kontraktor.

---

#### **5\. Dependencies**

* **Modul Inventaris:** **Ketergantungan Kritis.** Modul POS tidak dapat berfungsi tanpa akses ke daftar produk, harga, dan jumlah stok dari Modul Inventaris.  
* **Perangkat Keras (Hardware):** Desain harus mempertimbangkan kompatibilitas dengan perangkat keras umum seperti *barcode scanner* (via input USB/Bluetooth) dan *thermal printer* (via koneksi USB atau Bluetooth).  
* **Modul Laporan:** Semua data transaksi dari POS akan menjadi input utama untuk laporan penjualan dan laba/rugi.  
* **UI/UX Design:** Desain antarmuka harus sangat dioptimalkan untuk kecepatan, visibilitas yang baik di berbagai kondisi cahaya, dan interaksi sentuhan yang minimalis.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pembuatan Transaksi Penjualan** | Sebagai seorang kasir, saya ingin dapat dengan cepat menambahkan produk ke dalam keranjang pelanggan | Sebagai seorang kasir, ketika saya mencari atau memilih produk, maka produk tersebut akan ditambahkan ke keranjang dan total belanja akan diperbarui secara otomatis. | Highest | \- Produk dapat ditambahkan ke keranjang melalui pencarian atau klik pada grid produk. \- Kuantitas produk dalam keranjang dapat diubah. \- Item dapat dihapus dari keranjang. \- Subtotal dan Total Akhir terhitung dengan benar. |
|  | agar saya bisa melayani pelanggan tanpa membuat mereka menunggu lama. |  |  |  |
| **Proses Pembayaran** | Sebagai seorang kasir, saya ingin bisa menerima pembayaran tunai dan menghitung kembalian secara otomatis | Sebagai seorang kasir, ketika pelanggan membayar dengan uang tunai dan saya memasukkan jumlah uang yang diterima, maka sistem akan secara otomatis menghitung dan menampilkan jumlah uang kembali. | Highest | \- Tombol "Bayar" membuka *modal* pembayaran. \- Terdapat opsi pembayaran "Tunai". \- *Input field* untuk "Jumlah Uang Diterima" berfungsi. \- Angka "Uang Kembali" ditampilkan dengan benar. \- Transaksi berhasil tersimpan setelah pembayaran dikonfirmasi. |
|  | sehingga saya tidak membuat kesalahan dalam perhitungan uang kembalian. |  |  |  |
| **Penyelesaian Transaksi dan Struk** | Sebagai seorang kasir, saya ingin bisa memberikan bukti pembelian kepada pelanggan setelah transaksi selesai | Sebagai seorang kasir, ketika pembayaran telah berhasil, maka saya akan diberikan pilihan untuk mencetak struk atau mengirimnya secara digital. | High | \- Setelah pembayaran, layar konfirmasi muncul dengan opsi struk. \- Tombol "Cetak Struk" mengirimkan data ke printer. \- Tombol "Kirim via WhatsApp" membuka tab baru dengan link `wa.me` yang sudah terisi pesan struk. \- Penjualan tercatat dalam riwayat transaksi. |
|  | agar pelanggan memiliki bukti pembelian yang sah. |  |  |  |

### **Modul Marketplace (Toko Online)**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Marketplace (Toko Online) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 15 Desember 2025 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description**

Modul Marketplace menyediakan setiap klien (Koperasi, BUMDes, UMKM Toko Bangunan) sebuah etalase digital atau "toko online" pribadi yang dapat diakses publik melalui URL unik. Fitur ini memungkinkan klien untuk memperluas jangkauan pasar mereka di luar toko fisik, menampilkan produk mereka kepada audiens yang lebih luas, dan menerima pesanan secara online 24/7. Bagi pelanggan akhir, ini memberikan kemudahan untuk menelusuri produk dan melakukan pembelian dari mana saja.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Menciptakan Saluran Penjualan Baru:** Memberikan klien alat yang mudah digunakan untuk meningkatkan pendapatan melalui penjualan online.  
* **Memberikan Pengalaman Belanja yang Intuitif:** Merancang alur belanja yang sederhana dan cepat bagi pelanggan akhir untuk mendorong konversi.  
* **Menjamin Integrasi Data yang Sempurna:** Memastikan setiap pesanan online tercatat dengan benar, dan data stok selalu sinkron dengan Modul Inventaris.

**Success Metrics**

* **Module Adoption & Sales Impact:** \>50% klien mengaktifkan Modul Marketplace. Rata-rata, setiap marketplace yang aktif menghasilkan minimal 5 pesanan per bulan.  
* **Conversion Rate:** Tingkat konversi (jumlah pengunjung yang melakukan checkout dibagi total pengunjung) mencapai \>2%.  
* **Data Integrity:** 100% pesanan dari marketplace tercatat secara akurat di sistem back-office. 0 kasus *overselling* (menjual barang yang stoknya sudah habis).

---

#### **3\. Features**

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

#### **4\. Use Case**

1. **Pelanggan Umum Memesan Barang dari Marketplace Koperasi**  
   * **Aktor:** Pelanggan Umum.  
   * **Skenario:** Seorang pelanggan melihat promosi toko Koperasi di media sosial dan mengklik link marketplace yang tertera. Ia menelusuri produk, menambahkan beberapa item ke keranjang, dan menyelesaikan checkout untuk diantar ke rumahnya.  
   * **Hasil:** Pesanan masuk ke sistem Koperasi. Admin Koperasi menerima notifikasi dan menghubungi pelanggan untuk mengatur pengiriman.  
2. **Kontraktor Memastikan Ketersediaan Stok di Toko Bangunan**  
   * **Aktor:** Kontraktor (Calon Pelanggan).  
   * **Skenario:** Sebelum pergi ke toko bangunan, seorang kontraktor membuka halaman marketplace toko tersebut untuk memastikan stok cat merek tertentu tersedia.  
   * **Hasil:** Ia melihat produk tersedia, lalu langsung datang ke toko untuk membeli atau memesan via WhatsApp setelah melihat info kontak di halaman tersebut.

---

#### **5\. Dependencies**

* **Modul Inventaris:** **KETERGANTUNGAN KRITIS.** Marketplace sepenuhnya bergantung pada data produk, harga, deskripsi, gambar, dan jumlah stok dari modul ini.  
* **Modul Manajemen Pesanan Online:** Setiap pesanan yang dibuat melalui marketplace harus secara otomatis membuat entri baru di modul backend ini agar dapat diproses oleh pemilik bisnis.  
* **UI/UX Design:** Desain harus *mobile-first*, bersih, cepat dimuat, dan membangun kepercayaan pelanggan untuk mendorong transaksi.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Penemuan Produk oleh Pelanggan** | Sebagai seorang pelanggan, saya ingin dapat dengan mudah menelusuri dan mencari produk di toko online | Sebagai seorang pelanggan, ketika saya membuka halaman marketplace, maka saya akan melihat katalog produk yang bisa saya cari dan filter. | Highest | \- Halaman utama marketplace menampilkan produk dalam bentuk galeri. \- Terdapat bar pencarian yang berfungsi. \- Setiap produk dapat diklik untuk melihat halaman detailnya. \- Produk dengan stok 0 menampilkan label "Stok Habis" dan tidak bisa ditambahkan ke keranjang. |
|  | agar saya bisa menemukan barang yang saya inginkan dengan cepat. |  |  |  |
| **Proses Checkout Sederhana** | Sebagai seorang pelanggan, saya ingin proses checkout yang cepat dan tidak rumit | Sebagai seorang pelanggan, ketika saya siap membayar, maka saya akan mengisi satu formulir singkat untuk menyelesaikan pesanan saya. | Highest | \- Tombol "Tambah ke Keranjang" berfungsi dari halaman detail produk.\- Halaman checkout adalah satu halaman tunggal.\- Formulir hanya meminta informasi esensial (Nama , Kontak , Alamat ).\- Tombol "Buat Pesanan" berhasil mengirim data dan mengarahkan ke halaman konfirmasi. |
|  | agar saya tidak membatalkan pembelian saya. |  |  |  |
| **Notifikasi Pesanan untuk Penjual** | Sebagai pemilik bisnis, saya ingin langsung tahu jika ada pesanan baru masuk dari marketplace saya | Sebagai pemilik bisnis, ketika seorang pelanggan membuat pesanan di marketplace saya, maka sebuah pesanan baru akan muncul di dashboard manajemen pesanan saya. | Highest | \- Pesanan yang berhasil dibuat pelanggan akan menghasilkan entri baru di "Manajemen Pesanan Online" dengan status "Baru". \- Data pesanan (info pelanggan, produk yang dipesan, kuantitas) tercatat dengan akurat. \- Jumlah stok untuk produk yang dipesan akan otomatis berkurang (atau dialokasikan) dari Modul Inventaris. |
|  | agar saya dapat segera memprosesnya. |  |  |  |

### **Modul Manajemen Aset & Jadwal Sewa**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Manajemen Aset & Jadwal Sewa |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 30 Juni 2026 |
| **Stage** | Scoping |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description**

Modul Manajemen Aset & Jadwal Sewa adalah sebuah alat bantu komprehensif yang dirancang untuk klien, terutama BUMDes, dalam mengelola aset fisik yang dapat disewakan. Modul ini memungkinkan pengguna untuk mendaftarkan aset (seperti gedung, kendaraan, atau peralatan), mengatur jadwal ketersediaan melalui kalender visual, mengelola proses pemesanan (booking), dan mencatat pendapatan dari aktivitas penyewaan. Fitur ini bertujuan untuk mendigitalkan dan merapikan proses penyewaan, memaksimalkan utilisasi aset, dan menciptakan aliran pendapatan yang transparan.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Mendigitalkan Proses Penyewaan:** Menghilangkan pencatatan manual berbasis buku untuk mengurangi risiko kesalahan seperti jadwal ganda (*double-booking*).  
* **Menciptakan Aliran Pendapatan Baru yang Terkelola:** Memberikan alat yang mudah untuk mengelola bisnis penyewaan dan mencatat pendapatannya secara akurat.  
* **Memberikan Visibilitas Penuh atas Aset:** Memudahkan pengelola untuk melihat aset mana yang sedang disewa, kapan tersedia, dan seberapa sering aset tersebut digunakan.

**Success Metrics**

* **Feature Adoption:** \>70% klien BUMDes yang memiliki unit usaha penyewaan mengaktifkan dan menggunakan modul ini secara aktif.  
* **Reduction in Manual Work:** Pengguna melaporkan penurunan waktu administrasi untuk mengelola penyewaan lebih dari 50% dibandingkan metode manual.  
* **Data-Driven Insights:** Klien dapat menggunakan data dari modul ini untuk menentukan aset mana yang paling menguntungkan dan mana yang kurang diminati.

---

#### **3\. Features**

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

#### **4\. Use Case**

1. **Admin BUMDes Menyewakan Gedung Serbaguna**  
   * **Aktor:** Admin BUMDes.  
   * **Skenario:** Seorang warga desa datang untuk menyewa gedung serbaguna untuk acara pernikahan. Admin membuka Kalender Penjadwalan, melihat tanggal yang diinginkan masih kosong, lalu mengklik tanggal tersebut untuk membuat jadwal sewa baru. Ia memasukkan data warga sebagai penyewa dan detail acara.  
   * **Hasil:** Jadwal sewa tersimpan, slot waktu di kalender terisi, dan admin dapat langsung mencetak tagihan uang sewa untuk diberikan kepada warga tersebut.  
2. **Manajer BUMDes Memeriksa Utilisasi Aset**  
   * **Aktor:** Manajer BUMDes.  
   * **Skenario:** Di akhir bulan, manajer ingin tahu seberapa sering traktor milik BUMDes disewa oleh petani. Ia membuka halaman daftar pemesanan dan memfilter berdasarkan aset "Traktor Tangan".  
   * **Hasil:** Manajer dapat melihat daftar semua penyewaan traktor selama sebulan, lengkap dengan total pendapatan yang dihasilkan, untuk bahan evaluasi efektivitas aset.

---

#### **5\. Dependencies**

* **Modul Manajemen Kontak:** Diperlukan untuk memilih siapa yang menyewa aset.  
* **Modul Laporan:** Pendapatan dari sewa harus terintegrasi ke dalam Laporan Laba/Rugi dan Laporan Arus Kas.  
* **Modul Manajemen Unit Usaha:** Setiap aset harus dapat dialokasikan ke unit usaha tertentu (misal: "Unit Usaha Jasa & Penyewaan").  
* **UI/UX Design:** Desain kalender yang intuitif dan mudah digunakan pada perangkat mobile maupun desktop adalah kunci keberhasilan adopsi fitur ini.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pengelolaan Katalog Aset Sewa** | Sebagai Manajer BUMDes, saya ingin bisa mendaftarkan semua aset yang bisa disewakan beserta tarifnya | Sebagai Manajer BUMDes, ketika saya membuka modul aset, maka saya bisa menambahkan aset baru seperti "Gedung Serbaguna" dengan tarif sewa per hari. | Highest | \- Terdapat menu "Manajemen Aset Sewa". \- Pengguna dapat membuat aset baru dengan mengisi nama, deskripsi, dan tarif sewa. \- Aset yang dibuat akan muncul di daftar aset dan dapat dipilih saat membuat jadwal sewa. |
|  | agar saya memiliki daftar inventaris aset yang jelas. |  |  |  |
| **Penjadwalan Sewa Visual** | Sebagai Admin, saya ingin melihat semua jadwal sewa dalam bentuk kalender | Sebagai Admin, ketika saya membuka Kalender Penjadwalan, maka saya akan melihat blok-blok waktu yang sudah dipesan beserta nama penyewanya. | Highest | \- Halaman kalender menampilkan jadwal sewa yang sudah dibuat dengan benar. \- Tidak mungkin membuat jadwal baru yang tumpang tindih dengan jadwal yang sudah ada untuk aset yang sama. \- Kalender dapat menampilkan view bulanan dan mingguan. |
|  | agar saya dapat dengan cepat mengetahui ketersediaan aset dan menghindari jadwal ganda. |  |  |  |
| **Proses Pembuatan Jadwal Sewa** | Sebagai Admin, saya ingin bisa dengan mudah membuat jadwal sewa baru untuk pelanggan | Sebagai Admin, ketika saya membuat jadwal sewa baru, maka saya bisa memilih aset, pelanggan, tanggal, dan sistem akan menghitung biayanya secara otomatis. | High | \- Formulir pembuatan jadwal sewa berfungsi dengan baik. \- Total biaya sewa terhitung otomatis berdasarkan tarif aset dan durasi sewa. \- Jadwal yang baru dibuat langsung muncul di Kalender Penjadwalan. \- Pendapatan dari sewa ini tercatat di laporan keuangan setelah pembayaran dikonfirmasi. |
|  | agar proses pemesanan tercatat dengan rapi dan akurat. |  |  |  |

### **Modul Laporan**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Laporan (PWA SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Januari 2026 |
| **Stage** | Development |
| **Status** | To Do |
| **Teams** | Designer , Developer (\[BE\], \[FE\]) , QA Tester |

---

#### **1\. Description**

Modul Laporan adalah pusat intelijen bisnis dari PWA. Modul ini berfungsi untuk mengagregasi, mengolah, dan menyajikan semua data transaksional dari modul lain (Kasir, Marketplace, Inventaris, Keuangan) ke dalam format laporan yang terstruktur dan mudah dipahami. Tujuannya adalah untuk memberikan para pemilik bisnis wawasan mendalam mengenai kinerja penjualan, profitabilitas, dan kesehatan keuangan usaha mereka, sehingga dapat mendukung pengambilan keputusan strategis yang berbasis data.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Menyediakan Gambaran Finansial yang Jelas:** Menyajikan laporan keuangan kunci (Laba/Rugi, Arus Kas, Neraca Sederhana) yang akurat dan mudah dimengerti.  
* **Memfasilitasi Analisis Kinerja:** Memungkinkan pengguna untuk menganalisis tren, mengidentifikasi produk terlaris, dan memahami struktur biaya mereka.  
* **Meningkatkan Literasi Finansial Pengguna:** Menjadi alat bantu bagi pemilik bisnis untuk lebih memahami kesehatan dan potensi usaha mereka.

**Success Metrics**

* **Data Accuracy:** Tingkat akurasi data pada laporan adalah 99.9% jika dibandingkan dengan kalkulasi manual dari data transaksi sumber.  
* **Feature Usage:** Lebih dari 70% klien aktif membuka Modul Laporan setidaknya sekali seminggu. Fitur filter periode tanggal digunakan pada mayoritas sesi.  
* **User Confidence:** Berdasarkan survei, \>80% pengguna merasa lebih percaya diri dalam mengambil keputusan bisnis setelah menggunakan laporan di PWA ini.

---

#### **3\. Features**

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

#### **4\. Use Case**

1. **Pemilik Toko Bangunan Mengevaluasi Kinerja Bulanan**  
   * **Aktor:** Pemilik Toko Bangunan.  
   * **Skenario:** Di awal bulan, pemilik membuka Modul Laporan, memilih periode "Bulan Lalu", dan membuka Laporan Laba/Rugi.  
   * **Hasil:** Ia melihat laba bersih yang dihasilkan. Kemudian ia membuka Laporan Penjualan Rinci untuk melihat produk semen mana yang paling laku, dan memutuskan untuk menambah stok produk tersebut.  
2. **Bendahara Koperasi Menyiapkan Laporan untuk Rapat Anggota**  
   * **Aktor:** Bendahara Koperasi.  
   * **Skenario:** Menjelang Rapat Anggota Tahunan, bendahara menggunakan PWA untuk menghasilkan Laporan Laba/Rugi, Arus Kas, dan Neraca Sederhana untuk periode satu tahun.  
   * **Hasil:** Ia mengekspor semua laporan ke dalam format Excel untuk kemudian digabungkan ke dalam materi presentasi rapat, menghemat waktu rekapitulasi manual.

---

#### **5\. Dependencies**

* **Ketergantungan Data Kritis:** Modul ini sepenuhnya bergantung pada data yang akurat dan lengkap dari Modul **Inventaris** (untuk HPP), **Kasir (POS)**, **Marketplace** (untuk Pendapatan), dan **Pencatatan Keuangan** (untuk Beban dan Modal).  
* **Logika Backend:** Membutuhkan logika kalkulasi dan agregasi data yang kompleks dan teruji di sisi backend untuk memastikan semua angka akurat.  
* **UI/UX Design:** Desainer harus mampu menyajikan data finansial yang padat menjadi visualisasi (grafik, tabel) yang bersih, menarik, dan mudah dimengerti.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pelaporan Profitabilitas** | Sebagai pemilik bisnis, saya ingin bisa melihat Laporan Laba/Rugi untuk periode waktu tertentu | Sebagai pemilik bisnis, ketika saya memilih periode waktu dan membuka Laporan Laba/Rugi, maka saya akan melihat rincian pendapatan, HPP, dan beban untuk mengetahui laba bersih saya. | Highest | \- Laporan menampilkan semua komponen L/R dengan benar. \- Data dapat difilter berdasarkan rentang tanggal. \- Angka Pendapatan cocok dengan total penjualan di Laporan Penjualan. \- Angka Beban cocok dengan total di pencatatan pengeluaran. \- Kalkulasi Laba Kotor dan Laba Bersih akurat. |
|  | agar saya tahu apakah bisnis saya untung atau rugi. |  |  |  |
| **Analisis Penjualan** | Sebagai manajer, saya ingin tahu produk mana yang paling laku terjual | Sebagai manajer, ketika saya membuka Laporan Penjualan Rinci, maka saya akan melihat daftar produk yang diurutkan berdasarkan penjualan tertinggi. | High | \- Laporan Penjualan memiliki bagian "Produk Terlaris". \- Pengurutan dapat dilakukan berdasarkan "Jumlah Terjual" atau "Total Pendapatan". \- Data penjualan dapat diekspor ke format CSV/Excel. \- Data cocok dengan catatan transaksi individual. |
|  | sehingga saya bisa membuat strategi promosi dan pembelian stok yang lebih baik. |  |  |  |
| **Pemahaman Posisi Keuangan** | Sebagai pemilik bisnis, saya ingin melihat ringkasan aset dan modal yang saya miliki dalam bisnis | Sebagai pemilik bisnis, ketika saya membuka laporan Neraca Sederhana, maka saya akan melihat nilai total dari kas dan persediaan barang saya, serta total modal saya. | High | \- Laporan Neraca Sederhana menampilkan komponen Aset (Kas, Persediaan) dan Ekuitas (Modal, Laba Ditahan). \- Nilai Persediaan dihitung berdasarkan Harga Beli (modal) dari produk yang tersisa. \- Persamaan `Aset = Liabilitas + Ekuitas` harus seimbang. \- Angka Laba Ditahan cocok dengan akumulasi Laba Bersih dari Laporan L/R. |
|  | agar saya dapat mengukur kesehatan keuangan bisnis saya secara keseluruhan. |  |  |  |

### **Modul Landing Page (Adaptif)**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Landing Page (Adaptif untuk Klien SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 15 Juli 2025 |
| **Stage** | Scoping & Design |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Landing Page adalah fitur yang menyediakan halaman depan (*storefront*) publik yang profesional dan menarik untuk setiap klien PWA. Halaman ini bersifat adaptif, artinya konten, penawaran, dan *call-to-action* (CTA) akan secara otomatis menyesuaikan dengan jenis bisnis klien (Koperasi, UMKM Toko Bangunan, atau BUMDes). Tujuannya adalah untuk memperkenalkan bisnis klien kepada audiens yang relevan, membangun kepercayaan, dan menjadi gerbang utama untuk akuisisi pelanggan atau anggota baru.

---

#### **2\. Objectives & Success Metrics**

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

#### **3\. Features (Adaptif per Jenis Klien)**

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

#### **4\. Use Case**

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

#### **5\. Dependencies**

* Konten profil, layanan, dan foto dari setiap klien.  
* Akses ke email atau sistem CRM klien untuk integrasi formulir.  
* Desain UI/UX yang memiliki komponen "slot" yang dapat diisi konten dinamis sesuai jenis klien.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Akuisisi Klien/Anggota Baru** | Sebagai calon klien/anggota, saya ingin bisa mendaftar atau menghubungi bisnis dengan mudah melalui landing page | Sebagai calon klien/anggota, ketika saya mengisi formulir kontak/pendaftaran di landing page, maka data saya akan terkirim ke pemilik bisnis dan saya akan menerima konfirmasi. | Highest | \- Landing page menampilkan formulir yang sesuai dengan jenis bisnis (Pendaftaran/Penawaran/Kontak).\- Validasi input pada formulir berfungsi dengan baik.\- Setelah submit, sistem mengirimkan notifikasi ke email admin klien. \- Pengunjung melihat halaman "Terima Kasih" atau pesan konfirmasi. |
|  | sehingga saya bisa dengan cepat terhubung dengan bisnis tersebut. |  |  |  |
| **Tampilan Informasi Adaptif** | Sebagai pemilik bisnis, saya ingin landing page saya secara otomatis menampilkan informasi yang relevan dengan jenis bisnis saya | Sebagai pemilik bisnis, ketika saya memilih jenis bisnis (misal: "Toko Bangunan") saat setup awal, maka landing page saya akan otomatis menggunakan template headline, layanan, dan CTA yang sesuai untuk toko bangunan. | Highest | \- Sistem memiliki template konten yang berbeda untuk Koperasi, UMKM Toko Bangunan, dan BUMDes. \- Pemilihan jenis bisnis saat onboarding akan menentukan template mana yang digunakan. \- Semua bagian (Hero, Layanan, CTA) berubah sesuai template yang dipilih. |
|  | agar halaman saya terlihat profesional dan tepat sasaran tanpa perlu mengedit manual secara ekstensif. |  |  |  |

### **Modul Pengaturan**

|  |  |
| :---- | :---- |
| **Product Name** | Modul Pengaturan (PWA SaaS) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 15 Oktober 2025 (Estimasi Awal) |
| **Stage** | Development |
| **Status** | In progress |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Pengaturan adalah pusat kontrol terpusat yang hanya dapat diakses oleh pengguna dengan peran "Admin". Modul ini memungkinkan admin untuk mengkonfigurasi, menyesuaikan, dan mengelola semua aspek fungsional dan operasional aplikasi, mulai dari informasi dasar bisnis, manajemen pengguna, hingga aturan-aturan spesifik untuk setiap modul yang diaktifkan. Pengaturan akan diorganisir ke dalam sub-menu yang logis untuk memastikan kemudahan navigasi dan penggunaan.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* Menyediakan satu lokasi terpusat untuk semua konfigurasi aplikasi.  
* Memberdayakan admin untuk menyesuaikan PWA agar sesuai dengan proses bisnis unik mereka.  
* Menyajikan antarmuka pengaturan yang terstruktur, intuitif, dan mudah dinavigasi.

**Success Metrics**

* Rendahnya jumlah tiket bantuan yang menanyakan lokasi sebuah pengaturan.  
* Tingginya tingkat penggunaan fitur-fitur konfigurasi oleh klien.  
* Pengguna dapat menemukan dan mengubah pengaturan spesifik dalam waktu singkat.

---

#### **3\. Features**

Antarmuka Pengaturan akan dibagi menjadi beberapa bagian utama:

#### **3.1. Pengaturan Umum**

1. **Profil Bisnis:**  
   * Mengedit informasi dasar bisnis seperti Logo, Nama Bisnis, Alamat, dan Kontak (Email, Nomor Telepon).  
2. **Pengguna & Hak Akses:**  
   * Mengundang pengguna baru melalui email.  
   * Mengelola pengguna yang ada dan menetapkan peran (misal: Admin, Kasir).  
3. **Langganan & Modul:**  
   * Link menuju "Modul Manajemen Modul & Langganan" untuk mengaktifkan/menonaktifkan fitur dan melihat tagihan.

#### **3.2. Pengaturan Penjualan**

1. **Kasir (POS):**  
   * **Struk:** Kustomisasi teks di bagian header dan footer struk.  
   * **Pajak:** Mengaktifkan/menonaktifkan perhitungan pajak dan mengatur persentasenya.  
2. **Harga Bertingkat:**  
   * Membuat, mengedit, dan menghapus tingkatan harga (misal: "Harga Grosir", "Harga Kontraktor").

#### **3.3. Pengaturan Inventaris**

1. **Kategori Produk:** Membuat, mengedit, dan menghapus kategori untuk pengorganisasian produk.  
2. **Satuan Produk:** Membuat daftar satuan yang sering digunakan (misal: Pcs, Kg, Sak) untuk mempercepat input produk.

#### **3.4. Pengaturan Koperasi (Hanya tampil jika jenis bisnis adalah "Koperasi")**

1. **Simpanan:**  
   * Menetapkan nominal  
      **Simpanan Pokok** yang wajib dibayar sekali.  
   * Menetapkan nominal  
      **Simpanan Wajib** yang harus dibayar berkala.  
   * **Untuk Syariah:** Menetapkan **Nisbah Bagi Hasil** untuk Simpanan Sukarela (Mudharabah).  
2. **Pinjaman & Pembiayaan:**  
   * Menetapkan  
      **Suku Bunga** default untuk pinjaman konvensional.  
   * Mengkonfigurasi parameter untuk  
      **Penilaian Risiko Otomatis**.  
3. **Sisa Hasil Usaha (SHU):**  
   * Menetapkan persentase alokasi SHU sesuai AD/ART (misal: Dana Cadangan, Jasa Modal, Jasa Usaha).

#### **3.5. Pengaturan BUMDes (Hanya tampil jika jenis bisnis adalah "BUMDes")**

1. **Unit Usaha:**  
   * Membuat, mengedit, dan mengelola unit-unit usaha yang dimiliki.  
2. **Aset Sewa:**  
   * Mengelola kategori aset dan pengaturan default untuk Modul Manajemen Aset.

---

#### **4\. Use Case**

1. **Admin Koperasi Menetapkan Aturan SHU**  
   * **Aktor:** Admin Koperasi.  
   * **Skenario:** Setelah Rapat Anggota Tahunan (RAT), Admin membuka `Pengaturan > Pengaturan Koperasi > SHU`, lalu memasukkan persentase pembagian SHU yang baru disepakati untuk tahun buku mendatang.  
   * **Hasil:** Sistem menyimpan aturan alokasi baru yang akan digunakan oleh Modul SHU pada saat perhitungan di akhir tahun.  
2. **Admin Toko Bangunan Menambah Peran Pengguna Baru**  
   * **Aktor:** Admin Toko Bangunan.  
   * **Skenario:** Merekrut kasir baru, Admin masuk ke `Pengaturan > Pengaturan Umum > Pengguna & Hak Akses`, lalu mengundang email kasir baru tersebut dengan peran "Kasir".  
   * **Hasil:** Kasir baru menerima undangan, dan setelah mendaftar, akunnya hanya memiliki akses ke Modul Kasir (POS).

---

#### **5\. Dependencies**

* **Manajemen Akun:** Hanya pengguna dengan peran "Admin" yang dapat mengakses Modul Pengaturan.  
* **Semua Modul Lainnya:** Modul Pengaturan berisi konfigurasi untuk hampir semua modul lain. Perubahan di sini akan secara langsung memengaruhi cara kerja modul-modul tersebut.  
* **UI/UX Design:** Membutuhkan desain tata letak yang sangat terstruktur (misalnya menggunakan navigasi vertikal di samping) agar pengguna tidak bingung dengan banyaknya pilihan.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |  |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Konfigurasi Bisnis & Tim** | Sebagai Admin, saya ingin bisa mengatur informasi dasar bisnis saya dan mengelola akses tim saya | Sebagai Admin, ketika saya membuka halaman Pengaturan, maka saya bisa mengubah logo bisnis saya dan mengundang pengguna baru sebagai "Kasir". | Highest | \- Admin dapat mengubah Nama Bisnis, Alamat, dan Logo. \- Admin dapat mengundang pengguna baru via email dan menetapkan peran "Kasir". \- Pengguna dengan peran "Kasir" hanya bisa mengakses fitur yang diizinkan (misal: POS). |  |
| **Konfigurasi Aturan Operasional** | Sebagai Admin Toko Bangunan, saya ingin bisa membuat beberapa tingkatan harga jual untuk pelanggan yang berbeda | Sebagai Admin, ketika saya masuk ke Pengaturan Penjualan, maka saya bisa membuat tingkatan harga baru bernama "Grosir". | High | \- Terdapat sub-menu "Harga Bertingkat" di dalam Pengaturan Penjualan. \- Admin dapat menambahkan tingkatan harga baru. \- Tingkatan harga yang baru dibuat ini akan tersedia sebagai pilihan di Modul Inventaris dan Kontak. |  |
| **Konfigurasi Spesifik Koperasi** | Sebagai Admin Koperasi, saya ingin bisa menetapkan jumlah Simpanan Wajib dan Pokok sesuai AD/ART | Sebagai Admin, ketika saya membuka Pengaturan Koperasi, maka saya dapat memasukkan nominal untuk Simpanan Pokok dan Simpanan Wajib. | Highest | \- Terdapat halaman "Pengaturan Koperasi" yang hanya bisa diakses oleh klien tipe Koperasi. \- Terdapat | *input field* untuk mengatur nominal Simpanan Pokok dan Simpanan Wajib. \- Nilai yang disimpan di sini akan digunakan di seluruh aplikasi (misal: saat pendaftaran anggota baru). |

### **Modul FAQ (Pusat Bantuan)**

|  |  |
| :---- | :---- |
| **Product Name** | Modul FAQ (Pusat Bantuan) |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Maret 2026 (Estimasi) |
| **Stage** | Scoping |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester, **Content Writer** |

---

#### **1\. Description**

Modul FAQ (Pusat Bantuan) adalah sebuah halaman informasional terpusat yang dapat diakses oleh semua pengguna PWA. Modul ini berfungsi sebagai pusat bantuan mandiri (*self-service*) yang berisi daftar pertanyaan yang sering diajukan beserta jawabannya yang jelas dan terstruktur. Tujuannya adalah untuk memberdayakan pengguna agar dapat menyelesaikan masalah dan menjawab pertanyaan mereka sendiri secara cepat, sekaligus mengurangi volume pertanyaan yang masuk ke tim layanan pelanggan (customer support).

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Mengurangi Volume Tiket Bantuan:** Menurunkan jumlah pertanyaan repetitif dan "cara penggunaan" yang diterima oleh tim customer support.  
* **Meningkatkan Kepuasan & Kemandirian Pengguna:** Memberikan pengguna alat untuk menemukan solusi secara instan tanpa harus menunggu balasan dari tim support.  
* **Menyediakan Sumber Dokumentasi yang Terstruktur:** Menciptakan satu sumber kebenaran untuk semua panduan penggunaan aplikasi yang mudah dikelola dan diperbarui.

**Success Metrics**

* Penurunan jumlah tiket bantuan terkait "cara penggunaan" sebesar \>20% dalam 3 bulan setelah peluncuran.  
* Tingkat kepuasan "Jawaban Membantu" pada artikel FAQ mencapai \>75%.  
* Waktu yang dibutuhkan tim internal untuk mempublikasikan atau memperbarui artikel FAQ kurang dari 5 menit.

---

#### **3\. Features**

#### **3.1. Sisi Pengguna: Halaman FAQ (User-Facing)**

1. **Pencarian Cepat (Live Search):**  
   * Sebuah bar pencarian yang prominently diletakkan di bagian atas halaman.  
   * Hasil pencarian akan langsung muncul dan terfilter saat pengguna mengetik, mencari kata kunci pada judul pertanyaan dan isi jawaban.  
2. **Struktur Kategori:**  
   * Pertanyaan dikelompokkan ke dalam kategori yang logis untuk memudahkan navigasi. Contoh Kategori:  
     * Memulai (Pendaftaran & Login)  
     * Akun & Langganan  
     * Manajemen Inventaris  
     * Kasir (POS)  
     * Laporan & Analitik  
     * Pengaturan Koperasi  
3. **Tampilan Pertanyaan (Accordion):**  
   * Setiap kategori akan berisi daftar pertanyaan.  
   * Saat pertanyaan diklik, area di bawahnya akan mengembang (*expand*) untuk menampilkan jawaban. Ini menjaga antarmuka tetap rapi dan tidak membanjiri pengguna dengan teks.  
   * Jawaban dapat berisi teks, gambar (screenshot), atau GIF.  
4. **Mekanisme Umpan Balik Sederhana:**  
   * Di akhir setiap jawaban, terdapat pertanyaan "Apakah artikel ini membantu?" dengan tombol **"Ya"** dan **"Tidak"**.

#### **3.2. Sisi Admin: Sistem Manajemen Konten (CMS) FAQ**

1. **Manajemen Artikel FAQ:**  
   * Antarmuka khusus bagi admin atau tim konten untuk melakukan *CRUD (Create, Read, Update, Delete)* pada artikel FAQ.  
   * Menggunakan *Rich Text Editor* untuk memformat jawaban (bold, italic, list, memasukkan gambar).  
2. **Manajemen Kategori:**  
   * Admin dapat membuat, mengubah nama, dan menghapus kategori FAQ.  
3. **Dasbor Analitik FAQ:**  
   * Menampilkan data sederhana untuk setiap artikel:  
     * Jumlah total berapa kali artikel dilihat.  
     * Hasil umpan balik (jumlah klik "Ya" vs "Tidak").  
   * Membantu tim untuk mengidentifikasi artikel mana yang paling dibutuhkan dan mana yang perlu diperbaiki.

---

#### **4\. Use Case**

1. **Kasir Baru Lupa Cara Cetak Struk**  
   * **Aktor:** Kasir.  
   * **Skenario:** Seorang kasir baru lupa langkah-langkah untuk mencetak ulang struk transaksi yang sudah lewat. Ia membuka menu "Bantuan/FAQ", mengetik "cetak struk" di pencarian.  
   * **Hasil:** Artikel yang relevan muncul, menunjukkan langkah-langkah dengan gambar. Kasir dapat menyelesaikan tugasnya tanpa perlu menelepon manajernya.  
2. **Pemilik BUMDes Ingin Mengaktifkan Modul Baru**  
   * **Aktor:** Admin BUMDes.  
   * **Skenario:** Pemilik ingin mencoba Modul Aset & Sewa. Ia tidak yakin bagaimana caranya. Ia membuka FAQ, masuk ke kategori "Akun & Langganan", dan menemukan pertanyaan "Bagaimana cara mengaktifkan modul baru?".  
   * **Hasil:** Artikel menjelaskan langkah-langkah untuk masuk ke halaman langganan dan mengaktifkan modul.

---

#### **5\. Dependencies**

* **Konten:** Keberhasilan modul ini sangat bergantung pada ketersediaan konten yang berkualitas, jelas, dan relevan. Membutuhkan alokasi waktu dari tim produk atau *content writer*.  
* **UI/UX Design:** Desain antarmuka yang bersih, intuitif, dan sangat fungsional untuk pencarian adalah krusial.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Pencarian Jawaban Mandiri** | Sebagai pengguna, ketika saya memiliki pertanyaan, saya ingin dapat mencari dan menemukan jawabannya sendiri di dalam aplikasi | Sebagai pengguna, ketika saya mengakses halaman FAQ, maka saya dapat mencari pertanyaan saya menggunakan kata kunci atau menelusuri berdasarkan kategori. | Highest | \- Terdapat halaman "FAQ" atau "Pusat Bantuan". \- Halaman memiliki bar pencarian yang fungsional. \- Pertanyaan dikelompokkan dalam kategori yang logis. \- Mengklik pertanyaan akan menampilkan jawabannya dalam format akordion. |
|  | agar saya dapat menyelesaikan masalah saya dengan cepat. |  |  |  |
| **Manajemen Konten FAQ** | Sebagai tim support, saya ingin bisa dengan mudah menambah dan mengubah artikel bantuan | Sebagai tim support, ketika saya membuka CMS FAQ, maka saya bisa membuat artikel baru, menulis jawabannya, dan mengaturnya ke dalam sebuah kategori. | Highest | \- Terdapat halaman admin untuk manajemen FAQ. \- Terdapat formulir untuk membuat/mengedit artikel dengan *rich text editor*. \- Admin dapat membuat, mengedit, dan menghapus kategori. \- Perubahan yang disimpan akan langsung tampil di halaman FAQ untuk pengguna. |
| **Peningkatan Kualitas Bantuan** | Sebagai manajer produk, saya ingin tahu artikel bantuan mana yang paling efektif dan mana yang tidak | Sebagai manajer produk, ketika saya membuka dasbor analitik FAQ, maka saya bisa melihat jumlah view dan skor "membantu" untuk setiap artikel. | High | \- Setiap jawaban memiliki tombol umpan balik "Ya/Tidak". \- Klik pada tombol tersebut akan disimpan di database. \- Terdapat halaman admin yang menampilkan statistik per artikel (jumlah view, jumlah "Ya", jumlah "Tidak"). |
|  | agar saya bisa terus meningkatkan kualitas dokumentasi. |  |  |  |

