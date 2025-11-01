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
  users: {
    list: "/users",
    detail: (id: string | number) => `/users/${id}`,
    status: (id: string | number) => `/users/${id}/status`,
    role: (id: string | number) => `/users/${id}/role`,
    roles: (id: string | number) => `/users/${id}/roles`,
    roleAssignment: (id: string | number, rid: string | number) =>
      `/users/${id}/roles/${rid}`,
    emailChange: (id: string | number) => `/users/${id}/email-change`,
    emailChangeActivate: "/users/email-change/activate",
    invite: "/users/invite",
    inviteActivate: "/users/invite/activate",
    resetPassword: "/users/reset-password",
  },
  roles: {
    list: "/roles",
    detail: (id: string | number) => `/roles/${id}`,
    diff: (id: string | number) => `/roles/${id}/diff`,
    permissions: (id: string | number) => `/roles/${id}/permissions`,
    permission: (id: string | number, pid: string | number) =>
      `/roles/${id}/permissions/${pid}`,
    tenants: "/roles/tenants",
  },
  notifications: {
    list: "/notifications",
    dashboardMetrics: "/notifications/dashboard/metrics",
    export: "/notifications/export",
    failures: "/notifications/failures",
    failureDetail: (id: string | number) => `/notifications/failures/${id}`,
    preferences: "/notifications/preferences",
    markAllRead: "/notifications/read",
    markRead: (id: string | number) => `/notifications/${id}/read`,
    templates: "/notifications/templates",
    templateDetail: (id: string | number) => `/notifications/templates/${id}`,
    templatePreview: (id: string | number) =>
      `/notifications/templates/${id}/preview`,
    templateVersions: (id: string | number) =>
      `/notifications/templates/${id}/versions`,
  },
  permissions: {
    registry: "/permissions/registry",
    sync: "/permissions/registry/sync",
    confirm: (id: string | number) => `/permissions/registry/${id}/confirm`,
  },
  tenants: {
    create: "/tenants",
    verify: "/tenants/verify",
    byDomain: (domain: string) =>
      `/get-by-domain/${encodeURIComponent(domain)}`,
    status: (id: string | number) => `/tenants/${id}/status`,
    auditLogs: (tenantId: string | number) =>
      `/tenants/${tenantId}/audit-logs`,
    configuration: (tenantId: string | number) =>
      `/tenants/${tenantId}/configuration`,
    profile: (tenantId: string | number) => `/tenants/${tenantId}/profile`,
  },
  vendor: {
    tenantAccounts: (tenantId: string | number) =>
      `/vendor/tenants/${tenantId}/accounts`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
