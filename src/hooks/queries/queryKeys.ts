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
  accountingAr: {
    invoices: (params?: Record<string, unknown>) =>
      ["accounting-ar", "invoices", params ?? {}] as const,
    invoiceDetail: (invoiceNumber: string | number) =>
      ["accounting-ar", "invoice", String(invoiceNumber)] as const,
    creditNotes: (params?: Record<string, unknown>) =>
      ["accounting-ar", "credit-notes", params ?? {}] as const,
    payments: (params?: Record<string, unknown>) =>
      ["accounting-ar", "payments", params ?? {}] as const,
  },
  accountingAp: {
    overview: () => ["accounting-ap", "overview"] as const,
    bills: (params?: Record<string, unknown>) =>
      ["accounting-ap", "bills", params ?? {}] as const,
    billDetail: (billNumber: string | number) =>
      ["accounting-ap", "bill-detail", String(billNumber)] as const,
    billPayments: (billNumber: string | number) =>
      ["accounting-ap", "bill-payments", String(billNumber)] as const,
    vendorCredits: (params?: Record<string, unknown>) =>
      ["accounting-ap", "vendor-credits", params ?? {}] as const,
    batchDetail: (batchReference: string | number) =>
      ["accounting-ap", "batch-detail", String(batchReference)] as const,
  },
  accountingBankCash: {
    overview: () => ["accounting-bank-cash", "overview"] as const,
    accounts: (params?: Record<string, unknown>) =>
      ["accounting-bank-cash", "accounts", params ?? {}] as const,
    unreconciledTransactions: (params?: Record<string, unknown>) =>
      ["accounting-bank-cash", "unreconciled-transactions", params ?? {}] as const,
    reconciliationSession: (accountId: string | number) =>
      ["accounting-bank-cash", "reconciliation-session", String(accountId)] as const,
    bankLines: (accountId: string | number, params?: Record<string, unknown>) =>
      ["accounting-bank-cash", "bank-lines", String(accountId), params ?? {}] as const,
    systemLines: (accountId: string | number, params?: Record<string, unknown>) =>
      ["accounting-bank-cash", "system-lines", String(accountId), params ?? {}] as const,
    accountTransactions: (accountId: string | number, params?: Record<string, unknown>) =>
      [
        "accounting-bank-cash",
        "account-transactions",
        String(accountId),
        params ?? {},
      ] as const,
  },
  accountingSettings: {
    overview: () => ["accounting-settings", "overview"] as const,
    coa: (params?: Record<string, unknown>) =>
      ["accounting-settings", "coa", params ?? {}] as const,
    taxes: (params?: Record<string, unknown>) =>
      ["accounting-settings", "taxes", params ?? {}] as const,
    currencies: (params?: Record<string, unknown>) =>
      ["accounting-settings", "currencies", params ?? {}] as const,
    analyticAccounts: (params?: Record<string, unknown>) =>
      ["accounting-settings", "analytic-accounts", params ?? {}] as const,
    budgets: (params?: Record<string, unknown>) =>
      ["accounting-settings", "budgets", params ?? {}] as const,
  },
  accountingJournal: {
    overview: () => ["accounting-journal", "overview"] as const,
    entries: (params?: Record<string, unknown>) =>
      ["accounting-journal", "entries", params ?? {}] as const,
    entryDetail: (journalNumber: string | number) =>
      ["accounting-journal", "entry-detail", String(journalNumber)] as const,
    entryAuditLogs: (
      journalNumber: string | number,
      params?: Record<string, unknown>
    ) =>
      [
        "accounting-journal",
        "entry-audit-logs",
        String(journalNumber),
        params ?? {},
      ] as const,
    auditLogs: (params?: Record<string, unknown>) =>
      ["accounting-journal", "audit-logs", params ?? {}] as const,
    periodLockCurrent: (params?: Record<string, unknown>) =>
      ["accounting-journal", "period-lock-current", params ?? {}] as const,
  },
  accountingTax: {
    overview: () => ["accounting-tax", "overview"] as const,
    periods: (params?: Record<string, unknown>) =>
      ["accounting-tax", "periods", params ?? {}] as const,
    vatTransactions: (params?: Record<string, unknown>) =>
      ["accounting-tax", "vat-transactions", params ?? {}] as const,
    pphRecords: (params?: Record<string, unknown>) =>
      ["accounting-tax", "pph-records", params ?? {}] as const,
    exportHistory: (params?: Record<string, unknown>) =>
      ["accounting-tax", "export-history", params ?? {}] as const,
    efakturReady: (params?: Record<string, unknown>) =>
      ["accounting-tax", "efaktur-ready", params ?? {}] as const,
    incomeTaxReport: (params?: Record<string, unknown>) =>
      ["accounting-tax", "income-tax-report", params ?? {}] as const,
    compliance: (params?: Record<string, unknown>) =>
      ["accounting-tax", "compliance", params ?? {}] as const,
    fileDownload: (fileId: string | number) =>
      ["accounting-tax", "file-download", String(fileId)] as const,
  },
  accountingReporting: {
    profitLoss: (params?: Record<string, unknown>) =>
      ["accounting-reporting", "profit-loss", params ?? {}] as const,
    cashFlow: (params?: Record<string, unknown>) =>
      ["accounting-reporting", "cash-flow", params ?? {}] as const,
    balanceSheet: (params?: Record<string, unknown>) =>
      ["accounting-reporting", "balance-sheet", params ?? {}] as const,
    profitLossComparative: (params?: Record<string, unknown>) =>
      ["accounting-reporting", "profit-loss-comparative", params ?? {}] as const,
    trialBalance: (params?: Record<string, unknown>) =>
      ["accounting-reporting", "trial-balance", params ?? {}] as const,
    generalLedger: (params?: Record<string, unknown>) =>
      ["accounting-reporting", "general-ledger", params ?? {}] as const,
    accountLedger: (params?: Record<string, unknown>) =>
      ["accounting-reporting", "account-ledger", params ?? {}] as const,
  },
  assetRental: {
    list: (params?: Record<string, unknown>) =>
      ["asset-rental", "assets", params ?? {}] as const,
    detail: (id: string | number) =>
      ["asset-rental", "assets", "detail", String(id)] as const,
    masterData: (params?: Record<string, unknown>) =>
      ["asset-rental", "master-data", params ?? {}] as const,
    bookings: (params?: Record<string, unknown>) =>
      ["asset-rental", "bookings", params ?? {}] as const,
    reservation: (id: string | number) =>
      ["asset-rental", "reservations", "detail", String(id)] as const,
  },
  marketplace: {
    list: (params?: Record<string, unknown>) =>
      ["marketplace", "products", params ?? {}] as const,
    detail: (id: string | number) =>
      ["marketplace", "products", String(id)] as const,
    variants: (id: string | number) =>
      ["marketplace", "products", String(id), "variants"] as const,
    cart: () => ["marketplace", "cart"] as const,
    orders: (params?: Record<string, unknown>) =>
      ["marketplace", "orders", params ?? {}] as const,
    orderDetail: (id: string | number) =>
      ["marketplace", "orders", String(id)] as const,
    guestStatus: (id: string | number, trackingToken: string) =>
      ["marketplace", "orders", String(id), "guest-status", trackingToken] as const,
    customers: (params?: Record<string, unknown>) =>
      ["marketplace", "customers", params ?? {}] as const,
    customerDetail: (id: string | number) =>
      ["marketplace", "customers", String(id)] as const,
  },
  inventory: {
    lists: () => ["inventory", "products"] as const,
    list: (params?: Record<string, unknown>) =>
      ["inventory", "products", params ?? {}] as const,
    detail: (id: string | number) =>
      ["inventory", "products", String(id)] as const,
    stats: (id: string | number) =>
      ["inventory", "products", String(id), "stats"] as const,
    history: (id: string | number, params?: Record<string, unknown>) =>
      ["inventory", "products", String(id), "history", params ?? {}] as const,
    variants: (id: string | number) =>
      ["inventory", "products", String(id), "variants"] as const,
    categories: () => ["inventory", "categories"] as const,
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
  | typeof QK.accountingAr.invoices
  | typeof QK.accountingAr.invoiceDetail
  | typeof QK.accountingAr.creditNotes
  | typeof QK.accountingAr.payments
  | typeof QK.accountingAp.overview
  | typeof QK.accountingAp.bills
  | typeof QK.accountingAp.billDetail
  | typeof QK.accountingAp.billPayments
  | typeof QK.accountingAp.vendorCredits
  | typeof QK.accountingAp.batchDetail
  | typeof QK.accountingBankCash.overview
  | typeof QK.accountingBankCash.accounts
  | typeof QK.accountingBankCash.unreconciledTransactions
  | typeof QK.accountingBankCash.reconciliationSession
  | typeof QK.accountingBankCash.bankLines
  | typeof QK.accountingBankCash.systemLines
  | typeof QK.accountingBankCash.accountTransactions
  | typeof QK.accountingSettings.overview
  | typeof QK.accountingSettings.coa
  | typeof QK.accountingSettings.taxes
  | typeof QK.accountingSettings.currencies
  | typeof QK.accountingSettings.analyticAccounts
  | typeof QK.accountingSettings.budgets
  | typeof QK.accountingJournal.overview
  | typeof QK.accountingJournal.entries
  | typeof QK.accountingJournal.entryDetail
  | typeof QK.accountingJournal.entryAuditLogs
  | typeof QK.accountingJournal.auditLogs
  | typeof QK.accountingJournal.periodLockCurrent
  | typeof QK.accountingTax.overview
  | typeof QK.accountingTax.periods
  | typeof QK.accountingTax.vatTransactions
  | typeof QK.accountingTax.pphRecords
  | typeof QK.accountingTax.exportHistory
  | typeof QK.accountingTax.efakturReady
  | typeof QK.accountingTax.incomeTaxReport
  | typeof QK.accountingTax.compliance
  | typeof QK.accountingTax.fileDownload
  | typeof QK.accountingReporting.profitLoss
  | typeof QK.accountingReporting.cashFlow
  | typeof QK.accountingReporting.balanceSheet
  | typeof QK.accountingReporting.profitLossComparative
  | typeof QK.accountingReporting.trialBalance
  | typeof QK.accountingReporting.generalLedger
  | typeof QK.accountingReporting.accountLedger
  | typeof QK.assetRental.list
  | typeof QK.assetRental.detail
  | typeof QK.assetRental.masterData
  | typeof QK.assetRental.bookings
  | typeof QK.assetRental.reservation
  | typeof QK.marketplace.list
  | typeof QK.marketplace.detail
  | typeof QK.marketplace.variants
  | typeof QK.marketplace.cart
  | typeof QK.marketplace.orders
  | typeof QK.marketplace.orderDetail
  | typeof QK.marketplace.guestStatus
  | typeof QK.marketplace.customers
  | typeof QK.marketplace.customerDetail
  | typeof QK.inventory.list
  | typeof QK.inventory.detail
  | typeof QK.inventory.stats
  | typeof QK.inventory.history
  | typeof QK.inventory.variants
  | typeof QK.inventory.categories
>;
