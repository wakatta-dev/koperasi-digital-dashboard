# Role Module

## Endpoints

Setiap endpoint di bawah menggunakan struktur respons `APIResponse`.

Semua endpoint mengembalikan format respons `APIResponse` yang memuat `success`, `message`, `data`, `meta`, dan `errors`.

| Aksi | Method & Path | Path Params | Body (DTO) | Contoh Respons (sukses) |
|------|---------------|-------------|------------|-------------------------|
| List roles | `GET /roles/` | – | – | ```json
{"success":true,"message":"success","data":[{"id":1,"name":"admin","description":"Administrator","tenant_id":1}],"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| Create role | `POST /roles/` | – | `{"name":"…","description":"…","tenant_id":<opsional>}` (CreateRoleRequest) | ```json
{"success":true,"message":"created","data":{"id":2,"name":"editor","description":"Content Editor","tenant_id":1},"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| Update role | `PUT /roles/:id` | `id` (role ID) | `{"name":"…","description":"…"}` (UpdateRoleRequest) | ```json
{"success":true,"message":"updated","data":{"id":2,"name":"editor","description":"Updated Desc","tenant_id":1},"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| Delete role | `DELETE /roles/:id` | `id` (role ID) | – | ```json
{"success":true,"message":"deleted","data":{"id":2},"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| List permissions | `GET /roles/:id/permissions` | `id` (role ID) | – | ```json
{"success":true,"message":"success","data":[{"id":1,"ptype":"p","v0":"editor","v1":"domain","v2":"articles","v3":"read"}],"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| Add permission | `POST /roles/:id/permissions` | `id` (role ID) | `{"obj":"…","act":"…"}` (PermissionRequest) | ```json
{"success":true,"message":"created","data":{"obj":"articles","act":"write"},"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| Delete permission | `DELETE /roles/:id/permissions/:pid` | `id` (role ID), `pid` (permission ID) | – | ```json
{"success":true,"message":"deleted","data":{"id":3},"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| List user roles | `GET /users/:id/roles` | `id` (user ID) | – | ```json
{"success":true,"message":"success","data":[{"id":1,"user_id":10,"role_id":2,"tenant_id":1,"role":{"id":2,"name":"editor"}}],"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| Assign role to user | `POST /users/:id/roles` | `id` (user ID) | `{"role_id":…,"tenant_id":…}` (AssignRoleRequest) | ```json
{"success":true,"message":"assigned","data":{"user_id":10,"role_id":2},"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |
| Remove user role | `DELETE /users/:id/roles/:rid` | `id` (user ID), `rid` (role ID) | – | ```json
{"success":true,"message":"removed","data":{"user_id":10,"role_id":2},"meta":{"request_id":"…","timestamp":"…"},"errors":null}
``` |

*Definisi body:* lihat `internal/modules/role/dto.go`.

## Contoh Fungsi TypeScript

```ts
const API = "https://api.example.com";

// menambah role
async function createRole(name: string, description: string) {
  const res = await fetch(`${API}/roles/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
}

// menambahkan permission ke role
async function addPermission(roleId: number, obj: string, act: string) {
  const res = await fetch(`${API}/roles/${roleId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ obj, act }),
  });
  return res.json();
}

// mengaitkan role ke user
async function assignRoleToUser(userId: number, roleId: number, tenantId: number) {
  const res = await fetch(`${API}/users/${userId}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role_id: roleId, tenant_id: tenantId }),
  });
  return res.json();
}
```

## Hubungan Role dengan Casbin

Layanan permission menggunakan Casbin untuk menambah atau menghapus *policy* yang terkait dengan role, domain, objek, dan aksi. Saat role diberikan ke pengguna, layanan user-role menambahkan *grouping policy* (misal `AddGroupingPolicy`) yang mengaitkan user ID dengan nama role dan domain. Dengan begitu, Casbin dapat menegakkan aturan RBAC secara otomatis.

