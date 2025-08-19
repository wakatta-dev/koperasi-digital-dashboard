# Manajemen Role & Permission

## Endpoints (`internal/modules/role/routes.go`)

Semua endpoint mengembalikan objek `APIResponse`.

| Method & Path | Kegunaan | Body | Parameter Path | Contoh Response |
| --- | --- | --- | --- | --- |
| `GET /roles/` | Daftar semua role | - | - | `{ "success": true, "message": "success", "data": [{ "id":1,"name":"Admin","description":"Tenant admin","tenant_id":1 }], "meta": {...}, "errors": null }` |
| `POST /roles/` | Buat role baru | `{ name, description, tenant_id? }` | - | `{ "success": true, "message": "created", "data": { "id":2,"name":"Auditor","description":"Read-only","tenant_id":1 }, ... }` |
| `PUT /roles/:id` | Ubah role | `{ name, description }` | `id` – ID role | `{ "success": true, "message": "updated", "data": { "id":2,"name":"Auditor","description":"Limited access","tenant_id":1 }, ... }` |
| `DELETE /roles/:id` | Hapus role | - | `id` – ID role | `{ "success": true, "message": "deleted", "data": { "id":2 }, ... }` |
| `GET /roles/:id/permissions` | Daftar permission role | - | `id` – ID role | `{ "success": true, "message": "success", "data": [{ "id":10,"ptype":"p","v0":"admin","v1":"tenant","v2":"/users","v3":"GET" }], ... }` |
| `POST /roles/:id/permissions` | Tambah permission ke role | `{ obj, act }` | `id` – ID role | `{ "success": true, "message": "created", "data": { "obj":"/users","act":"GET" }, ... }` |
| `DELETE /roles/:id/permissions/:pid` | Hapus permission role | - | `id` – ID role, `pid` – ID permission | `{ "success": true, "message": "deleted", "data": { "id":10 }, ... }` |
| `GET /users/:id/roles` | Daftar role milik user | - | `id` – ID user | `{ "success": true, "message": "success", "data": [{ "id":5,"user_id":3,"role_id":2,"tenant_id":1,"role":{...} }], ... }` |
| `POST /users/:id/roles` | Assign role ke user | `{ role_id, tenant_id }` | `id` – ID user | `{ "success": true, "message": "assigned", "data": { "user_id":3,"role_id":2 }, ... }` |
| `DELETE /users/:id/roles/:rid` | Lepas role dari user | - | `id` – ID user, `rid` – ID role | `{ "success": true, "message": "removed", "data": { "user_id":3,"role_id":2 }, ... }` |

## Struktur Body (`internal/modules/role/dto.go`)

- **CreateRoleRequest**: `name` (string, wajib), `description` (string, wajib), `tenant_id` (uint, opsional)
- **UpdateRoleRequest**: `name` (string, wajib), `description` (string, wajib)
- **PermissionRequest**: `obj` (string, wajib), `act` (string, wajib)
- **AssignRoleRequest**: `role_id` (uint, wajib), `tenant_id` (uint, wajib)

## Contoh Fungsi TypeScript

```ts
import axios from "axios";

const api = axios.create({ baseURL: "https://api.example.com" });

// 1. Menambah role
export async function createRole(name: string, description: string, tenantId?: number) {
  const { data } = await api.post("/roles/", { name, description, tenant_id: tenantId });
  return data;
}

// 2. Menugaskan permission ke role
export async function addPermission(roleId: number, obj: string, act: string) {
  const { data } = await api.post(`/roles/${roleId}/permissions`, { obj, act });
  return data;
}

// 3. Mengaitkan role ke user
export async function assignRoleToUser(userId: number, roleId: number, tenantId: number) {
  const { data } = await api.post(`/users/${userId}/roles`, { role_id: roleId, tenant_id: tenantId });
  return data;
}
```

## Hubungan Role dengan Casbin

`PermissionService` memanfaatkan **Casbin Enforcer** untuk mengelola policy authorization:

- `AddPolicy` dipanggil saat permission ditambahkan ke role.
- `RemovePolicy` dipanggil saat permission dihapus.
- Perubahan disimpan ke storage Casbin melalui `SavePolicy`.

Dengan demikian, role yang ada di backend terhubung langsung ke aturan akses Casbin; ketika role diberi permission, enforcer diperbarui sehingga permintaan HTTP dapat diotorisasi berdasarkan kombinasi *subject* (role), *domain* (tenant/type), *object*, dan *action*.

