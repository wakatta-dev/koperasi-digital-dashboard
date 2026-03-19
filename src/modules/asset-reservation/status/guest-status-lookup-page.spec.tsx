/** @format */
// @vitest-environment jsdom

import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GuestStatusLookupPage } from "./guest-status-lookup-page";

const lookupMock = vi.fn();

vi.mock("next/font/google", () => ({
  Plus_Jakarta_Sans: () => ({ className: "font-plus-jakarta" }),
}));

vi.mock("@/components/shared/navigation/landing-navbar", () => ({
  LandingNavbar: () => <div>navbar</div>,
}));

vi.mock("../components/reservation-footer", () => ({
  AssetReservationFooter: () => <div>footer</div>,
}));

vi.mock("../hooks", () => ({
  useLookupReservationByTicket: () => lookupMock(),
  useCreateGuestPaymentSession: () => ({
    isPending: false,
    mutateAsync: vi.fn(),
  }),
  useUploadGuestPaymentProof: () => ({
    isPending: false,
    mutateAsync: vi.fn(),
  }),
}));

vi.mock("../guest/components/status/GuestRequestStatusFeature", () => ({
  GuestRequestStatusFeature: ({ result }: { result?: any | null }) => (
    <div>
      <div>result-ticket:{result?.ticketLabel ?? "-"}</div>
      <div>result-badge:{result?.badgeLabel ?? "-"}</div>
      <div>result-description:{result?.statusDescription ?? "-"}</div>
      <div>result-payment-href:{result?.paymentHref ?? "-"}</div>
    </div>
  ),
}));

vi.mock("../guest/components/status/UploadPaymentProofModalFeature", () => ({
  UploadPaymentProofModalFeature: () => <div>upload-proof-modal</div>,
}));

describe("GuestStatusLookupPage", () => {
  beforeEach(() => {
    lookupMock.mockReset();
  });

  it("maps reservation status to simplified public copy and stable ticket", () => {
    lookupMock.mockReturnValue({
      data: {
        reservation_id: 25,
        asset_name: "Balai Desa",
        renter_name: "Budi Santoso",
        renter_contact: "08123456789",
        start_date: "2026-03-20T08:00:00Z",
        end_date: "2026-03-20T15:00:00Z",
        status: "awaiting_payment_verification",
        amounts: { total: 500000, dp: 150000, remaining: 350000 },
      },
      mutate: vi.fn(),
      isPending: false,
    });

    render(<GuestStatusLookupPage />);

    expect(screen.getByText("result-ticket:#SQ-00025")).toBeTruthy();
    expect(screen.getByText("result-badge:Pembayaran Sedang Dicek")).toBeTruthy();
    expect(
      screen.getByText(
        "result-description:Bukti pembayaran Anda sudah diterima dan sedang dicek admin."
      )
    ).toBeTruthy();
  });

  it("does not force settlement status from local schedule heuristics", () => {
    lookupMock.mockReturnValue({
      data: {
        reservation_id: 26,
        asset_name: "Mobil Desa",
        renter_name: "Sari",
        renter_contact: "0812000000",
        start_date: "2026-03-13T10:00:00Z",
        end_date: "2026-03-13T15:00:00Z",
        status: "awaiting_dp",
        payment_flow: "dp",
        amounts: { total: 750000, dp: 300000, remaining: 450000 },
      },
      mutate: vi.fn(),
      isPending: false,
    });

    render(<GuestStatusLookupPage />);

    expect(screen.getByText("result-badge:Menunggu Pembayaran")).toBeTruthy();
  });

  it("provides settlement payment href once dp is confirmed", () => {
    lookupMock.mockReturnValue({
      data: {
        reservation_id: 27,
        asset_name: "Balai Desa",
        renter_name: "Sari",
        renter_contact: "0812000001",
        start_date: "2026-03-20T08:00:00Z",
        end_date: "2026-03-21T15:00:00Z",
        status: "confirmed_dp",
        payment_flow: "dp",
        guest_token: "token-27",
        amounts: { total: 750000, dp: 300000, remaining: 450000 },
      },
      mutate: vi.fn(),
      isPending: false,
    });

    render(<GuestStatusLookupPage />);

    expect(
      screen.getByText(
        "result-payment-href:/penyewaan-aset/payment?reservationId=27&type=settlement&sig=token-27",
      ),
    ).toBeTruthy();
  });
});
