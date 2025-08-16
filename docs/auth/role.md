# Role

## Endpoint
`PATCH /users/{id}/role`

### Fitur
- Mengubah role pengguna tertentu.
- Menentukan akses dashboard yang dimiliki pengguna (vendor, koperasi, umkm, bumdes).

### Request
- `role`: role baru pengguna (`vendor`, `koperasi`, `umkm`, `bumdes`).

### Response
- `id`: ID pengguna.
- `email`: email pengguna.
- `role`: role pengguna.
