/** @format */

import type { AssetRentalBooking } from "@/types/api/asset-rental";

export const ASSET_RENTAL_BOOKING_STATUS = {
  pendingReview: "PENDING_REVIEW",
  awaitingDP: "AWAITING_DP",
  awaitingPaymentVerification: "AWAITING_PAYMENT_VERIFICATION",
  awaitingSettlement: "AWAITING_SETTLEMENT",
  confirmedFull: "CONFIRMED_FULL",
  booked: "BOOKED",
  completed: "COMPLETED",
  rejected: "REJECTED",
  cancelled: "CANCELLED",
} as const;

export function normalizeAssetRentalBookingStatus(status?: string): string {
  return (status || "").trim().toUpperCase();
}

export function resolveAssetRentalBookingStatus(
  booking?: Pick<AssetRentalBooking, "status" | "latest_payment">
): string {
  const baseStatus = normalizeAssetRentalBookingStatus(booking?.status);
  const paymentStatus = (booking?.latest_payment?.status || "").trim().toLowerCase();
  if (
    paymentStatus === "pending_verification" &&
    (baseStatus === ASSET_RENTAL_BOOKING_STATUS.awaitingDP ||
      baseStatus === ASSET_RENTAL_BOOKING_STATUS.awaitingSettlement ||
      baseStatus === ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification)
  ) {
    return ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification;
  }
  return baseStatus;
}

export function toAssetRentalBookingStatusLabel(status?: string): string {
  const normalized = normalizeAssetRentalBookingStatus(status);
  switch (normalized) {
    case ASSET_RENTAL_BOOKING_STATUS.pendingReview:
      return "Menunggu";
    case ASSET_RENTAL_BOOKING_STATUS.awaitingDP:
      return "Menunggu Pembayaran";
    case ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification:
      return "Menunggu Verifikasi Pembayaran";
    case ASSET_RENTAL_BOOKING_STATUS.awaitingSettlement:
      return "Menunggu Pelunasan";
    case ASSET_RENTAL_BOOKING_STATUS.confirmedFull:
      return "Pembayaran Terkonfirmasi";
    case ASSET_RENTAL_BOOKING_STATUS.completed:
      return "Selesai";
    case ASSET_RENTAL_BOOKING_STATUS.rejected:
    case ASSET_RENTAL_BOOKING_STATUS.cancelled:
      return "Ditolak";
    default:
      return normalized || "-";
  }
}
