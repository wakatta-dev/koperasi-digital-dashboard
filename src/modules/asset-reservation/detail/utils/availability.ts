/** @format */

import { checkAvailability as checkAvailabilityApi } from "@/services/api/reservations";
import type { AvailabilityCheckResult } from "../../types";

type DateRange = {
  start: string; // ISO date
  end: string; // ISO date
  type?: "booking" | "maintenance";
  assetId?: string;
};

const BLOCKED_RANGES: DateRange[] = [
  { start: "2024-10-03", end: "2024-10-04", type: "booking" },
  { start: "2024-10-09", end: "2024-10-10", type: "booking" },
  { start: "2024-10-01", end: "2024-10-02", type: "maintenance" },
];

const toTs = (date: string) => new Date(date + "T00:00:00Z").getTime();

function overlap(a: DateRange, b: DateRange) {
  return !(toTs(a.end) < toTs(b.start) || toTs(a.start) > toTs(b.end));
}

export async function checkAvailability(request: DateRange): Promise<AvailabilityCheckResult> {
  try {
    const res = await checkAvailabilityApi({
      asset_id: request.assetId ?? "asset-id",
      start_date: request.start,
      end_date: request.end,
    });
    if (res.success && res.data) {
      const { ok, conflicts, suggestion } = res.data;
      return {
        ok,
        conflicts: conflicts?.map((c) => ({ start: c.start_date, end: c.end_date, type: c.type })),
        suggestion: suggestion
          ? { start: suggestion.start_date, end: suggestion.end_date }
          : undefined,
      };
    }
  } catch (err) {
    console.warn("availability check failed, falling back to local ranges:", err);
  }

  const conflicts = BLOCKED_RANGES.filter((r) => overlap(request, r));
  if (conflicts.length === 0) return { ok: true };

  const latestEnd = conflicts.reduce((max, r) => Math.max(max, toTs(r.end)), 0);
  const nextStart = new Date(latestEnd + 24 * 60 * 60 * 1000);
  const nextEnd = new Date(nextStart.getTime() + (toTs(request.end) - toTs(request.start)));

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  return {
    ok: false,
    conflicts,
    suggestion: { start: fmt(nextStart), end: fmt(nextEnd) },
  };
}

export function getBlockedRanges() {
  return BLOCKED_RANGES;
}
