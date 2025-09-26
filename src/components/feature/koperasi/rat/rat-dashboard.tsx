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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { RATActionsSheet } from "./rat-actions-sheet";
import { RATHistoryClient } from "./rat-history-client";
// types are provided via hooks; no direct type import needed here
import { formatDateTime } from "@/lib/datetime";
import {
  useRATDashboardSummary,
  useRATAgenda,
  useRATVoting,
  useLatestRAT,
  useRATDocumentsFor,
  useRATNotifications,
  useRATReports,
} from "@/hooks/queries/rat";


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

  const chartData = [
    { name: "Sudah", value: participation },
    { name: "Belum", value: Math.max(0, 100 - participation) },
  ];

  function goToActions(section: string) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.hash = `#rat-actions/${section}`;
    // Avoid scroll jump and full navigation
    window.history.replaceState(null, "", url.toString());
    // Notify listeners (sheet) since replaceState doesn't fire hashchange
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

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
              <a
                href="#rat-actions/jadwalkan-rat"
                onClick={(e) => {
                  e.preventDefault();
                  goToActions("jadwalkan-rat");
                }}
              >
                Kelola Agenda
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="#rat-actions/upload-dokumen-rat"
                onClick={(e) => {
                  e.preventDefault();
                  goToActions("upload-dokumen-rat");
                }}
              >
                Upload Materi
              </a>
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
                    <a
                      href="#rat-actions/hasil-voting"
                      onClick={(e) => {
                        e.preventDefault();
                        goToActions("hasil-voting");
                      }}
                    >
                      Lihat Hasil <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <a
                href="#rat-actions/buat-voting"
                onClick={(e) => {
                  e.preventDefault();
                  goToActions("buat-voting");
                }}
              >
                Buat Voting
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="#rat-actions/ikut-voting"
                onClick={(e) => {
                  e.preventDefault();
                  goToActions("ikut-voting");
                }}
              >
                Ikut Voting
              </a>
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
              <a
                href="#rat-actions/kirim-notifikasi"
                onClick={(e) => {
                  e.preventDefault();
                  goToActions("kirim-notifikasi");
                }}
              >
                Kirim Pengingat
              </a>
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
