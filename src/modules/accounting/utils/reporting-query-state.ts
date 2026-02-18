/** @format */

import type { ReportingQueryState } from "../types/reporting";

type SearchParamReader = Pick<URLSearchParams, "get">;

export function parseReportingQueryState(
  searchParams: SearchParamReader,
  defaults: ReportingQueryState = {},
): ReportingQueryState {
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const pageSize = Number.parseInt(searchParams.get("page_size") ?? "", 10);

  return {
    preset: searchParams.get("preset") ?? defaults.preset,
    start: searchParams.get("start") ?? defaults.start,
    end: searchParams.get("end") ?? defaults.end,
    branch: searchParams.get("branch") ?? defaults.branch,
    accountId: searchParams.get("accountId") ?? defaults.accountId,
    search: searchParams.get("search") ?? defaults.search,
    page: Number.isFinite(page) && page > 0 ? page : defaults.page,
    page_size: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : defaults.page_size,
  };
}

export function buildReportingQueryString(state: ReportingQueryState) {
  const params = new URLSearchParams();

  if (state.preset?.trim()) params.set("preset", state.preset.trim());
  if (state.start?.trim()) params.set("start", state.start.trim());
  if (state.end?.trim()) params.set("end", state.end.trim());
  if (state.branch?.trim()) params.set("branch", state.branch.trim());
  if (state.accountId?.trim()) params.set("accountId", state.accountId.trim());
  if (state.search?.trim()) params.set("search", state.search.trim());
  if (state.page && state.page > 0) params.set("page", String(state.page));
  if (state.page_size && state.page_size > 0) params.set("page_size", String(state.page_size));

  return params.toString();
}

export function mergeReportingQueryState(
  current: ReportingQueryState,
  partial: Partial<ReportingQueryState>,
): ReportingQueryState {
  return {
    ...current,
    ...partial,
  };
}
