/** @format */

import type { ApiResponse } from "@/types/api";

export type FetchPageResult<TItem> = {
  items: TItem[];
  nextPage?: string | null;
};

type ListFn<TItem> = (
  params?: Record<string, string | number>,
  opts?: { signal?: AbortSignal }
) => Promise<ApiResponse<TItem[]>>;

export function makePaginatedListFetcher<TItem>(
  listFn: ListFn<TItem>,
  opts?: {
    limit?: number;
    baseParams?: Record<string, string | number>;
    searchKey?: string | null; // null to disable search param
  }
) {
  const limit = opts?.limit ?? 10;
  const baseParams = opts?.baseParams ?? {};
  const searchKey = opts?.searchKey === undefined ? "term" : opts.searchKey;

  return async function fetchPage({
    search,
    pageParam,
    signal,
  }: {
    search: string;
    pageParam?: string;
    signal?: AbortSignal;
  }): Promise<FetchPageResult<TItem>> {
    const params: Record<string, string | number> = { ...baseParams, limit };
    if (pageParam) params.cursor = pageParam;
    if (searchKey && search) params[searchKey] = search;

    const res = await listFn(params, { signal }).catch(() => null);
    const items = (res?.data ?? []) as TItem[];
    const nextPage = (res?.meta as any)?.pagination?.next_cursor as
      | string
      | undefined;

    return { items, nextPage };
  };
}
