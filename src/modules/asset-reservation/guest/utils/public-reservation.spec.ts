/** @format */

import { describe, expect, it } from "vitest";

import {
  buildAvailabilityConflictMessage,
  buildPublicReservationSuccessState,
  resolvePublicReservationSubmissionErrorMessage,
} from "./public-reservation";

describe("public reservation helpers", () => {
  it("builds secure status link when guest token is available", async () => {
    const result = await buildPublicReservationSuccessState({
      reservation_id: 42,
      status: "pending_review",
      hold_expires_at: "2026-03-09T09:00:00Z",
      guest_token: "v1.2000000000.signature",
      amounts: {
        total: 300000,
        dp: 150000,
        remaining: 150000,
      },
    });

    expect(result.ticket).toBe("#SQ-00042");
    expect(result.statusHref).toContain("/penyewaan-aset/status-reservasi?");
    expect(result.statusHref).toContain("id=42");
    expect(result.statusHref).toContain("sig=v1.2000000000.signature");
  });

  it("omits secure status link when backend guest token is unavailable", async () => {
    const result = await buildPublicReservationSuccessState({
      reservation_id: 7,
      status: "pending_review",
      hold_expires_at: "2026-03-09T09:00:00Z",
      amounts: {
        total: 100000,
        dp: 50000,
        remaining: 50000,
      },
    });

    expect(result.ticket).toBe("#SQ-00007");
    expect(result.statusHref).toBeUndefined();
  });

  it("maps backend canonical errors to public-friendly messages", () => {
    expect(
      resolvePublicReservationSubmissionErrorMessage(
        "booking overlaps with existing schedule"
      )
    ).toBe(
      "Tanggal yang Anda pilih sudah tidak tersedia. Silakan pilih jadwal lain."
    );

    expect(
      resolvePublicReservationSubmissionErrorMessage("asset not found")
    ).toBe(
      "Aset ini sudah tidak tersedia untuk diajukan. Silakan pilih aset lain yang tersedia."
    );

    expect(
      resolvePublicReservationSubmissionErrorMessage("invalid input")
    ).toBe("Mohon lengkapi data pengajuan dengan benar sebelum dikirim.");
  });

  it("adds next suggestion when availability response provides one", () => {
    expect(
      buildAvailabilityConflictMessage({
        suggestion: {
          start: "2026-03-15",
          end: "2026-03-16",
        },
      })
    ).toBe(
      "Tanggal yang Anda pilih sudah tidak tersedia. Coba jadwal lain, misalnya 2026-03-15 sampai 2026-03-16."
    );
  });
});
