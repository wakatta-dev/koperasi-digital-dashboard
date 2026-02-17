/** @format */

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AssetManagementPage } from "@/modules/asset/components/asset-page";
import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";
import { renderFeature } from "./test-utils";

const getAssetsMock = vi.fn();
const getAssetRentalBookingsMock = vi.fn();

vi.mock("@/services/api/assets", () => ({
  getAssets: (...args: unknown[]) => getAssetsMock(...args),
}));

vi.mock("@/services/api/asset-rental", () => ({
  getAssetRentalBookings: (...args: unknown[]) => getAssetRentalBookingsMock(...args),
  updateAssetBookingStatus: vi.fn(),
  completeAssetBooking: vi.fn(),
}));

beforeEach(() => {
  getAssetsMock.mockReset();
  getAssetRentalBookingsMock.mockReset();

  getAssetsMock.mockResolvedValue({
    success: true,
    data: [
      {
        id: 1,
        name: "Aula Serbaguna",
        rate_type: "DAILY",
        rate_amount: 500000,
        description: "Lokasi: Gedung A",
        status: "ACTIVE",
      },
    ],
  });

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
        status: "CONFIRMED_FULL",
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
});

describe("asset-rental tables", () => {
  it("supports daftar aset actions (tambah aset + aksi baris)", async () => {
    renderFeature(<AssetManagementPage />);

    const tambahAsetLink = await screen.findByRole("link", { name: /tambah aset/i });
    expect(tambahAsetLink.getAttribute("href")).toBe("/bumdes/asset/manajemen/tambah");
    await screen.findByRole("link", { name: /aula serbaguna/i });

    const editAssetLinks = screen.getAllByRole("link", { name: /edit aset/i });
    expect(editAssetLinks[0].getAttribute("href")).toBe(
      "/bumdes/asset/manajemen/edit?assetId=1"
    );
  });

  it("renders rental section views from sidebar routes", async () => {
    const rentalView = renderFeature(<AssetScheduleView activeSection="penyewaan" />);
    expect(await screen.findByText("Total Penyewaan Aktif")).toBeTruthy();
    rentalView.unmount();

    const requestView = renderFeature(<AssetScheduleView activeSection="pengajuan" />);
    expect(await screen.findByText("Total Pengajuan Baru")).toBeTruthy();
    requestView.unmount();

    renderFeature(<AssetScheduleView activeSection="pengembalian" />);
    expect(await screen.findByText("Menunggu Pengecekan")).toBeTruthy();
  });
});
