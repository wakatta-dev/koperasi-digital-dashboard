/** @format */

type DateRange = {
  start: string; // ISO date
  end: string; // ISO date
  type?: "booking" | "maintenance";
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

export function checkAvailability(request: DateRange) {
  const conflicts = BLOCKED_RANGES.filter((r) => overlap(request, r));
  if (conflicts.length === 0) return { ok: true as const };

  const latestEnd = conflicts.reduce((max, r) => Math.max(max, toTs(r.end)), 0);
  const nextStart = new Date(latestEnd + 24 * 60 * 60 * 1000);
  const nextEnd = new Date(nextStart.getTime() + (toTs(request.end) - toTs(request.start)));

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  return {
    ok: false as const,
    conflicts,
    suggestion: { start: fmt(nextStart), end: fmt(nextEnd) },
  };
}

export function getBlockedRanges() {
  return BLOCKED_RANGES;
}
