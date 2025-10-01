### **Modul Simpanan (Konvensional & Syariah)**

|  |  |
| :---- | :---- |
| **Product Name** | PWA KSU \- Modul Simpanan |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Juli 2026 (Estimasi) |
| **Stage** | Development |
| **Status** | In progress |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Simpanan adalah fitur inti dalam aplikasi Koperasi Serba Usaha (KSU) yang bertujuan untuk memberikan anggota akses yang mudah dan transparan terhadap informasi simpanan mereka. Modul ini dirancang untuk mendukung dua model operasional utama: Konvensional dan Syariah, yang dapat dipilih oleh koperasi saat konfigurasi awal.

* **Varian Konvensional:**  
  * **Simpanan Pokok:** Simpanan yang menjadi syarat keanggotaan.  
  * **Simpanan Wajib:** Simpanan yang harus disetorkan secara berkala.  
  * **Simpanan Sukarela:** Simpanan yang dapat disetorkan sesuai keinginan anggota.  
* **Varian Syariah:**  
  * **Simpanan Pokok (Akad: Wadiah Yad Dhamanah):** Simpanan titipan yang wajib disetor sekali sebagai syarat keanggotaan dan tidak dapat ditarik selama anggota aktif.  
  * **Simpanan Wajib (Akad: Wadiah Yad Dhamanah):** Simpanan titipan berkala yang wajib dibayar oleh anggota.  
  * **Simpanan Sukarela (Akad: Mudharabah Muthlaqah):** Simpanan yang bersifat investasi, dikelola secara produktif oleh koperasi dengan sistem bagi hasil.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* **Meningkatkan Transparansi:** Menyediakan informasi simpanan yang jelas, akurat, dan *real-time* kepada anggota.  
* **Meningkatkan Partisipasi Anggota:** Mendorong anggota untuk rutin memenuhi kewajiban Simpanan Wajib dan aktif menabung di Simpanan Sukarela.  
* **Menyediakan Kepatuhan Syariah (untuk model Syariah):** Memastikan semua transaksi dan informasi sesuai dengan akad dan prinsip Syariah Islam.  
* **Meningkatkan Efisiensi Admin:** Mengotomatiskan pencatatan, verifikasi, dan pelaporan simpanan untuk mengurangi pekerjaan manual admin koperasi.

**Success Metrics**

* **Tingkat Kepuasan Anggota:** Tingkat kepuasan anggota terhadap kejelasan dan transparansi informasi simpanan.  
* **Tingkat Kepatuhan:** Tingkat kepatuhan anggota terhadap kewajiban setoran Simpanan Wajib.  
* **Partisipasi Simpanan Sukarela:** Peningkatan jumlah partisipasi dan total dana pada Simpanan Sukarela (baik Konvensional maupun Mudharabah).

---

#### **3\. Features**

1. **Dashboard Simpanan Anggota**  
   * Menampilkan ringkasan total simpanan yang dimiliki anggota.  
   * Rincian status simpanan: Aktif, Dalam Proses/Tertunda.  
   * Akses mudah untuk melihat rincian setiap jenis simpanan.  
2. **Rincian per Jenis Simpanan**  
   * Anggota dapat melihat detail untuk setiap jenis simpanan (Pokok, Wajib, Sukarela).  
   * Informasi yang ditampilkan: Nama jenis simpanan, jumlah setoran, dan tanggal setoran.  
   * **Khusus Simpanan Sukarela Syariah:** Menampilkan informasi **Nisbah Bagi Hasil** (misal: 60:40) dan estimasi keuntungan.  
3. **Riwayat Transaksi**  
   * Catatan log semua transaksi simpanan.  
   * Informasi yang tercatat: Tanggal, Jenis Transaksi (Setoran, Penarikan), dan Jumlah.  
   * **Khusus Syariah:** Jenis transaksi juga mencakup "Distribusi Bagi Hasil".  
4. **Alur Setoran Simpanan (Hybrid)**  
   * Anggota dapat melakukan setoran melalui berbagai metode:  
     * **Digital:** Virtual Account (VA), QRIS, atau transfer bank.  
     * **Manual:** Setor tunai langsung ke petugas koperasi, yang kemudian dicatat oleh petugas di dalam sistem.  
   * Semua setoran (digital maupun manual) akan menghasilkan  
      **Tanda Terima Digital** yang tersimpan di riwayat aplikasi.  
