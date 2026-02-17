/** @format */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AssetManagementPage } from "@/modules/asset/components/asset-page";
import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";
import { renderFeature } from "./test-utils";

const getAssetsMock = vi.fn();
const getAssetRentalBookingsMock = vi.fn();
const updateAssetBookingStatusMock = vi.fn();
const completeAssetBookingMock = vi.fn();

type Booking = {
  id: number;
  asset_id: number;
  asset_name: string;
  renter_name: string;
  renter_contact: string;
  purpose: string;
  start_time: number;
  end_time: number;
  status: string;
  total_amount: number;
};

let bookingsState: Booking[] = [];

vi.mock("@/services/api/assets", () => ({
  getAssets: (...args: unknown[]) => getAssetsMock(...args),
}));

vi.mock("@/services/api/asset-rental", () => ({
  getAssetRentalBookings: (...args: unknown[]) => getAssetRentalBookingsMock(...args),
  updateAssetBookingStatus: (...args: unknown[]) => updateAssetBookingStatusMock(...args),
  completeAssetBooking: (...args: unknown[]) => completeAssetBookingMock(...args),
}));

beforeEach(() => {
  getAssetsMock.mockReset();
  getAssetRentalBookingsMock.mockReset();
  updateAssetBookingStatusMock.mockReset();
  completeAssetBookingMock.mockReset();

  bookingsState = [
    {
      id: 201,
      asset_id: 1,
      asset_name: "Aula Serbaguna",
      renter_name: "Andi Pratama",
      renter_contact: "Unit Operasional",
      purpose: "Rapat bulanan",
      start_time: 1762732800,
      end_time: 1762819200,
      status: "PENDING_REVIEW",
      total_amount: 600000,
    },
    {
      id: 202,
      asset_id: 1,
      asset_name: "Aula Serbaguna",
      renter_name: "Siti Rahma",
      renter_contact: "Administrasi",
      purpose: "Workshop",
      start_time: 1762905600,
      end_time: 1762992000,
      status: "CONFIRMED_FULL",
      total_amount: 900000,
    },
    {
      id: 203,
      asset_id: 1,
      asset_name: "Aula Serbaguna",
      renter_name: "Tari Wijaya",
      renter_contact: "Unit Pelatihan",
      purpose: "Kelas internal",
      start_time: 1763078400,
      end_time: 1763164800,
      status: "PENDING_REVIEW",
      total_amount: 750000,
    },
  ];

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

  getAssetRentalBookingsMock.mockImplementation(async () => ({
    success: true,
    data: bookingsState.map((item) => ({ ...item })),
  }));

  updateAssetBookingStatusMock.mockImplementation(
    async (bookingId: string | number, status: string) => {
      bookingsState = bookingsState.map((item) =>
        String(item.id) === String(bookingId) ? { ...item, status } : item
      );
      const updated = bookingsState.find((item) => String(item.id) === String(bookingId));
      return {
        success: true,
        data: updated ? { ...updated } : null,
      };
    }
  );

  completeAssetBookingMock.mockImplementation(async (bookingId: string | number) => {
    bookingsState = bookingsState.map((item) =>
      String(item.id) === String(bookingId) ? { ...item, status: "COMPLETED" } : item
    );
    const updated = bookingsState.find((item) => String(item.id) === String(bookingId));
    return {
      success: true,
      data: updated ? { ...updated } : null,
    };
  });
});

describe("asset-rental integration", () => {
  it("keeps core flow actions usable across all four pages", async () => {
    const assetView = renderFeature(<AssetManagementPage />);

    const tambahAsetLink = await screen.findByRole("link", { name: /tambah aset/i });
    expect(tambahAsetLink.getAttribute("href")).toBe("/bumdes/asset/manajemen/tambah");
    await screen.findByRole("link", { name: /aula serbaguna/i });
    const editAssetLinks = screen.getAllByRole("link", { name: /edit aset/i });
    expect(editAssetLinks[0].getAttribute("href")).toBe(
      "/bumdes/asset/manajemen/edit?assetId=1"
    );
    assetView.unmount();

    const rentalView = renderFeature(<AssetScheduleView activeSection="penyewaan" />);
    await screen.findByText("Total Penyewaan Aktif");
    fireEvent.click(screen.getAllByRole("button", { name: /aksi/i })[0]);
    expect(await screen.findByText("Konfirmasi Pengembalian Aset")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /batal/i }));
    await waitFor(() => {
      expect(screen.queryByText("Konfirmasi Pengembalian Aset")).toBeNull();
    });
    rentalView.unmount();

    const requestView = renderFeature(<AssetScheduleView activeSection="pengajuan" />);
    await screen.findByText("Total Pengajuan Baru");
    const approvedBefore = screen.queryAllByText("Disetujui").length;
    fireEvent.click(screen.getAllByRole("button", { name: /setujui/i })[0]);
    await waitFor(() => {
      expect(screen.queryAllByText("Disetujui").length).toBeGreaterThan(approvedBefore);
    });
    fireEvent.click(screen.getAllByRole("button", { name: /^tolak$/i })[0]);
    fireEvent.change(screen.getByLabelText("Alasan Penolakan"), {
      target: { value: "Tanggal bentrok" },
    });
    fireEvent.click(screen.getByRole("button", { name: /konfirmasi tolak/i }));
    expect(await screen.findByText("Ditolak")).toBeTruthy();
    requestView.unmount();

    renderFeature(<AssetScheduleView activeSection="pengembalian" />);
    await screen.findByText("Menunggu Pengecekan");
    fireEvent.click(screen.getAllByRole("button", { name: /proses kembali/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /konfirmasi & selesaikan/i }));
    fireEvent.click(screen.getByRole("button", { name: /tandai selesai/i }));
    expect(await screen.findByText("Selesai")).toBeTruthy();
  });
});
