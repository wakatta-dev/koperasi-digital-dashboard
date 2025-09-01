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
import { Users, Package, FileText, Ticket, TrendingUp, DollarSign, BellIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useVendorDashboard } from "@/hooks/queries/vendor";

export default function VendorDashboard() {
  const { data: dashboard } = useVendorDashboard();

  const stats = [
    {
      title: "Total Clients",
      value: String(dashboard?.tenants_total ?? 0),
      change: "",
      trend: "up" as const,
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Active Subscriptions",
      value: String(dashboard?.active_subscriptions ?? 0),
      change: "",
      trend: "up" as const,
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Overdue Invoices",
      value: String(dashboard?.overdue_invoices ?? 0),
      change: "",
      trend: "down" as const,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Revenue (est.)",
      value: (dashboard as any)?.total_revenue ? `Rp ${(dashboard as any).total_revenue}` : "-",
      change: "",
      trend: "up" as const,
      icon: <DollarSign className="h-4 w-4" />,
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
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className={`h-3 w-3 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                    <span>from last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity (placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates from your clients</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {["completed", "pending", "processing"].map((status, index, arr) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.3 }}
                  className={`flex items-start gap-4 px-6 py-4 ${index !== arr.length - 1 ? "border-b" : ""}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <BellIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">Activity</p>
                    <p className="text-sm text-muted-foreground">Recent update: {status}</p>
                  </div>
                  <div>
                    <Badge variant={status === "completed" ? "default" : status === "pending" ? "secondary" : "outline"}>{status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { href: "/vendor/plans", icon: <Package className="h-6 w-6 mb-2" />, title: "Add Plan", desc: "Create new plan" },
                { href: "/vendor/invoices", icon: <FileText className="h-6 w-6 mb-2" />, title: "Invoices", desc: "Manage invoices" },
                { href: "/vendor/clients", icon: <Users className="h-6 w-6 mb-2" />, title: "Clients", desc: "Manage tenants" },
                { href: "/vendor/tickets", icon: <Ticket className="h-6 w-6 mb-2" />, title: "Support", desc: "Support tickets" },
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
    </div>
  );
}
