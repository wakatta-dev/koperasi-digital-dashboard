/** @format */

import type { AssetRentalBooking } from "@/types/api/asset-rental";

import type {
  RentalListItem,
  RentalRequestItem,
  ReturnListItem,
} from "../types/stitch";

type StitchBookingCollections = Readonly<{
  rentalRows: RentalListItem[];
  requestRows: RentalRequestItem[];
  returnRows: ReturnListItem[];
}>;

function toDateText(unixSeconds?: number) {
  if (!unixSeconds) return "-";
  const date = new Date(unixSeconds * 1000);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10);
}

function toBookingStatus(status?: string) {
  return (status || "").toUpperCase();
}

function toRentalStatus(booking: AssetRentalBooking): RentalListItem["status"] {
  const status = toBookingStatus(booking.status);
  if (status === "COMPLETED" || status === "CONFIRMED_FULL") return "Selesai";
  const endAt = new Date((booking.end_time || 0) * 1000).getTime();
  const isLate = endAt > 0 && endAt < Date.now();
  return isLate ? "Terlambat" : "Berjalan";
}

function toRequestStatus(status?: string): RentalRequestItem["status"] {
  const normalized = toBookingStatus(status);
  if (normalized === "PENDING_REVIEW") return "Menunggu";
  if (normalized === "REJECTED" || normalized === "CANCELLED") return "Ditolak";
  return "Disetujui";
}

function toReturnStatus(status?: string): ReturnListItem["status"] {
  const normalized = toBookingStatus(status);
  if (normalized === "COMPLETED") return "Selesai";
  if (normalized === "CONFIRMED_FULL") return "Diproses";
  return "Menunggu Pengembalian";
}

function toAssetTag(assetID: number) {
  return `AST-${String(Math.max(0, assetID)).padStart(3, "0")}`;
}

export function mapContractBookingToRental(
  booking: AssetRentalBooking
): RentalListItem {
  return {
    id: String(booking.id),
    assetName: booking.asset_name,
    assetTag: toAssetTag(booking.asset_id),
    borrowerName: booking.renter_name,
    borrowerUnit: booking.renter_contact || booking.purpose || "-",
    startDate: toDateText(booking.start_time),
    returnDate: toDateText(booking.end_time),
    status: toRentalStatus(booking),
  };
}

export function mapContractBookingToRequest(
  booking: AssetRentalBooking
): RentalRequestItem {
  return {
    id: String(booking.id),
    requesterName: booking.renter_name,
    requesterUnit: booking.renter_contact || "-",
    assetName: booking.asset_name,
    assetTypeLabel: "-",
    startDate: toDateText(booking.start_time),
    endDate: toDateText(booking.end_time),
    purpose: booking.purpose || "-",
    status: toRequestStatus(booking.status),
  };
}

export function mapContractBookingToReturn(
  booking: AssetRentalBooking
): ReturnListItem {
  return {
    id: String(booking.id),
    assetName: booking.asset_name,
    borrowerName: booking.renter_name,
    dueDate: toDateText(booking.end_time),
    plannedReturnDate: null,
    status: toReturnStatus(booking.status),
  };
}

export function splitBookingsForStitchTables(
  bookings: AssetRentalBooking[]
): StitchBookingCollections {
  const rentalRows: RentalListItem[] = [];
  const requestRows: RentalRequestItem[] = [];
  const returnRows: ReturnListItem[] = [];

  for (const booking of bookings) {
    const normalized = toBookingStatus(booking.status);
    if (
      normalized === "PENDING_REVIEW" ||
      normalized === "AWAITING_DP" ||
      normalized === "AWAITING_SETTLEMENT" ||
      normalized === "REJECTED" ||
      normalized === "CANCELLED"
    ) {
      requestRows.push(mapContractBookingToRequest(booking));
    }

    if (
      normalized === "AWAITING_DP" ||
      normalized === "AWAITING_SETTLEMENT" ||
      normalized === "CONFIRMED_FULL" ||
      normalized === "BOOKED" ||
      normalized === "COMPLETED"
    ) {
      rentalRows.push(mapContractBookingToRental(booking));
      returnRows.push(mapContractBookingToReturn(booking));
    }
  }

  return { rentalRows, requestRows, returnRows };
}
