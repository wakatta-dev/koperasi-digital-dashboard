/** @format */

import type { AuditLogQuery } from "@/types/api";

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
  },
  tenants: {
    byDomain: (domain: string) => ["tenants", "by-domain", domain] as const,
    auditLogs: (
      tenantId: string | number,
      params?: AuditLogQuery,
    ) => ["tenants", String(tenantId), "audit-logs", params ?? {}] as const,
    configuration: (tenantId: string | number) =>
      ["tenants", String(tenantId), "configuration"] as const,
    profile: (tenantId: string | number) =>
      ["tenants", String(tenantId), "profile"] as const,
  },
  notifications: {
    list: (params?: Record<string, unknown>) =>
      ["notifications", "list", params ?? {}] as const,
    metrics: () => ["notifications", "metrics"] as const,
  },
  analytics: {
    dashboard: (params?: Record<string, unknown>) =>
      ["analytics", "dashboard", params ?? {}] as const,
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
  | typeof QK.tenants.byDomain
  | typeof QK.tenants.auditLogs
  | typeof QK.tenants.configuration
  | typeof QK.tenants.profile
  | typeof QK.notifications.list
  | typeof QK.notifications.metrics
  | typeof QK.analytics.dashboard
  | typeof QK.vendor.accounts
  | typeof QK.vendor.deactivate
>;
