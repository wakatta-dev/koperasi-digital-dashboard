/** @format */

import type { CreateReservationResponse } from "@/types/api/reservation";
import { createSignedReservationLink } from "../../utils/signed-link";
import { formatTicketFromReservationId } from "./ticket";

export type PublicReservationSuccessState = {
  reservationId: number;
  ticket: string;
  statusHref?: string;
};

export async function buildPublicReservationSuccessState(
  reservation: CreateReservationResponse
): Promise<PublicReservationSuccessState> {
  const reservationId = reservation.reservation_id;
  const ticket = formatTicketFromReservationId(reservationId);

  const signedStatusLink = await createSignedReservationLink({
    reservationId,
    status: reservation.status,
    expiresAt: reservation.hold_expires_at,
    guestToken: reservation.guest_token?.trim(),
  });

  return {
    reservationId,
    ticket,
    statusHref: signedStatusLink.url,
  };
}

export function resolvePublicReservationSubmissionErrorMessage(
  message: string | null | undefined
): string {
  const original = (message ?? "").trim();
  const normalized = (message ?? "").trim().toLowerCase();

  if (
    normalized.includes("booking overlaps") ||
    normalized.includes("existing schedule")
  ) {
    return "Tanggal yang Anda pilih sudah tidak tersedia. Silakan pilih jadwal lain.";
  }

  if (
    normalized.includes("asset not found") ||
    normalized.includes("asset archived")
  ) {
    return "Aset ini sudah tidak tersedia untuk diajukan. Silakan pilih aset lain yang tersedia.";
  }

  if (normalized.includes("invalid input:")) {
    return original;
  }

  if (normalized.includes("invalid input")) {
    return "Mohon lengkapi data pengajuan dengan benar sebelum dikirim.";
  }

  return "Pengajuan belum dapat diproses saat ini. Silakan periksa kembali data Anda atau coba beberapa saat lagi.";
}

export function buildAvailabilityConflictMessage(input?: {
  suggestion?: {
    start?: string;
    end?: string;
  };
}): string {
  const suggestionStart = input?.suggestion?.start?.trim();
  const suggestionEnd = input?.suggestion?.end?.trim();

  if (suggestionStart && suggestionEnd) {
    return `Tanggal yang Anda pilih sudah tidak tersedia. Coba jadwal lain, misalnya ${suggestionStart} sampai ${suggestionEnd}.`;
  }

  return "Tanggal yang Anda pilih sudah tidak tersedia. Silakan pilih jadwal lain.";
}
