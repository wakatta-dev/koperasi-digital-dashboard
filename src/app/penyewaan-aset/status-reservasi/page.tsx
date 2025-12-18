/** @format */

import type { Metadata } from "next";

import {
  StatusReservationPage,
  verifySignature,
} from "@/modules/asset-reservation/status-reservation";
import type { ReservationState } from "@/modules/asset-reservation/status-reservation";

type StatusReservationRouteProps = {
  searchParams?: Promise<{ state?: string; sig?: string }>;
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
  const state: ReservationState =
    searchParamsResolved?.state === "done" ? "done" : "dp";
  const hasSignature = verifySignature(searchParamsResolved?.sig);

  return <StatusReservationPage state={state} hasSignature={hasSignature} />;
}
