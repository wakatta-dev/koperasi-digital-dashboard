/** @format */

import { describe, expect, it } from "vitest";

import { normalizeOrderStatus } from "@/modules/marketplace/order/utils";
import {
  getMarketplaceCanonicalStatusLabel,
  isLegacyMarketplaceOrderStatus,
  isMarketplaceTransitionAllowed,
  normalizeMarketplaceOrderStatus,
} from "@/modules/marketplace/utils/status";

describe("marketplace status canonicalization", () => {
  it("maps legacy statuses into canonical statuses", () => {
    expect(normalizeMarketplaceOrderStatus("NEW")).toBe("PENDING_PAYMENT");
    expect(normalizeMarketplaceOrderStatus("PENDING")).toBe(
      "PENDING_PAYMENT",
    );
    expect(normalizeMarketplaceOrderStatus("PAID")).toBe(
      "PAYMENT_VERIFICATION",
    );
    expect(normalizeMarketplaceOrderStatus("SHIPPED")).toBe("IN_DELIVERY");
    expect(normalizeMarketplaceOrderStatus("cancelled")).toBe("CANCELED");
  });

  it("returns canonical label from either canonical or legacy status", () => {
    expect(getMarketplaceCanonicalStatusLabel("PAYMENT_VERIFICATION")).toBe(
      "Verifikasi Pembayaran",
    );
    expect(getMarketplaceCanonicalStatusLabel("PAID")).toBe(
      "Verifikasi Pembayaran",
    );
  });

  it("guards transition rules for canonical lifecycle", () => {
    expect(
      isMarketplaceTransitionAllowed("PENDING_PAYMENT", "PAYMENT_VERIFICATION"),
    ).toBe(true);
    expect(isMarketplaceTransitionAllowed("PROCESSING", "COMPLETED")).toBe(
      false,
    );
    expect(isMarketplaceTransitionAllowed("IN_DELIVERY", "COMPLETED")).toBe(
      true,
    );
  });

  it("flags legacy statuses so buyer payload checks can fail fast", () => {
    expect(isLegacyMarketplaceOrderStatus("NEW")).toBe(true);
    expect(isLegacyMarketplaceOrderStatus("PAID")).toBe(true);
    expect(isLegacyMarketplaceOrderStatus("IN_DELIVERY")).toBe(false);
  });

  it("does not expose legacy statuses after buyer normalization", () => {
    const legacyInputs = ["NEW", "PENDING", "PAID", "SHIPPED", "CANCELLED"];

    legacyInputs.forEach((status) => {
      const canonical = normalizeMarketplaceOrderStatus(status);
      expect(isLegacyMarketplaceOrderStatus(canonical)).toBe(false);
    });
  });

  it("keeps order runtime normalization aligned with canonical source", () => {
    expect(normalizeOrderStatus("PAID")).toBe("PAYMENT_VERIFICATION");
    expect(normalizeOrderStatus("SHIPPED")).toBe("IN_DELIVERY");
  });
});
