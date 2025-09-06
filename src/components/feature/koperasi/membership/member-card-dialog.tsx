/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createMemberCard } from "@/services/api";
import { toast } from "sonner";

// Lazy import qrcode to avoid SSR issues
let QRCode: any = null as any;
async function ensureQRCode() {
  if (!QRCode) {
    const mod = await import("qrcode");
    QRCode = mod.default || mod;
  }
  return QRCode;
}

type Props = { memberId: number | string };

export function MemberCardDialog({ memberId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    try {
      const res = await createMemberCard(memberId);
      if (!res?.success) throw new Error(res?.message || "Gagal membuat kartu");
      const value = (res.data as any)?.qr ?? (res as any)?.data?.qr ?? "";
      if (!value) throw new Error("QR kosong dari server");
      setQr(value);
      try {
        const QR = await ensureQRCode();
        const dataUrl = await QR.toDataURL(value, { margin: 1, width: 240 });
        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl(null);
      }
      toast.success("Kartu anggota dibuat");
    } catch (e: any) {
      toast.error(e?.message || "Gagal membuat kartu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      // reset when opened
      setQr(null);
      setQrDataUrl(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Kartu</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Kartu Anggota</DialogTitle>
          <DialogDescription>Generate dan tampilkan QR kartu anggota.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Kartu Anggota" className="w-60 h-60" />
          ) : qr ? (
            <div className="text-xs p-2 rounded bg-muted w-full break-all">{qr}</div>
          ) : (
            <div className="text-sm text-muted-foreground">Belum ada QR. Klik Generate.</div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={generate} disabled={loading}>{loading ? 'Memproses...' : (qr ? 'Regenerate' : 'Generate')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

