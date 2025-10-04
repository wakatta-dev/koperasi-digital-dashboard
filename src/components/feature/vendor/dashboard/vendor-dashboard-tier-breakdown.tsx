/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useVendorDashboardData } from "./vendor-dashboard-data-provider";

function formatTierLabel(tier: string) {
  return tier
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function VendorDashboardTierBreakdown() {
  const { tiers, isLoading } = useVendorDashboardData();
  const formatter = new Intl.NumberFormat("id-ID");

  return (
    <Card className="flex flex-col self-stretch">
      <CardHeader className="pb-2">
        <CardTitle>Distribusi Klien per Tier</CardTitle>
        <p className="text-sm text-muted-foreground">
          Statistik jumlah klien aktif yang tergabung di masing-masing tier.
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : tiers.length ? (
          <div className="space-y-2">
            {tiers.map((tier) => (
              <div
                key={tier.tier}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span className="font-medium">
                  {formatTierLabel(tier.tier)}
                </span>
                <Badge variant="secondary" className="font-semibold">
                  {formatter.format(tier.active_clients ?? 0)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Data distribusi klien belum tersedia.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
