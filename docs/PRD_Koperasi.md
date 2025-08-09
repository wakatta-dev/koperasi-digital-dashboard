## 📦 [PRD] PWA Koperasi Serba Usaha (KSU)

---

### Modul Simpanan (Konvensional & Syariah)

**Product Name:** PWA KSU - Modul Simpanan  
**Product Manager:** Yosh Wakatta  
**Shipping Date:** 31 Juli 2026 (Estimasi)  
**Stage:** Development  
**Status:** In progress  
**Teams:** Designer, Developer ([BE], [FE]), QA Tester

---

#### 1. Description

Modul ini menyediakan fitur simpanan konvensional dan syariah:

- **Konvensional**: Simpanan Pokok, Simpanan Wajib, Simpanan Sukarela  
- **Syariah**:
  - Simpanan Pokok (Wadiah Yad Dhamanah)
  - Simpanan Wajib (Wadiah Yad Dhamanah)
  - Simpanan Sukarela (Mudharabah Muthlaqah)

---

#### 2. Objectives & Success Metrics

**Objectives:**

- Meningkatkan transparansi
- Meningkatkan partisipasi anggota
- Kepatuhan Syariah
- Efisiensi admin

**Success Metrics:**

- Tingkat kepuasan anggota
- Tingkat kepatuhan setoran
- Partisipasi dalam simpanan sukarela

---

#### 3. Features

1. **Dashboard Simpanan Anggota**
2. **Rincian per Jenis Simpanan**
3. **Riwayat Transaksi**
4. **Alur Setoran Simpanan** (Digital/Manual)
5. **Alur Penarikan Simpanan** (hanya Simpanan Sukarela)
6. **Fitur Sisi Admin/Pengelola Koperasi**

---

#### 4. Use Case

| Aktor | Konvensional | Syariah |
|-------|--------------|---------|
| Anggota Baru | Setor Pokok & Wajib via QRIS | Setor Pokok (Wadiah) via transfer |
| Anggota Aktif | Lihat riwayat dan tambah Simpanan Sukarela | Lihat riwayat Wadiah & Bagi Hasil |
| Admin | Input setoran & cetak bukti | Verifikasi & distribusi bagi hasil |

---

#### 5. Dependencies

- Database simpanan
- Sistem keuangan & admin KSU
- Integrasi payment gateway

---

#### 6. Requirements

- **Transparansi Informasi Simpanan**
- **Kemudahan Transaksi**
- **Manajemen oleh Admin**

---

### Modul Pinjaman & Pembiayaan Syariah

**Product Name:** PWA KSU - Modul Pinjaman & Pembiayaan Syariah  
**Shipping Date:** 30 September 2026 (Estimasi)  
**Stage:** Development  
**Status:** In progress

---

#### 1. Description

- **Konvensional**: Pinjaman dengan bunga
- **Syariah**: Akad Murabahah, Mudharabah, Musyarakah, Ijarah

---

#### 2. Objectives & Success Metrics

**Objectives:**

- Akses pembiayaan cepat & transparan
- Otomatisasi proses
- Kepatuhan Syariah
- Tingkatkan kepatuhan pembayaran

**Success Metrics:**

- Jumlah pembiayaan berhasil
- Tingkat kelancaran pembayaran
- Rata-rata waktu proses
- Kepuasan anggota

---

#### 3. Features

1. **Pengajuan Online** (+ pilihan akad Syariah)
2. **Analisis & Penilaian Risiko Otomatis**
3. **Alur Persetujuan Digital**
4. **Akad & Tanda Tangan Digital**
5. **Pencairan Dana & Manajemen Angsuran**
6. **Monitoring & Pelaporan**

---

#### 4. Use Case

| Aktor | Konvensional | Syariah |
|-------|--------------|---------|
| Anggota | Ajukan pinjaman, tanda tangan OTP | Ajukan akad Murabahah |
| Admin | Review dokumen & setujui | Proses pembelian barang |

---

#### 5. Dependencies

- Database pinjaman
- Sistem keuangan & admin
- Payment gateway

---

#### 6. Requirements

- **Pengajuan & Persetujuan Digital**
- **Transparansi Informasi Pinjaman**
- **Kemudahan Pembayaran**

---

### Modul Pembagian Sisa Hasil Usaha (SHU)

**Product Name:** PWA KSU - Modul Pembagian SHU  
**Shipping Date:** 31 Agustus 2026 (Estimasi)  
**Stage:** Scoping & Design  
**Status:** To Do

---

#### 1. Description

Fitur pembagian SHU tahunan secara otomatis, transparan, dan sesuai AD/ART.

---

#### 2. Objectives & Success Metrics

**Objectives:**

- Transparansi perhitungan SHU
- Akses riwayat SHU oleh anggota
- Otomatisasi proses distribusi SHU

**Success Metrics:**

- Pemahaman anggota
- Kepuasan terhadap transparansi
- Pengurangan waktu kerja manual

---

#### 3. Features

##### 3.1. Sisi Anggota

- Informasi edukasi SHU
- Riwayat penerimaan SHU

##### 3.2. Sisi Admin

- Input & alokasi total SHU
- Kalkulasi otomatis
- Review & finalisasi
- Distribusi digital (ditambah ke Simpanan Sukarela)

---

#### 4. Use Case

1. Anggota membandingkan SHU dua tahun
2. Admin mendistribusikan SHU setelah RAT

---

#### 5. Dependencies

- Database keuangan
- Data historis dari Simpanan & Pinjaman

---

#### 6. Requirements

- **Transparansi SHU**
- **Kalkulasi SHU oleh Admin**
- **Distribusi Digital**

---

### Modul Manajemen Anggota

**Product Name:** PWA KSU - Modul Manajemen Keanggotaan  
**Shipping Date:** 31 Mei 2026 (Estimasi)  
**Stage:** Development  
**Status:** In progress

---

#### 1. Description

Mengelola seluruh siklus keanggotaan: pendaftaran, profil, kontribusi, dan status keaktifan.

---

#### 2. Objectives & Success Metrics

**Objectives:**

- Pendaftaran online cepat
- Profil anggota terpusat dan up-to-date
- Admin dapat mengelola status keanggotaan

**Success Metrics:**

- Waktu rata-rata pendaftaran
- Jumlah pembaruan profil
- Kepuasan transparansi

---

#### 3. Features

##### 3.1. Alur Pendaftaran Online

- Form digital + verifikasi kontak
- Setor awal (pokok + wajib)
- Antrean verifikasi admin

##### 3.2. Halaman Profil Anggota

- Data pribadi, kontribusi (Simpanan, Pinjaman, SHU)
- Hak & kewajiban

##### 3.3. Dashboard Admin

- Daftar anggota + filter status
- Verifikasi pendaftar baru
- Manajemen status aktif/tidak aktif

---

#### 4. Use Case

1. Pendaftaran online
2. Pembaruan data anggota

---

#### 5. Dependencies

- Database anggota
- Integrasi dengan modul lain (Simpanan, Pinjaman, SHU)

---

#### 6. Requirements

- **Pendaftaran Online**
- **Profil Anggota Lengkap**
- **Manajemen Status Keanggotaan**


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