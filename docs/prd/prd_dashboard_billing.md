GUA PUSING BGT LIAT TEXT TERUS LEWAT DRAW.IO YAAAA, SILAKAN MINTA ACC SAJA 
https://drive.google.com/file/d/1otEjKbNP35-0ae9XQmiy-HVtdxw8Ed1V/view?usp=sharing  
 
Product Requirements Document (PRD) 
Product Name: Vendor Dashboard SaaS Management 
Target User: Internal Vendor Admin / Super Admin 
Goal: Provide an admin dashboard for vendor users to manage SaaS clients, products, billing 
(invoices), support tickets, user roles, and notifications. 
 
1. Overview 
A centralized dashboard that allows vendor-side administrators to view and manage clients 
subscribed to SaaS products. The dashboard includes features for tracking clients, managing 
user permissions, creating and editing products, handling invoices, publishing notifications, and 
resolving trouble tickets. 
 
2. Features & Functional Requirements 
A. Menu (Sidebar Navigation) 
● Static Menu Items: 
○ Home 
○ Products 
○ Clients 
○ Invoices 
○ User Management 
○ Notifications 
○ Trouble Tickets 
B. Home 
● Display: 
○ Total Clients segmented by Product Tier (Standard, Bronze, Silver, Gold) 
○ Count of Open Trouble Tickets 
● Auto-updated Dashboard Widgets 
C. Products 
● List of Products: 


○ Tiered (Standard, Bronze, Silver, Gold) 
● Actions: 
○ Add New Product 
○ Edit Product 
○ Delete Product 
D. Clients 
● Fields: 
○ ID 
○ Brand Name 
○ PIC (Person in Charge) 
○ Email Login 
● Actions: 
○ Auto Add from Product Selection 
○ Edit Client Info 
E. Invoices 
● Fields: 
○ Invoice ID 
○ Client ID 
○ Billing Year 
○ Product Tier (Standard/Bronze/Silver/Gold) 
○ Nominal 
○ Status (Lunas / Belum Lunas) 
● Actions: 
○ View Invoice 
○ Reference Linked to Product and Client 
F. User Management 
● Fields: 
○ User ID 
○ Role (Super Admin only, for now) 
○ Email 
○ PIC 
○ Description 
● Actions: 
○ Add User 
○ Edit User 
○ Delete User 
G. Notifications 
● Fields: 


○ Number 
○ Date 
○ Title 
○ Description 
○ Attachment 
● Actions: 
○ Create Notification 
○ Edit Notification 
○ Delete Notification 
H. Trouble Tickets 
● Fields: 
○ Ticket Number 
○ Client ID 
○ Category (Teknis / Tagihan) 
○ Priority (Low / Medium / High) 
○ Related Product Tier 
○ Status (Open / Close) 
● Actions: 
○ Auto Add Ticket Based on Client Activity 
○ View / Filter / Sort 
 
3. Non-Functional Requirements 
● Responsive UI for Desktop 
● Authentication: Vendor admin login with role-based access control 
● Data Integrity: Auto-link between Clients ↔ Invoices ↔ Trouble Tickets 
● Performance: Real-time updates for dashboard metrics 
 
4. Technical Notes 
● Frontend: React with TailwindCSS (or similar) 
● Backend: Node.js / Laravel 
● Database: PostgreSQL / MySQL 
● Hosting: Cloud-based (Vercel, Netlify, or VPS) 
 
5. Future Enhancements 


● Export data as CSV/PDF 
● Bulk notifications 
● Multi-role user support 
● Ticket assignment & escalation 
● SLA tracking 
 
6. Acceptance Criteria 
● All listed modules and fields are functional 
● Admins can fully manage the CRUD lifecycle of each entity 
● Home dashboard reflects current data state (clients & tickets) 
● Navigation is intuitive and responsive 
● Linked data relations work (e.g., invoice links to client & product) 


Menu Home (Vendor Dashboard) 
🧭 Tujuan Fitur 
Halaman Home bertujuan untuk memberikan ringkasan cepat (overview) kepada vendor terkait: 
● Total klien aktif berdasarkan jenis produk (Standard, Bronze, Silver, Gold). 
● Jumlah tiket gangguan (trouble tickets) yang masih terbuka dan perlu ditindaklanjuti. 
 
🎯 Objective 
● Menyediakan tampilan ringkas performa layanan klien berdasarkan kategori produk. 
● Memberikan indikator langsung jumlah tiket yang perlu ditangani. 
● Mempermudah vendor untuk cepat menavigasi isu atau kondisi layanan dari halaman 
awal. 
 
🖥 Fitur Tampilan UI 
1. Summary Total Clients by Product Tier 
● Judul: Total Clients 
● Isi: Daftar dengan jumlah klien aktif untuk masing-masing tier produk. 
Format: 
- Standard: 24 
- Bronze: 18 
- Silver: 30 
- Gold: 8 
● Sumber Data: Tabel Clients dan Products 
● Logika: Hitung jumlah klien yang dikaitkan dengan masing-masing produk berdasarkan 
relasi di Invoices. 
2. Jumlah Trouble Tickets Terbuka 
● Judul: Open Tickets 
● Format: X Trouble Tickets are currently open 
● Klik pada angka dapat diarahkan ke halaman detail Trouble Tickets dengan filter: 
Status = Open. 


