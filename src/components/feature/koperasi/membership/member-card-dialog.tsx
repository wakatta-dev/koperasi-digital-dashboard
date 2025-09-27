/** @format */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getMemberCard, refreshMemberCard, downloadMemberCard } from "@/services/api";
import { toast } from "sonner";
import Image from "next/image";

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
  const [downloading, setDownloading] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  async function load() {
    try {
      const res = await getMemberCard(memberId);
      if (res.success && res.data) {
        const value = res.data.qr_code ?? "";
        setQr(value);
        if (res.data.qr_url) {
          setQrDataUrl(res.data.qr_url);
        } else if (value) {
          const QR = await ensureQRCode();
          const dataUrl = await QR.toDataURL(value, { margin: 1, width: 240 });
          setQrDataUrl(dataUrl);
        }
      } else {
        setQr(null);
        setQrDataUrl(null);
      }
    } catch {
      setQr(null);
      setQrDataUrl(null);
    }
  }

  async function generate() {
    setLoading(true);
    try {
      const res = await refreshMemberCard(memberId);
      if (!res?.success || !res.data) throw new Error(res?.message || "Gagal membuat kartu");
      const value = res.data.qr_code ?? "";
      if (!value) throw new Error("QR kosong dari server");
      setQr(value);
      if (res.data.qr_url) {
        setQrDataUrl(res.data.qr_url);
      } else {
        const QR = await ensureQRCode();
        const dataUrl = await QR.toDataURL(value, { margin: 1, width: 240 });
        setQrDataUrl(dataUrl);
      }
      toast.success("Kartu anggota diperbarui");
    } catch (e: any) {
      toast.error(e?.message || "Gagal membuat kartu");
    } finally {
      setLoading(false);
    }
  }

  async function download() {
    setDownloading(true);
    try {
      const blob = await downloadMemberCard(memberId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kartu-anggota-${memberId}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengunduh kartu");
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    if (open) {
      void load();
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
            <Image
              src={qrDataUrl}
              alt="QR Kartu Anggota"
              width={240}
              height={240}
              className="rounded"
              unoptimized
            />
          ) : qr ? (
            <div className="text-xs p-2 rounded bg-muted w-full break-all">{qr}</div>
          ) : (
            <div className="text-sm text-muted-foreground">Belum ada QR. Klik Generate.</div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={download} disabled={downloading}>
            {downloading ? "Mengunduh..." : "Download"}
          </Button>
          <Button onClick={generate} disabled={loading}>
            {loading ? "Memproses..." : qr ? "Regenerate" : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
