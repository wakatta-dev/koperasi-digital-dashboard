# 📘 API Endpoint List for PWA Koperasi Serba Usaha (KSU)

Berikut adalah daftar lengkap endpoint API untuk seluruh modul berdasarkan dokumen PRD.

---

## 🔐 Modul Manajemen Akun & Pengguna

- `POST /auth/register` - Registrasi akun bisnis baru dan verifikasi email
- `POST /auth/login` - Login pengguna
- `POST /auth/forgot-password` - Permintaan reset password
- `POST /auth/reset-password` - Reset password dengan token
- `GET /users/me` - Info pengguna yang login
- `GET /users` - Daftar pengguna dalam bisnis
- `POST /users/invite` - Invite user baru via email
- `PATCH /users/:id/role` - Ubah role pengguna
- `PATCH /users/:id/deactivate` - Nonaktifkan user
- `GET /business-profile` - Lihat profil bisnis
- `PATCH /business-profile` - Update profil bisnis

---

## 💰 Modul Simpanan (Konvensional & Syariah)

- `GET /savings` - Ringkasan saldo simpanan anggota
- `GET /savings/types` - Daftar jenis simpanan
- `POST /savings/deposit` - Setor simpanan
- `POST /savings/withdrawal` - Penarikan simpanan sukarela
- `GET /savings/transactions` - Riwayat transaksi simpanan
- `GET /savings/admin-summary` - Rekap admin
- `PATCH /savings/verify-deposit` - Verifikasi setoran manual
- `PATCH /savings/approve-withdrawal` - Persetujuan penarikan
- `POST /savings/distribute-profit-sharing` - Distribusi bagi hasil
  - Rumus: `BagianAnggota = DanaTotal × NisbahAnggota`

---

## 💳 Modul Pinjaman & Pembiayaan Syariah

- `POST /loans/apply` - Pengajuan pinjaman/pembiayaan
- `GET /loans` - List pinjaman
- `GET /loans/:id` - Detail pinjaman
- `PATCH /loans/:id/approve` - Setujui pinjaman
- `PATCH /loans/:id/reject` - Tolak pinjaman
- `GET /loans/:id/schedule` - Jadwal angsuran
- `POST /loans/:id/repayment` - Pembayaran angsuran
  - Rumus: `(Plafon × Margin) / Tenor`
- `POST /loans/sign-agreement` - Tanda tangan akad digital
- `GET /loans/admin-summary` - Ringkasan admin

---

## 🧮 Modul Pembagian SHU

- `GET /shu` - Info dan perhitungan SHU
- `GET /shu/history` - Riwayat penerimaan SHU
- `POST /shu/allocate` - Input & alokasi SHU tahunan
- `POST /shu/distribute` - Distribusi SHU ke simpanan sukarela
- `GET /shu/admin-preview` - Preview perhitungan SHU

---

## 👥 Modul Manajemen Anggota

- `POST /members/register` - Daftar anggota baru
- `GET /members` - List anggota
- `GET /members/:id` - Detail anggota
- `PATCH /members/:id` - Update data anggota
- `PATCH /members/:id/status` - Aktif/nonaktif anggota
- `GET /members/contributions/:id` - Ringkasan kontribusi

---

## 📦 Modul Inventaris

- `GET /inventory/products` - List produk
- `POST /inventory/products` - Tambah produk baru
- `GET /inventory/products/:id` - Detail produk
- `PUT /inventory/products/:id` - Edit produk
- `PATCH /inventory/products/:id/stock-adjustment` - Penyesuaian stok
- `GET /inventory/products/:id/stock-history` - Riwayat stok

---

## 💳 Modul Kasir (POS)

- `POST /pos/transactions` - Buat transaksi
- `GET /pos/products` - Ambil daftar produk
- `GET /pos/customers` - Ambil daftar pelanggan
- `GET /pos/transactions/:id` - Detail transaksi
- `GET /pos/session` - Info sesi kasir
- `POST /pos/session/open` - Buka sesi
- `POST /pos/session/close` - Tutup sesi

