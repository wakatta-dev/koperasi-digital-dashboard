/** @format */

"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow, isWithinInterval, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Activity, Clock, LifeBuoy, MessageCircle } from "lucide-react";

import { ensureSuccess } from "@/lib/api";
import { buildReactQueryRetry } from "@/lib/rate-limit";
import { listTicketReplies, listTicketSLA, listTickets } from "@/services/api";
import type { Ticket, TicketCategorySLA, TicketReply } from "@/types/api";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { VendorDashboardGlobalFilters } from "@/components/feature/vendor/dashboard/vendor-dashboard-filters";
import { useVendorDashboardFilters } from "@/components/feature/vendor/dashboard/vendor-dashboard-filter-context";
import {
  useVendorDashboardTenantUniverse,
} from "@/components/feature/vendor/dashboard/vendor-dashboard-tenant-data";
import {
  resolveDashboardDateRanges,
  type VendorDashboardResolvedRanges,
} from "@/components/feature/vendor/dashboard/vendor-dashboard-date-utils";

export default function VendorSupportHealthPage() {
  const { filters } = useVendorDashboardFilters();
  const ranges = useMemo(
    () => resolveDashboardDateRanges(filters.dateRange ?? null),
    [filters.dateRange],
  );
  const { filteredClientIds } = useVendorDashboardTenantUniverse();

  const tenantFilterKey = useMemo(() => Array.from(filteredClientIds).join("-"), [filteredClientIds]);
  const rangeStartIso = ranges.current.start.toISOString();
  const rangeEndIso = ranges.current.end.toISOString();

  const ticketsQueryKey = useMemo(
    () => [
      "vendor-dashboard",
      "support-health",
      "tickets",
      tenantFilterKey,
      rangeStartIso,
      rangeEndIso,
    ] as const,
    [tenantFilterKey, rangeStartIso, rangeEndIso]
  );

  const {
    data: tickets,
    error: ticketsError,
    isLoading: ticketsLoading,
    isFetching: ticketsFetching,
    refetch: refetchTickets,
  } = useQuery({
    queryKey: ticketsQueryKey,
    queryFn: async () => ensureSuccess<Ticket[]>(await listTickets({ limit: 120 })),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const {
    data: sla,
    error: slaError,
    isLoading: slaLoading,
    isFetching: slaFetching,
    refetch: refetchSla,
  } = useQuery({
    queryKey: ["vendor-dashboard", "support-health", "sla"],
    queryFn: async () => ensureSuccess<TicketCategorySLA[]>(await listTicketSLA()),
    staleTime: 10 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const filteredTickets = useMemo(
    () => filterTicketsByScope(tickets ?? [], filteredClientIds, ranges),
    [filteredClientIds, ranges, tickets],
  );

  const metrics = useMemo(() => computeSupportMetrics(filteredTickets), [filteredTickets]);
  const backlog = useMemo(() => buildBacklogSummaries(filteredTickets), [filteredTickets]);
  const agentMetrics = useMemo(() => computeAgentMetrics(filteredTickets), [filteredTickets]);
  const topTicketsForReplies = useMemo(
    () =>
      filteredTickets
        .filter((ticket) => ticket.status !== "closed")
        .sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 3),
    [filteredTickets],
  );

  const loadingState = ticketsLoading && !tickets;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>Vendor</li>
            <li>/</li>
            <li>Dashboard</li>
            <li>/</li>
            <li className="font-medium text-foreground">Kesehatan Dukungan</li>
          </ol>
        </nav>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Kesehatan Operasional Dukungan
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau SLA, backlog, serta performa agen vendor berdasarkan data tiket terbaru.
          </p>
        </div>
      </header>

      <VendorDashboardGlobalFilters />

      {ticketsError ? (
        <Alert variant="destructive">
          <AlertTitle>Data tiket tidak dapat dimuat</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>
              {ticketsError instanceof Error
                ? ticketsError.message
                : "Terjadi kesalahan saat mengambil daftar tiket."}
            </span>
            <Button size="sm" variant="outline" onClick={() => void refetchTickets()}>
              Coba lagi
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {slaError ? (
        <Alert variant="destructive">
          <AlertTitle>Konfigurasi SLA tidak dapat dimuat</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>
              {slaError instanceof Error
                ? slaError.message
                : "Terjadi kesalahan saat mengambil konfigurasi SLA tiket."}
            </span>
            <Button size="sm" variant="outline" onClick={() => void refetchSla()}>
              Muat ulang SLA
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Ringkasan SLA & Beban Kerja</CardTitle>
          <CardDescription>
            Perhitungan berdasarkan {filteredTickets.length} tiket dalam rentang tanggal terpilih.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingState ? (
            <Skeleton className="h-28 w-full" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricTile
                icon={<LifeBuoy className="h-4 w-4 text-primary" />}
                label="Tiket aktif"
                value={`${metrics.openTickets} tiket`}
                helper={`Total ${metrics.totalTickets} tiket terpantau`}
              />
              <MetricTile
                icon={<Clock className="h-4 w-4 text-primary" />}
                label="Kepatuhan SLA respon"
                value={formatPercentage(metrics.responseCompliance)}
                helper={`Rata-rata respon awal ${formatMinutes(metrics.avgFirstResponseMinutes)}`}
              />
              <MetricTile
                icon={<Activity className="h-4 w-4 text-primary" />}
                label="Kepatuhan SLA resolusi"
                value={formatPercentage(metrics.resolutionCompliance)}
                helper={`Rata-rata resolusi ${formatMinutes(metrics.avgResolutionMinutes)}`}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribusi Backlog</CardTitle>
            <CardDescription>
              Status dan prioritas tiket yang masih membutuhkan tindakan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticketsFetching ? (
              <span className="text-xs text-muted-foreground">Memperbarui data tiket…</span>
            ) : null}
            {loadingState ? (
              <Skeleton className="h-[180px] w-full" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <BacklogList title="Status" items={backlog.statuses} />
                <BacklogList title="Prioritas" items={backlog.priorities} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Konfigurasi SLA per Kategori</CardTitle>
            <CardDescription>
              Data dari endpoint <code>GET /api/tickets/sla</code> untuk referensi operasional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {slaFetching && sla?.length ? (
              <span className="text-xs text-muted-foreground">Memperbarui data SLA…</span>
            ) : null}
            {slaLoading && !sla ? (
              <Skeleton className="h-[180px] w-full" />
            ) : sla && sla.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Respon awal</TableHead>
                    <TableHead className="text-right">Resolusi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="block max-h-64 overflow-y-auto">
                  {sla.map((item) => (
                    <TableRow
                      key={item.category}
                      className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-3 md:table-row md:gap-0"
                    >
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell className="text-right">
                        {formatMinutes(item.sla_response_minutes)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMinutes(item.sla_resolution_minutes)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Belum ada konfigurasi SLA yang terdaftar untuk kategori tiket.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performa Agen Dukungan</CardTitle>
            <CardDescription>
              Rata-rata respon dan resolusi berdasarkan tiket yang ditangani.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agentMetrics.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agen</TableHead>
                    <TableHead className="text-right">Tiket aktif</TableHead>
                    <TableHead className="text-right">Respon rata-rata</TableHead>
                    <TableHead className="text-right">Resolusi rata-rata</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="block max-h-72 overflow-y-auto">
                  {agentMetrics.map((agent) => (
                    <TableRow
                      key={agent.agentId}
                      className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center gap-3 md:table-row md:gap-0"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">Agen #{agent.agentId}</span>
                          <span className="text-xs text-muted-foreground">
                            {agent.totalTickets} tiket ditangani
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{agent.openTickets}</TableCell>
                      <TableCell className="text-right">
                        {formatMinutes(agent.avgFirstResponseMinutes)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMinutes(agent.avgResolutionMinutes)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Belum ada data kinerja agen untuk filter ini.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Balasan Vendor Terbaru</CardTitle>
            <CardDescription>
              Sampel percakapan dari endpoint <code>GET /api/tickets/:id/vendor-replies</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTicketsForReplies.length ? (
              topTicketsForReplies.map((ticket) => (
                <TicketRepliesPreview key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Tidak ada tiket aktif yang membutuhkan balasan vendor saat ini.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type MetricTileProps = {
  icon: ReactNode;
  label: string;
  value: string;
  helper?: string;
};

function MetricTile({ icon, label, value, helper }: MetricTileProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}

type BacklogItem = { label: string; value: number; helper?: string };

function BacklogList({ title, items }: { title: string; items: BacklogItem[] }) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3 space-y-2 text-sm">
        {items.length ? (
          items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="capitalize">{item.label}</span>
              <span className="font-semibold text-foreground">
                {item.value}
                {item.helper ? (
                  <span className="ml-1 text-xs text-muted-foreground">{item.helper}</span>
                ) : null}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">Tidak ada data</p>
        )}
      </div>
    </div>
  );
}

function TicketRepliesPreview({ ticket }: { ticket: Ticket }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: replies,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["vendor-dashboard", "support-health", "replies", ticket.id],
    queryFn: async ({ queryKey: [, , , id] }) =>
      ensureSuccess<TicketReply[]>(await listTicketReplies(id as string, { limit: 5 })),
    enabled: Boolean(ticket.id) && isExpanded,
    staleTime: 2 * 60 * 1000,
    retry: buildReactQueryRetry(),
    refetchOnWindowFocus: false,
  });

  const latestReply = replies && replies.length ? replies[replies.length - 1] : null;
  const showLoading =
    isExpanded && ((isLoading && !replies) || (isFetching && !replies));

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageCircle className="h-4 w-4 text-primary" />
            #{ticket.id} • {ticket.title}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Status {formatTicketStatus(ticket.status)} • Prioritas {formatTicketPriority(ticket.priority)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isExpanded ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Memuat…" : "Segarkan"}
            </Button>
          ) : null}
          <Button
            size="sm"
            variant={isExpanded ? "secondary" : "outline"}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Sembunyikan" : "Lihat percakapan"}
          </Button>
        </div>
      </div>
      {isExpanded ? (
        <div className="text-sm text-muted-foreground">
          {error ? (
            <span>
              {error instanceof Error
                ? error.message
                : "Gagal memuat balasan vendor."}
            </span>
          ) : showLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : latestReply ? (
            <>
              <p className="font-medium text-foreground">{latestReply.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatReplyTimestamp(latestReply.created_at)} oleh agen #{latestReply.user_id}
              </p>
            </>
          ) : (
            <span>Belum ada balasan vendor untuk tiket ini.</span>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Buka percakapan untuk memuat balasan vendor terbaru.
        </p>
      )}
    </div>
  );
}

function filterTicketsByScope(
  tickets: Ticket[],
  filteredClientIds: Set<number>,
  ranges: VendorDashboardResolvedRanges,
) {
  const { start, end } = ranges.current;
  return tickets.filter((ticket) => {
    if (filteredClientIds.size && !filteredClientIds.has(ticket.tenant_id)) {
      return false;
    }
    const createdAt = parseISO(ticket.created_at);
    if (Number.isNaN(createdAt.getTime())) return false;
    return isWithinInterval(createdAt, { start, end });
  });
}

type SupportMetrics = {
  totalTickets: number;
  openTickets: number;
  responseCompliance: number | null;
  resolutionCompliance: number | null;
  avgFirstResponseMinutes: number | null;
  avgResolutionMinutes: number | null;
};

function computeSupportMetrics(tickets: Ticket[]): SupportMetrics {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((ticket) => ticket.status !== "closed").length;

  const responseTracked = tickets.filter((ticket) =>
    typeof ticket.first_response_sla_delta_minutes === "number"
  );
  const responseMet = responseTracked.filter(
    (ticket) => (ticket.first_response_sla_delta_minutes ?? 0) <= 0,
  );
  const resolutionTracked = tickets.filter((ticket) =>
    typeof ticket.resolution_sla_delta_minutes === "number"
  );
  const resolutionMet = resolutionTracked.filter(
    (ticket) => (ticket.resolution_sla_delta_minutes ?? 0) <= 0,
  );

  const responseCompliance = responseTracked.length
    ? (responseMet.length / responseTracked.length) * 100
    : null;
  const resolutionCompliance = resolutionTracked.length
    ? (resolutionMet.length / resolutionTracked.length) * 100
    : null;

  const avgFirstResponseMinutes = averageMinutes(
    tickets
      .map((ticket) => ticket.first_response_minutes ?? null)
      .filter((value): value is number => typeof value === "number" && value > 0),
  );
  const avgResolutionMinutes = averageMinutes(
    tickets
      .map((ticket) => ticket.resolution_minutes ?? null)
      .filter((value): value is number => typeof value === "number" && value > 0),
  );

  return {
    totalTickets,
    openTickets,
    responseCompliance,
    resolutionCompliance,
    avgFirstResponseMinutes,
    avgResolutionMinutes,
  };
}

function averageMinutes(values: number[]) {
  if (!values.length) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

type BacklogSummary = {
  statuses: BacklogItem[];
  priorities: BacklogItem[];
};

function buildBacklogSummaries(tickets: Ticket[]): BacklogSummary {
  const statusCounts = new Map<string, number>();
  const priorityCounts = new Map<string, number>();

  for (const ticket of tickets) {
    if (ticket.status !== "closed") {
      statusCounts.set(ticket.status, (statusCounts.get(ticket.status) ?? 0) + 1);
    }
    priorityCounts.set(ticket.priority, (priorityCounts.get(ticket.priority) ?? 0) + 1);
  }

  const statuses: BacklogItem[] = Array.from(statusCounts.entries())
    .map(([status, value]) => ({
      label: formatTicketStatus(status as Ticket["status"]),
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const priorities: BacklogItem[] = Array.from(priorityCounts.entries())
    .map(([priority, value]) => ({
      label: formatTicketPriority(priority as Ticket["priority"]),
      value,
    }))
    .sort((a, b) => b.value - a.value);

  return { statuses, priorities };
}

type AgentMetric = {
  agentId: number;
  totalTickets: number;
  openTickets: number;
  avgFirstResponseMinutes: number | null;
  avgResolutionMinutes: number | null;
};

function computeAgentMetrics(tickets: Ticket[]): AgentMetric[] {
  const byAgent = new Map<number, Ticket[]>();

  for (const ticket of tickets) {
    if (typeof ticket.agent_id !== "number") continue;
    if (!byAgent.has(ticket.agent_id)) {
      byAgent.set(ticket.agent_id, []);
    }
    byAgent.get(ticket.agent_id)?.push(ticket);
  }

  const agents: AgentMetric[] = Array.from(byAgent.entries()).map(([agentId, agentTickets]) => {
    return {
      agentId,
      totalTickets: agentTickets.length,
      openTickets: agentTickets.filter((ticket) => ticket.status !== "closed").length,
      avgFirstResponseMinutes: averageMinutes(
        agentTickets
          .map((ticket) => ticket.first_response_minutes ?? null)
          .filter((value): value is number => typeof value === "number" && value > 0),
      ),
      avgResolutionMinutes: averageMinutes(
        agentTickets
          .map((ticket) => ticket.resolution_minutes ?? null)
          .filter((value): value is number => typeof value === "number" && value > 0),
      ),
    };
  });

  agents.sort((a, b) => b.totalTickets - a.totalTickets);

  return agents.slice(0, 5);
}

function formatPercentage(value: number | null) {
  if (value === null) return "Tidak tersedia";
  return `${Math.round(value)}%`;
}

function formatMinutes(value: number | null) {
  if (!value) return "-";
  if (value < 60) {
    return `${Math.round(value)} menit`;
  }
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} hari ${remainingHours} jam ${minutes} menit`;
  }
  return `${hours} jam ${minutes} menit`;
}

function formatTicketStatus(status: Ticket["status"]) {
  switch (status) {
    case "open":
      return "open";
    case "in_progress":
      return "dalam proses";
    case "pending":
      return "menunggu";
    case "closed":
      return "selesai";
    default:
      return status;
  }
}

function formatTicketPriority(priority: Ticket["priority"]) {
  switch (priority) {
    case "low":
      return "rendah";
    case "medium":
      return "sedang";
    case "high":
      return "tinggi";
    default:
      return priority;
  }
}

function formatReplyTimestamp(value: string) {
  try {
    const parsed = parseISO(value);
    const absolute = format(parsed, "d MMM yyyy HH:mm", { locale: localeId });
    const relative = formatDistanceToNow(parsed, { addSuffix: true, locale: localeId });
    return `${absolute} • ${relative}`;
  } catch (_error) {
    return value;
  }
}
