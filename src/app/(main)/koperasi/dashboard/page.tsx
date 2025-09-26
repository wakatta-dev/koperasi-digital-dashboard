/** @format */
/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PiggyBank,
  CreditCard,
  FileText,
  UserPlus,
  Calendar,
} from "lucide-react";
import {
  getKoperasiDashboardSummary,
  getKoperasiDashboardNotifications,
  getKoperasiDashboardTrend,
} from "@/services/api";
import { SummaryCards } from "@/components/feature/koperasi/dashboard/summary-cards";
import { TrendPanel } from "@/components/feature/koperasi/dashboard/trend-panel";
import type {
  KoperasiDashboardSummary,
  KoperasiTrendPoint,
  Notification as DashboardNotification,
} from "@/types/api";

export const dynamic = "force-dynamic";

export default async function KoperasiDashboard() {
  const [summaryRes, notifRes, trendRes] = await Promise.all([
    getKoperasiDashboardSummary().catch(() => null),
    getKoperasiDashboardNotifications({ limit: 10 }).catch(() => null),
    getKoperasiDashboardTrend().catch(() => null),
  ]);

  const summary =
    summaryRes && summaryRes.success
      ? (summaryRes.data as KoperasiDashboardSummary)
      : null;
  const notifications =
    notifRes && notifRes.success
      ? ((notifRes.data as DashboardNotification[]) ?? [])
      : [];
  const trend =
    trendRes && trendRes.success
      ? ((trendRes.data as KoperasiTrendPoint[]) ?? [])
      : [];

  // Quick actions config for cleaner rendering
  const quickActions = [
    {
      href: "/koperasi/keanggotaan",
      title: "Tambah Anggota",
      description: "Daftarkan anggota baru",
      Icon: UserPlus,
    },
    {
      href: "/koperasi/simpanan",
      title: "Setoran Simpanan",
      description: "Catat setoran anggota",
      Icon: PiggyBank,
    },
    {
      href: "/koperasi/pinjaman",
      title: "Proses Pinjaman",
      description: "Kelola pengajuan pinjaman",
      Icon: CreditCard,
    },
    {
      href: "/koperasi/laporan",
      title: "Laporan",
      description: "Lihat laporan keuangan",
      Icon: FileText,
    },
  ];

  const formatDateTime = (value: any) => {
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Ringkasan */}
      <SummaryCards initial={summary} />

      <div className="grid grid-cols-2 gap-x-6">
        <TrendPanel initial={trend as any} />

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Notifikasi Terakhir</CardTitle>
                <CardDescription>Aktivitas sistem terbaru</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/notifikasi">Lihat semua</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-scroll">
            <div className="space-y-4">
              {notifications.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  className="flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {n.title ?? "Notifikasi"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(n.created_at)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {n.type ?? "INFO"}
                  </Badge>
                </div>
              ))}
              {!notifications.length && (
                <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                  Tidak ada notifikasi
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Konten utama dalam 2 kolom untuk tata letak lebih rapi */}
      <div className="grid grid-cols-2 gap-x-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>Fitur yang sering digunakan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map(({ href, title, description, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-label={title}
                  className="group flex items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-accent"
                >
                  <span className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <p className="font-medium leading-6">{title}</p>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Agenda</CardTitle>
            <CardDescription>
              Kegiatan dan rapat yang akan datang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Rapat Anggota Tahunan (RAT)</p>
                  <p className="text-sm text-muted-foreground">
                    15 Februari • 09:00 WIB
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
