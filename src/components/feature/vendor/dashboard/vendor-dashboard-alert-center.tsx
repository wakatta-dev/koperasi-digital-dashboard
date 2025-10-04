/** @format */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { differenceInCalendarDays, format } from "date-fns";
import { Megaphone, Building2, FileWarning, LifeBuoy, Filter } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { ensureSuccess } from "@/lib/api";
import {
  listVendorNotifications,
  publishVendorNotification,
  unpublishVendorNotification,
  listTenants,
  listVendorSubscriptions,
} from "@/services/api";
import { useVendorBillingReport } from "./vendor-dashboard-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Notification, TenantDetail, Subscription, Invoice, Ticket } from "@/types/api";
import { listTickets } from "@/services/api/ticketing";

const DATE_FORMAT = "d MMM yyyy";
const TRIAL_THRESHOLD_DAYS = 7;

type AlertType = "all" | "broadcast" | "tenant" | "billing" | "support";

type DashboardAlert = {
  id: string;
  type: Exclude<AlertType, "all">;
  title: string;
  description: string;
  timestamp?: Date | null;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  ctaLabel?: string;
  ctaHref?: string;
  onCTA?: () => void;
  onClick?: () => void;
};

function formatDate(date?: Date | null) {
  if (!date) return "";
  try {
    return format(date, DATE_FORMAT);
  } catch (_error) {
    return "";
  }
}

