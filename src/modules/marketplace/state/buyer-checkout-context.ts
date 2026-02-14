/** @format */

import type {
  MarketplaceOrderManualPaymentResponse,
  MarketplaceOrderResponse,
} from "@/types/api/marketplace";

const STORAGE_KEY_PREFIX = "marketplace:buyer-order:";

export type BuyerCheckoutSnapshot = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  shippingOption: string;
  paymentMethod: string;
  bankOption?: string;
  submittedAt: number;
};

export type BuyerOrderContext = {
  order: MarketplaceOrderResponse;
  checkout: BuyerCheckoutSnapshot;
  manualPayment?: {
    status: string;
    proofUrl?: string;
    proofFilename?: string;
    submittedAt: number;
  };
};

function buildStorageKey(orderId: number) {
  return `${STORAGE_KEY_PREFIX}${orderId}`;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function saveBuyerOrderContext(context: BuyerOrderContext) {
  if (!isBrowser() || !context?.order?.id) {
    return;
  }
  window.sessionStorage.setItem(
    buildStorageKey(context.order.id),
    JSON.stringify(context)
  );
}

export function getBuyerOrderContext(orderId: number): BuyerOrderContext | null {
  if (!isBrowser() || !orderId) {
    return null;
  }
  const raw = window.sessionStorage.getItem(buildStorageKey(orderId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as BuyerOrderContext;
  } catch {
    return null;
  }
}

export function attachBuyerManualPayment(
  orderId: number,
  payment: MarketplaceOrderManualPaymentResponse
) {
  if (!isBrowser() || !orderId) {
    return;
  }
  const existing = getBuyerOrderContext(orderId);
  if (!existing) {
    return;
  }
  const next: BuyerOrderContext = {
    ...existing,
    manualPayment: {
      status: payment.status,
      proofUrl: payment.proof_url,
      proofFilename: payment.proof_filename,
      submittedAt: Date.now(),
    },
  };
  saveBuyerOrderContext(next);
}

export function clearBuyerOrderContext(orderId: number) {
  if (!isBrowser() || !orderId) {
    return;
  }
  window.sessionStorage.removeItem(buildStorageKey(orderId));
}
