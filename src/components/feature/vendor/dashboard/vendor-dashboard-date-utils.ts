/** @format */

"use client";

import type { DateRange } from "react-day-picker";

export type VendorDashboardResolvedRanges = {
  current: { start: Date; end: Date };
  previous: { start: Date; end: Date };
};

export function resolveDashboardDateRanges(
  range: DateRange | null,
): VendorDashboardResolvedRanges {
  const today = new Date();
  const start = range?.from ? new Date(range.from) : undefined;
  const end = range?.to ? new Date(range.to) : range?.from ? new Date(range.from) : today;

  const normalizedEnd = normalizeEndOfDay(end);
  const normalizedStart = normalizeStartOfDay(start ?? subtractDays(normalizedEnd, 29));

  if (normalizedStart > normalizedEnd) {
    return resolveDashboardDateRanges({ from: normalizedEnd, to: normalizedStart });
  }

  const durationMs = normalizedEnd.getTime() - normalizedStart.getTime();
  const previousEnd = normalizeEndOfDay(new Date(normalizedStart.getTime() - 1));
  const previousStart = normalizeStartOfDay(
    new Date(previousEnd.getTime() - durationMs),
  );

  return {
    current: { start: normalizedStart, end: normalizedEnd },
    previous: { start: previousStart, end: previousEnd },
  };
}

export function buildRangeCacheKey(range: VendorDashboardResolvedRanges) {
  return [
    range.current.start.toISOString(),
    range.current.end.toISOString(),
    range.previous.start.toISOString(),
    range.previous.end.toISOString(),
  ].join("|");
}

export function isDateWithinRange(date: Date | string | number, start: Date, end: Date) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return false;
  return value.getTime() >= start.getTime() && value.getTime() <= end.getTime();
}

export function intervalOverlapsRange(
  intervalStart: Date | string | number | null | undefined,
  intervalEnd: Date | string | number | null | undefined,
  rangeStart: Date,
  rangeEnd: Date,
) {
  const start = intervalStart ? new Date(intervalStart) : null;
  const end = intervalEnd ? new Date(intervalEnd) : null;

  if (start && Number.isNaN(start.getTime())) return false;
  if (end && Number.isNaN(end.getTime())) return false;

  const effectiveStart = start ?? new Date(0);
  const effectiveEnd = end ?? new Date("9999-12-31T23:59:59.999Z");

  return (
    effectiveStart.getTime() <= rangeEnd.getTime() &&
    effectiveEnd.getTime() >= rangeStart.getTime()
  );
}

function normalizeStartOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function normalizeEndOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function subtractDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() - days);
  return next;
}
