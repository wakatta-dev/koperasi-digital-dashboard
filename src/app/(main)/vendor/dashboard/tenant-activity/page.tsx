/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  formatDistanceToNow,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ActivitySquare, Filter, Flame } from "lucide-react";

import { ensureSuccess } from "@/lib/api";
import { buildReactQueryRetry } from "@/lib/rate-limit";
import { getVendorUsageReport, listClientActivity } from "@/services/api";
import type { ClientActivityEntry, VendorUsageReport } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { VendorDashboardGlobalFilters } from "@/components/feature/vendor/dashboard/vendor-dashboard-filters";
import { useVendorDashboardFilters } from "@/components/feature/vendor/dashboard/vendor-dashboard-filter-context";
import { useVendorDashboardTenantUniverse } from "@/components/feature/vendor/dashboard/vendor-dashboard-tenant-data";
import {
  resolveDashboardDateRanges,
  type VendorDashboardResolvedRanges,
} from "@/components/feature/vendor/dashboard/vendor-dashboard-date-utils";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const tenantOptionAll = "all";
const moduleOptionAll = "all";

export default function VendorTenantActivityPage() {
  const { filters } = useVendorDashboardFilters();
  const ranges = useMemo(
    () => resolveDashboardDateRanges(filters.dateRange ?? null),
    [filters.dateRange],
  );
  const { filteredClients, tenantDataLoading } = useVendorDashboardTenantUniverse();

  const [selectedTenant, setSelectedTenant] = useState<string>(tenantOptionAll);
  const [selectedModule, setSelectedModule] = useState<string>(moduleOptionAll);

  useEffect(() => {
    if (
      selectedTenant !== tenantOptionAll &&
      !filteredClients.some((client) => String(client.id) === selectedTenant)
    ) {
      setSelectedTenant(tenantOptionAll);
    }
  }, [filteredClients, selectedTenant]);

  const tenantId = selectedTenant === tenantOptionAll ? null : Number(selectedTenant);

  const usageParams = useMemo(
    () => ({ tenantId, selectedModule }),
    [tenantId, selectedModule]
  );

  const {
    data: usageData,
    error: usageError,
    isLoading: usageLoading,
    isFetching: usageFetching,
    refetch: refetchUsage,
  } = useQuery({
    queryKey: ["vendor-dashboard", "tenant-activity", "usage", usageParams],
    queryFn: async ({ queryKey }) => {
      const [, , , params] = queryKey as [
        string,
        string,
        string,
        { tenantId: number | null; selectedModule: string },
      ];
      return ensureSuccess<VendorUsageReport>(
        await getVendorUsageReport({
          tenant: params.tenantId ?? undefined,
          module:
            params.selectedModule !== moduleOptionAll
              ? params.selectedModule
              : undefined,
        }),
      );
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const {
    heatmapMatrix,
    heatmapSummary,
    moduleOptions,
    topDays,
  } = useMemo(() => {
    return transformUsageToHeatmap(
      usageData,
      tenantId,
      selectedModule,
      ranges,
    );
  }, [ranges, selectedModule, tenantId, usageData]);

  const {
    data: timelineData,
    error: timelineError,
    isLoading: timelineLoading,
    isFetching: timelineFetching,
    refetch: refetchTimeline,
  } = useQuery({
    queryKey: ["vendor-dashboard", "tenant-activity", "timeline", tenantId],
    queryFn: async ({ queryKey: [, , , id] }) =>
      ensureSuccess<ClientActivityEntry[]>(
        await listClientActivity(id as number, { limit: 30 })
      ),
    enabled: typeof tenantId === "number",
    staleTime: 2 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const loadingHeatmap = usageLoading && !usageData;
  const loadingTimeline =
    typeof tenantId === "number" && timelineLoading && !timelineData;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>Vendor</li>
            <li>/</li>
            <li>Dashboard</li>
            <li>/</li>
            <li className="font-medium text-foreground">Aktivitas Tenant</li>
          </ol>
        </nav>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Aktivitas Tenant & Modul
          </h1>
          <p className="text-sm text-muted-foreground">
            Analisis intensitas login per hari dan linimasa aktivitas penting tenant.
          </p>
        </div>
      </header>

      <VendorDashboardGlobalFilters />

      <Card>
        <CardHeader className="flex flex-col gap-4 pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-4 w-4" /> Filter Aktivitas
            </CardTitle>
            <CardDescription>
              Pilih tenant dan modul untuk menelusuri intensitas login serta riwayat aktivitasnya.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Pilih tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={tenantOptionAll}>Semua tenant tersaring</SelectItem>
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={moduleOptions.some((option) => option.value === selectedModule)
                ? selectedModule
                : moduleOptionAll}
              onValueChange={setSelectedModule}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Pilih modul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={moduleOptionAll}>Semua modul</SelectItem>
                {moduleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        {tenantDataLoading ? (
          <CardContent className="pb-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        ) : null}
      </Card>

      {usageError ? (
        <Alert variant="destructive">
          <AlertTitle>Data heatmap tidak dapat dimuat</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>
              {usageError instanceof Error
                ? usageError.message
                : "Terjadi kesalahan saat mengambil data login tenant."}
            </span>
            <Button size="sm" variant="outline" onClick={() => void refetchUsage()}>
              Coba lagi
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="h-full">
          <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-4 w-4 text-primary" />
                Heatmap Login Tenant
              </CardTitle>
              <CardDescription>
                Intensitas login harian berdasarkan rentang tanggal dan filter modul.
              </CardDescription>
            </div>
            {usageFetching ? (
              <span className="text-xs text-muted-foreground">Memperbarui data…</span>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingHeatmap ? (
              <HeatmapSkeleton />
            ) : heatmapMatrix.weeks.length ? (
              <>
                <HeatmapSummary summary={heatmapSummary} topDays={topDays} />
                <TenantHeatmap matrix={heatmapMatrix} />
              </>
            ) : (
              <div className="flex h-[260px] items-center justify-center rounded-lg border text-sm text-muted-foreground">
                Tidak ada login yang tercatat untuk kombinasi filter ini.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ActivitySquare className="h-4 w-4 text-primary" />
              Timeline Aktivitas Tenant
            </CardTitle>
            <CardDescription>
              Rekap tindakan terbaru dari API <code>GET /api/clients/:id/activity</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timelineError ? (
              <Alert variant="destructive">
                <AlertTitle>Linimasa tidak dapat dimuat</AlertTitle>
                <AlertDescription className="flex flex-col gap-3">
                  <span>
                    {timelineError instanceof Error
                      ? timelineError.message
                      : "Terjadi kesalahan saat mengambil linimasa tenant."}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => void refetchTimeline()}>
                    Muat ulang
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            {!tenantId ? (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Pilih tenant tertentu untuk melihat linimasa aktivitas lengkapnya.
              </div>
            ) : loadingTimeline ? (
              <TimelineSkeleton />
            ) : timelineData && timelineData.length ? (
              <>
                {timelineFetching ? (
                  <span className="text-xs text-muted-foreground">Memperbarui linimasa…</span>
                ) : null}
                <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
                  {timelineData.map((entry, index) => (
                    <li key={`${entry.occurred_at}-${entry.action}-${index}`}>
                      <TimelineEntry entry={entry} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Tidak ada aktivitas terbaru yang ditemukan untuk tenant ini.
              </div>
            )}

            <Separator />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Dokumentasi API:
                <Link
                  href="https://docs.koperasi.local/api/clients"
                  className="ml-1 text-foreground underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  clients.activity
                </Link>
              </span>
              {tenantId ? (
                <Button size="sm" variant="outline" onClick={() => void refetchTimeline()}>
                  Segarkan
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type HeatmapCell = {
  date: Date;
  count: number;
  key: string;
};

type HeatmapMatrix = {
  weeks: HeatmapCell[][];
  weekdayLabels: string[];
  weekLabels: string[];
};

type HeatmapSummary = {
  totalLogins: number;
  averagePerDay: number;
  activeDays: number;
  dateRangeLabel: string;
};

type HeatmapTopDay = {
  date: string;
  label: string;
  count: number;
};

type HeatmapTransformResult = {
  heatmapMatrix: HeatmapMatrix;
  heatmapSummary: HeatmapSummary;
  topDays: HeatmapTopDay[];
  moduleOptions: Array<{ value: string; label: string }>;
};

function transformUsageToHeatmap(
  usage: VendorUsageReport | undefined,
  tenantId: number | null,
  selectedModule: string,
  ranges: VendorDashboardResolvedRanges,
): HeatmapTransformResult {
  const entries = extractModuleEntries(usage);
  const moduleOptions = buildModuleOptions(entries);
  const filteredEntries = entries.filter((entry) => {
    if (selectedModule !== moduleOptionAll && entry.module !== selectedModule) {
      return false;
    }
    return true;
  });

  const rangeStart = ranges.current.start;
  const rangeEnd = ranges.current.end;
  const counts = new Map<string, number>();

  for (const entry of filteredEntries) {
    for (const point of entry.points) {
      if (tenantId && point.tenantId && point.tenantId !== tenantId) {
        continue;
      }
      if (!point.date) continue;
      const date = parseMaybeDate(point.date);
      if (!date) continue;
      if (!isWithinInterval(date, { start: rangeStart, end: rangeEnd })) {
        continue;
      }
      const key = format(date, "yyyy-MM-dd");
      const current = counts.get(key) ?? 0;
      counts.set(key, current + Math.max(0, point.count ?? 0));
    }
  }

  const start = startOfWeek(rangeStart, { weekStartsOn: 1 });
  const end = endOfWeek(rangeEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });
  const weekdayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const weekLabels: string[] = [];
  const weeks: HeatmapCell[][] = [];
  let currentWeek: HeatmapCell[] = [];

  days.forEach((day, index) => {
    const key = format(day, "yyyy-MM-dd");
    const count = counts.get(key) ?? 0;
    currentWeek.push({ date: day, count, key });
    if ((index + 1) % 7 === 0) {
      weeks.push(currentWeek);
      weekLabels.push(format(currentWeek[0].date, "d MMM"));
      currentWeek = [];
    }
  });

  if (currentWeek.length) {
    while (currentWeek.length < 7) {
      const last = currentWeek[currentWeek.length - 1];
      const nextDate = addDays(last.date, 1);
      currentWeek.push({ date: nextDate, count: 0, key: format(nextDate, "yyyy-MM-dd") });
    }
    weeks.push(currentWeek);
    weekLabels.push(format(currentWeek[0].date, "d MMM"));
  }

  const totalLogins = Array.from(counts.values()).reduce(
    (sum, value) => sum + value,
    0,
  );
  const activeDays = Array.from(counts.values()).filter((value) => value > 0).length;
  const averagePerDay = weeks.length ? totalLogins / days.length : 0;
  const dateRangeLabel = `${format(rangeStart, "d MMM yyyy")} – ${format(rangeEnd, "d MMM yyyy")}`;

  const topDays = Array.from(counts.entries())
    .map(([key, count]) => {
      const parsed = parseISO(`${key}T00:00:00Z`);
      return {
        date: key,
        label: format(parsed, "d MMMM yyyy", { locale: localeId }),
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    heatmapMatrix: { weeks, weekdayLabels, weekLabels },
    heatmapSummary: { totalLogins, averagePerDay, activeDays, dateRangeLabel },
    topDays,
    moduleOptions,
  };
}

type ModuleEntry = {
  module: string;
  label: string;
  points: Array<{ date?: string; count?: number; tenantId?: number | null }>;
};

function extractModuleEntries(usage: VendorUsageReport | undefined): ModuleEntry[] {
  if (!usage || typeof usage !== "object") return [];

  const rawModules = Array.isArray((usage as any).module_usage)
    ? ((usage as any).module_usage as unknown[])
    : Array.isArray((usage as any).modules)
      ? ((usage as any).modules as unknown[])
      : [];

  const entries: ModuleEntry[] = [];

  for (const raw of rawModules) {
    if (!raw || typeof raw !== "object") continue;
    const moduleKey =
      (raw as any).module_key ||
      (raw as any).module ||
      (raw as any).key ||
      (raw as any).slug;
    if (!moduleKey || typeof moduleKey !== "string") continue;
    const label =
      (raw as any).module_name ||
      (raw as any).name ||
      moduleKey
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

    const pointsSource =
      Array.isArray((raw as any).daily_logins)
        ? (raw as any).daily_logins
        : Array.isArray((raw as any).logins)
          ? (raw as any).logins
          : Array.isArray((raw as any).entries)
            ? (raw as any).entries
            : [];

    const points = pointsSource
      .map((point: any) => ({
        date:
          typeof point?.date === "string"
            ? point.date
            : typeof point?.day === "string"
              ? point.day
              : typeof point?.occurred_at === "string"
                ? point.occurred_at
                : typeof point?.timestamp === "string"
                  ? point.timestamp
                  : undefined,
        count:
          typeof point?.count === "number"
            ? point.count
            : typeof point?.logins === "number"
              ? point.logins
              : typeof point?.total === "number"
                ? point.total
                : undefined,
        tenantId:
          typeof point?.tenant_id === "number"
            ? point.tenant_id
            : typeof point?.tenantId === "number"
              ? point.tenantId
              : typeof point?.tenant === "number"
                ? point.tenant
                : null,
      }))
      .filter((point: { date?: string; count?: number | null }) => Boolean(point.date));

    entries.push({ module: moduleKey, label, points });
  }

  return entries;
}

function buildModuleOptions(entries: ModuleEntry[]) {
  const unique = new Map<string, string>();
  for (const entry of entries) {
    if (!unique.has(entry.module)) {
      unique.set(entry.module, entry.label);
    }
  }
  return Array.from(unique.entries()).map(([value, label]) => ({ value, label }));
}

function parseMaybeDate(value: string | undefined) {
  if (!value) return null;
  try {
    const parsed = parseISO(value);
    if (Number.isNaN(parsed.getTime())) {
      const fallback = parseISO(`${value}T00:00:00`);
      return Number.isNaN(fallback.getTime()) ? null : fallback;
    }
    return parsed;
  } catch (_error) {
    return null;
  }
}

function HeatmapSummary({
  summary,
  topDays,
}: {
  summary: HeatmapSummary;
  topDays: HeatmapTopDay[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border p-4">
        <p className="text-xs text-muted-foreground">Rentang Analisis</p>
        <p className="text-sm font-medium">{summary.dateRangeLabel}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Total Login</p>
            <p className="text-xl font-semibold">{summary.totalLogins}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rata-rata / hari</p>
            <p className="text-xl font-semibold">
              {summary.averagePerDay ? summary.averagePerDay.toFixed(1) : "0"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Aktivitas tercatat pada {summary.activeDays} hari unik.
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Hari dengan login tertinggi
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {topDays.length ? (
            topDays.map((day) => (
              <li key={day.date} className="flex items-center justify-between">
                <span>{day.label}</span>
                <span className="font-semibold">{day.count}</span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">Belum ada data menonjol.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function TenantHeatmap({ matrix }: { matrix: HeatmapMatrix }) {
  const maxValue = matrix.weeks.reduce((max, week) => {
    return Math.max(max, ...week.map((cell) => cell.count));
  }, 0);

  const legendSteps = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto">
        <div className="flex flex-col justify-between py-4 pr-2 text-xs text-muted-foreground">
          {matrix.weekdayLabels.map((label) => (
            <span key={label} className="h-8 leading-8">
              {label}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          {matrix.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((cell) => (
                <div
                  key={cell.key}
                  className={computeHeatmapCellClass(cell.count, maxValue)}
                  title={`${format(cell.date, "d MMM yyyy", { locale: localeId })} • ${cell.count} login`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Intensitas login</span>
        <div className="flex items-center gap-2">
          {legendSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-1">
              <span
                className={computeHeatmapCellClass(
                  step === 0 ? 0 : step * (maxValue || 1),
                  maxValue || 1,
                )}
              />
              <span>{Math.round(step * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function computeHeatmapCellClass(value: number, maxValue: number) {
  if (!maxValue || value <= 0) {
    return "h-8 w-4 rounded-sm border border-dashed border-muted";
  }
  const ratio = value / maxValue;
  if (ratio >= 0.85) return "h-8 w-4 rounded-sm bg-emerald-600";
  if (ratio >= 0.6) return "h-8 w-4 rounded-sm bg-emerald-500";
  if (ratio >= 0.35) return "h-8 w-4 rounded-sm bg-emerald-400";
  return "h-8 w-4 rounded-sm bg-emerald-300";
}

function TimelineEntry({ entry }: { entry: ClientActivityEntry }) {
  const occurred = parseMaybeDate(entry.occurred_at ?? undefined);
  const occurredLabel = occurred
    ? format(occurred, "d MMM yyyy HH:mm", { locale: localeId })
    : "-";
  const relativeLabel = occurred
    ? formatDistanceToNow(occurred, { addSuffix: true, locale: localeId })
    : "";

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="uppercase tracking-tight">
            {entry.type}
          </Badge>
          <span className="font-semibold">{entry.action}</span>
          {entry.status ? (
            <Badge variant="secondary" className="capitalize">
              {entry.status.replace(/_/g, " ")}
            </Badge>
          ) : null}
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>{occurredLabel}</div>
          <div>{relativeLabel}</div>
        </div>
      </div>
      {entry.message ? (
        <p className="text-sm text-muted-foreground">{entry.message}</p>
      ) : null}
      {typeof entry.amount === "number" ? (
        <p className="text-sm font-semibold text-emerald-600">
          {currencyFormatter.format(entry.amount)}
        </p>
      ) : null}
      {entry.reference ? (
        <p className="text-xs text-muted-foreground">Ref: {entry.reference}</p>
      ) : null}
    </div>
  );
}

function HeatmapSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-[220px] w-full" />
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-24 w-full" />
      ))}
    </div>
  );
}
