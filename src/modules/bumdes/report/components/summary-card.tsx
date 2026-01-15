/** @format */

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SummaryCardProps = {
  title: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeColor: string;
  className?: string;
  iconWrapperClassName?: string;
  deltaClassName?: string;
};

export function SummaryCard({
  title,
  value,
  delta,
  icon: Icon,
  badgeBg,
  badgeColor,
  className,
  iconWrapperClassName,
  deltaClassName,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col justify-between h-40",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={cn("p-2 rounded-lg", badgeBg, badgeColor, iconWrapperClassName)}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-auto">
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full inline-flex",
            badgeBg,
            badgeColor,
            deltaClassName
          )}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}
