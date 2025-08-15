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
  TrendingUp,
  Users,
  MapPin,
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

const businessUnits = [
  {
    id: "UU001",
    name: "Warung Sembako Desa",
    type: "Perdagangan",
    manager: "Ibu Sari",
    revenue: "Rp 15,500,000",
    employees: 3,
    status: "aktif",
    location: "Pusat Desa",
    established: "2023-01-15",
  },
  {
    id: "UU002",
    name: "Rental Alat Pertanian",
    type: "Jasa",
    manager: "Pak Budi",
    revenue: "Rp 8,200,000",
    employees: 2,
    status: "aktif",
    location: "Area Pertanian",
    established: "2023-03-20",
  },
  {
    id: "UU003",
    name: "Pengolahan Hasil Tani",
    type: "Produksi",
    manager: "Ibu Dewi",
    revenue: "Rp 12,800,000",
    employees: 5,
    status: "berkembang",
    location: "Kawasan Industri Desa",
    established: "2023-06-10",
  },
  {
    id: "UU004",
    name: "Wisata Desa",
    type: "Pariwisata",
    manager: "Pak Ahmad",
    revenue: "Rp 6,500,000",
    employees: 4,
    status: "musiman",
    location: "Area Wisata",
    established: "2023-08-05",
  },
];

export default function UnitUsahaPage() {
  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout
        title="Manajemen Unit Usaha"
        navigation={bumdesNavigation}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Unit Usaha</h2>
              <p className="text-muted-foreground">Kelola unit usaha BUMDes</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Unit Usaha
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Unit Usaha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 unit baru</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Unit Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground">75% dari total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Karyawan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Warga terlibat</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Pendapatan Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 43M</div>
                <p className="text-xs text-muted-foreground">
                  +18.2% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari unit usaha..." className="pl-10" />
                </div>
                <Button variant="outline">Filter Kategori</Button>
              </div>
            </CardContent>
          </Card>

          {/* Business Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessUnits.map((unit) => (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{unit.name}</CardTitle>
                      <CardDescription>
                        {unit.type} • {unit.location}
                      </CardDescription>
                    </div>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Pengelola</p>
                      <p className="font-medium">{unit.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Karyawan</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">
                          {unit.employees} orang
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pendapatan Bulan Ini
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{unit.revenue}</p>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>+15%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Didirikan</p>
                    <p className="font-medium">{unit.established}</p>
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
