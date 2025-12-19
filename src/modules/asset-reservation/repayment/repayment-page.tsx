/** @format */

"use client";

import { useEffect, useState } from "react";

import { RepaymentBreadcrumb } from "./components/repayment-breadcrumb";
import { RepaymentHeader } from "./components/repayment-header";
import { RepaymentSummaryCard } from "./components/repayment-summary-card";
import { RepaymentSidebar } from "./components/repayment-sidebar";
import { REPAYMENT_BREADCRUMB } from "./constants";
import { PaymentMethods } from "../payment/components/payment-methods";
import { REPAYMENT_METHOD_GROUPS } from "./constants";
import { PaymentShell } from "../payment/shared/payment-shell";
import { getReservation } from "@/services/api/reservations";
import type { ReservationSummary } from "../types";

type AssetRepaymentPageProps = {
  reservationId?: string;
};

export function AssetRepaymentPage({ reservationId }: AssetRepaymentPageProps) {
  const [reservation, setReservation] = useState<ReservationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchReservation() {
      if (!reservationId) {
        setError("Reservasi tidak ditemukan.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getReservation(reservationId);
        if (ignore) return;
        if (res.success && res.data) {
          setReservation({
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
            amounts: res.data.amounts,
            timeline: res.data.timeline?.map((t) => ({
              event: t.event,
              at: t.at,
              meta: t.meta,
            })),
          });
        } else {
          setError(res.message || "Tidak dapat memuat reservasi.");
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Gagal memuat reservasi.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchReservation();
    return () => {
      ignore = true;
    };
  }, [reservationId]);

  return (
    <PaymentShell
      mode="settlement"
      loading={loading}
      error={error}
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
      summary={<RepaymentSummaryCard />}
      methods={
        <PaymentMethods
          mode="settlement"
          methodGroups={REPAYMENT_METHOD_GROUPS as any}
          reservationId={reservationId}
        />
      }
      sidebar={<RepaymentSidebar />}
    />
  );
}
