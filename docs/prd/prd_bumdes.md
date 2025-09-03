
# [PRD] PWA Koperasi Serba Usaha (KSU)

## Modul Manajemen Unit Usaha Terpisah

### Product Info
- **Product Name**: Modul Manajemen Unit Usaha Terpisah  
- **Product Manager**: Yosh Wakatta  
- **Shipping Date**: 30 April 2026  
- **Stage**: Scoping  
- **Status**: To Do  
- **Teams**: Designer, Developer ([BE], [FE]), QA Tester  

---

### 1. Description

Modul Manajemen Unit Usaha Terpisah adalah sebuah fitur tingkat lanjut yang memungkinkan satu akun bisnis untuk mengelola beberapa lini usaha atau cabang secara independen. Fungsi utamanya adalah untuk memisahkan data operasional dan keuangan—seperti produk, penjualan, dan biaya—untuk setiap unit usaha. Hal ini memungkinkan manajer untuk menganalisis kinerja setiap unit secara terpisah serta melihat laporan konsolidasi dari seluruh perusahaan. Fitur ini sangat krusial bagi BUMDes yang memiliki beragam unit (toko, wisata, sewa) dan memerlukan pelaporan yang akuntabel per unitnya.

---

### 2. Objectives & Success Metrics

#### Objectives
- **Kejelasan Operasional & Finansial**: Data tidak tercampur antar unit.
- **Penyederhanaan Pelaporan**: Laporan kinerja tiap unit untuk pertanggungjawaban.
- **Dukungan Keputusan Strategis**: Identifikasi unit yang menguntungkan atau bermasalah.

#### Success Metrics
- **Feature Adoption**: >80% BUMDes mengaktifkan fitur ini.
- **Reporting Usage**: Fitur filter "Unit Usaha" di laporan digunakan aktif.
- **Feedback**: Klien menyatakan fitur ini sangat penting dan membantu.

---

### 3. Features

1. **Pengaturan Unit Usaha**
   - Tambah/edit/nonaktifkan unit usaha di halaman pengaturan.
   - Tiap unit punya nama unik.

2. **Penandaan (Tagging) Data**
   - **Inventaris**: Produk ditandai berdasarkan unit.
   - **Keuangan**: Transaksi wajib terkait unit.
   - **Pengguna**: Hak akses dibatasi per unit.

3. **Filter Global Unit Usaha**
   - Dropdown di header untuk pilih tampilan data berdasarkan unit.
   - Opsi: "Semua Unit (Konsolidasi)" atau per unit spesifik.

4. **Integrasi Laporan**
   - Laporan bisa ditampilkan per unit atau gabungan.
   - Termasuk kemungkinan laporan perbandingan antar unit.

---

### 4. Use Case

1. **Manajer Analisis Kinerja**
   - Manajer membuka laporan laba/rugi untuk setiap unit guna menyusun strategi.

2. **Kasir Hanya Akses Unitnya**
   - Kasir hanya melihat produk dari unit yang dia kelola, mencegah kesalahan operasional.

---

### 5. Dependencies

- **Arsitektur Database**: Penambahan `unit_usaha_id` di tabel-tabel transaksi.
- **Refactoring Modul**: Dashboard, Inventaris, POS, dll harus sadar unit usaha.
- **Desain UI/UX**: Harus jelas dalam pemilihan unit agar tidak membingungkan.

---

### 6. Requirements

| Epics | User Story | Priority | Acceptance Criteria |
|-------|------------|----------|----------------------|
| Konfigurasi & Isolasi Data | Sebagai Manajer BUMDes, saya ingin membuat unit usaha dan alokasikan data secara terpisah. | Highest | - Admin bisa membuat/edit/hapus unit. <br> - Produk dan transaksi punya field unit usaha. <br> - Data hanya terlihat oleh pengguna dengan akses. |
| Analisis Kinerja Terpisah | Sebagai Manajer, saya ingin melihat laporan keuangan per unit. | Highest | - Terdapat Filter Global. <br> - Semua laporan menyesuaikan filter. <br> - Angka laporan sesuai data per unit. |
| Akses Terbatas Staf | Sebagai Admin, saya ingin membatasi akses staf hanya pada unitnya. | High | - Admin dapat mengatur unit untuk pengguna. <br> - Pengguna hanya melihat data unit tersebut. <br> - Filter global dinonaktifkan jika perlu. |

