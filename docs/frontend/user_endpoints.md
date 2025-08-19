# Ringkasan Endpoint Pengguna

| Metode & Path | Payload | Response |
| --- | --- | --- |
| `POST /users/` | `CreateUserRequest`<br>`role_id`, `email`, `password`, `full_name` | Objek pengguna baru (`auth.User`) |
| `GET /users/` | – | Daftar pengguna (`[]auth.User`) |
| `GET /users/:id` | – | Detail pengguna (`auth.User`); 404 jika tidak ada |
| `PUT /users/:id` | `UpdateUserRequest`<br>`role_id`, `full_name` | Pengguna setelah diperbarui (`auth.User`) |
| `PATCH /users/:id/status` | `UpdateStatusRequest`<br>`status` (boolean) | Status terbaru (`{"status": bool}`) |
| `DELETE /users/:id` | – | Konfirmasi penghapusan (`{"id": int}`) |
| `POST /users/reset-password` | `ResetPasswordRequest`<br>`email`, `new_password` | Pesan konfirmasi (`{"message": "password reset"}`) |

## Contoh Fungsi Next.js
```ts
// utils/api/users.ts
const headers = { 'Content-Type': 'application/json' };

export async function createUser(data) {
  const res = await fetch('/api/users', {
    method: 'POST', headers, body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function listUsers() {
  const res = await fetch('/api/users');
  return handleResponse(res);
}

export async function getUser(id: number) {
  const res = await fetch(`/api/users/${id}`);
  return handleResponse(res);
}

export async function updateUser(id: number, data) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT', headers, body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateStatus(id: number, status: boolean) {
  const res = await fetch(`/api/users/${id}/status`, {
    method: 'PATCH', headers, body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function resetPassword(data) {
  const res = await fetch('/api/users/reset-password', {
    method: 'POST', headers, body: JSON.stringify(data),
  });
  return handleResponse(res);
}

async function handleResponse(res: Response) {
  const json = await res.json();
  if (!res.ok) throw json; // pemanggil bisa membaca json.errors atau json.message
  return json;
}
```

## Penanganan Error Umum
- **Validation error (400)**: response berisi `errors` dengan daftar kesalahan per field.
  ```ts
  try {
    await createUser(formData);
  } catch (err) {
    setErrors(err.errors); // { field: ["message"] }
  }
  ```
- **404 Not Found**: muncul saat data tidak ditemukan (misal `GET /users/:id`).
  ```ts
  try {
    await getUser(id);
  } catch (err) {
    if (err.message === 'not found') router.push('/users');
  }
  ```
