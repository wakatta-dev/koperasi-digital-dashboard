/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { useMemo, useState } from "react";

import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import {
  useCreateGuestPaymentSession,
  useLookupReservationByTicket,
  useUploadGuestPaymentProof,
} from "../hooks";
import { formatTicketFromReservationId } from "../guest/utils/ticket";
import { mapStatusToVariant } from "../guest/utils/status-variants";
import {
  GuestRequestStatusFeature,
  type GuestRequestStatusResult,
  type GuestRequestStatusVariant,
} from "../guest/components/status/GuestRequestStatusFeature";
import { UploadPaymentProofModalFeature } from "../guest/components/status/UploadPaymentProofModalFeature";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function formatCurrency(amount?: number) {
  const safe = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  return `Rp ${safe.toLocaleString("id-ID")}`;
}

function formatDateRange(start?: string, end?: string) {
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  const validS = s && !Number.isNaN(s.getTime()) ? s : null;
  const validE = e && !Number.isNaN(e.getTime()) ? e : null;
  if (!validS || !validE) return "-";
  const startLabel = validS.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const endLabel = validE.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${startLabel} - ${endLabel}`;
}

function mapVariant(status: string): GuestRequestStatusVariant {
  const normalized = (status || "").toLowerCase() as any;
  const guestVariant = mapStatusToVariant(normalized);
  switch (guestVariant) {
    case "approved_payment":
      return "approved";
    case "completed":
      return "completed";
    case "rejected":
    case "cancelled":
    case "expired":
      return "rejected";
    case "pending":
    default:
      return "verifying";
  }
}

function badgeLabelForVariant(variant: GuestRequestStatusVariant) {
  switch (variant) {
    case "approved":
      return "Disetujui";
    case "completed":
      return "Selesai";
    case "rejected":
      return "Ditolak";
    case "verifying":
    default:
      return "Sedang Diverifikasi";
  }
}

export function GuestStatusLookupPage() {
  const [ticket, setTicket] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const lookup = useLookupReservationByTicket();
  const createPayment = useCreateGuestPaymentSession();
  const uploadProof = useUploadGuestPaymentProof();

  const reservation = lookup.data ?? null;
  const variant = reservation ? mapVariant(reservation.status) : null;

  const result: GuestRequestStatusResult | null = useMemo(() => {
    if (!reservation || !variant) return null;
    const titleAsset = reservation.asset_name?.trim() || "Aset";
    return {
      requestTitle: `Pengajuan Sewa ${titleAsset}`,
      ticketLabel: formatTicketFromReservationId(reservation.reservation_id),
      badgeLabel: badgeLabelForVariant(variant),
      variant,
      details: {
        renterName: reservation.renter_name || "-",
        assetKind: reservation.asset_name || "-",
        dateRangeLabel: formatDateRange(reservation.start_date, reservation.end_date),
        totalLabel: formatCurrency(reservation.amounts?.total),
      },
      rejectionReason: reservation.rejection_reason || undefined,
      onOpenUploadProof:
        variant === "approved"
          ? async () => {
              try {
                const session = await createPayment.mutateAsync({
                  reservation_id: reservation.reservation_id,
                  type: "dp",
                  method: "transfer_bank",
                });
                setPaymentId(session.payment_id);
                setPaymentOpen(true);
              } catch (_err) {
                // Keep UI copy unchanged; failures surface through disabled states in future iterations.
              }
            }
          : undefined,
    };
  }, [createPayment, reservation, variant]);

  const totalLabel = useMemo(() => {
    const total = reservation?.amounts?.total ?? 0;
    return formatCurrency(total);
  }, [reservation?.amounts?.total]);

  return (
    <div className="bg-surface-subtle dark:bg-surface-dark text-surface-text dark:text-surface-text-dark min-h-screen flex flex-col">
      <LandingNavbar activeLabel="Penyewaan Aset" />
      <div
        className={`asset-rental-guest ${plusJakarta.className} flex min-h-0 flex-1 flex-col`}
      >
        <main className="flex-grow pt-20">
          <GuestRequestStatusFeature
            ticketValue={ticket}
            onTicketValueChange={setTicket}
            submitting={lookup.isPending}
            onSubmit={() => {
              if (!ticket.trim()) return;
              lookup.mutate(ticket.trim());
            }}
            result={result}
          />
        </main>
        <AssetReservationFooter />

        <UploadPaymentProofModalFeature
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          totalLabel={totalLabel}
          submitting={uploadProof.isPending}
          onSubmit={async ({ file, note }) => {
            if (!paymentId) return;
            await uploadProof.mutateAsync({ paymentId, file, note });
            setPaymentOpen(false);
          }}
        />
      </div>
    </div>
  );
}
