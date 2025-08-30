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
    status: (id: string | number) => `/notifications/${id}/status`,
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
    },
    client: {
      invoices: "/billing/client/invoices",
      invoice: (id: string | number) => ({
        payments: `/billing/client/invoices/${id}/payments`,
      }),
    },
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
