/** @format */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FinancePreset, TimeRange } from "../types";
import { cn } from "@/lib/utils";

type Props = {
  value: TimeRange & { label?: string };
  onPresetChange: (preset: FinancePreset) => void;
  onCustomApply: (start: string, end: string) => void;
  onApply?: () => void;
};

const PRESETS: { label: string; value: FinancePreset }[] = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari", value: "7d" },
  { label: "Bulan Ini", value: "month" },
  { label: "Kustom", value: "custom" },
];

export function DateRangeControls({ value, onPresetChange, onCustomApply, onApply }: Props) {
  const [customStart, setCustomStart] = useState<string>(value.start ?? "");
  const [customEnd, setCustomEnd] = useState<string>(value.end ?? "");

  const isCustom = value.preset === "custom";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.value}
            variant={value.preset === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => onPresetChange(preset.value)}
            className={cn("rounded-md", value.preset === preset.value && "shadow-sm")}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      {isCustom ? (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="w-44"
          />
          <span className="text-sm text-muted-foreground">sampai</span>
          <Input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="w-44"
          />
          <Button
            size="sm"
            onClick={() => {
              if (customStart && customEnd) onCustomApply(customStart, customEnd);
              onApply?.();
            }}
          >
            Terapkan
          </Button>
        </div>
      ) : null}
      <div className="text-xs text-muted-foreground">Periode: {value.label}</div>
    </div>
  );
}
