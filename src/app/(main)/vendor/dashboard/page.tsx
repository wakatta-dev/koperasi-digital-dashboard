/** @format */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Ticket,
  TrendingUp,
  DollarSign,
  PauseCircle,
  UserCheck2,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { useVendorDashboard } from "@/hooks/queries/vendor";
import type { VendorDashboardSummary, VendorActivity as VendorActivityType } from "@/types/api";
import React, { useMemo } from "react";

// TODO integrate API: any missing endpoints should be wired here
export default function VendorDashboard() {
  const { data: dashboard } = useVendorDashboard(undefined, {
    refetchInterval: 300000,
  });

  const fmtNumber = (n: number) => new Intl.NumberFormat("id-ID").format(n);
  const fmtIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);
  const summary = dashboard as VendorDashboardSummary | undefined;

  const stats = useMemo(
    () =>
      [
        {
          title: "Klien Aktif",
          value: fmtNumber(Number(summary?.active_clients ?? 0)),
          icon: <UserCheck2 className="h-4 w-4" />,
        },
        {
          title: "Klien Tidak Aktif",
          value: fmtNumber(Number(summary?.inactive_clients ?? 0)),
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: "Klien Suspended",
          value: fmtNumber(Number(summary?.suspended_clients ?? 0)),
          icon: <PauseCircle className="h-4 w-4" />,
        },
        {
          title: "Total Pendapatan",
          value: fmtIDR(Number(summary?.total_revenue ?? 0)),
          icon: <DollarSign className="h-4 w-4" />,
        },
        {
          title: "Pendapatan Bulan Ini",
          value: fmtIDR(Number(summary?.monthly_revenue ?? 0)),
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          title: "Tiket Terbuka",
          value: fmtNumber(Number(summary?.open_tickets ?? 0)),
          icon: <Ticket className="h-4 w-4" />,
        },
      ],
    [summary]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>
            Timeline perubahan plan, pembayaran, dan tiket klien
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(summary?.activity ?? []).map((item: VendorActivityType, index) => (
            <motion.div
              key={`${item.reference_id}-${item.timestamp}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="flex items-start gap-3 border rounded-lg p-3"
            >
              <div className="mt-1">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium capitalize">{item.type}</span>
                  <span className="text-xs text-muted-foreground">
                    #{item.reference_id}
                  </span>
                  {item.status && (
                    <span className="rounded bg-muted px-2 py-0.5 text-xs uppercase tracking-wide">
                      {item.status}
                    </span>
                  )}
                </div>
                <div className="text-sm text-foreground/90">{item.title}</div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {new Date(item.timestamp).toLocaleString("id-ID")}
                  </span>
                  {typeof item.amount === "number" && (
                    <span>{fmtIDR(item.amount)}</span>
                  )}
                  {item.due_date && (
                    <span>Jatuh tempo: {new Date(item.due_date).toLocaleDateString("id-ID")}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {!summary?.activity?.length && (
            <div className="text-sm text-muted-foreground italic">
              Belum ada aktivitas terbaru.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