● Sumber Data: Tabel Trouble Tickets 
● Logika: Filter semua tiket dengan status Open. 
3. Insight Box 
● Penambahan info cepat seperti: 
○ Most active client (berdasarkan jumlah tiket) 
○ Produk dengan jumlah tiket terbanyak 
 
⚙ Functional Requirement 
No 
Fungsi 
Deskripsi 
1 
Hitung total klien per 
produk 
Sistem membaca relasi Clients → Invoices → Products 
2 
Hitung tiket terbuka 
Sistem menghitung jumlah data dari Trouble Tickets 
dengan Status = Open 
3 
Navigasi cepat 
Klik pada item akan mengarahkan ke halaman terkait dengan 
filter aktif 
4 
Auto Refresh 
Data diperbarui secara otomatis setiap 5 menit atau saat 
reload halaman 
 
🧪 Acceptance Criteria 
ID 
Kriteria 
Cara Validasi 
AC-1 Menampilkan jumlah klien per 
produk 
Sesuai data aktual di database 
AC-2 Menampilkan jumlah tiket 
terbuka 
Jumlah sama dengan hasil query status = open 
AC-3 Navigasi bekerja 
Klik item membawa user ke halaman terkait 
dengan filter sesuai 
AC-4 Data dinamis 
Saat klien/tiket baru ditambah, data di Home ikut 
berubah 
 
📊 Contoh Tampilan (Low Fidelity) 


+-------------------------+     +-----------------------+ 
|   Total Clients         |     |    Open Tickets       | 
|                         |     |                       | 
|   Standard:    24       |     |   5 tickets open      | 
|   Bronze:      18       |     |   [ View Details ]    | 
|   Silver:      30       |     +-----------------------+ 
|   Gold:         8       | 
+-------------------------+ 
 
🔌 Data Source & Relasi 
● Tabel Clients (Brand Name, Product) 
● Tabel Invoices (referensi produk untuk validasi) 
● Tabel Trouble Tickets (status, id client) 
 
🧱 Teknologi & Komponen 
● Front-End: React/Vue Component (Box + Table Count) 
● Backend API: 
○ GET /clients/summary-by-product 
○ GET /tickets/count?status=open 
● Auto Update: Websocket atau Interval Polling
 


Menu Products 
 
🧭 Tujuan Fitur 
Menu Products digunakan oleh vendor untuk: 
● Membuat dan mengelola paket produk SaaS. 
● Menentukan harga tiap paket dan add-on. 
● Menentukan modul/fitur apa saja yang tersedia di setiap produk. 
● Menjamin bahwa klien hanya mendapat akses sesuai dengan paket yang dipilih (akses 
antar paket bersifat eksklusif). 
 
🎯 Objective 
● Memungkinkan vendor menambah, mengubah, menghapus paket produk dan add-ons. 
● Menjamin isolasi akses modul berdasarkan jenis paket. 
● Integrasi penuh antar produk dengan sistem klien, faktur, dan hak akses modul. 
● Meningkatkan fleksibilitas konfigurasi layanan SaaS berdasarkan kebutuhan klien. 
 
🖥 Fitur Tampilan UI 
A. Daftar Produk 
● Menampilkan semua produk yang tersedia. 
● Kolom: 
○ Nama Paket 
○ Tipe: Paket / Add-on 
○ Modul Tersedia (jumlah) 
○ Harga 
○ Status: Aktif / Non-aktif 
○ Aksi: [Edit] [Hapus] 
B. Tambah / Ubah Produk 
● Field: 
○ Nama Paket 
○ Tipe: 
■ □ Paket 
■ □ Add-on 


○ Deskripsi 
○ Harga (per bulan atau per tahun) 
○ Pilihan Modul: 
■ □ Modul A (mis. Berita) 
■ □ Modul B (mis. Keuangan) 
■ □ Modul C (mis. Statistik) 
■ dst. 
○ Status: 
■ □ Aktif 
■ □ Non-aktif 
● Tombol: 
○ [Simpan] 
○ [Batal] 
C. Integrasi Modul & Hak Akses 
● Sistem backend akan mencatat setiap modul yang dikaitkan ke suatu paket/add-on. 
● Klien hanya akan dapat menggunakan modul sesuai dengan paket yang mereka miliki. 
● Tidak ada overlap: modul dari paket Gold tidak bisa diakses oleh klien Bronze. 
 
⚙ Functional Requirements 
No 
Fungsi 
Deskripsi 
1 
Tambah Produk 
Vendor dapat menambahkan paket produk baru, menentukan harga 
dan modulnya 
2 
Edit Produk 
Vendor dapat mengubah harga, modul, dan status produk 
3 
Hapus Produk 
Vendor dapat menghapus produk (hanya jika belum digunakan 
klien) 
4 
Add-on Produk 
Vendor dapat menambahkan modul opsional di luar paket utama 
5 
Eksklusivitas 
Modul 
Modul hanya bisa aktif jika dimiliki di paket (tidak tumpang tindih 
antar level) 
6 
Validasi Integrasi 
Saat klien membeli paket tertentu, sistem otomatis membatasi 
akses modul sesuai produk 
7 
Modul Master List 
Admin dapat membuat daftar modul yang bisa digunakan di semua 
produk (master modul) 
 


