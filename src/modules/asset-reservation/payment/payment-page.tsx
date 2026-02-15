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
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "@/hooks/queries/queryKeys";

type AssetPaymentPageProps = {
  reservationId?: number;
  mode?: "dp" | "settlement";
  ownershipToken?: string;
};

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

  return (
    <PaymentShell
      mode={paymentMode}
      loading={loading}
      error={errorMessage || (infoMissingReservation ? "ID reservasi tidak ditemukan." : null)}
      info={
        reservation ? (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
            <div className="font-semibold">ID Reservasi: {reservation.reservationId}</div>
            <div>
              Status:{" "}
              <span className="font-medium">
                {humanizeReservationStatus(reservation.status)}
              </span>
            </div>
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
      summary={reservation ? <RentalSummaryCard reservation={reservation} /> : null}
      methods={
        reservation ? (
          <PaymentMethods
            mode={paymentMode}
            reservationId={reservation?.reservationId}
            ownershipToken={ownershipToken || reservation?.guestToken}
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
