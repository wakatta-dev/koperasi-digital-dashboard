/** @format */

import type { ReservationStatus } from "../types";

export function humanizeReservationStatus(status?: ReservationStatus | string): string {
  const key = (status || "").toString().toLowerCase();
  switch (key) {
    case "pending_review":
      return "Menunggu persetujuan";
    case "awaiting_dp":
      return "Menunggu DP";
    case "awaiting_payment_verification":
      return "Menunggu Verifikasi Pembayaran";
    case "confirmed_dp":
      return "DP terkonfirmasi";
    case "awaiting_settlement":
      return "Menunggu pelunasan";
    case "confirmed_full":
      return "Terkonfirmasi";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    case "rejected":
      return "Ditolak";
    case "expired":
      return "Kedaluwarsa";
    default:
      return status || "-";
  }
}
