/** @format */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderFeature } from "@/__tests__/modules/asset-rental/test-utils";
import { FeatureOperationalTraceWorkbench } from "./FeatureOperationalTraceWorkbench";

const useMarketplaceOrdersMock = vi.fn();
const useMarketplaceOrderMock = vi.fn();
const getAssetRentalBookingsMock = vi.fn();
const getReservationMock = vi.fn();

vi.mock("@/hooks/queries/marketplace-orders", () => ({
  useMarketplaceOrders: (...args: unknown[]) => useMarketplaceOrdersMock(...args),
  useMarketplaceOrder: (...args: unknown[]) => useMarketplaceOrderMock(...args),
}));

vi.mock("@/services/api/asset-rental", () => ({
  getAssetRentalBookings: (...args: unknown[]) => getAssetRentalBookingsMock(...args),
}));

vi.mock("@/services/api/reservations", () => ({
  getReservation: (...args: unknown[]) => getReservationMock(...args),
}));

describe("FeatureOperationalTraceWorkbench", () => {
  beforeEach(() => {
    useMarketplaceOrdersMock.mockReturnValue({
      data: {
        items: [
          {
            id: 11,
            order_number: "INV-2026-0001",
            status: "PROCESSING",
            payment_status: "succeeded",
            fulfillment_method: "DELIVERY",
            customer_name: "Budi",
            customer_phone: "08123",
            customer_email: "budi@example.com",
            total: 100000,
            created_at: 1,
            accounting_readiness: {
              status: "ready",
              reason: "Siap posting",
              reference: "MP-INV-2026-0001",
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    useMarketplaceOrderMock.mockReturnValue({
      data: {
        manual_payment: { proof_url: "https://example.com/proof-marketplace.jpg" },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    getAssetRentalBookingsMock.mockResolvedValue({
      success: true,
      data: [
        {
          id: 22,
          asset_id: 8,
          asset_name: "Gedung",
          renter_name: "Karang Taruna",
          status: "AWAITING_SETTLEMENT",
          total_amount: 500000,
          latest_payment: { id: "pay-22", amount: 200000, status: "pending_verification" },
          accounting_readiness: {
            status: "not_ready",
            reason: "Menunggu settlement",
            reference: "RSV-000022",
          },
          start_time: 1,
          end_time: 2,
        },
      ],
    });

    getReservationMock.mockResolvedValue({
      success: true,
      data: {
        reservation_id: 22,
        latest_payment: { proof_url: "https://example.com/proof-rental.jpg" },
      },
    });
  });

  it("renders unified finance trace rows and detail panel", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getByText("Operational Subledger Trace")).toBeTruthy();
      expect(screen.getAllByText("MP-INV-2026-0001").length).toBeGreaterThan(0);
      expect(screen.getAllByText("RSV-000022").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Siap Ditinjau").length).toBeGreaterThan(0);
      expect(screen.getByText("Belum Siap")).toBeTruthy();
      expect(screen.getByText("Perlu Rekonsiliasi")).toBeTruthy();
      expect(screen.getByText("Sinkron")).toBeTruthy();
      expect(screen.getByText("Layak lapor 1")).toBeTruthy();
      expect(screen.getByText("Reporting Basis Snapshot")).toBeTruthy();
      expect(screen.getByText("Follow-up Queue")).toBeTruthy();
      expect(screen.getByText("Aktif 1")).toBeTruthy();
      expect(screen.getAllByText("Siap Dilaporkan").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Tahan Pelaporan").length).toBeGreaterThan(0);
      expect(screen.getByText("Lihat Bukti Pembayaran")).toBeTruthy();
    });
  });

  it("filters rows that need reconciliation follow-up", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getAllByText("RSV-000022").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole("button", { name: "Perlu Rekonsiliasi" }));

    await waitFor(() => {
      expect(screen.getAllByText("RSV-000022").length).toBeGreaterThan(0);
      expect(screen.queryByText("MP-INV-2026-0001")).toBeFalsy();
    });
  });

  it("filters follow-up queue by context", async () => {
    renderFeature(<FeatureOperationalTraceWorkbench />);

    await waitFor(() => {
      expect(screen.getByText("Follow-up Queue")).toBeTruthy();
      expect(screen.getByText("Perlu follow-up pembayaran: Menunggu Verifikasi.")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Accounting" }));

    await waitFor(() => {
      expect(
        screen.getByText("Tidak ada transaksi aktif yang membutuhkan tindak lanjut pada scope ini."),
      ).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Pembayaran" }));

    await waitFor(() => {
      expect(screen.getByText("Perlu follow-up pembayaran: Menunggu Verifikasi.")).toBeTruthy();
    });
  });
});
