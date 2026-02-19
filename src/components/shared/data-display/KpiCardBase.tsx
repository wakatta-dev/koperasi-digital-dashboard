/** @format */

import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type KpiTrend = {
  direction: "up" | "down" | "neutral";
  label?: string;
};

export type KpiTone =
  | "neutral"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type KpiItem = {
  id: string;
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: KpiTrend;
  footer?: ReactNode;
  tone?: KpiTone;
  showAccent?: boolean;
  accentClassName?: string;
  iconContainerClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  contentClassName?: string;
};

type KpiCardBaseProps = {
  item: KpiItem;
  className?: string;
  trendSlot?: (trend: KpiTrend | undefined) => ReactNode;
};

function toneStyles(tone: KpiTone) {
  switch (tone) {
    case "primary":
      return {
        card: "border-indigo-200 dark:border-indigo-900/50",
        label: "text-indigo-700 dark:text-indigo-300",
        value: "text-indigo-700 dark:text-indigo-300",
        icon: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
        accent: "bg-indigo-500",
      };
    case "info":
      return {
        card: "border-blue-200 dark:border-blue-900/50",
        label: "text-blue-700 dark:text-blue-300",
        value: "text-blue-700 dark:text-blue-300",
        icon: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        accent: "bg-blue-500",
      };
    case "success":
      return {
        card: "border-emerald-200 dark:border-emerald-900/50",
        label: "text-emerald-700 dark:text-emerald-300",
        value: "text-emerald-700 dark:text-emerald-300",
        icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        accent: "bg-emerald-500",
      };
    case "warning":
      return {
        card: "border-orange-200 dark:border-orange-900/50",
        label: "text-orange-700 dark:text-orange-300",
        value: "text-orange-600 dark:text-orange-400",
        icon: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
        accent: "bg-orange-500",
      };
    case "danger":
      return {
        card: "border-red-200 dark:border-red-900/50",
        label: "text-red-700 dark:text-red-300",
        value: "text-red-600 dark:text-red-400",
        icon: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
        accent: "bg-red-500",
      };
    default:
      return {
        card: "border-gray-200 dark:border-gray-700",
        label: "text-gray-500 dark:text-gray-400",
        value: "text-gray-900 dark:text-white",
        icon: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
        accent: "bg-gray-400",
      };
  }
}

export function KpiCardBase({ item, className, trendSlot }: KpiCardBaseProps) {
  const direction = item.trend?.direction;
  const trendLabel = item.trend?.label;
  const styles = toneStyles(item.tone ?? "neutral");

  const trendColor =
    direction === "down"
      ? "text-red-500"
      : direction === "up"
      ? "text-emerald-600"
      : "text-muted-foreground";

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl bg-white shadow-sm transition-colors dark:bg-slate-900",
        styles.card,
        className,
      )}
    >
      {item.showAccent ? (
        <div
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-1",
            item.accentClassName ?? styles.accent,
          )}
        />
      ) : null}

      <CardContent
        className={cn(
          "px-4 py-3",
          item.showAccent ? "pl-4" : null,
          item.contentClassName,
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                "text-xs font-semibold tracking-wide",
                styles.label,
                item.labelClassName,
              )}
            >
              {item.label}
            </p>
            <div
              className={cn(
                "mt-0.5 text-xl font-bold leading-tight",
                styles.value,
                item.valueClassName,
              )}
            >
              {item.value}
            </div>

            {trendSlot
              ? trendSlot(item.trend)
              : trendLabel && (
                  <span
                    className={cn("mt-1.5 inline-block text-xs font-medium", trendColor)}
                  >
                    {trendLabel}
                  </span>
                )}
          </div>

          {item.icon ? (
            <div
              className={cn(
                item.iconContainerClassName
                  ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  : "shrink-0",
                item.iconContainerClassName ?? styles.icon,
              )}
            >
              {item.icon}
            </div>
          ) : null}
        </div>

        {item.footer ? (
          <div className="mt-3 border-t border-gray-100 pt-2 dark:border-gray-700">
            {item.footer}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
