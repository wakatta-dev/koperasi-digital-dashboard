/** @format */

import { describe, expect, it } from "vitest";

import {
  formatPublicReservationIdentifier,
  resolvePublicReservationStatusPresentation,
} from "./public-status";

describe("public reservation status presentation", () => {
  it("maps internal payment verification state to a simplified public label", () => {
    expect(
      resolvePublicReservationStatusPresentation("awaiting_payment_verification")
    ).toMatchObject({
      variant: "verifying",
      badgeLabel: "Pembayaran Sedang Dicek",
      shortLabel: "Pembayaran Sedang Dicek",
    });
  });

  it("maps full confirmation to ready-for-use public messaging", () => {
    expect(resolvePublicReservationStatusPresentation("confirmed_full")).toMatchObject({
      variant: "approved",
      badgeLabel: "Siap Digunakan",
      headline: "Reservasi Siap Digunakan",
    });
  });

  it("falls back safely for unknown statuses", () => {
    expect(resolvePublicReservationStatusPresentation("legacy_unknown")).toMatchObject({
      badgeLabel: "Sedang Ditinjau",
      variant: "verifying",
    });
  });

  it("formats public reservation identifier as a ticket", () => {
    expect(formatPublicReservationIdentifier(42)).toBe("#SQ-00042");
    expect(formatPublicReservationIdentifier("17")).toBe("#SQ-00017");
  });
});
