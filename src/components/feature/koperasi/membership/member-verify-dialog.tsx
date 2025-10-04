/** @format */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { verifyMember } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberListItem } from "@/types/api";

export function MemberVerifyDialog({ defaultId }: { defaultId?: string | number }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>(defaultId ? String(defaultId) : "");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function act(approve: boolean) {
    const targetId = id.trim();
    if (!targetId) {
      toast.error("Pilih anggota terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const payloadReason = reason.trim();
      const res = await verifyMember(targetId, {
        approve,
        ...(approve ? {} : payloadReason ? { reason: payloadReason } : {}),
      });

      if (!res.success) {
        throw new Error(res.message || "Verifikasi anggota gagal");
      }

      toast.success(approve ? "Anggota disetujui" : "Anggota ditolak");
      setReason("");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Gagal memproses verifikasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Verifikasi</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifikasi Anggota</DialogTitle>
          <DialogDescription>Pilih anggota untuk menyetujui/menolak.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <AsyncCombobox<MemberListItem, number>
            value={id ? Number(id) : null}
            onChange={(val) => setId(val ? String(val) : "")}
            getOptionValue={(m) => m.id}
            getOptionLabel={(m) => m.full_name || m.no_anggota || String(m.id)}
            queryKey={["members", "search-member-verify"]}
            fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, { limit: 10 })}
            placeholder="Cari anggota (nama/email/no. anggota)"
            emptyText="Tidak ada anggota"
            notReadyText="Ketik untuk mencari"
            minChars={1}
            renderOption={(m) => (
              <div className="flex flex-col">
                <span className="font-medium">{m.full_name || `Anggota #${m.id}`}</span>
                <span className="text-xs text-muted-foreground">{m.no_anggota} • {m.email || '-'}</span>
              </div>
            )}
            renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
          />
          <Textarea placeholder="Alasan penolakan (opsional)" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="secondary"
            onClick={() => act(false)}
            disabled={!id.trim() || loading}
          >
            Tolak
          </Button>
          <Button onClick={() => act(true)} disabled={!id.trim() || loading}>
            {loading ? "Memproses..." : "Setujui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
