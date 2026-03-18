/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SupportDiagnostics } from "@/types/api/support";
import {
  settingsCardContentClassName,
  settingsHeaderClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureReadinessDiagnosticsCardProps = {
  data?: SupportDiagnostics;
  isLoading: boolean;
  error?: Error | null;
  showSupportDetails?: boolean;
};

function stateBadgeClass(state: string) {
  switch (state) {
    case "ready":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "blocked":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300";
    case "active":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300";
  }
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return "Tersedia";
}

function humanizeOutput(value: string) {
  return value.replace("module_flag:", "flag ").replace("policy:", "policy ").replace("starter:", "seed ");
}

export function FeatureReadinessDiagnosticsCard({
  data,
  isLoading,
  error,
  showSupportDetails = false,
}: FeatureReadinessDiagnosticsCardProps) {
  return (
    <Card className={settingsSurfaceClassName}>
      <div className={settingsHeaderClassName}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={settingsSectionTitleClassName}>Readiness & Diagnostics</h2>
            <p className={`mt-1 ${settingsMutedTextClassName}`}>
              State canonical per module, blocker yang nyata, jejak source policy runtime,
              dan bukti baseline yang sudah tercatat. Module bisa aktif saat runtime tetapi
              tetap blocked bila baseline belum terverifikasi.
            </p>
          </div>
          <Badge className={stateBadgeClass(data?.state ?? "draft")}>
            {data?.state ?? "draft"}
          </Badge>
        </div>
      </div>

      <CardContent className={`${settingsCardContentClassName} space-y-4`}>
        {isLoading ? <p className="text-sm text-slate-500">Memuat diagnostics tenant…</p> : null}
        {error ? <p className="text-sm text-rose-600">{error.message}</p> : null}

        {!isLoading && !error && data ? (
          <>
            {data.bootstrap_run ? (
              <div className="rounded-lg border border-slate-200 p-4 text-sm dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-white">Bootstrap run</span>
                  <Badge variant="outline">{data.bootstrap_run.preset_key}</Badge>
                  <Badge variant="outline">{data.bootstrap_run.status}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Trigger {data.bootstrap_run.trigger_type}
                  {data.bootstrap_run.repair_target ? ` • repair ${data.bootstrap_run.repair_target}` : ""}
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-3">
              {data.modules.map((module) => (
                <article
                  key={module.module_key}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {module.label}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {module.enabled ? "Runtime module enabled" : "Module belum diaktifkan"}
                      </p>
                      {module.enabled && module.missing_outputs?.length ? (
                        <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-300">
                          Runtime aktif, tetapi baseline belum lengkap.
                        </p>
                      ) : null}
                    </div>
                    <Badge className={stateBadgeClass(module.state)}>{module.state}</Badge>
                  </div>

                  {module.blocker_reasons?.length ? (
                    <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {module.blocker_reasons.slice(0, 3).map((reason) => (
                        <li key={reason} className="rounded-md bg-rose-50 px-3 py-2 dark:bg-rose-950/20">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-xs text-slate-500">
                      Tidak ada blocker utama pada module ini.
                    </p>
                  )}

                  {module.exception_summary ? (
                    <div className="mt-4 rounded-md border border-slate-200 px-3 py-3 text-xs dark:border-slate-800">
                      <p className="font-medium text-slate-900 dark:text-white">
                        Exception oversight
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {module.exception_summary.governance_source ?? "standard_inheritance"} •{" "}
                        {module.exception_summary.latest_status ?? "none"}
                      </p>
                      {module.exception_summary.owner_label ? (
                        <p className="mt-1 text-slate-500">
                          Owner: {module.exception_summary.owner_label}
                        </p>
                      ) : null}
                      {module.exception_summary.reason ? (
                        <p className="mt-1 text-slate-500">
                          {module.exception_summary.reason}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {module.effective_policies?.length ? (
                    <div className="mt-4 space-y-3">
                      {module.effective_policies.map((policy) => (
                        <div
                          key={policy.policy_key}
                          className="rounded-md border border-slate-200 px-3 py-3 dark:border-slate-800"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-medium text-slate-900 dark:text-white">
                              {policy.policy_name}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{formatValue(policy.effective_value)}</Badge>
                              <Badge variant="outline">{policy.enforcement_state}</Badge>
                            </div>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500">
                            Source: {policy.source_scope} • {policy.source_label}
                          </p>

                          {showSupportDetails && policy.resolution_chain?.length ? (
                            <div className="mt-3 grid gap-2">
                              {policy.resolution_chain.map((step) => (
                                <div
                                  key={`${policy.policy_key}-${step.scope}`}
                                  className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-2 py-2 text-[11px] dark:bg-slate-900/60"
                                >
                                  <span className="text-slate-600 dark:text-slate-300">
                                    {step.scope}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {step.has_value ? (
                                      <Badge variant="outline">
                                        {step.selected ? "selected" : "candidate"}
                                      </Badge>
                                    ) : (
                                      <span className="text-slate-400">empty</span>
                                    )}
                                    {step.enforcement_state ? (
                                      <Badge variant="outline">{step.enforcement_state}</Badge>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {module.missing_outputs?.length ? (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        Output baseline yang belum terbukti
                      </p>
                      <ul className="mt-2 space-y-1 text-[11px] text-slate-500">
                        {module.missing_outputs.map((item) => (
                          <li key={item}>{humanizeOutput(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
