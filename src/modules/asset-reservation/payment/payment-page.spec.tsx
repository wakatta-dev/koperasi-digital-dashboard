/** @format */
// @vitest-environment jsdom

import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AssetPaymentPage } from "./payment-page";

const useReservationMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

vi.mock("./shared/payment-shell", () => ({
  PaymentShell: ({
    error,
    info,
    methods,
  }: {
    error?: string | null;
    info?: React.ReactNode;
    methods?: React.ReactNode;
  }) => (
    <div>
      {info}
      {error ? <div>shell-error:{error}</div> : null}
      {methods}
    </div>
  ),
}));

vi.mock("./components/payment-breadcrumb", () => ({
  PaymentBreadcrumb: () => <div>breadcrumb</div>,
}));

vi.mock("./components/payment-header", () => ({
  PaymentHeader: () => <div>header</div>,
}));

vi.mock("./components/rental-summary-card", () => ({
  RentalSummaryCard: () => <div>summary-card</div>,
}));

vi.mock("./components/payment-methods", () => ({
  PaymentMethods: () => <div>payment-methods</div>,
}));

vi.mock("./components/payment-sidebar", () => ({
  PaymentSidebar: () => <div>payment-sidebar</div>,
}));

vi.mock("../hooks", () => ({
  useReservation: (...args: unknown[]) => useReservationMock(...args),
}));

describe("AssetPaymentPage public access gating", () => {
  beforeEach(() => {
    useReservationMock.mockReset();
  });

  it("blocks payment flow when reservation is still pending review", () => {
    useReservationMock.mockReturnValue({
      data: {
        reservationId: 41,
        status: "pending_review",
        amounts: { total: 500000, dp: 150000, remaining: 350000 },
      },
      isLoading: false,
      error: null,
    });

    render(
      <AssetPaymentPage reservationId={41} mode="dp" ownershipToken="token-1" />
    );

    expect(
      screen.getByText(
        "shell-error:Pengajuan Anda masih ditinjau admin. Pembayaran baru tersedia setelah pengajuan disetujui."
      )
    ).toBeTruthy();
    expect(screen.queryByText("payment-methods")).toBeNull();
  });

  it("shows payment methods when reservation is eligible for dp payment", () => {
    useReservationMock.mockReturnValue({
      data: {
        reservationId: 41,
        status: "awaiting_dp",
        amounts: { total: 500000, dp: 150000, remaining: 350000 },
      },
      isLoading: false,
      error: null,
    });

    render(
      <AssetPaymentPage reservationId={41} mode="dp" ownershipToken="token-1" />
    );

    expect(screen.queryByText(/shell-error:/)).toBeNull();
    expect(screen.getByText("payment-methods")).toBeTruthy();
  });
});
