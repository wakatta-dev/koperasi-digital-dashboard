/** @format */

import { describe, expect, it } from "vitest";

import {
  buildReportingQueryString,
  parseReportingQueryState,
} from "./reporting-query-state";

describe("reporting-query-state", () => {
  it("parses reporting query values with pagination and filters", () => {
    const params = new URLSearchParams(
      "preset=custom&start=2026-01-01&end=2026-01-31&branch=main&accountId=1101&search=inv-1&page=2&page_size=30",
    );

    const parsed = parseReportingQueryState(params, {
      preset: "today",
      page: 1,
      page_size: 20,
    });

    expect(parsed).toEqual({
      preset: "custom",
      start: "2026-01-01",
      end: "2026-01-31",
      branch: "main",
      accountId: "1101",
      search: "inv-1",
      page: 2,
      page_size: 30,
    });
  });

  it("falls back to defaults when page values are invalid", () => {
    const params = new URLSearchParams("page=abc&page_size=-1");

    const parsed = parseReportingQueryState(params, {
      preset: "today",
      page: 1,
      page_size: 20,
    });

    expect(parsed.preset).toBe("today");
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
  });

  it("builds query string without empty values", () => {
    const query = buildReportingQueryString({
      preset: "today",
      start: "",
      end: "",
      branch: undefined,
      accountId: "",
      search: " ",
      page: 1,
      page_size: 20,
    });

    expect(query).toBe("preset=today&page=1&page_size=20");
  });
});
