/** @format */
// @vitest-environment jsdom

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AssetDetailPage } from "./asset-detail-page";

const useAssetDetailMock = vi.fn();
const mutateAsyncMock = vi.fn();
const checkAvailabilityMock = vi.fn();

const mockAsset = {
  id: 21,
  name: "Balai Desa",
  rate_amount: 500000,
  rate_type: "DAILY",
  availability_status: "Tersedia",
  location: "Pusat Desa",
  specifications: [],
};

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
  useAssetDetail: (...args: unknown[]) => useAssetDetailMock(...args),
  useCreateGuestReservation: () => ({
    isPending: false,
    mutateAsync: mutateAsyncMock,
  }),
}));

vi.mock("./utils/availability", () => ({
  checkAvailability: (...args: unknown[]) => checkAvailabilityMock(...args),
}));

vi.mock("../guest/components/application/GuestRentalApplicationFeature", () => ({
  GuestRentalApplicationFeature: ({
    onSubmit,
    onValuesChange,
  }: {
    onSubmit: () => void;
    onValuesChange: (next: Record<string, string>) => void;
  }) => {
    React.useEffect(() => {
      onValuesChange({
        fullName: "Budi Santoso",
        phone: "08123456789",
        email: "budi@example.com",
        purpose: "Rapat warga",
        startDate: "2026-03-10",
        endDate: "2026-03-11",
      });
    }, [onValuesChange]);

    return (
      <button type="button" onClick={onSubmit}>
        submit-rental
      </button>
    );
  },
}));

vi.mock("../guest/components/success/SubmissionSuccessCardFeature", () => ({
  SubmissionSuccessCardFeature: ({
    ticket,
    statusHref,
  }: {
    ticket: string;
    statusHref?: string;
  }) => (
    <div>
      <div>success-ticket:{ticket}</div>
      <div>success-status:{statusHref ?? "-"}</div>
    </div>
  ),
}));

describe("AssetDetailPage public reservation flow", () => {
  beforeEach(() => {
    useAssetDetailMock.mockReset();
    mutateAsyncMock.mockReset();
    checkAvailabilityMock.mockReset();

    useAssetDetailMock.mockReturnValue({
      data: mockAsset,
      isLoading: false,
      error: null,
    });
  });

  it("builds stable public success state after reservation submission", async () => {
    checkAvailabilityMock.mockResolvedValue({ ok: true });
    mutateAsyncMock.mockResolvedValue({
      reservation_id: 42,
      status: "pending_review",
      hold_expires_at: "2026-03-11T09:00:00Z",
      guest_token: "v1.2000000000.signature",
      amounts: {
        total: 500000,
        dp: 250000,
        remaining: 250000,
      },
    });

    render(<AssetDetailPage assetId="21" />);

    fireEvent.click(screen.getByRole("button", { name: "submit-rental" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        asset_id: 21,
        start_date: "2026-03-10",
        end_date: "2026-03-11",
        purpose: "Rapat warga",
        renter_name: "Budi Santoso",
        renter_contact: "08123456789",
        renter_email: "budi@example.com",
      });
    });

    expect(await screen.findByText("success-ticket:#SQ-00042")).toBeTruthy();
    expect(screen.getByText(/success-status:/).textContent).toContain(
      "/penyewaan-aset/status-reservasi?"
    );
    expect(screen.getByText(/success-status:/).textContent).toContain("id=42");
    expect(screen.getByText(/success-status:/).textContent).toContain(
      "sig=v1.2000000000.signature"
    );
  });

  it("shows public-friendly conflict message when selected schedule is unavailable", async () => {
    checkAvailabilityMock.mockResolvedValue({
      ok: false,
      suggestion: {
        start: "2026-03-15",
        end: "2026-03-16",
      },
    });

    render(<AssetDetailPage assetId="21" />);

    fireEvent.click(screen.getByRole("button", { name: "submit-rental" }));

    expect(
      await screen.findByText(
        "Tanggal yang Anda pilih sudah tidak tersedia. Coba jadwal lain, misalnya 2026-03-15 sampai 2026-03-16."
      )
    ).toBeTruthy();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });
});
