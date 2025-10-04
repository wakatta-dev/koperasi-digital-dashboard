/** @format */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  listMembers,
} from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberCard, MemberListItem, MemberProfile } from "@/types/api";
import { toast } from "sonner";

const CANVAS_SIZE = 260;

let qrCodeLib: any = null;

async function ensureQRCode() {
  if (!qrCodeLib) {
    const mod = await import("qrcode");
    qrCodeLib = mod.default || mod;
  }
  return qrCodeLib;
}

export default function KartuAnggotaClient() {
  const [memberId, setMemberId] = useState("");
  const [name, setName] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const normalizedMemberId = useMemo(() => memberId.trim(), [memberId]);
  const displayName = useMemo(() => name.trim(), [name]);
  const qrPayload = useMemo(
    () => computeQrPayload(qr, normalizedMemberId),
    [qr, normalizedMemberId],
  );

  const drawPlaceholder = useCallback((payload?: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = "#d4d4d4";
    ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = "#4b5563";
    ctx.font = "14px ui-sans-serif, system-ui, -apple-system";
    ctx.textBaseline = "middle";

    const text = payload
      ? `QR: ${truncate(payload, 18)}`
      : "QR belum dibuat";
    ctx.fillText(text, 16, CANVAS_SIZE / 2);
  }, []);

  const renderQR = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const payload = qrPayload;
    if (!payload) {
      drawPlaceholder();
      return;
    }

    try {
      const QR = await ensureQRCode();
      await QR.toCanvas(canvas, payload, { width: CANVAS_SIZE, margin: 1 });
    } catch {
      drawPlaceholder(payload);
    }
  }, [qrPayload, drawPlaceholder]);

  const loadPreview = useCallback(
    async (rawId: string, options?: { silent?: boolean }) => {
      const targetId = rawId.trim();
      const isSilent = Boolean(options?.silent);

      if (!targetId) {
        if (isMountedRef.current) {
          setName("");
          setQr("");
          drawPlaceholder();
        }
        return;
      }

      if (!isSilent && isMountedRef.current) {
        setLoading(true);
      }

      try {
        const [profileRes, cardRes] = await Promise.all([
          getMember(targetId).catch(() => null),
          getMemberCard(targetId).catch(() => null),
        ]);

        if (!isMountedRef.current) return;

        if (profileRes?.success && profileRes.data) {
          const extracted = extractMemberName(profileRes.data);
          if (extracted) {
            setName(extracted);
          }
        } else if (!isSilent && profileRes?.message) {
          toast.error(profileRes.message);
        }

        if (cardRes?.success && cardRes.data) {
          const safeQr = sanitizeQrCode(cardRes.data);
          setQr(safeQr);
        } else {
          setQr("");
          if (!isSilent && cardRes?.message) {
            toast.error(cardRes.message);
          }
        }
      } catch (error) {
        if (!isMountedRef.current) return;
        setQr("");
        if (!isSilent) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal memuat kartu anggota",
          );
        }
      } finally {
        if (!isSilent && isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [drawPlaceholder],
  );

  useEffect(() => {
    void renderQR();
  }, [renderQR]);

  useEffect(() => {
    if (normalizedMemberId) {
      void loadPreview(normalizedMemberId);
    } else if (isMountedRef.current) {
      setName("");
      setQr("");
      drawPlaceholder();
    }
  }, [normalizedMemberId, loadPreview, drawPlaceholder]);

  const handleGenerate = useCallback(async () => {
    const targetId = normalizedMemberId;
    if (!targetId) {
      toast.error("Pilih anggota terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const res = await refreshMemberCard(targetId);
      if (!res?.success || !res.data) {
        throw new Error(res?.message || "Gagal membuat kartu");
      }
      const safeQr = sanitizeQrCode(res.data);
      setQr(safeQr);
      toast.success("QR kartu diperbarui");
      await loadPreview(targetId, { silent: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat kartu",
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [normalizedMemberId, loadPreview]);

  const handleDownload = useCallback(async () => {
    const targetId = normalizedMemberId;
    if (!targetId) {
      toast.error("Pilih anggota terlebih dahulu");
      return;
    }
    setDownloading(true);
    try {
      const blob = await downloadMemberCard(targetId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kartu-anggota-${targetId}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengunduh kartu",
      );
    } finally {
      if (isMountedRef.current) {
        setDownloading(false);
      }
    }
  }, [normalizedMemberId]);

  const handleMemberChange = useCallback(
    (val: number | null, item: MemberListItem | null) => {
      const nextId = typeof val === "number" ? String(val) : "";
      setMemberId(nextId);
      setQr("");
      drawPlaceholder();

      if (item) {
        const label = memberOptionLabel(item);
        if (label) {
          setName(label);
        }
      }
    },
    [drawPlaceholder],
  );

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
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!normalizedMemberId || downloading}
          >
            {downloading ? "Mengunduh..." : "Download"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pratinjau</CardTitle>
          <CardDescription>
            Pilih anggota lalu generate untuk memperbarui QR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <AsyncCombobox<MemberListItem, number>
              value={normalizedMemberId ? Number(normalizedMemberId) : null}
              onChange={handleMemberChange}
              getOptionValue={(member) => member.id}
              getOptionLabel={memberOptionLabel}
              queryKey={["members", "search-member-card"]}
              fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, {
                limit: 10,
              })}
              placeholder="Cari anggota (nama/email/no. anggota)"
              emptyText="Tidak ada anggota"
              notReadyText="Ketik untuk mencari"
              minChars={1}
              renderOption={(member) => (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {memberOptionLabel(member)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sanitizeText(member.no_anggota)} •{" "}
                    {sanitizeText(member.user?.email) || "-"}
                  </span>
                </div>
              )}
              renderValue={(val) =>
                val ? <span>Anggota #{val}</span> : <span />
              }
            />
            <Input
              placeholder="Nama Lengkap"
              value={displayName}
              onChange={(event) => setName(event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerate}
              disabled={!normalizedMemberId || loading}
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
                <div>ID: {normalizedMemberId || "-"}</div>
                <div>Nama: {displayName || "-"}</div>
                <div>Payload: {qrPayload || "-"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function memberOptionLabel(member: MemberListItem): string {
  return (
    sanitizeText(member.user?.full_name) ||
    sanitizeText(member.full_name) ||
    sanitizeText(member.no_anggota) ||
    `Anggota #${member.id}`
  );
}

function sanitizeQrCode(card: MemberCard | null | undefined): string {
  return sanitizeText(card?.qr_code);
}

function extractMemberName(profile: MemberProfile | null | undefined): string {
  if (!profile) return "";
  const candidates = [
    profile.member?.full_name,
  ];
  for (const candidate of candidates) {
    const text = sanitizeText(candidate);
    if (text) return text;
  }
  return "";
}

function computeQrPayload(qrCode: string, memberId: string): string {
  const sanitizedQr = sanitizeText(qrCode);
  if (sanitizedQr) return sanitizedQr;
  if (memberId) return `member:${memberId}`;
  return "";
}

function truncate(value: string, max = 18): string {
  return value.length > max ? `${value.slice(0, max)}...` : value;
}
