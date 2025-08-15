# Role

## Endpoint
`PATCH /users/{id}/role`

### Fitur
- Mengubah role pengguna tertentu.
- Menentukan akses dashboard yang dimiliki pengguna (vendor, koperasi, umkm, bumdes).

### Payload
```json
{
  "role": "vendor|koperasi|umkm|bumdes"
}
```

### Response
```json
{
  "id": "1",
  "email": "user@test.com",
  "role": "vendor"
}
```