export function VendorDashboardAlertCenter() {
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = ((session?.user as any)?.role?.name ?? "") === "Super Admin";

  const [activeType, setActiveType] = useState<AlertType>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const shouldFetchBroadcasts = activeType === "all" || activeType === "broadcast";
  const shouldFetchTenantAlerts = activeType === "all" || activeType === "tenant";
  const shouldFetchBillingAlerts = activeType === "all" || activeType === "billing";
  const shouldFetchSupportAlerts = activeType === "all" || activeType === "support";

  const {
    data: broadcasts,
    error: broadcastError,
    isLoading: broadcastLoading,
    isFetching: broadcastFetching,
    refetch: refetchBroadcasts,
  } = useQuery<Notification[]>({
    queryKey: ["vendor-dashboard", "broadcasts"],
    queryFn: async () => ensureSuccess(await listVendorNotifications({ limit: 5 })),
    enabled: shouldFetchBroadcasts,
    keepPreviousData: true,
  });

  const {
    data: inactiveTenants,
    error: tenantError,
    isLoading: tenantsLoading,
  } = useQuery<TenantDetail[]>({
    queryKey: ["vendor-dashboard", "tenants", "inactive"],
    queryFn: async () => ensureSuccess(await listTenants({ status: "inactive", limit: 10 })),
    enabled: shouldFetchTenantAlerts,
    keepPreviousData: true,
  });

  const {
    data: pendingTrials,
    error: trialsError,
    isLoading: trialsLoading,
  } = useQuery<Subscription[]>({
    queryKey: ["vendor-dashboard", "subscriptions", "pending"],
    queryFn: async () =>
      ensureSuccess(
        await listVendorSubscriptions({ status: "pending", limit: 50 }),
      ),
    enabled: shouldFetchBillingAlerts,
    keepPreviousData: true,
  });

  const {
    data: tickets,
    error: ticketsError,
    isLoading: ticketsLoading,
  } = useQuery<Ticket[]>({
    queryKey: ["vendor-dashboard", "tickets", "technical"],
    queryFn: async () =>
      ensureSuccess(
        await listTickets({
          category: "technical",
          status: "in_progress|pending",
          limit: 10,
        }),
      ),
    enabled: shouldFetchSupportAlerts,
    keepPreviousData: true,
  });

  const {
    data: billing,
    error: billingError,
    isLoading: billingLoading,
    refetch: refetchBilling,
  } = useVendorBillingReport();

  const overdueInvoices = useMemo(
    () => (billing?.overdue_invoices ?? []) as Invoice[],
    [billing?.overdue_invoices],
  );

  const latestBroadcast = useMemo(() => {
    if (!broadcasts?.length) return null;
    return broadcasts.slice().sort((a, b) => {
      const aTime = new Date(a.created_at ?? a.published_at ?? "").getTime();
      const bTime = new Date(b.created_at ?? b.published_at ?? "").getTime();
      return bTime - aTime;
    })[0];
  }, [broadcasts]);

  const trialAlerts = useMemo(() => {
    if (!pendingTrials?.length) return [] as Subscription[];
    const now = new Date();
    return pendingTrials
      .map((subscription) => ({
        subscription,
        due: subscription.next_billing_date
          ? new Date(subscription.next_billing_date)
          : subscription.end_date
          ? new Date(subscription.end_date)
          : null,
      }))
      .filter(({ due }) => due && !Number.isNaN(due.getTime()))
      .filter(({ due }) => {
        const diff = differenceInCalendarDays(due!, now);
        return diff >= 0 && diff <= TRIAL_THRESHOLD_DAYS;
      })
      .sort((a, b) => (a.due!.getTime() - b.due!.getTime()))
      .map(({ subscription }) => subscription);
  }, [pendingTrials]);

  const alerts = useMemo(() => {
    const items: DashboardAlert[] = [];

    if (latestBroadcast) {
      const publishedAt = latestBroadcast.published_at
        ? new Date(latestBroadcast.published_at)
        : latestBroadcast.created_at
        ? new Date(latestBroadcast.created_at)
        : null;

      items.push({
        id: latestBroadcast.id,
        type: "broadcast",
        title: latestBroadcast.title,
        description: latestBroadcast.body ?? "Broadcast terbaru tersedia untuk tenant.",
        timestamp: publishedAt,
        badge:
          latestBroadcast.status === "PUBLISHED"
            ? "Terpublikasi"
            : latestBroadcast.status === "DRAFT"
            ? "Draft"
            : latestBroadcast.status,
        badgeVariant:
          latestBroadcast.status === "PUBLISHED"
            ? "default"
            : latestBroadcast.status === "DRAFT"
            ? "secondary"
            : "outline",
        ctaLabel: isSuperAdmin
          ? latestBroadcast.status === "PUBLISHED"
            ? "Unpublish"
            : "Publish"
          : "Lihat",
        onCTA: isSuperAdmin
          ? async () => {
              setActionLoading(latestBroadcast.id);
              try {
                if (latestBroadcast.status === "PUBLISHED") {
                  await ensureSuccess(
                    await unpublishVendorNotification(latestBroadcast.id),
                  );
                  toast.success("Broadcast dibatalkan");
                } else {
                  await ensureSuccess(
                    await publishVendorNotification(latestBroadcast.id),
                  );
                  toast.success("Broadcast dipublikasikan");
                }
                await refetchBroadcasts();
              } catch (error: any) {
                toast.error(error?.message ?? "Gagal memperbarui broadcast");
              } finally {
                setActionLoading(null);
              }
            }
          : undefined,
        ctaHref: !isSuperAdmin ? "/vendor/notifications" : undefined,
        onClick: () => router.push(`/vendor/notifications?highlight=${latestBroadcast.id}`),
      });
    }

    (inactiveTenants ?? []).forEach((tenant) => {
      items.push({
        id: `tenant-${tenant.id}`,
        type: "tenant",
        title: tenant.name,
        description: `Tenant baru menunggu verifikasi. Domain: ${tenant.domain}`,
        timestamp: tenant.created_at ? new Date(tenant.created_at) : undefined,
        badge: "Inactive",
        badgeVariant: "secondary",
        ctaLabel: "Verifikasi",
        ctaHref: `/vendor/clients?highlight=${tenant.id}`,
        onClick: () => router.push(`/vendor/clients?highlight=${tenant.id}`),
      });
    });

    trialAlerts.forEach((subscription) => {
      const dueDate = subscription.next_billing_date
        ? new Date(subscription.next_billing_date)
        : subscription.end_date
        ? new Date(subscription.end_date)
        : null;
      const remainingDays = dueDate
        ? Math.max(0, differenceInCalendarDays(dueDate, new Date()))
        : null;

      items.push({
        id: `trial-${subscription.id}`,
        type: "tenant",
        title: `Trial hampir habis (#${subscription.tenant_id})`,
        description: remainingDays != null
          ? `Sisa ${remainingDays} hari sebelum penagihan berikutnya.`
          : "Jadwal penagihan berikutnya belum tersedia.",
        timestamp: dueDate,
        badge: "Trial",
        badgeVariant: "outline",
        ctaLabel: "Verifikasi",
        ctaHref: `/vendor/clients?subscription=pending&highlight=${subscription.tenant_id}`,
        onClick: () =>
          router.push(
            `/vendor/clients?subscription=pending&highlight=${subscription.tenant_id}`,
          ),
      });
    });

    overdueInvoices.slice(0, 8).forEach((invoice) => {
      const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
      const overdueDays = dueDate
        ? Math.max(0, differenceInCalendarDays(new Date(), dueDate))
        : null;
      items.push({
        id: `invoice-${invoice.id}`,
        type: "billing",
        title: `Invoice ${invoice.number}`,
        description:
          overdueDays != null
            ? `Terlambat ${overdueDays} hari. Total ${formatCurrency(invoice.total)}.`
            : `Total ${formatCurrency(invoice.total)}.`,
        timestamp: dueDate,
        badge: "Overdue",
        badgeVariant: "destructive",
        ctaLabel: "Lihat",
        ctaHref: `/vendor/invoices?highlight=${invoice.id}`,
        onClick: () => router.push(`/vendor/invoices?highlight=${invoice.id}`),
      });
    });

    (tickets ?? []).forEach((ticket) => {
      const updatedAt = ticket.updated_at ? new Date(ticket.updated_at) : null;
      items.push({
        id: `ticket-${ticket.id}`,
        type: "support",
        title: ticket.title,
        description: `Tiket teknis (#${ticket.id}) status ${translateTicketStatus(ticket.status)}.`,
        timestamp: updatedAt,
        badge: ticket.status === "pending" ? "Pending" : "In Progress",
        badgeVariant: ticket.status === "pending" ? "secondary" : "default",
        ctaLabel: "Respon",
        ctaHref: `/vendor/tickets?highlight=${ticket.id}`,
        onClick: () => router.push(`/vendor/tickets?highlight=${ticket.id}`),
      });
    });

    return items;
  }, [
    latestBroadcast,
    isSuperAdmin,
    inactiveTenants,
    router,
    trialAlerts,
    overdueInvoices,
    tickets,
    refetchBroadcasts,
  ]);

  const filteredAlerts = useMemo(() => {
    if (activeType === "all") return alerts;
    return alerts.filter((alert) => alert.type === activeType);
  }, [alerts, activeType]);

  const loading =
    broadcastLoading || tenantsLoading || trialsLoading || ticketsLoading || billingLoading;
  const hasErrors = broadcastError || tenantError || trialsError || ticketsError || billingError;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Alert &amp; Broadcast</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pantau broadcast terbaru, tenant baru, tagihan overdue, dan tiket teknis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {broadcastFetching ? (
            <Badge variant="outline" className="gap-1 text-xs">
              <Filter className="h-3 w-3" /> Memperbarui
            </Badge>
          ) : null}
          <Select value={activeType} onValueChange={(value: AlertType) => setActiveType(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter alert" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Alert</SelectItem>
              <SelectItem value="broadcast">Broadcast</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="support">Teknis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasErrors ? (
          <Alert variant="destructive">
            <AlertDescription>
              Tidak semua alert dapat dimuat. Beberapa data mungkin tidak lengkap.
            </AlertDescription>
          </Alert>
        ) : null}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        ) : filteredAlerts.length ? (
          <ScrollArea className="max-h-[420px] pr-4">
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  onClick={alert.onClick}
                  className="w-full overflow-hidden rounded-lg border bg-card text-left transition hover:border-primary"
                >
                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertIcon type={alert.type} />
                        <h3 className="font-medium leading-tight">{alert.title}</h3>
                      </div>
                      {alert.badge ? (
                        <Badge variant={alert.badgeVariant ?? "secondary"}>{alert.badge}</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(alert.timestamp)}</span>
                      {alert.ctaLabel ? (
                        alert.onCTA ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading === alert.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              void alert.onCTA?.();
                            }}
                          >
                            {actionLoading === alert.id ? "Memproses..." : alert.ctaLabel}
                          </Button>
                        ) : alert.ctaHref ? (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Link href={alert.ctaHref}>{alert.ctaLabel}</Link>
                          </Button>
                        ) : null
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Tidak ada alert untuk ditampilkan.
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 text-xs text-muted-foreground">
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/vendor/notifications">Kelola broadcast</Link>
          </Button>
          <Button variant="link" size="sm" className="px-0" onClick={() => refetchBilling()}>
            Segarkan billing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function formatCurrency(amount?: number) {
  if (typeof amount !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function translateTicketStatus(status: Ticket["status"]) {
  switch (status) {
    case "in_progress":
      return "sedang ditangani";
    case "pending":
      return "menunggu";
    case "open":
      return "baru";
    case "closed":
      return "selesai";
    default:
      return status;
  }
}

function AlertIcon({ type }: { type: DashboardAlert["type"] }) {
  const className = "h-4 w-4 text-muted-foreground";
  switch (type) {
    case "broadcast":
      return <Megaphone className={className} />;
    case "tenant":
      return <Building2 className={className} />;
    case "billing":
      return <FileWarning className={className} />;
    case "support":
      return <LifeBuoy className={className} />;
    default:
      return <Megaphone className={className} />;
  }
}

