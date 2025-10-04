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
import { getMember, listMembers } from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberListItem, MemberProfile } from "@/types/api";
import { toast } from "sonner";

type Props = { memberId?: string | number; member?: MemberListItem };

export function MemberProfileDialog({ memberId, member }: Props) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | number | undefined>(memberId);
  const [data, setData] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setId(memberId);
  }, [memberId]);

  async function load() {
    const targetId = typeof id === "number" ? id : String(id ?? "").trim();
    if (!targetId) {
      toast.error("Pilih anggota terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const res = await getMember(targetId).catch(() => null);
      if (!res || !res.success || !res.data) {
        setData(null);
        toast.error(res?.message || "Gagal memuat profil anggota");
        return;
      }
      setData(res.data as MemberProfile);
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
                m.full_name || m.no_anggota || String(m.id)
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
                  <span className="font-medium">{m.full_name || `Anggota #${m.id}`}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.no_anggota} • {m.email || "-"}
                  </span>
                </div>
              )}
              renderValue={(val) => (
                <span>
                  {val
                    ? `${member?.full_name ? member.full_name + ' • ' : ''}Anggota #${val}`
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
              <div>{sanitizeText(data.member.full_name) || "-"}</div>
              <div className="text-muted-foreground">Email</div>
              <div>{sanitizeText(data.member.email) || "-"}</div>
              <div className="text-muted-foreground">ID Anggota</div>
              <div>{data.member.id}</div>
              <div className="text-muted-foreground">No. Anggota</div>
              <div>{sanitizeText(data.member.no_anggota) || "-"}</div>
              <div className="text-muted-foreground">Status</div>
              <div className="capitalize">{sanitizeText(data.member.status) || "-"}</div>
              <div className="text-muted-foreground">Saldo Simpanan</div>
              <div>{formatCurrency(data.savings_summary.balance)}</div>
              <div className="text-muted-foreground">Total Setoran</div>
              <div>{formatCurrency(data.savings_summary.total_deposit)}</div>
              <div className="text-muted-foreground">Total Penarikan</div>
              <div>{formatCurrency(data.savings_summary.total_withdrawal)}</div>
              <div className="text-muted-foreground">Pinjaman Aktif</div>
              <div>{data.loan_summary.active_loans}</div>
              <div className="text-muted-foreground">Outstanding</div>
              <div>{formatCurrency(data.loan_summary.outstanding)}</div>
              <div className="text-muted-foreground">Kehadiran RAT</div>
              <div>
                {data.attendance.rat_attended} kali
                {data.attendance.last_attended && (
                  <span className="block text-xs text-muted-foreground">
                    Terakhir: {formatDateId(data.attendance.last_attended)}
                  </span>
                )}
              </div>
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

function sanitizeText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

const currencyId = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

function formatCurrency(value?: number | null): string {
  return typeof value === "number" && Number.isFinite(value)
    ? currencyId.format(value)
    : "-";
}

function formatDateId(value?: string | null): string {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
