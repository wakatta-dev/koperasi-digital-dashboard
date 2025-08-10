/** @format */

export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  users: {
    me: "/users/me",
    list: "/users",
    invite: "/users/invite",
    updateRole: (id: string | number) => `/users/${id}/role`,
    deactivate: (id: string | number) => `/users/${id}/deactivate`,
  },
  businessProfile: {
    root: "/business-profile",
  },
  members: {
    list: "/anggota",
    register: "/anggota/register",
    contributions: (id: string | number) => `/anggota/contributions/${id}`,
  },
  faq: {
    list: "/faq",
    categories: "/faq/categories",
    feedback: (id: string | number) => `/faq/${id}/feedback`,
    create: "/faq",
    update: (id: string | number) => `/faq/${id}`,
    delete: (id: string | number) => `/faq/${id}`,
    categoryCreate: "/faq/categories",
    categoryUpdate: (id: string | number) => `/faq/categories/${id}`,
    categoryDelete: (id: string | number) => `/faq/categories/${id}`,
  },
  businessUnits: {
    list: "/business-units",
    create: "/business-units",
    update: (id: string | number) => `/business-units/${id}`,
    delete: (id: string | number) => `/business-units/${id}`,
    assignUser: (id: string | number) => `/users/${id}/assign-unit`,
    reports: "/reports/by-unit",
  },
  billing: {
    summary: "/billing/summary",
    usage: "/billing/usage",
  },
  savings: {
    list: "/simpanan/savings",
    create: "/simpanan/savings",
    adminSummary: "/simpanan/savings/admin-summary",
    approveWithdrawal: "/simpanan/savings/approve-withdrawal",
    deposit: "/simpanan/savings/deposit",
    distributeProfitSharing: "/simpanan/savings/distribute-profit-sharing",
    transactions: "/simpanan/savings/transactions",
    types: "/simpanan/savings/types",
    verifyDeposit: "/simpanan/savings/verify-deposit",
    withdrawal: "/simpanan/savings/withdrawal",
  },
  loans: {
    list: "/pinjaman",
    apply: "/pinjaman/apply",
    detail: (id: string | number) => `/pinjaman/${id}`,
    approve: (id: string | number) => `/pinjaman/${id}/approve`,
    reject: (id: string | number) => `/pinjaman/${id}/reject`,
    schedule: (id: string | number) => `/pinjaman/${id}/schedule`,
    repayment: (id: string | number) => `/pinjaman/${id}/repayment`,
    signAgreement: "/pinjaman/sign-agreement",
    adminSummary: "/pinjaman/admin-summary",
  },
  shu: {
    list: "/shu",
    adminPreview: "/shu/admin-preview",
    allocate: "/shu/allocate",
    distribute: "/shu/distribute",
    history: "/shu/history",
  },
  dashboard: {
    summaryClient: "/dashboard/summary/client",
    summaryOwner: "/dashboard/summary/owner",
    notification: "/dashboard/notifications",
  },
  reports: {
    profitLoss: "/reports/profit-loss",
    cashflow: "/reports/cashflow",
    balanceSheet: "/reports/balance-sheet",
    sales: "/reports/sales",
    salesProducts: "/reports/sales-products",
    export: "/reports/export",
  },
  modules: {
    list: "/modules",
    activate: (id: string | number) => `/modules/${id}/activate`,
    deactivate: (id: string | number) => `/modules/${id}/deactivate`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
