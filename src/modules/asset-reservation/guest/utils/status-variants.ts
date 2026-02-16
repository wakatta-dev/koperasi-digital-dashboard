/** @format */

import type { GuestReservationStatus } from "../types";

export type GuestStatusVariant =
  | "pending"
  | "verifying"
  | "approved_payment"
  | "payment_done"
  | "completed"
  | "rejected"
  | "cancelled"
  | "expired";

export function mapStatusToVariant(status: GuestReservationStatus): GuestStatusVariant {
  switch (status) {
    case "pending_review":
      return "pending";
    case "awaiting_payment_verification":
      return "verifying";
    case "awaiting_dp":
      return "approved_payment";
    case "confirmed_dp":
    case "awaiting_settlement":
      return "payment_done";
    case "confirmed_full":
    case "completed":
      return "completed";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
    default:
      return "pending";
  }
}
