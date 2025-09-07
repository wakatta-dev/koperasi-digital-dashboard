/** @format */

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  MapPin,
  FileDown,
  FileText,
  CheckCircle2,
  Newspaper,
  Bell,
  BarChart3,
  Users,
  Download,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { RATActionsSheet } from "./rat-actions-sheet";
import { RATHistoryClient } from "./rat-history-client";
import { listRATHistory, listRATDocuments } from "@/services/api";
import type { RAT, RATDocument } from "@/types/api";

// Utilities
function formatDateTime(value?: string) {
  try {
    const d = value ? new Date(value) : null;
    if (!d || isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "-";
  }
}

// Placeholder hooks: Replace queryFn with real API when available
type RatStatus = "selesai" | "pending_notulen" | "dijadwalkan";
function useRATDashboardSummary() {
  return useQuery({
    queryKey: ["rat", "dashboard", "summary"],
    // TODO: replace with real endpoint e.g., getRATDashboardSummary()
    queryFn: async () => {
      // Simulated network delay
      await new Promise((r) => setTimeout(r, 150));
      const status: RatStatus = "selesai";
      return {
        nextSchedule: {
          date: new Date(Date.now() + 7 * 86400_000).toISOString(),
          isOnline: true,
          venue: "Zoom / Online",
        },
        stats: {
          agendasPublished: 6,
          attendeesConfirmed: 128,
          votingParticipation: 72, // percent
          lastRatStatus: status, // selesai | pending_notulen | dijadwalkan
        },
      };
    },
  });
}

type AgendaItem = {
  id: string | number;
  title: string;
  summary: string;
  speaker?: string;
  materialUrl?: string;
  published: boolean;
};

function useRATAgenda() {
  return useQuery({
    queryKey: ["rat", "agenda", "list"],
    // TODO: replace with real endpoint e.g., listRATAgenda(ratId)
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120));
      const items: AgendaItem[] = [
        {
          id: 1,
          title: "Pembukaan",
          summary: "Pembukaan oleh MC dan sambutan ketua",
          speaker: "Ketua Koperasi",
          published: true,
        },
        {
          id: 2,
          title: "Laporan Pengurus",
          summary: "Pemaparan kinerja dan keuangan setahun terakhir",
          speaker: "Bendahara",
          materialUrl: "/files/materi-laporan.pdf",
          published: true,
        },
        {
          id: 3,
          title: "Pengesahan SHU",
          summary: "Pembahasan dan pengesahan pembagian SHU",
          speaker: "Pengawas",
          materialUrl: "/files/shu-2024.pdf",
          published: false,
        },
      ];
      return items;
    },
  });
}

type VotingItemLite = { id: number; question: string; open_at: string; close_at: string; totalVotes: number };

function useRATVoting() {
  return useQuery({
    queryKey: ["rat", "voting", "active"],
    // TODO: replace with real endpoint e.g., listActiveVoting(ratId)
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      const now = Date.now();
      const items: VotingItemLite[] = [
        {
          id: 21,
          question: "Persetujuan Laporan Pertanggungjawaban",
          open_at: new Date(now - 1 * 3600_000).toISOString(),
          close_at: new Date(now + 3 * 3600_000).toISOString(),
          totalVotes: 245,
        },
        {
          id: 22,
          question: "Pemilihan Pengurus",
          open_at: new Date(now + 4 * 3600_000).toISOString(),
          close_at: new Date(now + 10 * 3600_000).toISOString(),
          totalVotes: 0,
        },
      ];
      const participation = 72; // percent (placeholder)
      return { items, participation };
    },
  });
}

function useLatestRAT() {
  return useQuery({
    queryKey: ["rat", "history", "latest"],
    // Uses real history endpoint if available; falls back to null
    queryFn: async () => {
      const res = await listRATHistory({ limit: 5 }).catch(() => null);
      const items = (res && res.success ? ((res.data as RAT[]) ?? []) : []) as RAT[];
      if (!items.length) return null as RAT | null;
      // Prefer upcoming nearest; else latest past
      const now = Date.now();
      const withTs = items
        .map((r) => ({ r, ts: new Date(r.date).getTime() }))
        .filter((x) => !Number.isNaN(x.ts));
      const future = withTs.filter((x) => x.ts >= now).sort((a, b) => a.ts - b.ts);
      const past = withTs.filter((x) => x.ts < now).sort((a, b) => b.ts - a.ts);
      return (future[0]?.r ?? past[0]?.r) || null;
    },
  });
}