🔐 Access Rules 
● Paket hanya bisa dipilih satu per klien (mis: Bronze tidak bisa digabung dengan 
Silver). 
● Add-on bisa dipilih lebih dari satu dan ditambahkan ke paket utama (mis: Bronze + 
Add-on Statistik). 
● Jika suatu modul sudah aktif dalam paket, modul tersebut tidak dapat diaktifkan ulang 
melalui add-on. 
 
🧪 Acceptance Criteria 
ID 
Kriteria 
Validasi 
AC-1 Vendor bisa menambah produk baru 
Data tersimpan dan muncul di tabel produk 
AC-2 Vendor bisa memilih modul untuk tiap 
paket 
Modul tersedia muncul saat edit produk 
AC-3 Klien hanya dapat mengakses modul 
sesuai paket 
Login sebagai klien harus melihat menu 
sesuai hak akses 
AC-4 Tambah Add-on ke klien berjalan 
sukses 
Add-on aktif dan modul baru muncul 
AC-5 Sistem menolak akses modul di luar 
paket 
Sistem memblokir modul dari paket lebih 
tinggi 
 
📊 Contoh Tampilan UI 
Tabel Produk 
+----------+---------+--------+--------+----------+----------+ 
| Nama     | Tipe    | Modul  | Harga  | Status   | Aksi     | 
+----------+---------+--------+--------+----------+----------+ 
| Bronze   | Paket   | 3 Mod  | Rp100K | Aktif    | Edit Del | 
| Silver   | Paket   | 5 Mod  | Rp200K | Aktif    | Edit Del | 
| Statistik| Add-on  | 1 Mod  | Rp50K  | Aktif    | Edit Del | 
+----------+---------+--------+--------+----------+----------+ 
Form Tambah Produk 
Nama Paket: ________ 


Tipe:   ○ Paket    ○ Add-on 
Deskripsi: ________________________ 
Harga: Rp ________ 
Modul: 
☑ Modul A (Berita) 
☐ Modul B (Keuangan) 
☐ Modul C (Produk) 
Status: ○ Aktif ○ Nonaktif 
[ Simpan ] 
 
🔌 Data Model (Back-end) 
Tabel Produk 
● id 
● nama 
● tipe (paket / add-on) 
● harga 
● status 
Tabel Modul 
● id 
● nama_modul 
● deskripsi 
Tabel Produk_Modul 
● produk_id 
● modul_id 
Tabel Klien_Produk 
● klien_id 
● produk_id 
 
⚠ Validation & Logika 


● Jika modul dipilih dalam paket Bronze, tidak muncul dalam Silver dan Gold kecuali dipilih 
ulang. 
● Produk hanya bisa dihapus jika belum dipakai klien. 
● Saat klien login, hanya modul sesuai relasi produk yang muncul. 
● Harga per produk/add-on tersimpan dan ditarik saat invoicing. 
 
🧱 Teknologi & Komponen 
● Front-End: React/Vue table + form 
● Back-End API: 
○ GET /products 
○ POST /products 
○ PUT /products/:id 
○ DELETE /products/:id 
○ GET /modules 
● Database: PostgreSQL/MySQL relational join
 


Menu Clients 
 
🧭 Tujuan Fitur 
Menu Clients digunakan untuk: 
● Mengelola data klien yang menggunakan platform SaaS (dalam hal ini, koperasi). 
● Mendaftarkan dan mengaktivasi koperasi sebagai pengguna sistem. 
● Menyimpan data hukum, alamat, identitas pengelola, dan data akses sistem. 
● Menampilkan data hasil input klien agar dapat ditinjau oleh vendor/admin. 
 
🎯 Objective 
● Menyediakan form aktivasi koperasi secara lengkap. 
● Menyimpan data koperasi dan mengaitkannya dengan pengguna bertanggung jawab. 
● Menampilkan data yang telah diinput dalam format read-only atau editable. 
● Menyediakan fitur validasi data untuk mencegah duplikasi atau kesalahan input. 
 
🖥 Fitur Tampilan UI 
A. Form Aktivasi Koperasi 
Form akan terdiri dari beberapa bagian: 
1. Data Legalitas 
● Nama Koperasi Sesuai Akta (text) 
● Nama Brand (text) 
● Nomor Badan Hukum (number/text) 
● Tanggal Berdiri (date) 
● Jenis Koperasi (dropdown) 
2. Alamat Lengkap 
● Alamat Lengkap (textarea) 
● Provinsi (dropdown) 
● Kabupaten/Kota (dropdown, dinamis berdasarkan provinsi) 
● Kecamatan (dropdown, dinamis) 
● Kelurahan/Desa (dropdown, dinamis) 


