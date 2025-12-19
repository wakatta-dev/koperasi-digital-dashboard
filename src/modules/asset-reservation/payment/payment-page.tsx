/** @format */

"use client";

import { useEffect, useState } from "react";

import { PaymentBreadcrumb } from "./components/payment-breadcrumb";
import { PaymentHeader } from "./components/payment-header";
import { RentalSummaryCard } from "./components/rental-summary-card";
import { PaymentMethods } from "./components/payment-methods";
import { PaymentSidebar } from "./components/payment-sidebar";
import { PAYMENT_BREADCRUMB } from "./constants";
import { PaymentShell } from "./shared/payment-shell";
import { getReservation } from "@/services/api/reservations";
import type { ReservationSummary } from "../types";

type AssetPaymentPageProps = {
  reservationId?: string;
};

export function AssetPaymentPage({ reservationId }: AssetPaymentPageProps) {
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
      mode="dp"
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
              DP: Rp{reservation.amounts.dp.toLocaleString("id-ID")} · Sisa: Rp
              {reservation.amounts.remaining.toLocaleString("id-ID")}
            </div>
          </div>
        ) : null
      }
      breadcrumb={<PaymentBreadcrumb />}
      header={<PaymentHeader backHref={PAYMENT_BREADCRUMB.backHref} />}
      summary={<RentalSummaryCard />}
      methods={<PaymentMethods mode="dp" reservationId={reservationId} />}
      sidebar={<PaymentSidebar />}
    />
  );
}