function useRATDocumentsFor(id?: number | null) {
  return useQuery({
    queryKey: ["rat", "documents", id ?? "none"],
    enabled: !!id,
    // Uses real documents endpoint if available
    queryFn: async () => {
      if (!id) return [] as RATDocument[];
      const res = await listRATDocuments(id).catch(() => null);
      return (res && res.success ? ((res.data as RATDocument[]) ?? []) : []) as RATDocument[];
    },
  });
}

function useRATNotifications() {
  return useQuery({
    queryKey: ["rat", "notifications"],
    // TODO: replace with real endpoint, or filter global notifications for RAT category
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 80));
      return [
        { id: 1, type: "reminder", text: "Pengingat: RAT 7 hari lagi", at: new Date().toISOString() },
        { id: 2, type: "voting", text: "Hasil voting 'Laporan' selesai dihitung", at: new Date().toISOString() },
        { id: 3, type: "notulen", text: "Notulen RAT belum diunggah", at: new Date().toISOString() },
      ];
    },
  });
}

function useRATReports() {
  return useQuery({
    queryKey: ["rat", "reports", "summary"],
    // TODO: replace with real endpoints for attendance & SHU post-RAT
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120));
      return {
        attendance: { totalMembers: 450, attended: 310, rate: 69 },
        shu: { year: new Date().getFullYear() - 1, approved: true, value: 525_000_000 },
      };
    },
  });
}

