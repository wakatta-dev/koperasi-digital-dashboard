/** @format */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderFeature } from "@/__tests__/modules/asset-rental/test-utils";
import { AssetRentalAdminDetailPage } from "./asset-rental-admin-detail-page";

const getAssetRentalBookingsMock = vi.fn();
const updateAssetBookingStatusMock = vi.fn();
const completeAssetBookingMock = vi.fn();
const getAssetByIdMock = vi.fn();
const getReservationMock = vi.fn();
const finalizePaymentMock = vi.fn();

vi.mock("@/services/api/asset-rental", () => ({
  getAssetRentalBookings: (...args: unknown[]) =>
    getAssetRentalBookingsMock(...args),
  updateAssetBookingStatus: (...args: unknown[]) =>
    updateAssetBookingStatusMock(...args),
  completeAssetBooking: (...args: unknown[]) =>
    completeAssetBookingMock(...args),
}));

vi.mock("@/services/api/assets", () => ({
  getAssetById: (...args: unknown[]) => getAssetByIdMock(...args),
}));

vi.mock("@/services/api/reservations", () => ({
  getReservation: (...args: unknown[]) => getReservationMock(...args),
  finalizePayment: (...args: unknown[]) => finalizePaymentMock(...args),
}));

describe("AssetRentalAdminDetailPage", () => {
  beforeEach(() => {
    getAssetRentalBookingsMock.mockReset();
    updateAssetBookingStatusMock.mockReset();
    completeAssetBookingMock.mockReset();
    getAssetByIdMock.mockReset();
    getReservationMock.mockReset();
    finalizePaymentMock.mockReset();

    getAssetRentalBookingsMock.mockResolvedValue({
      success: true,
      data: [
        {
          id: 501,
          asset_id: 10,
          asset_name: "Gedung Serbaguna Desa",
          renter_name: "Karang Taruna",
          renter_contact: "08123456789",
          renter_email: "karangtaruna@example.com",
          purpose: "Pelatihan UMKM",
          start_time: 1762732800,
          end_time: 1762819200,
          status: "AWAITING_PAYMENT_VERIFICATION",
          total_amount: 750000,
          created_at: 1762600000,
          updated_at: 1762650000,
          accounting_readiness: {
            status: "not_ready",
            reason:
              "Accounting menunggu kepastian pembayaran atau status rental yang lebih lanjut.",
            reference: "RSV-000501",
          },
          latest_payment: {
            id: "pay-501",
            status: "pending_verification",
            type: "dp",
            method: "manual_transfer",
            amount: 300000,
            proof_url: "https://example.com/proof.jpg",
            proof_note: "Transfer DP sudah dikirim",
            updated_at: 1762653600,
          },
        },
      ],
    });

    getAssetByIdMock.mockResolvedValue({
      success: true,
      data: {
        id: 10,
        name: "Gedung Serbaguna Desa",
        rate_type: "DAILY",
        rate_amount: 750000,
        description: "Lokasi: Kompleks Balai Desa",
      },
    });

    getReservationMock.mockResolvedValue({
      success: true,
      data: {
        reservation_id: 501,
        asset_id: 10,
        asset_name: "Gedung Serbaguna Desa",
        renter_name: "Karang Taruna",
        renter_contact: "08123456789",
        renter_email: "karangtaruna@example.com",
        purpose: "Pelatihan UMKM",
        start_date: "2025-11-10",
        end_date: "2025-11-11",
        status: "awaiting_payment_verification",
        amounts: { total: 750000, dp: 300000, remaining: 450000 },
        accounting_readiness: {
          status: "not_ready",
          reason:
            "Accounting menunggu kepastian pembayaran atau status rental yang lebih lanjut.",
          reference: "RSV-000501",
        },
        latest_payment: {
          id: "pay-501",
          status: "pending_verification",
          type: "dp",
          method: "manual_transfer",
          amount: 300000,
          proof_url: "https://example.com/proof.jpg",
          proof_note: "Transfer DP sudah dikirim",
          updated_at: 1762653600,
        },
        timeline: [
          {
            event: "reservation_created",
            at: "2025-11-08T09:00:00Z",
            meta: { status: "pending_review" },
          },
          {
            event: "payment_completed",
            at: "2025-11-08T12:00:00Z",
            meta: { status: "awaiting_payment_verification", type: "dp" },
          },
        ],
      },
    });

    updateAssetBookingStatusMock.mockResolvedValue({ success: true, data: {} });
    completeAssetBookingMock.mockResolvedValue({ success: true, data: {} });
    finalizePaymentMock.mockResolvedValue({ success: true, data: {} });
  });

  it("renders rental workspace with separated operational and payment states", async () => {
    renderFeature(
      <AssetRentalAdminDetailPage bookingId="501" section="pengajuan" />,
    );

    await waitFor(() => {
      expect(screen.getByText("Workspace Transaksi Rental")).toBeTruthy();
      expect(screen.getByText("Status Operasional")).toBeTruthy();
      expect(screen.getByText("Status Pembayaran")).toBeTruthy();
      expect(screen.getByText("Status Accounting")).toBeTruthy();
      expect(screen.getByText("Tindakan Berikutnya")).toBeTruthy();
      expect(
        screen.getAllByText("Menunggu Verifikasi Pembayaran").length,
      ).toBeGreaterThan(0);
      expect(screen.getByText("Belum Siap")).toBeTruthy();
      expect(
        screen.getByText(
          "Accounting menunggu kepastian pembayaran atau status rental yang lebih lanjut.",
        ),
      ).toBeTruthy();
      expect(screen.getByText("RSV-000501")).toBeTruthy();
      expect(screen.getByText("Tinjau Pembayaran")).toBeTruthy();
      expect(screen.getByText("Keputusan Pembayaran")).toBeTruthy();
      expect(screen.getByText("Menunggu Keputusan Admin")).toBeTruthy();
    });
  });

  it("renders canonical internal timeline from reservation detail", async () => {
    renderFeature(
      <AssetRentalAdminDetailPage bookingId="501" section="pengajuan" />,
    );

    await waitFor(() => {
      expect(screen.getByText("Riwayat Status Internal")).toBeTruthy();
      expect(screen.getByText("Reservation Created")).toBeTruthy();
      expect(screen.getByText("Status: Pending Review")).toBeTruthy();
      expect(screen.getByText("Payment Completed")).toBeTruthy();
      expect(
        screen.getByText("Status: Awaiting Payment Verification"),
      ).toBeTruthy();
    });
  });

  it("keeps operational next action explicit after payment is confirmed", async () => {
    getAssetRentalBookingsMock.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 501,
          asset_id: 10,
          asset_name: "Gedung Serbaguna Desa",
          renter_name: "Karang Taruna",
          renter_contact: "08123456789",
          renter_email: "karangtaruna@example.com",
          purpose: "Pelatihan UMKM",
          start_time: 1762732800,
          end_time: 1762819200,
          status: "CONFIRMED_FULL",
          total_amount: 750000,
          created_at: 1762600000,
          updated_at: 1762650000,
          latest_payment: {
            id: "pay-501",
            status: "succeeded",
            type: "settlement",
            method: "manual_transfer",
            amount: 750000,
            proof_url: "https://example.com/proof.jpg",
            proof_note: "Pelunasan sudah diverifikasi",
            updated_at: 1762653600,
          },
        },
      ],
    });

    getReservationMock.mockResolvedValueOnce({
      success: true,
      data: {
        reservation_id: 501,
        asset_id: 10,
        asset_name: "Gedung Serbaguna Desa",
        renter_name: "Karang Taruna",
        renter_contact: "08123456789",
        renter_email: "karangtaruna@example.com",
        purpose: "Pelatihan UMKM",
        start_date: "2025-11-10",
        end_date: "2025-11-11",
        status: "confirmed_full",
        amounts: { total: 750000, dp: 300000, remaining: 0 },
        latest_payment: {
          id: "pay-501",
          status: "succeeded",
          type: "settlement",
          method: "manual_transfer",
          amount: 750000,
          proof_url: "https://example.com/proof.jpg",
          proof_note: "Pelunasan sudah diverifikasi",
          updated_at: 1762653600,
        },
        timeline: [],
      },
    });

    renderFeature(
      <AssetRentalAdminDetailPage bookingId="501" section="penyewaan" />,
    );

    await waitFor(() => {
      expect(screen.getByText("Pembayaran Terkonfirmasi")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: "Tandai Selesai" }),
      ).toBeTruthy();
      expect(
        screen.getByText(
          "Pembayaran sudah lengkap, tetapi penyewaan baru dianggap selesai setelah penutupan operasional dilakukan secara eksplisit.",
        ),
      ).toBeTruthy();
    });
  });

  it("renders finance classifications and resolution outcomes separately", async () => {
    getAssetRentalBookingsMock.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 501,
          asset_id: 10,
          asset_name: "Gedung Serbaguna Desa",
          renter_name: "Karang Taruna",
          renter_contact: "08123456789",
          renter_email: "karangtaruna@example.com",
          purpose: "Pelatihan UMKM",
          start_time: 1762732800,
          end_time: 1762819200,
          status: "COMPLETED",
          total_amount: 750000,
          created_at: 1762600000,
          updated_at: 1762650000,
          latest_payment: {
            id: "pay-501",
            status: "succeeded",
            type: "settlement",
            method: "manual_transfer",
            amount: 450000,
            proof_url: "https://example.com/proof.jpg",
            proof_note: "Pelunasan sudah diverifikasi",
            updated_at: 1762653600,
          },
          payment_classifications: [
            {
              classification_type: "DEPOSIT",
              amount: 200000,
              accounting_event_key: "rental.deposit.received",
              accounting_reference: "RNT-DPS-501",
              reason: "Dana jaminan aset.",
            },
            {
              classification_type: "REVENUE_RECOGNITION",
              amount: 250000,
              accounting_event_key: "rental.revenue.recognized",
              accounting_reference: "RNT-REV-501",
              reason: "Pendapatan jasa sewa.",
            },
          ],
          financial_resolutions: [
            {
              outcome_type: "DEPOSIT_REFUNDED",
              amount: 200000,
              accounting_event_key: "rental.deposit.refunded",
              accounting_reference: "RNT-DPR-501",
              reason: "Deposit dikembalikan penuh.",
            },
          ],
        },
      ],
    });
    getReservationMock.mockResolvedValueOnce({
      success: true,
      data: {
        reservation_id: 501,
        asset_id: 10,
        asset_name: "Gedung Serbaguna Desa",
        renter_name: "Karang Taruna",
        renter_contact: "08123456789",
        renter_email: "karangtaruna@example.com",
        purpose: "Pelatihan UMKM",
        start_date: "2025-11-10",
        end_date: "2025-11-11",
        status: "completed",
        amounts: { total: 750000, dp: 300000, remaining: 450000 },
        accounting_readiness: {
          status: "ready",
          reason: "Klasifikasi dan resolution finance rental sudah lengkap.",
          reference: "RSV-000501",
        },
        payment_classifications: [
          {
            classification_type: "DEPOSIT",
            amount: 200000,
            accounting_event_key: "rental.deposit.received",
            accounting_reference: "RNT-DPS-501",
            reason: "Dana jaminan aset.",
          },
        ],
        financial_resolutions: [
          {
            outcome_type: "DEPOSIT_REFUNDED",
            amount: 200000,
            accounting_event_key: "rental.deposit.refunded",
            accounting_reference: "RNT-DPR-501",
            reason: "Deposit dikembalikan penuh.",
          },
        ],
        timeline: [],
      },
    });

    renderFeature(
      <AssetRentalAdminDetailPage bookingId="501" section="pengembalian" />,
    );

    await waitFor(() => {
      expect(screen.getByText("Klasifikasi Pembayaran Finance")).toBeTruthy();
      expect(screen.getByText("Resolution Finance Rental")).toBeTruthy();
      expect(screen.getByText("rental.deposit.received")).toBeTruthy();
      expect(screen.getByText("RNT-DPS-501")).toBeTruthy();
      expect(screen.getByText("rental.deposit.refunded")).toBeTruthy();
      expect(screen.getByText("RNT-DPR-501")).toBeTruthy();
    });
  });

  it("requires decision note before rejecting payment", async () => {
    renderFeature(
      <AssetRentalAdminDetailPage bookingId="501" section="pengajuan" />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Tolak Pembayaran" }),
      ).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Tolak Pembayaran" }));

    await waitFor(() => {
      expect(finalizePaymentMock).not.toHaveBeenCalled();
      expect(
        screen.getByText(
          "Catatan keputusan wajib diisi saat pembayaran ditolak.",
        ),
      ).toBeTruthy();
    });
  });
});
