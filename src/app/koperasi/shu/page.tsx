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
  Calculator,
  Download,
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

const shuData = [
  {
    year: "2023",
    totalSHU: "Rp 450,000,000",
    memberShare: "60%",
    memberAmount: "Rp 270,000,000",
    capitalShare: "40%",
    capitalAmount: "Rp 180,000,000",
    status: "dibagikan",
  },
  {
    year: "2022",
    totalSHU: "Rp 380,000,000",
    memberShare: "60%",
    memberAmount: "Rp 228,000,000",
    capitalShare: "40%",
    capitalAmount: "Rp 152,000,000",
    status: "dibagikan",
  },
];

const memberSHU = [
  {
    memberId: "A001",
    memberName: "Budi Santoso",
    transactionShare: "Rp 125,000",
    capitalShare: "Rp 75,000",
    totalSHU: "Rp 200,000",
    status: "dibayar",
  },
  {
    memberId: "A002",
    memberName: "Siti Aminah",
    transactionShare: "Rp 95,000",
    capitalShare: "Rp 55,000",
    totalSHU: "Rp 150,000",
    status: "dibayar",
  },
  {
    memberId: "A003",
    memberName: "Ahmad Wijaya",
    transactionShare: "Rp 85,000",
    capitalShare: "Rp 45,000",
    totalSHU: "Rp 130,000",
    status: "belum_dibayar",
  },
];

export default function SHUPage() {
  return (
    <ProtectedRoute requiredRole="koperasi">
      <DashboardLayout
        title="Sisa Hasil Usaha (SHU)"
        navigation={koperasiNavigation}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Sisa Hasil Usaha (SHU)</h2>
              <p className="text-muted-foreground">
                Kelola pembagian SHU kepada anggota
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Hitung SHU
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* SHU Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total SHU 2023
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 450M</div>
                <p className="text-xs text-muted-foreground">
                  +18.4% dari tahun sebelumnya
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Bagian Anggota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 270M</div>
                <p className="text-xs text-muted-foreground">
                  60% dari total SHU
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Bagian Modal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 180M</div>
                <p className="text-xs text-muted-foreground">
                  40% dari total SHU
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SHU History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat SHU</CardTitle>
              <CardDescription>Data SHU per tahun</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shuData.map((shu) => (
                  <div
                    key={shu.year}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">SHU Tahun {shu.year}</h3>
                        <p className="text-sm text-muted-foreground">
                          Total: {shu.totalSHU}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Anggota: {shu.memberAmount} ({shu.memberShare})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Modal: {shu.capitalAmount} ({shu.capitalShare})
                        </p>
                      </div>

                      <Badge variant="default">{shu.status}</Badge>

                      <Button variant="ghost" size="sm">
                        Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Member SHU Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pembagian SHU Anggota 2023</CardTitle>
              <CardDescription>Detail SHU per anggota</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberSHU.map((member) => (
                  <div
                    key={member.memberId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{member.memberName}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {member.memberId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Total SHU: {member.totalSHU}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Transaksi: {member.transactionShare} • Modal:{" "}
                          {member.capitalShare}
                        </p>
                      </div>

                      <Badge
                        variant={
                          member.status === "dibayar" ? "default" : "secondary"
                        }
                      >
                        {member.status === "dibayar"
                          ? "Dibayar"
                          : "Belum Dibayar"}
                      </Badge>

                      <Button variant="ghost" size="sm">
                        Bayar
                      </Button>
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