5. **Alur Penarikan Simpanan**  
   * Penarikan hanya dapat dilakukan untuk  
      **Simpanan Sukarela**.  
   * Anggota mengajukan penarikan melalui aplikasi.  
   * Admin menerima notifikasi, memverifikasi saldo, dan memproses pencairan dana. Simpanan Pokok & Wajib hanya bisa ditarik saat anggota keluar dari keanggotaan.  
6. **Fitur Sisi Admin/Pengelola Koperasi**  
   * **Dashboard Pengelola:** Melihat rekapitulasi total dana simpanan (Pokok, Wajib, Sukarela).  
   * **Verifikasi Transaksi:** Memvalidasi setoran tunai yang diinput manual oleh petugas.  
   * **Manajemen Penarikan:** Mengelola dan menyetujui permintaan penarikan Simpanan Sukarela dari anggota.  
   * **Perhitungan Bagi Hasil (Khusus Syariah):** Sistem membantu menghitung dan mendistribusikan bagi hasil untuk Simpanan Sukarela (Mudharabah) sesuai nisbah yang ditentukan.  
   * **Pelaporan:** Menghasilkan laporan saldo per anggota dan laporan rekapitulasi koperasi yang dapat diekspor ke Excel.

---

#### **4\. Use Case**

| Aktor | Skenario Konvensional | Skenario Syariah |
| :---- | :---- | :---- |
| **Anggota Baru** | Mendaftar via PWA dan membayar Simpanan Pokok & Wajib pertama melalui QRIS. | Mendaftar via PWA dan menyetor Simpanan Pokok (Wadiah) melalui transfer ke Rekening Syariah. |
| **Anggota Aktif** | Melihat riwayat setoran Simpanan Wajib bulanan dan memutuskan untuk menambah Simpanan Sukarela. | Melihat riwayat setoran Simpanan Wajib (Wadiah) dan melihat realisasi bagi hasil dari Simpanan Sukarela (Mudharabah) bulan lalu. |
| **Admin Koperasi** | Menerima setoran tunai dari anggota, menginputnya ke sistem, dan sistem otomatis mengirimkan bukti digital ke anggota. | Menerima notifikasi permintaan penarikan Simpanan Sukarela (Mudharabah), memverifikasi saldo, lalu mencairkan dana. |

---

#### **5\. Dependencies**

* Akses ke database simpanan anggota KSU.  
* Integrasi dengan sistem keuangan KSU untuk memperbarui informasi simpanan secara real-time.  
* Akses ke sistem administrasi KSU untuk memverifikasi dan memperbarui data simpanan.  
* Integrasi dengan payment gateway (QRIS, VA) untuk setoran digital.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |  |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Transparansi Informasi Simpanan** | Sebagai anggota, saya ingin dapat melihat rincian saldo dan riwayat transaksi untuk setiap jenis simpanan saya kapan saja. | Sebagai anggota, ketika saya mengakses halaman simpanan, maka saya akan melihat rincian saldo Pokok, Wajib, dan Sukarela beserta riwayat transaksinya. | Highest | \- Anggota dapat melihat rincian jumlah untuk setiap jenis simpanan. \- Riwayat transaksi (setoran, penarikan) ditampilkan dengan jelas. \- | **Untuk Syariah:** Rincian Simpanan Sukarela menampilkan informasi Nisbah dan riwayat distribusi bagi hasil. |
| **Kemudahan Transaksi Simpanan** | Sebagai anggota, saya ingin bisa melakukan setoran dengan mudah dan menarik Simpanan Sukarela saya melalui aplikasi. | Sebagai anggota, ketika saya ingin menyetor, maka saya bisa memilih metode pembayaran digital (QRIS/VA) atau melihat instruksi untuk setor tunai. | Highest | \- Sistem menyediakan opsi setoran digital (QRIS, VA) dan manual. \- Anggota dapat mengajukan permintaan penarikan khusus untuk Simpanan Sukarela. \- Bukti setoran digital dibuat otomatis oleh sistem. |  |
| **Manajemen Simpanan oleh Admin** | Sebagai admin, saya ingin mengelola semua data dan transaksi simpanan anggota secara efisien dan akurat. | Sebagai admin, ketika ada setoran tunai, maka saya bisa mencatatnya di sistem dan anggota akan langsung menerima bukti digital. | Highest | \- Admin dapat memverifikasi setoran tunai yang diinput ke sistem. \- Admin dapat melihat dan memproses permintaan penarikan dari anggota. \- | **Untuk Syariah:** Sistem menyediakan alat bantu untuk menghitung dan mencatat distribusi bagi hasil. |

