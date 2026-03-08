/** @format */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useAccountingJournalPostingPolicies,
  useAccountingJournalSourceTrace,
} from "@/hooks/queries/accounting-journal";
import { useMarketplaceOrder, useMarketplaceOrders } from "@/hooks/queries/marketplace-orders";
import {
  useSupportOperationalExceptionActions,
  useSupportOperationalExceptionContext,
} from "@/hooks/queries/support-config";
import { getAssetRentalBookings } from "@/services/api/asset-rental";
import { getReservation } from "@/services/api/reservations";
import {
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
  resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  escalated: "bg-rose-50 text-rose-700 border border-rose-200",
};

const EXCEPTION_STATUS_LABEL: Record<string, string> = {
  none: "Belum Ada Catatan",
  active: "Aktif",
  resolved: "Terselesaikan",
  escalated: "Tereskalasi",
};

function toSentenceCase(value?: string | null) {
  const normalized = String(value ?? "")
    .trim()
    .replaceAll("_", " ");
  if (!normalized) return "-";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function FeatureOperationalTraceWorkbench() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "attention" | "matched">("all");
  const [queueScope, setQueueScope] = useState<
    "all" | "operasional" | "pembayaran" | "accounting"
  >("all");
  const [queueDomain, setQueueDomain] = useState<"all" | "marketplace" | "rental">("all");
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
  const visibleRows = useMemo(() => filterOperationalTraceRows(rows, filter), [filter, rows]);
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

  useEffect(() => {
    if (!rows.length) {
      setSelectedKey(null);
      return;
    }
    setSelectedKey((current) =>
      current && rows.some((row) => row.key === current) ? current : rows[0].key,
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
    visibleRows.find((row) => row.key === selectedKey) ?? visibleRows[0] ?? null;
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

  const marketplaceDetailQuery = useMarketplaceOrder(selectedRow?.domain === "marketplace" ? selectedRow.sourceId : undefined, {
    enabled: selectedRow?.domain === "marketplace",
  });

  const rentalDetailQuery = useQuery({
    queryKey: ["reservation-detail", "accounting-trace", selectedRow?.sourceId ?? ""],
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
      return (marketplaceDetailQuery.data?.status_history ?? []).map((entry, index) => ({
        id: `marketplace-history-${index}-${entry.status}`,
        title: entry.status.replaceAll("_", " "),
        description: entry.reason || "Tidak ada catatan tambahan.",
        time: new Date(entry.timestamp * 1000).toLocaleString("id-ID"),
      }));
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
  }, [marketplaceDetailQuery.data?.status_history, rentalDetailQuery.data?.timeline, selectedRow]);
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
  }, [selectedRowKey, exceptionContextQuery.data?.owner_label, exceptionContextQuery.data?.next_step]);

  const exceptionStatus = exceptionContextQuery.data?.status ?? "none";
  const resolutionExceptionCode =
    exceptionContextQuery.data?.exception_code ?? selectedRow?.exceptionCode ?? "-";
  const resolutionSeverity =
    exceptionContextQuery.data?.severity ?? selectedRow?.exceptionSeverity ?? "-";
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
  const governanceStatus = sourceTraceQuery.data?.governance_status ?? "allowed";
  const governanceCode = sourceTraceQuery.data?.governance_code ?? "-";
  const governanceReason =
    sourceTraceQuery.data?.governance_reason ??
    sourceTraceQuery.data?.blocker_reason ??
    "Tidak ada blocker governance aktif.";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Operational Subledger Trace</CardTitle>
              <p className="text-sm text-muted-foreground">
                Satu konteks kerja untuk menelusuri transaksi sumber, pembayaran, dan readiness accounting.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Total {summary.total}</span>
              <span>Siap {summary.ready}</span>
              <span>Perlu tindak lanjut {summary.needsAttention}</span>
              <span>Sesuai {summary.matched}</span>
              <span>Layak lapor {summary.reportingReady}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              Semua
            </Button>
            <Button
              variant={filter === "attention" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("attention")}
            >
              Perlu Rekonsiliasi
            </Button>
            <Button
              variant={filter === "matched" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("matched")}
            >
              Sinkron
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Referensi</TableHead>
                <TableHead>Status Operasional</TableHead>
                <TableHead>Status Pembayaran</TableHead>
                <TableHead>Status Accounting</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!visibleRows.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    Belum ada transaksi operasional yang dapat ditelusuri.
                  </TableCell>
                </TableRow>
              ) : null}
              {visibleRows.map((row) => (
                <TableRow key={row.key} data-selected={row.key === selectedRow?.key || undefined}>
                  <TableCell>{row.domain === "marketplace" ? "Marketplace" : "Rental"}</TableCell>
                  <TableCell className="font-medium">{row.reference}</TableCell>
                  <TableCell>{row.operationalStatus}</TableCell>
                  <TableCell>{row.paymentStatus}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge className={ACCOUNTING_STATUS_BADGE[row.accountingStatus] || ACCOUNTING_STATUS_BADGE["Belum Siap"]}>
                        {row.accountingStatus}
                      </Badge>
                      <Badge className={RECONCILIATION_BADGE[row.reconciliationStatus]}>
                        {row.reconciliationStatus}
                      </Badge>
                      <Badge className={REPORTING_BADGE[row.reportingStatus]}>
                        {row.reportingStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedKey(row.key)}>
                      Lihat Trace
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trace Detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedRow ? (
            <p className="text-sm text-muted-foreground">
              Pilih transaksi untuk melihat hubungan operasional, pembayaran, dan accounting.
            </p>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Transaksi</p>
                <p className="mt-1 font-semibold">{selectedRow.title}</p>
                <p className="text-sm text-muted-foreground">{selectedRow.reference}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p>Status operasional: <span className="font-medium">{selectedRow.operationalStatus}</span></p>
                <p>Status pembayaran: <span className="font-medium">{selectedRow.paymentStatus}</span></p>
                <p>Status accounting: <span className="font-medium">{selectedRow.accountingStatus}</span></p>
                <p>Status rekonsiliasi: <span className="font-medium">{selectedRow.reconciliationStatus}</span></p>
                <p>Kelayakan pelaporan: <span className="font-medium">{selectedRow.reportingStatus}</span></p>
                <p>Alasan/indikator: <span className="font-medium">{selectedRow.accountingReason}</span></p>
                <p>Catatan pelaporan: <span className="font-medium">{selectedRow.reportingReason}</span></p>
              </div>
              {proofUrl ? (
                <Button asChild variant="outline" size="sm">
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer">
                    Lihat Bukti Pembayaran
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Bukti pembayaran belum tersedia di transaksi terpilih.
                </p>
              )}
              <Button asChild variant="ghost" className="px-0">
                <Link href={selectedRow.detailHref}>Buka detail transaksi</Link>
              </Button>
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Jejak Status
                </p>
                <div className="mt-3 space-y-3">
                  {historyItems.length > 0 ? (
                    historyItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        <p className="mt-2 text-xs text-slate-500">{item.time}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Belum ada riwayat status untuk transaksi yang dipilih.
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Readiness Backbone Review
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Policy result, trace status, dan governance blocker dirangkum pada konteks transaksi yang sama.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={
                          READINESS_STATUS_BADGE[sourceTraceQuery.data?.readiness_status || "not_ready"] ||
                          READINESS_STATUS_BADGE.not_ready
                        }
                      >
                        Readiness: {toSentenceCase(sourceTraceQuery.data?.readiness_status)}
                      </Badge>
                      <Badge
                        className={
                          TRACE_STATUS_BADGE[sourceTraceQuery.data?.trace_status || "blocked"] ||
                          TRACE_STATUS_BADGE.blocked
                        }
                      >
                        Trace: {toSentenceCase(sourceTraceQuery.data?.trace_status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs text-slate-500">Policy Code</p>
                      <p className="text-sm font-medium text-slate-900">
                        {appliedPolicy?.policy_code ?? sourceTraceQuery.data?.policy_code ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Policy Name</p>
                      <p className="text-sm font-medium text-slate-900">
                        {appliedPolicy?.policy_name ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Source Reference</p>
                      <p className="text-sm font-medium text-slate-900">
                        {sourceTraceQuery.data?.source_reference ?? selectedRow.reference}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Journal Reference</p>
                      <p className="text-sm font-medium text-slate-900">
                        {sourceTraceQuery.data?.journal_reference ??
                          sourceTraceQuery.data?.journal_number ??
                          "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Policy Result
                      </p>
                      <p className="mt-2 text-sm text-slate-800">
                        {appliedPolicy?.treatment_summary ??
                          sourceTraceQuery.data?.readiness_reason ??
                          selectedRow.accountingReason}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(appliedPolicy?.prerequisite_codes ?? []).map((code) => (
                          <Badge
                            key={code}
                            className="bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Governance Blocker
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          className={
                            governanceStatus === "blocked"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }
                        >
                          {governanceStatus === "blocked" ? "Blocked" : "Allowed"}
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
                      <p className="mt-3 text-sm text-slate-800">{governanceReason}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Exception Workspace
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Simpan owner, langkah lanjut, dan catatan penanganan tanpa keluar dari trace transaksi.
                    </p>
                  </div>
                  <Badge
                    className={
                      EXCEPTION_STATUS_BADGE[exceptionStatus] || EXCEPTION_STATUS_BADGE.none
                    }
                  >
                    {EXCEPTION_STATUS_LABEL[exceptionStatus] || "Belum Ada Catatan"}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 md:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Basis Resolusi
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">Transaksi</p>
                        <p className="text-sm font-medium text-slate-900">{selectedRow.reference}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Pembayaran</p>
                        <p className="text-sm font-medium text-slate-900">{selectedRow.paymentStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Accounting</p>
                        <p className="text-sm font-medium text-slate-900">{selectedRow.accountingStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Bukti Pembayaran</p>
                        <p className="text-sm font-medium text-slate-900">
                          {proofUrl ? "Tersedia" : "Belum Tersedia"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Exception Code</p>
                        <div className="mt-1">
                          <Badge
                            className={
                              EXCEPTION_SEVERITY_BADGE[String(resolutionSeverity)] ||
                              "bg-slate-100 text-slate-700 border border-slate-200"
                            }
                          >
                            {resolutionExceptionCode}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Severity</p>
                        <div className="mt-1">
                          <Badge
                            className={
                              EXCEPTION_SEVERITY_BADGE[String(resolutionSeverity)] ||
                              "bg-slate-100 text-slate-700 border border-slate-200"
                            }
                          >
                            {String(resolutionSeverity).replace(/\b\w/g, (char) =>
                              char.toUpperCase(),
                            )}
                          </Badge>
                        </div>
                      </div>
                      <div className="md:col-span-2 xl:col-span-2">
                        <p className="text-xs text-slate-500">Recommended Action</p>
                        <p className="text-sm font-medium text-slate-900">
                          {resolutionRecommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Owner Penanganan
                    </label>
                    <Input
                      value={exceptionOwner}
                      onChange={(event) => setExceptionOwner(event.target.value)}
                      placeholder="Contoh: Finance, Admin Operasional"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Next Step
                    </label>
                    <Input
                      value={exceptionNextStep}
                      onChange={(event) => setExceptionNextStep(event.target.value)}
                      placeholder="Contoh: Konfirmasi bukti transfer"
                    />
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Catatan Exception
                  </label>
                  <Textarea
                    value={exceptionMessage}
                    onChange={(event) => setExceptionMessage(event.target.value)}
                    placeholder="Tuliskan konteks masalah, alasan follow-up, atau keputusan sementara."
                    rows={4}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
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
                        attention_scope: selectedRow.attentionScope ?? undefined,
                        summary: selectedRow.attentionSummary ?? undefined,
                        owner_label: exceptionOwner,
                        next_step: exceptionNextStep,
                        message: exceptionMessage,
                      });
                    }}
                    disabled={!selectedRow || exceptionActions.saveNote.isPending}
                  >
                    {exceptionActions.saveNote.isPending ? "Menyimpan..." : "Simpan Catatan Exception"}
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
                        attention_scope: selectedRow.attentionScope ?? undefined,
                        summary: selectedRow.attentionSummary ?? undefined,
                        owner_label: exceptionOwner || undefined,
                        next_step: exceptionNextStep || undefined,
                        message: exceptionMessage,
                        status: "resolved",
                      });
                    }}
                    disabled={!selectedRow || exceptionActions.applyDecision.isPending}
                  >
                    {exceptionActions.applyDecision.isPending ? "Memproses..." : "Tandai Selesai"}
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
                        attention_scope: selectedRow.attentionScope ?? undefined,
                        summary: selectedRow.attentionSummary ?? undefined,
                        owner_label: exceptionOwner || undefined,
                        next_step: exceptionNextStep || undefined,
                        message: exceptionMessage,
                        status: "escalated",
                      });
                    }}
                    disabled={!selectedRow || exceptionActions.applyDecision.isPending}
                  >
                    {exceptionActions.applyDecision.isPending ? "Memproses..." : "Eskalasi"}
                  </Button>
                  {exceptionContextQuery.data?.summary ? (
                    <p className="text-sm text-slate-600">
                      Konteks saat ini: {exceptionContextQuery.data.summary}
                    </p>
                  ) : selectedRow.attentionSummary ? (
                    <p className="text-sm text-slate-600">
                      Konteks saat ini: {selectedRow.attentionSummary}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 space-y-3">
                  {exceptionContextQuery.isLoading ? (
                    <p className="text-sm text-slate-500">Memuat catatan exception...</p>
                  ) : exceptionContextQuery.data?.notes?.length ? (
                    exceptionContextQuery.data.notes.map((note) => (
                      <div
                        key={`exception-note-${note.id}`}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {note.action.replaceAll("_", " ")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(note.timestamp).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-slate-700">{note.message}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span>Actor: {note.actor_label}</span>
                          {note.owner_label ? <span>Owner: {note.owner_label}</span> : null}
                          {note.next_step ? <span>Next step: {note.next_step}</span> : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Belum ada catatan exception untuk transaksi yang dipilih.
                    </p>
                  )}
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Audit Trail Exception
                  </p>
                  <div className="mt-3 space-y-3">
                    {exceptionContextQuery.data?.audit_entries?.length ? (
                      exceptionContextQuery.data.audit_entries.map((entry) => (
                        <div
                          key={`exception-audit-${entry.id}`}
                          className="rounded-lg border border-slate-200 bg-slate-50/80 p-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900">
                              {entry.action.replaceAll("_", " ")}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(entry.timestamp).toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                            <span>Actor: {entry.actor_label}</span>
                            {entry.old_status || entry.new_status ? (
                              <span>
                                Status: {entry.old_status || "none"} -&gt; {entry.new_status || "none"}
                              </span>
                            ) : null}
                            {entry.request_id ? <span>Request: {entry.request_id}</span> : null}
                          </div>
                          {entry.reason ? (
                            <p className="mt-2 text-sm text-slate-700">{entry.reason}</p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        Belum ada audit trail exception untuk transaksi yang dipilih.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Reporting Basis Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Siap Dilaporkan</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">{summary.reportingReady}</p>
            <p className="mt-1 text-sm text-emerald-800">
              Transaksi dengan referensi deterministik dan linkage operasional-keuangan yang sinkron.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Tahan Pelaporan</p>
            <p className="mt-2 text-2xl font-semibold text-amber-900">{summary.reportingBlocked}</p>
            <p className="mt-1 text-sm text-amber-800">
              Transaksi yang masih perlu rekonsiliasi atau memiliki handoff accounting yang belum stabil.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-700">Prinsip Basis Laporan</p>
            <p className="mt-2 text-sm text-slate-800">
              Finance hanya boleh menganggap row siap sebagai basis laporan saat referensi transaksi tetap,
              status pembayaran sinkron, dan readiness accounting tidak bermasalah.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Follow-up Queue</CardTitle>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Aktif {filterFollowUpQueueRows(rows, { scope: "all" }).length}</span>
              <span>
                Pembayaran {filterFollowUpQueueRows(rows, { scope: "pembayaran" }).length}
              </span>
              <span>
                Accounting {filterFollowUpQueueRows(rows, { scope: "accounting" }).length}
              </span>
              <span>
                Operasional {filterFollowUpQueueRows(rows, { scope: "operasional" }).length}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={queueScope === "all" ? "default" : "outline"} size="sm" onClick={() => setQueueScope("all")}>
              Semua
            </Button>
            <Button
              variant={queueScope === "operasional" ? "default" : "outline"}
              size="sm"
              onClick={() => setQueueScope("operasional")}
            >
              Operasional
            </Button>
            <Button
              variant={queueScope === "pembayaran" ? "default" : "outline"}
              size="sm"
              onClick={() => setQueueScope("pembayaran")}
            >
              Pembayaran
            </Button>
            <Button
              variant={queueScope === "accounting" ? "default" : "outline"}
              size="sm"
              onClick={() => setQueueScope("accounting")}
            >
              Accounting
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={queueDomain === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setQueueDomain("all")}
            >
              Semua Domain
            </Button>
            <Button
              variant={queueDomain === "marketplace" ? "default" : "outline"}
              size="sm"
              onClick={() => setQueueDomain("marketplace")}
            >
              Marketplace
            </Button>
            <Button
              variant={queueDomain === "rental" ? "default" : "outline"}
              size="sm"
              onClick={() => setQueueDomain("rental")}
            >
              Rental
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={queueCode}
              onChange={(event) => setQueueCode(event.target.value)}
              placeholder="Filter code exception, contoh ACC-PAYMENT"
            />
            <Input
              value={queueOwnerFilter}
              onChange={(event) => setQueueOwnerFilter(event.target.value)}
              placeholder="Filter owner, contoh Finance"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!queueRows.length ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada transaksi aktif yang membutuhkan tindak lanjut pada scope ini.
            </p>
          ) : (
            queueRows.map((row) => (
              <div
                key={`queue-${row.key}`}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-4 md:flex-row md:items-start md:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-900">{row.reference}</p>
                    <Badge className={ATTENTION_SCOPE_BADGE[row.attentionScope || "operasional"]}>
                      {row.attentionScope === "pembayaran"
                        ? "Pembayaran"
                        : row.attentionScope === "accounting"
                          ? "Accounting"
                          : "Operasional"}
                    </Badge>
                    <Badge className={RECONCILIATION_BADGE[row.reconciliationStatus]}>
                      {row.reconciliationStatus}
                    </Badge>
                    {row.exceptionCode ? (
                      <Badge
                        className={
                          EXCEPTION_SEVERITY_BADGE[row.exceptionSeverity || "medium"] ||
                          "bg-slate-100 text-slate-700 border border-slate-200"
                        }
                      >
                        {row.exceptionCode}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-800">{row.title}</p>
                  <p className="text-sm text-slate-600">{row.attentionSummary}</p>
                  <p className="text-xs text-slate-500">
                    Owner: {row.queueOwnerLabel || "-"} • Severity:{" "}
                    {row.exceptionSeverity
                      ? row.exceptionSeverity.replace(/\b\w/g, (char) => char.toUpperCase())
                      : "-"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Rekomendasi: {row.exceptionRecommendation || "-"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedKey(row.key);
                    setFilter("attention");
                  }}
                >
                  Fokus ke Trace
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
