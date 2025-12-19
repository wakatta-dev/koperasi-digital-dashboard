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
  analytics: {
    dashboard: "/dashboard/analytics",
  },
  finance: {
    salesSummary: "/report/sales/summary",
    topProducts: "/report/sales/products",
    channels: "/report/sales/channels",
    overview: "/finance/overview",
    profitLoss: "/report/profit-loss",
    cashFlow: "/finance/cash-flow",
    balanceSheet: "/finance/balance-sheet",
  },
  assets: {
    list: "/asset-rental/assets",
    detail: (id: string | number) => `/asset-rental/assets/${id}`,
    categories: "/asset-rental/assets/categories",
    availability: (id: string | number) => `/asset-rental/assets/${id}/availability`,
  },
  assetReservation: {
    availability: "/reservations/check-availability",
    reservations: "/reservations",
    reservation: (id: string) => `/reservations/${id}`,
    payments: "/payments",
    paymentProof: (id: string) => `/payments/${id}/proof`,
    paymentFinalize: (id: string) => `/payments/${id}/confirm`,
    guestVerify: "/guest-links/verify",
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
