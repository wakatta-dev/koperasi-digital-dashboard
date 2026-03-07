/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BellRing, CheckCheck, CheckCircle2, Mail, RadioTower, TriangleAlert } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminTenants, useNotificationActions, useNotificationMetrics, useNotifications } from "@/hooks/queries";
import { VendorPageHeader } from "../VendorPageHeader";
import { VendorKpiGrid } from "../VendorKpiGrid";
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
  const notificationsQuery = useNotifications({
    limit: 100,
    filter,
    channel: channel === "all" ? undefined : channel,
  });
  const metricsQuery = useNotificationMetrics();
  const tenantQuery = useAdminTenants({ limit: 100 });
  const actions = useNotificationActions();

  const notifications = useMemo(() => notificationsQuery.data ?? [], [notificationsQuery.data]);
  const metrics = metricsQuery.data;
  const tenantMap = useMemo(() => {
    const entries = tenantQuery.data?.data?.items ?? [];
    return new Map(
      entries.map((tenant) => [
        tenant.id,
        tenant.display_name || tenant.name || tenant.tenant_code,
      ])
    );
  }, [tenantQuery.data?.data?.items]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read_at).length,
    [notifications]
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

  const kpis = useMemo(
    () => [
      {
        id: "notification_total_attempts",
        label: "Total Attempts",
        value: metrics?.total_attempts ?? notifications.length,
        helper: "Akumulasi pengiriman notifikasi",
      },
      {
        id: "notification_unread",
        label: "Unread",
        value: unreadCount,
        helper: "Belum ditandai read",
      },
      {
        id: "notification_failures",
        label: "Failures",
        value: metrics?.total_failures ?? 0,
        helper: "Delivery failure yang tercatat",
      },
      {
        id: "notification_failure_rate",
        label: "Failure Rate",
        value: `${Math.round((metrics?.failure_rate ?? 0) * 100)}%`,
        helper: "Proporsi failure di seluruh channel",
      },
    ],
    [metrics?.failure_rate, metrics?.total_attempts, metrics?.total_failures, notifications.length, unreadCount]
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

      <VendorKpiGrid items={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        <Card className="border-border/70">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Notification Queue</CardTitle>
            </div>
            <div className="flex gap-2">
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as "all" | "unread")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
              <Select value={channel} onValueChange={setChannel}>
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="align-top">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {item.title || item.category || "Notification"}
                        </div>
                        <div className="max-w-xl whitespace-normal text-xs text-muted-foreground">
                          {item.body || "-"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.tenant_id ? tenantMap.get(item.tenant_id) || `Tenant #${item.tenant_id}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={channelBadgeClass(item.channel)}>
                        {item.channel || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={notificationStatusBadgeClass(item.status, item.read_at)}>
                        {item.read_at ? "READ" : item.status || item.send_status || "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatVendorDateTime(item.created_at || item.sent_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={Boolean(item.read_at) || actions.markRead.isPending}
                        onClick={() => actions.markRead.mutate(item.id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Read
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!notificationsQuery.isPending && notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      Belum ada notifikasi yang cocok dengan filter saat ini.
                    </TableCell>
                  </TableRow>
                ) : null}

                {notificationsQuery.isPending ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      Memuat notification queue...
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
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
                  <div key={item.channel} className="rounded-lg border px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-medium">
                        <RadioTower className="h-4 w-4 text-muted-foreground" />
                        {item.channel}
                      </div>
                      <Badge className={channelBadgeClass(item.channel)}>{item.total ?? 0} events</Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Delivered {item.delivered ?? 0} · Failed {item.failed ?? 0} · Success rate{" "}
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
                  List notifikasi diambil dari endpoint notifications yang sudah ada, jadi halaman ini
                  menampilkan event aktual, bukan dummy vendor feed.
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border px-4 py-3">
                <TriangleAlert className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="text-muted-foreground">
                  Composer broadcast vendor menggunakan support email templates sebagai jalur pengiriman
                  yang tersedia saat ini.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
