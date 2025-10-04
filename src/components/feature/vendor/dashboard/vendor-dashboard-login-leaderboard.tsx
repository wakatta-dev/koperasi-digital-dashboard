/** @format */

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Activity,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ensureSuccess } from "@/lib/api";
import { buildReactQueryRetry } from "@/lib/rate-limit";
import { listUsers } from "@/services/api";
import type { Client, User } from "@/types/api";

import { useVendorDashboardFilters } from "./vendor-dashboard-filter-context";
import { useVendorDashboardTenantUniverse } from "./vendor-dashboard-tenant-data";
import {
  buildRangeCacheKey,
  isDateWithinRange,
  resolveDashboardDateRanges,
} from "./vendor-dashboard-date-utils";

type TenantLoginLeaderboardEntry = {
  tenantId: number;
  tenantName: string;
  tenantType?: Client["type"];
  currentCount: number;
  previousCount: number;
  trend: number;
  trendDirection: "up" | "down" | "flat";
  lastLoginAt: Date | null;
};

type TenantLoginLeaderboardResult = {
  entries: TenantLoginLeaderboardEntry[];
  totalTenants: number;
  totalLogins: number;
};

const MAX_ROWS = 5;

export function VendorDashboardLoginLeaderboard() {
  const { filters } = useVendorDashboardFilters();
  const { filteredClients } = useVendorDashboardTenantUniverse();

  const tenantLookup = useMemo(() => {
    const map = new Map<number, Pick<Client, "id" | "name" | "type">>();
    for (const client of filteredClients) {
      map.set(client.id, {
        id: client.id,
        name: client.name ?? `Tenant #${client.id}`,
        type: client.type,
      });
    }
    return map;
  }, [filteredClients]);

  const tenantIds = useMemo(() => {
    return [...tenantLookup.keys()].sort((a, b) => a - b);
  }, [tenantLookup]);

  const resolvedRanges = useMemo(
    () => resolveDashboardDateRanges(filters.dateRange ?? null),
    [filters.dateRange],
  );

  const cacheKey = useMemo(() => {
    return tenantIds.length
      ? [
          "vendor-dashboard",
          "tenant-login-leaderboard",
          tenantIds.join(","),
          buildRangeCacheKey(resolvedRanges),
        ]
      : null;
  }, [tenantIds, resolvedRanges]);

  const queryKey = cacheKey ?? [
    "vendor-dashboard",
    "tenant-login-leaderboard",
    "empty",
  ];

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: async () =>
      fetchTenantLoginLeaderboard({
        tenantIds,
        tenantLookup,
        ranges: resolvedRanges,
      }),
    enabled: Boolean(cacheKey),
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">
            Leaderboard Login Tenant
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aktivitas login pengguna unik berdasarkan tenant pada periode terpilih.
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Activity className="h-3.5 w-3.5" />
          {tenantIds.length ? `${tenantIds.length} tenant` : "Tidak ada data"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFetching ? (
          <p className="text-xs text-muted-foreground">Memperbarui data…</p>
        ) : null}
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : error ? (
          <p className="text-sm text-destructive">
            Gagal memuat data login tenant. Coba perbarui filter atau muat ulang halaman.
          </p>
        ) : !data || !data.entries.length ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Belum ada aktivitas login pada rentang tanggal ini.
          </div>
        ) : (
          <div className="space-y-4">
            <ol className="space-y-3">
              {data.entries.slice(0, MAX_ROWS).map((entry, index) => (
                <li
                  key={entry.tenantId}
                  className="flex items-start justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="truncate text-base font-semibold">
                        {entry.tenantName}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {entry.tenantType ?? "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.lastLoginAt
                        ? `Login terakhir ${formatDistanceToNow(entry.lastLoginAt, {
                            addSuffix: true,
                          })}`
                        : "Belum ada catatan login"}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold">
                        {entry.currentCount}
                      </span>
                      <TrendBadge entry={entry} />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1"
                      asChild
                    >
                      <Link href={`/vendor/clients?tenantId=${entry.tenantId}`}>
                        Lihat aktivitas
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
            {data.entries.length > MAX_ROWS ? (
              <p className="text-xs text-muted-foreground">
                Menampilkan {MAX_ROWS} teratas dari {data.entries.length} tenant.
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TrendBadge({ entry }: { entry: TenantLoginLeaderboardEntry }) {
  const { trendDirection, trend } = entry;
  if (trendDirection === "flat") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Minus className="h-3.5 w-3.5" /> 0%
      </Badge>
    );
  }

  const Icon = trendDirection === "up" ? ArrowUpRight : ArrowDownRight;
  const variant: "default" | "destructive" =
    trendDirection === "up" ? "default" : "destructive";

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3.5 w-3.5" />
      {formatTrendValue(trend)}
    </Badge>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: MAX_ROWS }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 rounded-lg border p-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function fetchTenantLoginLeaderboard({
  tenantIds,
  tenantLookup,
  ranges,
}: {
  tenantIds: number[];
  tenantLookup: Map<number, Pick<Client, "id" | "name" | "type">>;
  ranges: ReturnType<typeof resolveDashboardDateRanges>;
}): Promise<TenantLoginLeaderboardResult> {
  if (!tenantIds.length) {
    return { entries: [], totalTenants: 0, totalLogins: 0 };
  }

  const entries: TenantLoginLeaderboardEntry[] = [];
  const concurrency = 5;

  for (let i = 0; i < tenantIds.length; i += concurrency) {
    const batch = tenantIds.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (tenantId) => {
        try {
          const response = await listUsers({ tenant_id: tenantId, limit: 200 });
          const users = ensureSuccess<User[]>(response);
          return { tenantId, users };
        } catch (_err) {
          return { tenantId, users: [] as User[] };
        }
      }),
    );

    for (const result of results) {
      const { tenantId, users } = result;
      const meta = tenantLookup.get(tenantId);
      if (!meta) continue;

      let currentCount = 0;
      let previousCount = 0;
      let lastLoginAt: Date | null = null;

      for (const user of users ?? []) {
        if (!user.last_login) continue;
        const lastLogin = new Date(user.last_login);
        if (Number.isNaN(lastLogin.getTime())) continue;

        if (isDateWithinRange(lastLogin, ranges.current.start, ranges.current.end)) {
          currentCount += 1;
        } else if (
          isDateWithinRange(lastLogin, ranges.previous.start, ranges.previous.end)
        ) {
          previousCount += 1;
        }

        if (!lastLoginAt || lastLogin > lastLoginAt) {
          lastLoginAt = lastLogin;
        }
      }

      const trendDirection =
        currentCount > previousCount
          ? "up"
          : currentCount < previousCount
            ? "down"
            : "flat";
      const trend = computeTrend(currentCount, previousCount);

      entries.push({
        tenantId,
        tenantName: meta.name,
        tenantType: meta.type,
        currentCount,
        previousCount,
        trend,
        trendDirection,
        lastLoginAt,
      });
    }
  }

  entries.sort((a, b) => {
    if (b.currentCount !== a.currentCount) {
      return b.currentCount - a.currentCount;
    }
    const aTime = a.lastLoginAt?.getTime() ?? 0;
    const bTime = b.lastLoginAt?.getTime() ?? 0;
    return bTime - aTime;
  });

  const totalLogins = entries.reduce((sum, entry) => sum + entry.currentCount, 0);

  return {
    entries,
    totalTenants: tenantIds.length,
    totalLogins,
  };
}

function computeTrend(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

function formatTrendValue(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const display = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  return `${display}%`;
}
