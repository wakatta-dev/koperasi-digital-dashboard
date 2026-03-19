/** @format */

"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createCursorPaginationMeta } from "@/components/shared/data-display/TableShell";
import { useSupportActivityLogs } from "@/hooks/queries";
import { FeatureActivityLogFilterCard } from "../features/FeatureActivityLogFilterCard";
import { FeatureActivityLogTable } from "../features/FeatureActivityLogTable";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { TenantSettingsShell } from "../shared/TenantSettingsShell";
import { fromDateInputValue, rfc3339ToDateInput } from "../../lib/forms";
import { buildQueryString } from "../../lib/settings";

type ActivityLogSettingsPageProps = {
  queryString?: string;
};

export function ActivityLogSettingsPage({
  queryString = "",
}: ActivityLogSettingsPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );

  const [cursor, setCursor] = useState<string | undefined>(searchParams.get("cursor") ?? undefined);
  const [module, setModule] = useState(searchParams.get("module") ?? "all");
  const [action, setAction] = useState(searchParams.get("action") ?? "all");
  const [actorId, setActorId] = useState(searchParams.get("actorId") ?? "");
  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") ?? "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") ?? "");

  const syncFiltersQuery = useCallback(
    (nextState: {
      cursor?: string;
      module: string;
      action: string;
      actorId: string;
      fromDate: string;
      toDate: string;
    }) => {
      const nextQuery = buildQueryString(searchParams, {
        cursor: nextState.cursor ?? null,
        module: nextState.module !== "all" ? nextState.module : null,
        action: nextState.action !== "all" ? nextState.action : null,
        actorId: nextState.actorId || null,
        fromDate: nextState.fromDate || null,
        toDate: nextState.toDate || null,
      });

      if (nextQuery === searchParams.toString()) {
        return;
      }

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

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
  const tablePagination = createCursorPaginationMeta(
    logsQuery.data?.meta?.pagination,
    {
      itemCount: rows.length,
    },
  );
  const activeFilterCount = [module !== "all", action !== "all", Boolean(actorId), Boolean(fromDate), Boolean(toDate)].filter(Boolean).length;

  const updateFilters = useCallback(
    (
      updates: Partial<{
        cursor?: string;
        module: string;
        action: string;
        actorId: string;
        fromDate: string;
        toDate: string;
      }>
    ) => {
      const nextState = {
        cursor,
        module,
        action,
        actorId,
        fromDate,
        toDate,
        ...updates,
      };
      setCursor(nextState.cursor);
      setModule(nextState.module);
      setAction(nextState.action);
      setActorId(nextState.actorId);
      setFromDate(nextState.fromDate);
      setToDate(nextState.toDate);
      syncFiltersQuery(nextState);
    },
    [action, actorId, cursor, fromDate, module, syncFiltersQuery, toDate]
  );

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
          value: tablePagination?.hasNext
            ? "Ada halaman berikutnya"
            : "Tidak ada halaman berikutnya",
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
          updateFilters({ cursor: undefined, module: value });
        }}
        onActionChange={(value) => {
          updateFilters({ cursor: undefined, action: value });
        }}
        onActorIdChange={(value) => {
          updateFilters({ cursor: undefined, actorId: value });
        }}
        onFromDateChange={(value) => {
          updateFilters({ cursor: undefined, fromDate: value });
        }}
        onToDateChange={(value) => {
          updateFilters({ cursor: undefined, toDate: value });
        }}
        onReset={() => {
          updateFilters({
            cursor: undefined,
            module: "all",
            action: "all",
            actorId: "",
            fromDate: "",
            toDate: "",
          });
        }}
      />

      {logsQuery.error ? (
        <SettingsErrorBanner message={(logsQuery.error as Error).message} />
      ) : null}

      <FeatureActivityLogTable
        rows={rows}
        loading={logsQuery.isFetching}
        pagination={tablePagination}
        onPreviousPage={() => {
          if (!tablePagination?.prevCursor) return;
          updateFilters({ cursor: String(tablePagination.prevCursor) });
        }}
        onNextPage={() => {
          if (!tablePagination?.nextCursor) return;
          updateFilters({ cursor: String(tablePagination.nextCursor) });
        }}
      />
    </TenantSettingsShell>
  );
}
