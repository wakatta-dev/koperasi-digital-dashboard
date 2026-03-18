/** @format */

import type {
  AccountingJournalSourceTraceResponse,
} from "@/types/api/accounting-journal";
import type {
  MarketplaceAccountingReadinessResponse,
  MarketplaceOrderDetailResponse,
  MarketplaceOrderSummaryResponse,
} from "@/types/api/marketplace";
import type { AssetRentalBooking } from "@/types/api/asset-rental";
import type { ReservationDetailResponse } from "@/types/api/reservation";
import type { SupportOperationalExceptionContext } from "@/types/api/support";

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
  exceptionCode: string | null;
  exceptionSeverity: "low" | "medium" | "high" | null;
  exceptionRecommendation: string | null;
  queueOwnerLabel: string | null;
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

export type FinancialMaturityTone =
  | "success"
  | "warning"
  | "danger"
  | "muted";

export type FinancialMaturityReference = {
  label: string;
  value: string;
};

export type FinancialMaturityComponent = {
  key: string;
  label: string;
  statusLabel: string;
  summary: string;
  tone: FinancialMaturityTone;
  eventKey?: string | null;
  reference?: string | null;
  followUpReference?: string | null;
  evidenceReference?: string | null;
};

export type FinancialMaturityWorkspace = {
  domain: OperationalTraceRow["domain"];
  stageLabel: string;
  stageTone: FinancialMaturityTone;
  summary: string;
  governanceStatusLabel: string;
  governanceCode: string;
  governanceReason: string;
  activeExceptionStatusLabel: string;
  activeExceptionCode: string;
  activeExceptionSummary: string;
  activeExceptionOwner: string;
  activeExceptionNextStep: string;
  traceReferences: FinancialMaturityReference[];
  components: FinancialMaturityComponent[];
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

function deriveExceptionProfile(params: {
  attentionScope: OperationalTraceRow["attentionScope"];
  paymentStatus: string;
  accountingStatus: string;
  accountingReason: string;
}) {
  if (!params.attentionScope) {
    return {
      code: null,
      severity: null,
      recommendation: null,
      ownerLabel: null,
    };
  }

  const reason = params.accountingReason.toLowerCase();
  switch (params.attentionScope) {
    case "pembayaran":
      if (params.paymentStatus === "Bermasalah") {
        return {
          code: "ACC-PAYMENT-FAILED",
          severity: "high" as const,
          recommendation: "Selesaikan exception pembayaran atau minta bukti baru sebelum handoff accounting.",
          ownerLabel: "Finance",
        };
      }
      return {
        code: "ACC-PAYMENT-PENDING",
        severity: "medium" as const,
        recommendation: "Verifikasi pembayaran dan pastikan status pembayaran final sebelum handoff accounting.",
        ownerLabel: "Finance",
      };
    case "accounting":
      if (reason.includes("period") || reason.includes("periode")) {
        return {
          code: "ACC-PERIOD-LOCK",
          severity: "high" as const,
          recommendation: "Buka periode yang relevan atau ubah tanggal posting sebelum retry handoff.",
          ownerLabel: "Finance",
        };
      }
      if (
        reason.includes("coa") ||
        reason.includes("mapping") ||
        reason.includes("akun") ||
        reason.includes("account")
      ) {
        return {
          code: "ACC-COA-MAPPING",
          severity: "high" as const,
          recommendation: "Lengkapi mapping akun/control account lalu ulangi handoff accounting.",
          ownerLabel: "Finance",
        };
      }
      if (
        reason.includes("jurnal") ||
        reason.includes("journal") ||
        reason.includes("reference")
      ) {
        return {
          code: "ACC-JOURNAL-TRACE-MISSING",
          severity: "medium" as const,
          recommendation: "Validasi pembentukan reference jurnal dan sinkronkan trace source-to-journal.",
          ownerLabel: "Finance",
        };
      }
      return {
        code: "ACC-HANDOFF-BLOCKED",
        severity:
          params.accountingStatus === "Bermasalah"
            ? ("high" as const)
            : ("medium" as const),
        recommendation: "Tinjau blocker accounting backbone dan ulangi handoff setelah prasyarat terpenuhi.",
        ownerLabel: "Finance",
      };
    case "operasional":
    default:
      return {
        code: "OPS-HANDOFF-BLOCKED",
        severity: "medium" as const,
        recommendation: "Selesaikan langkah operasional yang tertahan agar transaksi dapat dilanjutkan ke accounting.",
        ownerLabel: "Admin Operasional",
      };
  }
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
    case "paid":
    case "succeeded":
    case "confirmed":
      return "Terverifikasi";
    case "pending_review":
      return "Menunggu Verifikasi";
    case "failed":
    case "rejected":
      return "Bermasalah";
    case "pending_payment":
      return "Menunggu Pembayaran";
    case "pending_verification":
      return "Menunggu Verifikasi";
    case "pending":
      return "Menunggu Pembayaran";
    default:
      return toTitleCase(normalized);
  }
}

