/** @format */

import type {
  MarketplaceAccountingReadinessResponse,
  MarketplaceOrderDetailResponse,
  MarketplaceOrderSummaryResponse,
} from "@/types/api/marketplace";
import type { AssetRentalBooking } from "@/types/api/asset-rental";
import type { ReservationDetailResponse } from "@/types/api/reservation";

export type OperationalTraceRow = {
  key: string;
  domain: "marketplace" | "rental";
  sourceId: string;
  title: string;
  reference: string;
  operationalStatus: string;
  paymentStatus: string;
  accountingStatus: string;
  accountingReason: string;
  reconciliationStatus: "Sesuai" | "Perlu Tindak Lanjut";
  reportingStatus: "Siap Dilaporkan" | "Tahan Pelaporan";
  reportingReason: string;
  attentionScope: "operasional" | "pembayaran" | "accounting" | null;
  attentionSummary: string | null;
  detailHref: string;
};

export type OperationalTraceSummary = {
  total: number;
  ready: number;
  needsAttention: number;
  matched: number;
  mismatched: number;
  reportingReady: number;
  reportingBlocked: number;
};

function toTitleCase(value?: string) {
  const normalized = (value ?? "").trim();
  if (!normalized) return "-";
  return normalized
    .split("_")
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toAccountingStatusLabel(
  readiness?: MarketplaceAccountingReadinessResponse | { status?: string | null } | null,
) {
  const status = String(readiness?.status ?? "")
    .trim()
    .toLowerCase();

  switch (status) {
    case "ready":
      return "Siap Ditinjau";
    case "problematic":
      return "Bermasalah";
    case "not_applicable":
      return "Tidak Perlu Posting";
    case "not_ready":
    default:
      return "Belum Siap";
  }
}

function toPaymentStatusLabel(status?: string) {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "succeeded":
    case "confirmed":
      return "Terverifikasi";
    case "failed":
    case "rejected":
      return "Bermasalah";
    case "pending_verification":
      return "Menunggu Verifikasi";
    case "pending":
      return "Menunggu Pembayaran";
    default:
      return toTitleCase(normalized);
  }
}

export function buildMarketplaceTraceRows(
  orders: MarketplaceOrderSummaryResponse[] | undefined,
): OperationalTraceRow[] {
  if (!orders?.length) return [];

  return orders.map((order) => {
    const paymentStatus = toPaymentStatusLabel(order.payment_status);
    const accountingStatus = toAccountingStatusLabel(order.accounting_readiness);
    const accountingReason =
      order.accounting_readiness?.reason ||
      "Status kesiapan accounting belum dilengkapi.";
    const reconciliationStatus = toReconciliationStatus(paymentStatus, accountingStatus);
    const reportingStatus = toReportingStatus(reconciliationStatus, accountingStatus);
    const attentionScope = toAttentionScope({
      operationalStatus: toTitleCase(order.status),
      paymentStatus,
      accountingStatus,
      reconciliationStatus,
    });

    return {
      key: `marketplace-${order.id}`,
      domain: "marketplace",
      sourceId: String(order.id),
      title: order.order_number,
      reference:
        order.accounting_readiness?.reference || order.order_number || `MKP-${order.id}`,
      operationalStatus: toTitleCase(order.status),
      paymentStatus,
      accountingStatus,
      accountingReason,
      reconciliationStatus,
      reportingStatus,
      reportingReason: toReportingReason({
        reportingStatus,
        reconciliationStatus,
        accountingStatus,
        accountingReason,
      }),
      attentionScope,
      attentionSummary: toAttentionSummary({
        attentionScope,
        paymentStatus,
        accountingStatus,
        accountingReason,
      }),
      detailHref: `/bumdes/marketplace/order/${order.id}`,
    };
  });
}

export function buildRentalTraceRows(
  bookings: AssetRentalBooking[] | undefined,
): OperationalTraceRow[] {
  if (!bookings?.length) return [];

  return bookings.map((booking) => {
    const paymentStatus = toPaymentStatusLabel(booking.latest_payment?.status);
    const accountingStatus = toAccountingStatusLabel(booking.accounting_readiness);
    const accountingReason =
      booking.accounting_readiness?.reason ||
      "Status kesiapan accounting belum dilengkapi.";
    const reconciliationStatus = toReconciliationStatus(paymentStatus, accountingStatus);
    const reportingStatus = toReportingStatus(reconciliationStatus, accountingStatus);
    const attentionScope = toAttentionScope({
      operationalStatus: toTitleCase(booking.status),
      paymentStatus,
      accountingStatus,
      reconciliationStatus,
    });

    return {
      key: `rental-${booking.id}`,
      domain: "rental",
      sourceId: String(booking.id),
      title: `Booking #${String(booking.id).padStart(5, "0")}`,
      reference:
        booking.accounting_readiness?.reference || `RSV-${String(booking.id).padStart(6, "0")}`,
      operationalStatus: toTitleCase(booking.status),
      paymentStatus,
      accountingStatus,
      accountingReason,
      reconciliationStatus,
      reportingStatus,
      reportingReason: toReportingReason({
        reportingStatus,
        reconciliationStatus,
        accountingStatus,
        accountingReason,
      }),
      attentionScope,
      attentionSummary: toAttentionSummary({
        attentionScope,
        paymentStatus,
        accountingStatus,
        accountingReason,
      }),
      detailHref: `/bumdes/asset/pengajuan-sewa/${booking.id}`,
    };
  });
}

