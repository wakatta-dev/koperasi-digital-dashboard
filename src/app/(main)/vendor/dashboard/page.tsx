/** @format */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  FileText,
  Ticket,
  TrendingUp,
  DollarSign,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { useVendorDashboard } from "@/hooks/queries/vendor";
import { useVendorSubscriptionsSummary } from "@/hooks/queries/billing";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import { useNotifications } from "@/hooks/queries/notifications";
import React from "react";

export default function VendorDashboard() {
  const { data: dashboard } = useVendorDashboard();
  const { data: sum } = useVendorSubscriptionsSummary();
  // const { data: notifications = [] } = useNotifications();

  // Format helpers
  const fmtNumber = (n: number) => new Intl.NumberFormat("id-ID").format(n);
  const fmtIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  // Build stats with guaranteed correct fields
  const stats: Array<{
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.JSX.Element;
  }> = [
    {
      title: "Klien Aktif",
      value: fmtNumber(Number(sum?.active ?? 0)),
      change: "",
      trend: "up",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Total Pendapatan",
      value: fmtIDR(Number(dashboard?.total_revenue ?? 0)),
      change: "",
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Pendapatan Bulan Ini",
      value: fmtIDR(Number(dashboard?.monthly_revenue ?? 0)),
      change: "",
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Tiket Terbuka",
      value: fmtNumber(Number((dashboard as any)?.open_tickets ?? 0)),
      change: "",
      trend: "up",
      icon: <Ticket className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {stat.change && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp
                      className={`h-3 w-3 ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span>from last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Notifications */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates from your clients</CardDescription>
          </CardHeader>
          <CardContent className="p-0 max-h-[300px] overflow-y-auto">
            <div>
              {(dashboard?.recent_notifications || [])
                .slice(0, 5)
                .map((n: any, index: number, arr: any[]) => (
                  <motion.div
                    key={String(n.id ?? index)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`flex items-start gap-4 px-6 py-4 ${
                      index !== arr.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium">
                        {n.title ?? "Notification"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {n.message ?? "-"}
                      </p>
                    </div>
                    <div>
                      <Badge
                        variant={
                          n.status === "published" || n.status === "PUBLISHED"
                            ? "default"
                            : n.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {n.status ?? "-"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              {!dashboard?.recent_notifications?.length && (
                <div className="px-6 py-4 text-sm text-muted-foreground italic">
                  No notifications
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  href: "/vendor/plans",
                  icon: <Package className="h-6 w-6 mb-2" />,
                  title: "Add Plan",
                  desc: "Create new plan",
                },
                {
                  href: "/vendor/invoices",
                  icon: <FileText className="h-6 w-6 mb-2" />,
                  title: "Invoices",
                  desc: "Manage invoices",
                },
                {
                  href: "/vendor/clients",
                  icon: <Users className="h-6 w-6 mb-2" />,
                  title: "Clients",
                  desc: "Manage tenants",
                },
                {
                  href: "/vendor/tickets",
                  icon: <Ticket className="h-6 w-6 mb-2" />,
                  title: "Support",
                  desc: "Support tickets",
                },
              ].map((action, index) => (
                <motion.a
                  key={index}
                  href={action.href}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors block"
                >
                  {action.icon}
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </motion.a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audits */}
      {Array.isArray((dashboard as any)?.recent_audits) && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>
              Perubahan status invoice/subscription terbaru
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {(((dashboard as any)?.recent_audits as any[]) ?? [])
                .slice(0, 5)
                .map((a: any, index: number, arr: any[]) => (
                  <motion.div
                    key={String(a.id ?? index)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`flex items-center gap-4 px-6 py-4 ${
                      index !== arr.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="w-32 text-xs font-medium capitalize text-muted-foreground">
                      {a.entity_type ?? "-"}#{a.entity_id ?? "-"}
                    </div>
                    <div className="flex-1 text-sm">
                      <span className="mr-2 text-muted-foreground">
                        status:
                      </span>
                      <Badge variant="outline">{a.old_status ?? "-"}</Badge>
                      <span className="mx-2">→</span>
                      <Badge variant="default">{a.new_status ?? "-"}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {a.changed_at
                        ? new Date(a.changed_at).toLocaleString("id-ID")
                        : ""}
                    </div>
                  </motion.div>
                ))}
              {(!((dashboard as any)?.recent_audits ?? [])?.length ||
                ((dashboard as any)?.recent_audits ?? []).length === 0) && (
                <div className="px-6 py-4 text-sm text-muted-foreground italic">
                  No audits found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
