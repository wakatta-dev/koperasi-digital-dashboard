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
      plans: "/plans",
      plan: (id: string | number) => `/plans/${id}`,
      planStatus: (id: string | number) => `/plans/${id}/status`,
      // Base collection path for invoices
      invoicesBase: "/invoices",
      // Helper for GET list with limit/cursor (kept for back-compat)
      invoices: (limit: number, cursor?: string) =>
        `/invoices?limit=${limit}${!!cursor ? `&cursor=${cursor}` : ""}`,
      invoice: (id: string | number) => `/invoices/${id}`,
      invoiceSend: (id: string | number) => `/invoices/${id}/send`,
      invoicePdf: (id: string | number) => `/invoices/${id}/pdf`,
      // Optional: vendor can also create manual payment on an invoice (per docs generic path)
      invoicePayments: (id: string | number) => `/invoices/${id}/payments`,
      invoiceStatus: (id: string | number) => `/invoices/${id}/status`,
      payments: (id: string | number) => ({
        verify: `/payments/${id}/verify`,
      }),
      subscriptions: {
        summary: "/subscriptions/summary",
        list: "/subscriptions",
        status: (id: string | number) => `/subscriptions/${id}/status`,
      },
      audits: (limit: number, cursor?: string) =>
        `/audits?limit=${limit}${!!cursor ? `&cursor=${cursor}` : ""}`,
      gateways: {
        webhook: (gateway: string) => `/payment-gateways/${gateway}/webhook`,
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
    export: "/reports/export",
    history: "/reports/history",
  },
  koperasiReports: {
    balanceSheet: "/koperasi/financial-reports/balance-sheet",
    profitLoss: "/koperasi/financial-reports/profit-loss",
    cashflow: "/koperasi/financial-reports/cash-flow",
    export: "/koperasi/financial-reports/export",
  },
  catalog: {
    modules: "/modules",
  },
  cashbook: {
    // Per endpoints_index: /api/cash/*
    manual: "/cash/manual",
    summary: "/cash/summary",
    export: "/cash/export",
  },
  assets: {
    list: "/koperasi/assets",
    detail: (id: string | number) => `/koperasi/assets/${id}`,
    depreciation: (id: string | number) => `/koperasi/assets/${id}/depreciation`,
    status: (id: string | number) => `/koperasi/assets/${id}/status`,
    usage: (id: string | number) => `/koperasi/assets/${id}/usages`,
    export: "/koperasi/assets/export",
  },
  membership: {
    list: "/koperasi/members",
    register: "/koperasi/members/register",
    verify: (id: string | number) => `/koperasi/members/${id}/verify`,
    detail: (id: string | number) => `/koperasi/members/${id}`,
    status: (id: string | number) => `/koperasi/members/${id}/status`,
    card: (id: string | number) => `/koperasi/members/${id}/card`,
    cardValidate: (qr: string) =>
      `/koperasi/members/card/validate/${encodeURIComponent(qr)}`,
  },
  koperasiCard: {
    preview: (memberId: string | number) =>
      `/koperasi/card/members/${memberId}/preview`,
    refresh: (memberId: string | number) =>
      `/koperasi/card/members/${memberId}/refresh`,
    download: (memberId: string | number) =>
      `/koperasi/card/members/${memberId}/download`,
    validate: (qr: string) =>
      `/koperasi/card/validate/${encodeURIComponent(qr)}`,
  },
  savings: {
    deposit: (memberId: string | number) => `/koperasi/savings/${memberId}/deposit`,
    verify: (transactionId: string | number) =>
      `/koperasi/savings/${transactionId}/verify`,
    withdraw: (memberId: string | number) => `/koperasi/savings/${memberId}/withdraw`,
    approve: (transactionId: string | number) =>
      `/koperasi/savings/${transactionId}/approve`,
    transactions: (memberId: string | number) =>
      `/koperasi/savings/${memberId}/transactions`,
    proof: (transactionId: string | number) =>
      `/koperasi/savings/${transactionId}/proof`,
  },
  koperasiDashboard: "/koperasi/dashboard",
  shu: {
    yearly: "/koperasi/shu/yearly",
    simulate: (year: string | number) => `/koperasi/shu/yearly/${year}/simulate`,
    distribute: (year: string | number) => `/koperasi/shu/yearly/${year}/distribute`,
    history: "/koperasi/shu/history",
    member: (memberId: string | number) => `/koperasi/shu/member/${memberId}`,
    export: (year: string | number) => `/koperasi/shu/export/${year}`,
  },
  loans: {
    apply: "/koperasi/loans/apply",
    approve: (id: string | number) => `/koperasi/loans/${id}/approve`,
    disburse: (id: string | number) => `/koperasi/loans/${id}/disburse`,
    installments: (id: string | number) => `/koperasi/loans/${id}/installments`,
    payInstallment: (id: string | number) => `/koperasi/loans/installments/${id}/pay`,
    releaseLetter: (id: string | number) => `/koperasi/loans/${id}/release-letter`,
    releaseLetterHistory: (id: string | number) => `/koperasi/loans/${id}/release-letter/history`,
  },
  tickets: {
    list: "/tickets",
    create: "/tickets",
    detail: (id: string) => `/tickets/${id}`,
    replies: (id: string) => `/tickets/${id}/replies`,
    update: (id: string) => `/tickets/${id}`,
    activities: (id: string) => `/tickets/${id}/activities`,
    sla: "/vendor/tickets/sla",
  },
  notifications: {
    list: "/notifications",
    create: "/notifications",
    status: (id: string | number) => `/notifications/${id}`,
    reminders: "/notifications/reminders",
    vendor: {
      list: "/notifications/vendor",
      broadcast: "/notifications/broadcast",
      bulk: "/notifications/bulk",
      publish: (id: string | number) => `/notifications/${id}/publish`,
      unpublish: (id: string | number) => `/notifications/${id}/unpublish`,
    },
  },
  rat: {
    // Koperasi RAT endpoints
    base: "/koperasi/rat",
    create: "/koperasi/rat",
    notify: (id: string | number) => `/koperasi/rat/${id}/notify`,
    documents: (id: string | number) => `/koperasi/rat/${id}/documents`,
    voting: (id: string | number) => `/koperasi/rat/${id}/voting`,
    vote: (itemId: string | number) => `/koperasi/rat/voting/${itemId}/vote`,
    result: (itemId: string | number) => `/koperasi/rat/voting/${itemId}/result`,
    history: "/koperasi/rat/history",
    report: (id: string | number) => `/koperasi/rat/${id}/report`,
  },
  settings: {
    // Tenant UI & Landing settings (tenant-scoped)
    ui: "/settings/ui",
    landing: "/settings/landing",
  },
  branding: {
    base: "/branding",
    units: "/branding/units",
    unit: (id: string | number) => `/branding/units/${id}`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
