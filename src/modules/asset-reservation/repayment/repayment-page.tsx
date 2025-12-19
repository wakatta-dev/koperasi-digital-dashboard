/** @format */

"use client";

import { RepaymentBreadcrumb } from "./components/repayment-breadcrumb";
import { RepaymentHeader } from "./components/repayment-header";
import { RepaymentSummaryCard } from "./components/repayment-summary-card";
import { RepaymentSidebar } from "./components/repayment-sidebar";
import { REPAYMENT_BREADCRUMB } from "./constants";
import { PaymentMethods } from "../payment/components/payment-methods";
import { REPAYMENT_METHOD_GROUPS } from "./constants";
import { PaymentShell } from "../payment/shared/payment-shell";
import { useReservation } from "../hooks";

type AssetRepaymentPageProps = {
  reservationId?: string;
};

export function AssetRepaymentPage({ reservationId }: AssetRepaymentPageProps) {
  const { data: reservation, isLoading: loading, error } = useReservation(reservationId);
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

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
              Status: <span className="font-medium">{reservation.status}</span>
            </div>
            <div>
              Sisa tagihan: Rp{reservation.amounts.remaining.toLocaleString("id-ID")}
            </div>
          </div>
        ) : null
      }
      breadcrumb={<RepaymentBreadcrumb />}
      header={<RepaymentHeader backHref={REPAYMENT_BREADCRUMB.backHref} />}
      summary={reservation ? <RepaymentSummaryCard /> : null}
      methods={
        reservation ? (
          <PaymentMethods
            mode="settlement"
            methodGroups={REPAYMENT_METHOD_GROUPS as any}
            reservationId={reservation.reservationId}
          />
        ) : null
      }
      sidebar={<RepaymentSidebar />}
    />
  );
}
