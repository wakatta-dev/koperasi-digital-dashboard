/** @format */

import { describe, expect, it } from "vitest";

import {
  canTransitionMarketplaceOrderStatus,
  getAllowedMarketplaceOrderTransitions,
  getBuyerMarketplaceStatusLabel,
  isLegacyMarketplaceStatus,
  normalizeMarketplaceOrderStatus,
} from "@/modules/marketplace/utils/order-status";

describe("marketplace canonical status mapping", () => {
  it("maps legacy statuses to canonical lifecycle states", () => {
    expect(normalizeMarketplaceOrderStatus("NEW")).toBe("PENDING_PAYMENT");
    expect(normalizeMarketplaceOrderStatus("PENDING")).toBe("PENDING_PAYMENT");
    expect(normalizeMarketplaceOrderStatus("PAID")).toBe(
      "PAYMENT_VERIFICATION",
    );
    expect(normalizeMarketplaceOrderStatus("SHIPPED")).toBe("IN_DELIVERY");
    expect(normalizeMarketplaceOrderStatus("DELIVERED")).toBe("COMPLETED");
    expect(normalizeMarketplaceOrderStatus("CANCELLED")).toBe("CANCELED");
  });

  it("keeps buyer-facing labels canonical even when legacy status is received", () => {
    const normalized = normalizeMarketplaceOrderStatus("PAID");
    expect(normalized).toBe("PAYMENT_VERIFICATION");
    expect(isLegacyMarketplaceStatus("PAID")).toBe(true);
    expect(getBuyerMarketplaceStatusLabel("PAID")).toBe(
      "Verifikasi Pembayaran",
    );
  });

  it("enforces valid lifecycle transitions", () => {
    expect(getAllowedMarketplaceOrderTransitions("PROCESSING")).toEqual([
      "IN_DELIVERY",
      "CANCELED",
    ]);
    expect(
      canTransitionMarketplaceOrderStatus("PENDING_PAYMENT", "PROCESSING"),
    ).toBe(false);
    expect(
      canTransitionMarketplaceOrderStatus(
        "PAYMENT_VERIFICATION",
        "PROCESSING",
      ),
    ).toBe(true);
    expect(
      canTransitionMarketplaceOrderStatus("IN_DELIVERY", "COMPLETED"),
    ).toBe(true);
  });
});
