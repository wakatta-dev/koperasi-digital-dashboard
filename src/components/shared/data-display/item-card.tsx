/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type ItemCardProps = {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  unit?: string;
  badge?: ReactNode;
  statusChip?: ReactNode;
  onClick?: () => void;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  editable?: boolean;
  className?: string;
};

export function ItemCard({
  image,
  title,
  subtitle,
  description,
  price,
  unit,
  badge,
  statusChip,
  onClick,
  primaryAction,
  secondaryAction,
  editable,
  className,
}: ItemCardProps) {
  const clickable = Boolean(onClick);

  return (
    <Card
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : -1}
      onClick={onClick}
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md",
        clickable && "cursor-pointer",
        className,
      )}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {badge ? (
          <div className="absolute right-3 top-3">{badge}</div>
        ) : null}
        {editable ? (
          <div className="absolute left-3 top-3 text-xs font-medium text-muted-foreground">
            Edit
          </div>
        ) : null}
        {statusChip ? (
          <div className="absolute right-3 bottom-3">{statusChip}</div>
        ) : null}
      </div>
      <CardContent className="p-5 space-y-3">
        {subtitle ? (
          <div className="text-xs font-medium text-muted-foreground">{subtitle}</div>
        ) : null}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          ) : null}
        </div>
        {(price || unit) ? (
          <div className="flex items-baseline gap-1 text-primary font-bold">
            {price}
            {unit ? (
              <span className="text-xs font-normal text-muted-foreground">{unit}</span>
            ) : null}
          </div>
        ) : null}
        {(primaryAction || secondaryAction) ? (
          <div className="pt-3 border-t border-border/70 flex gap-2">
            {primaryAction}
            {secondaryAction}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
