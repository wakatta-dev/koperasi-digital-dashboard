/** @format */

"use client";

import { RepaymentBreadcrumb } from "./components/repayment-breadcrumb";
import { RepaymentHeader } from "./components/repayment-header";
import { RepaymentSummaryCard } from "./components/repayment-summary-card";
import { RepaymentSidebar } from "./components/repayment-sidebar";
import { PaymentMethods } from "../payment/components/payment-methods";
import { PaymentShell } from "../payment/shared/payment-shell";
import { useReservation } from "../hooks";
import { humanizeReservationStatus } from "../utils/status";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "@/hooks/queries/queryKeys";

type AssetRepaymentPageProps = {
  reservationId?: string;
};

export function AssetRepaymentPage({ reservationId }: AssetRepaymentPageProps) {
  const { data: reservation, isLoading: loading, error } = useReservation(reservationId);
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;
  const queryClient = useQueryClient();

  return (
    <PaymentShell
      mode="settlement"
      loading={loading}
      error={errorMessage}
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
              Sisa tagihan: Rp{reservation.amounts.remaining.toLocaleString("id-ID")}
            </div>
          </div>
        ) : null
      }
      breadcrumb={
        <RepaymentBreadcrumb
          detailLabel={
            reservation?.reservationId
              ? `Detail Permintaan #${reservation.reservationId}`
              : "Detail Permintaan"
          }
        />
      }
      header={<RepaymentHeader backHref="/penyewaan-aset/status" />}
      summary={reservation ? <RepaymentSummaryCard reservation={reservation} /> : null}
      methods={
        reservation ? (
          <PaymentMethods
            mode="settlement"
            reservationId={reservation.reservationId}
            onStatusChange={() => {
              queryClient.invalidateQueries({ queryKey: QK.assetRental.bookings() });
              queryClient.invalidateQueries({
                queryKey: QK.assetRental.reservation(reservation.reservationId ?? ""),
              });
            }}
          />
        ) : null
      }
      sidebar={reservation ? <RepaymentSidebar reservation={reservation} /> : null}
    />
  );
}
