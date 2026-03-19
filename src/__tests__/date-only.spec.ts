/** @format */

import { describe, expect, it } from "vitest";

import {
  addLocalDays,
  dateOnlyFromUnixSeconds,
  formatLocalDateOnly,
  inclusiveEndDate,
  parseLocalDateInput,
  todayLocalDateOnly,
} from "@/lib/date-only";

describe("date-only helpers", () => {
  it("formats dates using local calendar fields", () => {
    expect(formatLocalDateOnly(new Date(2026, 2, 19, 23, 30, 0))).toBe(
      "2026-03-19",
    );
  });

  it("adds local days without UTC date drift", () => {
    expect(
      formatLocalDateOnly(addLocalDays(new Date(2026, 2, 19, 8, 0, 0), 1)),
    ).toBe("2026-03-20");
  });

  it("formats unix seconds as local date-only text", () => {
    const value = new Date(2026, 2, 21, 14, 0, 0);
    expect(dateOnlyFromUnixSeconds(Math.floor(value.getTime() / 1000))).toBe(
      "2026-03-21",
    );
  });

  it("returns current local yyyy-mm-dd text", () => {
    expect(todayLocalDateOnly(new Date(2026, 2, 19, 10, 15, 0))).toBe(
      "2026-03-19",
    );
  });

  it("parses date-only strings as local dates", () => {
    expect(formatLocalDateOnly(parseLocalDateInput("2026-03-19")!)).toBe(
      "2026-03-19",
    );
  });

  it("converts exclusive rental end dates to inclusive day labels", () => {
    expect(formatLocalDateOnly(inclusiveEndDate("2026-03-21T07:00:00Z")!)).toBe(
      "2026-03-20",
    );
  });
});
