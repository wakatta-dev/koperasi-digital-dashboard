/** @format */

import type {
  TaxEfakturFilterValue,
  TaxExportHistoryFilterValue,
  TaxPphFilterValue,
  TaxPpnFilterValue,
  TaxSummaryFilterValue,
} from "../types/tax";

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

export type TaxPphQueryState = {
  filters: TaxPphFilterValue;
  page: number;
  perPage: number;
};

export function parseTaxPphQueryState(
  searchParams: SearchParamReader,
  defaults: TaxPphQueryState,
): TaxPphQueryState {
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const perPage = Number.parseInt(searchParams.get("per_page") ?? "", 10);
  const typeRaw = searchParams.get("type");

  return {
    filters: {
      q: searchParams.get("q") ?? defaults.filters.q,
      period: searchParams.get("period") ?? defaults.filters.period,
      type:
        typeRaw && ["All Types", "PPh21", "PPh23", "PPh4_2", "PPhFinal"].includes(typeRaw)
          ? (typeRaw as TaxPphFilterValue["type"])
          : defaults.filters.type,
    },
    page: Number.isFinite(page) && page > 0 ? page : defaults.page,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : defaults.perPage,
  };
}

export function buildTaxPphQueryString(state: TaxPphQueryState) {
  const params = new URLSearchParams();

  if (state.filters.q.trim()) {
    params.set("q", state.filters.q.trim());
  }
  if (state.filters.period && state.filters.period !== "All Periods") {
    params.set("period", state.filters.period);
  }
  if (state.filters.type !== "All Types") {
    params.set("type", state.filters.type);
  }
  params.set("page", String(state.page));
  params.set("per_page", String(state.perPage));

  return params.toString();
}

export type TaxExportHistoryQueryState = {
  filters: TaxExportHistoryFilterValue;
  page: number;
  perPage: number;
};

export function parseTaxExportHistoryQueryState(
  searchParams: SearchParamReader,
  defaults: TaxExportHistoryQueryState,
): TaxExportHistoryQueryState {
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const perPage = Number.parseInt(searchParams.get("per_page") ?? "", 10);
  const typeRaw = searchParams.get("type");
  const statusRaw = searchParams.get("status");

  return {
    filters: {
      q: searchParams.get("q") ?? defaults.filters.q,
      type:
        typeRaw &&
        ["all", "EFaktur", "PPhReport", "PPNSummary", "TaxRecapitulation"].includes(typeRaw)
          ? (typeRaw as TaxExportHistoryFilterValue["type"])
          : defaults.filters.type,
      status:
        statusRaw &&
        ["all", "Queued", "Processing", "Success", "Failed"].includes(statusRaw)
          ? (statusRaw as TaxExportHistoryFilterValue["status"])
          : defaults.filters.status,
    },
    page: Number.isFinite(page) && page > 0 ? page : defaults.page,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : defaults.perPage,
  };
}

export function buildTaxExportHistoryQueryString(state: TaxExportHistoryQueryState) {
  const params = new URLSearchParams();

  if (state.filters.q.trim()) {
    params.set("q", state.filters.q.trim());
  }
  if (state.filters.type !== "all") {
    params.set("type", state.filters.type);
  }
  if (state.filters.status !== "all") {
    params.set("status", state.filters.status);
  }
  params.set("page", String(state.page));
  params.set("per_page", String(state.perPage));

  return params.toString();
}

export type TaxEfakturQueryState = {
  filters: TaxEfakturFilterValue;
  page: number;
  perPage: number;
};

export function parseTaxEfakturQueryState(
  searchParams: SearchParamReader,
  defaults: TaxEfakturQueryState,
): TaxEfakturQueryState {
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const perPage = Number.parseInt(searchParams.get("per_page") ?? "", 10);

  return {
    filters: {
      date_range: searchParams.get("date_range") ?? defaults.filters.date_range,
      tax_type: searchParams.get("tax_type") ?? defaults.filters.tax_type,
      status: searchParams.get("status") ?? defaults.filters.status,
    },
    page: Number.isFinite(page) && page > 0 ? page : defaults.page,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : defaults.perPage,
  };
}

export function buildTaxEfakturQueryString(state: TaxEfakturQueryState) {
  const params = new URLSearchParams();

  if (state.filters.date_range.trim()) {
    params.set("date_range", state.filters.date_range.trim());
  }
  if (state.filters.tax_type.trim()) {
    params.set("tax_type", state.filters.tax_type.trim());
  }
  if (state.filters.status.trim()) {
    params.set("status", state.filters.status.trim());
  }
  params.set("page", String(state.page));
  params.set("per_page", String(state.perPage));

  return params.toString();
}
