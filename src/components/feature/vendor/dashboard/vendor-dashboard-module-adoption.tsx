/** @format */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BarChart3, Users, PowerOff } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ensureSuccess } from "@/lib/api";
import { buildReactQueryRetry } from "@/lib/rate-limit";
import { listTenantModules } from "@/services/api";
import type { Client, TenantModule } from "@/types/api";

import { useVendorDashboardFilters } from "./vendor-dashboard-filter-context";
import { useVendorDashboardTenantUniverse } from "./vendor-dashboard-tenant-data";
import {
  buildRangeCacheKey,
  intervalOverlapsRange,
  resolveDashboardDateRanges,
} from "./vendor-dashboard-date-utils";

type ModuleAdoptionEntry = {
  moduleId: string;
  code: string;
  name: string;
  activeTenants: number;
  inactiveTenants: number;
  adoptionRate: number;
  activeTenantIds: number[];
  inactiveTenantIds: number[];
};

type ModuleAdoptionResult = {
  entries: ModuleAdoptionEntry[];
  totalTenants: number;
};

export function VendorDashboardModuleAdoption() {
  const { filters } = useVendorDashboardFilters();
  const { filteredClients } = useVendorDashboardTenantUniverse();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

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

  const tenantIds = useMemo(
    () => [...tenantLookup.keys()].sort((a, b) => a - b),
    [tenantLookup],
  );

  const resolvedRanges = useMemo(
    () => resolveDashboardDateRanges(filters.dateRange ?? null),
    [filters.dateRange],
  );

  const cacheKey = useMemo(() => {
    return tenantIds.length
      ? [
          "vendor-dashboard",
          "module-adoption",
          tenantIds.join(","),
          buildRangeCacheKey(resolvedRanges),
        ]
      : null;
  }, [tenantIds, resolvedRanges]);

  const queryKey = cacheKey ?? ["vendor-dashboard", "module-adoption", "empty"];

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: async () =>
      fetchModuleAdoption({
        tenantIds,
        tenantLookup,
        ranges: resolvedRanges,
      }),
    enabled: Boolean(cacheKey),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const selectedModule = useMemo(() => {
    if (!data?.entries.length || !selectedModuleId) return null;
    return data.entries.find((entry) => entry.moduleId === selectedModuleId) ?? null;
  }, [data?.entries, selectedModuleId]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">
              Adopsi Modul Aktif
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Persentase tenant yang mengaktifkan modul pada rentang tanggal terpilih.
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <BarChart3 className="h-3.5 w-3.5" />
            {tenantIds.length ? `${tenantIds.length} tenant` : "Tidak ada data"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFetching ? (
            <p className="text-xs text-muted-foreground">Memperbarui data…</p>
          ) : null}
          {isLoading ? (
            <ModuleAdoptionSkeleton />
          ) : error ? (
            <p className="text-sm text-destructive">
              Gagal memuat ringkasan modul. Silakan coba lagi nanti.
            </p>
          ) : !data?.entries.length ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Belum ada modul aktif yang cocok dengan filter saat ini.
            </div>
          ) : (
            <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
              {data.entries.slice(0, 12).map((entry) => (
                <ModuleAdoptionRow
                  key={entry.moduleId}
                  entry={entry}
                  onViewTenants={() => setSelectedModuleId(entry.moduleId)}
                />
              ))}
              {data.entries.length > 12 ? (
                <div className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                  Menampilkan 12 modul teratas dari {data.entries.length} total modul.
                </div>
              ) : null}
            </div>
          )}
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => void refetch()}>
              Segarkan Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <ModuleTenantDialog
        module={selectedModule}
        tenantLookup={tenantLookup}
        open={Boolean(selectedModule)}
        onOpenChange={(open) => !open && setSelectedModuleId(null)}
      />
    </>
  );
}

