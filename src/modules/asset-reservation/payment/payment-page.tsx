/** @format */

"use client";

import { PaymentBreadcrumb } from "./components/payment-breadcrumb";
import { PaymentHeader } from "./components/payment-header";
import { RentalSummaryCard } from "./components/rental-summary-card";
import { PaymentMethods } from "./components/payment-methods";
import { PaymentSidebar } from "./components/payment-sidebar";
import { PAYMENT_BREADCRUMB } from "./constants";
import { PaymentShell } from "./shared/payment-shell";
import { useReservation } from "../hooks";

type AssetPaymentPageProps = {
  reservationId?: string;
};

export function AssetPaymentPage({ reservationId }: AssetPaymentPageProps) {
  const { data: reservation, isLoading: loading, error } = useReservation(reservationId);
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  return (
    <PaymentShell
      mode="dp"
      loading={loading}
      error={errorMessage}
      info={
        reservation ? (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
            <div className="font-semibold">ID Reservasi: {reservation.reservationId}</div>
            <div>
              Status: <span className="font-medium">{reservation.status}</span>
            </div>
            <div>
              DP: Rp{reservation.amounts.dp.toLocaleString("id-ID")} · Sisa: Rp
              {reservation.amounts.remaining.toLocaleString("id-ID")}
            </div>
          </div>
        ) : null
      }
      breadcrumb={<PaymentBreadcrumb />}
      header={<PaymentHeader backHref={PAYMENT_BREADCRUMB.backHref} />}
      summary={reservation ? <RentalSummaryCard /> : null}
      methods={
        reservation ? <PaymentMethods mode="dp" reservationId={reservation?.reservationId} /> : null
      }
      sidebar={<PaymentSidebar />}
    />
  );
}