---

## 🛍️ Modul Marketplace

- `GET /marketplace/products` - List produk di toko online
- `GET /marketplace/products/:slug` - Detail produk
- `POST /marketplace/orders` - Buat pesanan
- `GET /marketplace/orders/:id` - Detail pesanan
- `PATCH /marketplace/orders/:id/status` - Ubah status pesanan

---

## 📊 Modul Laporan

- `GET /reports/profit-loss` - Laporan laba/rugi
- `GET /reports/cashflow` - Laporan arus kas
- `GET /reports/balance-sheet` - Laporan neraca
- `GET /reports/sales` - Ringkasan penjualan
- `GET /reports/sales-products` - Produk terlaris
- `GET /reports/export?type=csv` - Ekspor data

---

## 🧭 Modul Dashboard Utama

- `GET /dashboard/summary` - Ringkasan performa
- `GET /dashboard/sales-chart` - Grafik penjualan
- `GET /dashboard/notifications` - Notifikasi bisnis
- `GET /dashboard/top-products` - Produk terlaris

---

## ⚙️ Modul Manajemen Modul & Langganan

- `GET /modules` - List modul
- `POST /modules/:id/activate` - Aktifkan modul
- `POST /modules/:id/deactivate` - Nonaktifkan modul
- `GET /billing/summary` - Ringkasan biaya langganan

---

## 🌐 Modul Landing Page (Adaptif)

- `GET /landing` - Ambil konten landing page
- `POST /landing/form` - Submit form kontak atau pendaftaran
- `GET /landing/config` - Konfigurasi tampilan adaptif

---

## ❓ Modul FAQ

- `GET /faq` - Daftar FAQ dengan pencarian dan kategori
- `GET /faq/categories` - Daftar kategori FAQ
- `POST /faq/:id/feedback` - Kirim umpan balik Ya/Tidak
- `POST /faq` - Tambah FAQ baru *(admin)*
- `PUT /faq/:id` - Perbarui FAQ *(admin)*
- `DELETE /faq/:id` - Hapus FAQ *(admin)*
- `POST /faq/categories` - Tambah kategori FAQ *(admin)*
- `PUT /faq/categories/:id` - Perbarui kategori FAQ *(admin)*
- `DELETE /faq/categories/:id` - Hapus kategori FAQ *(admin)*

---

## 🏢 Modul Manajemen Unit Usaha Terpisah

- `GET /business-units` - Daftar unit usaha
- `POST /business-units` - Tambah unit usaha
- `PUT /business-units/:id` - Edit unit usaha
- `DELETE /business-units/:id` - Hapus unit usaha
- `PATCH /users/:id/assign-unit` - Alokasi akses pengguna ke unit
- `GET /reports/by-unit` - Laporan berdasarkan unit

---

## 💸 Modul Manajemen Harga Bertingkat

- `GET /price-tiers` - List tingkatan harga
- `POST /price-tiers` - Buat tingkatan harga baru
- `PUT /price-tiers/:id` - Edit tingkatan
- `GET /products/:id/price-tiers` - Harga per produk
- `PATCH /products/:id/price-tiers` - Update harga bertingkat produk
- `GET /contacts/:id/price-tier` - Ambil tingkatan harga pelanggan
- `PATCH /contacts/:id/price-tier` - Set tingkatan harga untuk pelanggan

---

## 🛠️ Modul Aset & Jadwal Sewa

- `GET /rental-assets` - List aset sewa
- `POST /rental-assets` - Tambah aset
- `PUT /rental-assets/:id` - Edit aset
- `GET /rental-calendar` - Kalender sewa
- `POST /rental-bookings` - Buat pemesanan sewa
- `PATCH /rental-bookings/:id/status` - Update status sewa
- `POST /rental-bookings/:id/invoice` - Buat tagihan
- `GET /rental-bookings` - Riwayat pemesanan



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