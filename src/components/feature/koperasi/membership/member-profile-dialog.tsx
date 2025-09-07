/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMember, getUser } from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberListItem, User } from "@/types/api";

type Props = { memberId?: string | number; member?: MemberListItem };

export function MemberProfileDialog({ memberId, member }: Props) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | number | undefined>(memberId);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setId(memberId);
  }, [memberId]);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getMember(id);
      setData(res.success ? res.data : null);
      const uid =
        (res as any)?.data?.member?.user_id ?? (res as any)?.data?.user_id;
      if (uid) {
        const ures = await getUser(uid).catch(() => null);
        setUser(
          ures && (ures as any).success ? ((ures as any).data as User) : null
        );
      } else {
        setUser(null);
      }
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Profil Anggota</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm w-full">
          <div className="grid grid-cols-4 gap-2 items-end w-full">
            <AsyncCombobox<MemberListItem, number>
              value={id ? Number(id) : null}
              onChange={(val) => setId(val ?? "")}
              getOptionValue={(m) => m.id}
              getOptionLabel={(m) =>
                m.user?.full_name || m.no_anggota || String(m.id)
              }
              queryKey={["members", "search-member-profile"]}
              fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, {
                limit: 10,
              })}
              placeholder="Cari anggota (nama/email/no. anggota)"
              emptyText="Tidak ada anggota"
              notReadyText="Ketik untuk mencari"
              className="col-span-3"
              minChars={1}
              renderOption={(m) => (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {m.user?.full_name || `Anggota #${m.id}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.no_anggota} • {m.user?.email || "-"}
                  </span>
                </div>
              )}
              renderValue={(val) => (
                <span>
                  {val
                    ? `${
                        member?.user?.full_name
                          ? member.user.full_name + " • "
                          : ""
                      }Anggota #${val}`
                    : ""}
                </span>
              )}
            />
            <Button onClick={load} disabled={!id || loading}>
              {loading ? "Memuat..." : "Muat"}
            </Button>
          </div>
          {data ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Nama Lengkap</div>
              <div>{user?.full_name ?? member?.user?.full_name ?? "-"}</div>
              <div className="text-muted-foreground">Email</div>
              <div>{user?.email ?? member?.user?.email ?? "-"}</div>
              <div className="text-muted-foreground">ID Anggota</div>
              <div>{data?.member?.id ?? data?.id ?? "-"}</div>
              <div className="text-muted-foreground">No. Anggota</div>
              <div>{data?.member?.no_anggota ?? "-"}</div>
              <div className="text-muted-foreground">Status</div>
              <div>{data?.member?.status ?? "-"}</div>
              <div className="text-muted-foreground">Saldo Simpanan</div>
              <div>{data?.savings ?? "-"}</div>
              <div className="text-muted-foreground">Pinjaman Berjalan</div>
              <div>{data?.loans ?? "-"}</div>
              <div className="text-muted-foreground">SHU</div>
              <div>{data?.shu ?? "-"}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Profil anggota belum dimuat.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
