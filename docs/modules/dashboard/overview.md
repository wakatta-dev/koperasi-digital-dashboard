# Modul Dashboard

Modul **Dashboard** menyediakan ringkasan data operasional untuk dua tipe pengguna:

1. **Admin Koperasi** – melihat kondisi keanggotaan dan keuangan koperasi.
2. **Penyedia Layanan (Owner)** – memantau status seluruh klien SaaS.

Semua endpoint berada di bawah prefix `/api/dashboard` dan membutuhkan autentikasi **Bearer**.

## Endpoint

### GET `/api/dashboard/summary/client`
Menampilkan ringkasan metrik koperasi.

**Query**
- `start` dan `end` (RFC3339, opsional). Jika kosong menggunakan 30 hari terakhir.

**Response**
```json
{
  "data": {
    "active_members": {"amount": 0, "change": 0},
    "total_savings": {"amount": 0, "change": 0},
    "active_loans": {"amount": 0, "change": 0},
    "current_year_shu": {"amount": 0, "change": 0}
  }
}
```

**Sumber Data**
- `members` untuk jumlah anggota aktif,
- `savings` untuk total saldo simpanan,
- `loans` untuk total pinjaman berstatus aktif,
- `allocations` dan `distributions` untuk sisa SHU tahun berjalan.

### GET `/api/dashboard/summary/owner`
Ringkasan untuk penyedia layanan.

**Response**
```json
{
  "data": {
    "clients_per_tier": {"Standard": 0},
    "open_tickets": 0,
    "most_active_client": "",
    "top_ticket_product": {"name": "", "tickets": 0},
    "invoice_status": {"lunas": 0, "belum_lunas": 0},
    "active_notifications": 0
  }
}
```

**Sumber Data**
- `clients`, `invoices`, `products` untuk distribusi klien dan tiket,
- `trouble_tickets` untuk tiket terbuka dan aktivitas,
- `notifications` untuk hitungan notifikasi aktif.

## Catatan
Usecase akan menghitung persentase perubahan dibandingkan periode sebelumnya. Jika data periode sebelumnya nol, perubahan diasumsikan `0`.