function toMaturityTone(value?: string | null): FinancialMaturityTone {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (
    normalized.includes("BLOCK") ||
    normalized.includes("FAILED") ||
    normalized.includes("REJECT") ||
    normalized.includes("PROBLEM")
  ) {
    return "danger";
  }
  if (
    normalized.includes("PENDING") ||
    normalized.includes("SCHEDULED") ||
    normalized.includes("WAIT")
  ) {
    return "warning";
  }
  if (
    normalized.includes("READY") ||
    normalized.includes("POSTED") ||
    normalized.includes("PAID") ||
    normalized.includes("RECOGNIZED") ||
    normalized.includes("REFUNDED") ||
    normalized.includes("ALLOWED") ||
    normalized.includes("DIRECT_REVENUE")
  ) {
    return "success";
  }
  return "muted";
}

function pushTraceReference(
  references: FinancialMaturityReference[],
  label: string,
  value?: string | null,
) {
  const normalized = String(value ?? "").trim();
  if (!normalized || normalized === "-") {
    return;
  }
  if (references.some((reference) => reference.label === label && reference.value === normalized)) {
    return;
  }
  references.push({ label, value: normalized });
}

function buildMarketplaceMaturityComponents(
  trace: AccountingJournalSourceTraceResponse,
): FinancialMaturityComponent[] {
  const components: FinancialMaturityComponent[] = [];

  if (trace.settlement_mode || trace.payout_status) {
    components.push({
      key: "marketplace-settlement",
      label: "Settlement / Payout",
      statusLabel: [
        toTitleCase(trace.settlement_mode),
        toTitleCase(trace.payout_status),
      ]
        .filter((value) => value !== "-")
        .join(" • "),
      summary: `Settlement marketplace memakai mode ${toTitleCase(
        trace.settlement_mode,
      )} dengan payout ${toTitleCase(trace.payout_status)}.`,
      tone: toMaturityTone(trace.payout_status ?? trace.settlement_mode),
      reference: trace.payout_reference ?? trace.source_reference,
      followUpReference: trace.payout_reference,
    });
  }

  if (trace.financial_flow_type || trace.financial_event_key || trace.financial_reference) {
    components.push({
      key: "marketplace-financial-adjustment",
      label: "Refund / Return",
      statusLabel: [
        toTitleCase(trace.financial_flow_type),
        toTitleCase(trace.financial_decision_status),
        toTitleCase(trace.refund_status),
      ]
        .filter((value) => value !== "-")
        .join(" • "),
      summary: `Flow ${toTitleCase(
        trace.financial_flow_type,
      )} memakai consequence ${toTitleCase(
        trace.accounting_consequence_status,
      )} agar trace accounting tetap deterministik.`,
      tone: toMaturityTone(
        trace.accounting_consequence_status ??
          trace.refund_status ??
          trace.financial_decision_status,
      ),
      eventKey: trace.financial_event_key,
      reference: trace.financial_reference,
      followUpReference: trace.financial_follow_up_reference,
    });
  }

  return components;
}

