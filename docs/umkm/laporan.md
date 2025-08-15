# Laporan

**Path:** `/umkm/laporan`

**Deskripsi:** Halaman analisis penjualan dan performa usaha.

**Komponen Utama:**
- Kartu ringkasan pendapatan dan transaksi untuk berbagai periode.
- Grafik tren penjualan dan distribusi kategori produk.
- Daftar produk terlaris beserta tren penjualan.

**Endpoint:** `GET /api/umkm/reports/sales`

**Format Data:**
```json
{
  "ringkasan": {
    "pendapatan": { "harian": 0, "bulanan": 0 },
    "transaksi": { "harian": 0, "bulanan": 0 }
  },
  "trenPenjualan": [
    { "tanggal": "2024-01-01", "total": 0 }
  ],
  "produkTerlaris": [
    { "id": 1, "nama": "Produk A", "total": 0 }
  ]
}
```
