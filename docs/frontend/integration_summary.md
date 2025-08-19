# API Integration Summary

## Base URL and Headers
- Base URL: `http://localhost:8080/api`
- Required headers: `Authorization: Bearer <access_token>` and `X-Tenant-ID: <tenant_id>`
- All responses are JSON with keys `success`, `message`, `data`, `meta`, and `errors`

## Tenant Discovery
- `GET /api/tenant/by-domain?domain=<domain>` → returns `id`, `name`, `domain`, and `type`; use `id` as `X-Tenant-ID`

## Authentication
- `POST /api/auth/login` or `POST /auth/login`  
  Body: `{ "email": "<email>", "password": "<password>" }`  
  Response: `{ "access_token": "<jwt>", "refresh_token": "<token>" }`
- `POST /api/auth/refresh` or `POST /auth/refresh`  
  Body: `{ "refresh_token": "<token>" }`  
  Response: `{ "access_token": "<jwt>" }`
- `POST /api/auth/logout` or `POST /auth/logout`  
  Body: `{ "refresh_token": "<token>" }`  
  Response: `{ "message": "logged out" }`

## Tenant Management
- `POST /api/tenants` – `{ "name","type","domain" }`
- `GET /api/tenants/:id`
- `PATCH /api/tenants/:id` – `{ "name","type" }`
- `PATCH /api/tenants/:id/status` – `{ "status" }`
- `POST /api/tenants/:id/users` – `{ "email","password","full_name","role_id" }`
- `GET /api/tenants/:id/users`
- `GET /api/tenants/:id/modules`
- `PATCH /api/tenants/:id/modules` – `{ "module_id","status" }`
- Public: `GET /api/tenant/by-domain?domain=foo`

## Role & Permission
- `GET /api/roles/`
- `POST /api/roles/` – `{ "name","description","tenant_id" }`
- `PUT /api/roles/:id` – `{ "name","description" }`
- `DELETE /api/roles/:id`
- `GET /api/roles/:id/permissions`
- `POST /api/roles/:id/permissions` – `{ "obj","act" }`
- `DELETE /api/roles/:id/permissions/:pid`
- `GET /api/users/:id/roles`
- `POST /api/users/:id/roles` – `{ "role_id","tenant_id" }`
- `DELETE /api/users/:id/roles/:rid`

## Response Pattern
```json
{
  "success": boolean,
  "message": "string",
  "data": any,
  "meta": {
    "pagination": {
      "next_cursor": "string|null",
      "prev_cursor": "string|null",
      "has_next": boolean,
      "has_prev": boolean,
      "limit": number
    },
    "request_id": "uuid",
    "timestamp": "ISO8601"
  },
  "errors": null | { field: string[] }
}
```
