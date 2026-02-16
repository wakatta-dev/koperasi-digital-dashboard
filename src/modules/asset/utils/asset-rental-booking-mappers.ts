/** @format */

import type { AssetRentalBooking } from "@/types/api/asset-rental";
import {
  ASSET_RENTAL_BOOKING_STATUS,
  resolveAssetRentalBookingStatus,
} from "@/lib/asset-rental-booking-status";

import type {
  AssetRentalRentalsRow,
  AssetRentalRequestsRow,
  AssetRentalReturnsRow,
} from "../types/asset-rental";

type AssetRentalBookingCollections = Readonly<{
  rentalRows: AssetRentalRentalsRow[];
  requestRows: AssetRentalRequestsRow[];
  returnRows: AssetRentalReturnsRow[];
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

function toRentalStatus(booking: AssetRentalBooking): AssetRentalRentalsRow["status"] {
  const status = resolveAssetRentalBookingStatus(booking);
  if (status === ASSET_RENTAL_BOOKING_STATUS.awaitingDP) return "Menunggu Pembayaran";
  if (status === ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification) {
    return "Menunggu Verifikasi Pembayaran";
  }
  if (status === ASSET_RENTAL_BOOKING_STATUS.completed) return "Selesai";
  const endAt = new Date((booking.end_time || 0) * 1000).getTime();
  const isLate = endAt > 0 && endAt < Date.now();
  return isLate ? "Terlambat" : "Berjalan";
}

function toRequestStatus(status?: string): AssetRentalRequestsRow["status"] {
  const normalized = toBookingStatus(status);
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.pendingReview) return "Menunggu";
  if (
    normalized === ASSET_RENTAL_BOOKING_STATUS.rejected ||
    normalized === ASSET_RENTAL_BOOKING_STATUS.cancelled
  ) {
    return "Ditolak";
  }
  return "Disetujui";
}

function toReturnStatus(status?: string): AssetRentalReturnsRow["status"] {
  const normalized = toBookingStatus(status);
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.completed) return "Selesai";
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.confirmedFull) return "Diproses";
  return "Menunggu Pengembalian";
}

function toAssetTag(assetID: number) {
  return `AST-${String(Math.max(0, assetID)).padStart(3, "0")}`;
}

export function mapContractBookingToRental(
  booking: AssetRentalBooking
): AssetRentalRentalsRow {
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
): AssetRentalRequestsRow {
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
): AssetRentalReturnsRow {
  return {
    id: String(booking.id),
    assetName: booking.asset_name,
    borrowerName: booking.renter_name,
    dueDate: toDateText(booking.end_time),
    plannedReturnDate: null,
    status: toReturnStatus(booking.status),
  };
}

export function splitAssetRentalBookings(
  bookings: AssetRentalBooking[]
): AssetRentalBookingCollections {
  const rentalRows: AssetRentalRentalsRow[] = [];
  const requestRows: AssetRentalRequestsRow[] = [];
  const returnRows: AssetRentalReturnsRow[] = [];

  for (const booking of bookings) {
    const normalized = resolveAssetRentalBookingStatus(booking);
    if (
      normalized === ASSET_RENTAL_BOOKING_STATUS.pendingReview ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingDP ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingSettlement ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.rejected ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.cancelled
    ) {
      requestRows.push(mapContractBookingToRequest(booking));
    }

    if (
      normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingDP ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingSettlement ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.confirmedFull ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.booked ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.completed
    ) {
      rentalRows.push(mapContractBookingToRental(booking));
    }

    if (
      normalized === ASSET_RENTAL_BOOKING_STATUS.confirmedFull ||
      normalized === ASSET_RENTAL_BOOKING_STATUS.completed
    ) {
      returnRows.push(mapContractBookingToReturn(booking));
    }
  }

  return { rentalRows, requestRows, returnRows };
}
