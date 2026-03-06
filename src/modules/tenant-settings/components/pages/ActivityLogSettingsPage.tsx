/** @format */

"use client";

import { useMemo, useState } from "react";
import { useSupportActivityLogs } from "@/hooks/queries";
import { FeatureActivityLogFilterCard } from "../features/FeatureActivityLogFilterCard";
import { FeatureActivityLogTable } from "../features/FeatureActivityLogTable";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { SettingsSectionHeading } from "../shared/SettingsSectionHeading";
import { fromDateInputValue, rfc3339ToDateInput } from "../../lib/forms";

export function ActivityLogSettingsPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [module, setModule] = useState("all");
  const [action, setAction] = useState("all");
  const [actorId, setActorId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  return (
    <div className="max-w-6xl space-y-6">
      <SettingsSectionHeading
        title="Activity Log"
        description="Pantau aktivitas dan audit trail untuk administrasi tenant."
      />

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
    </div>
  );
}