● Kode Pos (text) 
3. Identitas Visual & Teknis 
● Logo Operasi (upload image) 
● Nama Awal Domain (text, auto append .koperasi.id) 
4. Penanggung Jawab 
● Nama Penanggung Jawab (text) 
● Jabatan (text) 
5. Akun Login 
● Email Login (email) 
● Konfirmasi Email (email) 
● Password Login (password) 
● Konfirmasi Password (password) 
● Nomor WhatsApp (OTP) (text / number) 
Tombol Submit: Aktivasi Sekarang 
 
B. Tabel Data Klien (Hasil Input) 
Setelah input disimpan, data klien akan ditampilkan dalam bentuk tabel: 
Nama Brand 
Jenis 
Koperasi 
Domain 
Statu
s 
PIC 
Aksi 
Koperasi 
Sejahtera 
Konsumen 
sejahtera.koperasi
.id 
Aktif 
Budi 
Santoso 
[Lihat] [Edit] 
[Nonaktifkan] 
Klik tombol "Lihat" akan membuka tampilan detail semua data yang diinput (read-only mode). 
 
⚙ Functional Requirements 
No 
Fungsi 
Deskripsi 
1 
Aktivasi Koperasi 
Klien dapat mengisi form pendaftaran koperasi secara 
lengkap 


2 
Validasi Email dan 
Password 
Sistem memverifikasi kesesuaian dan keunikan email 
3 
Upload Logo 
Klien dapat mengunggah logo koperasi 
4 
Domain Generator 
Sistem secara otomatis membentuk subdomain 
berdasarkan input 
5 
OTP WhatsApp 
OTP akan dikirim ke nomor WhatsApp untuk validasi 
identitas 
6 
Tampilkan Hasil Input 
Vendor/admin dapat melihat detail semua data koperasi 
7 
Edit & Nonaktifkan Klien 
Vendor bisa mengubah atau menonaktifkan akun koperasi 
 
🔐 Access Rules 
● Form hanya bisa diisi satu kali untuk tiap koperasi baru. 
● Email dan domain harus unik. 
● OTP wajib berhasil divalidasi sebelum data disimpan. 
 
🧪 Acceptance Criteria 
ID 
Kriteria 
Validasi 
AC-1 
Semua field wajib diisi 
Tidak bisa submit jika ada yang kosong 
AC-2 
Email & password cocok 
Tidak bisa lanjut jika tidak cocok 
AC-3 
Subdomain dibuat 
otomatis 
Domain format 
namabrand.koperasi.id 
AC-4 
OTP WhatsApp aktif 
OTP dikirim dan validasi berhasil 
AC-5 
Data tampil di daftar klien 
Setelah submit, muncul di tabel 
AC-6 
Admin bisa klik "Lihat" 
Halaman detail muncul lengkap dan 
sesuai 
 
📦 Struktur Data 


{ 
  "id": "uuid", 
  "nama_koperasi": "Koperasi Sejahtera", 
  "brand": "Sejahtera", 
  "no_badan_hukum": "123456789", 
  "tanggal_berdiri": "2021-06-01", 
  "jenis": "Konsumen", 
  "alamat": { 
    "alamat_lengkap": "Jl. Mawar No. 1", 
    "provinsi": "Jawa Barat", 
    "kabupaten": "Bandung", 
    "kecamatan": "Cicendo", 
    "desa": "Sukajadi", 
    "kode_pos": "40111" 
  }, 
  "logo": "/uploads/logo_sejahtera.png", 
  "domain": "sejahtera.koperasi.id", 
  "pic": { 
    "nama": "Budi Santoso", 
    "jabatan": "Ketua" 
  }, 
  "akun": { 
    "email": "budi@sejahtera.id", 
    "password_hash": "encrypted", 
    "wa": "+6281234567890", 
    "otp_verified": true 
  }, 
  "status": "Aktif" 
} 
 
📌 API Endpoint (Contoh) 
● POST /clients/activation 
● GET /clients 
● GET /clients/:id 
● PUT /clients/:id 
● PATCH /clients/:id/deactivate 


 
📊 Tampilan Responsif 
● Drop-down dinamis untuk wilayah. 
● Preview logo sebelum submit. 
● OTP via WhatsApp tampil dalam popup/modal. 
 
🧱 Komponen Front-End 
● FormInput 
● ImageUploader 
● DropdownCascade 
● DomainPreview 
● OTPValidator 
● TableClient 
● ClientDetailModal 
 
 


Menu Invoices 
 
🧭 Tujuan Fitur 
Menu Invoices digunakan untuk: 
● Mengelola tagihan kepada klien berdasarkan produk dan paket langganan yang dipilih. 
● Menyimpan riwayat tagihan lengkap: nominal, status pembayaran, tahun periode, dan 
paket. 
● Menghubungkan data invoice dengan data Clients dan Products. 
● Menyediakan antarmuka untuk menandai status pembayaran (Lunas/Belum Lunas). 
● Memfasilitasi pengiriman invoice (email/manual). 
 
