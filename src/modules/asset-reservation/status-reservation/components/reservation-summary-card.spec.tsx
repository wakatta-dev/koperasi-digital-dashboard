/** @format */
// @vitest-environment jsdom

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReservationSummaryCard } from "./reservation-summary-card";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe("ReservationSummaryCard", () => {
  it("shows ticket-formatted identifier and simplified public status copy", () => {
    render(
      <ReservationSummaryCard
        reservationId={42}
        accessToken="secure-token"
        reservation={{
          reservationId: 42,
          assetId: 9,
          assetName: "Balai Desa",
          status: "awaiting_payment_verification",
          startDate: "2026-03-20T08:00:00Z",
          endDate: "2026-03-20T15:00:00Z",
          renterName: "Budi Santoso",
          renterContact: "08123456789",
          amounts: {
            total: 500000,
            dp: 150000,
            remaining: 350000,
          },
        }}
      />
    );

    expect(screen.getAllByText("Pembayaran Sedang Dicek").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Bukti pembayaran Anda sudah diterima dan sedang dicek admin.")
    ).toBeTruthy();
    expect(screen.getByText("#SQ-00042")).toBeTruthy();
    expect(screen.queryByText(/^42$/)).toBeNull();
  });
});
