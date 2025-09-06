/** @format */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyMember } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function MemberVerifyDialog({ defaultId }: { defaultId?: string | number }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>(defaultId ? String(defaultId) : "");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function act(approve: boolean) {
    if (!id) return;
    setLoading(true);
    try {
      await verifyMember(id, { approve, ...(approve ? {} : { reason }) });
      toast.success(approve ? "Anggota disetujui" : "Anggota ditolak");
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
          <DialogDescription>Masukkan ID anggota untuk menyetujui/menolak.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="ID Anggota" value={id} onChange={(e) => setId(e.target.value)} />
          <Textarea placeholder="Alasan penolakan (opsional)" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => act(false)} disabled={!id || loading}>Tolak</Button>
          <Button onClick={() => act(true)} disabled={!id || loading}>{loading ? 'Memproses...' : 'Setujui'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

