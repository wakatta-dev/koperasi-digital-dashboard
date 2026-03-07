/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
  const items = useMemo(() => queueQuery.data?.items ?? [], [queueQuery.data?.items]);
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
    [queueQuery.data?.analytics]
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Occurred</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="max-w-xl whitespace-normal text-xs text-muted-foreground">
                        {item.summary}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.category} · {item.reference}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.tenant_label}</TableCell>
                  <TableCell>
                    <Badge className={priorityBadgeClass(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadgeClass(item.status)}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.age_hours}h</TableCell>
                  <TableCell>{formatVendorDateTime(item.occurred_at)}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={VENDOR_ROUTES.ticketDetail(item.id)}
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}

              {!queueQuery.isPending && filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    Belum ada support case pada filter saat ini.
                  </TableCell>
                </TableRow>
              ) : null}

              {queueQuery.isPending ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    Memuat support queue...
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
