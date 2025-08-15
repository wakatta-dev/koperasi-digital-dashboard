/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
} from "lucide-react";

const dashboardStats = [
  {
    title: "Total Pendapatan",
    value: "Rp 125M",
    change: "+18.2%",
    trend: "up" as const,
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Unit Usaha Aktif",
    value: "12",
    change: "+2",
    trend: "up" as const,
    icon: <Building className="h-4 w-4" />,
  },
  {
    title: "Aset Tersewa",
    value: "8/15",
    change: "+1",
    trend: "up" as const,
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    title: "Warga Terlibat",
    value: "245",
    change: "+23",
    trend: "up" as const,
    icon: <Users className="h-4 w-4" />,
  },
];

export default function BUMDesDashboard() {
  return (
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
            <CardTitle>Unit Usaha Terbaru</CardTitle>
            <CardDescription>Perkembangan unit usaha BUMDes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Warung Sembako Desa",
                  type: "Perdagangan",
                  revenue: "Rp 15,500,000",
                  status: "aktif",
                },
                {
                  name: "Rental Alat Pertanian",
                  type: "Jasa",
                  revenue: "Rp 8,200,000",
                  status: "aktif",
                },
                {
                  name: "Pengolahan Hasil Tani",
                  type: "Produksi",
                  revenue: "Rp 12,800,000",
                  status: "berkembang",
                },
              ].map((unit, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{unit.name}</p>
                    <p className="text-sm text-muted-foreground">{unit.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{unit.revenue}</p>
                    <Badge
                      variant={
                        unit.status === "aktif"
                          ? "default"
                          : unit.status === "berkembang"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {unit.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Sewa Hari Ini</CardTitle>
            <CardDescription>Aset yang disewa hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  asset: "Aula Desa",
                  renter: "Karang Taruna",
                  time: "08:00 - 12:00",
                  status: "berlangsung",
                },
                {
                  asset: "Lapangan Futsal",
                  renter: "Tim Sepakbola Lokal",
                  time: "15:00 - 17:00",
                  status: "terjadwal",
                },
                {
                  asset: "Sound System",
                  renter: "Acara Pernikahan",
                  time: "18:00 - 23:00",
                  status: "terjadwal",
                },
              ].map((schedule, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{schedule.asset}</p>
                    <p className="text-sm text-muted-foreground">
                      {schedule.renter}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{schedule.time}</p>
                    <Badge
                      variant={
                        schedule.status === "berlangsung"
                          ? "default"
                          : schedule.status === "terjadwal"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Fitur yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/unit-usaha"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Building className="h-6 w-6 mb-2" />
              <p className="font-medium">Kelola Unit Usaha</p>
              <p className="text-sm text-muted-foreground">
                Tambah atau edit unit usaha
              </p>
            </a>
            <a
              href="/aset-sewa"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <MapPin className="h-6 w-6 mb-2" />
              <p className="font-medium">Tambah Aset</p>
              <p className="text-sm text-muted-foreground">
                Daftarkan aset baru
              </p>
            </a>
            <a
              href="/jadwal-sewa"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <p className="font-medium">Jadwal Sewa</p>
              <p className="text-sm text-muted-foreground">
                Kelola booking aset
              </p>
            </a>
            <a
              href="/laporan"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="h-6 w-6 mb-2" />
              <p className="font-medium">Laporan</p>
              <p className="text-sm text-muted-foreground">
                Lihat performa BUMDes
              </p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Community Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Dampak Komunitas</CardTitle>
          <CardDescription>Kontribusi BUMDes untuk desa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">245</div>
              <p className="text-sm text-muted-foreground">Warga Terlibat</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Rp 25M</div>
              <p className="text-sm text-muted-foreground">
                Dana Desa Terkumpul
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15</div>
              <p className="text-sm text-muted-foreground">
                Program Pemberdayaan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
