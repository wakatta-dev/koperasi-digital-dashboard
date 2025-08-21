# Module Per Tenant

## 📦 Daftar Modul per Tenant

### 1. **Vendor**

(Fokus ke pengelolaan klien SaaS, produk, billing, support)

- Dashboard Vendor
- Products (paket & add-on)
- Clients (data koperasi/UMKM/BUMDes)
- Invoices (tagihan & pembayaran)
- User Management (Super Admin, Admin, Operator)
- Notifications (pengumuman sistem)
- Trouble Tickets (support/keluhan klien)

---

### 2. **Koperasi**

(Modul koperasi simpan-pinjam, anggota, SHU, RAT, dsb)

- Dashboard Koperasi
- Manajemen Keanggotaan
- Kartu Anggota Digital
- Simpanan (Konvensional & Syariah)
- Pinjaman (Konvensional)
- Pembiayaan Syariah (Murabahah, Mudharabah, Musyarakah, Ijarah)
- Manajemen SHU
- Rapat Anggota Tahunan (RAT) & Voting Digital
- Transaksi Koperasi (kas masuk/keluar)
- Laporan Keuangan:
    - Neraca
    - Laba Rugi
    - Arus Kas
- Manajemen Aset & Penyusutan
- Notifikasi & Reminder
- Pengaturan Sistem & Role Access
- Tagihan & Produk Add-ons (langganan SaaS)
- Live Chat Support & Billing
- Landing Page & Kustomisasi Tema

---

### 3. **UMKM**

(Fokus ke operasional toko/ritel)

- Dashboard UMKM
- Manajemen Akun & Roles
- Manajemen Modul & Langganan
- Inventaris (produk & stok)
- Kasir (POS)
- Marketplace (toko online)
- Laporan (penjualan, keuangan)
- Landing Page Publik
- Manajemen Harga Bertingkat

---

### 4. **BUMDes**

(Fokus ke multi-unit usaha desa & penyewaan)

- Dashboard BUMDes
- Manajemen Unit Usaha Terpisah
- Manajemen Aset & Jadwal Sewa
- Inventaris (per unit)
- Kasir (POS)
- Marketplace (toko online per unit)
- Laporan Keuangan (per unit & konsolidasi)
- Landing Page Publik

---

## 📊 Rekomendasi Penyimpanan di Database

Buat tabel `modules` dengan kolom:

```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenant_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id INT NOT NULL REFERENCES tenants(id),
    module_id UUID NOT NULL REFERENCES modules(id),
    status VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

```

Contoh seed data:

| tenant_type | module_code |
| --- | --- |
| vendor | dashboard_vendor |
| vendor | products |
| koperasi | simpanan |
| koperasi | pinjaman |
| umkm | pos |
| umkm | marketplace |
| bumdes | unit_usaha |
| bumdes | sewa_aset |

---

Mau gw bikinin juga versi **seed data SQL lengkap** buat semua tenant dengan mapping modul → tenant, biar langsung bisa lu insert ke database?