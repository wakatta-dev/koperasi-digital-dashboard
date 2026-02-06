/** @format */

import { isValid, parseISO } from "date-fns";

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function fromDateOnly(value: string): Date | undefined {
  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return undefined;
  }
  const localDate = new Date(year, month - 1, day);
  return isValid(localDate) ? localDate : undefined;
}

export function parseDateInput(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  if (DATE_ONLY_REGEX.test(value)) {
    return fromDateOnly(value);
  }
  const parsed = new Date(value);
  return isValid(parsed) ? parsed : undefined;
}

export function parseDateTimeInput(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  const parsedISO = parseISO(value);
  if (isValid(parsedISO)) return parsedISO;
  const parsed = new Date(value);
  return isValid(parsed) ? parsed : undefined;
}

export function toDayBounds(value?: string | Date | null): {
  startMs?: number;
  endMs?: number;
} {
  const parsed = parseDateInput(value);
  if (!parsed) return {};
  const start = new Date(parsed);
  start.setHours(0, 0, 0, 0);
  const end = new Date(parsed);
  end.setHours(23, 59, 59, 999);
  return {
    startMs: start.getTime(),
    endMs: end.getTime(),
  };
}

export function formatDateTime(value?: string) {
  try {
    const d = parseDateTimeInput(value);
    if (!d) return "-";
    return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "-";
  }
}