### **Modul Pinjaman & Pembiayaan Syariah**

|  |  |
| :---- | :---- |
| **Product Name** | PWA KSU \- Modul Pinjaman & Pembiayaan Syariah |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 30 September 2026 (Estimasi) |
| **Stage** | Development |
| **Status** | In progress |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul ini adalah layanan inti koperasi yang mendigitalkan seluruh siklus hidup pinjaman (untuk koperasi konvensional) dan pembiayaan (untuk koperasi syariah). Tujuannya adalah memberikan akses yang mudah, transparan, dan cepat bagi anggota untuk mengajukan, memonitor, dan membayar kewajiban mereka, sambil menyediakan alat yang kuat bagi admin untuk mengelola risiko dan operasional secara efisien.

* **Varian Pinjaman Konvensional:** Memberikan anggota akses untuk mengajukan pinjaman dengan sistem bunga dan memantau Riwayat Pinjaman, Status Pembayaran, dan Jadwal Angsuran.  
* **Varian Pembiayaan Syariah:** Memungkinkan anggota memperoleh pembiayaan produktif tanpa bunga, berdasarkan akad-akad syariah yang sah seperti Murabahah (jual-beli), Mudharabah (bagi hasil), Musyarakah (kemitraan), atau Ijarah (sewa).

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* Menyediakan akses pembiayaan yang cepat dan transparan bagi anggota.  
* Mengotomatiskan proses dari pengajuan hingga pelunasan untuk mengurangi beban kerja admin.  
* Memastikan kepatuhan terhadap prinsip syariah untuk koperasi yang menggunakan model tersebut.  
* Meningkatkan tingkat kepatuhan pembayaran angsuran melalui pengingat dan kemudahan pembayaran.

**Success Metrics**

* **Jumlah Pembiayaan:** Jumlah pinjaman/pembiayaan yang berhasil dicairkan melalui aplikasi.  
* **Tingkat Kelancaran:** Tingkat kelancaran pembayaran angsuran oleh anggota.  
* **Waktu Proses:** Rata-rata waktu dari pengajuan hingga pencairan dana.  
* **Kepuasan Anggota:** Tingkat kepuasan anggota terhadap kemudahan proses dan transparansi informasi.

---

#### **3\. Features**

1. **Pengajuan Pinjaman/Pembiayaan Online**  
   * Formulir pengajuan digital yang dapat diisi anggota melalui PWA.  
   * **Untuk Syariah:** Wajib menyertakan *dropdown* pilihan akad (Murabahah, Mudharabah, dll.).  
   * Fitur unggah dokumen pendukung secara digital (KTP, proposal usaha, dll.).  
2. **Analisis & Penilaian Risiko Otomatis**  
   * Sistem secara otomatis memverifikasi status keanggotaan, riwayat pinjaman, dan kelengkapan dokumen.  
   * Sistem menghitung skor kelayakan kredit berdasarkan kriteria yang telah ditentukan (seperti pada tabel di bawah) untuk memberikan rekomendasi persetujuan.  
3. 

| Aspek | Bobot Maksimum |
| :---- | :---- |
| 1\. Status Keanggotaan | 20 |
| 2\. Riwayat Pembiayaan | 20 |
| 3\. Kemampuan Keuangan | 25 |
| 4\. Tujuan Pembiayaan | 15 |
| 5\. Kelengkapan Dokumen | 20 |

4. 

5. **Alur Persetujuan Digital**  
   * Admin menerima notifikasi pengajuan baru di dashboard.  
   * Hasil skor kelayakan ditampilkan untuk membantu pengambilan keputusan.  
   * Berdasarkan skor, sistem dapat memberikan rekomendasi: Otomatis Disetujui (skor ≥ 85), Perlu Verifikasi Admin (skor 65-84), atau Otomatis Ditolak (skor \< 65).  
   * Admin dapat menyetujui atau menolak pengajuan dengan satu klik dari dashboard.  
