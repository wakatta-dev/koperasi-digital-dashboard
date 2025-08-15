# Route Dashboard

## **1. Tenant Type: Vendor**

**Role utama:** `super_admin`, `vendor_admin`

| Path | Deskripsi | Role |
| --- | --- | --- |
| `/dashboard` | Ringkasan penjualan, client aktif, invoice overdue | super_admin, vendor_admin |
| `/products` | Kelola produk & modul | super_admin |
| `/clients` | Daftar client (koperasi/umkm/bumdes) | super_admin, vendor_admin |
| `/invoices` | Kelola invoice & pembayaran | super_admin, vendor_admin |
| `/users` | Manajemen user vendor | super_admin |
| `/notifications` | Notifikasi client & internal | vendor_admin |
| `/tickets` | Trouble ticket support | vendor_admin |

---

## **2. Tenant Type: Koperasi**

**Role utama:** `admin_keuangan`, `admin_keanggotaan`, `viewer`

| Path | Deskripsi | Role |
| --- | --- | --- |
| `/dashboard` | Ringkasan simpanan, pinjaman, RAT | semua role |
| `/keanggotaan` | Daftar anggota, verifikasi pendaftar baru | admin_keanggotaan |
| `/simpanan` | Kelola simpanan pokok, wajib, sukarela | admin_keuangan |
| `/pinjaman` | Pengajuan pinjaman, pembiayaan syariah | admin_keuangan |
| `/shu` | Pembagian SHU tahunan | admin_keuangan |
| `/rat` | Rapat Anggota Tahunan & voting | admin_keanggotaan |
| `/aset` | Aset & penyusutan | admin_keuangan |
| `/transaksi` | Transaksi keuangan | admin_keuangan |
| `/laporan` | Laporan keuangan (Neraca, Laba Rugi, Arus Kas) | semua role |
| `/pengaturan` | Konfigurasi koperasi (tema, modul aktif) | admin_keuangan |
| `/tagihan` | Tagihan langganan modul | admin_keuangan |
| `/chat-support` | Live chat ke vendor | semua role |

---

## **3. Tenant Type: UMKM**

**Role utama:** `owner`, `staff`

| Path | Deskripsi | Role |
| --- | --- | --- |
| `/dashboard` | Ringkasan penjualan, stok | owner, staff |
| `/inventaris` | Manajemen produk & stok | owner, staff |
| `/harga-bertingkat` | Pengaturan harga bertingkat | owner |
| `/pos` | Point of Sale | staff |
| `/laporan` | Laporan penjualan | owner, staff |
| `/pengaturan` | Konfigurasi UMKM | owner |

---

## **4. Tenant Type: BUMDes**

**Role utama:** `admin_unit`, `manager_unit`

| Path | Deskripsi | Role |
| --- | --- | --- |
| `/dashboard` | Ringkasan semua unit usaha | admin_unit |
| `/unit-usaha` | Daftar unit usaha, tambah/edit/hapus | admin_unit |
| `/aset-sewa` | Daftar aset yang disewakan | admin_unit |
| `/jadwal-sewa` | Kalender jadwal sewa | manager_unit |
| `/laporan` | Laporan per unit | admin_unit, manager_unit |
| `/pengaturan` | Konfigurasi BUMDes | admin_unit |
