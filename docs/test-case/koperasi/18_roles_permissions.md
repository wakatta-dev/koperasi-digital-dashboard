# Test Case — Roles & Permissions (Koperasi)

Catatan rujukan: `docs/modules/role.md`

## Roles (CRUD & Binding ke Tenant Sendiri)

### KOP-ROLE-001 — List roles (cursor)
- GET `/roles?limit=10` → 200 `data[]` role milik tenant koperasi + pagination.

### KOP-ROLE-002 — Create role
- POST `/roles` body `{ "name": "bendahara", "description": "Akses keuangan" }` → 201.

### KOP-ROLE-003 — Update role
- PUT `/roles/{id}` body `{ "name": "bendahara", "description": "Akses keuangan & simpanan" }` → 200.

### KOP-ROLE-004 — Hapus role dari tenant ini (unbind)
- DELETE `/roles/{id}` → 200 `data.id`.

## Permissions (Casbin)

### KOP-ROLE-010 — List permission per role
- GET `/roles/{id}/permissions?limit=20` → 200 `data[]` CasbinRule.

### KOP-ROLE-011 — Tambah permission
- POST `/roles/{id}/permissions` body `{ "obj": "/coop/savings", "act": "GET" }` → 201.

### KOP-ROLE-012 — Hapus permission
- DELETE `/roles/{id}/permissions/{pid}` → 200.

## User Roles (Mapping)

### KOP-ROLE-020 — Assign role ke user
- POST `/users/{user_id}/roles` body `{ "role_id": <role_id>, "tenant_id": <tenant_koperasi_id> }` → 201.

### KOP-ROLE-021 — List role user (cursor)
- GET `/users/{user_id}/roles?limit=10` → 200 `data[]`.

### KOP-ROLE-022 — Hapus role dari user
- DELETE `/users/{user_id}/roles/{role_id}` → 200.

## Negative & Validasi

### KOP-ROLE-030 — Duplikat role name
- POST `/roles` dua kali dengan `name` sama → request kedua gagal 409/400.

### KOP-ROLE-031 — Permission invalid
- POST permission dengan `obj`/`act` kosong → 400.

### KOP-ROLE-032 — Assign role dengan tenant mismatch
- `tenant_id` berbeda dari token → 403/400.

