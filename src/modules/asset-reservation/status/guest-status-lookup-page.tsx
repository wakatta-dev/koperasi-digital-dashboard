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
import { resolvePublicReservationStatusPresentation } from "../guest/utils/public-status";
import {
  GuestRequestStatusFeature,
  type GuestRequestPaymentInstruction,
  type GuestRequestStatusResult,
} from "../guest/components/status/GuestRequestStatusFeature";
import { UploadPaymentProofModalFeature } from "../guest/components/status/UploadPaymentProofModalFeature";
import { inclusiveEndDate, parseLocalDateInput } from "@/lib/date-only";

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
  const s = parseLocalDateInput(start);
  const e = inclusiveEndDate(end);
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
  if (status === "confirmed_dp" || status === "awaiting_settlement") {
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

function resolveLatestPaymentStatus(
  rawStatus?: string | null,
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

function resolveInconsistentVerificationFallback(input: {
  paymentFlow: "dp" | "settlement_direct" | "pending_decision";
  latestPaymentType?: "dp" | "settlement";
}): ReservationStatus {
  if (input.latestPaymentType === "settlement") return "awaiting_settlement";
  if (input.latestPaymentType === "dp") return "awaiting_dp";
  if (input.paymentFlow === "settlement_direct") return "awaiting_settlement";
  if (input.paymentFlow === "pending_decision") return "pending_review";
  return "awaiting_dp";
}

function resolveDisplayedReservationState(input: {
  status: ReservationStatus;
  paymentFlow: "dp" | "settlement_direct" | "pending_decision";
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
      "Status pembayaran belum sinkron. Jika Anda baru mengirim bukti, tunggu beberapa menit lalu muat ulang halaman atau hubungi admin desa.",
  };
}

export function GuestStatusLookupPage() {
  const [uiState, setUiState] = useState({
    ticket: "",
    contact: "",
    paymentOpen: false,
    paymentId: null as string | null,
    paymentAmountLabel: "-",
  });
  const { ticket, contact, paymentOpen, paymentId, paymentAmountLabel } =
    uiState;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  const lookup = useLookupReservationByTicket();
  const createPayment = useCreateGuestPaymentSession();
  const uploadProof = useUploadGuestPaymentProof();

  const reservation = lookup.data ?? null;
  const status = reservation ? toReservationStatus(reservation.status) : null;
  const latestPaymentType = useMemo(
    () => resolveLatestPaymentType(reservation?.latest_payment?.type),
    [reservation?.latest_payment?.type]
  );
  const latestPaymentStatus = useMemo(
    () => resolveLatestPaymentStatus(reservation?.latest_payment?.status),
    [reservation?.latest_payment?.status],
  );
  const paymentFlow = useMemo(() => {
    if (!status) return "pending_decision" as const;
    return resolvePaymentFlow({
      status,
      backendFlow: reservation?.payment_flow,
      latestPaymentType,
    });
  }, [latestPaymentType, reservation?.payment_flow, status]);
  const statusResolution = useMemo(() => {
    if (!status) return null;
    return resolveDisplayedReservationState({
      status,
      paymentFlow,
      latestPaymentType,
      latestPaymentStatus,
    });
  }, [latestPaymentStatus, latestPaymentType, paymentFlow, status]);
  const effectiveStatus = statusResolution?.status ?? null;

  const paymentInstruction = useMemo(() => {
    if (!reservation || !effectiveStatus) return undefined;
    return paymentInstructionForStatus(effectiveStatus, paymentFlow, reservation.amounts);
  }, [effectiveStatus, paymentFlow, reservation]);

  const result: GuestRequestStatusResult | null = useMemo(() => {
    if (!reservation || !effectiveStatus) return null;
    const titleAsset = reservation.asset_name?.trim() || "Aset";
    const statusPresentation =
      resolvePublicReservationStatusPresentation(effectiveStatus);

    return {
      requestTitle: `Pengajuan Sewa ${titleAsset}`,
      ticketLabel: formatTicketFromReservationId(reservation.reservation_id),
      badgeLabel: statusPresentation.badgeLabel,
      variant: statusPresentation.variant,
      status: effectiveStatus,
      statusDescription: statusPresentation.description,
      dataWarning: statusResolution?.warning,
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
      paymentHref:
        paymentInstruction && reservation.guest_token
          ? `/penyewaan-aset/payment?reservationId=${encodeURIComponent(
              String(reservation.reservation_id),
            )}&type=${encodeURIComponent(
              paymentInstruction.mode,
            )}&sig=${encodeURIComponent(reservation.guest_token)}`
          : undefined,
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
              patchUiState({
                paymentId: session.payment_id,
                paymentAmountLabel: paymentInstruction.amountLabel,
                paymentOpen: true,
              });
            } catch (_err) {
              // Keep UI copy unchanged; failures surface through disabled states in future iterations.
            }
          }
        : undefined,
    };
  }, [createPayment, effectiveStatus, latestPaymentType, paymentFlow, paymentInstruction, reservation, statusResolution?.warning]);

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
            onTicketValueChange={(value) => patchUiState({ ticket: value })}
            contactValue={contact}
            onContactValueChange={(value) => patchUiState({ contact: value })}
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
          onOpenChange={(open) => patchUiState({ paymentOpen: open })}
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
            patchUiState({ paymentOpen: false });
          }}
        />
      </div>
    </div>
  );
}
