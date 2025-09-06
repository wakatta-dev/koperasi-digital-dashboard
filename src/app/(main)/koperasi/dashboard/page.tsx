/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, PiggyBank, CreditCard, TrendingUp, FileText, DollarSign, UserPlus, Calendar } from "lucide-react";
import { getKoperasiDashboardSummary, getKoperasiDashboardNotifications, getKoperasiDashboardTrend } from "@/services/api";
import { TrendChart } from "@/components/feature/koperasi/dashboard/trend-chart";

export const dynamic = "force-dynamic";

export default async function KoperasiDashboard() {
  const [summaryRes, notifRes, trendRes] = await Promise.all([
    getKoperasiDashboardSummary().catch(() => null),
    getKoperasiDashboardNotifications().catch(() => null),
    getKoperasiDashboardTrend().catch(() => null),
  ]);
  const summary = summaryRes && summaryRes.success ? summaryRes.data : null;
  const notifications = notifRes && notifRes.success ? (notifRes.data as any[]) : [];
  const trend = trendRes && trendRes.success ? (trendRes.data as any[]) : [];

  const dashboardStats = [
    {
      title: "Total Anggota",
      value: summary?.active_members ?? "-",
      change: "+0",
      trend: "up" as const,
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Total Simpanan",
      value: summary?.total_savings ?? "-",
      change: "+0",
      trend: "up" as const,
      icon: <PiggyBank className="h-4 w-4" />,
    },
    {
      title: "Total Pinjaman",
      value: summary?.total_loans ?? "-",
      change: "+0",
      trend: "up" as const,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "SHU Berjalan",
      value: summary?.running_shu ?? "-",
      change: "+0",
      trend: "up" as const,
      icon: <DollarSign className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{String(stat.value)}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span>dari bulan lalu</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend + Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Simpanan & Pinjaman</CardTitle>
            <CardDescription>Periode terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            {trend?.length ? (
              <TrendChart data={trend as any} />
            ) : (
              <div className="text-sm text-muted-foreground italic">Tidak ada data tren</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi Terakhir</CardTitle>
            <CardDescription>Aktivitas sistem terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(notifications || []).slice(0, 5).map((n, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{(n as any).title ?? (n as any).message ?? "Notifikasi"}</p>
                    <p className="text-sm text-muted-foreground">{new Date((n as any).created_at).toLocaleString?.() ?? ""}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="text-xs">{(n as any).status ?? "INFO"}</Badge>
                  </div>
                </div>
              ))}
              {!notifications?.length && (
                <div className="text-sm italic text-muted-foreground">Tidak ada notifikasi</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Fitur yang sering digunakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* TODO integrate routing states if needed */}
              <a href="/koperasi/keanggotaan" className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <UserPlus className="h-6 w-6 mb-2" />
                <p className="font-medium">Tambah Anggota</p>
                <p className="text-sm text-muted-foreground">Daftarkan anggota baru</p>
              </a>
              <a href="/koperasi/simpanan" className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <PiggyBank className="h-6 w-6 mb-2" />
                <p className="font-medium">Setoran Simpanan</p>
                <p className="text-sm text-muted-foreground">Catat setoran anggota</p>
              </a>
              <a href="/koperasi/pinjaman" className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <CreditCard className="h-6 w-6 mb-2" />
                <p className="font-medium">Proses Pinjaman</p>
                <p className="text-sm text-muted-foreground">Kelola pengajuan pinjaman</p>
              </a>
              <a href="/koperasi/laporan" className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <FileText className="h-6 w-6 mb-2" />
                <p className="font-medium">Laporan</p>
                <p className="text-sm text-muted-foreground">Lihat laporan keuangan</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Agenda */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda</CardTitle>
          <CardDescription>Kegiatan dan rapat yang akan datang</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Rapat Anggota Tahunan (RAT)</p>
                <p className="text-sm text-muted-foreground">15 Februari • 09:00 WIB</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
