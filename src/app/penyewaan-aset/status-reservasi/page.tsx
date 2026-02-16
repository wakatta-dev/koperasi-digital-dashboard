/** @format */

import type { Metadata } from "next";

import { StatusReservationPage } from "@/modules/asset-reservation/status-reservation";
import type { ReservationState } from "@/modules/asset-reservation/status-reservation";
import { verifyGuestLink } from "@/services/api/reservations";

type StatusReservationRouteProps = {
  searchParams?: Promise<{ state?: string; sig?: string; id?: string }>;
};

export const metadata: Metadata = {
  title: "Detail Reservasi Tamu - BUMDes Sukamaju",
  description:
    "Lihat status reservasi aset Anda dengan tautan aman yang dikirim setelah pembayaran DP.",
};

export default async function StatusReservasiPage({
  searchParams,
}: StatusReservationRouteProps) {
  const searchParamsResolved = await searchParams;
  const rawReservationId = searchParamsResolved?.id ?? "";
  const parsedReservationId = rawReservationId ? Number.parseInt(rawReservationId, 10) : Number.NaN;
  const reservationId =
    Number.isFinite(parsedReservationId) && parsedReservationId > 0 ? parsedReservationId : undefined;
  const signature = searchParamsResolved?.sig ?? "";

  const guestLink = reservationId
    ? await verifyGuestLink({
        reservationId,
        token: signature,
      })
    : null;

  const allowed = Boolean(guestLink?.success && guestLink.data?.allowed);

  const state: ReservationState = (() => {
    const backendStatus = guestLink?.data?.status?.toLowerCase();
    if (backendStatus === "confirmed_full" || backendStatus === "completed") return "done";
    if (
      backendStatus === "confirmed_dp" ||
      backendStatus === "awaiting_settlement"
    )
      return "dp";
    if (backendStatus === "awaiting_dp" || backendStatus === "pending_review")
      return "dp";
    return searchParamsResolved?.state === "done" ? "done" : "dp";
  })();

  return (
    <StatusReservationPage
      state={state}
      hasSignature={allowed}
      accessToken={signature}
      reservationId={guestLink?.data?.reservation_id ?? reservationId}
    />
  );
}
