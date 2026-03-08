/** @format */

import { describe, expect, it } from "vitest";

import {
  assessPublicPaymentAccess,
  resolvePublicPaymentProofErrorMessage,
  resolvePublicPaymentSessionErrorMessage,
  validatePublicPaymentProofFile,
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

  it("validates public payment proof files", () => {
    expect(validatePublicPaymentProofFile(null)).toBe(
      "Pilih file bukti pembayaran terlebih dahulu."
    );

    expect(
      validatePublicPaymentProofFile(
        new File([new Uint8Array(8)], "proof.txt", { type: "text/plain" })
      )
    ).toBe("Format file belum didukung. Gunakan JPG, PNG, atau PDF.");

    expect(
      validatePublicPaymentProofFile(
        new File([new Uint8Array(8)], "proof.pdf", { type: "" })
      )
    ).toBeNull();

    expect(
      validatePublicPaymentProofFile(
        new File(
          [new Uint8Array(5 * 1024 * 1024 + 1)],
          "proof.pdf",
          { type: "application/pdf" }
        )
      )
    ).toBe("Ukuran file bukti pembayaran maksimal 5 MB.");
  });

  it("maps raw proof upload errors to public-friendly text", () => {
    expect(resolvePublicPaymentProofErrorMessage("invalid image")).toBe(
      "File bukti pembayaran tidak valid. Gunakan file yang dapat dibuka."
    );
    expect(
      resolvePublicPaymentProofErrorMessage("unsupported image format")
    ).toBe("Format file belum didukung. Gunakan JPG, PNG, atau PDF.");
    expect(resolvePublicPaymentProofErrorMessage("image too large")).toBe(
      "Ukuran file bukti pembayaran maksimal 5 MB."
    );
  });
});
