/** @format */

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";
import { renderFeature } from "./test-utils";

const getAssetRentalBookingsMock = vi.fn();
const updateAssetBookingStatusMock = vi.fn();
const completeAssetBookingMock = vi.fn();

vi.mock("@/services/api/asset-rental", () => ({
  getAssetRentalBookings: (...args: unknown[]) => getAssetRentalBookingsMock(...args),
  updateAssetBookingStatus: (...args: unknown[]) => updateAssetBookingStatusMock(...args),
  completeAssetBooking: (...args: unknown[]) => completeAssetBookingMock(...args),
}));

beforeEach(() => {
  getAssetRentalBookingsMock.mockReset();
  updateAssetBookingStatusMock.mockReset();
  completeAssetBookingMock.mockReset();

  getAssetRentalBookingsMock.mockResolvedValue({
    success: true,
    data: [
      {
        id: 101,
        asset_id: 1,
        asset_name: "Aula Serbaguna",
        renter_name: "Budi Santoso",
        renter_contact: "Unit Event",
        purpose: "Rapat",
        start_time: 1762732800,
        end_time: 1762819200,
        status: "BOOKED",
        total_amount: 1000000,
      },
      {
        id: 102,
        asset_id: 1,
        asset_name: "Aula Serbaguna",
        renter_name: "Nina Lestari",
        renter_contact: "Unit Pelatihan",
        purpose: "Pelatihan",
        start_time: 1762905600,
        end_time: 1762992000,
        status: "PENDING_REVIEW",
        total_amount: 800000,
      },
    ],
  });

  updateAssetBookingStatusMock.mockResolvedValue({ success: true, data: {} });
  completeAssetBookingMock.mockResolvedValue({ success: true, data: {} });
});

describe("asset-rental overlays", () => {
  it("handles reject flow on pengajuan sewa", async () => {
    renderFeature(<AssetScheduleView activeSection="pengajuan" />);

    const tolakButtons = await screen.findAllByRole("button", { name: /^tolak$/i });
    fireEvent.click(tolakButtons[0]);
    expect(screen.getByText("Tolak Pengajuan Sewa")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Alasan Penolakan"), {
      target: { value: "Dokumen belum lengkap" },
    });

    fireEvent.click(screen.getByRole("button", { name: /konfirmasi tolak/i }));
    expect(screen.queryByText("Tolak Pengajuan Sewa")).toBeNull();
  });

  it("handles pengembalian flow (proses -> konfirmasi -> selesai)", async () => {
    renderFeature(<AssetScheduleView activeSection="pengembalian" />);

    const prosesButtons = await screen.findAllByRole("button", { name: /proses kembali/i });
    fireEvent.click(prosesButtons[0]);
    expect(screen.getByText("Konfirmasi Pengembalian Aset")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /konfirmasi & selesaikan/i }));
    expect(screen.getByRole("dialog", { name: /tandai selesai pengembalian/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /tandai selesai/i }));
    expect(screen.queryByRole("dialog", { name: /tandai selesai pengembalian/i })).toBeNull();
  });
});
