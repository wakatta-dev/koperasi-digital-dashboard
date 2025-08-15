# Dashboard

**Path:** `/umkm/dashboard`

**Deskripsi:** Halaman beranda UMKM yang menampilkan ringkasan penjualan, stok, dan aktivitas terbaru.

**Komponen Utama:**
- Kartu statistik penjualan, total produk, transaksi, dan stok menipis.
- Daftar transaksi terbaru.
- Aksi cepat ke POS, Inventaris, Harga Bertingkat, dan Laporan.
- Peringatan produk dengan stok rendah.

**Endpoint:** `GET /api/umkm/dashboard`

**Format Data:**
```json
{
  "stats": {
    "penjualan": 0,
    "produk": 0,
    "transaksi": 0,
    "stokMenipis": 0
  },
  "transaksiTerbaru": [
    { "id": 1, "tanggal": "2024-01-01", "total": 0 }
  ],
  "stokRendah": [
    { "id": 1, "nama": "Produk A", "stok": 0 }
  ]
}
```
