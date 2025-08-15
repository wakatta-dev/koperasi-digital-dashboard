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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Building,
  Calendar,
  FileText,
  Settings,
  Plus,
  Search,
  Edit,
  Eye,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";

const bumdesNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Unit Usaha",
    href: "/unit-usaha",
    icon: <Building className="h-4 w-4" />,
  },
  {
    name: "Aset Sewa",
    href: "/aset-sewa",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    name: "Jadwal Sewa",
    href: "/jadwal-sewa",
    icon: <Calendar className="h-4 w-4" />,
  },
  { name: "Laporan", href: "/laporan", icon: <FileText className="h-4 w-4" /> },
  {
    name: "Pengaturan",
    href: "/pengaturan",
    icon: <Settings className="h-4 w-4" />,
  },
];

const rentalAssets = [
  {
    id: "AS001",
    name: "Aula Desa",
    type: "Ruangan",
    capacity: "200 orang",
    pricePerHour: "Rp 150,000",
    pricePerDay: "Rp 1,000,000",
    location: "Balai Desa",
    facilities: ["AC", "Sound System", "Proyektor", "Kursi", "Meja"],
    status: "tersedia",
    nextBooking: "2024-02-20",
  },
  {
    id: "AS002",
    name: "Lapangan Futsal",
    type: "Olahraga",
    capacity: "14 pemain",
    pricePerHour: "Rp 75,000",
    pricePerDay: "Rp 500,000",
    location: "Area Olahraga Desa",
    facilities: ["Lampu", "Gawang", "Bola", "Rompi"],
    status: "disewa",
    nextBooking: "2024-02-18",
  },
  {
    id: "AS003",
    name: "Sound System Portable",
    type: "Peralatan",
    capacity: "500 watt",
    pricePerHour: "Rp 50,000",
    pricePerDay: "Rp 300,000",
    location: "Gudang BUMDes",
    facilities: ["Mixer", "Microphone", "Speaker", "Kabel"],
    status: "tersedia",
    nextBooking: "2024-02-25",
  },
  {
    id: "AS004",
    name: "Tenda Pesta",
    type: "Peralatan",
    capacity: "100 orang",
    pricePerHour: "Rp 25,000",
    pricePerDay: "Rp 150,000",
    location: "Gudang BUMDes",
    facilities: ["Tenda 5x10m", "Kursi Plastik", "Meja Lipat"],
    status: "maintenance",
    nextBooking: "-",
  },
];

export default function AsetSewaPage() {
  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout
        title="Manajemen Aset Sewa"
        navigation={bumdesNavigation}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Aset Sewa</h2>
              <p className="text-muted-foreground">
                Kelola aset yang dapat disewakan
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Aset
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Aset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Aset tersedia</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Sedang Disewa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  53% tingkat okupansi
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Pendapatan Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 12M</div>
                <p className="text-xs text-muted-foreground">
                  +25% dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Booking Mendatang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">7 hari ke depan</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari aset..." className="pl-10" />
                </div>
                <Button variant="outline">Filter Kategori</Button>
                <Button variant="outline">Filter Status</Button>
              </div>
            </CardContent>
          </Card>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rentalAssets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <CardDescription>
                        {asset.type} • {asset.location}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        asset.status === "tersedia"
                          ? "default"
                          : asset.status === "disewa"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {asset.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Kapasitas</p>
                      <p className="font-medium">{asset.capacity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking Berikutnya
                      </p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{asset.nextBooking}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Tarif Sewa</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {asset.pricePerHour}/jam
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">
                          {asset.pricePerDay}/hari
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Fasilitas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {asset.facilities.map((facility, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Jadwal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
