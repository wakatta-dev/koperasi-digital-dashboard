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

export const BUYER_ORDER_CONTEXT_TTL_MS = 24 * 60 * 60 * 1000;

export type BuyerOrderContextState = "fresh" | "stale" | "invalid" | "missing";
export type BuyerOrderContextReadResult = {
  context: BuyerOrderContext | null;
  state: BuyerOrderContextState;
  ageMs?: number;
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

function parseBuyerOrderContext(raw: string): BuyerOrderContext | null {
  try {
    return JSON.parse(raw) as BuyerOrderContext;
  } catch {
    return null;
  }
}

function resolveContextAgeMs(
  context: BuyerOrderContext,
  now: number
): number | null {
  const submittedAt = context.checkout?.submittedAt;
  if (!Number.isFinite(submittedAt) || submittedAt <= 0) {
    return null;
  }
  return Math.max(0, now - submittedAt);
}

export function readBuyerOrderContext(
  orderId: number,
  options?: { ttlMs?: number; now?: number }
): BuyerOrderContextReadResult {
  if (!isBrowser() || !orderId) {
    return { context: null, state: "missing" };
  }

  const key = buildStorageKey(orderId);
  const raw = window.sessionStorage.getItem(key);
  if (!raw) {
    return { context: null, state: "missing" };
  }

  const parsed = parseBuyerOrderContext(raw);
  if (!parsed?.order?.id || !parsed?.checkout) {
    window.sessionStorage.removeItem(key);
    return { context: null, state: "invalid" };
  }

  const now = options?.now ?? Date.now();
  const maxAgeMs = options?.ttlMs ?? BUYER_ORDER_CONTEXT_TTL_MS;
  const ageMs = resolveContextAgeMs(parsed, now);

  if (ageMs === null) {
    window.sessionStorage.removeItem(key);
    return { context: null, state: "invalid" };
  }
  if (ageMs > maxAgeMs) {
    window.sessionStorage.removeItem(key);
    return { context: null, state: "stale", ageMs };
  }

  return { context: parsed, state: "fresh", ageMs };
}

export function getBuyerOrderContext(
  orderId: number,
  options?: { ttlMs?: number; now?: number }
): BuyerOrderContext | null {
  return readBuyerOrderContext(orderId, options).context;
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
