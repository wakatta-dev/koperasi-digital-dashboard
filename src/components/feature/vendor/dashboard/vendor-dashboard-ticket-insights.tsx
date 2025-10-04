/** @format */

"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Ticket,
  UsersRound,
  PackageSearch,
  Activity,
} from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TicketSlaConfigSheet } from "@/components/feature/vendor/tickets/sla-config-sheet";
import { useTickets } from "@/hooks/queries/ticketing";
import { API_ENDPOINTS } from "@/constants/api";
import { API_PREFIX } from "@/services/api";
import type { Ticket as TicketType } from "@/types/api";
import { useVendorDashboardData } from "./vendor-dashboard-data-provider";

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

const statusLabels: Record<TicketType["status"], string> = {
  open: "Open",
  in_progress: "In Progress",
  pending: "Pending",
  closed: "Closed",
};

const chartConfig = {
  low: {
    label: "Prioritas Rendah",
    color: "hsl(var(--chart-3))",
  },
  medium: {
    label: "Prioritas Medium",
    color: "hsl(var(--chart-4))",
  },
  high: {
    label: "Prioritas Tinggi",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function VendorDashboardTicketInsights() {
  const {
    openTickets,
    mostActiveClient,
    productWithMostTickets,
    isLoading,
    data,
  } = useVendorDashboardData();

  const desiredLimit = useMemo(
    () => Math.max(100, openTickets || 0),
    [openTickets],
  );

  const {
    data: ticketData,
    isLoading: ticketsLoading,
    isFetching: ticketsRefetching,
    error: ticketsError,
  } = useTickets(
    {
      status: "open|in_progress",
      limit: desiredLimit,
    },
    undefined,
    { refetchInterval: 300000 },
  );

  const tickets = useMemo(() => ticketData ?? [], [ticketData]);

  const { chartData, openCount, inProgressCount } = useMemo(() => {
    const base = {
      open: { low: 0, medium: 0, high: 0 },
      in_progress: { low: 0, medium: 0, high: 0 },
    } as Record<"open" | "in_progress", Record<"low" | "medium" | "high", number>>;

    for (const ticket of tickets) {
      if (ticket.status !== "open" && ticket.status !== "in_progress") continue;
      base[ticket.status][ticket.priority] += 1;
    }

    const openTotal =
      base.open.low + base.open.medium + base.open.high;
    const inProgressTotal =
      base.in_progress.low + base.in_progress.medium + base.in_progress.high;

    const data = [
      {
        status: "open",
        statusLabel: statusLabels.open,
        ...base.open,
        total: openTotal,
      },
      {
        status: "in_progress",
        statusLabel: statusLabels.in_progress,
        ...base.in_progress,
        total: inProgressTotal,
      },
    ];

    return {
      chartData: data,
      openCount: openTotal,
      inProgressCount: inProgressTotal,
    };
  }, [tickets]);

  const backlogTotal = openCount + inProgressCount;
  const backlogDelta = openTickets - backlogTotal;
  const highPriorityTickets = useMemo(
    () =>
      tickets
        .filter((ticket) => ticket.priority === "high")
        .sort((a, b) => getSlaDeltaScore(a) - getSlaDeltaScore(b))
        .slice(0, 5),
    [tickets],
  );

  const slaConfigUrl = `${API_PREFIX}${API_ENDPOINTS.tickets.sla}`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Insight Dukungan</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sinkronisasi backlog tiket dan pantauan SLA dalam satu tampilan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TicketSlaConfigSheet
              trigger={
                <Button size="sm" variant="outline">
                  Atur SLA
                </Button>
              }
            />
            <Button size="sm" variant="ghost" asChild>
              <a href={slaConfigUrl} target="_blank" rel="noopener noreferrer">
                API SLA
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <Ticket className="h-4 w-4" /> Tiket Terbuka
              </p>
              <p className="text-muted-foreground">
                Total tiket yang menunggu penanganan
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="text-base font-semibold">
                  {formatNumber(openTickets)}
                </Badge>
                <Badge
                  variant={backlogDelta === 0 ? "secondary" : "destructive"}
                  className="text-[11px]"
                >
                  {backlogDelta === 0
                    ? "Sinkron dengan antrean"
                    : `Selisih ${formatNumber(Math.abs(backlogDelta))}`}
                </Badge>
              </div>
            )}
          </div>

          <div className="rounded-lg border px-4 py-3 text-sm">
            <p className="mb-2 flex items-center gap-2 font-medium">
              <Activity className="h-4 w-4" /> Status Antrean
            </p>
            {ticketsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Badge variant="secondary" className="capitalize">
                  Open • {formatNumber(openCount)}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  In Progress • {formatNumber(inProgressCount)}
                </Badge>
                <span className="text-muted-foreground">
                  {ticketsRefetching ? "Memperbarui data…" : null}
                </span>
              </div>
            )}
          </div>
        </div>

        {ticketsError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Gagal memuat detail tiket: {formatError(ticketsError)}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Komposisi Prioritas per Status</span>
            <span className="text-xs text-muted-foreground">
              Berdasarkan tiket open & in progress
            </span>
          </div>
          {ticketsLoading ? (
            <Skeleton className="h-[240px] w-full" />
          ) : chartData.some((item) => item.total > 0) ? (
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart data={chartData} margin={{ top: 8, left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="statusLabel"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} width={32} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        formatNumber(Number(value)),
                        name,
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="high"
                  stackId="status"
                  fill="var(--color-high)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="medium"
                  stackId="status"
                  fill="var(--color-medium)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="low"
                  stackId="status"
                  fill="var(--color-low)"
                  radius={[0, 0, 4, 4]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[240px] w-full items-center justify-center rounded-lg border text-sm text-muted-foreground">
              Tidak ada tiket aktif dengan status open/in progress.
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <InsightItem
            icon={<UsersRound className="h-4 w-4" />}
            title="Klien Paling Aktif"
            description={
              mostActiveClient?.name ?? "Belum ada aktivitas yang menonjol"
            }
            metric={mostActiveClient?.ticket_count}
            loading={isLoading && !data}
          />
          <InsightItem
            icon={<PackageSearch className="h-4 w-4" />}
            title="Produk dengan Eskalasi Tertinggi"
            description={
              productWithMostTickets?.name ??
              "Tidak ada produk yang mendominasi tiket"
            }
            metric={productWithMostTickets?.ticket_count}
            loading={isLoading && !data}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Tiket Prioritas Tinggi</span>
            <Button size="sm" variant="outline" asChild>
              <Link href="/vendor/tickets?status=open">
                Lihat semua tiket
              </Link>
            </Button>
          </div>
          {ticketsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : highPriorityTickets.length ? (
            <div className="space-y-2">
              {highPriorityTickets.map((ticket) => {
                const slaBadge = getSlaBadge(ticket);
                return (
                  <div
                    key={ticket.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">
                        #{ticket.id} • {statusLabels[ticket.status]}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {slaBadge ? (
                        <Badge
                          variant={slaBadge.variant}
                          className="text-xs capitalize"
                        >
                          {slaBadge.label}
                        </Badge>
                      ) : null}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/vendor/tickets?highlight=${ticket.id}`}>
                          Detail
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <a
                          href={`${API_PREFIX}${API_ENDPOINTS.tickets.vendorView(
                            ticket.id,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vendor View
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tidak ada tiket prioritas tinggi yang menunggu aksi.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type InsightItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  metric?: number;
  loading?: boolean;
};

function InsightItem({ icon, title, description, metric, loading }: InsightItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border px-3 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="flex-1 space-y-1 text-sm">
        <p className="font-medium leading-none">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="min-w-[72px] text-right text-sm font-semibold text-muted-foreground">
        {loading ? (
          <Skeleton className="h-5 w-full" />
        ) : typeof metric === "number" ? (
          formatNumber(metric)
        ) : (
          <AlertCircle className="mx-auto h-4 w-4" />
        )}
      </div>
    </div>
  );
}

function getSlaBadge(ticket: TicketType) {
  const metrics = [
    {
      type: "Respon",
      delta: ticket.first_response_sla_delta_minutes,
    },
    {
      type: "Resolusi",
      delta: ticket.resolution_sla_delta_minutes,
    },
  ].filter((item) => typeof item.delta === "number") as Array<{
    type: string;
    delta: number;
  }>;

  if (!metrics.length) return null;

  const breached = metrics.find((item) => item.delta < 0);
  if (breached) {
    return {
      label: `${breached.type} terlambat ${formatNumber(
        Math.abs(Math.round(breached.delta)),
      )}m`,
      variant: "destructive" as const,
    };
  }

  const atRisk = metrics
    .filter((item) => item.delta >= 0 && item.delta <= 30)
    .sort((a, b) => a.delta - b.delta)[0];

  if (atRisk) {
    return {
      label: `${atRisk.type} tersisa ${formatNumber(Math.round(atRisk.delta))}m`,
      variant: "outline" as const,
    };
  }

  return null;
}

function getSlaDeltaScore(ticket: TicketType) {
  const values = [
    ticket.first_response_sla_delta_minutes,
    ticket.resolution_sla_delta_minutes,
  ].filter((value) => typeof value === "number") as number[];

  if (!values.length) {
    return Number.POSITIVE_INFINITY;
  }

  return values.reduce((min, value) => Math.min(min, value), values[0]);
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Terjadi kesalahan";
}
