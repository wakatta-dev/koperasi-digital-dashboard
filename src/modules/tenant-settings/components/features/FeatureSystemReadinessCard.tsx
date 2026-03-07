/** @format */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SupportSystemReadiness } from "@/types/api";
import { settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";

type FeatureSystemReadinessCardProps = {
  data?: SupportSystemReadiness;
  isLoading: boolean;
  error?: Error | null;
};

type DisplayStatus = "ready" | "missing" | "loading" | "unavailable";

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

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kesiapan Sistem</h2>
            <p className="mt-1 text-sm text-gray-500">
              Validasi dependency minimum sebelum marketplace, rental, dan accounting dipakai
              untuk flow inti.
            </p>
          </div>
          <Badge className={statusBadgeClass(displayStatus)}>
            {statusLabel(displayStatus)}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-5 p-6">
        {isLoading ? (
          <p className="text-sm text-gray-500">Memeriksa kesiapan data master dan konfigurasi...</p>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Gagal memuat status kesiapan</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !error && data ? (
          <>
            {missingDomains.length > 0 ? (
              <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertTitle>Flow inti belum siap sepenuhnya</AlertTitle>
                <AlertDescription>
                  Selesaikan item yang masih kurang sebelum mengandalkan flow inti pada domain yang
                  ditandai belum siap.
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
                {data.foundation_items.map((item) => (
                  <li
                    key={item.key}
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
                {data.domains.map((domain) => (
                  <article
                    key={domain.domain}
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
                      {domain.items.map((item) => (
                        <li key={item.key} className="rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900/60">
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
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
