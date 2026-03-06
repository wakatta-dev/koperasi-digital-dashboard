/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VendorDashboardKpi } from "@/types/api";

type VendorKpiGridProps = {
  items: VendorDashboardKpi[];
};

export function VendorKpiGrid({ items }: VendorKpiGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.id} className="border-border/70">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-semibold tracking-tight">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.helper}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