export function buildOperationalTraceRows(params: {
  marketplaceOrders?: MarketplaceOrderSummaryResponse[];
  rentalBookings?: AssetRentalBooking[];
}): OperationalTraceRow[] {
  return [
    ...buildMarketplaceTraceRows(params.marketplaceOrders),
    ...buildRentalTraceRows(params.rentalBookings),
  ];
}

export function summarizeOperationalTrace(rows: OperationalTraceRow[]): OperationalTraceSummary {
  return rows.reduce<OperationalTraceSummary>(
    (acc, row) => {
      acc.total += 1;
      if (row.accountingStatus === "Siap Ditinjau") {
        acc.ready += 1;
      }
      if (row.accountingStatus === "Bermasalah" || row.accountingStatus === "Belum Siap") {
        acc.needsAttention += 1;
      }
      if (row.reconciliationStatus === "Sesuai") {
        acc.matched += 1;
      } else {
        acc.mismatched += 1;
      }
      if (row.reportingStatus === "Siap Dilaporkan") {
        acc.reportingReady += 1;
      } else {
        acc.reportingBlocked += 1;
      }
      return acc;
    },
    {
      total: 0,
      ready: 0,
      needsAttention: 0,
      matched: 0,
      mismatched: 0,
      reportingReady: 0,
      reportingBlocked: 0,
    },
  );
}

export function filterOperationalTraceRows(
  rows: OperationalTraceRow[],
  filter: "all" | "attention" | "matched",
) {
  switch (filter) {
    case "attention":
      return rows.filter((row) => row.reconciliationStatus === "Perlu Tindak Lanjut");
    case "matched":
      return rows.filter((row) => row.reconciliationStatus === "Sesuai");
    default:
      return rows;
  }
}

export function filterFollowUpQueueRows(
  rows: OperationalTraceRow[],
  scope: "all" | "operasional" | "pembayaran" | "accounting",
) {
  const queueRows = rows.filter((row) => row.attentionScope !== null);
  if (scope === "all") {
    return queueRows;
  }
  return queueRows.filter((row) => row.attentionScope === scope);
}

function toReconciliationStatus(paymentStatus: string, accountingStatus: string) {
  if (accountingStatus === "Tidak Perlu Posting") {
    return "Sesuai";
  }
  if (paymentStatus === "Terverifikasi" && accountingStatus === "Siap Ditinjau") {
    return "Sesuai";
  }
  return "Perlu Tindak Lanjut";
}

function toReportingStatus(
  reconciliationStatus: OperationalTraceRow["reconciliationStatus"],
  accountingStatus: OperationalTraceRow["accountingStatus"],
) {
  if (
    reconciliationStatus === "Sesuai" &&
    (accountingStatus === "Siap Ditinjau" || accountingStatus === "Tidak Perlu Posting")
  ) {
    return "Siap Dilaporkan";
  }
  return "Tahan Pelaporan";
}

function toReportingReason(params: {
  reportingStatus: OperationalTraceRow["reportingStatus"];
  reconciliationStatus: OperationalTraceRow["reconciliationStatus"];
  accountingStatus: OperationalTraceRow["accountingStatus"];
  accountingReason: string;
}) {
  if (params.reportingStatus === "Siap Dilaporkan") {
    return "Identifier transaksi dan linkage accounting sudah konsisten untuk pelaporan inti.";
  }
  if (params.accountingStatus === "Bermasalah") {
    return "Transaksi ditahan dari pelaporan karena ada exception accounting atau handoff.";
  }
  if (params.reconciliationStatus === "Perlu Tindak Lanjut") {
    return "Transaksi belum sinkron penuh antara pembayaran dan accounting readiness.";
  }
  return params.accountingReason;
}

function toAttentionScope(params: {
  operationalStatus: string;
  paymentStatus: string;
  accountingStatus: string;
  reconciliationStatus: OperationalTraceRow["reconciliationStatus"];
}) {
  if (params.reconciliationStatus === "Sesuai") {
    return null;
  }
  if (params.paymentStatus === "Menunggu Pembayaran" || params.paymentStatus === "Menunggu Verifikasi" || params.paymentStatus === "Bermasalah") {
    return "pembayaran";
  }
  if (params.accountingStatus === "Belum Siap" || params.accountingStatus === "Bermasalah") {
    return "accounting";
  }
  if (params.operationalStatus === "Canceled" || params.operationalStatus === "Rejected") {
    return "operasional";
  }
  return "operasional";
}

function toAttentionSummary(params: {
  attentionScope: OperationalTraceRow["attentionScope"];
  paymentStatus: string;
  accountingStatus: string;
  accountingReason: string;
}) {
  switch (params.attentionScope) {
    case "pembayaran":
      return `Perlu follow-up pembayaran: ${params.paymentStatus}.`;
    case "accounting":
      return `Perlu follow-up accounting: ${params.accountingStatus}. ${params.accountingReason}`;
    case "operasional":
      return "Perlu follow-up operasional agar transaksi dapat bergerak ke status berikutnya.";
    default:
      return null;
  }
}

export function getTraceProofUrl(params: {
  domain: OperationalTraceRow["domain"];
  marketplaceDetail?: MarketplaceOrderDetailResponse | null;
  rentalDetail?: ReservationDetailResponse | null;
}) {
  if (params.domain === "marketplace") {
    return params.marketplaceDetail?.manual_payment?.proof_url || null;
  }
  return params.rentalDetail?.latest_payment?.proof_url || null;
}
