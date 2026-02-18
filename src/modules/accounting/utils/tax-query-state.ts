/** @format */

import type { TaxPpnFilterValue, TaxSummaryFilterValue } from "../types/tax";

type SearchParamReader = Pick<URLSearchParams, "get">;

export type TaxSummaryQueryState = {
  filters: TaxSummaryFilterValue;
  page: number;
  perPage: number;
};

export function parseTaxSummaryQueryState(
  searchParams: SearchParamReader,
  defaults: TaxSummaryQueryState,
): TaxSummaryQueryState {
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const perPage = Number.parseInt(searchParams.get("per_page") ?? "", 10);
  const statusRaw = searchParams.get("status");

  return {
    filters: {
      q: searchParams.get("q") ?? defaults.filters.q,
      year: searchParams.get("year") ?? defaults.filters.year,
      status:
        statusRaw && ["all", "Open", "Reported", "Compensated"].includes(statusRaw)
          ? (statusRaw as TaxSummaryFilterValue["status"])
          : defaults.filters.status,
    },
    page: Number.isFinite(page) && page > 0 ? page : defaults.page,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : defaults.perPage,
  };
}

export function buildTaxSummaryQueryString(state: TaxSummaryQueryState) {
  const params = new URLSearchParams();

  if (state.filters.q.trim()) {
    params.set("q", state.filters.q.trim());
  }
  if (state.filters.year && state.filters.year !== "All Years") {
    params.set("year", state.filters.year);
  }
  if (state.filters.status !== "all") {
    params.set("status", state.filters.status);
  }
  params.set("page", String(state.page));
  params.set("per_page", String(state.perPage));

  return params.toString();
}

export type TaxPpnQueryState = {
  filters: TaxPpnFilterValue;
  page: number;
  perPage: number;
};

export function parseTaxPpnQueryState(
  searchParams: SearchParamReader,
  defaults: TaxPpnQueryState,
): TaxPpnQueryState {
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const perPage = Number.parseInt(searchParams.get("per_page") ?? "", 10);
  const txType = searchParams.get("transaction_type");

  return {
    filters: {
      q: searchParams.get("q") ?? defaults.filters.q,
      period: searchParams.get("period") ?? defaults.filters.period,
      transaction_type:
        txType && ["All Types", "Sales", "Purchase"].includes(txType)
          ? (txType as TaxPpnFilterValue["transaction_type"])
          : defaults.filters.transaction_type,
    },
    page: Number.isFinite(page) && page > 0 ? page : defaults.page,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : defaults.perPage,
  };
}

export function buildTaxPpnQueryString(state: TaxPpnQueryState) {
  const params = new URLSearchParams();

  if (state.filters.q.trim()) {
    params.set("q", state.filters.q.trim());
  }
  if (state.filters.period && state.filters.period !== "All Periods") {
    params.set("period", state.filters.period);
  }
  if (state.filters.transaction_type !== "All Types") {
    params.set("transaction_type", state.filters.transaction_type);
  }
  params.set("page", String(state.page));
  params.set("per_page", String(state.perPage));

  return params.toString();
}
