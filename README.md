# Koperasi Digital Dashboard

Dashboard web untuk manajemen modul koperasi digital.
Aplikasi ini dibangun menggunakan [Next.js](https://nextjs.org) dan
mengonsumsi API backend untuk fitur seperti keanggotaan dan billing.

## Dokumentasi Produk
Spesifikasi kebutuhan dashboard tersedia pada dokumen berikut:

- [docs/prd_dashboard_koperasi.md](docs/prd_dashboard_koperasi.md)
- [docs/prd_dashboard_billing.md](docs/prd_dashboard_billing.md)

Gunakan dokumen PRD tersebut sebagai acuan saat mengembangkan fitur baru.

## Rute Aplikasi
Dashboard menyediakan rute awal untuk modul-modul berikut:

- `/members` – manajemen keanggotaan
- `/savings` – manajemen simpanan non-syariah
- `/savings/syariah` – manajemen simpanan syariah
- `/loans` – manajemen pinjaman non-syariah
- `/financing` – pembiayaan syariah
- `/shu` – manajemen Sisa Hasil Usaha
- `/rat` – rapat anggota tahunan
- `/assets` – manajemen aset koperasi
- `/transactions` – manajemen transaksi
- `/notifications` – notifikasi internal
- `/billing` – modul penagihan langganan

## Menjalankan Aplikasi
1. Install dependensi:
   ```bash
   npm install
   ```
2. Siapkan file `.env.local` dengan variabel:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Skrip Tambahan
- `npm run build` – build produksi
- `npm run start` – menjalankan hasil build
- `npm run lint` – menjalankan pemeriksaan kode

