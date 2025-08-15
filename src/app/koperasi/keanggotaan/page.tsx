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
  Users,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Building,
  Receipt,
  FileText,
  Settings,
  MessageCircle,
  Plus,
  Search,
  Edit,
  Eye,
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

const members = [
  {
    id: "A001",
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "081234567890",
    joinDate: "2023-01-15",
    status: "aktif",
    simpananPokok: "Rp 500,000",
    simpananWajib: "Rp 1,200,000",
  },
  {
    id: "A002",
    name: "Siti Aminah",
    email: "siti@email.com",
    phone: "081234567891",
    joinDate: "2023-02-20",
    status: "aktif",
    simpananPokok: "Rp 500,000",
    simpananWajib: "Rp 800,000",
  },
  {
    id: "A003",
    name: "Ahmad Wijaya",
    email: "ahmad@email.com",
    phone: "081234567892",
    joinDate: "2022-12-10",
    status: "non-aktif",
    simpananPokok: "Rp 500,000",
    simpananWajib: "Rp 600,000",
  },
];

export default function KeanggotaanPage() {
  return (
    <ProtectedRoute requiredRole="koperasi">
      <DashboardLayout
        title="Manajemen Keanggotaan"
        navigation={koperasiNavigation}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Keanggotaan</h2>
              <p className="text-muted-foreground">
                Kelola data anggota koperasi
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Anggota
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Anggota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +23 anggota baru bulan ini
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Anggota Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,189</div>
                <p className="text-xs text-muted-foreground">
                  95.3% dari total anggota
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Anggota Baru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Bulan ini</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari anggota..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {/* Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Anggota</CardTitle>
              <CardDescription>Data lengkap anggota koperasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {member.id} • {member.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Bergabung: {member.joinDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Simpanan Pokok: {member.simpananPokok}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Simpanan Wajib: {member.simpananWajib}
                        </p>
                      </div>

                      <Badge
                        variant={
                          member.status === "aktif" ? "default" : "secondary"
                        }
                      >
                        {member.status}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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
