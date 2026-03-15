/** @format */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ListTodo, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useAccountingJournalPostingPolicies,
  useAccountingJournalSourceTrace,
} from "@/hooks/queries/accounting-journal";
import {
  useMarketplaceOrder,
  useMarketplaceOrders,
} from "@/hooks/queries/marketplace-orders";
import {
  useSupportOperationalExceptionActions,
  useSupportOperationalExceptionContext,
} from "@/hooks/queries/support-config";
import { getAssetRentalBookings } from "@/services/api/asset-rental";
import { getReservation } from "@/services/api/reservations";
import {
  buildFinancialMaturityWorkspace,
  buildOperationalTraceRows,
  filterFollowUpQueueRows,
  filterOperationalTraceRows,
  getTraceProofUrl,
  summarizeOperationalTrace,
} from "@/modules/accounting/utils/operational-subledger";

const ACCOUNTING_STATUS_BADGE: Record<string, string> = {
  "Siap Ditinjau": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Belum Siap": "bg-amber-50 text-amber-700 border border-amber-200",
  Bermasalah: "bg-red-50 text-red-700 border border-red-200",
  "Tidak Perlu Posting": "bg-slate-50 text-slate-700 border border-slate-200",
};

const RECONCILIATION_BADGE: Record<string, string> = {
  Sesuai: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Perlu Tindak Lanjut": "bg-amber-50 text-amber-700 border border-amber-200",
};

const REPORTING_BADGE: Record<string, string> = {
  "Siap Dilaporkan": "bg-sky-50 text-sky-700 border border-sky-200",
  "Tahan Pelaporan": "bg-rose-50 text-rose-700 border border-rose-200",
};

const READINESS_STATUS_BADGE: Record<string, string> = {
  ready: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  not_ready: "bg-amber-50 text-amber-700 border border-amber-200",
  problematic: "bg-rose-50 text-rose-700 border border-rose-200",
  not_applicable: "bg-slate-100 text-slate-700 border border-slate-200",
};

const TRACE_STATUS_BADGE: Record<string, string> = {
  posted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  ready: "bg-sky-50 text-sky-700 border border-sky-200",
  blocked: "bg-rose-50 text-rose-700 border border-rose-200",
};

const ATTENTION_SCOPE_BADGE: Record<string, string> = {
  operasional: "bg-slate-100 text-slate-700 border border-slate-200",
  pembayaran: "bg-amber-50 text-amber-700 border border-amber-200",
  accounting: "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

const EXCEPTION_SEVERITY_BADGE: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  high: "bg-rose-50 text-rose-700 border border-rose-200",
};

const EXCEPTION_STATUS_BADGE: Record<string, string> = {
  none: "bg-slate-100 text-slate-700 border border-slate-200",
  active: "bg-amber-50 text-amber-700 border border-amber-200",
  approved: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  rejected: "bg-slate-100 text-slate-700 border border-slate-200",
  closed: "bg-slate-100 text-slate-700 border border-slate-200",
  resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  escalated: "bg-rose-50 text-rose-700 border border-rose-200",
};

const EXCEPTION_STATUS_LABEL: Record<string, string> = {
  none: "Belum Ada Catatan",
  active: "Aktif",
  approved: "Disetujui",
  rejected: "Ditolak",
  closed: "Ditutup",
  resolved: "Terselesaikan",
  escalated: "Tereskalasi",
};

const MATURITY_TONE_BADGE: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-rose-50 text-rose-700 border border-rose-200",
  muted: "bg-slate-100 text-slate-700 border border-slate-200",
};

function toSentenceCase(value?: string | null) {
  const normalized = String(value ?? "")
    .trim()
    .replaceAll("_", " ");
  if (!normalized) return "-";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function DetailField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}

function WorkspaceSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </p>
        {description ? (
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function FeatureOperationalTraceWorkbench() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "attention" | "matched">("all");
  const [isTraceDialogOpen, setIsTraceDialogOpen] = useState(false);
  const [isQueueDialogOpen, setIsQueueDialogOpen] = useState(false);
  const [queueScope, setQueueScope] = useState<
    "all" | "operasional" | "pembayaran" | "accounting"
  >("all");
  const [queueDomain, setQueueDomain] = useState<
    "all" | "marketplace" | "rental"
  >("all");
  const [queueCode, setQueueCode] = useState("");
  const [queueOwnerFilter, setQueueOwnerFilter] = useState("");
  const [exceptionOwner, setExceptionOwner] = useState("");
  const [exceptionNextStep, setExceptionNextStep] = useState("");
  const [exceptionMessage, setExceptionMessage] = useState("");

  const marketplaceOrdersQuery = useMarketplaceOrders({
    limit: 8,
    offset: 0,
  });

  const rentalBookingsQuery = useQuery({
    queryKey: ["asset-rental", "bookings", "accounting-trace"],
    queryFn: async () => {
      const response = await getAssetRentalBookings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat booking rental");
      }
      return response.data;
    },
  });

  const rows = useMemo(
    () =>
      buildOperationalTraceRows({
        marketplaceOrders: marketplaceOrdersQuery.data?.items,
        rentalBookings: rentalBookingsQuery.data,
      }),
    [marketplaceOrdersQuery.data?.items, rentalBookingsQuery.data],
  );
  const summary = useMemo(() => summarizeOperationalTrace(rows), [rows]);
  const visibleRows = useMemo(
    () => filterOperationalTraceRows(rows, filter),
    [filter, rows],
  );
  const queueRows = useMemo(
    () =>
      filterFollowUpQueueRows(rows, {
        scope: queueScope,
        domain: queueDomain,
        code: queueCode,
        owner: queueOwnerFilter,
      }),
    [queueCode, queueDomain, queueOwnerFilter, queueScope, rows],
  );
  const queueCounts = useMemo(
    () => ({
      all: filterFollowUpQueueRows(rows, { scope: "all" }).length,
      pembayaran: filterFollowUpQueueRows(rows, { scope: "pembayaran" }).length,
      accounting: filterFollowUpQueueRows(rows, { scope: "accounting" }).length,
      operasional: filterFollowUpQueueRows(rows, { scope: "operasional" })
        .length,
    }),
    [rows],
  );

  useEffect(() => {
    if (!rows.length) {
      setSelectedKey(null);
      return;
    }
    setSelectedKey((current) =>
      current && rows.some((row) => row.key === current)
        ? current
        : rows[0].key,
    );
  }, [rows]);

  useEffect(() => {
    if (!visibleRows.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !visibleRows.some((row) => row.key === selectedKey)) {
      setSelectedKey(visibleRows[0].key);
    }
  }, [selectedKey, visibleRows]);

  const selectedRow =
    visibleRows.find((row) => row.key === selectedKey) ??
    visibleRows[0] ??
    null;
  const sourceTraceQuery = useAccountingJournalSourceTrace(
    selectedRow?.domain,
    selectedRow?.sourceId,
    { enabled: Boolean(selectedRow) },
  );
  const postingPoliciesQuery = useAccountingJournalPostingPolicies(
    selectedRow?.domain
      ? {
          domain: selectedRow.domain,
          status: "active",
        }
      : undefined,
    { enabled: Boolean(selectedRow?.domain) },
  );

  const marketplaceDetailQuery = useMarketplaceOrder(
    selectedRow?.domain === "marketplace" ? selectedRow.sourceId : undefined,
    {
      enabled: selectedRow?.domain === "marketplace",
    },
  );

  const rentalDetailQuery = useQuery({
    queryKey: [
      "reservation-detail",
      "accounting-trace",
      selectedRow?.sourceId ?? "",
    ],
    enabled: selectedRow?.domain === "rental",
    queryFn: async () => {
      const response = await getReservation(selectedRow?.sourceId ?? "");
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail reservasi");
      }
      return response.data;
    },
  });
  const proofUrl = getTraceProofUrl({
    domain: selectedRow?.domain ?? "marketplace",
    marketplaceDetail: marketplaceDetailQuery.data,
    rentalDetail: rentalDetailQuery.data,
  });
  const historyItems = useMemo(() => {
    if (!selectedRow) {
      return [];
    }
    if (selectedRow.domain === "marketplace") {
      return (marketplaceDetailQuery.data?.status_history ?? []).map(
        (entry, index) => ({
          id: `marketplace-history-${index}-${entry.status}`,
          title: entry.status.replaceAll("_", " "),
          description: entry.reason || "Tidak ada catatan tambahan.",
          time: new Date(entry.timestamp * 1000).toLocaleString("id-ID"),
        }),
      );
    }
    return (rentalDetailQuery.data?.timeline ?? []).map((entry, index) => ({
      id: `rental-history-${index}-${entry.event}`,
      title: entry.event.replaceAll("_", " "),
      description:
        entry.meta && Object.keys(entry.meta).length > 0
          ? Object.entries(entry.meta)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" • ")
          : "Tidak ada catatan tambahan.",
      time: new Date(entry.at).toLocaleString("id-ID"),
    }));
  }, [
    marketplaceDetailQuery.data?.status_history,
    rentalDetailQuery.data?.timeline,
    selectedRow,
  ]);
  const exceptionContextQuery = useSupportOperationalExceptionContext(
    selectedRow
      ? {
          domain: selectedRow.domain,
          source_id: selectedRow.sourceId,
          reference: selectedRow.reference,
          attention_scope: selectedRow.attentionScope ?? undefined,
          summary: selectedRow.attentionSummary ?? undefined,
        }
      : undefined,
  );
  const exceptionActions = useSupportOperationalExceptionActions(
    selectedRow?.domain,
    selectedRow?.sourceId,
  );
  const selectedRowKey = selectedRow?.key ?? null;

  useEffect(() => {
    if (!selectedRowKey) {
      setExceptionOwner("");
      setExceptionNextStep("");
      setExceptionMessage("");
      return;
    }
    setExceptionOwner(exceptionContextQuery.data?.owner_label ?? "");
    setExceptionNextStep(exceptionContextQuery.data?.next_step ?? "");
    setExceptionMessage("");
  }, [
    selectedRowKey,
    exceptionContextQuery.data?.owner_label,
    exceptionContextQuery.data?.next_step,
  ]);

  const exceptionStatus = exceptionContextQuery.data?.status ?? "none";
  const resolutionExceptionCode =
    exceptionContextQuery.data?.exception_code ??
    selectedRow?.exceptionCode ??
    "-";
  const resolutionSeverity =
    exceptionContextQuery.data?.severity ??
    selectedRow?.exceptionSeverity ??
    "-";
  const resolutionRecommendation =
    exceptionContextQuery.data?.recommended_action ??
    selectedRow?.exceptionRecommendation ??
    selectedRow?.attentionSummary ??
    "-";
  const appliedPolicy =
    postingPoliciesQuery.data?.items.find(
      (item) => item.event_key === sourceTraceQuery.data?.event_key,
    ) ??
    postingPoliciesQuery.data?.items[0] ??
    null;
  const governanceStatus =
    sourceTraceQuery.data?.governance_status ?? "allowed";
  const governanceCode = sourceTraceQuery.data?.governance_code ?? "-";
  const governanceReason =
    sourceTraceQuery.data?.governance_reason ??
    sourceTraceQuery.data?.blocker_reason ??
    "Tidak ada blocker governance aktif.";
  const maturityWorkspace = useMemo(
    () =>
      selectedRow
        ? buildFinancialMaturityWorkspace({
            row: selectedRow,
            trace: sourceTraceQuery.data,
            exceptionContext: exceptionContextQuery.data,
          })
        : null,
    [exceptionContextQuery.data, selectedRow, sourceTraceQuery.data],
  );

  const openTraceDialog = (
    rowKey?: string | null,
    nextFilter?: "all" | "attention" | "matched",
  ) => {
    if (rowKey) {
      setSelectedKey(rowKey);
    }
    if (nextFilter) {
      setFilter(nextFilter);
    }
    setIsTraceDialogOpen(true);
  };

  return (
    <div className="space-y-6" data-testid="accounting-trace-workbench-root">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                Operational Subledger Trace
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Satu konteks kerja untuk menelusuri transaksi sumber,
                pembayaran, dan readiness accounting.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Total {summary.total}</span>
                <span>Siap {summary.ready}</span>
                <span>Perlu tindak lanjut {summary.needsAttention}</span>
                <span>Sesuai {summary.matched}</span>
                <span>Layak lapor {summary.reportingReady}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openTraceDialog(selectedRow?.key)}
                  disabled={!selectedRow}
                  data-testid="accounting-trace-open-detail-button"
                >
                  <Workflow className="h-4 w-4" />
                  Trace Detail
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsQueueDialogOpen(true)}
                  data-testid="accounting-trace-open-queue-button"
                >
                  <ListTodo className="h-4 w-4" />
                  Follow-up Queue ({queueCounts.all})
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              data-testid="accounting-trace-filter-all-button"
            >
              Semua
            </Button>
            <Button
              variant={filter === "attention" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("attention")}
              data-testid="accounting-trace-filter-attention-button"
            >
              Perlu Rekonsiliasi
            </Button>
            <Button
              variant={filter === "matched" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("matched")}
              data-testid="accounting-trace-filter-matched-button"
            >
              Sinkron
            </Button>
          </div>
        </CardHeader>
        <TableShell
          className="mx-6"
          columns={[
            {
              id: "domain",
              header: <>Domain</>,
              cell: ({ row }) =>
                row.original.domain === "marketplace"
                  ? "Marketplace"
                  : "Rental",
            },
            {
              id: "reference",
              header: <>Referensi</>,
              meta: {
                cellClassName: "font-medium",
              },
            },
            {
              id: "operationalStatus",
              header: <>Status Operasional</>,
            },
            {
              id: "paymentStatus",
              header: <>Status Pembayaran</>,
            },
            {
              id: "accountingStatus",
              header: <>Status Accounting</>,
              cell: ({ row }) => (
                <div className="flex flex-col gap-2">
                  <Badge
                    className={
                      ACCOUNTING_STATUS_BADGE[row.original.accountingStatus] ||
                      ACCOUNTING_STATUS_BADGE["Belum Siap"]
                    }
                  >
                    {row.original.accountingStatus}
                  </Badge>
                  <Badge
                    className={
                      RECONCILIATION_BADGE[row.original.reconciliationStatus]
                    }
                  >
                    {row.original.reconciliationStatus}
                  </Badge>
                  <Badge
                    className={REPORTING_BADGE[row.original.reportingStatus]}
                  >
                    {row.original.reportingStatus}
                  </Badge>
                </div>
              ),
            },
            {
              id: "actions",
              header: <>Aksi</>,
              cell: ({ row }) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openTraceDialog(row.original.key)}
                  data-testid={`accounting-trace-open-detail-button-${row.original.key}`}
                >
                  Lihat Trace
                </Button>
              ),
              meta: {
                headerClassName: "text-right",
                cellClassName: "text-right",
              },
            },
          ]}
          data={visibleRows}
          getRowId={(row) => row.key}
          rowProps={(row) => ({
            "data-testid": `accounting-trace-row-${row.key}`,
          })}
          emptyState="Belum ada transaksi operasional yang dapat ditelusuri."
          rowClassName={(row) =>
            row.key === selectedRow?.key ? "bg-muted/40" : undefined
          }
        />
      </Card>

      <Card className="border-slate-200 py-0 shadow-sm dark:border-slate-800">
        <CardHeader className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">Workspace Tools</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Trace Detail dan Follow-up Queue sekarang dibuka lewat dialog
              scrollable agar area kerja utama tetap ringkas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openTraceDialog(selectedRow?.key)}
              disabled={!selectedRow}
              data-testid="accounting-trace-open-detail-button-secondary"
            >
              <Workflow className="h-4 w-4" />
              Buka Trace Detail
            </Button>
            <Button
              size="sm"
              onClick={() => setIsQueueDialogOpen(true)}
              data-testid="accounting-trace-open-queue-button-secondary"
            >
              <ListTodo className="h-4 w-4" />
              Buka Follow-up Queue
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 px-6 pb-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Trace terpilih
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
              {selectedRow?.reference ?? "Belum ada transaksi dipilih"}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {selectedRow?.title ??
                "Pilih salah satu transaksi pada tabel untuk membuka trace detail."}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/70 dark:bg-amber-950/40">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Perlu tindak lanjut
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-900 dark:text-amber-100">
              {queueCounts.all}
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
              Queue aktif bisa dibuka kapan saja tanpa menggeser layout halaman.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/40">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Reporting ready
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
              {summary.reportingReady}
            </p>
            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
              Basis laporan yang sinkron tetap bisa dipantau dari panel utama.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Reporting Basis Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Siap Dilaporkan
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">
              {summary.reportingReady}
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Transaksi dengan referensi deterministik dan linkage
              operasional-keuangan yang sinkron.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Tahan Pelaporan
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-900">
              {summary.reportingBlocked}
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Transaksi yang masih perlu rekonsiliasi atau memiliki handoff
              accounting yang belum stabil.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-700">
              Prinsip Basis Laporan
            </p>
            <p className="mt-2 text-sm text-slate-800">
              Finance hanya boleh menganggap row siap sebagai basis laporan saat
              referensi transaksi tetap, status pembayaran sinkron, dan
              readiness accounting tidak bermasalah.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isTraceDialogOpen} onOpenChange={setIsTraceDialogOpen}>
        <DialogContent
          className="max-h-[92vh] overflow-hidden border-slate-200 bg-slate-50 p-0 shadow-2xl sm:max-w-5xl dark:border-slate-800 dark:bg-slate-950"
          data-testid="accounting-trace-detail-dialog"
        >
          <div className="flex max-h-[92vh] flex-col">
            <DialogHeader className="border-b border-slate-200 bg-white px-6 py-5 text-left dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  {selectedRow ? (
                    <div className="flex flex-wrap gap-2">
                      <Badge className="border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {selectedRow.domain === "marketplace"
                          ? "Marketplace"
                          : "Rental"}
                      </Badge>
                      <Badge
                        className={
                          ACCOUNTING_STATUS_BADGE[
                            selectedRow.accountingStatus
                          ] || ACCOUNTING_STATUS_BADGE["Belum Siap"]
                        }
                      >
                        {selectedRow.accountingStatus}
                      </Badge>
                      <Badge
                        className={
                          RECONCILIATION_BADGE[selectedRow.reconciliationStatus]
                        }
                      >
                        {selectedRow.reconciliationStatus}
                      </Badge>
                    </div>
                  ) : null}
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                      Trace Detail
                    </DialogTitle>
                    <DialogDescription className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Hubungan operasional, pembayaran, policy accounting, dan
                      exception workspace.
                    </DialogDescription>
                  </div>
                </div>
                {selectedRow ? (
                  <div className="flex flex-wrap gap-2">
                    {proofUrl ? (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="accounting-trace-detail-open-source-link"
                        >
                          Bukti Pembayaran
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    <Button asChild size="sm">
                      <Link
                        href={selectedRow.detailHref}
                        data-testid="accounting-trace-detail-open-transaction-link"
                      >
                        Detail Transaksi
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </DialogHeader>

            {!selectedRow ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">
                Pilih transaksi dari tabel trace untuk membuka detail.
              </div>
            ) : (
              <div className="overflow-y-auto px-6 py-6">
                <div className="space-y-5">
                  <WorkspaceSection
                    title="Ringkasan transaksi"
                    description="Informasi utama yang biasanya dicari pertama kali saat menelusuri mismatch."
                  >
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Transaksi
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                          {selectedRow.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {selectedRow.reference}
                        </p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          <DetailField
                            label="Status operasional"
                            value={selectedRow.operationalStatus}
                          />
                          <DetailField
                            label="Status pembayaran"
                            value={selectedRow.paymentStatus}
                          />
                          <DetailField
                            label="Status accounting"
                            value={selectedRow.accountingStatus}
                          />
                          <DetailField
                            label="Status rekonsiliasi"
                            value={selectedRow.reconciliationStatus}
                          />
                          <DetailField
                            label="Kelayakan pelaporan"
                            value={selectedRow.reportingStatus}
                          />
                          <DetailField
                            label="Alasan utama"
                            value={selectedRow.accountingReason}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/40">
                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                          Catatan pelaporan
                        </p>
                        <p className="mt-2 text-sm leading-6 text-indigo-900 dark:text-indigo-100">
                          {selectedRow.reportingReason}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge
                            className={
                              READINESS_STATUS_BADGE[
                                sourceTraceQuery.data?.readiness_status ||
                                  "not_ready"
                              ] || READINESS_STATUS_BADGE.not_ready
                            }
                          >
                            Readiness{" "}
                            {toSentenceCase(
                              sourceTraceQuery.data?.readiness_status,
                            )}
                          </Badge>
                          <Badge
                            className={
                              TRACE_STATUS_BADGE[
                                sourceTraceQuery.data?.trace_status || "blocked"
                              ] || TRACE_STATUS_BADGE.blocked
                            }
                          >
                            Trace{" "}
                            {toSentenceCase(
                              sourceTraceQuery.data?.trace_status,
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </WorkspaceSection>

                  <WorkspaceSection
                    title="Jejak status"
                    description="Riwayat event yang membantu membaca urutan perubahan status."
                  >
                    <div className="space-y-3">
                      {historyItems.length > 0 ? (
                        historyItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.time}
                              </p>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Belum ada riwayat status untuk transaksi yang dipilih.
                        </p>
                      )}
                    </div>
                  </WorkspaceSection>

                  <WorkspaceSection
                    title="Financial maturity workspace"
                    description="Settlement, resolution, policy, blocker, dan referensi trace dirangkum pada konteks yang sama."
                  >
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={
                          MATURITY_TONE_BADGE[
                            maturityWorkspace?.stageTone ?? "muted"
                          ] || MATURITY_TONE_BADGE.muted
                        }
                      >
                        Maturity:{" "}
                        {maturityWorkspace?.stageLabel ?? "Menunggu Trace"}
                      </Badge>
                      <Badge
                        className={
                          READINESS_STATUS_BADGE[
                            sourceTraceQuery.data?.readiness_status ||
                              "not_ready"
                          ] || READINESS_STATUS_BADGE.not_ready
                        }
                      >
                        Readiness:{" "}
                        {toSentenceCase(
                          sourceTraceQuery.data?.readiness_status,
                        )}
                      </Badge>
                      <Badge
                        className={
                          TRACE_STATUS_BADGE[
                            sourceTraceQuery.data?.trace_status || "blocked"
                          ] || TRACE_STATUS_BADGE.blocked
                        }
                      >
                        Trace:{" "}
                        {toSentenceCase(sourceTraceQuery.data?.trace_status)}
                      </Badge>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {maturityWorkspace?.summary ??
                        "Workspace maturity akan terisi saat trace transaksi tersedia."}
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <DetailField
                        label="Policy Code"
                        value={
                          appliedPolicy?.policy_code ??
                          sourceTraceQuery.data?.policy_code ??
                          "-"
                        }
                      />
                      <DetailField
                        label="Policy Name"
                        value={appliedPolicy?.policy_name ?? "-"}
                      />
                      <DetailField
                        label="Source Reference"
                        value={
                          sourceTraceQuery.data?.source_reference ??
                          selectedRow.reference
                        }
                      />
                      <DetailField
                        label="Document Reference"
                        value={
                          sourceTraceQuery.data?.source_document_reference ??
                          "-"
                        }
                      />
                      <DetailField
                        label="Journal Reference"
                        value={
                          sourceTraceQuery.data?.journal_reference ??
                          sourceTraceQuery.data?.journal_number ??
                          "-"
                        }
                        className="md:col-span-2 xl:col-span-2"
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Policy result
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {appliedPolicy?.treatment_summary ??
                            sourceTraceQuery.data?.readiness_reason ??
                            selectedRow.accountingReason}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(appliedPolicy?.prerequisite_codes ?? []).map(
                            (code) => (
                              <Badge
                                key={code}
                                className="border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {code}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Governance blocker
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge
                            className={
                              governanceStatus === "blocked"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }
                          >
                            {governanceStatus === "blocked"
                              ? "Blocked"
                              : "Allowed"}
                          </Badge>
                          <Badge
                            className={
                              governanceStatus === "blocked"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }
                          >
                            {governanceCode}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {governanceReason}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Exception context
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge
                            className={
                              EXCEPTION_STATUS_BADGE[exceptionStatus] ||
                              EXCEPTION_STATUS_BADGE.none
                            }
                          >
                            {EXCEPTION_STATUS_LABEL[exceptionStatus] ||
                              "Belum Ada Catatan"}
                          </Badge>
                          <Badge
                            className={
                              EXCEPTION_SEVERITY_BADGE[
                                String(resolutionSeverity)
                              ] ||
                              "bg-slate-100 text-slate-700 border border-slate-200"
                            }
                          >
                            {maturityWorkspace?.activeExceptionCode ??
                              resolutionExceptionCode}
                          </Badge>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <DetailField
                            label="Owner"
                            value={
                              maturityWorkspace?.activeExceptionOwner ?? "-"
                            }
                          />
                          <DetailField
                            label="Next Step"
                            value={
                              maturityWorkspace?.activeExceptionNextStep ?? "-"
                            }
                          />
                          <DetailField
                            label="Summary"
                            value={
                              maturityWorkspace?.activeExceptionSummary ??
                              resolutionRecommendation
                            }
                            className="md:col-span-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Trace references
                        </p>
                        <div className="mt-3 space-y-3">
                          {maturityWorkspace?.traceReferences.length ? (
                            maturityWorkspace.traceReferences.map(
                              (reference) => (
                                <div
                                  key={`${reference.label}-${reference.value}`}
                                  className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
                                >
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {reference.label}
                                  </p>
                                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {reference.value}
                                  </p>
                                </div>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Referensi trace akan muncul setelah
                              source-to-journal trace tersedia.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Komponen finansial utama
                        </p>
                        <div className="mt-3 space-y-3">
                          {maturityWorkspace?.components.length ? (
                            maturityWorkspace.components.map((component) => (
                              <div
                                key={component.key}
                                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {component.label}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                      {component.statusLabel}
                                    </p>
                                  </div>
                                  <Badge
                                    className={
                                      MATURITY_TONE_BADGE[component.tone] ||
                                      MATURITY_TONE_BADGE.muted
                                    }
                                  >
                                    {component.label}
                                  </Badge>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                  {component.summary}
                                </p>
                                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                  <DetailField
                                    label="Event"
                                    value={component.eventKey ?? "-"}
                                  />
                                  <DetailField
                                    label="Reference"
                                    value={component.reference ?? "-"}
                                  />
                                  <DetailField
                                    label="Follow-up"
                                    value={component.followUpReference ?? "-"}
                                  />
                                  <DetailField
                                    label="Evidence"
                                    value={component.evidenceReference ?? "-"}
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Belum ada komponen finansial maturity yang dapat
                              diringkas untuk transaksi ini.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </WorkspaceSection>

                  <WorkspaceSection
                    title="Exception workspace"
                    description="Simpan owner, next step, dan keputusan penanganan tanpa keluar dari konteks trace."
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <Badge
                        className={
                          EXCEPTION_STATUS_BADGE[exceptionStatus] ||
                          EXCEPTION_STATUS_BADGE.none
                        }
                      >
                        {EXCEPTION_STATUS_LABEL[exceptionStatus] ||
                          "Belum Ada Catatan"}
                      </Badge>
                      {exceptionContextQuery.data?.summary ? (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Konteks saat ini: {exceptionContextQuery.data.summary}
                        </p>
                      ) : selectedRow.attentionSummary ? (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Konteks saat ini: {selectedRow.attentionSummary}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Basis resolusi
                        </p>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <DetailField
                            label="Transaksi"
                            value={selectedRow.reference}
                          />
                          <DetailField
                            label="Pembayaran"
                            value={selectedRow.paymentStatus}
                          />
                          <DetailField
                            label="Accounting"
                            value={selectedRow.accountingStatus}
                          />
                          <DetailField
                            label="Bukti Pembayaran"
                            value={proofUrl ? "Tersedia" : "Belum Tersedia"}
                          />
                          <DetailField
                            label="Exception Code"
                            value={
                              <Badge
                                className={
                                  EXCEPTION_SEVERITY_BADGE[
                                    String(resolutionSeverity)
                                  ] ||
                                  "bg-slate-100 text-slate-700 border border-slate-200"
                                }
                              >
                                {resolutionExceptionCode}
                              </Badge>
                            }
                          />
                          <DetailField
                            label="Severity"
                            value={
                              <Badge
                                className={
                                  EXCEPTION_SEVERITY_BADGE[
                                    String(resolutionSeverity)
                                  ] ||
                                  "bg-slate-100 text-slate-700 border border-slate-200"
                                }
                              >
                                {String(resolutionSeverity).replace(
                                  /\b\w/g,
                                  (char) => char.toUpperCase(),
                                )}
                              </Badge>
                            }
                          />
                          <DetailField
                            label="Recommended Action"
                            value={resolutionRecommendation}
                            className="md:col-span-2"
                          />
                          <DetailField
                            label="Governance Source"
                            value={
                              exceptionContextQuery.data?.governance_source ??
                              "standard_inheritance"
                            }
                          />
                          <DetailField
                            label="Reviewer"
                            value={
                              exceptionContextQuery.data?.reviewer_label ?? "-"
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Owner Penanganan
                        </label>
                        <Input
                          value={exceptionOwner}
                          onChange={(event) =>
                            setExceptionOwner(event.target.value)
                          }
                          placeholder="Contoh: Finance, Admin Operasional"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Next Step
                        </label>
                        <Input
                          value={exceptionNextStep}
                          onChange={(event) =>
                            setExceptionNextStep(event.target.value)
                          }
                          placeholder="Contoh: Konfirmasi bukti transfer"
                        />
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Governance roles
                        </p>
                        <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                          <p>
                            Owner:{" "}
                            {(
                              exceptionContextQuery.data?.owner_roles ?? []
                            ).join(", ") || "-"}
                          </p>
                          <p>
                            Reviewer:{" "}
                            {(
                              exceptionContextQuery.data?.reviewer_roles ?? []
                            ).join(", ") || "-"}
                          </p>
                          <p>
                            Support:{" "}
                            {(
                              exceptionContextQuery.data?.support_roles ?? []
                            ).join(", ") || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Catatan Exception
                      </label>
                      <Textarea
                        value={exceptionMessage}
                        onChange={(event) =>
                          setExceptionMessage(event.target.value)
                        }
                        placeholder="Tuliskan konteks masalah, alasan follow-up, atau keputusan sementara."
                        rows={4}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!selectedRow) {
                            return;
                          }
                          exceptionActions.saveNote.mutate({
                            domain: selectedRow.domain,
                            source_id: Number(selectedRow.sourceId),
                            reference: selectedRow.reference,
                            attention_scope:
                              selectedRow.attentionScope ?? undefined,
                            summary: selectedRow.attentionSummary ?? undefined,
                            owner_label: exceptionOwner,
                            next_step: exceptionNextStep,
                            message: exceptionMessage,
                          });
                        }}
                        disabled={
                          !selectedRow || exceptionActions.saveNote.isPending
                        }
                      >
                        {exceptionActions.saveNote.isPending
                          ? "Menyimpan..."
                          : "Simpan Catatan Exception"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!selectedRow) {
                            return;
                          }
                          exceptionActions.applyDecision.mutate({
                            domain: selectedRow.domain,
                            source_id: Number(selectedRow.sourceId),
                            reference: selectedRow.reference,
                            attention_scope:
                              selectedRow.attentionScope ?? undefined,
                            summary: selectedRow.attentionSummary ?? undefined,
                            owner_label: exceptionOwner || undefined,
                            next_step: exceptionNextStep || undefined,
                            message: exceptionMessage,
                            status: "approved",
                          });
                        }}
                        disabled={
                          !selectedRow ||
                          exceptionActions.applyDecision.isPending
                        }
                      >
                        {exceptionActions.applyDecision.isPending
                          ? "Memproses..."
                          : "Setujui"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (!selectedRow) {
                            return;
                          }
                          exceptionActions.applyDecision.mutate({
                            domain: selectedRow.domain,
                            source_id: Number(selectedRow.sourceId),
                            reference: selectedRow.reference,
                            attention_scope:
                              selectedRow.attentionScope ?? undefined,
                            summary: selectedRow.attentionSummary ?? undefined,
                            owner_label: exceptionOwner || undefined,
                            next_step: exceptionNextStep || undefined,
                            message: exceptionMessage,
                            status: "escalated",
                          });
                        }}
                        disabled={
                          !selectedRow ||
                          exceptionActions.applyDecision.isPending
                        }
                      >
                        {exceptionActions.applyDecision.isPending
                          ? "Memproses..."
                          : "Eskalasi"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!selectedRow) {
                            return;
                          }
                          exceptionActions.applyDecision.mutate({
                            domain: selectedRow.domain,
                            source_id: Number(selectedRow.sourceId),
                            reference: selectedRow.reference,
                            attention_scope:
                              selectedRow.attentionScope ?? undefined,
                            summary: selectedRow.attentionSummary ?? undefined,
                            owner_label: exceptionOwner || undefined,
                            next_step: exceptionNextStep || undefined,
                            message: exceptionMessage,
                            status: "rejected",
                          });
                        }}
                        disabled={
                          !selectedRow ||
                          exceptionActions.applyDecision.isPending
                        }
                      >
                        {exceptionActions.applyDecision.isPending
                          ? "Memproses..."
                          : "Tolak"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!selectedRow) {
                            return;
                          }
                          exceptionActions.applyDecision.mutate({
                            domain: selectedRow.domain,
                            source_id: Number(selectedRow.sourceId),
                            reference: selectedRow.reference,
                            attention_scope:
                              selectedRow.attentionScope ?? undefined,
                            summary: selectedRow.attentionSummary ?? undefined,
                            owner_label: exceptionOwner || undefined,
                            next_step: exceptionNextStep || undefined,
                            message: exceptionMessage,
                            status: "closed",
                          });
                        }}
                        disabled={
                          !selectedRow ||
                          exceptionActions.applyDecision.isPending
                        }
                      >
                        {exceptionActions.applyDecision.isPending
                          ? "Memproses..."
                          : "Tutup"}
                      </Button>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                          Catatan exception
                        </p>
                        <div className="mt-3 space-y-3">
                          {exceptionContextQuery.isLoading ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Memuat catatan exception...
                            </p>
                          ) : exceptionContextQuery.data?.notes?.length ? (
                            exceptionContextQuery.data.notes.map((note) => (
                              <div
                                key={`exception-note-${note.id}`}
                                className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                    {note.action.replaceAll("_", " ")}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(note.timestamp).toLocaleString(
                                      "id-ID",
                                    )}
                                  </p>
                                </div>
                                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                                  {note.message}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                                  <span>Actor: {note.actor_label}</span>
                                  {note.owner_label ? (
                                    <span>Owner: {note.owner_label}</span>
                                  ) : null}
                                  {note.next_step ? (
                                    <span>Next step: {note.next_step}</span>
                                  ) : null}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Belum ada catatan exception untuk transaksi yang
                              dipilih.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                          Audit trail exception
                        </p>
                        <div className="mt-3 space-y-3">
                          {exceptionContextQuery.data?.audit_entries?.length ? (
                            exceptionContextQuery.data.audit_entries.map(
                              (entry) => (
                                <div
                                  key={`exception-audit-${entry.id}`}
                                  className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                      {entry.action.replaceAll("_", " ")}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {new Date(entry.timestamp).toLocaleString(
                                        "id-ID",
                                      )}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span>Actor: {entry.actor_label}</span>
                                    {entry.old_status || entry.new_status ? (
                                      <span>
                                        Status: {entry.old_status || "none"}{" "}
                                        -&gt; {entry.new_status || "none"}
                                      </span>
                                    ) : null}
                                    {entry.request_id ? (
                                      <span>Request: {entry.request_id}</span>
                                    ) : null}
                                  </div>
                                  {entry.reason ? (
                                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                                      {entry.reason}
                                    </p>
                                  ) : null}
                                </div>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Belum ada audit trail exception untuk transaksi
                              yang dipilih.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </WorkspaceSection>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isQueueDialogOpen} onOpenChange={setIsQueueDialogOpen}>
        <DialogContent
          className="max-h-[92vh] overflow-hidden border-slate-200 bg-slate-50 p-0 shadow-2xl sm:max-w-4xl dark:border-slate-800 dark:bg-slate-950"
          data-testid="accounting-trace-queue-dialog"
        >
          <div className="flex max-h-[92vh] flex-col">
            <DialogHeader className="border-b border-slate-200 bg-white px-6 py-5 text-left dark:border-slate-800 dark:bg-slate-950">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Aktif {queueCounts.all}
                  </Badge>
                  <Badge className="border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300">
                    Pembayaran {queueCounts.pembayaran}
                  </Badge>
                  <Badge className="border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-300">
                    Accounting {queueCounts.accounting}
                  </Badge>
                  <Badge className="border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Operasional {queueCounts.operasional}
                  </Badge>
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Follow-up Queue
                  </DialogTitle>
                  <DialogDescription className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Daftar tindak lanjut dibuka di dialog scrollable supaya
                    penyaringan dan fokus ke trace tetap cepat saat queue
                    panjang.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="overflow-y-auto px-6 py-6">
              <div className="space-y-5">
                <WorkspaceSection
                  title="Filter queue"
                  description="Atur scope, domain, dan kata kunci agar daftar tindak lanjut lebih mudah dipilah."
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={queueScope === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQueueScope("all")}
                        data-testid="accounting-trace-queue-scope-all-button"
                      >
                        Semua
                      </Button>
                      <Button
                        variant={
                          queueScope === "operasional" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setQueueScope("operasional")}
                        data-testid="accounting-trace-queue-scope-operasional-button"
                      >
                        Operasional
                      </Button>
                      <Button
                        variant={
                          queueScope === "pembayaran" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setQueueScope("pembayaran")}
                        data-testid="accounting-trace-queue-scope-pembayaran-button"
                      >
                        Pembayaran
                      </Button>
                      <Button
                        variant={
                          queueScope === "accounting" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setQueueScope("accounting")}
                        data-testid="accounting-trace-queue-scope-accounting-button"
                      >
                        Accounting
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={queueDomain === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQueueDomain("all")}
                        data-testid="accounting-trace-queue-domain-all-button"
                      >
                        Semua Domain
                      </Button>
                      <Button
                        variant={
                          queueDomain === "marketplace" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setQueueDomain("marketplace")}
                        data-testid="accounting-trace-queue-domain-marketplace-button"
                      >
                        Marketplace
                      </Button>
                      <Button
                        variant={
                          queueDomain === "rental" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setQueueDomain("rental")}
                        data-testid="accounting-trace-queue-domain-rental-button"
                      >
                        Rental
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={queueCode}
                        onChange={(event) => setQueueCode(event.target.value)}
                        placeholder="Filter code exception, contoh ACC-PAYMENT"
                        data-testid="accounting-trace-queue-code-input"
                      />
                      <Input
                        value={queueOwnerFilter}
                        onChange={(event) =>
                          setQueueOwnerFilter(event.target.value)
                        }
                        placeholder="Filter owner, contoh Finance"
                        data-testid="accounting-trace-queue-owner-input"
                      />
                    </div>
                  </div>
                </WorkspaceSection>

                <WorkspaceSection
                  title="Daftar tindak lanjut"
                  description="Gunakan tombol fokus untuk langsung membuka trace detail transaksi terkait."
                >
                  {!queueRows.length ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tidak ada transaksi aktif yang membutuhkan tindak lanjut
                      pada scope ini.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {queueRows.map((row) => (
                        <div
                          key={`queue-${row.key}`}
                          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-slate-900 dark:text-slate-50">
                                  {row.reference}
                                </p>
                                <Badge
                                  className={
                                    ATTENTION_SCOPE_BADGE[
                                      row.attentionScope || "operasional"
                                    ]
                                  }
                                >
                                  {row.attentionScope === "pembayaran"
                                    ? "Pembayaran"
                                    : row.attentionScope === "accounting"
                                      ? "Accounting"
                                      : "Operasional"}
                                </Badge>
                                <Badge
                                  className={
                                    RECONCILIATION_BADGE[
                                      row.reconciliationStatus
                                    ]
                                  }
                                >
                                  {row.reconciliationStatus}
                                </Badge>
                                {row.exceptionCode ? (
                                  <Badge
                                    className={
                                      EXCEPTION_SEVERITY_BADGE[
                                        row.exceptionSeverity || "medium"
                                      ] ||
                                      "bg-slate-100 text-slate-700 border border-slate-200"
                                    }
                                  >
                                    {row.exceptionCode}
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {row.title}
                              </p>
                              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {row.attentionSummary}
                              </p>
                              <div className="grid gap-3 text-xs text-slate-500 dark:text-slate-400 md:grid-cols-2">
                                <p>
                                  Owner: {row.queueOwnerLabel || "-"} •
                                  Severity:{" "}
                                  {row.exceptionSeverity
                                    ? row.exceptionSeverity.replace(
                                        /\b\w/g,
                                        (char) => char.toUpperCase(),
                                      )
                                    : "-"}
                                </p>
                                <p>
                                  Rekomendasi:{" "}
                                  {row.exceptionRecommendation || "-"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsQueueDialogOpen(false);
                                  openTraceDialog(row.key, "attention");
                                }}
                                data-testid={`accounting-trace-queue-focus-button-${row.key}`}
                              >
                                <Workflow className="h-4 w-4" />
                                Fokus ke Trace
                              </Button>
                              <Button asChild size="sm">
                                <Link
                                  href={row.detailHref}
                                  data-testid={`accounting-trace-queue-detail-link-${row.key}`}
                                >
                                  Detail
                                  <ArrowUpRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </WorkspaceSection>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
