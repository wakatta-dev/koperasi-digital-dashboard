/** @format */

import { screen, waitFor } from "@testing-library/react";
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
  getAssetRentalBookings: (...args: unknown[]) => getAssetRentalBookingsMock(...args),
  updateAssetBookingStatus: (...args: unknown[]) => updateAssetBookingStatusMock(...args),
  completeAssetBooking: (...args: unknown[]) => completeAssetBookingMock(...args),
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
      expect(
        screen.getByText("Status: Pending Review"),
      ).toBeTruthy();
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
});
