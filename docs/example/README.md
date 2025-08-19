# Next.js Login & Users Example

Contoh ini menunjukkan integrasi Next.js (TypeScript) dengan backend Koperasi Digital.

## Menjalankan
1. Jalankan backend:
   ```bash
   make run
   ```
   Pastikan server berjalan di `http://localhost:8080`.
2. Jalankan aplikasi Next.js (di dalam proyek Next.js yang berisi contoh halaman ini):
   ```bash
   npm install
   npm run dev
   ```
3. Buka `http://localhost:3000/login`.
4. Login menggunakan akun yang valid. Setelah berhasil, akan diarahkan ke `/users` yang menampilkan daftar pengguna dan tombol `Next` untuk pagination.