🎯 Objective 
● Vendor dapat menambahkan invoice baru untuk klien tertentu. 
● Admin dapat melihat daftar semua invoice berdasarkan filter tahun, status, dan klien. 
● Klien hanya bisa melihat invoice miliknya saja. 
● Sistem memastikan setiap invoice terkait dengan produk yang valid dan satu klien. 
 
🖥 Fitur Tampilan UI 
A. Form Tambah Invoice 
Field 
Tipe 
Keterangan 
ID Invoice 
Auto-generated 
UUID atau format khusus 
Nama Klien 
Dropdown 
Berdasarkan daftar klien 
Tahun 
Dropdown 
Otomatis, bisa multi-tahun 
Produk 
Dropdown 
Berdasarkan paket aktif klien 
Nominal 
Input number 
Bisa diubah manual 
Status 
Pembayaran 
Dropdown 
Lunas / Belum Lunas 
Catatan 
Textarea (optional) Keterangan khusus 


Tombol: Simpan Invoice 
 
B. Tabel Daftar Invoice 
No 
Nama Klien 
Tahun 
Paket 
Nominal 
Status 
Aksi 
1 
Koperasi 
Sejahtera 
2025 
Silver 
Rp1.200.00
0 
Belum 
Lunas 
[Lihat] [Edit] [Kirim] 
2 
Koperasi Bangkit 
2024 
Bronz
e 
Rp600.000 
Lunas 
[Lihat] 
 
C. Detail Invoice View 
Menampilkan informasi lengkap per invoice, seperti: 
● ID Invoice 
● Klien 
● Produk 
● Status Pembayaran 
● Tahun Langganan 
● Catatan / Deskripsi 
● Tanggal Buat 
● Tanggal Bayar (jika status = Lunas) 
 
⚙ Functional Requirements 
No 
Fungsi 
Deskripsi 
1 
Tambah Invoice 
Admin/vendor membuat invoice manual ke klien 
2 
Auto-nomor Invoice 
Sistem menghasilkan nomor otomatis 
3 
Hubungkan Produk & 
Klien 
Produk yang muncul berdasarkan paket yang dimiliki klien 
4 
Ubah Status 
Pembayaran 
Admin bisa ubah status jadi "Lunas" setelah verifikasi 
5 
Kirim Invoice 
Bisa kirim PDF via email atau download 


6 
Filter 
Bisa filter berdasarkan status, tahun, atau klien 
7 
Validasi Data 
Cegah input duplikat invoice untuk tahun yang sama dan 
klien yang sama 
 
🔐 Akses 
Role 
Akses 
Super Admin 
Lihat semua, buat, edit, ubah status 
Admin/Vendor 
Buat invoice untuk kliennya 
Klien 
Lihat invoice miliknya, tidak bisa ubah 
 
🧪 Acceptance Criteria 
ID 
Kriteria 
Validasi 
AC-1 
Nomor invoice unik 
Sistem auto generate dan tidak ada duplikasi 
AC-2 
Produk valid 
Hanya paket yang dimiliki klien yang bisa dipilih 
AC-3 
Status update 
Bisa diubah menjadi “Lunas” jika admin memverifikasi 
AC-4 
Filter berfungsi 
Tabel dapat difilter dinamis 
AC-5 
Kirim berhasil 
Email invoice diterima oleh klien 
AC-6 
PDF invoice 
tersedia 
Bisa diunduh dan terbaca dengan benar 
 
📦 Struktur Data 
{ 
  "id_invoice": "INV-20250611001", 
  "client_id": "uuid", 
  "tahun": 2025, 
  "produk": "Silver", 
  "nominal": 1200000, 


  "status": "Belum Lunas", 
  "catatan": "Invoice awal tahun", 
  "tanggal_buat": "2025-06-11", 
  "tanggal_bayar": null 
} 
 
🧩 Integrasi 
● Clients: invoice terkait ke client_id. 
● Products: invoice hanya bisa memilih produk yang telah diaktivasi untuk klien tersebut. 
● Dashboard: data invoice akan memengaruhi ringkasan klien dan pemasukan. 
● Notifications: status invoice bisa memicu notifikasi tagihan baru / jatuh tempo. 
 
📌 API Endpoint (Contoh) 
● POST /invoices – Tambah invoice 
● GET /invoices – Daftar semua invoice 
● GET /invoices/:id – Detail invoice 
● PUT /invoices/:id – Edit invoice 
● PATCH /invoices/:id/status – Ubah status Lunas 
● POST /invoices/:id/send – Kirim via email 
 
🧱 Komponen Front-End 
● InvoiceForm 
● InvoiceTable 
● InvoiceDetailModal 
● InvoicePDFRenderer 
● InvoiceFilterPanel 
● InvoiceStatusBadge
 


Menu User Management 
 
🧭 Tujuan Fitur 
Menu ini digunakan untuk mengelola pengguna (user) yang memiliki akses 
ke sistem dashboard koperasi/vendor. Fitur ini memberikan kontrol 
penuh kepada Super Admin untuk: 
● Menambah dan menghapus user baru. 
● Mengatur peran/role pengguna. 
● Mengelola email dan akun login. 
● Memberikan akses terbatas berdasarkan role. 
 
