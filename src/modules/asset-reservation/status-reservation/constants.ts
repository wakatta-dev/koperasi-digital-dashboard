/** @format */

export type ReservationState = "dp" | "done";

export const SECURE_LINK = {
  // Use signature from environment for guest access validation
  expectedSignature: process.env.NEXT_PUBLIC_RESERVATION_SIG ?? "",
};

export function verifySignature(signature?: string) {
  return Boolean(
    SECURE_LINK.expectedSignature &&
      signature &&
      signature === SECURE_LINK.expectedSignature
  );
}
