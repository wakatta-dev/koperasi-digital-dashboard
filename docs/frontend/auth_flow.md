# Authentication Flow

## Login
- **Endpoint**: `POST /auth/login`
- **Request Body** (`LoginRequest`):
  ```json
  {
    "email": "user@example.com",
    "password": "secret"
  }
  ```
- **Response** (`LoginResponse`):
  ```json
  {
    "access_token": "<jwt>",
    "refresh_token": "<token>"
  }
  ```
- **Alur**: Handler mem-parse body, melakukan validasi, lalu memanggil service untuk verifikasi kredensial dan pembuatan JWT. Jika body atau validasi salah → 400. Jika kredensial salah → 401.

## Refresh Token
- **Endpoint**: `POST /auth/refresh`
- **Request Body** (`RefreshRequest`):
  ```json
  {
    "refresh_token": "<token>"
  }
  ```
- **Response** (`RefreshResponse`):
  ```json
  {
    "access_token": "<jwt>"
  }
  ```
- **Alur**: Handler memvalidasi refresh token dan masa berlakunya. Jika token invalid atau kedaluwarsa → 401.

## Logout
- **Endpoint**: `POST /auth/logout`
- **Request Body** (`RefreshRequest`): sama seperti di atas.
- **Response**:
  ```json
  {
    "message": "logged out"
  }
  ```
- **Alur**: Handler menghapus refresh token dari database.

## Contoh TypeScript (Next.js)
```ts
// services/auth.ts
import { cookies } from 'next/headers';

let accessToken: string | null = null;

export async function login(email: string, password: string) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  cookies().set('refresh_token', data.refresh_token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });
  accessToken = data.access_token;
  return data;
}

export async function logout() {
  const rt = cookies().get('refresh_token')?.value;
  await fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: rt }),
  });
  accessToken = null;
  cookies().delete('refresh_token');
}
```

### Penyimpanan Token
- Refresh token disimpan di cookie **HttpOnly** agar tidak dapat diakses JavaScript (mencegah XSS).
- Access token disimpan di memori/State dan dikirim lewat header `Authorization`.

## Refresh Otomatis
```ts
// utils/authFetch.ts
import { cookies } from 'next/headers';

let accessToken: string | null = null;

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  init.headers = {
    ...(init.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  };
  let res = await fetch(input, init);
  if (res.status === 401) {
    const rt = cookies().get('refresh_token')?.value;
    const r = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
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

## Penanganan Error Umum
| Kode | Skenario | Penanganan UI |
|------|----------|---------------|
| 400 Bad Request | Body tidak valid atau validasi gagal | Tampilkan pesan validasi pada form dan sorot field bermasalah |
| 401 Unauthorized | Kredensial salah, access token kedaluwarsa, atau refresh token invalid | Redirect ke halaman login atau tampilkan toast \"Session expired/Invalid credentials\" |

