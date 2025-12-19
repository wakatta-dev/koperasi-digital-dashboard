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
  },
  tenants: {
    byDomain: (domain: string) => ["tenants", "by-domain", domain] as const,
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
  finance: {
    summary: (params?: Record<string, unknown>) =>
      ["finance", "summary", params ?? {}] as const,
    topProducts: (params?: Record<string, unknown>) =>
      ["finance", "top-products", params ?? {}] as const,
    channels: (params?: Record<string, unknown>) =>
      ["finance", "channels", params ?? {}] as const,
    overview: (params?: Record<string, unknown>) =>
      ["finance", "overview", params ?? {}] as const,
    profitLoss: (params?: Record<string, unknown>) =>
      ["finance", "profit-loss", params ?? {}] as const,
    cashFlow: (params?: Record<string, unknown>) =>
      ["finance", "cash-flow", params ?? {}] as const,
    balanceSheet: (params?: Record<string, unknown>) =>
      ["finance", "balance-sheet", params ?? {}] as const,
  },
  assetRental: {
    list: (params?: Record<string, unknown>) =>
      ["asset-rental", "assets", params ?? {}] as const,
    detail: (id: string | number) =>
      ["asset-rental", "assets", "detail", String(id)] as const,
    reservation: (id: string | number) =>
      ["asset-rental", "reservations", "detail", String(id)] as const,
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
  | typeof QK.tenants.profile
  | typeof QK.notifications.list
  | typeof QK.notifications.metrics
  | typeof QK.analytics.dashboard
  | typeof QK.finance.summary
  | typeof QK.finance.topProducts
  | typeof QK.finance.channels
  | typeof QK.finance.overview
  | typeof QK.finance.profitLoss
  | typeof QK.finance.cashFlow
  | typeof QK.finance.balanceSheet
  | typeof QK.assetRental.list
  | typeof QK.assetRental.detail
  | typeof QK.assetRental.reservation
>;
