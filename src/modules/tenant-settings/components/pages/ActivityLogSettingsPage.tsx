/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSupportActivityLogs } from "@/hooks/queries";
import { FeatureActivityLogFilterCard } from "../features/FeatureActivityLogFilterCard";
import { FeatureActivityLogTable } from "../features/FeatureActivityLogTable";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { TenantSettingsShell } from "../shared/TenantSettingsShell";
import { fromDateInputValue, rfc3339ToDateInput } from "../../lib/forms";
import { buildQueryString } from "../../lib/settings";

export function ActivityLogSettingsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cursor, setCursor] = useState<string | undefined>(searchParams.get("cursor") ?? undefined);
  const [module, setModule] = useState(searchParams.get("module") ?? "all");
  const [action, setAction] = useState(searchParams.get("action") ?? "all");
  const [actorId, setActorId] = useState(searchParams.get("actorId") ?? "");
  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") ?? "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") ?? "");

  useEffect(() => {
    const nextCursor = searchParams.get("cursor") ?? undefined;
    const nextModule = searchParams.get("module") ?? "all";
    const nextAction = searchParams.get("action") ?? "all";
    const nextActorId = searchParams.get("actorId") ?? "";
    const nextFromDate = searchParams.get("fromDate") ?? "";
    const nextToDate = searchParams.get("toDate") ?? "";

    if (cursor !== nextCursor) setCursor(nextCursor);
    if (module !== nextModule) setModule(nextModule);
    if (action !== nextAction) setAction(nextAction);
    if (actorId !== nextActorId) setActorId(nextActorId);
    if (fromDate !== nextFromDate) setFromDate(nextFromDate);
    if (toDate !== nextToDate) setToDate(nextToDate);
  }, [action, actorId, cursor, fromDate, module, searchParams, toDate]);

  const params = useMemo(
    () => ({
      cursor,
      limit: 25,
      module: module === "all" ? undefined : module,
      action: action === "all" ? undefined : action,
      actor_id: actorId.startsWith("user:") ? actorId.replace("user:", "") : actorId || undefined,
      from: fromDateInputValue(fromDate),
      to: fromDateInputValue(toDate),
    }),
    [action, actorId, cursor, fromDate, module, toDate]
  );

  const logsQuery = useSupportActivityLogs(params);
  const rows = logsQuery.data?.data?.items ?? [];
  const nextCursor = logsQuery.data?.meta?.pagination?.next_cursor;
  const activeFilterCount = [module !== "all", action !== "all", Boolean(actorId), Boolean(fromDate), Boolean(toDate)].filter(Boolean).length;

  useEffect(() => {
    const nextQuery = buildQueryString(searchParams, {
      cursor,
      module: module !== "all" ? module : null,
      action: action !== "all" ? action : null,
      actorId: actorId || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
    });

    if (nextQuery === searchParams.toString()) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [action, actorId, cursor, fromDate, module, pathname, router, searchParams, toDate]);

  return (
    <TenantSettingsShell
      sectionId="activity-log"
      title="Activity Log"
      description="Pantau audit trail tenant dengan filter yang lebih jelas, hasil yang lebih terbaca, dan link yang bisa dibagikan ulang."
      summaryTitle="Status Audit Trail"
      summaryDescription="Ringkasan cepat filter aktif, jumlah hasil, dan ketersediaan halaman berikutnya."
      summaryItems={[
        {
          label: "Filter Aktif",
          value: `${activeFilterCount} Filter`,
          helper: activeFilterCount ? "Daftar hasil sedang dipersempit" : "Menampilkan seluruh aktivitas tenant",
        },
        {
          label: "Hasil Saat Ini",
          value: `${rows.length} Baris`,
          helper: logsQuery.isFetching ? "Sedang memuat data audit…" : "Jumlah baris yang sedang ditampilkan",
        },
        {
          label: "Pagination",
          value: nextCursor ? "Ada halaman berikutnya" : "Tidak ada halaman berikutnya",
          helper: actorId || module !== "all" || action !== "all" ? "Berdasarkan filter aktif" : "Berdasarkan query default",
        },
      ]}
    >
      <FeatureActivityLogFilterCard
        module={module}
        action={action}
        actorId={actorId}
        fromDate={fromDate || rfc3339ToDateInput(params.from)}
        toDate={toDate || rfc3339ToDateInput(params.to)}
        disabled={logsQuery.isFetching}
        onModuleChange={(value) => {
          setCursor(undefined);
          setModule(value);
        }}
        onActionChange={(value) => {
          setCursor(undefined);
          setAction(value);
        }}
        onActorIdChange={(value) => {
          setCursor(undefined);
          setActorId(value);
        }}
        onFromDateChange={(value) => {
          setCursor(undefined);
          setFromDate(value);
        }}
        onToDateChange={(value) => {
          setCursor(undefined);
          setToDate(value);
        }}
        onReset={() => {
          setCursor(undefined);
          setModule("all");
          setAction("all");
          setActorId("");
          setFromDate("");
          setToDate("");
        }}
      />

      {logsQuery.error ? (
        <SettingsErrorBanner message={(logsQuery.error as Error).message} />
      ) : null}

      <FeatureActivityLogTable
        rows={rows}
        loading={logsQuery.isFetching}
        nextCursor={nextCursor}
        onLoadMore={() => setCursor(String(nextCursor))}
      />
    </TenantSettingsShell>
  );
}
