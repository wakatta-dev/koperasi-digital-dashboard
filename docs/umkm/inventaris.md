# Inventaris

**Path:** `/umkm/inventaris`

**Deskripsi:** Halaman untuk mengelola daftar produk, stok, dan informasi inventaris.

**Komponen Utama:**
- Kartu statistik total produk, ketersediaan, stok rendah, dan stok habis.
- Pencarian serta filter kategori dan status.
- Tabel produk dengan detail stok, harga, status, dan aksi.

**Endpoint:** `GET /api/umkm/inventory`

**Format Data:**
```json
{
  "stats": {
    "totalProduk": 0,
    "ketersediaan": 0,
    "stokRendah": 0,
    "stokHabis": 0
  },
  "produk": [
    { "id": 1, "nama": "Produk A", "stok": 10, "harga": 10000, "status": "aktif" }
  ]
}
```