6. **Akad & Tanda Tangan Digital**  
   * Setelah disetujui, sistem otomatis menghasilkan dokumen akad/perjanjian pinjaman.  
   * Anggota dapat menyetujui dan menandatangani akad secara digital melalui verifikasi OTP.  
7. **Pencairan Dana & Manajemen Angsuran**  
   * Pencairan dana ke rekening anggota dapat dipicu secara otomatis (via integrasi API) atau secara manual oleh petugas setelah persetujuan.  
   * Sistem otomatis membuat jadwal angsuran lengkap yang bisa dilihat anggota.  
   * Anggota dapat membayar angsuran melalui metode digital seperti QRIS atau Virtual Account.  
   * Sistem mengirimkan notifikasi pengingat pembayaran otomatis (H-3, H-1, Hari-H).  
8. **Monitoring & Pelaporan**  
   * Anggota dapat melihat seluruh riwayat pinjaman/pembiayaan, status pembayaran terkini, dan detail angsuran di dashboard mereka.  
   * Admin dapat memonitor semua pinjaman aktif, melihat laporan tunggakan, dan mengunduh laporan pendapatan bunga/margin.  
   * Saat lunas, status pinjaman otomatis diperbarui dan sistem dapat menghasilkan surat lunas digital.

---

#### **4\. Use Case**

| Aktor | Skenario Pinjaman Konvensional | Skenario Pembiayaan Syariah (Murabahah) |
| :---- | :---- | :---- |
| **Anggota** | Login ke PWA, mengajukan pinjaman modal usaha, mengunggah KTP & slip gaji. Setelah disetujui, ia menandatangani akad via OTP dan dana cair ke rekeningnya. | Login ke PWA, memilih akad Murabahah untuk pembelian laptop, mengunggah KTP. Setelah disetujui, koperasi membeli laptop dan menjualnya kembali kepada anggota dengan angsuran tetap. |
| **Admin** | Menerima notifikasi pengajuan. Dashboard menunjukkan skor peminjam "Menengah Risiko". Admin me-review dokumen di sistem, lalu klik "Setujui". | Menerima notifikasi pengajuan. Dashboard menunjukkan skor "Rendah Risiko" dan status "Otomatis Disetujui". Admin memproses pembelian barang ke vendor sesuai permintaan akad Murabahah. |

---

#### **5\. Dependencies**

* Akses ke database pinjaman dan simpanan anggota KSU.  
* Integrasi dengan sistem keuangan KSU untuk memperbarui informasi secara real-time.  
* Integrasi dengan payment gateway untuk pembayaran angsuran.  
* Akses ke sistem administrasi KSU untuk verifikasi data.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |  |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Pengajuan & Persetujuan Digital** | Sebagai anggota, saya ingin bisa mengajukan pinjaman/pembiayaan secara online tanpa harus datang ke kantor. | Sebagai anggota, ketika saya mengisi formulir pengajuan online dan mengunggah dokumen, maka pengajuan saya akan diproses oleh sistem dan saya akan menerima notifikasi statusnya. | Highest | \- Formulir pengajuan digital tersedia dan berfungsi. \- Sistem dapat menerima unggahan dokumen. \- Sistem penilaian risiko otomatis berjalan. \- Admin dapat menyetujui/menolak dari dashboard. \- Anggota menerima notifikasi perubahan status pengajuan. |  |
| **Transparansi Informasi Pinjaman** | Sebagai anggota, saya ingin melihat semua detail pinjaman aktif saya, termasuk jadwal angsuran dan riwayat pembayaran. | Sebagai anggota, ketika saya membuka detail pinjaman saya, maka saya akan melihat sisa angsuran, tanggal jatuh tempo berikutnya, dan riwayat pembayaran yang sudah saya lakukan. | Highest | \- Anggota dapat melihat daftar semua pinjamannya. \- Detail pinjaman menampilkan jumlah, jangka waktu, dan status. \- Jadwal angsuran ditampilkan dengan rinci (tanggal, jumlah, status). \- | **Untuk Syariah:** Detail juga wajib menampilkan jenis akad dan margin/nisbah yang disepakati. |
| **Kemudahan Pembayaran Angsuran** | Sebagai anggota, saya ingin bisa membayar angsuran saya dengan mudah melalui aplikasi. | Sebagai anggota, ketika jatuh tempo tiba, maka saya akan menerima pengingat dan bisa membayar angsuran saya melalui metode pembayaran digital yang tersedia. | Highest | \- Sistem mengirimkan notifikasi pengingat pembayaran. \- Terdapat tombol pembayaran di detail pinjaman. \- Pembayaran via QRIS/VA berhasil dan otomatis memperbarui status angsuran menjadi "Sudah Dibayar". |  |

