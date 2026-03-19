/** @format */

import { describe, expect, it } from "vitest";

import { resolveAssetRentalBookingStatus } from "./asset-rental-booking-status";

describe("resolveAssetRentalBookingStatus", () => {
  it("prefers canonical booking_state over legacy status", () => {
    const resolved = resolveAssetRentalBookingStatus({
      status: "BOOKED",
      booking_state: "pending_review",
      latest_payment: {
        id: "pay-1",
        amount: 100000,
        status: "initiated",
      },
    });

    expect(resolved).toBe("PENDING_REVIEW");
  });

  it("still surfaces awaiting payment verification when payment is pending verification", () => {
    const resolved = resolveAssetRentalBookingStatus({
      status: "AWAITING_DP",
      booking_state: "awaiting_dp",
      payment_state: "pending_verification",
      latest_payment: {
        id: "pay-2",
        amount: 100000,
        status: "pending_verification",
      },
    });

    expect(resolved).toBe("AWAITING_PAYMENT_VERIFICATION");
  });
});
