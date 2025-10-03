/** @format */
"use client";

import { useMemo, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, Ticket, InfoIcon, Target, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useVendorDashboard } from "@/hooks/queries/vendor";
import type { VendorProductTierSummary } from "@/types/api";

function formatTierLabel(tier: string) {
  return tier
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export default function VendorDashboard() {
  const { data: dashboard } = useVendorDashboard();

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat("id-ID"),
    []
  );

  const tiers = useMemo(
    () =>
      (dashboard?.client_totals_by_tier ?? []) as VendorProductTierSummary[],
    [dashboard?.client_totals_by_tier]
  );
  const totalClients = useMemo(
    () => tiers.reduce((acc, tier) => acc + (tier?.active_clients ?? 0), 0),
    [tiers]
  );

  const stats = useMemo(() => {
    const base = [
      {
        key: "total-clients",
        title: "Total Active Clients",
        value: numberFormatter.format(totalClients),
        icon: <Users className="h-4 w-4" />,
      },
      {
        key: "open-tickets",
        title: "Open Tickets",
        value: numberFormatter.format(dashboard?.open_tickets ?? 0),
        icon: <Ticket className="h-4 w-4" />,
      },
    ];

    const tierCards = tiers.map((tier) => ({
      key: `tier-${tier.tier}`,
      title: `${formatTierLabel(tier.tier)} Clients`,
      value: numberFormatter.format(tier.active_clients ?? 0),
      icon: <Package className="h-4 w-4" />,
    }));

    return [...base, ...tierCards];
  }, [dashboard?.open_tickets, numberFormatter, tiers, totalClients]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Insights</CardTitle>
            <CardDescription>Ticket trends and topline client signals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Open Tickets</p>
                <p className="text-sm text-muted-foreground">
                  Outstanding support issues across clients
                </p>
              </div>
              <Badge variant="outline" className="text-base font-semibold">
                {numberFormatter.format(dashboard?.open_tickets ?? 0)}
              </Badge>
            </div>

            <div className="space-y-3">
              <InsightRow
                icon={<InfoIcon className="h-5 w-5 text-muted-foreground" />}
                title="Most Active Client"
                description={dashboard?.most_active_client?.name ?? "No recent client activity"}
                metric={dashboard?.most_active_client?.ticket_count}
                metricLabel="tickets"
              />
              <InsightRow
                icon={<Target className="h-5 w-5 text-muted-foreground" />}
                title="Product With Most Tickets"
                description={
                  dashboard?.product_with_most_tickets?.name ?? "No product alerts"
                }
                metric={dashboard?.product_with_most_tickets?.ticket_count}
                metricLabel="tickets"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Client Distribution</p>
              <div className="space-y-2">
                {tiers.length ? (
                  tiers.map((tier) => (
                    <div
                      key={tier.tier}
                      className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm"
                    >
                      <span>{formatTierLabel(tier.tier)}</span>
                      <span className="font-medium">
                        {numberFormatter.format(tier.active_clients ?? 0)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No client tier data available.
                  </p>
                )}
              </div>
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
    </div>
  );
}

function InsightRow({
  icon,
  title,
  description,
  metric,
  metricLabel,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  metric?: number;
  metricLabel?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {typeof metric === "number" && (
        <Badge variant="secondary" className="text-xs">
          {metricLabel ? `${metric} ${metricLabel}` : metric}
        </Badge>
      )}
    </div>
  );
}
