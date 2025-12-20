/** @format */

import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type KpiTrend = {
  direction: "up" | "down" | "neutral";
  label?: string;
};

export type KpiItem = {
  id: string;
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: KpiTrend;
  footer?: ReactNode;
};

type KpiCardBaseProps = {
  item: KpiItem;
  className?: string;
  trendSlot?: (trend: KpiTrend | undefined) => ReactNode;
};

export function KpiCardBase({ item, className, trendSlot }: KpiCardBaseProps) {
  const direction = item.trend?.direction;
  const trendLabel = item.trend?.label;

  const trendColor =
    direction === "down"
      ? "text-red-500"
      : direction === "up"
      ? "text-emerald-600"
      : "text-muted-foreground";

  return (
    <Card className={cn("border border-border/70 shadow-sm bg-card/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold text-foreground">
            {item.label}
          </CardTitle>
          <div className="text-2xl font-bold">{item.value}</div>
          {trendSlot
            ? trendSlot(item.trend)
            : trendLabel && (
                <span className={cn("text-xs font-medium", trendColor)}>
                  {trendLabel}
                </span>
              )}
        </div>
        {item.icon ? <div className="flex h-10 w-10 items-center justify-center">{item.icon}</div> : null}
      </CardHeader>
      <CardContent className="pt-0">
        {item.footer ? item.footer : null}
      </CardContent>
    </Card>
  );
}
