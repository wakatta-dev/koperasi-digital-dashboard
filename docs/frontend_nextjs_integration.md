# Panduan Integrasi Frontend Next.js

Dokumen ini menjelaskan langkah‑langkah untuk mengintegrasikan aplikasi frontend yang dikembangkan dengan **Next.js** ke dalam backend Koperasi Digital.

## 1. Prasyarat

- Node.js dan npm terpasang di mesin pengembangan.
- Akses ke kode sumber backend dan jalur endpoint API.
- Backend Koperasi Digital berjalan secara lokal atau di server.

## 2. Menjalankan Backend

Backend dapat dijalankan secara lokal menggunakan perintah:

```bash
make run
```

Pastikan service berjalan dan dapat diakses pada alamat yang akan digunakan oleh frontend, misalnya `http://localhost:8000`.

## 3. Membuat Proyek Next.js

1. Inisialisasi proyek:
   ```bash
   npx create-next-app@latest koperasi-frontend
   cd koperasi-frontend
   ```
2. Install dependensi untuk komunikasi API:
   ```bash
   npm install axios
   ```

## 4. Konfigurasi Lingkungan

Buat file `.env.local` di root proyek Next.js dan tambahkan variabel:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Variabel ini akan digunakan sebagai base URL untuk seluruh permintaan ke backend.

## 5. Membuat Client API

Buat folder `services` lalu file `api.ts` atau `api.js`:

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 6. Autentikasi

Contoh fungsi login menggunakan endpoint `POST /auth/login`:

```ts
import api from '@/services/api';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', data.token);
  return data;
}
```

Gunakan token yang tersimpan untuk setiap permintaan selanjutnya.

## 7. Pemanggilan API di Next.js

**Client Side:**

```ts
import api from '@/services/api';
import { useEffect, useState } from 'react';

export default function Members() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    api.get('/members').then((res) => setMembers(res.data));
  }, []);

  return (
    <ul>
      {members.map((m: any) => (
        <li key={m.id}>{m.name}</li>
      ))}
    </ul>
  );
}
```

**Server Side Rendering:**

```ts
export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`);
  const members = await res.json();
  return { props: { members } };
}
```

## 8. Penanganan Error

Tambahkan interceptor respon untuk mengelola error global:

```ts
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token tidak valid atau kadaluarsa
      localStorage.removeItem('accessToken');
      // opsional: redirect ke halaman login
    }
    return Promise.reject(err);
  }
);
```

## 9. Referensi Endpoint

Daftar lengkap endpoint tersedia di [docs/api-enpoints-list.md](api-enpoints-list.md) atau melalui file Swagger (`docs/swagger.yaml`).

## 10. Menjalankan Aplikasi

Jalankan server pengembangan Next.js:

```bash
npm run dev
```

Akses aplikasi melalui `http://localhost:3000` dan pastikan komunikasi dengan backend berjalan dengan baik.

---

Dokumen ini dapat dikembangkan lebih lanjut sesuai kebutuhan modul atau perubahan pada API backend.

