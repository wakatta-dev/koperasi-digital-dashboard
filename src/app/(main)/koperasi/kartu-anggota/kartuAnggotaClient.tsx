/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getMember,
  getMemberCard,
  refreshMemberCard,
  downloadMemberCard,
} from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberListItem } from "@/types/api";
import { toast } from "sonner";

export default function KartuAnggotaClient() {
  const [memberId, setMemberId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [qr, setQr] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const qrPayload = useMemo(
    () => qr || (memberId ? `member:${memberId}` : ""),
    [qr, memberId],
  );

  const drawPlaceholder = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 260;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(0, 0, size, size);
    ctx.fillStyle = "#666";
    ctx.font = "14px ui-sans-serif, system-ui";
    const text = qrPayload ? `QR: ${qrPayload.slice(0, 16)}...` : "QR belum dibuat";
    ctx.fillText(text, 18, size / 2);
  };

  const renderQR = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!qrPayload) {
      drawPlaceholder();
      return;
    }
    try {
      const QR = await import("qrcode");
      await QR.toCanvas(canvas, qrPayload, { width: 260, margin: 1 });
    } catch {
      drawPlaceholder();
    }
  };

  const loadPreview = async (id: string) => {
    setLoading(true);
    try {
      const [profile, card] = await Promise.all([
        getMember(id).catch(() => null),
        getMemberCard(id).catch(() => null),
      ]);
      if (profile?.success) {
        const m: any = profile.data?.member ?? profile.data;
        setName(m?.member?.full_name || m?.full_name || "");
      }
      if (card?.success && card.data?.qr_code) {
        setQr(card.data.qr_code);
      } else {
        setQr("");
      }
    } catch (e: any) {
      toast.error(e?.message || "Gagal memuat kartu anggota");
      setQr("");
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await refreshMemberCard(memberId);
      if (res.success && res.data?.qr_code) {
        setQr(res.data.qr_code);
        toast.success("QR kartu diperbarui");
      } else {
        toast.error(res.message || "Gagal membuat kartu");
      }
      await loadPreview(memberId);
    } catch (e: any) {
      toast.error(e?.message || "Gagal membuat kartu");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = async () => {
    if (!memberId) return;
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
  };

  useEffect(() => {
    renderQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrPayload]);

  useEffect(() => {
    if (memberId) {
      void loadPreview(memberId);
    } else {
      setQr("");
      setName("");
      drawPlaceholder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kartu Anggota</h2>
          <p className="text-muted-foreground">
            Generate, unduh, dan validasi kartu digital anggota
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onDownload} disabled={!memberId || downloading}>
            {downloading ? "Mengunduh..." : "Download"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pratinjau</CardTitle>
          <CardDescription>Pilih anggota lalu generate untuk memperbarui QR</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <AsyncCombobox<MemberListItem, number>
              value={memberId ? Number(memberId) : null}
              onChange={(val, item) => {
                setMemberId(val ? String(val) : "");
                if (item && item.user?.full_name) {
                  setName(item.user.full_name);
                }
              }}
              getOptionValue={(m) => m.id}
              getOptionLabel={(m) =>
                m.user?.full_name || m.no_anggota || String(m.id)
              }
              queryKey={["members", "search-member-card"]}
              fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, {
                limit: 10,
              })}
              placeholder="Cari anggota (nama/email/no. anggota)"
              emptyText="Tidak ada anggota"
              notReadyText="Ketik untuk mencari"
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
              renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
            />
            <Input
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onGenerate}
              disabled={!memberId || loading}
            >
              {loading ? "Memproses..." : "Generate QR"}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="mb-2 text-sm text-muted-foreground">QR Code</div>
              <canvas ref={canvasRef} className="rounded border" />
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 text-sm text-muted-foreground">Detail</div>
              <div className="space-y-1 text-sm">
                <div>ID: {memberId || "-"}</div>
                <div>Nama: {name || "-"}</div>
                <div>Payload: {qrPayload || "-"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
