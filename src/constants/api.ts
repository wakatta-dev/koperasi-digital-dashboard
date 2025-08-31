/** @format */

export const API_ENDPOINTS = {
  tenant: {
    byDomain: "/tenant/by-domain",
    list: "/tenants",
    detail: (id: string | number) => `/tenants/${id}`,
    status: (id: string | number) => `/tenants/${id}/status`,
    users: (id: string | number) => `/tenants/${id}/users`,
    modules: (id: string | number) => `/tenants/${id}/modules`,
  },
  transactions: {
    list: "/transactions",
    detail: (id: string | number) => `/transactions/${id}`,
    history: (id: string | number) => `/transactions/${id}/history`,
    export: "/transactions/export",
  },
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: {
    list: "/users",
    detail: (id: string | number) => `/users/${id}`,
    status: (id: string | number) => `/users/${id}/status`,
    resetPassword: "/users/reset-password",
    roles: (id: string | number) => `/users/${id}/roles`,
    role: (id: string | number, rid: string | number) =>
      `/users/${id}/roles/${rid}`,
  },
  roles: {
    list: "/roles",
    detail: (id: string | number) => `/roles/${id}`,
    permissions: (id: string | number) => `/roles/${id}/permissions`,
    permission: (id: string | number, pid: string | number) =>
      `/roles/${id}/permissions/${pid}`,
    tenants: "/roles/tenants",
  },
  notifications: {
    list: "/notifications",
    create: "/notifications",
    status: (id: string | number) => `/notifications/${id}`,
  },
  billing: {
    vendor: {
      plans: "/vendor/plans",
      plan: (id: string | number) => `/vendor/plans/${id}`,
      invoices: (limit: number, cursor?: string) =>
        `/vendor/invoices?limit=${limit}${!!cursor ? `&cursor=${cursor}` : ""}`,
      invoice: (id: string | number) => `/vendor/invoices/${id}`,
      payments: (id: string | number) => ({
        verify: `/vendor/payments/${id}/verify`,
      }),
      subscriptions: {
        summary: "/vendor/subscriptions/summary",
      },
      audits: (limit: number, cursor?: string) =>
        `/vendor/audits?limit=${limit}${!!cursor ? `&cursor=${cursor}` : ""}`,
    },
    client: {
      invoices: (limit: number, cursor?: string) =>
        `/client/invoices?limit=${limit}${!!cursor ? `&cursor=${cursor}` : ""}`,
      invoice: (id: string | number) => ({
        detail: `/client/invoices/${id}`,
        payments: `/client/invoices/${id}/payments`,
        audits: `/client/invoices/${id}/audits`,
      }),
      subscription: "/client/subscription",
    },
  },
  reports: {
    finance: "/reports/finance",
    billing: "/reports/billing",
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