### **Modul Pembagian Sisa Hasil Usaha (SHU)**

|  |  |
| :---- | :---- |
| **Product Name** | PWA KSU \- Modul Pembagian SHU |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Agustus 2026 (Estimasi) |
| **Stage** | Scoping & Design |
| **Status** | To Do |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Pembagian SHU (Sisa Hasil Usaha) adalah fitur yang dirancang untuk memberikan transparansi penuh kepada anggota koperasi mengenai alokasi dan distribusi keuntungan tahunan. Selain menyediakan informasi yang jelas kepada anggota mengenai cara perhitungan dan riwayat SHU yang mereka terima, modul ini juga berfungsi sebagai alat bantu bagi pengurus koperasi untuk menghitung dan mendistribusikan SHU secara otomatis, akurat, dan efisien sesuai dengan Anggaran Dasar/Anggaran Rumah Tangga (AD/ART) koperasi.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* Menyediakan informasi yang jelas dan transparan mengenai cara perhitungan SHU kepada anggota.  
* Memberikan akses mudah kepada anggota untuk melihat riwayat pembagian SHU yang mereka terima setiap tahun.  
* **\[Enhancement\]** Mengotomatiskan dan menyederhanakan proses perhitungan dan alokasi SHU per anggota bagi pengurus koperasi untuk mengurangi kesalahan dan beban kerja manual.

**Success Metrics**

* Tingkat pemahaman anggota mengenai perhitungan SHU berdasarkan survei.  
* Tingkat kepuasan anggota terhadap transparansi informasi pembagian SHU.  
* **\[Enhancement\]** Pengurangan waktu yang dibutuhkan pengurus untuk menghitung alokasi SHU hingga 80% dibandingkan dengan metode manual (spreadsheet).

---

#### **3\. Features**

#### **3.1. Sisi Anggota: Halaman Informasi & Riwayat SHU**

1. Informasi Edukasi Perhitungan SHU  
   * **Definisi SHU:** Penjelasan singkat mengenai apa itu Sisa Hasil Usaha (SHU) dan pentingnya bagi anggota.  
   * **Rumus Perhitungan SHU:** Menampilkan formula umum yang digunakan untuk menghitung SHU (misal: SHU \= Total Pendapatan \- Total Biaya).  
   * **Faktor-faktor yang Mempengaruhi:** Penjelasan mengenai komponen pendapatan, biaya operasional, dan kebijakan pembagian yang memengaruhi SHU.  
2. **Riwayat Penerimaan SHU Pribadi**  
   * Halaman yang menampilkan daftar SHU yang diterima oleh anggota yang sedang login, diurutkan per tahun.  
   * **Rincian per Tahun:** Saat anggota memilih tahun tertentu, sistem akan menampilkan:  
     * Total SHU yang diterima anggota tersebut.  
     * Rincian komponen SHU yang diterima (misalnya, dari Jasa Modal/Simpanan dan dari Jasa Usaha/Partisipasi).

#### **3.2. Sisi Admin: Alat Kalkulator & Distribusi SHU (Fitur Fungsional)**

1. **Langkah 1: Input & Alokasi SHU Tahunan**  
   * Sebuah formulir bagi admin untuk memasukkan nilai **Total SHU Koperasi** untuk periode tahun buku (angka ini didapat dari Laporan Laba/Rugi).  
   * Formulir input persentase alokasi SHU sesuai AD/ART, contohnya:  
     * Dana Cadangan: 25%  
     * Jasa Modal (atas simpanan anggota): 20%  
     * Jasa Usaha (atas partisipasi/transaksi anggota): 40%  
     * Dana Pengurus & Karyawan: 5%  
     * Dana Pendidikan & Sosial: 10%  
   * Sistem akan secara otomatis menghitung nilai nominal Rupiah untuk setiap pos alokasi.  
