/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BellRing,
  CheckCheck,
  CheckCircle2,
  Mail,
  RadioTower,
  TriangleAlert,
} from "lucide-react";
import { KpiCards, type KpiItem } from "@/components/shared/data-display/KpiCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCursorPaginationMeta,
  TableShell,
} from "@/components/shared/data-display/TableShell";
import { useCursorStack } from "@/hooks/use-cursor-stack";
import {
  useAdminTenants,
  useNotificationActions,
  useNotificationMetrics,
  useNotifications,
} from "@/hooks/queries";
import { VendorPageHeader } from "../VendorPageHeader";
import { VENDOR_ROUTES } from "../../constants/routes";
import { formatVendorDateTime } from "../../utils/format";

function channelBadgeClass(channel?: string) {
  if (channel === "EMAIL") {
    return "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  }
  if (channel === "PUSH") {
    return "border-transparent bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300";
  }
  if (channel === "SMS") {
    return "border-transparent bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  }
  return "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function notificationStatusBadgeClass(status?: string, readAt?: string) {
  if (readAt) {
    return "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if ((status ?? "").toLowerCase().includes("fail")) {
    return "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
  }
  return "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

export function VendorNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [channel, setChannel] = useState("all");
  const cursorPagination = useCursorStack<string>();
  const notificationsQuery = useNotifications({
    limit: 100,
    cursor: cursorPagination.currentCursor,
    filter,
    channel: channel === "all" ? undefined : channel,
  });
  const metricsQuery = useNotificationMetrics();
  const tenantQuery = useAdminTenants({ limit: 100 });
  const actions = useNotificationActions();

  const notifications = useMemo(
    () => notificationsQuery.data?.data ?? [],
    [notificationsQuery.data?.data],
  );
  const metrics = metricsQuery.data;
  const tenantMap = useMemo(() => {
    const entries = tenantQuery.data?.data?.items ?? [];
    return new Map(
      entries.map((tenant) => [
        tenant.id,
        tenant.display_name || tenant.name || tenant.tenant_code,
      ]),
    );
  }, [tenantQuery.data?.data?.items]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read_at).length,
    [notifications],
  );

  const channelOptions = useMemo(() => {
    const values = new Set<string>();
    notifications.forEach((item) => {
      if (item.channel) values.add(item.channel);
    });
    metrics?.channel_summaries.forEach((item) => {
      if (item.channel) values.add(item.channel);
    });
    return Array.from(values);
  }, [metrics?.channel_summaries, notifications]);
  const notificationsTablePagination = createCursorPaginationMeta(
    notificationsQuery.data?.meta?.pagination,
    {
      itemCount: notifications.length,
      hasPrev: cursorPagination.canGoBack,
      hasNext: Boolean(notificationsQuery.data?.meta?.pagination?.next_cursor),
    },
  );

  const kpiItems = useMemo<KpiItem[]>(
    () => [
      {
        id: "notification_total_attempts",
        label: "Total Attempts",
        value: metrics?.total_attempts ?? notifications.length,
        footer: (
          <p className="text-xs text-muted-foreground">
            Akumulasi pengiriman notifikasi
          </p>
        ),
      },
      {
        id: "notification_unread",
        label: "Unread",
        value: unreadCount,
        footer: (
          <p className="text-xs text-muted-foreground">
            Belum ditandai read
          </p>
        ),
      },
      {
        id: "notification_failures",
        label: "Failures",
        value: metrics?.total_failures ?? 0,
        footer: (
          <p className="text-xs text-muted-foreground">
            Delivery failure yang tercatat
          </p>
        ),
      },
      {
        id: "notification_failure_rate",
        label: "Failure Rate",
        value: `${Math.round((metrics?.failure_rate ?? 0) * 100)}%`,
        footer: (
          <p className="text-xs text-muted-foreground">
            Proporsi failure di seluruh channel
          </p>
        ),
      },
    ],
    [
      metrics?.failure_rate,
      metrics?.total_attempts,
      metrics?.total_failures,
      notifications.length,
      unreadCount,
    ],
  );

  const columns = useMemo<ColumnDef<(typeof notifications)[number], unknown>[]>(
    () => [
      {
        id: "message",
        header: "Message",
        cell: ({ row }) => (
          <div className="space-y-1 align-top">
            <div className="font-medium">
              {row.original.title || row.original.category || "Notification"}
            </div>
            <div className="max-w-xl whitespace-normal text-xs text-muted-foreground">
              {row.original.body || "-"}
            </div>
          </div>
        ),
      },
      {
        id: "tenant",
        header: "Tenant",
        cell: ({ row }) =>
          row.original.tenant_id
            ? tenantMap.get(row.original.tenant_id) ||
              `Tenant #${row.original.tenant_id}`
            : "-",
      },
      {
        id: "channel",
        header: "Channel",
        cell: ({ row }) => (
          <Badge className={channelBadgeClass(row.original.channel)}>
            {row.original.channel || "-"}
          </Badge>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={notificationStatusBadgeClass(
              row.original.status,
              row.original.read_at,
            )}
          >
            {row.original.read_at
              ? "READ"
              : row.original.status || row.original.send_status || "PENDING"}
          </Badge>
        ),
      },
      {
        id: "time",
        header: "Waktu",
        cell: ({ row }) =>
          formatVendorDateTime(row.original.created_at || row.original.sent_at),
      },
      {
        id: "actions",
        header: "Aksi",
        meta: {
          align: "right",
          headerClassName: "text-right",
          cellClassName: "text-right",
        },
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            disabled={Boolean(row.original.read_at) || actions.markRead.isPending}
            onClick={() => actions.markRead.mutate(row.original.id)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark Read
          </Button>
        ),
      },
    ],
    [actions.markRead, tenantMap]
  );

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Notifications"
        description="Pantau notifikasi lintas channel, tandai read, dan masuk ke composer broadcast vendor."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={actions.markAll.isPending || notifications.length === 0}
              onClick={() => actions.markAll.mutate()}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Button asChild>
              <Link href={VENDOR_ROUTES.notificationCompose}>
                <Mail className="mr-2 h-4 w-4" />
                Compose Broadcast
              </Link>
            </Button>
          </div>
        }
      />

      <KpiCards items={kpiItems} columns={{ md: 2, xl: 4 }} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        <Card className="border-border/70">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Notification Queue</CardTitle>
            </div>
            <div className="flex gap-2">
              <Select
                value={filter}
                onValueChange={(value) => {
                  setFilter(value as "all" | "unread");
                  cursorPagination.reset();
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={channel}
                onValueChange={(value) => {
                  setChannel(value);
                  cursorPagination.reset();
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Channel</SelectItem>
                  {channelOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {notificationsQuery.error ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {(notificationsQuery.error as Error).message}
              </div>
            ) : null}

            <TableShell
              columns={columns}
              data={notifications}
              getRowId={(row) => String(row.id)}
              loading={notificationsQuery.isPending}
              loadingState="Memuat notification queue..."
              emptyState="Belum ada notifikasi yang cocok dengan filter saat ini."
              pagination={notificationsTablePagination}
              onPrevPage={
                cursorPagination.canGoBack ? cursorPagination.goBack : undefined
              }
              onNextPage={() => {
                const nextCursor =
                  notificationsQuery.data?.meta?.pagination?.next_cursor;
                if (!nextCursor) return;
                cursorPagination.goNext(nextCursor);
              }}
              paginationInfo={`Menampilkan ${notifications.length} notifikasi`}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Channel Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics?.channel_summaries?.length ? (
                metrics.channel_summaries.map((item) => (
                  <div
                    key={item.channel}
                    className="rounded-lg border px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-medium">
                        <RadioTower className="h-4 w-4 text-muted-foreground" />
                        {item.channel}
                      </div>
                      <Badge className={channelBadgeClass(item.channel)}>
                        {item.total ?? 0} events
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Delivered {item.delivered ?? 0} · Failed{" "}
                      {item.failed ?? 0} · Success rate{" "}
                      {Math.round((item.success_rate ?? 0) * 100)}%
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  Belum ada data channel summary.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Operational Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3 rounded-lg border px-4 py-3">
                <BellRing className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="text-muted-foreground">
                  List notifikasi diambil dari endpoint notifications yang sudah
                  ada, jadi halaman ini menampilkan event aktual, bukan dummy
                  vendor feed.
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border px-4 py-3">
                <TriangleAlert className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="text-muted-foreground">
                  Composer broadcast vendor menggunakan support email templates
                  sebagai jalur pengiriman yang tersedia saat ini.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
