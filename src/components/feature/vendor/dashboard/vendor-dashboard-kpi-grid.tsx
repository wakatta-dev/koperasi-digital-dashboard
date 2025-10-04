/** @format */

"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Users, Ticket, Building2, UserCheck, UserX, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Client } from "@/types/api";
import { useClientActions } from "@/hooks/queries/clients";
import { useVendorDashboardData } from "./vendor-dashboard-data-provider";
import { useVendorDashboardFilters } from "./vendor-dashboard-filter-context";
import {
  translateSubscriptionFilter,
  useVendorDashboardTenantUniverse,
} from "./vendor-dashboard-tenant-data";

const numberFormatter = new Intl.NumberFormat("id-ID");
const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

export function VendorDashboardKpiGrid() {
  const { totalActiveClients, openTickets, isLoading: dashboardLoading } =
    useVendorDashboardData();
  const { filters } = useVendorDashboardFilters();
  const {
    clientsState,
    subscriptionsState,
    subscriptionSummaryState,
    filteredClients,
    filteredSubscriptions,
    tenantDataLoading,
    tenantDataError,
  } = useVendorDashboardTenantUniverse();
  const { updateStatus } = useClientActions();
  const { mutate: mutateClients } = clientsState;
  const { error: subscriptionsError, mutate: mutateSubscriptions } =
    subscriptionsState;
  const { data: subscriptionSummary, mutate: mutateSubscriptionSummary } =
    subscriptionSummaryState;

  const totalTenants = filteredClients.length;
  const activeTenants = filteredClients.filter((client) => client.status === "active").length;
  const inactiveTenants = filteredClients.filter(
    (client) => client.status === "inactive" || client.status === "suspended",
  ).length;
  const newTenantCandidates = filteredClients.filter((client) =>
    ["inactive", "suspended"].includes(client.status),
  );
  const newTenantCount = newTenantCandidates.length;

  const pendingTrialCount = filteredSubscriptions.filter(
    (subscription) => subscription.status === "pending",
  ).length;

  const displayTrialCount =
    filters.subscriptionStatus === "all" && pendingTrialCount === 0
      ? subscriptionSummary?.pending ?? 0
      : pendingTrialCount;

  const nextBillingDate = useMemo(() => {
    const dates: Date[] = [];
    for (const subscription of filteredSubscriptions) {
      if (!subscription.next_billing_date) continue;
      const parsed = new Date(subscription.next_billing_date);
      if (Number.isNaN(parsed.getTime())) continue;
      dates.push(parsed);
    }
    if (!dates.length) return null;
    dates.sort((a, b) => a.getTime() - b.getTime());
    return dates[0];
  }, [filteredSubscriptions]);

  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  const openTenantDialog = useCallback(() => {
    if (!newTenantCandidates.length) return;
    setSelectedTenantId(newTenantCandidates[0]?.id ?? null);
    setTenantDialogOpen(true);
  }, [newTenantCandidates]);

  const closeTenantDialog = useCallback(() => {
    setTenantDialogOpen(false);
    setSelectedTenantId(null);
  }, []);

  const selectedTenant = useMemo(
    () =>
      selectedTenantId == null
        ? null
        : newTenantCandidates.find((tenant) => tenant.id === selectedTenantId) ?? null,
    [newTenantCandidates, selectedTenantId],
  );

  async function handleVerifyTenant() {
    if (!selectedTenant) return;
    await updateStatus.mutateAsync({ id: selectedTenant.id, status: "active" });
    await Promise.all([
      mutateClients(),
      mutateSubscriptions(),
      mutateSubscriptionSummary(),
    ]);
    setSelectedTenantId(null);
    setTenantDialogOpen(false);
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Total Tenant"
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          loading={tenantDataLoading}
          error={tenantDataError}
          value={formatNumber(totalTenants)}
          description={
            filters.subscriptionStatus === "all"
              ? "Semua tenant sesuai filter tipe"
              : `Difilter berdasarkan status ${translateSubscriptionFilter(filters.subscriptionStatus)}`
          }
        />

        <KpiCard
          title="Tenant Aktif"
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
          loading={tenantDataLoading}
          error={tenantDataError}
          value={formatNumber(activeTenants)}
          description="Dengan status operasional aktif"
        />

        <KpiCard
          title="Tenant Nonaktif"
          icon={<UserX className="h-4 w-4 text-muted-foreground" />}
          loading={tenantDataLoading}
          error={tenantDataError}
          value={formatNumber(inactiveTenants)}
          description="Termasuk status inactive & suspended"
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenant Baru</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {tenantDataLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : tenantDataError ? (
              <p className="text-sm text-destructive">Gagal memuat tenant baru.</p>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">
                    {formatNumber(newTenantCount)}
                  </span>
                  <Badge variant="secondary">Baru</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Menunggu aktivasi (status inactive/suspended)
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={openTenantDialog}
                  disabled={!newTenantCount}
                >
                  Kelola Tenant
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Langganan Trial</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {tenantDataLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : subscriptionsError ? (
              <p className="text-sm text-destructive">Gagal memuat data langganan.</p>
            ) : (
              <>
                <div className="text-2xl font-semibold">{formatNumber(displayTrialCount)}</div>
                <p className="text-sm text-muted-foreground">
                  {nextBillingDate
                    ? `Tagihan berikutnya: ${dateFormatter.format(nextBillingDate)}`
                    : "Belum ada jadwal tagihan"}
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/vendor/clients">Kelola Langganan</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Klien Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-semibold">
                {formatNumber(totalActiveClients)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Terbuka</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-semibold">{formatNumber(openTickets)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <ManageTenantDialog
        open={tenantDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeTenantDialog();
          } else {
            setTenantDialogOpen(true);
          }
        }}
        tenants={newTenantCandidates}
        selectedId={selectedTenantId}
        onSelect={setSelectedTenantId}
        onActivate={handleVerifyTenant}
        isActivating={updateStatus.isPending}
      />
    </>
  );
}

type KpiCardProps = {
  title: string;
  icon: ReactNode;
  value: string;
  description?: string;
  loading?: boolean;
  error?: unknown;
};

function KpiCard({ title, icon, value, description, loading, error }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : error ? (
          <p className="text-sm text-destructive">Gagal memuat data.</p>
        ) : (
          <>
            <div className="text-2xl font-semibold">{value}</div>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

type ManageTenantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenants: Client[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onActivate: () => Promise<void> | void;
  isActivating: boolean;
};

function ManageTenantDialog({
  open,
  onOpenChange,
  tenants,
  selectedId,
  onSelect,
  onActivate,
  isActivating,
}: ManageTenantDialogProps) {
  const selectedTenant = tenants.find((tenant) => tenant.id === selectedId) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Kelola Tenant Baru</DialogTitle>
          <DialogDescription>
            Verifikasi tenant baru sebelum mengaktifkan akses mereka.
          </DialogDescription>
        </DialogHeader>

        {tenants.length ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Pilih Tenant
              </span>
              <Select
                value={selectedId ? String(selectedId) : undefined}
                onValueChange={(value) => onSelect(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={String(tenant.id)}>
                      {tenant.name} ({tenant.domain})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTenant ? (
              <div className="space-y-2 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-semibold">{selectedTenant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Domain: {selectedTenant.domain ?? "-"}
                  </p>
                </div>
                <Badge variant="outline" className="w-fit capitalize">
                  {selectedTenant.status ?? "inactive"}
                </Badge>
              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" asChild>
                <Link href="/vendor/clients">Buka Daftar Tenant</Link>
              </Button>
              <Button onClick={onActivate} disabled={isActivating || !selectedTenant}>
                {isActivating ? "Memverifikasi..." : "Verifikasi & Aktifkan"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada tenant baru yang menunggu verifikasi.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function translateSubscriptionFilter(filter: ReturnType<typeof useVendorDashboardFilters>["filters"]["subscriptionStatus"]) {
  switch (filter) {
    case "active":
      return "aktif";
    case "trial":
      return "trial";
    case "cancelled":
      return "dibatalkan";
    case "expired":
      return "kedaluwarsa";
    default:
      return "semua status";
  }
}
