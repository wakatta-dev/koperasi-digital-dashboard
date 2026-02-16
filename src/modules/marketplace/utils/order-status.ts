/** @format */

import type {
  MarketplaceOrderStatus,
  MarketplaceOrderStatusInput,
} from "@/types/api/marketplace";
import { MARKETPLACE_CANONICAL_ORDER_STATUSES } from "@/types/api/marketplace";
import {
  MARKETPLACE_ALLOWED_STATUS_TRANSITIONS,
  MARKETPLACE_CANONICAL_STATUS_LABELS,
  getMarketplaceCanonicalStatusLabel,
  isLegacyMarketplaceOrderStatus,
  isMarketplaceTransitionAllowed,
  normalizeMarketplaceOrderStatus as normalizeMarketplaceOrderStatusFromStatusUtils,
} from "@/modules/marketplace/utils/status";

export const CANONICAL_ORDER_STATUS_SEQUENCE: MarketplaceOrderStatus[] =
  MARKETPLACE_CANONICAL_ORDER_STATUSES.filter(
    (status): status is Exclude<MarketplaceOrderStatus, "CANCELED"> =>
      status !== "CANCELED",
  );

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
  return status in MARKETPLACE_CANONICAL_STATUS_LABELS;
}

export function normalizeMarketplaceOrderStatus(
  status?: string | null,
): MarketplaceOrderStatus {
  return normalizeMarketplaceOrderStatusFromStatusUtils(status);
}

export function getAllowedMarketplaceOrderTransitions(
  status?: MarketplaceOrderStatusInput | null,
) {
  const canonical = normalizeMarketplaceOrderStatus(status);
  return MARKETPLACE_ALLOWED_STATUS_TRANSITIONS[canonical];
}

export function canTransitionMarketplaceOrderStatus(
  fromStatus: MarketplaceOrderStatusInput,
  toStatus: MarketplaceOrderStatusInput,
) {
  return isMarketplaceTransitionAllowed(fromStatus, toStatus);
}

export function getBuyerMarketplaceStatusLabel(
  status?: MarketplaceOrderStatusInput | null,
) {
  return getMarketplaceCanonicalStatusLabel(status);
}

export function getAdminMarketplaceStatusLabel(
  status?: MarketplaceOrderStatusInput | null,
) {
  return ADMIN_STATUS_LABELS[normalizeMarketplaceOrderStatus(status)];
}

export function isLegacyMarketplaceStatus(status?: string | null) {
  return isLegacyMarketplaceOrderStatus(status);
}
