# POS

**Path:** `/umkm/pos`

**Deskripsi:** Halaman Point of Sale untuk proses transaksi penjualan.

**Komponen Utama:**
- Daftar produk dengan fitur pencarian.
- Keranjang belanja dengan kontrol kuantitas dan penghapusan item.
- Ringkasan pembayaran mencakup subtotal, pajak, dan total.
- Tombol pembayaran tunai dan non-tunai serta opsi simpan draft.

**Endpoint:**
- `GET /api/umkm/pos/products`
- `POST /api/umkm/pos/checkout`

**Format Data (Produk):**
```json
[
  { "id": 1, "nama": "Produk A", "harga": 10000, "stok": 5 }
]
```

**Format Data (Checkout):**
```json
{
  "items": [
    { "id": 1, "qty": 2, "harga": 10000 }
  ],
  "subtotal": 20000,
  "pajak": 2000,
  "total": 22000,
  "metodePembayaran": "tunai"
}
```