2. **Langkah 2: Proses Kalkulasi SHU Otomatis**  
   * Setelah admin mengkonfirmasi alokasi, sistem akan memulai proses kalkulasi SHU untuk setiap anggota aktif.  
   * Sistem secara otomatis menarik data yang relevan dari modul lain:  
     * Total simpanan setiap anggota (dari Modul Simpanan) untuk perhitungan Jasa Modal.  
     * Total transaksi/pinjaman/partisipasi setiap anggota (dari Modul Pinjaman & POS) untuk perhitungan Jasa Usaha.  
   * Sistem menghitung SHU per anggota menggunakan rumus standar yang telah ditetapkan.  
3. **Langkah 3: Review & Finalisasi**  
   * Sistem menyajikan hasil kalkulasi dalam bentuk tabel pratinjau yang berisi daftar semua anggota beserta rincian SHU yang akan mereka terima.  
   * Admin dapat meninjau dan memverifikasi hasil kalkulasi sebelum melakukan distribusi.  
   * Terdapat tombol **"Setujui & Distribusikan SHU"** untuk mengeksekusi proses.  
4. **Langkah 4: Distribusi Digital**  
   * Setelah finalisasi, sistem secara otomatis mendistribusikan SHU ke setiap anggota dengan cara menambahkan saldo ke **Simpanan Sukarela** mereka.  
   * Sistem juga secara otomatis membuat catatan transaksi "Penerimaan SHU \[Tahun\]" di riwayat simpanan setiap anggota.

---

#### **4\. Use Case**

1. **Anggota Memahami Perhitungan SHU-nya**  
   * **Aktor:** Anggota KSU.  
   * **Skenario:** Seorang anggota ingin tahu mengapa SHU yang ia terima tahun ini berbeda dari tahun lalu. Ia membuka Modul SHU, membaca kembali faktor-faktor yang mempengaruhi perhitungan, lalu melihat riwayat SHU pribadinya untuk membandingkan rincian jasa modal dan jasa usaha antara dua tahun tersebut.  
   * **Hasil:** Anggota mendapatkan pemahaman yang transparan mengenai SHU yang diterimanya.  
2. **Pengurus Koperasi Mendistribusikan SHU Tahunan**  
   * **Aktor:** Bendahara/Admin Koperasi.  
   * **Skenario:** Setelah Rapat Anggota Tahunan (RAT) menyetujui Laporan Keuangan, bendahara membuka Alat Kalkulator SHU. Ia memasukkan total SHU tahun buku dan persentase alokasi sesuai keputusan RAT. Sistem memproses data, dan bendahara me-review hasil perhitungan per anggota di layar.  
   * **Hasil:** Setelah yakin datanya benar, bendahara menekan tombol "Setujui & Distribusikan". Dalam beberapa saat, semua anggota yang berhak telah menerima SHU mereka di akun Simpanan Sukarela masing-masing, lengkap dengan notifikasi dan catatan transaksi.

---

#### **5\. Dependencies**

* Akses ke database keuangan KSU untuk mendapatkan data total pendapatan dan biaya.  
* Integrasi dengan sistem administrasi KSU untuk data anggota yang valid.  
* **\[Enhancement\]** Ketergantungan kritis pada data historis yang akurat dari **Modul Simpanan** dan **Modul Pinjaman/POS** untuk menghitung jasa modal dan jasa usaha per anggota.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| **Transparansi Informasi SHU** | Sebagai anggota KSU, saya ingin memahami bagaimana SHU dihitung dan melihat riwayat SHU yang saya terima. | Sebagai anggota KSU, ketika saya mengakses fitur SHU, maka saya dapat melihat penjelasan cara perhitungan dan daftar SHU yang saya terima setiap tahun. | Highest | \- Anggota dapat melihat penjelasan mengenai perhitungan SHU. \- Halaman riwayat menampilkan SHU yang diterima anggota per tahun. \- Informasi disajikan dalam format yang mudah dipahami. |
| **Kalkulasi SHU oleh Admin** | Sebagai admin koperasi, saya ingin sistem membantu saya menghitung alokasi SHU untuk setiap anggota secara otomatis. | Sebagai admin, ketika saya memasukkan total SHU dan persentase alokasi, maka sistem akan menghitung SHU yang akan diterima oleh setiap anggota. | Highest | \- Admin dapat menginput total SHU dan persentase alokasi (Jasa Modal, Jasa Usaha, dll.). \- Sistem berhasil menarik data simpanan dan transaksi per anggota. \- Hasil perhitungan SHU per anggota ditampilkan dalam tabel pratinjau untuk diverifikasi. |
| **Distribusi SHU Digital** | Sebagai admin koperasi, setelah perhitungan disetujui, saya ingin sistem mendistribusikan SHU ke semua anggota secara digital. | Sebagai admin, ketika saya menekan tombol "Distribusikan SHU", maka saldo Simpanan Sukarela setiap anggota akan bertambah sesuai dengan jumlah SHU yang mereka terima. | Highest | \- Terdapat tombol untuk finalisasi dan distribusi SHU. \- Setelah dieksekusi, saldo Simpanan Sukarela setiap anggota bertambah. \- Terdapat catatan transaksi "Penerimaan SHU" di riwayat simpanan anggota. \- Proses distribusi tidak dapat diulang untuk tahun buku yang sama. |

