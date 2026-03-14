/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVendorSupportQueue } from "@/hooks/queries";
import { VendorKpiGrid } from "../VendorKpiGrid";
import { VendorPageHeader } from "../VendorPageHeader";
import { VENDOR_ROUTES } from "../../constants/routes";
import { formatVendorDateTime } from "../../utils/format";

function priorityBadgeClass(priority: string) {
  if (priority === "high") {
    return "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
  }
  if (priority === "medium") {
    return "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  }
  return "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

type VendorTicketRow = {
  id: string | number;
  title: string;
  summary: string;
  category: string;
  reference: string;
  tenant_label: string;
  priority: string;
  status: string;
  age_hours: number;
  occurred_at: string | number;
};

const columns: ColumnDef<VendorTicketRow, unknown>[] = [
  {
    id: "case",
    header: "Case",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.title}</div>
        <div className="max-w-xl whitespace-normal text-xs text-muted-foreground">
          {row.original.summary}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.category} · {row.original.reference}
        </div>
      </div>
    ),
  },
  {
    id: "tenant",
    header: "Tenant",
    cell: ({ row }) => row.original.tenant_label,
  },
  {
    id: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge className={priorityBadgeClass(row.original.priority)}>
        {row.original.priority.toUpperCase()}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={statusBadgeClass(row.original.status)}>
        {row.original.status.toUpperCase()}
      </Badge>
    ),
  },
  {
    id: "age",
    header: "Age",
    cell: ({ row }) => `${row.original.age_hours}h`,
  },
  {
    id: "occurredAt",
    header: "Occurred",
    cell: ({ row }) => formatVendorDateTime(row?.original?.occurred_at),
  },
  {
    id: "detail",
    header: "Detail",
    meta: {
      align: "right",
    },
    cell: ({ row }) => (
      <div className="text-right">
        <Link
          href={VENDOR_ROUTES.ticketDetail(row.original.id)}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View
        </Link>
      </div>
    ),
  },
];

function statusBadgeClass(status: string) {
  if (status === "open") {
    return "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (status === "pending") {
    return "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  }
  return "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export function VendorTicketsPage() {
  const [category, setCategory] = useState("all");
  const queueQuery = useVendorSupportQueue();
  const items = useMemo(
    () => queueQuery.data?.items ?? [],
    [queueQuery.data?.items],
  );
  const filteredItems = useMemo(() => {
    if (category === "all") return items;
    return items.filter((item) => item.category === category);
  }, [category, items]);

  const kpis = useMemo(
    () => [
      {
        id: "support_total_open",
        label: "Open Cases",
        value: queueQuery.data?.analytics.total_open ?? 0,
        helper: "Case turunan dari signal operasional yang butuh follow-up",
      },
      {
        id: "support_high_priority",
        label: "High Priority",
        value: queueQuery.data?.analytics.total_high_priority ?? 0,
        helper: "Prioritas tinggi di queue saat ini",
      },
      {
        id: "support_sla_breach",
        label: "SLA Breach",
        value: queueQuery.data?.analytics.sla_breaches ?? 0,
        helper: "Case yang melewati target working SLA",
      },
      {
        id: "support_billing_cases",
        label: "Billing Cases",
        value: queueQuery.data?.analytics.billing_cases ?? 0,
        helper: "Berasal dari invoice overdue",
      },
    ],
    [queueQuery.data?.analytics],
  );

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Tickets"
        description="Support operations queue berbasis signal nyata yang sudah tersedia sekarang, sambil menunggu endpoint ticket workflow final."
        actions={
          <Link
            href={VENDOR_ROUTES.ticketAnalytics}
            className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
          >
            Lihat Analytics
          </Link>
        }
      />

      <VendorKpiGrid items={kpis} />

      <Card className="border-border/70">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Support Queue</CardTitle>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Category</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="tenant_ops">Tenant Ops</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <TableShell
            columns={columns}
            data={filteredItems}
            getRowId={(row) => String(row.id)}
            loading={queueQuery.isPending}
            loadingState="Memuat support queue..."
            emptyState="Belum ada support case pada filter saat ini."
            surface="bare"
          />
        </CardContent>
      </Card>
    </div>
  );
}