function buildRentalMaturityComponents(
  trace: AccountingJournalSourceTraceResponse,
): FinancialMaturityComponent[] {
  const components: FinancialMaturityComponent[] = [];

  for (const item of trace.rental_payment_classifications ?? []) {
    components.push({
      key: `rental-classification-${item.classification_type}-${item.accounting_reference ?? item.amount}`,
      label: "Payment Classification",
      statusLabel: toTitleCase(item.classification_type),
      summary: `Bucket ${toTitleCase(item.classification_type)} sebesar Rp${Number(
        item.amount ?? 0,
      ).toLocaleString("id-ID")} disiapkan sebagai building block financial rental.`,
      tone: toMaturityTone(item.accounting_event_key ?? item.accounting_reference),
      eventKey: item.accounting_event_key,
      reference: item.accounting_reference,
      followUpReference: item.follow_up_reference,
      evidenceReference: item.evidence_reference,
    });
  }

  for (const item of trace.rental_financial_resolutions ?? []) {
    components.push({
      key: `rental-resolution-${item.outcome_type}-${item.accounting_reference ?? item.amount}`,
      label: "Financial Resolution",
      statusLabel: toTitleCase(item.outcome_type),
      summary: `Outcome ${toTitleCase(item.outcome_type)} sebesar Rp${Number(
        item.amount ?? 0,
      ).toLocaleString("id-ID")} dirangkum bersama trace follow-up rental.`,
      tone: toMaturityTone(item.accounting_event_key ?? item.accounting_reference),
      eventKey: item.accounting_event_key,
      reference: item.accounting_reference,
      followUpReference: item.follow_up_reference,
      evidenceReference: item.evidence_reference,
    });
  }

  return components;
}

