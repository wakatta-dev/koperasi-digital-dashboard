# Pengaturan

**Path:** `/umkm/pengaturan`

**Deskripsi:** Halaman untuk mengatur informasi usaha, preferensi POS, notifikasi, metode pembayaran, dan keamanan.

**Komponen Utama:**
- Formulir informasi usaha (nama, pemilik, kontak, alamat).
- Pengaturan POS seperti cetak struk otomatis dan tarif pajak.
- Pengaturan notifikasi stok, laporan, dan pengingat pembayaran.
- Daftar metode pembayaran yang didukung.
- Formulir pengubahan kata sandi.

**Endpoint:** `GET /api/umkm/settings`

**Format Data:**
```json
{
  "usaha": {
    "nama": "Toko A",
    "pemilik": "Budi",
    "kontak": "08123",
    "alamat": "Jl. Contoh"
  },
  "pos": { "cetakStruk": true, "tarifPajak": 10 },
  "notifikasi": { "stok": true, "laporan": true, "pengingatPembayaran": true },
  "pembayaran": ["tunai", "transfer"],
  "keamanan": { "lastChange": "2024-01-01" }
}
```
