/** @format */

import { describe, expect, it } from "vitest";

import {
  isMarketplaceTransitionReasonRequired,
  normalizeMarketplaceOrderStatus,
} from "@/modules/marketplace/utils/status";

describe("marketplace status transition reason rules", () => {
  it("requires reason for cancel transitions", () => {
    expect(
      isMarketplaceTransitionReasonRequired("PENDING_PAYMENT", "CANCELED")
    ).toBe(true);
    expect(
      isMarketplaceTransitionReasonRequired("PAYMENT_VERIFICATION", "CANCELED")
    ).toBe(true);
    expect(
      isMarketplaceTransitionReasonRequired("PROCESSING", "CANCELED")
    ).toBe(true);
    expect(
      isMarketplaceTransitionReasonRequired("IN_DELIVERY", "CANCELED")
    ).toBe(true);
  });

  it("requires reason for processing to completed", () => {
    expect(
      isMarketplaceTransitionReasonRequired("PROCESSING", "COMPLETED")
    ).toBe(true);
  });

  it("does not require reason for non risky transitions", () => {
    expect(
      isMarketplaceTransitionReasonRequired("PENDING_PAYMENT", "PAYMENT_VERIFICATION")
    ).toBe(false);
    expect(
      isMarketplaceTransitionReasonRequired("PAYMENT_VERIFICATION", "PROCESSING")
    ).toBe(false);
    expect(
      isMarketplaceTransitionReasonRequired("IN_DELIVERY", "COMPLETED")
    ).toBe(false);
  });

  it("keeps canonical normalization stable for legacy aliases", () => {
    expect(normalizeMarketplaceOrderStatus("cancelled")).toBe("CANCELED");
    expect(normalizeMarketplaceOrderStatus("paid")).toBe("PAYMENT_VERIFICATION");
  });
});
