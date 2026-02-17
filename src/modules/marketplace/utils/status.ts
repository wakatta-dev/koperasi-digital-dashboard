/** @format */

import type {
  CustomerStatus,
  OrderStatus,
  ProductStatus,
} from "@/modules/marketplace/types";
import type {
  MarketplaceManualPaymentStatus,
  MarketplaceOrderStatus,
  MarketplaceOrderStatusInput,
} from "@/types/api/marketplace";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  Tersedia: "Tersedia",
  Menipis: "Menipis",
  Habis: "Habis",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAYMENT_VERIFICATION: "Verifikasi Pembayaran",
  PROCESSING: "Diproses",
  IN_DELIVERY: "Dalam Pengiriman",
  COMPLETED: "Selesai",
  CANCELED: "Dibatalkan",
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
  PENDING_PAYMENT:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50",
  PAYMENT_VERIFICATION:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50",
  PROCESSING:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50",
  IN_DELIVERY:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50",
  COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/50",
  CANCELED:
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
  PENDING_PAYMENT: ["PAYMENT_VERIFICATION", "PROCESSING", "CANCELED"],
  PAYMENT_VERIFICATION: ["PROCESSING", "CANCELED"],
  PROCESSING: ["IN_DELIVERY", "COMPLETED", "CANCELED"],
  IN_DELIVERY: ["COMPLETED", "CANCELED"],
  COMPLETED: [],
  CANCELED: [],
};

export const MARKETPLACE_MANUAL_PAYMENT_STATUS_LABELS: Record<
  MarketplaceManualPaymentStatus,
  string
> = {
  MANUAL_PAYMENT_SUBMITTED: "Bukti Pembayaran Diterima",
  WAITING_MANUAL_CONFIRMATION: "Menunggu Verifikasi",
  CONFIRMED: "Pembayaran Terkonfirmasi",
  REJECTED: "Pembayaran Ditolak",
};

const LEGACY_TO_MANUAL_PAYMENT_STATUS_MAP: Record<
  string,
  MarketplaceManualPaymentStatus
> = {
  PENDING_PAYMENT: "MANUAL_PAYMENT_SUBMITTED",
  PAYMENT_VERIFICATION: "CONFIRMED",
  CANCELED: "REJECTED",
  CANCELLED: "REJECTED",
};

export type MarketplaceOrderFilterValue = "all" | MarketplaceOrderStatus;

export const MARKETPLACE_ORDER_FILTER_OPTIONS: ReadonlyArray<{
  value: MarketplaceOrderFilterValue;
  label: string;
}> = [
  { value: "all", label: "Semua Status" },
  { value: "PENDING_PAYMENT", label: "Menunggu Pembayaran" },
  { value: "PAYMENT_VERIFICATION", label: "Verifikasi Pembayaran" },
  { value: "PROCESSING", label: "Diproses" },
  { value: "IN_DELIVERY", label: "Dalam Pengiriman" },
  { value: "COMPLETED", label: "Selesai" },
  { value: "CANCELED", label: "Dibatalkan" },
];

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

export function isMarketplaceTransitionReasonRequired(
  fromStatus?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
  toStatus?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
) {
  const from = normalizeMarketplaceOrderStatus(fromStatus);
  const to = normalizeMarketplaceOrderStatus(toStatus);

  if (to === "CANCELED") {
    return true;
  }

  return from === "PROCESSING" && to === "COMPLETED";
}

export function normalizeMarketplaceManualPaymentStatus(
  status?: MarketplaceManualPaymentStatus | string | null,
): MarketplaceManualPaymentStatus {
  const normalized = (status ?? "").trim().toUpperCase();
  if (!normalized) {
    return "MANUAL_PAYMENT_SUBMITTED";
  }
  if (normalized in MARKETPLACE_MANUAL_PAYMENT_STATUS_LABELS) {
    return normalized as MarketplaceManualPaymentStatus;
  }
  return LEGACY_TO_MANUAL_PAYMENT_STATUS_MAP[normalized] ?? "MANUAL_PAYMENT_SUBMITTED";
}

export function getMarketplaceManualPaymentStatusLabel(
  status?: MarketplaceManualPaymentStatus | string | null,
) {
  return MARKETPLACE_MANUAL_PAYMENT_STATUS_LABELS[
    normalizeMarketplaceManualPaymentStatus(status)
  ];
}

export function getMarketplaceCanonicalStatusLabel(
  status?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
) {
  return MARKETPLACE_CANONICAL_STATUS_LABELS[
    normalizeMarketplaceOrderStatus(status)
  ];
}

export function getMarketplaceTransitionOptions(
  status?: MarketplaceOrderStatusInput | MarketplaceOrderStatus | string | null,
) {
  const canonical = normalizeMarketplaceOrderStatus(status);
  return MARKETPLACE_ALLOWED_STATUS_TRANSITIONS[canonical].map((nextStatus) => ({
    value: nextStatus,
    label: getMarketplaceCanonicalStatusLabel(nextStatus),
  }));
}

export function mapMarketplaceStatusFilterToQuery(
  filterValue?: MarketplaceOrderFilterValue | string | null,
) {
  const raw = (filterValue ?? "").trim().toUpperCase();

  if (!raw || raw === "ALL") {
    return undefined;
  }

  if (raw in MARKETPLACE_CANONICAL_STATUS_LABELS) {
    return raw as MarketplaceOrderStatus;
  }

  if (raw in LEGACY_TO_CANONICAL_STATUS_MAP) {
    return LEGACY_TO_CANONICAL_STATUS_MAP[raw];
  }

  return undefined;
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
