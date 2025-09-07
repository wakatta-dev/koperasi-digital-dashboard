/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import type { RAT } from "@/types/api";
import { listRATHistory, listRATDocuments } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { RATDocument } from "@/types/api";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { makePaginatedListFetcher, type FetchPageResult } from "@/lib/async-fetchers";

type Props = {
  initialData?: RAT[];
  initialCursor?: string;
  limit?: number;
};

function formatDateTime(value?: string) {
  try {
    const d = value ? new Date(value) : null;
    if (!d || isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "-";
  }
}

export function RATHistoryClient({ initialData = [], initialCursor, limit = 10 }: Props) {
  const fetchPage = useMemo(
    () => makePaginatedListFetcher<RAT>(listRATHistory, { limit, searchKey: null }),
    [limit]
  );
  const query = useInfiniteQuery<
    FetchPageResult<RAT>,
    Error,
    InfiniteData<FetchPageResult<RAT>, string | undefined>,
    any,
    string | undefined
  >({
    queryKey: ["rat", "history", { limit }],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }) => fetchPage({ search: "", pageParam, signal }),
    getNextPageParam: (last) => last?.nextPage ?? undefined,
    ...(initialData?.length
      ? {
          initialData: {
            pages: [{ items: initialData, nextPage: initialCursor ?? null }],
            pageParams: [undefined as string | undefined],
          },
        }
      : {}),
    staleTime: 30_000,
  });
  const [active, setActive] = useState<RAT | null>(null);
  const [docs, setDocs] = useState<RATDocument[] | null>(null);
  const [docsLoading, setDocsLoading] = useState(false);

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);

  useEffect(() => {
    async function fetchDocs() {
      if (!active) return;
      setDocsLoading(true);
      try {
        const res = await listRATDocuments(active.id).catch(() => null);
        setDocs(res && res.success ? ((res.data as RATDocument[]) ?? []) : []);
      } finally {
        setDocsLoading(false);
      }
    }
    fetchDocs();
  }, [active]);

  return (
    <div className="space-y-4">
      {items.map((rat) => (
        <div key={rat.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">RAT {rat.year}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateTime(rat.date)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" type="button" onClick={() => setActive(rat)}>
              Detail
            </Button>
          </div>
        </div>
      ))}
      {!items.length && (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Belum ada data RAT.
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <Button type="button" variant="outline" disabled={!query.hasNextPage || query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
          {query.isFetchingNextPage ? "Memuat..." : query.hasNextPage ? "Muat lagi" : "Tidak ada data lagi"}
        </Button>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Detail RAT {active?.year}</SheetTitle>
            <SheetDescription>Informasi jadwal, agenda, dan dokumen RAT</SheetDescription>
          </SheetHeader>
          {active ? (
            <div className="p-4 space-y-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Tanggal</div>
                <div className="font-medium">{formatDateTime(active.date)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Agenda</div>
                {active.agenda ? (
                  <ul className="mt-1 space-y-1">
                    {String(active.agenda)
                      .split(/\n|\r|,|•|-/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {item}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-muted-foreground">Tidak ada agenda.</div>
                )}
              </div>
              <div className="pt-2">
                <div className="font-medium mb-2">Dokumen RAT</div>
                <div className="flex items-center gap-2 mb-2">
                  <Button size="sm" variant="outline" onClick={() => active && setActive({ ...active })} disabled={docsLoading}>
                    {docsLoading ? "Memuat..." : "Refresh"}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href="#rat-actions/upload-dokumen-rat"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof window !== "undefined") {
                          const url = new URL(window.location.href);
                          url.hash = `#rat-actions/upload-dokumen-rat`;
                          window.history.replaceState(null, "", url.toString());
                          window.dispatchEvent(new HashChangeEvent("hashchange"));
                        }
                      }}
                    >
                      Upload Dokumen
                    </a>
                  </Button>
                </div>
                {!docsLoading && (!docs || docs.length === 0) && (
                  <div className="text-xs text-muted-foreground italic">Belum ada dokumen.</div>
                )}
                <div className="space-y-2">
                  {(docs ?? []).map((d) => (
                    <div key={d.id} className="flex items-center justify-between border rounded p-2">
                      <div>
                        <div className="font-medium text-sm">{d.type}</div>
                        <div className="text-xs text-muted-foreground break-all">{d.file_url}</div>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={d.file_url} target="_blank" rel="noopener noreferrer">Buka</a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default RATHistoryClient;
