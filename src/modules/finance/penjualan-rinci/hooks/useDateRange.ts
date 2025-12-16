/** @format */

"use client";

import { useMemo, useState } from "react";
import { endOfMonth, formatISO, startOfMonth, subDays } from "date-fns";
import type { FinancePreset, TimeRange } from "../types";

function computeRange(preset: FinancePreset): Pick<TimeRange, "start" | "end" | "preset"> {
  const today = new Date();
  if (preset === "today") {
    const iso = formatISO(today, { representation: "date" });
    return { start: iso, end: iso, preset };
  }
  if (preset === "7d") {
    const end = formatISO(today, { representation: "date" });
    const start = formatISO(subDays(today, 6), { representation: "date" });
    return { start, end, preset };
  }
  if (preset === "month") {
    const start = formatISO(startOfMonth(today), { representation: "date" });
    const end = formatISO(endOfMonth(today), { representation: "date" });
    return { start, end, preset };
  }
  return { preset: "custom" };
}

function labelForRange(range: TimeRange): string {
  if (range.display_label) return range.display_label;
  if (range.preset === "today") return "Hari Ini";
  if (range.preset === "7d") return "7 Hari Terakhir";
  if (range.preset === "month") return "Bulan Ini";
  if (range.start && range.end) return `${range.start} - ${range.end}`;
  return "Pilih rentang tanggal";
}

export function useDateRange(initialPreset: FinancePreset = "month") {
  const [range, setRange] = useState<TimeRange>(() => computeRange(initialPreset));

  const setPreset = (preset: FinancePreset) => {
    setRange(computeRange(preset));
  };

  const setCustomRange = (start: string, end: string) => {
    if (!start || !end) return;
    setRange({
      start,
      end,
      preset: "custom",
      display_label: `${start} - ${end}`,
    });
  };

  const value = useMemo(() => {
    const label = labelForRange(range);
    const queryParams: Record<string, string> = {};
    if (range.preset) queryParams.preset = range.preset;
    if (range.start) queryParams.start = range.start;
    if (range.end) queryParams.end = range.end;
    return {
      ...range,
      label,
      queryParams,
    };
  }, [range]);

  return {
    value,
    setPreset,
    setCustomRange,
  };
}
