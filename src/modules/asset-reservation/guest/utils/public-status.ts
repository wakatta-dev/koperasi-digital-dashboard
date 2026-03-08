/** @format */

import type { ReservationStatus } from "../../types";
import { formatTicketFromReservationId } from "./ticket";

export type PublicReservationStatusVariant =
  | "verifying"
  | "approved"
  | "completed"
  | "rejected";

export type PublicReservationStatusPresentation = {
  variant: PublicReservationStatusVariant;
  badgeLabel: string;
  shortLabel: string;
  headline: string;
  description: string;
};

const PUBLIC_STATUS_MAP: Record<
  ReservationStatus,
  PublicReservationStatusPresentation
> = {
  pending_review: {
    variant: "verifying",
    badgeLabel: "Sedang Ditinjau",
    shortLabel: "Sedang Ditinjau",
    headline: "Pengajuan Sedang Ditinjau",
    description: "Pengajuan Anda sedang ditinjau admin BUMDes.",
  },
  awaiting_dp: {
    variant: "approved",
    badgeLabel: "Menunggu Pembayaran",
    shortLabel: "Menunggu Pembayaran",
    headline: "Lanjutkan Pembayaran",
    description:
      "Pengajuan disetujui. Selesaikan pembayaran agar jadwal Anda diproses lebih lanjut.",
  },
  awaiting_payment_verification: {
    variant: "verifying",
    badgeLabel: "Pembayaran Sedang Dicek",
    shortLabel: "Pembayaran Sedang Dicek",
    headline: "Pembayaran Sedang Dicek",
    description:
      "Bukti pembayaran Anda sudah diterima dan sedang dicek admin.",
  },
  confirmed_dp: {
    variant: "approved",
    badgeLabel: "Jadwal Diamankan",
    shortLabel: "Jadwal Diamankan",
    headline: "Jadwal Sudah Diamankan",
    description:
      "Pembayaran awal sudah dikonfirmasi. Pantau jadwal dan lanjutkan pelunasan bila diminta.",
  },
  awaiting_settlement: {
    variant: "approved",
    badgeLabel: "Menunggu Pelunasan",
    shortLabel: "Menunggu Pelunasan",
    headline: "Lanjutkan Pelunasan",
    description:
      "Silakan selesaikan sisa pembayaran agar reservasi siap dipakai.",
  },
  confirmed_full: {
    variant: "approved",
    badgeLabel: "Siap Digunakan",
    shortLabel: "Siap Digunakan",
    headline: "Reservasi Siap Digunakan",
    description:
      "Pembayaran selesai dan reservasi Anda siap digunakan sesuai jadwal.",
  },
  completed: {
    variant: "completed",
    badgeLabel: "Sewa Selesai",
    shortLabel: "Sewa Selesai",
    headline: "Sewa Telah Selesai",
    description: "Penyewaan sudah selesai dan dicatat oleh admin.",
  },
  cancelled: {
    variant: "rejected",
    badgeLabel: "Reservasi Dibatalkan",
    shortLabel: "Reservasi Dibatalkan",
    headline: "Reservasi Dibatalkan",
    description: "Reservasi ini dibatalkan.",
  },
  rejected: {
    variant: "rejected",
    badgeLabel: "Tidak Dapat Diproses",
    shortLabel: "Tidak Dapat Diproses",
    headline: "Pengajuan Tidak Dapat Diproses",
    description:
      "Pengajuan ini tidak dapat diproses. Silakan cek catatan admin atau ajukan ulang.",
  },
  expired: {
    variant: "rejected",
    badgeLabel: "Reservasi Kedaluwarsa",
    shortLabel: "Reservasi Kedaluwarsa",
    headline: "Reservasi Kedaluwarsa",
    description:
      "Batas waktu reservasi sudah lewat. Ajukan ulang bila Anda masih membutuhkan jadwal ini.",
  },
};

export function resolvePublicReservationStatusPresentation(
  status?: ReservationStatus | string | null
): PublicReservationStatusPresentation {
  const normalized = (status || "").trim().toLowerCase() as ReservationStatus;
  return PUBLIC_STATUS_MAP[normalized] ?? PUBLIC_STATUS_MAP.pending_review;
}

export function formatPublicReservationIdentifier(
  reservationId?: number | string | null
): string {
  const numeric =
    typeof reservationId === "string"
      ? Number.parseInt(reservationId, 10)
      : reservationId;
  if (!Number.isFinite(numeric) || Number(numeric) <= 0) {
    return "-";
  }
  return formatTicketFromReservationId(Number(numeric));
}