function ModuleAdoptionRow({
  entry,
  onViewTenants,
}: {
  entry: ModuleAdoptionEntry;
  onViewTenants: () => void;
}) {
  const inactiveLabel = `${entry.inactiveTenants} tenant menonaktifkan modul`;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-base font-semibold">{entry.name}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {entry.code}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{entry.adoptionRate.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground">
            {entry.activeTenants} tenant aktif
          </p>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${Math.min(entry.adoptionRate, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-1">
          <PowerOff className="h-3.5 w-3.5" />
          {inactiveLabel}
        </div>
        <Button size="sm" variant="outline" className="h-8" onClick={onViewTenants}>
          Lihat tenant
        </Button>
      </div>
    </div>
  );
}

function ModuleTenantDialog({
  module,
  tenantLookup,
  open,
  onOpenChange,
}: {
  module: ModuleAdoptionEntry | null;
  tenantLookup: Map<number, Pick<Client, "id" | "name" | "type">>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{module?.name ?? "Detail modul"}</DialogTitle>
          <DialogDescription>
            Ringkasan tenant yang mengaktifkan maupun menonaktifkan modul.
          </DialogDescription>
        </DialogHeader>

        {module ? (
          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" /> Tenant aktif ({module.activeTenants})
              </div>
              <TenantList tenantIds={module.activeTenantIds} tenantLookup={tenantLookup} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <PowerOff className="h-4 w-4" /> Dinonaktifkan ({module.inactiveTenants})
              </div>
              <TenantList tenantIds={module.inactiveTenantIds} tenantLookup={tenantLookup} />
            </section>
          </div>
        ) : (
          <Skeleton className="h-32 w-full" />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TenantList({
  tenantIds,
  tenantLookup,
}: {
  tenantIds: number[];
  tenantLookup: Map<number, Pick<Client, "id" | "name" | "type">>;
}) {
  if (!tenantIds.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Tidak ada tenant pada kategori ini.
      </p>
    );
  }

  return (
    <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
      {tenantIds.map((tenantId) => {
        const meta = tenantLookup.get(tenantId);
        if (!meta) return null;
        return (
          <li key={tenantId} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{meta.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{meta.type ?? "-"}</p>
            </div>
            <Button variant="link" className="h-auto p-0 text-sm" asChild>
              <Link href={`/vendor/clients?tenantId=${tenantId}`}>Buka profil</Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function ModuleAdoptionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

async function fetchModuleAdoption({
  tenantIds,
  tenantLookup,
  ranges,
}: {
  tenantIds: number[];
  tenantLookup: Map<number, Pick<Client, "id" | "name" | "type">>;
  ranges: ReturnType<typeof resolveDashboardDateRanges>;
}): Promise<ModuleAdoptionResult> {
  if (!tenantIds.length) {
    return { entries: [], totalTenants: 0 };
  }

  const moduleMap = new Map<string, ModuleAdoptionEntry>();
  const concurrency = 5;

  for (let i = 0; i < tenantIds.length; i += concurrency) {
    const batch = tenantIds.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (tenantId) => {
        try {
          const response = await listTenantModules(tenantId, { limit: 200 });
          const modules = ensureSuccess<TenantModule[]>(response);
          return { tenantId, modules };
        } catch (_err) {
          return { tenantId, modules: [] as TenantModule[] };
        }
      }),
    );

    for (const { tenantId, modules } of results) {
      if (!tenantLookup.has(tenantId)) continue;

      for (const tenantModule of modules ?? []) {
        const id = String(tenantModule.module_id ?? tenantModule.id);
        const existing = moduleMap.get(id);
        const base: ModuleAdoptionEntry =
          existing ?? {
            moduleId: id,
            code: tenantModule.code,
            name: tenantModule.name,
            activeTenants: 0,
            inactiveTenants: 0,
            adoptionRate: 0,
            activeTenantIds: [],
            inactiveTenantIds: [],
          };

        const overlapsCurrent = intervalOverlapsRange(
          tenantModule.start_date ?? null,
          tenantModule.end_date ?? null,
          ranges.current.start,
          ranges.current.end,
        );

        if (tenantModule.status === "aktif" && overlapsCurrent) {
          base.activeTenants += 1;
          base.activeTenantIds.push(tenantId);
        }

        const endedInRange = intervalOverlapsRange(
          tenantModule.start_date ?? null,
          tenantModule.end_date ?? tenantModule.start_date ?? null,
          ranges.current.start,
          ranges.current.end,
        );

        if (tenantModule.status === "nonaktif" && endedInRange) {
          base.inactiveTenants += 1;
          base.inactiveTenantIds.push(tenantId);
        }

        moduleMap.set(id, base);
      }
    }
  }

  const totalTenants = tenantIds.length;
  const entries = Array.from(moduleMap.values())
    .map((entry) => ({
      ...entry,
      adoptionRate:
        totalTenants > 0 ? Math.min((entry.activeTenants / totalTenants) * 100, 100) : 0,
    }))
    .sort((a, b) => b.adoptionRate - a.adoptionRate || b.activeTenants - a.activeTenants);

  return { entries, totalTenants };
}