---

## Modul Manajemen Aset & Jadwal Sewa

### Product Info
- **Product Name**: Modul Manajemen Aset & Jadwal Sewa  
- **Product Manager**: Yosh Wakatta  
- **Shipping Date**: 30 Juni 2026  
- **Stage**: Scoping  
- **Status**: To Do  
- **Teams**: Designer, Developer ([BE], [FE]), QA Tester  

---

### 1. Description

Modul ini memungkinkan pengguna mengelola aset fisik yang dapat disewakan. Termasuk fitur untuk mendaftarkan aset, menjadwalkan penyewaan dengan kalender visual, booking, hingga penagihan dan pencatatan pendapatan. Fokus pada digitalisasi penyewaan dan transparansi pendapatan.

---

### 2. Objectives & Success Metrics

#### Objectives
- Digitalisasi proses penyewaan, mengurangi risiko jadwal ganda.
- Menciptakan aliran pendapatan baru.
- Memberi visibilitas penuh terhadap aset.

#### Success Metrics
- >70% klien BUMDes aktif menggunakan modul ini.
- Pengurangan >50% waktu administrasi manual.
- Data digunakan untuk menilai performa aset.

---

### 3. Features

1. **Manajemen Katalog Aset**
   - Tambah/edit aset dengan detail seperti nama, foto, tarif.

2. **Kalender Penjadwalan Visual**
   - Kalender interaktif dengan kode warna status sewa.

3. **Form Booking**
   - Pemilihan aset, penyewa, waktu mulai-selesai, total biaya otomatis.

4. **Manajemen Pemesanan & Tagihan**
   - Riwayat pemesanan, ubah status, cetak tagihan otomatis.

---

### 4. Use Case

1. **Admin Sewa Gedung**
   - Admin membuat jadwal sewa langsung dari kalender, mencetak tagihan.

2. **Manajer Analisis Utilisasi Aset**
   - Manajer melihat riwayat penyewaan traktor untuk evaluasi bulanan.

---

### 5. Dependencies

- Modul Manajemen Kontak
- Modul Laporan (untuk Laba/Rugi dan Arus Kas)
- Modul Unit Usaha (alokasi aset ke unit)
- UI/UX Kalender yang intuitif

---

### 6. Requirements

| Epics | User Story | Priority | Acceptance Criteria |
|-------|------------|----------|----------------------|
| Katalog Aset | Sebagai Manajer, saya ingin daftar aset dengan tarif. | Highest | - Menu manajemen aset tersedia. <br> - Tambah aset dengan nama, deskripsi, tarif. <br> - Aset bisa dipilih saat membuat jadwal. |
| Penjadwalan Visual | Sebagai Admin, saya ingin melihat jadwal dalam bentuk kalender. | Highest | - Kalender menampilkan blok waktu sewa. <br> - Tidak bisa sewa jika waktu tumpang tindih. <br> - Tersedia tampilan mingguan & bulanan. |
| Proses Jadwal Sewa | Sebagai Admin, saya ingin membuat jadwal sewa dengan mudah. | High | - Form booking berfungsi. <br> - Biaya otomatis dihitung. <br> - Muncul di kalender. <br> - Pendapatan tercatat di laporan. |


## Dokumentasi Lainnya

Semua spesifikasi dan perencanaan modul berada di direktori [docs/](.). Beberapa dokumen penting di antaranya:

- [Daftar Modul KSU](daftar_modul_ksu.md)
- [API Endpoint List](api-enpoints-list.md)
- PRD untuk masing-masing segmen bisnis
  - [Koperasi](PRD_Koperasi.md)
  - [UMKM](PRD_UMKM.md)
  - [BUMDes](PRD_BUMDes.md)
  - [MVP Overview](PRD_MVP.md)

Silakan merujuk ke dokumen-dokumen tersebut untuk detail rancangan fitur dan alur kerja sistem.