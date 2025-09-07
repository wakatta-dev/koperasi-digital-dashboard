/** @format */

"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMember } from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import type { MemberListItem } from "@/types/api";

export function MemberProfileDialog({ memberId }: { memberId?: string | number }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | number | undefined>(memberId);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setId(memberId);
  }, [memberId]);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getMember(id);
      setData(res.success ? res.data : null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* Eye icon inline to avoid import churn */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Profil Anggota</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <AsyncCombobox<MemberListItem, number>
              value={id ? Number(id) : null}
              onChange={(val) => setId(val ?? "")}
              getOptionValue={(m) => m.id}
              getOptionLabel={(m) => m.user?.full_name || m.no_anggota || String(m.id)}
              queryKey={["members", "search-member-profile"]}
              fetchPage={async ({ search, pageParam }) => {
                const params: Record<string, string | number> = { limit: 10 };
                if (pageParam) params.cursor = pageParam;
                if (search) params.term = search;
                const res = await listMembers(params);
                const items = (res?.data ?? []) as unknown as MemberListItem[];
                const nextPage = (res?.meta as any)?.pagination?.next_cursor as string | undefined;
                return { items, nextPage };
              }}
              placeholder="Cari anggota (nama/email/no. anggota)"
              emptyText="Tidak ada anggota"
              notReadyText="Ketik untuk mencari"
              minChars={1}
              renderOption={(m) => (
                <div className="flex flex-col">
                  <span className="font-medium">{m.user?.full_name || `Anggota #${m.id}`}</span>
                  <span className="text-xs text-muted-foreground">{m.no_anggota} • {m.user?.email || '-'}</span>
                </div>
              )}
              renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
            />
            <Button onClick={load} disabled={!id || loading}>{loading ? 'Memuat...' : 'Muat'}</Button>
          </div>
          {data ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">ID</div>
              <div>{data?.member?.id ?? data?.id ?? '-'}</div>
              <div className="text-muted-foreground">No. Anggota</div>
              <div>{data?.member?.no_anggota ?? '-'}</div>
              <div className="text-muted-foreground">Status</div>
              <div>{data?.member?.status ?? '-'}</div>
              <div className="text-muted-foreground">Saldo Simpanan</div>
              <div>{data?.savings ?? '-'}</div>
              <div className="text-muted-foreground">Pinjaman Berjalan</div>
              <div>{data?.loans ?? '-'}</div>
              <div className="text-muted-foreground">SHU</div>
              <div>{data?.shu ?? '-'}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">Profil anggota belum dimuat.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
