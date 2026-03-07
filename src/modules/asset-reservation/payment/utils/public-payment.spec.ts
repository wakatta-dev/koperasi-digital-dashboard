/** @format */

import { describe, expect, it } from "vitest";

import {
  assessPublicPaymentAccess,
  resolvePublicPaymentSessionErrorMessage,
} from "./public-payment";

describe("public payment access helpers", () => {
  it("allows DP payment only for awaiting_dp status", () => {
    expect(assessPublicPaymentAccess("awaiting_dp", "dp")).toEqual({
      allowed: true,
    });
    expect(assessPublicPaymentAccess("pending_review", "dp")).toEqual({
      allowed: false,
      message:
        "Pengajuan Anda masih ditinjau admin. Pembayaran baru tersedia setelah pengajuan disetujui.",
    });
  });

  it("allows settlement only after dp-confirmed or awaiting-settlement status", () => {
    expect(assessPublicPaymentAccess("confirmed_dp", "settlement")).toEqual({
      allowed: true,
    });
    expect(assessPublicPaymentAccess("awaiting_settlement", "settlement")).toEqual({
      allowed: true,
    });
    expect(assessPublicPaymentAccess("awaiting_dp", "settlement")).toEqual({
      allowed: false,
      message:
        "Reservasi ini masih menunggu pembayaran DP. Selesaikan DP terlebih dahulu sebelum melanjutkan ke pelunasan.",
    });
  });

  it("maps raw payment session errors to public-friendly text", () => {
    expect(resolvePublicPaymentSessionErrorMessage("invalid input")).toBe(
      "Reservasi ini belum berada pada tahap pembayaran yang sesuai."
    );
    expect(
      resolvePublicPaymentSessionErrorMessage("invalid booking status transition")
    ).toBe(
      "Tahap pembayaran reservasi sudah berubah. Muat ulang status reservasi terbaru sebelum melanjutkan."
    );
    expect(
      resolvePublicPaymentSessionErrorMessage("forbidden ownership")
    ).toBe("Tautan pembayaran tidak valid atau sudah tidak berlaku.");
  });
});