### **Modul Manajemen Anggota**

|  |  |
| :---- | :---- |
| **Product Name** | PWA KSU \- Modul Manajemen Keanggotaan |
| **Product Manager** | Yosh Wakatta |
| **Shipping Date** | 31 Mei 2026 (Estimasi) |
| **Stage** | Development |
| **Status** | In progress |
| **Teams** | Designer, Developer (\[BE\], \[FE\]), QA Tester |

---

#### **1\. Description**

Modul Manajemen Keanggotaan adalah sistem fundamental yang mengelola seluruh siklus hidup anggota koperasi, mulai dari pendaftaran anggota baru secara online, pengelolaan profil anggota yang lengkap (mencakup data pribadi, kontribusi, serta hak dan kewajiban), hingga manajemen status keanggotaan (aktif/tidak aktif) oleh admin. Modul ini menjadi pusat data anggota yang akan terintegrasi dengan semua modul transaksional lainnya.

---

#### **2\. Objectives & Success Metrics**

**Objectives**

* Memudahkan dan mempercepat proses pendaftaran anggota baru ke KSU secara online.  
* Menyediakan profil anggota yang lengkap dan terpusat untuk memastikan data selalu akurat dan up-to-date.  
* Memungkinkan admin untuk memantau dan mengelola status keanggotaan secara efisien dan transparan.

**Success Metrics**

* Waktu rata-rata yang dibutuhkan untuk menyelesaikan pendaftaran online.  
* Persentase anggota yang melengkapi atau memperbarui profil mereka dalam satu tahun.  
* Tingkat kepuasan anggota terhadap transparansi informasi status dan kontribusi mereka.

---

#### **3\. Features**

#### **3.1. Alur Pendaftaran Anggota Baru (Online)**

1. **Formulir Pendaftaran Digital:** Calon anggota mengisi formulir online dengan data pribadi esensial.  
2. **Verifikasi Kontak:** Sistem mengirimkan kode verifikasi ke email atau nomor WhatsApp untuk validasi awal.  
3. **Pembayaran Simpanan Awal:** Setelah verifikasi, calon anggota diarahkan untuk membayar Simpanan Pokok dan Simpanan Wajib pertama melalui metode pembayaran digital yang tersedia.  
4. **Antrean Verifikasi Admin:** Setelah pembayaran berhasil, aplikasi pendaftaran masuk ke dalam antrean "Menunggu Verifikasi" di dashboard admin.

#### **3.2. Sisi Anggota: Halaman Profil Saya**

1. Data Pribadi:  
   * Informasi yang dapat dilihat dan diedit (dengan persetujuan admin): Nama Lengkap , Tanggal Lahir , Jenis Kelamin , Alamat , Nomor Telepon , Email , Foto Profil.  
   * Informasi yang bersifat tetap: Nomor Anggota dan Tanggal Bergabung.  
2. Ringkasan Kontribusi (Read-Only):  
   * Bagian ini menampilkan data yang ditarik secara otomatis dari modul lain:  
     * **Total Simpanan:** Dari Modul Simpanan.  
     * **Pinjaman Aktif:** Dari Modul Pinjaman.  
     * **SHU Diterima:** Dari Modul SHU.  
     * **Riwayat Transaksi:** Link menuju riwayat transaksi gabungan.  
3. Hak & Kewajiban (Informasional):  
   * Menampilkan daftar hak dan kewajiban anggota sesuai AD/ART koperasi.

#### **3.3. Sisi Admin: Dashboard Manajemen Anggota**

