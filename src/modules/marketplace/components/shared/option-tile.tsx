/** @format */

import type { ReactNode } from "react";

type OptionTileProps = {
  title: string;
  subtitle?: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  rightSlot?: ReactNode;
};

export function OptionTile({
  title,
  subtitle,
  value,
  selected,
  onSelect,
  rightSlot,
}: OptionTileProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
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
    </button>
  );
}
