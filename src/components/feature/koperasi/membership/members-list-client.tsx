/** @format */

"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listMembers, updateMemberStatus } from "@/services/api";
import { MemberProfileDialog } from "./member-profile-dialog";
import { MemberVerifyDialog } from "./member-verify-dialog";
import type { MemberListItem } from "@/types/api";
import { MemberCardDialog } from "./member-card-dialog";
import { makePaginatedListFetcher, type FetchPageResult } from "@/lib/async-fetchers";
import { useDebouncedValue } from "@/hooks/use-debounce";

export function MembersListClient({
  initialData,
  initialCursor,
}: {
  initialData: MemberListItem[];
  initialCursor?: string;
}) {
  const [q, setQ] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const debounced = useDebouncedValue(q, 300);

  const baseParams = useMemo(() => {
    const p: Record<string, string> = {};
    if (status && status !== "all") p.status = status;
    return p;
  }, [status]);

  const fetchPage = useMemo(
    () => makePaginatedListFetcher<MemberListItem>(listMembers, { limit: 20, baseParams }),
    [baseParams]
  );

  const qc = useQueryClient();

  const query = useInfiniteQuery<
    FetchPageResult<MemberListItem>,
    Error,
    InfiniteData<FetchPageResult<MemberListItem>, string | undefined>,
    any,
    string | undefined
  >({
    queryKey: ["koperasi", "members", { q: debounced, status }],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }) =>
      fetchPage({ search: debounced, pageParam, signal }),
    getNextPageParam: (last) => last?.nextPage ?? undefined,
    // Seed with initial SSR data for default query (q:"", status:"all")
    ...(initialData
      ? {
          initialData: {
            pages: [
              { items: (initialData as MemberListItem[]) ?? [], nextPage: initialCursor ?? null },
            ],
            pageParams: [undefined as string | undefined],
          },
        }
      : {}),
    staleTime: 30_000,
    enabled: true,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((p) => p.items) ?? [],
    [query.data]
  );

  const formatDateId = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Input
          className="md:w-1/3"
          placeholder="Cari anggota (nama/email/ID)..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Total: {items.length}
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Anggota</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tgl Bergabung</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((member) => (
            <TableRow key={String(member.id)}>
              <TableCell className="font-medium">
                {member.no_anggota || `AGG-${member.id}`}
              </TableCell>
              <TableCell>{member.user?.full_name || "-"}</TableCell>
              <TableCell className="text-muted-foreground">
                {member.user?.email || "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    String(member.status || "").toLowerCase() === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {String(member.status || "-")}
                </Badge>
              </TableCell>
              <TableCell>{formatDateId(member.join_date)}</TableCell>
              <TableCell className="text-right space-x-1">
                <MemberProfileDialog memberId={member.id} />
                <MemberVerifyDialog defaultId={member.id} />
                <MemberCardDialog memberId={member.id} />
                {["active", "inactive", "nonaktif"].includes(
                  String(member.status || "").toLowerCase()
                ) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const current = String(member.status || "").toLowerCase();
                      const next = current === "active" ? "nonaktif" : "active";
                      await updateMemberStatus(member.id, { status: next });
                      // Optimistic UI: update cached pages in-place
                      qc.setQueryData<
                        InfiniteData<FetchPageResult<MemberListItem>, string | undefined>
                      >([
                        "koperasi",
                        "members",
                        { q: debounced, status },
                      ], (old) => {
                        if (!old) return old as any;
                        return {
                          pageParams: old.pageParams,
                          pages: old.pages.map((pg) => ({
                            ...pg,
                            items: pg.items.map((m) =>
                              m.id === member.id ? { ...m, status: next } : m
                            ),
                          })),
                        } as InfiniteData<
                          FetchPageResult<MemberListItem>,
                          string | undefined
                        >;
                      });
                    }}
                  >
                    Toggle
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => query.fetchNextPage()}
          disabled={!query.hasNextPage || query.isFetchingNextPage}
        >
          {query.isFetchingNextPage
            ? "Memuat..."
            : query.hasNextPage
            ? "Muat Lagi"
            : "Tidak ada data lagi"}
        </Button>
      </div>
    </div>
  );
}
