# Daftar Modul Sistem PWA Koperasi Serba Usaha

| No | Nama Modul | Fungsi Utama | Target Pengguna | Dependencies | Status |
|----|-------------|---------------|------------------|---------------|--------|
| 1 | Modul Manajemen Akun & Pengguna | Onboarding bisnis, login, manajemen pengguna dan hak akses. | Semua | Email service, database pengguna | In Progress |
| 2 | Modul Manajemen Keanggotaan | Pendaftaran dan pengelolaan status anggota koperasi. | Koperasi | Modul Simpanan, Pinjaman, SHU | In Progress |
| 3 | Modul Manajemen Modul & Langganan | Aktivasi/deaktivasi modul dan perhitungan biaya langganan. | Semua | Payment gateway, sistem konfigurasi modul | In Progress |
| 4 | Modul Landing Page (Adaptif) | Tampilan publik sesuai jenis bisnis (Koperasi, UMKM, BUMDes). | Semua | Konten bisnis, email/CRM | To Do |
| 5 | Modul Inventaris | Manajemen produk, stok, dan sinkronisasi data. | Semua | POS, Marketplace, Dashboard | To Do |
| 6 | Modul Kasir (Point of Sale / POS) | Transaksi penjualan offline di toko. | UMKM, Koperasi | Inventaris, Laporan | To Do |
| 7 | Modul Marketplace (Toko Online) | Etalase online dan pemesanan digital. | UMKM, Koperasi, BUMDes | Inventaris, Manajemen Pesanan Online | To Do |
| 8 | Modul Laporan | Laporan keuangan dan performa usaha. | Semua | POS, Marketplace, Inventaris, Keuangan | To Do |
| 9 | Modul Dashboard Utama | Ringkasan performa bisnis dan pintasan. | Semua | POS, Inventaris, Laporan | In Refinement |
| 10 | Modul Simpanan (Konvensional & Syariah) | Manajemen simpanan pokok, wajib, dan sukarela. | Koperasi | Payment gateway, Keuangan | In Progress |
| 11 | Modul Pinjaman & Pembiayaan Syariah | Pengajuan dan pelunasan pinjaman/pembiayaan. | Koperasi | Simpanan, Keuangan, Payment Gateway | In Progress |
| 12 | Modul Pembagian Sisa Hasil Usaha (SHU) | Perhitungan dan distribusi SHU tahunan. | Koperasi | Simpanan, Pinjaman, Laporan | To Do |
| 13 | Modul Manajemen Harga Bertingkat | Penentuan harga berdasarkan tipe pelanggan. | UMKM | Inventaris, Kontak, POS | To Do |
| 14 | Modul Manajemen Unit Usaha Terpisah | Pemisahan data antar unit usaha dalam satu entitas. | BUMDes | Database, semua modul lainnya | To Do |
| 15 | Modul Manajemen Aset & Jadwal Sewa | Sewa aset seperti gedung atau alat desa. | BUMDes | Laporan, Kontak, Unit Usaha | To Do |

Catatan: Setiap modul memiliki lapisan *usecase* yang menjembatani `handler` dan `store`. Ringkasan fungsi dapat dilihat pada [Modules Usecase Overview](modules_usecase_overview.md).


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