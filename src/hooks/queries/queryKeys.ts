/** @format */

export const QK = {
  users: {
    all: ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (params?: Record<string, any>) => ["users", "list", params ?? {}] as const,
    details: () => ["users", "detail"] as const,
    detail: (id: string | number) => ["users", "detail", String(id)] as const,
    roles: (userId: string | number) => ["users", "roles", String(userId)] as const,
  },
  roles: {
    all: ["roles"] as const,
    lists: (params?: Record<string, any>) =>
      ["roles", "list", params ?? {}] as const,
    details: () => ["roles", "detail"] as const,
    detail: (id: string | number) => ["roles", "detail", String(id)] as const,
    permissions: (id: string | number) => ["roles", "permissions", String(id)] as const,
  },
  tenants: {
    all: ["tenants"] as const,
    lists: () => ["tenants", "list"] as const,
    list: (params?: Record<string, any>) => ["tenants", "list", params ?? {}] as const,
    details: () => ["tenants", "detail"] as const,
    detail: (id: string | number) => ["tenants", "detail", String(id)] as const,
    byDomain: (domain: string) => ["tenants", "by-domain", domain] as const,
    users: (id: string | number, params?: Record<string, any>) =>
      ["tenants", String(id), "users", params ?? {}] as const,
    modules: (id: string | number, params?: Record<string, any>) =>
      ["tenants", String(id), "modules", params ?? {}] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params?: Record<string, any>) => ["notifications", "list", params ?? {}] as const,
  },
  billing: {
    vendor: {
      plans: (params: { limit: number; cursor?: string }) => ["billing", "vendor", "plans", params] as const,
      plan: (id: string | number) => ["billing", "vendor", "plan", String(id)] as const,
      invoices: () => ["billing", "vendor", "invoices"] as const,
      invoice: (id: string | number) => ["billing", "vendor", "invoice", String(id)] as const,
    },
    client: {
      invoices: () => ["billing", "client", "invoices"] as const,
    },
  },
} as const;

export type QueryKey = ReturnType<
  | typeof QK.users.list
  | typeof QK.users.detail
  | typeof QK.users.roles
  | typeof QK.roles.lists
  | typeof QK.roles.detail
  | typeof QK.roles.permissions
  | typeof QK.tenants.list
  | typeof QK.tenants.detail
  | typeof QK.tenants.byDomain
  | typeof QK.tenants.users
  | typeof QK.tenants.modules
  | typeof QK.notifications.list
  | typeof QK.billing.vendor.plans
  | typeof QK.billing.vendor.plan
  | typeof QK.billing.vendor.invoices
  | typeof QK.billing.vendor.invoice
  | typeof QK.billing.client.invoices
>;