🎯 Objective 
● Super Admin dapat menambah user baru dengan email login. 
● Pengguna memiliki role tertentu yang membatasi akses dan fitur 
yang tersedia. 
● Admin bisa mengedit data user, reset password, dan menonaktifkan 
akun jika diperlukan. 
● Sistem menyimpan siapa yang menambahkan user serta waktu 
pembuatan. 
 
🖥 Fitur Tampilan UI 
A. Form Tambah User 
Field 
Tipe 
Keterangan 
Nama Lengkap 
Text 
Nama asli pengguna 
Email 
Email 
Digunakan untuk login 
Role 
Dropdow
n 
Super Admin / Admin / Operator 


Jabatan 
Text 
Opsional 
PIC 
Text 
Nama perusahaan/vendor (jika 
applicable) 
Password 
Passwor
d 
Dikirimkan ke email user 
Konfirmasi 
Password 
Passwor
d 
Validasi ulang 
Deskripsi 
Textare
a 
Informasi tambahan 
Status 
Switch 
Aktif / Tidak aktif 
Tombol: Simpan, Reset, Batal 
 
B. Tabel Daftar User 
No 
Nama 
Email 
Role 
Jabatan 
Status 
Aksi 
1 
Andi 
Pratama 
andi@email.c
om 
Admin 
Manager 
Operasional 
Aktif 
[Edit] 
[Nonaktifkan
] 
2 
Sari 
Dewi 
sari@domain.
com 
Opera
tor 
Customer 
Support 
Tidak 
Aktif 
[Aktifkan] 
[Hapus] 
 
C. Detail/Edit User 
Menampilkan informasi user lengkap, termasuk: 
● Data login 
● Riwayat aktivitas terakhir (jika diaktifkan) 
● Status akun 
● Role & otorisasi fitur 
 


⚙ Functional Requirements 
No 
Fungsi 
Deskripsi 
1 
Tambah User 
Super Admin dapat menambahkan user 
baru 
2 
Edit User 
Data user bisa diperbarui kecuali 
email 
3 
Role Based Access 
Sistem membatasi fitur berdasarkan 
role 
4 
Nonaktifkan / 
Aktifkan Akun 
Status bisa diubah oleh admin 
5 
Reset Password 
Kirim tautan reset ke email user 
6 
Hapus Akun 
Admin dapat menghapus user (dengan 
konfirmasi) 
7 
Validasi Email Unik 
Tidak boleh ada email duplikat dalam 
sistem 
 
🔐 Role Akses 
Role 
Akses 
Super 
Admin 
Tambah/Edit/Hapus user, Ubah 
role 
Admin 
Lihat user, tidak bisa ubah role 
Super Admin 
Operator 
Tidak memiliki akses ke menu ini 
 
🧪 Acceptance Criteria 
ID 
Kriteria 
Validasi 
AC-1 Email unik 
Sistem menolak input jika email 
sudah terdaftar 


AC-2 Role terlihat 
jelas 
Dropdown menampilkan daftar role 
yang valid 
AC-3 Nonaktifkan 
berhasil 
User tidak bisa login jika status 
tidak aktif 
AC-4 Reset Password 
Tautan reset dikirim ke email dengan 
OTP/Token 
AC-5 Data user dapat 
diedit 
Semua data editable kecuali email 
 
📦 Struktur Data 
{ 
  "user_id": "USR-20250611001", 
  "name": "Andi Pratama", 
  "email": "andi@email.com", 
  "role": "Admin", 
  "jabatan": "Manager Operasional", 
  "pic": "Vendor A", 
  "status": "Aktif", 
  "deskripsi": "Bertanggung jawab atas invoice dan klien", 
  "created_at": "2025-06-11T08:00:00Z", 
  "last_login": "2025-06-11T10:15:00Z" 
} 
 
🧩 Integrasi 
● Login System: data login user berasal dari sini. 
● Audit Log (Opsional): untuk mencatat siapa yang mengubah user. 
● Access Control: membatasi fitur berdasarkan role. 
● Notification: bisa trigger notifikasi saat user ditambahkan atau 
dinonaktifkan. 
 


📌 API Endpoint (Contoh) 
● POST /users – Tambah user 
● GET /users – List semua user 
● GET /users/:id – Detail user 
● PUT /users/:id – Update user 
● PATCH /users/:id/status – Aktifkan/Nonaktifkan 
● DELETE /users/:id – Hapus user 
● POST /users/reset-password – Kirim tautan reset password 
 
🧱 Komponen Front-End 
● UserForm 
● UserTable 
● UserDetailModal 
● UserStatusBadge 
● UserRoleSelector 
● PasswordResetDialog 
 


Menu Notifications 
 
🧭 Tujuan Fitur 
Menu Notifications berfungsi sebagai pusat pengumuman dan notifikasi 
sistem untuk pengguna dashboard. Notifikasi ini dapat digunakan untuk 
menyampaikan informasi penting terkait sistem, pembayaran, pembaruan 
fitur, jadwal maintenance, atau informasi teknis lainnya. 
 
