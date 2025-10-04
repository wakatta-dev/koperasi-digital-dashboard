/** @format */

"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Users,
  Ticket,
  Building2,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";

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
  const {
    totalActiveClients,
    openTickets,
    isLoading: dashboardLoading,
  } = useVendorDashboardData();
  const { filters } = useVendorDashboardFilters();
  const {
    subscriptionsQuery,
    subscriptionSummaryQuery,
    filteredClients,
    filteredSubscriptions,
    tenantDataLoading,
    tenantDataError,
    invalidateTenantUniverse,
  } = useVendorDashboardTenantUniverse();
  const { updateStatus } = useClientActions();
  const { error: subscriptionsError } = subscriptionsQuery;
  const { data: subscriptionSummary } = subscriptionSummaryQuery;

  const totalTenants = filteredClients.length;
  const activeTenants = filteredClients.filter(
    (c) => c.status === "active"
  ).length;
  const inactiveTenants = filteredClients.filter((c) =>
    ["inactive", "suspended"].includes(c.status)
  ).length;
  const newTenantCandidates = filteredClients.filter((c) =>
    ["inactive", "suspended"].includes(c.status)
  );
  const newTenantCount = newTenantCandidates.length;

  const pendingTrialCount = filteredSubscriptions.filter(
    (sub) => sub.status === "pending"
  ).length;

  const displayTrialCount =
    filters.subscriptionStatus === "all" && pendingTrialCount === 0
      ? subscriptionSummary?.pending ?? 0
      : pendingTrialCount;

  const nextBillingDate = useMemo(() => {
    const dates = filteredSubscriptions
      .map((s) => new Date(s.next_billing_date || ""))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    return dates[0] || null;
  }, [filteredSubscriptions]);

  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  const openTenantDialog = useCallback(() => {
    if (!newTenantCandidates.length) return;
    setSelectedTenantId(newTenantCandidates[0]?.id ?? null);
    setTenantDialogOpen(true);
  }, [newTenantCandidates]);

  const closeTenantDialog = () => {
    setTenantDialogOpen(false);
    setSelectedTenantId(null);
  };

  const selectedTenant = useMemo(() => {
    return newTenantCandidates.find((t) => t.id === selectedTenantId) ?? null;
  }, [newTenantCandidates, selectedTenantId]);

  async function handleVerifyTenant() {
    if (!selectedTenant) return;
    await updateStatus.mutateAsync({ id: selectedTenant.id, status: "active" });
    await invalidateTenantUniverse();
    closeTenantDialog();
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Total Tenant"
          icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
          loading={tenantDataLoading}
          error={tenantDataError}
          value={formatNumber(totalTenants)}
          description={
            filters.subscriptionStatus === "all"
              ? "Semua tenant sesuai filter tipe"
              : `Status: ${translateSubscriptionFilter(
                  filters.subscriptionStatus
                )}`
          }
        />
        <KpiCard
          title="Tenant Aktif"
          icon={<UserCheck className="h-5 w-5 text-muted-foreground" />}
          loading={tenantDataLoading}
          error={tenantDataError}
          value={formatNumber(activeTenants)}
          description="Status aktif & berjalan"
        />
        <KpiCard
          title="Tenant Nonaktif"
          icon={<UserX className="h-5 w-5 text-muted-foreground" />}
          loading={tenantDataLoading}
          error={tenantDataError}
          value={formatNumber(inactiveTenants)}
          description="Termasuk suspended & inactive"
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tenant Baru</CardTitle>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {tenantDataLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : tenantDataError ? (
              <p className="text-sm text-destructive">
                Gagal memuat tenant baru.
              </p>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">
                    {formatNumber(newTenantCount)}
                  </span>
                  <Badge variant="secondary">Baru</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Status belum aktif atau suspended
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Langganan Trial
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {tenantDataLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : subscriptionsError ? (
              <p className="text-sm text-destructive">
                Gagal memuat data langganan.
              </p>
            ) : (
              <>
                <div className="text-2xl font-semibold">
                  {formatNumber(displayTrialCount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {nextBillingDate
                    ? `Tagihan selanjutnya: ${dateFormatter.format(
                        nextBillingDate
                      )}`
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-6">
        <KpiCard
          title="Total Klien Aktif"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          loading={dashboardLoading}
          value={formatNumber(totalActiveClients)}
        />
        <KpiCard
          title="Tiket Terbuka"
          icon={<Ticket className="h-5 w-5 text-muted-foreground" />}
          loading={dashboardLoading}
          value={formatNumber(openTickets)}
        />
      </div>

      <ManageTenantDialog
        open={tenantDialogOpen}
        onOpenChange={(open) =>
          open ? setTenantDialogOpen(true) : closeTenantDialog()
        }
        tenants={newTenantCandidates}
        selectedId={selectedTenantId}
        onSelect={setSelectedTenantId}
        onActivate={handleVerifyTenant}
        isActivating={updateStatus.isPending}
      />
    </>
  );
}

function KpiCard({
  title,
  icon,
  value,
  description,
  loading,
  error,
}: {
  title: string;
  icon: ReactNode;
  value: string;
  description?: string;
  loading?: boolean;
  error?: unknown;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
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
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ManageTenantDialog({
  open,
  onOpenChange,
  tenants,
  selectedId,
  onSelect,
  onActivate,
  isActivating,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenants: Client[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onActivate: () => void;
  isActivating: boolean;
}) {
  const selectedTenant = tenants.find((t) => t.id === selectedId) ?? null;

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
                onValueChange={(v) => onSelect(Number(v))}
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
            {selectedTenant && (
              <div className="space-y-2 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-semibold">{selectedTenant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Domain: {selectedTenant.domain ?? "-"}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize w-fit">
                  {selectedTenant.status ?? "inactive"}
                </Badge>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" asChild>
                <Link href="/vendor/clients">Lihat Semua Tenant</Link>
              </Button>
              <Button
                onClick={onActivate}
                disabled={isActivating || !selectedTenant}
              >
                {isActivating ? "Memverifikasi..." : "Verifikasi & Aktifkan"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada tenant yang menunggu verifikasi.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}
