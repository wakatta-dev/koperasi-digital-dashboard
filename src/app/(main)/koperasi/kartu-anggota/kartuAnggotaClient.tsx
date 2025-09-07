/** @format */

'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMemberCard, getMember } from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import type { MemberListItem } from "@/types/api";

export default function KartuAnggotaClient() {
  const [memberId, setMemberId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [qr, setQr] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const qrPayload = useMemo(() => qr || (memberId ? `member:${memberId}` : ""), [qr, memberId]);

  function drawPlaceholderQR() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = (canvas.width = 260);
    const h = (canvas.height = 260);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(0, 0, w, h);
    ctx.fillStyle = "#111";
    ctx.font = "14px ui-sans-serif, system-ui";
    const text = qrPayload ? `QR: ${qrPayload.slice(0, 16)}...` : "QR Placeholder";
    ctx.fillText(text, 20, 130);
  }

  async function renderQR() {
    const payload = qrPayload;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!payload) {
      drawPlaceholderQR();
      return;
    }
    try {
      const QR = await import('qrcode');
      await QR.toCanvas(canvas, payload, { width: 260, margin: 1 });
    } catch {
      drawPlaceholderQR();
    }
  }

  async function onGenerate() {
    if (!memberId) return;
    try {
      const [profile, card] = await Promise.all([
        getMember(memberId).catch(() => null),
        createMemberCard(memberId).catch(() => null),
      ]);
      if (profile && profile.success) {
        const m: any = profile.data?.member ?? profile.data;
        if (m?.user?.name) setName(m.user.name);
      }
      if (card && card.success) {
        const payload = (card.data as any)?.qr ?? "";
        setQr(payload);
      }
    } finally {
      renderQR();
    }
  }

  useEffect(() => {
    renderQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrPayload]);

  function onDownloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `kartu-anggota-${memberId || "preview"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function onDownloadPDF() {
    onDownloadPNG();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kartu Anggota</h2>
          <p className="text-muted-foreground">Kartu digital dengan QR code</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onDownloadPDF}>Download PDF</Button>
          <Button onClick={onDownloadPNG}>Download PNG</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pratinjau</CardTitle>
          <CardDescription>Masukkan data anggota untuk membuat kartu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <AsyncCombobox<MemberListItem, number>
              value={memberId ? Number(memberId) : null}
              onChange={(val, item) => { setMemberId(val ? String(val) : ""); if (item && (item as any).user?.full_name) setName((item as any).user.full_name); }}
              getOptionValue={(m) => m.id}
              getOptionLabel={(m) => m.user?.full_name || m.no_anggota || String(m.id)}
              queryKey={["members", "search-member-card"]}
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
            <Input placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="button" variant="outline" onClick={onGenerate}>Buat QR</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">QR Code</div>
              <canvas ref={canvasRef} className="border rounded" />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Detail</div>
              <div className="space-y-1 text-sm">
                <div>ID: {memberId || '-'}</div>
                <div>Nama: {name || '-'}</div>
                <div>Payload: {qrPayload || '-'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
