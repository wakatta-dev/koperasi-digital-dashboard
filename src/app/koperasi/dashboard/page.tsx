/** @format */

import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Building,
  Receipt,
  FileText,
  Settings,
  MessageCircle,
  DollarSign,
  UserPlus,
  Calendar,
} from "lucide-react";

const koperasiNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Keanggotaan",
    href: "/keanggotaan",
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: "Simpanan",
    href: "/simpanan",
    icon: <PiggyBank className="h-4 w-4" />,
  },
  {
    name: "Pinjaman",
    href: "/pinjaman",
    icon: <CreditCard className="h-4 w-4" />,
  },
  { name: "SHU", href: "/shu", icon: <TrendingUp className="h-4 w-4" /> },
  { name: "RAT", href: "/rat", icon: <Calendar className="h-4 w-4" /> },
  { name: "Aset", href: "/aset", icon: <Building className="h-4 w-4" /> },
  {
    name: "Transaksi",
    href: "/transaksi",
    icon: <Receipt className="h-4 w-4" />,
  },
  { name: "Laporan", href: "/laporan", icon: <FileText className="h-4 w-4" /> },
  {
    name: "Pengaturan",
    href: "/pengaturan",
    icon: <Settings className="h-4 w-4" />,
  },
  { name: "Tagihan", href: "/tagihan", icon: <Receipt className="h-4 w-4" /> },
  {
    name: "Chat Support",
    href: "/chat-support",
    icon: <MessageCircle className="h-4 w-4" />,
  },
];

const dashboardStats = [
  {
    title: "Total Anggota",
    value: "1,247",
    change: "+23",
    trend: "up" as const,
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Total Simpanan",
    value: "Rp 2.4M",
    change: "+15.2%",
    trend: "up" as const,
    icon: <PiggyBank className="h-4 w-4" />,
  },
  {
    title: "Pinjaman Aktif",
    value: "Rp 1.8M",
    change: "+8.1%",
    trend: "up" as const,
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    title: "SHU Tahun Ini",
    value: "Rp 450K",
    change: "+12.5%",
    trend: "up" as const,
    icon: <DollarSign className="h-4 w-4" />,
  },
];

export default function KoperasiDashboard() {
  return (
    <ProtectedRoute requiredRole="koperasi">
      <DashboardLayout
        title="Dashboard Koperasi"
        navigation={koperasiNavigation}
      >
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp
                      className={`h-3 w-3 ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span>dari bulan lalu</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>
                  Transaksi dan aktivitas anggota terbaru
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      member: "Budi Santoso",
                      activity: "Setoran Simpanan Pokok",
                      amount: "Rp 500,000",
                      type: "simpanan",
                    },
                    {
                      member: "Siti Aminah",
                      activity: "Pengajuan Pinjaman",
                      amount: "Rp 2,000,000",
                      type: "pinjaman",
                    },
                    {
                      member: "Ahmad Wijaya",
                      activity: "Pelunasan Pinjaman",
                      amount: "Rp 1,500,000",
                      type: "pelunasan",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{activity.member}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.activity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.amount}</p>
                        <Badge
                          variant={
                            activity.type === "simpanan"
                              ? "default"
                              : activity.type === "pinjaman"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                  <a
                    href="/keanggotaan"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <UserPlus className="h-6 w-6 mb-2" />
                    <p className="font-medium">Tambah Anggota</p>
                    <p className="text-sm text-muted-foreground">
                      Daftarkan anggota baru
                    </p>
                  </a>
                  <a
                    href="/simpanan"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <PiggyBank className="h-6 w-6 mb-2" />
                    <p className="font-medium">Setoran Simpanan</p>
                    <p className="text-sm text-muted-foreground">
                      Catat setoran anggota
                    </p>
                  </a>
                  <a
                    href="/pinjaman"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    <p className="font-medium">Proses Pinjaman</p>
                    <p className="text-sm text-muted-foreground">
                      Kelola pengajuan pinjaman
                    </p>
                  </a>
                  <a
                    href="/laporan"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    <p className="font-medium">Laporan</p>
                    <p className="text-sm text-muted-foreground">
                      Lihat laporan keuangan
                    </p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Agenda Mendatang</CardTitle>
              <CardDescription>
                Kegiatan dan rapat yang akan datang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    event: "Rapat Anggota Tahunan (RAT)",
                    date: "15 Februari 2024",
                    time: "09:00 WIB",
                  },
                  {
                    event: "Pembagian SHU",
                    date: "20 Februari 2024",
                    time: "10:00 WIB",
                  },
                  {
                    event: "Sosialisasi Produk Simpanan Baru",
                    date: "25 Februari 2024",
                    time: "14:00 WIB",
                  },
                ].map((agenda, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{agenda.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {agenda.date} • {agenda.time}
                      </p>
                    </div>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
