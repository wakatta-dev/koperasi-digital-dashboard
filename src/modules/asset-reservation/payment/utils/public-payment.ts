/** @format */

import type { PaymentMode, ReservationStatus } from "../../types";
import { humanizeReservationStatus } from "../../utils/status";

export type PublicPaymentAccess = {
  allowed: boolean;
  message?: string;
};

export function assessPublicPaymentAccess(
  status: ReservationStatus | string | undefined,
  mode: PaymentMode
): PublicPaymentAccess {
  const normalizedStatus = (status || "").trim().toLowerCase();

  if (normalizedStatus === "awaiting_dp") {
    if (mode === "dp") {
      return { allowed: true };
    }
    return {
      allowed: false,
      message:
        "Reservasi ini masih menunggu pembayaran DP. Selesaikan DP terlebih dahulu sebelum melanjutkan ke pelunasan.",
    };
  }

  if (
    normalizedStatus === "confirmed_dp" ||
    normalizedStatus === "awaiting_settlement"
  ) {
    if (mode === "settlement") {
      return { allowed: true };
    }
    return {
      allowed: false,
      message:
        "DP sudah diproses. Gunakan langkah pelunasan dari status reservasi terbaru untuk melanjutkan pembayaran.",
    };
  }

  if (normalizedStatus === "pending_review") {
    return {
      allowed: false,
      message:
        "Pengajuan Anda masih ditinjau admin. Pembayaran baru tersedia setelah pengajuan disetujui.",
    };
  }

  if (normalizedStatus === "awaiting_payment_verification") {
    return {
      allowed: false,
      message:
        "Bukti pembayaran Anda sedang diverifikasi. Tunggu hasil verifikasi sebelum membuat sesi pembayaran baru.",
    };
  }

  if (
    normalizedStatus === "confirmed_full" ||
    normalizedStatus === "completed"
  ) {
    return {
      allowed: false,
      message: "Pembayaran untuk reservasi ini sudah selesai.",
    };
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "rejected" ||
    normalizedStatus === "expired"
  ) {
    return {
      allowed: false,
      message: `Pembayaran tidak tersedia karena reservasi berada pada status ${humanizeReservationStatus(
        normalizedStatus
      ).toLowerCase()}.`,
    };
  }

  return {
    allowed: false,
    message:
      "Tahap pembayaran belum tersedia untuk reservasi ini. Muat ulang status terbaru atau gunakan tautan resmi yang dikirim sistem.",
  };
}

export function resolvePublicPaymentSessionErrorMessage(
  message: string | null | undefined
): string {
  const normalized = (message ?? "").trim().toLowerCase();

  if (normalized.includes("invalid input")) {
    return "Reservasi ini belum berada pada tahap pembayaran yang sesuai.";
  }

  if (normalized.includes("invalid booking status transition")) {
    return "Tahap pembayaran reservasi sudah berubah. Muat ulang status reservasi terbaru sebelum melanjutkan.";
  }

  if (
    normalized.includes("forbidden ownership") ||
    normalized.includes("booking not found")
  ) {
    return "Tautan pembayaran tidak valid atau sudah tidak berlaku.";
  }

  return "Sesi pembayaran belum dapat dibuat saat ini. Silakan coba lagi beberapa saat lagi.";
}
