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
  User,
  Phone,
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

const bookings = [
  {
    id: "BK001",
    asset: "Aula Desa",
    renter: "Karang Taruna Desa Maju",
    contact: "081234567890",
    date: "2024-02-18",
    startTime: "08:00",
    endTime: "12:00",
    duration: "4 jam",
    totalPrice: "Rp 600,000",
    purpose: "Rapat Koordinasi Tahunan",
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: "BK002",
    asset: "Lapangan Futsal",
    renter: "Tim Sepakbola Lokal",
    contact: "081234567891",
    date: "2024-02-18",
    startTime: "15:00",
    endTime: "17:00",
    duration: "2 jam",
    totalPrice: "Rp 150,000",
    purpose: "Latihan Rutin",
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: "BK003",
    asset: "Sound System Portable",
    renter: "Keluarga Besar Santoso",
    contact: "081234567892",
    date: "2024-02-19",
    startTime: "18:00",
    endTime: "23:00",
    duration: "5 jam",
    totalPrice: "Rp 250,000",
    purpose: "Acara Pernikahan",
    status: "pending",
    paymentStatus: "unpaid",
  },
  {
    id: "BK004",
    asset: "Tenda Pesta",
    renter: "RT 05 RW 02",
    contact: "081234567893",
    date: "2024-02-20",
    startTime: "06:00",
    endTime: "18:00",
    duration: "12 jam",
    totalPrice: "Rp 300,000",
    purpose: "Gotong Royong Desa",
    status: "confirmed",
    paymentStatus: "partial",
  },
];

export default function JadwalSewaPage() {
  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout title="Jadwal Sewa Aset" navigation={bumdesNavigation}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Jadwal Sewa</h2>
              <p className="text-muted-foreground">
                Kelola booking dan jadwal sewa aset
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Booking
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Booking Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Jadwal aktif</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Booking Minggu Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +3 dari minggu lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Menunggu Konfirmasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Perlu tindak lanjut
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Pendapatan Minggu Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 3.2M</div>
                <p className="text-xs text-muted-foreground">
                  +18% dari minggu lalu
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari booking..." className="pl-10" />
                </div>
                <Button variant="outline">Filter Tanggal</Button>
                <Button variant="outline">Filter Status</Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Booking</CardTitle>
              <CardDescription>
                Jadwal sewa aset yang akan datang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{booking.asset}</h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.purpose}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {booking.startTime} - {booking.endTime}
                            </span>
                            <span>({booking.duration})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <Badge
                          variant={
                            booking.paymentStatus === "paid"
                              ? "default"
                              : booking.paymentStatus === "partial"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {booking.paymentStatus === "paid"
                            ? "Lunas"
                            : booking.paymentStatus === "partial"
                            ? "Sebagian"
                            : "Belum Bayar"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Penyewa</p>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{booking.renter}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kontak</p>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span className="font-medium">{booking.contact}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Biaya
                        </p>
                        <p className="font-bold text-lg">
                          {booking.totalPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {booking.status === "pending" && (
                        <Button size="sm">Konfirmasi</Button>
                      )}
                      {booking.paymentStatus !== "paid" && (
                        <Button variant="outline" size="sm">
                          Tagih Pembayaran
                        </Button>
                      )}
                    </div>
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
