/** @format */

export const VENDOR_ROUTES = {
  dashboard: "/vendor/dashboard",
  clients: "/vendor/clients",
  clientDetail: (tenantId: string | number) => `/vendor/clients/${tenantId}`,
  clientOverview: (tenantId: string | number) =>
    `/vendor/clients/${tenantId}/overview`,
  clientAccounts: (tenantId: string | number) =>
    `/vendor/clients/${tenantId}/accounts`,
  clientActivity: (tenantId: string | number) =>
    `/vendor/clients/${tenantId}/activity`,
  clientSubscription: (tenantId: string | number) =>
    `/vendor/clients/${tenantId}/subscription`,
  invoices: "/vendor/invoices",
  invoiceCreate: "/vendor/invoices/create",
  invoiceDetail: (invoiceNumber: string) => `/vendor/invoices/${invoiceNumber}`,
  account: "/vendor/account",
  settings: "/vendor/settings",
  settingsProfile: "/vendor/settings/profile",
  settingsOperations: "/vendor/settings/operations",
  settingsEmail: "/vendor/settings/email",
  settingsActivity: "/vendor/settings/activity",
  products: "/vendor/products",
  productDetail: (productId: string | number) => `/vendor/products/${productId}`,
  notifications: "/vendor/notifications",
  notificationCompose: "/vendor/notifications/compose",
  tickets: "/vendor/tickets",
  ticketDetail: (ticketId: string | number) => `/vendor/tickets/${ticketId}`,
  ticketAnalytics: "/vendor/tickets/analytics",
} as const;
