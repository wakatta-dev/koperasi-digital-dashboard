/** @format */

import type { ReservationStatus } from "../types";
import { resolvePublicReservationStatusPresentation } from "../guest/utils/public-status";

export function humanizeReservationStatus(status?: ReservationStatus | string): string {
  if (!status) return "-";
  return resolvePublicReservationStatusPresentation(status).shortLabel;
}
