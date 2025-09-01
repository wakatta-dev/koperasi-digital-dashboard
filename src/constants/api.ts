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
  // notifications section defined later to include reminders
  billing: {
    vendor: {
      plans: "/vendor/plans",
      plan: (id: string | number) => `/vendor/plans/${id}`,
      planStatus: (id: string | number) => `/vendor/plans/${id}/status`,
      // Base collection path for invoices
      invoicesBase: "/vendor/invoices",
      // Helper for GET list with limit/cursor (kept for back-compat)
      invoices: (limit: number, cursor?: string) =>
        `/vendor/invoices?limit=${limit}${!!cursor ? `&cursor=${cursor}` : ""}`,
      invoice: (id: string | number) => `/vendor/invoices/${id}`,
      invoiceStatus: (id: string | number) => `/vendor/invoices/${id}/status`,
      payments: (id: string | number) => ({
        verify: `/vendor/payments/${id}/verify`,
      }),
      subscriptions: {
        summary: "/vendor/subscriptions/summary",
        list: "/vendor/subscriptions",
        status: (id: string | number) => `/vendor/subscriptions/${id}/status`,
      },
      audits: (limit: number, cursor?: string) =>
        `/vendor/audits?limit=${limit}${!!cursor ? `&cursor=${cursor}` : ""}`,
      gateways: {
        webhook: (gateway: string) => `/vendor/payment-gateways/${gateway}/webhook`,
      },
    },
    client: {
      // Base collection path for invoices
      invoicesBase: "/client/invoices",
      // Helper for GET list with limit/cursor (kept for back-compat)
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
  vendor: {
    dashboard: "/vendor/dashboard",
    reports: {
      financial: "/vendor/reports/financial",
      usage: "/vendor/reports/usage",
      export: "/vendor/reports/export",
      exports: "/vendor/reports/exports",
    },
    tenants: "/vendor/tenants",
    tenantsVerify: "/vendor/tenants/verify",
    tenantStatus: (id: string | number) => `/vendor/tenants/${id}/status`,
  },
  reports: {
    finance: "/reports/finance",
    billing: "/reports/billing",
    cashflow: "/reports/cashflow",
    profitLoss: "/reports/profit-loss",
    balanceSheet: "/reports/balance-sheet",
  },
  savings: {
    deposit: (memberId: string | number) => `/coop/savings/${memberId}/deposit`,
    verify: (transactionId: string | number) =>
      `/coop/savings/${transactionId}/verify`,
    withdraw: (memberId: string | number) => `/coop/savings/${memberId}/withdraw`,
    approve: (transactionId: string | number) =>
      `/coop/savings/${transactionId}/approve`,
    transactions: (memberId: string | number) =>
      `/coop/savings/${memberId}/transactions`,
    proof: (transactionId: string | number) =>
      `/coop/savings/${transactionId}/proof`,
  },
  loans: {
    apply: "/coop/loans/apply",
    approve: (id: string | number) => `/coop/loans/${id}/approve`,
    disburse: (id: string | number) => `/coop/loans/${id}/disburse`,
    installments: (id: string | number) => `/coop/loans/${id}/installments`,
    payInstallment: (id: string | number) => `/coop/loans/installments/${id}/pay`,
    releaseLetter: (id: string | number) => `/coop/loans/${id}/release-letter`,
  },
  tickets: {
    list: "/tickets",
    create: "/tickets",
    detail: (id: string) => `/tickets/${id}`,
    replies: (id: string) => `/tickets/${id}/replies`,
    update: (id: string) => `/tickets/${id}`,
  },
  notifications: {
    list: "/notifications",
    create: "/notifications",
    status: (id: string | number) => `/notifications/${id}`,
    reminders: "/notifications/reminders",
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
