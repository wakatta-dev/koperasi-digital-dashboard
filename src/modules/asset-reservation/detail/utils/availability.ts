/** @format */

import { checkAvailability as checkAvailabilityApi } from "@/services/api/reservations";
import type { AvailabilityCheckResult } from "../../types";

type DateRange = {
  start: string; // ISO date
  end: string; // ISO date
  assetId: number;
};

export async function checkAvailability(request: DateRange): Promise<AvailabilityCheckResult> {
  const res = await checkAvailabilityApi({
    asset_id: request.assetId,
    start_date: request.start,
    end_date: request.end,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Gagal memeriksa ketersediaan");
  }
  const { ok, conflicts, suggestion } = res.data;
  return {
    ok,
    conflicts: conflicts?.map((c) => ({ start: c.start_date, end: c.end_date, type: c.type })),
    suggestion: suggestion ? { start: suggestion.start_date, end: suggestion.end_date } : undefined,
  };
}
