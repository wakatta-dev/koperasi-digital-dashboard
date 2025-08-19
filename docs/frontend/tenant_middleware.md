# Tenant Middleware

The application uses middleware to resolve the current tenant and ensure that authenticated users only access data belonging to tenants they are allowed to manage.

## TenantContext

`TenantContext` reads the tenant identifier from the `X-Tenant-ID` header (or, if missing, from the request's hostname), verifies that the tenant exists using the `domain` column, and stores the tenant information in the request context.

## TenantIsolation

`TenantIsolation` requires an authenticated user and a resolved tenant context. It checks the `user_tenant_access` table to ensure the user has access to the tenant and blocks the request when access is missing. The middleware also verifies that any `tenant_id` appearing in path parameters or query strings matches the resolved tenant.

## Usage

Register the middleware when bootstrapping the application:

```go
app.Use(middleware.TenantContext(db))
api := app.Group("/api", middleware.JWTAuth(jm), middleware.TenantIsolation(db))
```

Handlers under `api` automatically receive tenant isolation, while additional routes can apply the middleware manually if needed.

## Notes

- Tenant identification currently relies on the `X-Tenant-ID` header. Reading the tenant from the JWT payload is not yet implemented.
- Ensure all database queries include the tenant ID to maintain data isolation across tenants.
