/** @format */

"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationRow } from "./notification-row";
import { listNotifications, updateNotificationStatus } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { makePaginatedListFetcher, type FetchPageResult } from "@/lib/async-fetchers";

export function NotificationsClient({ initialItems = [], initialCursor, initialHasNext }: { initialItems?: any[]; initialCursor?: string; initialHasNext?: boolean; }) {
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  // Apply filters only when clicking Filter/Reset
  const [applied, setApplied] = useState<{ type?: string; status?: string; from?: string; to?: string }>({});

  const baseParams = useMemo(() => {
    const p: Record<string, string> = {};
    if (applied.type) p.type = applied.type;
    if (applied.status) p.status = applied.status;
    if (applied.from) p.from = applied.from;
    if (applied.to) p.to = applied.to;
    return p;
  }, [applied]);

  const fetchPage = useMemo(
    () => makePaginatedListFetcher<any>(listNotifications, { limit: 20, baseParams, searchKey: null }),
    [baseParams]
  );

  const query = useInfiniteQuery<
    FetchPageResult<any>,
    Error,
    InfiniteData<FetchPageResult<any>, string | undefined>,
    any,
    string | undefined
  >({
    queryKey: ["koperasi", "notifications", baseParams],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }) => fetchPage({ search: "", pageParam, signal }),
    getNextPageParam: (last) => last?.nextPage ?? undefined,
    ...(initialItems?.length
      ? {
          initialData: {
            pages: [{ items: initialItems, nextPage: initialCursor ?? null }],
            pageParams: [undefined as string | undefined],
          },
        }
      : {}),
    staleTime: 30_000,
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
        <Select
          value={type || "__ALL__"}
          onValueChange={(v) => setType(v === "__ALL__" ? "" : v)}
        >
          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Semua</SelectItem>
            <SelectItem value="BILLING">BILLING</SelectItem>
            <SelectItem value="RAT">RAT</SelectItem>
            <SelectItem value="LOAN">LOAN</SelectItem>
            <SelectItem value="SAVINGS">SAVINGS</SelectItem>
            <SelectItem value="SYSTEM">SYSTEM</SelectItem>
            <SelectItem value="CUSTOM">CUSTOM</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status || "__ALL__"}
          onValueChange={(v) => setStatus(v === "__ALL__" ? "" : v)}
        >
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Semua</SelectItem>
            <SelectItem value="DRAFT">DRAFT</SelectItem>
            <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
            <SelectItem value="SENT">SENT</SelectItem>
            <SelectItem value="READ">READ</SelectItem>
            <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker
          placeholder="Rentang"
          value={{ start: from || undefined, end: to || undefined }}
          onChange={(s, e) => { setFrom(s || ""); setTo(e || ""); }}
          triggerClassName="w-full"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setApplied({ type: type || undefined, status: status || undefined, from: from || undefined, to: to || undefined })} disabled={query.isFetching}>Filter</Button>
          <Button variant="ghost" onClick={() => { setType(""); setStatus(""); setFrom(""); setTo(""); setApplied({}); }} disabled={query.isFetching}>Reset</Button>
        </div>
      </div>
      {(query.data?.pages.flatMap((p) => p.items) ?? []).map((n) => (
        <NotificationRow
          key={String(n.id ?? Math.random())}
          item={n}
          onRead={async (id) => {
            await updateNotificationStatus(id, { status: "READ" });
          }}
        />
      ))}
      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage || !query.hasNextPage}>
          {query.isFetchingNextPage ? "Memuat..." : query.hasNextPage ? "Muat Lagi" : "Tidak ada data lagi"}
        </Button>
      </div>
    </div>
  );
}
