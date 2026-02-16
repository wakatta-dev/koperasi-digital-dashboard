/** @format */

import { useQuery } from "@tanstack/react-query";

import { QK } from "@/hooks/queries/queryKeys";
import { getReservation } from "@/services/api/reservations";
import type { ReservationSummary } from "../types";

export function useReservation(
  reservationId?: string | number,
  ownershipToken?: string
) {
  return useQuery({
    enabled: Boolean(reservationId),
    queryKey: QK.assetRental.reservation(
      `${reservationId ?? "unknown"}:${ownershipToken ?? ""}`
    ),
    queryFn: async (): Promise<ReservationSummary> => {
      const res = await getReservation(reservationId ?? "", ownershipToken);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat reservasi");
      }
      return {
        reservationId: res.data.reservation_id,
        assetId: res.data.asset_id,
        assetName: res.data.asset_name,
        renterName: res.data.renter_name,
        renterContact: res.data.renter_contact,
        purpose: res.data.purpose,
        submittedAt: res.data.submitted_at,
        startDate: res.data.start_date,
        endDate: res.data.end_date,
        status: res.data.status,
        holdExpiresAt: res.data.hold_expires_at,
        guestToken: res.data.guest_token,
        latestPayment: res.data.latest_payment
          ? {
              id: res.data.latest_payment.id,
              type: res.data.latest_payment.type,
              method: res.data.latest_payment.method,
              amount: res.data.latest_payment.amount,
              status: res.data.latest_payment.status,
              proofUrl: res.data.latest_payment.proof_url ?? undefined,
              proofNote: res.data.latest_payment.proof_note ?? undefined,
              payBy: res.data.latest_payment.pay_by,
              createdAt: res.data.latest_payment.created_at,
              updatedAt: res.data.latest_payment.updated_at,
            }
          : undefined,
        paymentFlow: res.data.payment_flow,
        amounts: res.data.amounts,
        timeline: res.data.timeline?.map((t) => ({
          event: t.event,
          at: t.at,
          meta: t.meta,
        })),
      };
    },
  });
}
