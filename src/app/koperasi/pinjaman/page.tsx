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
  Eye,
  CheckCircle,
  XCircle,
  Clock,
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

const pinjamanData = [
  {
    id: "PJ001",
    memberName: "Budi Santoso",
    memberId: "A001",
    amount: "Rp 5,000,000",
    purpose: "Modal Usaha",
    status: "aktif",
    remaining: "Rp 3,200,000",
    installment: "Rp 450,000",
    dueDate: "2024-02-15",
    term: "12 bulan",
  },
  {
    id: "PJ002",
    memberName: "Siti Aminah",
    memberId: "A002",
    amount: "Rp 2,000,000",
    purpose: "Pendidikan",
    status: "menunggu",
    remaining: "Rp 2,000,000",
    installment: "Rp 200,000",
    dueDate: "-",
    term: "10 bulan",
  },
  {
    id: "PJ003",
    memberName: "Ahmad Wijaya",
    memberId: "A003",
    amount: "Rp 3,500,000",
    purpose: "Renovasi Rumah",
    status: "lunas",
    remaining: "Rp 0",
    installment: "Rp 350,000",
    dueDate: "Lunas",
    term: "10 bulan",
  },
];

export default function PinjamanPage() {
  return (
    <ProtectedRoute requiredRole="koperasi">
      <DashboardLayout
        title="Manajemen Pinjaman"
        navigation={koperasiNavigation}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Pinjaman</h2>
              <p className="text-muted-foreground">
                Kelola pinjaman anggota koperasi
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Pengajuan Baru
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Pinjaman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 1.8M</div>
                <p className="text-xs text-muted-foreground">Pinjaman aktif</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Menunggu Persetujuan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Pengajuan baru</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Pinjaman Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Sedang berjalan</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Tunggakan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Perlu tindak lanjut
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
                  <Input placeholder="Cari pinjaman..." className="pl-10" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardContent>
          </Card>

          {/* Loans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pinjaman</CardTitle>
              <CardDescription>
                Status dan detail pinjaman anggota
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pinjamanData.map((pinjaman) => (
                  <div
                    key={pinjaman.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        {pinjaman.status === "aktif" && (
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        )}
                        {pinjaman.status === "menunggu" && (
                          <Clock className="h-6 w-6 text-yellow-600" />
                        )}
                        {pinjaman.status === "lunas" && (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{pinjaman.memberName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pinjaman.id} • {pinjaman.purpose}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pinjaman.amount} • {pinjaman.term}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">
                          Sisa: {pinjaman.remaining}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Angsuran: {pinjaman.installment}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Jatuh tempo: {pinjaman.dueDate}
                        </p>
                      </div>

                      <Badge
                        variant={
                          pinjaman.status === "aktif"
                            ? "default"
                            : pinjaman.status === "menunggu"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {pinjaman.status}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {pinjaman.status === "menunggu" && (
                          <>
                            <Button variant="ghost" size="icon">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
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
