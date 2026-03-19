/** @format */

"use client";

import { PaymentBreadcrumb } from "./components/payment-breadcrumb";
import { PaymentHeader } from "./components/payment-header";
import { RentalSummaryCard } from "./components/rental-summary-card";
import { PaymentMethods } from "./components/payment-methods";
import { PaymentSidebar } from "./components/payment-sidebar";
import { PaymentShell } from "./shared/payment-shell";
import { useReservation } from "../hooks";
import { humanizeReservationStatus } from "../utils/status";
import { formatPublicReservationIdentifier } from "../guest/utils/public-status";
import { PAYMENT_METHOD_GROUPS } from "./constants";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "@/hooks/queries/queryKeys";
import { assessPublicPaymentAccess } from "./utils/public-payment";
import type { ReservationStatus } from "../types";

type AssetPaymentPageProps = {
  reservationId?: number;
  mode?: "dp" | "settlement";
  ownershipToken?: string;
};

function resolveLatestPaymentStatus(
  rawStatus?: string,
): "initiated" | "pending_verification" | "succeeded" | "failed" | "expired" | undefined {
  const normalized = (rawStatus || "").trim().toLowerCase();
  switch (normalized) {
    case "initiated":
    case "pending_verification":
    case "succeeded":
    case "failed":
    case "expired":
      return normalized;
    default:
      return undefined;
  }
}

function resolveLatestPaymentType(
  rawType?: string,
): "dp" | "settlement" | undefined {
  const normalized = (rawType || "").trim().toLowerCase();
  if (normalized === "dp") return "dp";
  if (normalized === "settlement") return "settlement";
  return undefined;
}

function resolveInconsistentVerificationFallback(input: {
  paymentFlow?: string;
  latestPaymentType?: "dp" | "settlement";
}): ReservationStatus {
  if (input.latestPaymentType === "settlement") return "awaiting_settlement";
  if (input.latestPaymentType === "dp") return "awaiting_dp";
  if ((input.paymentFlow || "").trim().toLowerCase() === "settlement_direct") {
    return "awaiting_settlement";
  }
  if ((input.paymentFlow || "").trim().toLowerCase() === "pending_decision") {
    return "pending_review";
  }
  return "awaiting_dp";
}

function resolveDisplayedPaymentStatus(input: {
  status: ReservationStatus;
  paymentFlow?: string;
  latestPaymentType?: "dp" | "settlement";
  latestPaymentStatus?:
    | "initiated"
    | "pending_verification"
    | "succeeded"
    | "failed"
    | "expired";
}): { status: ReservationStatus; warning?: string } {
  if (input.status !== "awaiting_payment_verification") {
    return { status: input.status };
  }

  if (
    !input.latestPaymentStatus ||
    input.latestPaymentStatus === "pending_verification" ||
    input.latestPaymentStatus === "succeeded"
  ) {
    return { status: input.status };
  }

  return {
    status: resolveInconsistentVerificationFallback({
      paymentFlow: input.paymentFlow,
      latestPaymentType: input.latestPaymentType,
    }),
    warning:
      "Status pembayaran belum sinkron. Jika Anda baru mengirim bukti, muat ulang beberapa menit lagi atau hubungi admin desa.",
  };
}

export function AssetPaymentPage({
  reservationId,
  mode = "dp",
  ownershipToken,
}: AssetPaymentPageProps) {
  const [sessionInfo, setSessionInfo] = React.useState<{
    amount?: number;
    payBy?: string;
  }>({});
  const queryClient = useQueryClient();
  const { data: reservation, isLoading: loading, error } = useReservation(
    reservationId,
    ownershipToken
  );
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  const infoMissingReservation = !reservationId && !loading;
  const paymentMode = mode;
  const paymentStatusResolution = reservation
    ? resolveDisplayedPaymentStatus({
        status: reservation.status,
        paymentFlow: reservation.paymentFlow,
        latestPaymentType: resolveLatestPaymentType(reservation.latestPayment?.type),
        latestPaymentStatus: resolveLatestPaymentStatus(
          reservation.latestPayment?.status,
        ),
      })
    : null;
  const effectivePaymentStatus =
    paymentStatusResolution?.status ?? reservation?.status;
  const paymentAccess = reservation
    ? assessPublicPaymentAccess(effectivePaymentStatus, paymentMode)
    : null;
  const publicPaymentError =
    reservation && paymentAccess && !paymentAccess.allowed
      ? paymentAccess.message
      : null;

  return (
    <PaymentShell
      mode={paymentMode}
      loading={loading}
      error={
        errorMessage ||
        (infoMissingReservation ? "ID reservasi tidak ditemukan." : null) ||
        publicPaymentError
      }
      info={
        reservation ? (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
            <div className="font-semibold">
              Nomor Tiket: {formatPublicReservationIdentifier(reservation.reservationId)}
            </div>
            <div>
              Status:{" "}
              <span className="font-medium">
                {humanizeReservationStatus(effectivePaymentStatus)}
              </span>
            </div>
            {paymentStatusResolution?.warning ? (
              <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                {paymentStatusResolution.warning}
              </div>
            ) : null}
            <div>
              {paymentMode === "dp"
                ? `DP: Rp${reservation.amounts.dp.toLocaleString("id-ID")} · Sisa: Rp${reservation.amounts.remaining.toLocaleString("id-ID")}`
                : `Sisa tagihan: Rp${reservation.amounts.remaining.toLocaleString("id-ID")}`}
            </div>
          </div>
        ) : null
      }
      breadcrumb={<PaymentBreadcrumb />}
      header={<PaymentHeader backHref="/penyewaan-aset/status" />}
      summary={
        reservation ? (
          <div data-testid="asset-rental-payment-summary-card">
            <RentalSummaryCard reservation={reservation} />
          </div>
        ) : null
      }
      methods={
        reservation && paymentAccess?.allowed ? (
          <PaymentMethods
            mode={paymentMode}
            methodGroups={PAYMENT_METHOD_GROUPS}
            reservationId={reservation?.reservationId}
            ownershipToken={ownershipToken || reservation?.guestToken}
            existingPayment={reservation?.latestPayment}
            onSessionChange={(session) => setSessionInfo({ amount: session?.amount, payBy: session?.payBy })}
            onStatusChange={() => {
              queryClient.invalidateQueries({ queryKey: QK.assetRental.bookings() });
              queryClient.invalidateQueries({
                queryKey: QK.assetRental.reservation(reservation?.reservationId ?? ""),
              });
            }}
          />
        ) : null
      }
      sidebar={
        reservation ? (
          <PaymentSidebar
            reservation={reservation}
            sessionAmount={sessionInfo.amount}
            sessionPayBy={sessionInfo.payBy}
            ownershipToken={ownershipToken || reservation?.guestToken}
          />
        ) : null
      }
    />
  );
}