export function buildFinancialMaturityWorkspace(params: {
  row: OperationalTraceRow;
  trace?: AccountingJournalSourceTraceResponse | null;
  exceptionContext?: SupportOperationalExceptionContext | null;
}): FinancialMaturityWorkspace {
  const trace = params.trace ?? null;
  const exceptionContext = params.exceptionContext ?? null;
  const components = trace
    ? trace.domain === "marketplace"
      ? buildMarketplaceMaturityComponents(trace)
      : buildRentalMaturityComponents(trace)
    : [];
  const references: FinancialMaturityReference[] = [];

  pushTraceReference(
    references,
    "Source Reference",
    trace?.source_reference ?? params.row.reference,
  );
  pushTraceReference(references, "Document Reference", trace?.source_document_reference);
  pushTraceReference(references, "Journal Reference", trace?.journal_reference ?? trace?.journal_number);
  pushTraceReference(references, "Payout Reference", trace?.payout_reference);
  pushTraceReference(
    references,
    "Financial Reference",
    trace?.financial_reference ?? trace?.financial_follow_up_reference,
  );

  for (const component of components) {
    pushTraceReference(references, `${component.label} Reference`, component.reference);
    pushTraceReference(
      references,
      `${component.label} Follow-up`,
      component.followUpReference,
    );
  }

  const hasBlockedTrace =
    trace?.governance_status === "blocked" ||
    trace?.trace_status === "blocked" ||
    trace?.readiness_status === "problematic";
  const hasOpenException =
    exceptionContext?.status === "active" || exceptionContext?.status === "escalated";
  const hasPendingComponent = components.some((component) => component.tone === "warning");
  const hasDangerComponent = components.some((component) => component.tone === "danger");

  let stageLabel = "Menunggu Trace";
  let stageTone: FinancialMaturityTone = "muted";

  if (hasBlockedTrace || hasDangerComponent) {
    stageLabel = "Tertahan";
    stageTone = "danger";
  } else if (
    hasOpenException ||
    params.row.reconciliationStatus === "Perlu Tindak Lanjut" ||
    hasPendingComponent ||
    trace?.readiness_status === "not_ready"
  ) {
    stageLabel = "Perlu Follow-up";
    stageTone = "warning";
  } else if (trace?.readiness_status === "ready") {
    stageLabel = "Matang";
    stageTone = "success";
  }

  const exceptionNote =
    exceptionContext?.last_message ??
    exceptionContext?.notes?.[0]?.message ??
    params.row.attentionSummary ??
    params.row.exceptionRecommendation ??
    "-";

  const domainSummary =
    params.row.domain === "marketplace"
      ? "Settlement, payout, dan refund/return marketplace ditinjau pada satu konteks maturity."
      : "Payment classification, deposit closure, dan resolution rental ditinjau pada satu konteks maturity.";
  const summary =
    components.length > 0
      ? `${domainSummary} ${components.length} komponen finansial utama sudah dirangkum bersama readiness dan trace reference.`
      : `${domainSummary} Belum ada komponen finansial eksplisit yang tercatat pada trace ini.`;
  const activeExceptionStatusLabel = exceptionContext?.status
    ? toTitleCase(exceptionContext.status)
    : "Belum Ada Catatan";

  return {
    domain: params.row.domain,
    stageLabel,
    stageTone,
    summary,
    governanceStatusLabel:
      trace?.governance_status === "blocked" ? "Blocked" : "Allowed",
    governanceCode: trace?.governance_code ?? "-",
    governanceReason:
      trace?.governance_reason ??
      trace?.blocker_reason ??
      "Tidak ada blocker governance aktif.",
    activeExceptionStatusLabel,
    activeExceptionCode:
      exceptionContext?.exception_code ?? params.row.exceptionCode ?? "-",
    activeExceptionSummary: exceptionNote,
    activeExceptionOwner: exceptionContext?.owner_label ?? params.row.queueOwnerLabel ?? "-",
    activeExceptionNextStep: exceptionContext?.next_step ?? "-",
    traceReferences: references,
    components,
  };
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
    const exceptionProfile = deriveExceptionProfile({
      attentionScope,
      paymentStatus,
      accountingStatus,
      accountingReason,
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
      exceptionCode: exceptionProfile.code,
      exceptionSeverity: exceptionProfile.severity,
      exceptionRecommendation: exceptionProfile.recommendation,
      queueOwnerLabel: exceptionProfile.ownerLabel,
      detailHref: `/bumdes/marketplace/order/${order.id}`,
    };
  });
}

export function buildRentalTraceRows(
  bookings: AssetRentalBooking[] | undefined,
): OperationalTraceRow[] {
  if (!bookings?.length) return [];

  return bookings.map((booking) => {
    const paymentStatus = toPaymentStatusLabel(
      booking.normalized_payment_status ||
        booking.latest_payment?.normalized_status ||
        booking.latest_payment?.status,
    );
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
    const exceptionProfile = deriveExceptionProfile({
      attentionScope,
      paymentStatus,
      accountingStatus,
      accountingReason,
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
      exceptionCode: exceptionProfile.code,
      exceptionSeverity: exceptionProfile.severity,
      exceptionRecommendation: exceptionProfile.recommendation,
      queueOwnerLabel: exceptionProfile.ownerLabel,
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
  filter: {
    scope: "all" | "operasional" | "pembayaran" | "accounting";
    domain?: "all" | "marketplace" | "rental";
    code?: string;
    owner?: string;
  },
) {
  const queueRows = rows.filter((row) => row.attentionScope !== null);
  return queueRows.filter((row) => {
    if (filter.scope !== "all" && row.attentionScope !== filter.scope) {
      return false;
    }
    if (filter.domain && filter.domain !== "all" && row.domain !== filter.domain) {
      return false;
    }
    if (
      filter.code &&
      !String(row.exceptionCode ?? "")
        .toLowerCase()
        .includes(filter.code.toLowerCase().trim())
    ) {
      return false;
    }
    if (
      filter.owner &&
      !String(row.queueOwnerLabel ?? "")
        .toLowerCase()
        .includes(filter.owner.toLowerCase().trim())
    ) {
      return false;
    }
    return true;
  });
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
