/** @format */

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type OptionTileProps = {
  title: string;
  subtitle?: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  rightSlot?: ReactNode;
  testId?: string;
};

export function OptionTile({
  title,
  subtitle,
  value,
  selected,
  onSelect,
  rightSlot,
  testId,
}: OptionTileProps) {
  return (
    <Button
      data-testid={testId}
      type="button"
      variant="outline"
      onClick={() => onSelect(value)}
      className={`h-auto w-full items-center justify-between rounded-xl border p-3 text-left transition ${
        selected
          ? "border-indigo-600 bg-indigo-50/60"
          : "border-border bg-card hover:border-indigo-300"
      }`}
      aria-pressed={selected}
    >
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-foreground">{title}</p>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {rightSlot}
    </Button>
  );
}
