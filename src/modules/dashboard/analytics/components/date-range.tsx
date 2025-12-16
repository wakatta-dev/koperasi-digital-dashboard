/** @format */

"use client";

import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { AnalyticsRange } from "@/types/api";

type Props = {
  value: AnalyticsRange;
  onChange: (value: AnalyticsRange) => void;
  onRefresh?: () => void;
};

const options: { value: AnalyticsRange; label: string }[] = [
  { value: "today", label: "Hari ini" },
  { value: "7d", label: "7 hari" },
  { value: "30d", label: "30 hari" },
  { value: "custom", label: "Kustom" },
];

export function DateRangeSelector({ value, onChange, onRefresh }: Props) {
  const label = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "Pilih rentang",
    [value],
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        data-testid="range-native"
        value={value}
        onChange={(e) => onChange(e.target.value as AnalyticsRange)}
        className="sr-only"
        aria-hidden="true"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Select value={value} onValueChange={(val) => onChange(val as AnalyticsRange)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Rentang waktu" aria-label={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {onRefresh ? (
        <Button variant="outline" size="sm" onClick={onRefresh}>
          Muat ulang
        </Button>
      ) : null}
    </div>
  );
}