🎯 Objective 
● Admin atau Super Admin dapat membuat dan mengelola pengumuman 
atau notifikasi. 
● Pengguna dapat melihat notifikasi terbaru saat login ke 
dashboard. 
● Setiap notifikasi memiliki tanggal, judul, isi, dan lampiran 
(opsional). 
● Notifikasi dapat diedit, dihapus, atau disimpan sebagai draft. 
 
🖥 Tampilan UI 
A. Form Tambah Notifikasi 
Field 
Tipe 
Keterangan 
Judul Notifikasi 
Text 
Maks. 100 karakter 
Tanggal 
Date 
Picker 
Tanggal publikasi 
Deskripsi 
Textarea 
Konten utama 
notifikasi 
Lampiran 
(Attachment) 
File 
Upload 
Opsional (pdf, jpg, 
png, docx) 


Status 
Dropdown 
Publish / Draft 
Tombol: Simpan, Simpan sebagai Draft, Reset, Batal 
 
B. Tabel Daftar Notifikasi 
No 
Judul 
Tanggal 
Statu
s 
Aksi 
1 
Jadwal 
Maintenance 
2025-06-
15 
Publi
sh 
[Edit] 
[Hapus] 
2 
Fitur Baru Paket 
Gold 
2025-06-
12 
Draft [Edit] 
[Publish] 
 
C. Detail Notifikasi (Popup/Preview) 
Menampilkan: 
● Judul 
● Tanggal 
● Isi lengkap 
● Link/lampiran download jika ada 
 
⚙ Functional Requirements 
No 
Fungsi 
Deskripsi 
1 
Tambah 
Notifikasi 
Buat notifikasi baru dengan isi 
dan lampiran 
2 
Edit 
Notifikasi 
Perbarui isi dan status 
3 
Hapus 
Notifikasi 
Hapus permanen (dengan 
konfirmasi) 


4 
Status Draft 
Simpan sebagai draft, tidak 
tampil di klien 
5 
Publish 
Notifikasi 
Setelah publish, akan terlihat 
oleh pengguna 
6 
Upload 
Attachment 
Dukung format: PDF, DOCX, JPG, 
PNG 
7 
Preview 
Lihat isi lengkap notifikasi 
tanpa edit 
8 
Role-based 
Akses 
Hanya Super Admin/Admin yang 
bisa kelola 
 
🔐 Role Akses 
Role 
Akses 
Super 
Admin 
Full access 
(buat/edit/hapus) 
Admin 
Buat dan edit 
notifikasi 
Operator/U
ser 
Hanya bisa membaca 
notifikasi 
 
🧪 Acceptance Criteria 
ID 
Kriteria 
Validasi 
AC-1 Judul tidak boleh kosong 
Validasi input 
AC-2 Status Draft tidak tampil ke 
pengguna biasa 
Validasi tampilan 
AC-3 Attachment berhasil diunduh 
File link aktif 


AC-4 Tanggal valid 
Tidak bisa input tanggal 
kosong 
AC-5 Role akses dibatasi 
User biasa tidak bisa 
tambah/edit/hapus 
 
📦 Struktur Data 
{ 
  "id": "NTF-20250611001", 
  "title": "Maintenance Server", 
  "description": "Akan ada pemeliharaan sistem pada tanggal 15 Juni 
pukul 22.00 WIB.", 
  "date": "2025-06-11", 
  "attachment_url": 
"https://app.domain.com/attachments/maintenance.pdf", 
  "status": "Publish", 
  "created_by": "admin@koperasi.com" 
} 
 
🔗 Integrasi 
● Dashboard User: notifikasi akan muncul pada halaman beranda 
pengguna. 
● Email (opsional): bisa dikembangkan untuk mengirim email saat 
notifikasi penting dipublish. 
● Log Aktivitas (opsional): mencatat siapa yang 
membuat/mengedit/hapus notifikasi. 
 
📌 API Endpoint (Contoh) 
● GET /notifications – Daftar semua notifikasi 
● GET /notifications/:id – Detail notifikasi 
● POST /notifications – Tambah notifikasi 


● PUT /notifications/:id – Edit notifikasi 
● DELETE /notifications/:id – Hapus 
● POST /notifications/:id/publish – Ubah status menjadi Publish 
 
🧱 Komponen Front-End 
● NotificationForm 
● NotificationTable 
● NotificationDetailModal 
● AttachmentUploader 
● StatusToggle 
 
🗂 Future Enhancement 
● Notifikasi berdasarkan jenis (sistem, tagihan, produk, dll). 
● Push notification atau alert bar di dashboard. 
● Riwayat pengiriman notifikasi ke pengguna.
 


Menu Trouble Tickets (Dashboard Vendor) 
 
🧭 Tujuan Fitur 
Memberikan akses bagi vendor untuk melihat, memantau, dan menangani 
Trouble Tickets yang diajukan oleh klien, tanpa bisa membuat tiket 
baru. Vendor hanya berperan sebagai responder/handler. 
 
