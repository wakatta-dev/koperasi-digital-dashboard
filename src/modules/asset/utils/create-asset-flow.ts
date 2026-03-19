/** @format */

export const DRAFT_INTERNAL_STATUS = "Draft Internal";
export const PUBLIC_AVAILABLE_STATUS = "Tersedia";

export function isPublicAvailabilityStatus(status?: string): boolean {
  return status?.trim().toLowerCase() === PUBLIC_AVAILABLE_STATUS.toLowerCase();
}

export function resolveCreateAvailabilityStatus(status?: string): string | undefined {
  const trimmed = status?.trim();
  if (!trimmed) {
    return undefined;
  }
  if (isPublicAvailabilityStatus(trimmed)) {
    return DRAFT_INTERNAL_STATUS;
  }
  return trimmed;
}

