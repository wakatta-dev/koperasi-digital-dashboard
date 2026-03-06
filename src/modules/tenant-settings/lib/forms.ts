/** @format */

export function isDeepEqual<T>(left: T, right: T): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function parseNumberInput(value: string, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return parsed;
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function fromDateInputValue(value: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

export function rfc3339ToDateInput(value?: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return toDateInputValue(date);
}

