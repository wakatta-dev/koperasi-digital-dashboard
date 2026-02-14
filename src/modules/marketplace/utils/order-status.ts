/** @format */

import type {
  MarketplaceOrderStatus,
  MarketplaceOrderStatusInput,
} from "@/types/api/marketplace";

export const CANONICAL_ORDER_STATUS_SEQUENCE: MarketplaceOrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_VERIFICATION",
  "PROCESSING",
  "IN_DELIVERY",
  "COMPLETED",
];

const LEGACY_TO_CANONICAL_STATUS_MAP: Record<string, MarketplaceOrderStatus> = {
  NEW: "PENDING_PAYMENT",
  PENDING: "PENDING_PAYMENT",
  PAID: "PAYMENT_VERIFICATION",
  SHIPPED: "IN_DELIVERY",
  DELIVERED: "COMPLETED",
  CANCELLED: "CANCELED",
  CANCELED: "CANCELED",
};

const ALLOWED_STATUS_TRANSITIONS: Record<
  MarketplaceOrderStatus,
  MarketplaceOrderStatus[]
> = {
  PENDING_PAYMENT: ["PAYMENT_VERIFICATION", "CANCELED"],
  PAYMENT_VERIFICATION: ["PROCESSING", "CANCELED"],
  PROCESSING: ["IN_DELIVERY", "CANCELED"],
  IN_DELIVERY: ["COMPLETED"],
  COMPLETED: [],
  CANCELED: [],
};

const BUYER_STATUS_LABELS: Record<MarketplaceOrderStatus, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAYMENT_VERIFICATION: "Verifikasi Pembayaran",
  PROCESSING: "Sedang Diproses",
  IN_DELIVERY: "Dalam Pengiriman",
  COMPLETED: "Selesai",
  CANCELED: "Dibatalkan",
};

const ADMIN_STATUS_LABELS: Record<MarketplaceOrderStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_VERIFICATION: "Payment Verification",
  PROCESSING: "Processing",
  IN_DELIVERY: "In Delivery",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export function isCanonicalMarketplaceOrderStatus(
  status: string,
): status is MarketplaceOrderStatus {
  return (
    status === "PENDING_PAYMENT" ||
    status === "PAYMENT_VERIFICATION" ||
    status === "PROCESSING" ||
    status === "IN_DELIVERY" ||
    status === "COMPLETED" ||
    status === "CANCELED"
  );
}

export function normalizeMarketplaceOrderStatus(
  status?: string | null,
): MarketplaceOrderStatus {
  const raw = (status ?? "").trim().toUpperCase();
  if (isCanonicalMarketplaceOrderStatus(raw)) {
    return raw;
  }
  return LEGACY_TO_CANONICAL_STATUS_MAP[raw] ?? "PENDING_PAYMENT";
}

export function getAllowedMarketplaceOrderTransitions(
  status?: MarketplaceOrderStatusInput | null,
) {
  const canonical = normalizeMarketplaceOrderStatus(status);
  return ALLOWED_STATUS_TRANSITIONS[canonical];
}

export function canTransitionMarketplaceOrderStatus(
  fromStatus: MarketplaceOrderStatusInput,
  toStatus: MarketplaceOrderStatusInput,
) {
  const fromCanonical = normalizeMarketplaceOrderStatus(fromStatus);
  const toCanonical = normalizeMarketplaceOrderStatus(toStatus);
  return ALLOWED_STATUS_TRANSITIONS[fromCanonical].includes(toCanonical);
}

export function getBuyerMarketplaceStatusLabel(
  status?: MarketplaceOrderStatusInput | null,
) {
  return BUYER_STATUS_LABELS[normalizeMarketplaceOrderStatus(status)];
}

export function getAdminMarketplaceStatusLabel(
  status?: MarketplaceOrderStatusInput | null,
) {
  return ADMIN_STATUS_LABELS[normalizeMarketplaceOrderStatus(status)];
}

export function isLegacyMarketplaceStatus(status?: string | null) {
  const raw = (status ?? "").trim().toUpperCase();
  return Boolean(raw) && !isCanonicalMarketplaceOrderStatus(raw);
}
