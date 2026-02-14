/** @format */

import type {
  CustomerStatus,
  OrderStatus,
  ProductStatus,
} from "@/modules/marketplace/types";
import type {
  MarketplaceOrderStatus,
  MarketplaceOrderStatusInput,
} from "@/types/api/marketplace";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  Tersedia: "Tersedia",
  Menipis: "Menipis",
  Habis: "Habis",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Completed: "Completed",
  Processing: "Processing",
  Shipped: "Shipped",
  Cancelled: "Cancelled",
};

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  Active: "Active",
  Inactive: "Inactive",
};

export const PRODUCT_STATUS_BADGE_CLASS: Record<ProductStatus, string> = {
  Tersedia:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Menipis:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Habis: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/50",
  Processing:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50",
  Shipped:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50",
  Cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/50",
};

export const CUSTOMER_STATUS_BADGE_CLASS: Record<CustomerStatus, string> = {
  Active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Inactive: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

export const CUSTOMER_STATUS_DOT_CLASS: Record<CustomerStatus, string> = {
  Active: "bg-emerald-500",
  Inactive: "bg-gray-400",
};

export const MARKETPLACE_CANONICAL_STATUS_LABELS: Record<
  MarketplaceOrderStatus,
  string
> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAYMENT_VERIFICATION: "Verifikasi Pembayaran",
  PROCESSING: "Diproses",
  IN_DELIVERY: "Dalam Pengiriman",
  COMPLETED: "Selesai",
  CANCELED: "Dibatalkan",
};

const LEGACY_TO_CANONICAL_STATUS_MAP: Record<string, MarketplaceOrderStatus> = {
  NEW: "PENDING_PAYMENT",
  PENDING: "PENDING_PAYMENT",
  PAID: "PAYMENT_VERIFICATION",
  SHIPPED: "IN_DELIVERY",
  DELIVERED: "COMPLETED",
  CANCELLED: "CANCELED",
};

export const MARKETPLACE_ALLOWED_STATUS_TRANSITIONS: Record<
  MarketplaceOrderStatus,
  ReadonlyArray<MarketplaceOrderStatus>
> = {
  PENDING_PAYMENT: ["PAYMENT_VERIFICATION", "CANCELED"],
  PAYMENT_VERIFICATION: ["PROCESSING", "CANCELED"],
  PROCESSING: ["IN_DELIVERY", "CANCELED"],
  IN_DELIVERY: ["COMPLETED"],
  COMPLETED: [],
  CANCELED: [],
};

export function normalizeMarketplaceOrderStatus(
  status?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
): MarketplaceOrderStatus {
  const normalized = (status ?? "").trim().toUpperCase();

  if (!normalized) {
    return "PENDING_PAYMENT";
  }

  if (normalized in MARKETPLACE_CANONICAL_STATUS_LABELS) {
    return normalized as MarketplaceOrderStatus;
  }

  return LEGACY_TO_CANONICAL_STATUS_MAP[normalized] ?? "PENDING_PAYMENT";
}

export function isLegacyMarketplaceOrderStatus(status?: string | null) {
  const normalized = (status ?? "").trim().toUpperCase();
  return normalized in LEGACY_TO_CANONICAL_STATUS_MAP;
}

export function isMarketplaceTransitionAllowed(
  fromStatus?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
  toStatus?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
) {
  const from = normalizeMarketplaceOrderStatus(fromStatus);
  const to = normalizeMarketplaceOrderStatus(toStatus);
  return MARKETPLACE_ALLOWED_STATUS_TRANSITIONS[from].includes(to);
}

export function getMarketplaceCanonicalStatusLabel(
  status?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
) {
  return MARKETPLACE_CANONICAL_STATUS_LABELS[
    normalizeMarketplaceOrderStatus(status)
  ];
}

export function getProductStatusLabel(status: ProductStatus) {
  return PRODUCT_STATUS_LABELS[status];
}

export function getOrderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status];
}

export function getCustomerStatusLabel(status: CustomerStatus) {
  return CUSTOMER_STATUS_LABELS[status];
}

export function getProductStatusBadgeClass(status: ProductStatus) {
  return PRODUCT_STATUS_BADGE_CLASS[status];
}

export function getOrderStatusBadgeClass(status: OrderStatus) {
  return ORDER_STATUS_BADGE_CLASS[status];
}

export function getCustomerStatusBadgeClass(status: CustomerStatus) {
  return CUSTOMER_STATUS_BADGE_CLASS[status];
}

export function getCustomerStatusDotClass(status: CustomerStatus) {
  return CUSTOMER_STATUS_DOT_CLASS[status];
}
