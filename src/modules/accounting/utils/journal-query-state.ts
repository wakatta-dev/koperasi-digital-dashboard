/** @format */

import type { JournalEntriesFilterValue, JournalEntriesPagination } from "../types/journal";

type SearchParamReader = Pick<URLSearchParams, "get">;

export const JOURNAL_DEFAULT_SORT = "journal_date.desc" as const;

export type JournalListQueryState = {
  filters: JournalEntriesFilterValue;
  pagination: JournalEntriesPagination;
  sort: string;
};

export function parseJournalListQueryState(
  searchParams: SearchParamReader,
  defaults: {
    filters: JournalEntriesFilterValue;
    pagination: JournalEntriesPagination;
    sort: string;
  },
): JournalListQueryState {
  const date = searchParams.get("date") as JournalEntriesFilterValue["date"] | null;
  const type = searchParams.get("type") as JournalEntriesFilterValue["type"] | null;
  const status = searchParams.get("status") as JournalEntriesFilterValue["status"] | null;
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const perPage = Number.parseInt(searchParams.get("per_page") ?? "", 10);

  return {
    filters: {
      q: searchParams.get("q") ?? defaults.filters.q,
      date:
        date &&
        ["all_dates", "this_month", "last_month", "this_year"].includes(date)
          ? date
          : defaults.filters.date,
      type:
        type && ["all_types", "sales", "purchase", "cash", "general"].includes(type)
          ? type
          : defaults.filters.type,
      status:
        status &&
        ["all_status", "draft", "posted", "locked", "reversed"].includes(status)
          ? status
          : defaults.filters.status,
    },
    pagination: {
      page: Number.isFinite(page) && page > 0 ? page : defaults.pagination.page,
      per_page:
        Number.isFinite(perPage) && perPage > 0
          ? perPage
          : defaults.pagination.per_page,
      total_items: defaults.pagination.total_items,
    },
    sort: searchParams.get("sort") ?? defaults.sort,
  };
}

export function buildJournalListQueryString(state: {
  filters: JournalEntriesFilterValue;
  pagination: JournalEntriesPagination;
  sort: string;
}) {
  const params = new URLSearchParams();

  if (state.filters.q.trim()) {
    params.set("q", state.filters.q);
  }
  if (state.filters.date !== "all_dates") {
    params.set("date", state.filters.date);
  }
  if (state.filters.type !== "all_types") {
    params.set("type", state.filters.type);
  }
  if (state.filters.status !== "all_status") {
    params.set("status", state.filters.status);
  }
  params.set("sort", state.sort || JOURNAL_DEFAULT_SORT);
  params.set("page", String(state.pagination.page));
  params.set("per_page", String(state.pagination.per_page));

  return params.toString();
}