1. **Daftar Anggota:** Tampilan tabel berisi seluruh anggota yang dapat dicari berdasarkan Nama atau Nomor Anggota, dan difilter berdasarkan Status (Aktif/Tidak Aktif).  
2. **Verifikasi Pendaftar Baru:**  
   * Area khusus untuk melihat daftar calon anggota yang sudah membayar dan menunggu persetujuan.  
   * Admin dapat me-review data dan dokumen yang diunggah, lalu melakukan aksi: **"Setujui & Aktifkan"** (yang akan meng-generate Nomor Anggota) atau **"Tolak"** (dengan menyertakan alasan).  
3. Manajemen Status Keanggotaan:  
   * Pada halaman detail anggota, admin dapat mengubah status keanggotaan dari "Aktif" menjadi "Tidak Aktif" atau sebaliknya.  
   * Setiap perubahan status akan tercatat dalam log riwayat untuk tujuan audit.  
   * Anggota akan menerima notifikasi otomatis terkait perubahan status keanggotaannya.

---

#### **4\. Use Case**

1. Pendaftaran Anggota Baru Secara Online:  
   * **Aktor:** Calon Anggota, Admin KSU.  
   * **Skenario:** Seorang calon anggota mengisi formulir pendaftaran dan membayar simpanan awal secara online. Admin menerima notifikasi, me-review data di dashboard, dan menyetujui pendaftaran tersebut.  
   * **Hasil:** Calon anggota resmi menjadi anggota aktif, mendapatkan Nomor Anggota, dan bisa login ke PWA.  
2. Anggota Memperbarui Profil:  
   * **Aktor:** Anggota KSU, Admin KSU.  
   * **Skenario:** Seorang anggota pindah alamat. Ia login ke profilnya dan mengubah data alamat. Perubahan ini masuk ke antrean persetujuan admin.  
   * **Hasil:** Admin menyetujui perubahan, dan data alamat anggota di sistem berhasil diperbarui.

---

#### **5\. Dependencies**

* Akses ke database anggota KSU.  
* Integrasi dengan sistem keuangan KSU (Modul Simpanan, Pinjaman, SHU) untuk melacak kontribusi dan kewajiban.  
* Akses ke sistem administrasi KSU untuk memperbarui status keanggotaan.

---

#### **6\. Requirements**

| Epics | User Story | US Framework | Priority | Acceptance Criteria |  |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Pendaftaran Anggota Baru Secara Online** | Sebagai calon anggota, saya ingin mendaftar ke KSU secara online sehingga tidak perlu mengunjungi kantor KSU. | Sebagai anggota baru, ketika saya mengisi formulir pendaftaran secara online, maka saya akan menerima konfirmasi pendaftaran dan Admin KSU akan memverifikasi pendaftaran saya. | Highest | \- Formulir pendaftaran online lengkap dan mudah diisi .\- Admin KSU menerima notifikasi di dashboard untuk memverifikasi pendaftaran.\- Admin dapat menyetujui atau menolak pendaftaran dari dashboard.\- Setelah disetujui, Nomor Anggota unik dibuat oleh sistem. |  |
| **Profil Anggota Lengkap** | Sebagai anggota KSU, saya ingin melihat dan memperbarui profil saya sehingga informasi saya selalu up-to-date. | Sebagai anggota KSU, ketika saya mengakses profil saya, maka saya dapat melihat dan memperbarui data pribadi, kontribusi, hak, dan kewajiban saya. | Highest | \- Profil anggota menampilkan data pribadi, kontribusi, hak, dan kewajiban .\- Anggota dapat mengajukan perubahan data pribadi.\- Bagian "Kontribusi" (Simpanan, Pinjaman, SHU) bersifat | *read-only* dan datanya tersinkronisasi otomatis dari modul lain. |
| **Manajemen Status Keanggotaan** | Sebagai Admin KSU, saya ingin memperbarui dan memantau status keanggotaan anggota KSU sehingga status keanggotaan selalu akurat. | Sebagai Admin KSU, ketika saya mengakses profil anggota, maka saya dapat memperbarui status keanggotaan (aktif/tidak aktif) dan melihat riwayat status keanggotaan. | Highest | \- Admin KSU dapat memperbarui status keanggotaan anggota secara online .\- Sistem menyimpan riwayat perubahan status keanggotaan .\- Anggota menerima notifikasi tentang perubahan status keanggotaan mereka. |  |

