/** @format */

import type { ReactNode } from "react";

import { Input } from "@/components/shared/inputs/input";
import { cn } from "@/lib/utils";

type FilterToolbarProps = {
  query?: string;
  onQueryChange?: (query: string) => void;
  queryPlaceholder?: string;
  startSlot?: ReactNode;
  endSlot?: ReactNode;
  className?: string;
};

export function FilterToolbar({
  query,
  onQueryChange,
  queryPlaceholder = "Cari...",
  startSlot,
  endSlot,
  className,
}: FilterToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-3 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {startSlot}
        <Input
          value={query ?? ""}
          onChange={(event) => onQueryChange?.(event.currentTarget.value)}
          placeholder={queryPlaceholder}
          className="w-full md:max-w-sm"
          aria-label="Filter pencarian"
        />
      </div>
      {endSlot ? <div className="flex items-center gap-2">{endSlot}</div> : null}
    </div>
  );
}
