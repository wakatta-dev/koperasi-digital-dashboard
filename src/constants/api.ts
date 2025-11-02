/** @format */

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    refresh: "/auth/refresh",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    sessions: "/auth/sessions",
  },
  tenants: {
    register: "/tenants",
    verify: "/tenants/verify",
    status: (id: string | number) => `/tenants/${id}/status`,
    auditLogs: (tenantId: string | number) =>
      `/tenants/${tenantId}/audit-logs`,
    configuration: (tenantId: string | number) =>
      `/tenants/${tenantId}/configuration`,
    profile: (tenantId: string | number) => `/tenants/${tenantId}/profile`,
  },
  domain: {
    byDomain: (domain: string) =>
      `/get-by-domain/${encodeURIComponent(domain)}`,
  },
  users: {
    list: "/users",
    detail: (id: string | number) => `/users/${id}`,
    status: (id: string | number) => `/users/${id}/status`,
    roles: (id: string | number) => `/users/${id}/roles`,
    roleItem: (id: string | number, rid: string | number) =>
      `/users/${id}/roles/${rid}`,
    role: (id: string | number) => `/users/${id}/role`,
    emailChange: (id: string | number) => `/users/${id}/email-change`,
    emailChangeActivate: "/users/email-change/activate",
    invite: "/users/invite",
    inviteActivate: "/users/invite/activate",
    resetPassword: "/users/reset-password",
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
    markAllRead: "/notifications/read",
    markRead: (id: string | number) => `/notifications/${id}/read`,
    dashboardMetrics: "/notifications/dashboard/metrics",
  },
  permissions: {
    registry: "/permissions/registry",
    sync: "/permissions/registry/sync",
    confirm: (id: string | number) => `/permissions/registry/${id}/confirm`,
  },
  vendor: {
    emailChangeConfirm: "/vendor/email-change/confirm",
    tenantAccounts: (tenantId: string | number) =>
      `/vendor/tenants/${tenantId}/accounts`,
    tenantAccountEmail: (
      tenantId: string | number,
      userId: string | number,
    ) => `/vendor/tenants/${tenantId}/accounts/${userId}/email`,
    tenantDeactivate: (tenantId: string | number) =>
      `/vendor/tenants/${tenantId}/deactivate`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
