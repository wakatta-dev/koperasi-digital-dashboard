
# 🧩 Modul Manajemen Harga Bertingkat

## 📌 Product Info
- **Product Name:** Modul Manajemen Harga Bertingkat  
- **Product Manager:** Yosh Wakatta  
- **Shipping Date:** 28 Februari 2026  
- **Stage:** Scoping  
- **Status:** To Do  
- **Teams:** Designer, Developer ([BE], [FE]), QA Tester  

---

## 📖 1. Description
Modul ini memungkinkan klien menetapkan berbagai level harga jual untuk produk yang sama (contoh: Eceran, Grosir, Kontraktor). Terintegrasi penuh dengan Modul Inventaris, Kontak, dan Kasir (POS), fitur ini mengotomatiskan penggunaan harga berdasarkan segmen pelanggan tanpa perlu diskon manual.

---

## 🎯 2. Objectives & Success Metrics

**Objectives:**
- Memberikan fleksibilitas strategi harga untuk berbagai segmen pelanggan.
- Mengotomatiskan proses penjualan dan mengurangi kesalahan kasir.
- Meningkatkan retensi pelanggan B2B dengan harga khusus yang jelas.

**Success Metrics:**
- >60% UMKM Toko Bangunan menggunakan modul dalam 3 bulan pertama.
- >90% pengurangan penggunaan diskon manual.
- Feedback positif dari pengguna utama.

---

## 🛠️ 3. Features

1. **Pengaturan Tingkatan Harga**
   - Buat/edit tingkatan harga (misal: Grosir, Kontraktor).
   - Harga Eceran sebagai default dan tidak dapat dihapus.

2. **Penetapan Harga pada Produk**
   - Tambah/Edit Produk dilengkapi kolom Harga Bertingkat.
   - Jika harga tidak diisi untuk suatu tingkatan, otomatis pakai harga eceran.

3. **Penetapan Tingkatan pada Pelanggan**
   - Dropdown "Tingkatan Harga" di halaman Tambah/Edit Kontak.
   - Default pelanggan baru ke harga Eceran.

4. **Integrasi dengan POS**
   - Tombol "Pilih Pelanggan" di POS.
   - Harga otomatis menyesuaikan berdasarkan tingkat harga pelanggan.

---

## 📚 4. Use Case

1. **Pemilik Toko Menetapkan Harga Kontraktor**
   - Menambahkan tingkatan “Harga Kontraktor” ke produk.
   - Menetapkan pelanggan tertentu (misal: Bapak Budi) ke tingkat tersebut.

2. **Kasir Melayani Pelanggan Kontraktor**
   - Memilih “Bapak Budi” di POS.
   - Harga khusus langsung muncul di keranjang, tanpa diskon manual.

---

## 🔗 5. Dependencies
- Modul Inventaris (multi harga jual per produk).
- Modul Kontak (atribut tingkatan harga).
- Modul POS (pemilihan pelanggan dan logika harga dinamis).

---

## ✅ 6. Requirements

| Epics | User Story | Priority | Acceptance Criteria |
|-------|------------|----------|----------------------|
| **Konfigurasi Aturan Harga** | Sebagai Admin, saya ingin bisa menetapkan harga berbeda per tingkatan | Highest | - Admin dapat buat tingkatan harga <br> - Field harga bertingkat tersedia <br> - Data harga dapat digunakan modul lain |
| **Segmentasi Pelanggan** | Sebagai Admin, saya ingin menetapkan tingkatan harga pada pelanggan | Highest | - Dropdown "Tingkatan Harga" tersedia <br> - Berhasil disimpan di data pelanggan |
| **Aplikasi Harga Otomatis di POS** | Sebagai Kasir, saat saya memilih pelanggan, harga otomatis menyesuaikan | Highest | - Tombol "Pilih Pelanggan" tersedia <br> - Harga produk di keranjang menyesuaikan <br> - Harga eceran digunakan jika pelanggan tidak dipilih |

---


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