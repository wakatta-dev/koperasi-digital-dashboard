/** @format */

import { describe, expect, it } from "vitest";

import { createSignedReservationLink } from "@/modules/asset-reservation/utils/signed-link";

describe("asset-rental guest link security", () => {
  it("builds backend-verified link using guest token without local signature fallback", async () => {
    const link = await createSignedReservationLink({
      reservationId: 42,
      status: "pending_review",
      guestToken: "v1.2000000000.signature",
    });

    expect(link.url).toContain("/penyewaan-aset/status?");
    expect(link.url).toContain("id=42");
    expect(link.url).toContain("sig=v1.2000000000.signature");
    expect(link.url).toContain("state=dp");
    expect(link).not.toHaveProperty("signature");
  });

  it("falls back to the shared guest lookup page when backend guest token is unavailable", async () => {
    const link = await createSignedReservationLink({
      reservationId: 7,
      status: "confirmed_full",
    });

    expect(link.url).toBe("/penyewaan-aset/status");
  });
});
