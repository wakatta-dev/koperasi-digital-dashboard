/** @format */

"use client";

import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function KartuAnggotaPage() {
  const [memberId, setMemberId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // TODO integrate API: fetch member profile + QR payload
  const qrPayload = useMemo(() => (memberId ? `member:${memberId}` : ""), [memberId]);

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
    ctx.fillText("QR Placeholder", 60, 130);
  }

  function onDownloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `kartu-anggota-${memberId || "preview"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function onDownloadPDF() {
    // TODO integrate PDF generator
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
            <Input placeholder="ID Anggota" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
            <Input placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="button" variant="outline" onClick={drawPlaceholderQR}>Buat QR</Button>
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

