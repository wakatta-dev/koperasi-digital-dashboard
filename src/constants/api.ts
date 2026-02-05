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
  bumdesReport: {
    overview: "/finance/reports/overview",
    profitLoss: "/finance/reports/profit-loss",
    cashFlow: "/finance/reports/cash-flow",
    balanceSheet: "/finance/reports/balance-sheet",
    salesDetail: "/finance/reports/sales-detail",
  },
  marketplace: {
    products: "/marketplace/products",
    product: (id: string | number) => `/marketplace/products/${id}`,
    productVariants: (id: string | number) => `/marketplace/products/${id}/variants`,
    cart: "/marketplace/cart",
    cartItem: "/marketplace/cart/items",
    cartItemById: (id: string | number) => `/marketplace/cart/items/${id}`,
    checkout: "/marketplace/checkout",
    orders: "/marketplace/orders",
    order: (id: string | number) => `/marketplace/orders/${id}`,
    orderStatus: (id: string | number) => `/marketplace/orders/${id}/status`,
    orderManualPayment: (id: string | number) =>
      `/marketplace/orders/${id}/manual-payment`,
    customers: "/marketplace/customers",
    customer: (id: string | number) => `/marketplace/customers/${id}`,
  },
  assets: {
    list: "/asset-rental/assets",
    detail: (id: string | number) => `/asset-rental/assets/${id}`,
    image: (id: string | number) => `/asset-rental/assets/${id}/image`,
    categories: "/asset-rental/assets/categories",
    availability: (id: string | number) => `/asset-rental/assets/${id}/availability`,
  },
  assetReservation: {
    availability: "/asset-rental/reservations/check-availability",
    bookings: "/asset-rental/bookings",
    bookingComplete: (id: string | number) => `/asset-rental/bookings/${id}/complete`,
    bookingStatus: (id: string | number) => `/asset-rental/bookings/${id}/status`,
    reservations: "/asset-rental/reservations",
    reservation: (id: string) => `/asset-rental/reservations/${id}`,
    payments: "/asset-rental/payments",
    paymentProof: (id: string) => `/asset-rental/payments/${id}/proof`,
    paymentFinalize: (id: string) => `/asset-rental/payments/${id}/confirm`,
    guestVerify: "/asset-rental/guest-links/verify",
  },
  inventory: {
    categories: "/inventory/categories",
    products: "/inventory/products",
    product: (id: string | number) => `/inventory/products/${id}`,
    image: (id: string | number) => `/inventory/products/${id}/image`,
    images: (id: string | number) => `/inventory/products/${id}/images`,
    imageDetail: (id: string | number, imageId: string | number) =>
      `/inventory/products/${id}/images/${imageId}`,
    imagePrimary: (id: string | number, imageId: string | number) =>
      `/inventory/products/${id}/images/${imageId}/primary`,
    variants: (id: string | number) => `/inventory/products/${id}/variants`,
    stats: (id: string | number) => `/inventory/products/${id}/stats`,
    variantGroups: (id: string | number) =>
      `/inventory/products/${id}/variant-groups`,
    variantGroup: (id: string | number, groupId: string | number) =>
      `/inventory/products/${id}/variant-groups/${groupId}`,
    variantGroupImage: (id: string | number, groupId: string | number) =>
      `/inventory/products/${id}/variant-groups/${groupId}/image`,
    variantGroupOptions: (id: string | number, groupId: string | number) =>
      `/inventory/products/${id}/variant-groups/${groupId}/options`,
    variantOption: (id: string | number, optionId: string | number) =>
      `/inventory/products/${id}/options/${optionId}`,
    variantOptionImage: (id: string | number, optionId: string | number) =>
      `/inventory/products/${id}/options/${optionId}/image`,
    archive: (id: string | number) => `/inventory/products/${id}/archive`,
    unarchive: (id: string | number) => `/inventory/products/${id}/unarchive`,
    stockInitial: (id: string | number) => `/inventory/products/${id}/stock/initial`,
    stockAdjust: (id: string | number) => `/inventory/products/${id}/stock/adjust`,
    history: (id: string | number) => `/inventory/products/${id}/history`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