🎯 Objective 
● Vendor dapat melihat daftar tiket dari semua klien. 
● Vendor dapat membaca detail keluhan, memberi respon, mengubah 
status, dan melampirkan solusi. 
● Semua perubahan terekam dalam log aktifitas tiket. 
● Tiket ditautkan dengan klien dan produk yang aktif. 
 
🖥 Tampilan UI 
A. Daftar Trouble Tickets 
N
o 
No. 
Tiket 
Klien 
Kateg
ori 
Produ
k 
Prior
itas 
Stat
us 
Tanggal 
Masuk 
Aksi 
1 
#TT-2025
06-01 
Koperasi 
Maju 
Tekni
s 
Bronz
e 
Mediu
m 
Open 11-06-202
5 
[Lihat 
Detail] 
● Filter: Berdasarkan Klien, Kategori, Prioritas, Status, Produk 
● Sorting: Berdasarkan Tanggal Masuk, Prioritas, Status 
 
B. Halaman Detail Tiket 
Informasi yang ditampilkan: 
● Nomor Tiket: #TT-202506-01 


● Klien: Koperasi Maju Sejahtera 
● Produk Aktif: Bronze 
● Kategori: Teknis 
● Prioritas: Medium 
● Judul: Tidak Bisa Akses Modul Keuangan 
● Deskripsi: "Klien tidak bisa mengakses menu keuangan sejak update 
terakhir." 
● Lampiran (jika ada): Link unduhan 
 
Aksi Vendor: 
Action 
Keterangan 
Ubah Status 
Open, On Progress, Pending, 
Closed 
Kirim Balasan 
Textarea untuk respon dari 
Vendor 
Upload 
Attachment 
(opsional) Kirim screenshot, 
dokumen solusi 
Lihat Riwayat 
Semua log perubahan dan komentar 
terkait 
 
⚙ Functional Requirements 
No 
Fungsi 
Deskripsi 
1 
Lihat Semua 
Tiket 
Vendor bisa melihat semua tiket dari 
semua klien 
2 
Filter Tiket 
Berdasarkan status, prioritas, kategori, 
klien, tanggal 
3 
Update Status 
Tiket 
Vendor mengatur status tiket secara 
manual 
4 
Beri Respon 
Vendor dapat memberi respon teks (balasan 
teknis) 


5 
Log Aktivitas 
Tiket 
Setiap update status/respon tercatat 
otomatis 
6 
Upload File 
Solusi 
Vendor bisa melampirkan file (screenshot, 
instruksi PDF) 
 
🧩 Role Akses 
Role 
Akses 
Super Admin 
Vendor 
Full access ke semua tiket 
Support Agent 
Hanya akses tiket yang ditugaskan 
(opsional) 
Klien 
Tidak bisa akses dashboard vendor, hanya 
dari sisi klien 
 
✅ Acceptance Criteria 
ID 
Kriteria 
Validasi 
AC-1 Vendor tidak bisa membuat tiket 
baru 
Tidak ada tombol "Buat 
Tiket" 
AC-2 Semua respon tercatat sebagai 
log 
Log tercatat dengan 
timestamp & user 
AC-3 Status hanya bisa diubah dari 
Vendor 
Validasi peran 
AC-4 File attachment bisa diunduh & 
diunggah 
Fungsi upload dan download 
aktif 
AC-5 Tiket hanya ditautkan ke produk 
aktif klien 
Validasi sistem produk 
 
🗂 Contoh Struktur Data Tiket (Read-Only for Klien) 
{ 


  "ticket_id": "TT-202506-001", 
  "client": { 
    "name": "Koperasi Maju", 
    "id": "CL-003" 
  }, 
  "product": "Bronze", 
  "category": "Teknis", 
  "priority": "Medium", 
  "title": "Tidak Bisa Akses Modul Keuangan", 
  "description": "Setelah update, menu keuangan error 404.", 
  "status": "On Progress", 
  "logs": [ 
    { 
      "datetime": "2025-06-11T08:00", 
      "action": "Tiket Dibuat oleh Klien", 
      "by": "admin@koperasi.com" 
    }, 
    { 
      "datetime": "2025-06-11T10:45", 
      "action": "Status diubah menjadi On Progress", 
      "by": "support@vendor.com" 
    }, 
    { 
      "datetime": "2025-06-11T11:00", 
      "action": "Respon dikirim: 'Kami sedang periksa bug pada modul 
keuangan...'", 
      "by": "support@vendor.com" 
    } 
  ] 
} 
 
🔔 Integrasi 
Modul 
Fungsi 
Notifications 
Vendor diberi notifikasi saat tiket 
masuk & update baru 


Clients 
Tiket ditautkan otomatis ke klien & 
produk aktif 
User 
Management 
Kontrol siapa yang bisa menangani tiket 
 
🧱 Komponen UI (Front-end) 
● TicketTable.vue 
● TicketDetail.vue 
● TicketResponseForm.vue 
● TicketLog.vue 
 
📌 Future Enhancements 
● Penugasan otomatis ke agent berdasarkan kategori 
● SLA Tracker (lama waktu tanggapan) 
● Dashboard statistik Trouble Tickets (jumlah masuk, status, lama 
rata-rata respon)
 


 