export function RATDashboard() {
  const { data: summary } = useRATDashboardSummary();
  const { data: agenda = [] } = useRATAgenda();
  const { data: voting } = useRATVoting();
  const { data: latest } = useLatestRAT();
  const { data: docs = [] } = useRATDocumentsFor(latest?.id ?? null);
  const { data: notifs = [] } = useRATNotifications();
  const { data: reports } = useRATReports();

  const participation = voting?.participation ?? summary?.stats.votingParticipation ?? 0;
  const isOnline = summary?.nextSchedule?.isOnline;

  const chartConfig = {
    Voted: { label: "Sudah", color: "hsl(var(--chart-1))" },
    NotYet: { label: "Belum", color: "hsl(var(--chart-2))" },
  } as const;

  const chartData = [
    { name: "Sudah", value: participation },
    { name: "Belum", value: Math.max(0, 100 - participation) },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard RAT</h2>
          <p className="text-muted-foreground">Ringkasan pelaksanaan dan pengelolaan RAT</p>
        </div>
        <RATActionsSheet />
      </div>

      {/* 1) Ringkasan & Statistik RAT */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ringkasan & Statistik RAT</CardTitle>
              <CardDescription>Informasi jadwal, progres, dan status terbaru</CardDescription>
            </div>
            {summary?.stats.lastRatStatus ? (
              <Badge variant={summary.stats.lastRatStatus === "selesai" ? "default" : "secondary"}>
                {summary.stats.lastRatStatus === "selesai"
                  ? "Selesai"
                  : summary.stats.lastRatStatus === "pending_notulen"
                  ? "Pending Notulen"
                  : summary.stats.lastRatStatus === "dijadwalkan"
                  ? "Dijadwalkan"
                  : String(summary.stats.lastRatStatus)}
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Jadwal Berikutnya</div>
                <div className="text-sm text-muted-foreground">
                  {summary?.nextSchedule?.date ? formatDateTime(summary.nextSchedule.date) : "-"}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {isOnline ? "Online" : summary?.nextSchedule?.venue ?? "-"}
                </div>
              </div>
            </div>

            <ChartContainer
              config={{
                Voted: { label: "Sudah", color: "hsl(var(--chart-1))" },
                NotYet: { label: "Belum", color: "hsl(var(--chart-2))" },
              }}
              className="w-full h-[160px]"
            >
              <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-Voted)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-3 border rounded-md">
              <div className="text-xs text-muted-foreground">Agenda Dipublikasikan</div>
              <div className="text-xl font-semibold">{summary?.stats.agendasPublished ?? agenda.filter((a) => a.published).length}</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="text-xs text-muted-foreground">Konfirmasi Hadir</div>
              <div className="text-xl font-semibold">{summary?.stats.attendeesConfirmed ?? 0}</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="text-xs text-muted-foreground">Partisipasi Voting</div>
              <div className="text-xl font-semibold">{participation}%</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="text-xs text-muted-foreground">Status RAT Terakhir</div>
              <div className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {summary?.stats.lastRatStatus ?? "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2) Agenda & Materi Rapat */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda & Materi Rapat</CardTitle>
          <CardDescription>Kelola agenda, pemateri, dan materi unduhan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                <TableHead>Pemateri</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Materi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agenda.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{a.summary}</TableCell>
                  <TableCell>{a.speaker ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={a.published ? "default" : "secondary"}>{a.published ? "publish" : "draft"}</Badge>
                  </TableCell>
                  <TableCell>
                    {a.materialUrl ? (
                      <Button asChild variant="outline" size="sm">
                        <a href={a.materialUrl} target="_blank" rel="noopener noreferrer">
                          <FileDown className="h-4 w-4 mr-1" /> Unduh
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-2">
            <Button asChild>
              <a href="#rat-actions/jadwalkan-rat">Kelola Agenda</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#rat-actions/upload-dokumen-rat">Upload Materi</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3) Voting Digital */}
      <Card>
        <CardHeader>
          <CardTitle>Voting Digital</CardTitle>
          <CardDescription>Item voting aktif dan progres partisipasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(voting?.items ?? []).map((v) => (
              <div key={v.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{v.question}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> {formatDateTime(v.open_at)} – {formatDateTime(v.close_at)}
                    </div>
                  </div>
                  <Badge variant="secondary">{v.totalVotes} suara</Badge>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" asChild>
                    <a href="#rat-actions/hasil-voting">
                      Lihat Hasil <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <a href="#rat-actions/buat-voting">Buat Voting</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#rat-actions/ikut-voting">Ikut Voting</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4) Dokumentasi & Notulen */}
      <Card>
        <CardHeader>
          <CardTitle>Dokumentasi & Notulen</CardTitle>
          <CardDescription>Ringkasan hasil RAT dan dokumen resmi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ringkasan notulen (placeholder) */}
          <div className="border rounded-md p-4 bg-muted/30">
            <div className="flex items-center gap-2 font-medium">
              <Newspaper className="h-4 w-4" /> Ringkasan Notulen
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {/* TODO: ganti dengan ringkasan notulen dari API */}
              RAT tahun {latest?.year ?? "-"}: persetujuan laporan, pengesahan SHU, dan rencana kerja
              tahun berikutnya.
            </p>
          </div>

          {/* Dokumen resmi */}
          <div className="space-y-2">
            <div className="font-medium">Dokumen Resmi</div>
            {docs.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">Belum ada dokumen untuk RAT aktif.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {docs.map((d) => (
                  <div key={d.id} className="border rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">{d.type}</div>
                        <div className="text-xs text-muted-foreground break-all">{d.file_url}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={d.file_url} target="_blank" rel="noopener noreferrer">Buka</a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat RAT sebelumnya */}
          <div className="space-y-2">
            <div className="font-medium">Riwayat RAT Sebelumnya</div>
            <RATHistoryClient />
          </div>
        </CardContent>
      </Card>

      {/* 5) Notifikasi & Reminder */}
      <Card>
        <CardHeader>
          <CardTitle>Notifikasi & Reminder</CardTitle>
          <CardDescription>Pemberitahuan terkait jadwal, voting, dan notulen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(notifs ?? []).map((n) => (
              <div key={n.id} className="p-3 border rounded-md flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  {n.type === "reminder" && <Bell className="h-4 w-4" />}
                  {n.type === "voting" && <BarChart3 className="h-4 w-4" />}
                  {n.type === "notulen" && <Newspaper className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs text-muted-foreground">{formatDateTime(n.at)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <a href="#rat-actions/kirim-notifikasi">Kirim Pengingat</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 6) Laporan Terkait RAT */}
      <Card>
        <CardHeader>
          <CardTitle>Laporan Terkait RAT</CardTitle>
          <CardDescription>Kehadiran anggota dan SHU pasca RAT</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-md">
              <div className="text-xs text-muted-foreground">Kehadiran Anggota</div>
              <div className="text-sm flex items-center gap-2 mt-1">
                <Users className="h-4 w-4" />
                {reports ? (
                  <span>
                    {reports.attendance.attended}/{reports.attendance.totalMembers} hadir ({reports.attendance.rate}%)
                  </span>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="text-xs text-muted-foreground">SHU Setelah Disahkan</div>
              <div className="text-sm mt-1">
                {reports ? (
                  <span>
                    {reports.shu.approved ? "Disahkan" : "Belum"} · Tahun {reports.shu.year} · Rp {reports.shu.value.toLocaleString("id-ID")}
                  </span>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="text-xs text-muted-foreground">Export Laporan</div>
              <div className="flex gap-2 mt-2">
                {/* TODO: Hubungkan ke endpoint export PDF/Excel */}
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" /> Excel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RATDashboard;
