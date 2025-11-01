/** @format */

export const QK = {
  users: {
    all: ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["users", "list", params ?? {}] as const,
    detail: (id: string | number) =>
      ["users", "detail", String(id)] as const,
    roles: (userId: string | number) =>
      ["users", "roles", String(userId)] as const,
  },
  roles: {
    all: ["roles"] as const,
    lists: (params?: Record<string, unknown>) =>
      ["roles", "list", params ?? {}] as const,
    list: (params?: Record<string, unknown>) =>
      ["roles", "list", params ?? {}] as const,
    detail: (id: string | number) =>
      ["roles", "detail", String(id)] as const,
    permissions: (id: string | number) =>
      ["roles", "permissions", String(id)] as const,
    diff: (id: string | number, params?: Record<string, unknown>) =>
      ["roles", "diff", String(id), params ?? {}] as const,
  },
  tenants: {
    byDomain: (domain: string) => ["tenants", "by-domain", domain] as const,
    auditLogs: (
      tenantId: string | number,
      params?: Record<string, unknown>,
    ) => ["tenants", String(tenantId), "audit-logs", params ?? {}] as const,
    configuration: (tenantId: string | number) =>
      ["tenants", String(tenantId), "configuration"] as const,
    profile: (tenantId: string | number) =>
      ["tenants", String(tenantId), "profile"] as const,
  },
  notifications: {
    list: (params?: Record<string, unknown>) =>
      ["notifications", "list", params ?? {}] as const,
    metrics: ["notifications", "metrics"] as const,
    failures: (params?: Record<string, unknown>) =>
      ["notifications", "failures", params ?? {}] as const,
    failure: (id: string | number) =>
      ["notifications", "failure", String(id)] as const,
    preferences: (params?: Record<string, unknown>) =>
      ["notifications", "preferences", params ?? {}] as const,
    templates: (params?: Record<string, unknown>) =>
      ["notifications", "templates", params ?? {}] as const,
    template: (id: string | number) =>
      ["notifications", "template", String(id)] as const,
    templatePreview: (id: string | number) =>
      ["notifications", "template", String(id), "preview"] as const,
    templateVersions: (id: string | number) =>
      ["notifications", "template", String(id), "versions"] as const,
  },
  vendor: {
    accounts: (tenantId: string | number) =>
      ["vendor", "tenants", String(tenantId), "accounts"] as const,
    deactivate: (tenantId: string | number) =>
      ["vendor", "tenants", String(tenantId), "deactivate"] as const,
  },
} as const;

export type QueryKey = ReturnType<
  | typeof QK.users.lists
  | typeof QK.users.list
  | typeof QK.users.detail
  | typeof QK.users.roles
  | typeof QK.roles.lists
  | typeof QK.roles.list
  | typeof QK.roles.detail
  | typeof QK.roles.permissions
  | typeof QK.roles.diff
  | typeof QK.tenants.byDomain
  | typeof QK.tenants.auditLogs
  | typeof QK.tenants.configuration
  | typeof QK.tenants.profile
  | typeof QK.notifications.list
  | typeof QK.notifications.metrics
  | typeof QK.notifications.failures
  | typeof QK.notifications.failure
  | typeof QK.notifications.preferences
  | typeof QK.notifications.templates
  | typeof QK.notifications.template
  | typeof QK.notifications.templatePreview
  | typeof QK.notifications.templateVersions
  | typeof QK.vendor.accounts
  | typeof QK.vendor.deactivate
>;
