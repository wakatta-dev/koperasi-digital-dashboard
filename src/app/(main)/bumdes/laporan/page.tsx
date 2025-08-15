/** @format */

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
  BarChart3,
  Building,
  Download,
  TrendingUp,
  TrendingDown,
  MapPin,
  DollarSign,
  Users,
} from "lucide-react";

const performanceData = [
  {
    period: "Bulan Ini",
    revenue: "Rp 125,000,000",
    growth: "+18.2%",
    trend: "up",
  },
  {
    period: "Kuartal Ini",
    revenue: "Rp 350,000,000",
    growth: "+22.5%",
    trend: "up",
  },
  {
    period: "Tahun Ini",
    revenue: "Rp 1,200,000,000",
    growth: "+15.8%",
    trend: "up",
  },
];

const unitPerformance = [
  {
    name: "Warung Sembako Desa",
    revenue: "Rp 45,000,000",
    growth: "+12%",
    trend: "up",
    contribution: "36%",
  },
  {
    name: "Rental Alat Pertanian",
    revenue: "Rp 28,000,000",
    growth: "+8%",
    trend: "up",
    contribution: "22%",
  },
  {
    name: "Pengolahan Hasil Tani",
    revenue: "Rp 32,000,000",
    growth: "+25%",
    trend: "up",
    contribution: "26%",
  },
  {
    name: "Wisata Desa",
    revenue: "Rp 20,000,000",
    growth: "-5%",
    trend: "down",
    contribution: "16%",
  },
];

const assetUtilization = [
  {
    asset: "Aula Desa",
    utilization: "85%",
    revenue: "Rp 8,500,000",
    bookings: 23,
  },
  {
    asset: "Lapangan Futsal",
    utilization: "72%",
    revenue: "Rp 5,400,000",
    bookings: 36,
  },
  {
    asset: "Sound System",
    utilization: "45%",
    revenue: "Rp 2,250,000",
    bookings: 15,
  },
  {
    asset: "Tenda Pesta",
    utilization: "38%",
    revenue: "Rp 1,900,000",
    bookings: 12,
  },
];

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laporan</h2>
          <p className="text-muted-foreground">
            Analisis kinerja dan dampak BUMDes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceData.map((data) => (
          <Card key={data.period}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {data.period}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.revenue}</div>
              <div className="flex items-center gap-1 text-xs mt-2">
                {data.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    data.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {data.growth}
                </span>
                <span className="text-muted-foreground">
                  dari periode sebelumnya
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Pendapatan</CardTitle>
            <CardDescription>Pendapatan 12 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Grafik Pendapatan</p>
                <p className="text-sm text-muted-foreground">
                  Data visualisasi akan ditampilkan di sini
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dampak Sosial</CardTitle>
            <CardDescription>
              Kontribusi BUMDes untuk masyarakat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Warga Terlibat</span>
                </div>
                <span className="font-bold">245 orang</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Dana Desa Terkumpul</span>
                </div>
                <span className="font-bold">Rp 25M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Program Pemberdayaan</span>
                </div>
                <span className="font-bold">15 program</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Peningkatan Ekonomi</span>
                </div>
                <span className="font-bold text-green-600">+32%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Kinerja Unit Usaha</CardTitle>
          <CardDescription>
            Pendapatan dan kontribusi setiap unit usaha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unitPerformance.map((unit) => (
              <div
                key={unit.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{unit.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Kontribusi: {unit.contribution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{unit.revenue}</p>
                    <div className="flex items-center gap-1">
                      {unit.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={
                          unit.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {unit.growth}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={unit.trend === "up" ? "default" : "secondary"}
                  >
                    {unit.trend === "up" ? "Naik" : "Turun"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisasi Aset Sewa</CardTitle>
          <CardDescription>
            Tingkat penggunaan dan pendapatan aset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assetUtilization.map((asset) => (
              <div
                key={asset.asset}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{asset.asset}</h3>
                    <p className="text-sm text-muted-foreground">
                      {asset.bookings} booking bulan ini
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{asset.revenue}</p>
                    <p className="text-sm text-muted-foreground">
                      Utilisasi: {asset.utilization}
                    </p>
                  </div>

                  <div className="w-20">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: asset.utilization }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
