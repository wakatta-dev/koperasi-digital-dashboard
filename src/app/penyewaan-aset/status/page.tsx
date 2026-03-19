/** @format */

import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AssetStatusPage,
  GuestStatusLookupPage,
  type ReservationStatus,
} from "@/modules/asset-reservation/status";

type PenyewaanAsetStatusLookupRouteProps = {
  searchParams?: Promise<{
    id?: string;
    sig?: string;
    state?: string;
    status?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Cek Status Pengajuan - BUMDes Sukamaju",
  description:
    "Pantau status pengajuan sewa aset Anda menggunakan nomor pengajuan (contoh: #SQ-99210).",
};

function resolveReservationStatus(input?: {
  state?: string;
  status?: string;
}): ReservationStatus {
  const rawStatus = input?.status?.toLowerCase().trim();
  switch (rawStatus) {
    case "awaiting_dp":
    case "awaiting_payment_verification":
    case "confirmed_dp":
    case "awaiting_settlement":
    case "confirmed_full":
    case "completed":
    case "cancelled":
    case "rejected":
    case "expired":
    case "pending_review":
      return rawStatus;
    default:
      if (input?.state === "done") return "confirmed_full";
      if (input?.state === "dp") return "awaiting_dp";
      return "pending_review";
  }
}

export default async function PenyewaanAsetStatusLookupRoute({
  searchParams,
}: PenyewaanAsetStatusLookupRouteProps) {
  const searchParamsResolved = await searchParams;
  const rawReservationId = searchParamsResolved?.id ?? "";
  const parsedReservationId = rawReservationId
    ? Number.parseInt(rawReservationId, 10)
    : Number.NaN;
  const reservationId =
    Number.isFinite(parsedReservationId) && parsedReservationId > 0
      ? parsedReservationId
      : undefined;
  const accessToken = searchParamsResolved?.sig?.trim() || undefined;

  if (reservationId && accessToken) {
    return (
      <AssetStatusPage
        reservationId={reservationId}
        accessToken={accessToken}
        status={resolveReservationStatus({
          state: searchParamsResolved?.state,
          status: searchParamsResolved?.status,
        })}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          Memuat…
        </div>
      }
    >
      <GuestStatusLookupPage />
    </Suspense>
  );
}
