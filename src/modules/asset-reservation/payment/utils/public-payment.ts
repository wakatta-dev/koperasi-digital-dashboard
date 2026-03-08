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

const MAX_PUBLIC_PAYMENT_PROOF_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PUBLIC_PAYMENT_PROOF_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]);

const ALLOWED_PUBLIC_PAYMENT_PROOF_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
]);

export function validatePublicPaymentProofFile(
  file: File | null | undefined
): string | null {
  if (!file) {
    return "Pilih file bukti pembayaran terlebih dahulu.";
  }

  if (file.size <= 0) {
    return "File bukti pembayaran tidak valid. Pilih file yang dapat dibuka.";
  }

  if (file.size > MAX_PUBLIC_PAYMENT_PROOF_SIZE_BYTES) {
    return "Ukuran file bukti pembayaran maksimal 5 MB.";
  }

  const normalizedType = (file.type || "").trim().toLowerCase();
  const filename = (file.name || "").trim().toLowerCase();
  const extension = filename.includes(".")
    ? `.${filename.split(".").pop() ?? ""}`
    : "";
  const validByType =
    normalizedType !== "" &&
    ALLOWED_PUBLIC_PAYMENT_PROOF_TYPES.has(normalizedType);
  const validByExtension = ALLOWED_PUBLIC_PAYMENT_PROOF_EXTENSIONS.has(extension);

  if (!validByType && !validByExtension) {
    return "Format file belum didukung. Gunakan JPG, PNG, atau PDF.";
  }

  return null;
}

export function resolvePublicPaymentProofErrorMessage(
  message: string | null | undefined
): string {
  const normalized = (message ?? "").trim().toLowerCase();

  if (normalized.includes("invalid image")) {
    return "File bukti pembayaran tidak valid. Gunakan file yang dapat dibuka.";
  }

  if (normalized.includes("unsupported image format")) {
    return "Format file belum didukung. Gunakan JPG, PNG, atau PDF.";
  }

  if (normalized.includes("image too large")) {
    return "Ukuran file bukti pembayaran maksimal 5 MB.";
  }

  if (
    normalized.includes("invalid payment status") ||
    normalized.includes("invalid booking status transition")
  ) {
    return "Sesi pembayaran ini sudah tidak menerima bukti baru. Muat ulang status reservasi terbaru sebelum mencoba lagi.";
  }

  if (
    normalized.includes("forbidden ownership") ||
    normalized.includes("payment not found")
  ) {
    return "Tautan upload bukti pembayaran tidak valid atau sudah tidak berlaku.";
  }

  return "Bukti pembayaran belum dapat dikirim saat ini. Silakan coba lagi beberapa saat lagi.";
}
