/** @format */
// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PaymentSidebar } from "./payment-sidebar";

describe("PaymentSidebar", () => {
  it("shows public ticket identifier instead of raw reservation id", () => {
    render(
      <PaymentSidebar
        reservation={{
          reservationId: 64,
          assetId: 3,
          status: "awaiting_dp",
          startDate: "2026-03-20",
          endDate: "2026-03-21",
          amounts: { total: 500000, dp: 150000, remaining: 350000 },
        }}
      />
    );

    expect(screen.getByText("Nomor Tiket: #SQ-00064")).toBeTruthy();
    expect(screen.queryByText(/ID Reservasi/i)).toBeNull();
  });
});
