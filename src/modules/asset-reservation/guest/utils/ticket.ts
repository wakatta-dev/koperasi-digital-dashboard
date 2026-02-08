/** @format */

const TICKET_PREFIX = "SQ";

export function normalizeTicketInput(raw: string): string {
  return (raw ?? "").trim();
}

export function extractReservationIdFromTicket(raw: string): number | null {
  const value = normalizeTicketInput(raw);
  if (!value) return null;
  const digits = value.replaceAll(/[^0-9]/g, "");
  if (!digits) return null;
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function formatTicketFromReservationId(reservationId: number): string {
  const safeId =
    Number.isFinite(reservationId) && reservationId > 0
      ? Math.trunc(reservationId)
      : 0;
  const suffix = safeId ? String(safeId).padStart(5, "0") : "00000";
  return `#${TICKET_PREFIX}-${suffix}`;
}

