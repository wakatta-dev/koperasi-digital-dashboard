/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { useMemo, useState } from "react";

import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import type { ReservationStatus } from "@/modules/asset-reservation/types";
import { AssetReservationFooter } from "../components/reservation-footer";
import {
  useCreateGuestPaymentSession,
  useLookupReservationByTicket,
  useUploadGuestPaymentProof,
} from "../hooks";
import { formatTicketFromReservationId } from "../guest/utils/ticket";
import {
  GuestRequestStatusFeature,
  type GuestRequestPaymentInstruction,
  type GuestRequestStatusResult,
  type GuestRequestStatusVariant,
} from "../guest/components/status/GuestRequestStatusFeature";
import { UploadPaymentProofModalFeature } from "../guest/components/status/UploadPaymentProofModalFeature";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function formatCurrency(amount?: number) {
  const safe =
    typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
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

function toReservationStatus(status: string): ReservationStatus {
  const normalized = (status || "").toLowerCase().trim();
  switch (normalized) {
    case "pending_review":
    case "awaiting_dp":
    case "awaiting_payment_verification":
    case "confirmed_dp":
    case "awaiting_settlement":
    case "confirmed_full":
    case "completed":
    case "cancelled":
    case "rejected":
    case "expired":
      return normalized;
    default:
      return "pending_review";
  }
}

function mapVariant(status: ReservationStatus): GuestRequestStatusVariant {
  switch (status) {
    case "awaiting_dp":
    case "awaiting_settlement":
    case "confirmed_dp":
    case "confirmed_full":
      return "approved";
    case "completed":
      return "completed";
    case "rejected":
    case "cancelled":
    case "expired":
      return "rejected";
    case "pending_review":
    case "awaiting_payment_verification":
    default:
      return "verifying";
  }
}

function badgeLabelForStatus(status: ReservationStatus) {
  switch (status) {
    case "pending_review":
      return "Menunggu Review Admin";
    case "awaiting_dp":
      return "Menunggu Pembayaran DP";
    case "awaiting_payment_verification":
      return "Menunggu Verifikasi Pembayaran";
    case "confirmed_dp":
      return "DP Terkonfirmasi";
    case "awaiting_settlement":
      return "Menunggu Pelunasan";
    case "confirmed_full":
      return "Masa Penggunaan";
    case "completed":
      return "Selesai";
    case "rejected":
      return "Ditolak";
    case "cancelled":
      return "Dibatalkan";
    case "expired":
      return "Kedaluwarsa";
    default:
      return "Menunggu Review Admin";
  }
}

function statusDescriptionForStatus(status: ReservationStatus) {
  switch (status) {
    case "pending_review":
      return "Pengajuan Anda sedang ditinjau admin BUMDes.";
    case "awaiting_dp":
      return "Pengajuan disetujui. Lanjutkan pembayaran DP untuk mengunci jadwal.";
    case "awaiting_payment_verification":
      return "Bukti pembayaran sudah diunggah dan menunggu verifikasi admin.";
    case "confirmed_dp":
      return "DP sudah dikonfirmasi. Menunggu hari pakai/pengambilan sebelum pelunasan.";
    case "awaiting_settlement":
      return "Silakan lakukan pelunasan sesuai nominal sisa tagihan.";
    case "confirmed_full":
      return "Pembayaran tervalidasi. Anda sedang dalam masa penggunaan aset.";
    case "completed":
      return "Penyewaan selesai. Kondisi pengembalian aset sudah dicatat admin.";
    case "rejected":
      return "Pengajuan tidak dapat diproses. Silakan cek alasan penolakan.";
    case "cancelled":
      return "Reservasi dibatalkan.";
    case "expired":
      return "Reservasi kedaluwarsa karena melewati batas waktu.";
    default:
      return "Pengajuan Anda sedang ditinjau admin BUMDes.";
  }
}

function paymentInstructionForStatus(
  status: ReservationStatus,
  paymentFlow: "dp" | "settlement_direct" | "pending_decision",
  amounts?: {
    total: number;
    dp: number;
    remaining: number;
  },
): GuestRequestPaymentInstruction | undefined {
  if (!amounts) return undefined;
  if (status === "awaiting_dp") {
    return {
      mode: "dp",
      modeLabel: "DP",
      amountLabel: formatCurrency(amounts.dp),
      description: "Lakukan pembayaran DP dan unggah bukti pembayaran.",
      ctaLabel: "Unggah Bukti DP",
    };
  }
  if (status === "awaiting_settlement") {
    const isDirectSettlement = paymentFlow === "settlement_direct";
    return {
      mode: "settlement",
      modeLabel: "Pelunasan",
      amountLabel: formatCurrency(isDirectSettlement ? amounts.total : amounts.remaining),
      description: isDirectSettlement
        ? "Lakukan pembayaran penuh (tanpa DP) lalu unggah bukti pembayaran."
        : "Lakukan pelunasan sisa tagihan dan unggah bukti pembayaran.",
      ctaLabel: "Unggah Bukti Pelunasan",
    };
  }
  return undefined;
}

function resolveLatestPaymentType(rawType?: string | null): "dp" | "settlement" | undefined {
  const normalized = (rawType || "").trim().toLowerCase();
  if (normalized === "dp") return "dp";
  if (normalized === "settlement") return "settlement";
  return undefined;
}

function resolvePaymentFlow(input: {
  status: ReservationStatus;
  backendFlow?: string;
  latestPaymentType?: "dp" | "settlement";
}): "dp" | "settlement_direct" | "pending_decision" {
  const normalizedFlow = (input.backendFlow || "").trim().toLowerCase();
  if (normalizedFlow === "dp" || normalizedFlow === "settlement_direct" || normalizedFlow === "pending_decision") {
    return normalizedFlow;
  }
  if (input.status === "pending_review") return "pending_decision";
  if (input.status === "awaiting_dp" || input.status === "confirmed_dp") return "dp";
  if (input.status === "awaiting_payment_verification") {
    return input.latestPaymentType === "dp" ? "dp" : "settlement_direct";
  }
  if (input.status === "awaiting_settlement") {
    return input.latestPaymentType === "dp" ? "dp" : "settlement_direct";
  }
  return "settlement_direct";
}

function shouldForceSettlementBySchedule(startDate?: string): boolean {
  if (!startDate) return false;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return false;
  return start.getTime() <= Date.now() + 72 * 60 * 60 * 1000;
}

export function GuestStatusLookupPage() {
  const [ticket, setTicket] = useState("");
  const [contact, setContact] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentAmountLabel, setPaymentAmountLabel] = useState<string>("-");

  const lookup = useLookupReservationByTicket();
  const createPayment = useCreateGuestPaymentSession();
  const uploadProof = useUploadGuestPaymentProof();

  const reservation = lookup.data ?? null;
  const status = reservation ? toReservationStatus(reservation.status) : null;
  const effectiveStatus = useMemo(() => {
    if (!status) return null;
    if (status === "awaiting_dp" && shouldForceSettlementBySchedule(reservation?.start_date)) {
      return "awaiting_settlement" as ReservationStatus;
    }
    return status;
  }, [reservation?.start_date, status]);
  const latestPaymentType = useMemo(
    () => resolveLatestPaymentType(reservation?.latest_payment?.type),
    [reservation?.latest_payment?.type]
  );
  const paymentFlow = useMemo(() => {
    if (!effectiveStatus) return "pending_decision" as const;
    return resolvePaymentFlow({
      status: effectiveStatus,
      backendFlow: reservation?.payment_flow,
      latestPaymentType,
    });
  }, [effectiveStatus, latestPaymentType, reservation?.payment_flow]);

  const paymentInstruction = useMemo(() => {
    if (!reservation || !effectiveStatus) return undefined;
    return paymentInstructionForStatus(effectiveStatus, paymentFlow, reservation.amounts);
  }, [effectiveStatus, paymentFlow, reservation]);

  const result: GuestRequestStatusResult | null = useMemo(() => {
    if (!reservation || !effectiveStatus) return null;
    const titleAsset = reservation.asset_name?.trim() || "Aset";
    const variant = mapVariant(effectiveStatus);

    return {
      requestTitle: `Pengajuan Sewa ${titleAsset}`,
      ticketLabel: formatTicketFromReservationId(reservation.reservation_id),
      badgeLabel: badgeLabelForStatus(effectiveStatus),
      variant,
      status: effectiveStatus,
      statusDescription: statusDescriptionForStatus(effectiveStatus),
      details: {
        renterName: reservation.renter_name || "-",
        assetKind: reservation.asset_name || "-",
        dateRangeLabel: formatDateRange(
          reservation.start_date,
          reservation.end_date,
        ),
        totalLabel: formatCurrency(reservation.amounts?.total),
      },
      rejectionReason: reservation.rejection_reason || undefined,
      paymentInstruction,
      paymentFlow,
      latestPaymentType,
      onOpenUploadProof: paymentInstruction
        ? async () => {
            try {
              if (!reservation.guest_token) return;
              const session = await createPayment.mutateAsync({
                reservation_id: reservation.reservation_id,
                type: paymentInstruction.mode,
                method: "transfer_bank",
                ownership_token: reservation.guest_token,
              });
              setPaymentId(session.payment_id);
              setPaymentAmountLabel(paymentInstruction.amountLabel);
              setPaymentOpen(true);
            } catch (_err) {
              // Keep UI copy unchanged; failures surface through disabled states in future iterations.
            }
          }
        : undefined,
    };
  }, [createPayment, effectiveStatus, latestPaymentType, paymentFlow, paymentInstruction, reservation]);

  const modalAmountLabel =
    paymentAmountLabel || formatCurrency(reservation?.amounts?.total);

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
            contactValue={contact}
            onContactValueChange={setContact}
            submitting={lookup.isPending || createPayment.isPending}
            onSubmit={() => {
              if (!ticket.trim() || !contact.trim()) return;
              lookup.mutate({ ticket: ticket.trim(), contact: contact.trim() });
            }}
            result={result}
          />
        </main>
        <AssetReservationFooter />

        <UploadPaymentProofModalFeature
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          totalLabel={modalAmountLabel}
          submitting={uploadProof.isPending}
          onSubmit={async ({ file, note }) => {
            if (
              !paymentId ||
              !reservation?.reservation_id ||
              !reservation.guest_token
            )
              return;
            await uploadProof.mutateAsync({
              paymentId,
              file,
              note,
              reservationId: reservation.reservation_id,
              ownershipToken: reservation.guest_token,
            });
            setPaymentOpen(false);
          }}
        />
      </div>
    </div>
  );
}
