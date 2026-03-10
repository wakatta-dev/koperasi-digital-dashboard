/** @format */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SupportSystemReadiness } from "@/types/api";
import {
  settingsCardContentClassName,
  settingsHeaderClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureSystemReadinessCardProps = {
  data?: SupportSystemReadiness;
  isLoading: boolean;
  error?: Error | null;
};

type DisplayStatus = "ready" | "missing" | "loading" | "unavailable";
type FlowStatus = "ready" | "blocked";
type GateStatus = "passed" | "blocker";

function statusLabel(status: DisplayStatus) {
  if (status === "ready") return "Siap";
  if (status === "missing") return "Belum siap";
  if (status === "loading") return "Memeriksa";
  return "Tidak tersedia";
}

function statusBadgeClass(status: DisplayStatus) {
  if (status === "ready") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (status === "missing") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300";
  }
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300";
}

function flowStatusLabel(status: FlowStatus) {
  return status === "ready" ? "Siap" : "Blocker";
}

function flowStatusBadgeClass(status: FlowStatus) {
  if (status === "ready") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300";
}

function gateStatusLabel(status: GateStatus) {
  return status === "passed" ? "Pass" : "Blocker";
}

function gateStatusBadgeClass(status: GateStatus) {
  if (status === "passed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300";
}

export function FeatureSystemReadinessCard({
  data,
  isLoading,
  error,
}: FeatureSystemReadinessCardProps) {
  const displayStatus: DisplayStatus = isLoading
    ? "loading"
    : error || !data
      ? "unavailable"
      : data.status;
  const missingDomains = data?.domains.filter((domain) => domain.status === "missing") ?? [];
  const blockedCriticalFlows = data?.critical_flows.filter((flow) => flow.status === "blocked") ?? [];
  const hasReadinessBlockers = missingDomains.length > 0 || blockedCriticalFlows.length > 0;

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={settingsSectionTitleClassName}>Kesiapan Sistem</h2>
            <p className={`mt-1 ${settingsMutedTextClassName}`}>
              Validasi dependency minimum sebelum marketplace, rental, dan accounting dipakai
              untuk flow inti.
            </p>
          </div>
          <Badge className={statusBadgeClass(displayStatus)}>
            {statusLabel(displayStatus)}
          </Badge>
        </div>
      </div>

      <CardContent className={`${settingsCardContentClassName} space-y-5`}>
        {isLoading ? (
          <p className="text-sm text-gray-500">Memeriksa kesiapan data master dan konfigurasi…</p>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Gagal memuat status kesiapan</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !error && data ? (
          <>
            {hasReadinessBlockers ? (
              <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertTitle>Flow inti belum siap sepenuhnya</AlertTitle>
                <AlertDescription>
                  Selesaikan dependency domain dan gate evidence yang masih blocker sebelum
                  mengandalkan flow inti pada release readiness.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                <AlertTitle>Semua dependency inti sudah siap</AlertTitle>
                <AlertDescription>
                  Tenant ini sudah memiliki baseline konfigurasi dan data minimum untuk flow inti
                  MVP.
                </AlertDescription>
              </Alert>
            )}

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Fondasi Umum Tenant
                </h3>
                <p className="text-xs text-gray-500">
                  Dependency dasar yang dipakai lintas marketplace, rental, dan accounting.
                </p>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {data.foundation_items.map((item, index) => (
                  <li
                    key={`${item.key}-${index}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        {item.message ? (
                          <p className="mt-1 text-xs text-gray-500">{item.message}</p>
                        ) : null}
                      </div>
                      <Badge className={statusBadgeClass(item.status)}>{statusLabel(item.status)}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Status per Domain
                </h3>
                <p className="text-xs text-gray-500">
                  Domain dengan status belum siap harus diselesaikan lebih dulu sebelum flow inti
                  domain tersebut dipakai penuh.
                </p>
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                {data.domains.map((domain, domainIndex) => (
                  <article
                    key={`${domain.domain}-${domainIndex}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {domain.label}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          {domain.ready_count} siap • {domain.missing_count} kurang
                        </p>
                      </div>
                      <Badge className={statusBadgeClass(domain.status)}>
                        {statusLabel(domain.status)}
                      </Badge>
                    </div>

                    <ul className="mt-4 space-y-3">
                      {domain.items.map((item, itemIndex) => (
                        <li key={`${item.key}-${itemIndex}`} className="rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900/60">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </p>
                              {item.message ? (
                                <p className="mt-1 text-xs text-gray-500">{item.message}</p>
                              ) : null}
                            </div>
                            <Badge className={statusBadgeClass(item.status)}>
                              {statusLabel(item.status)}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Readiness Matrix Flow Kritis
                </h3>
                <p className="text-xs text-gray-500">
                  Matriks release-readiness untuk flow authoritative yang harus punya evidence
                  eksplisit sebelum sprint dinyatakan siap.
                </p>
              </div>

              <div className="space-y-4">
                {data.critical_flows.map((flow, flowIndex) => (
                  <article
                    key={`${flow.key}-${flowIndex}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {flow.label}
                          </h4>
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                          >
                            {flow.domain}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {flow.blocker_count > 0
                            ? `${flow.blocker_count} gate masih menjadi blocker readiness.`
                            : "Semua gate readiness untuk flow ini sudah pass."}
                        </p>
                      </div>
                      <Badge className={flowStatusBadgeClass(flow.status)}>
                        {flowStatusLabel(flow.status)}
                      </Badge>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-gray-800">
                        <thead>
                          <tr className="text-xs uppercase tracking-wide text-gray-500">
                            <th className="py-2 pr-3 font-medium">Gate</th>
                            <th className="px-3 py-2 font-medium">Requirement</th>
                            <th className="px-3 py-2 font-medium">Evidence</th>
                            <th className="px-3 py-2 font-medium">Owner</th>
                            <th className="px-3 py-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-900/70">
                          {flow.gates.map((gate, gateIndex) => (
                            <tr key={`${gate.key}-${gateIndex}`} className="align-top">
                              <td className="py-3 pr-3">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {gate.label}
                                </div>
                                {gate.message ? (
                                  <p className="mt-1 text-xs text-gray-500">{gate.message}</p>
                                ) : null}
                              </td>
                              <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-300">
                                {gate.requirement_codes.join(", ")}
                              </td>
                              <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-300">
                                {gate.evidence_type}
                              </td>
                              <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-300">
                                {gate.owner}
                              </td>
                              <td className="px-3 py-3">
                                <Badge className={gateStatusBadgeClass(gate.status)}>
                                  {gateStatusLabel(gate.status)}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
