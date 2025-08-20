# Refresh Token Workflow

Dokumen ini menjelaskan alur kerja refresh token pada proyek ini serta panduan implementasi di sisi klien menggunakan Next.js.

## Alur Backend

1. **Login**
   - Endpoint: `POST /api/auth/login`
   - Validasi kredensial pengguna.
   - Jika sukses, server mengembalikan `access_token` dan `refresh_token`.
   - Refresh token disimpan di tabel `refresh_tokens` dengan kolom unik `user_id`. Login ulang akan mengganti token sebelumnya untuk pengguna yang sama.

2. **Penyimpanan Refresh Token**
   - Tabel `refresh_tokens` memiliki skema:
     ```sql
     CREATE TABLE refresh_tokens (
         token VARCHAR(64) PRIMARY KEY,
         user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         expires_at TIMESTAMP NOT NULL,
         UNIQUE (user_id)
     );
     ```
   - Setiap pengguna hanya memiliki satu refresh token aktif.
   - Kolom `expires_at` menentukan masa berlaku token.

3. **Refresh Token**
   - Endpoint: `POST /api/auth/refresh`
   - Server mencari token di database tanpa memeriksa masa berlaku pada query.
   - Jika token kedaluwarsa (`expires_at` < sekarang), token dihapus dan permintaan ditolak.
   - Jika valid, server membuat `access_token` baru dan mengembalikannya.

4. **Logout**
   - Endpoint: `POST /api/auth/logout`
   - Refresh token dihapus dari database.

## Implementasi Klien (Next.js)

Berikut contoh sederhana untuk mengelola autentikasi dengan refresh token.

### Login
```ts
// services/auth.ts
export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  // simpan refresh token (misal di cookie HttpOnly) dan access token di memory/state
  return data;
}
```

### Refresh Otomatis
```ts
// utils/fetcher.ts
let accessToken: string | null = null;

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  init.headers = {
    ...(init.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : ''
  };
  let res = await fetch(input, init);
  if (res.status === 401) {
    const r = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: getRefreshTokenFromCookie() })
    });
    if (r.ok) {
      const d = await r.json();
      accessToken = d.access_token;
      init.headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(input, init); // ulangi request
    }
  }
  return res;
}
```

### Alternatif: Axios Interceptor

Contoh berikut menggunakan **axios** dengan interceptor untuk memperbarui
`access_token` ketika server mengembalikan status `401`.

```ts
// services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

let accessToken: string | null = null;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (accessToken) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && error.config && !error.config.headers?.['x-retry']) {
      const r = await axios.post(
        '/api/auth/refresh',
        { refresh_token: getRefreshTokenFromCookie() },
        { baseURL: api.defaults.baseURL }
      );
      accessToken = r.data.access_token;
      error.config.headers = {
        ...(error.config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        'x-retry': 'true',
      };
      return api(error.config); // ulangi request
    }
    return Promise.reject(error);
  }
);

function getRefreshTokenFromCookie(): string {
  // Implementasi mendapatkan refresh token dari cookie sesuai kebutuhan
  return '';
}
```

### Modul Layanan Terpusat

Gunakan berkas `services/api.ts` di atas sebagai pusat pemanggilan endpoint.
Modul-modul layanan lain dapat mengimpor instance `api` ini sehingga seluruh
permintaan otomatis menyertakan token dan mekanisme refresh.

```ts
// hooks/useUsers.ts
import useSWR from 'swr';
import { api } from '../services/api';

export function useUsers() {
  const { data, error, mutate } = useSWR('/api/users', async (url: string) => {
    const res = await api.get(url);
    return res.data;
  });

  return { users: data, isLoading: !data && !error, isError: error, mutate };
}
```

### Konfigurasi Base URL

`NEXT_PUBLIC_API_URL` dapat didefinisikan di `.env.local` agar
axios menggunakan alamat yang sesuai:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Logout
```ts
export async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: getRefreshTokenFromCookie() })
  });
  accessToken = null;
  clearRefreshTokenCookie();
}
```

Pada contoh di atas, refresh token disimpan dalam cookie HttpOnly agar tidak dapat diakses oleh JavaScript dan dikirim otomatis pada permintaan refresh.

## Catatan
- Access token memiliki masa berlaku pendek (konfigurasi `JWT_ACCESS_TTL`).
- Refresh token berlaku lebih lama (24 jam pada implementasi saat ini).
- Login ulang akan menginvalidasi refresh token sebelumnya.
