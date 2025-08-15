/** @format */

import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { ProtectedRoute } from "@/components/shared/protected-route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Settings,
  FileText,
  Calculator,
} from "lucide-react";

const umkmNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Inventaris",
    href: "/inventaris",
    icon: <Package className="h-4 w-4" />,
  },
  {
    name: "Harga Bertingkat",
    href: "/harga-bertingkat",
    icon: <Calculator className="h-4 w-4" />,
  },
  { name: "POS", href: "/pos", icon: <ShoppingCart className="h-4 w-4" /> },
  { name: "Laporan", href: "/laporan", icon: <FileText className="h-4 w-4" /> },
  {
    name: "Pengaturan",
    href: "/pengaturan",
    icon: <Settings className="h-4 w-4" />,
  },
];

const dashboardStats = [
  {
    title: "Penjualan Hari Ini",
    value: "Rp 2,450,000",
    change: "+12.5%",
    trend: "up" as const,
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Total Produk",
    value: "156",
    change: "+8",
    trend: "up" as const,
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: "Transaksi Hari Ini",
    value: "23",
    change: "+15%",
    trend: "up" as const,
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    title: "Stok Menipis",
    value: "5",
    change: "-2",
    trend: "down" as const,
    icon: <AlertTriangle className="h-4 w-4" />,
  },
];

export default function UMKMDashboard() {
  return (
    <ProtectedRoute requiredRole="umkm">
      <DashboardLayout title="Dashboard UMKM" navigation={umkmNavigation}>
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
                    <span>dari kemarin</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaksi Terbaru</CardTitle>
                <CardDescription>Penjualan hari ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      customer: "Pelanggan Reguler",
                      items: "Kopi Arabica x2, Roti Bakar x1",
                      amount: "Rp 45,000",
                      time: "10:30",
                    },
                    {
                      customer: "Pelanggan Baru",
                      items: "Nasi Gudeg x1, Es Teh x1",
                      amount: "Rp 25,000",
                      time: "11:15",
                    },
                    {
                      customer: "Pelanggan VIP",
                      items: "Paket Hemat x3",
                      amount: "Rp 120,000",
                      time: "12:00",
                    },
                  ].map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{transaction.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.items}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.time}
                        </p>
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
                    href="/pos"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <ShoppingCart className="h-6 w-6 mb-2" />
                    <p className="font-medium">Buka POS</p>
                    <p className="text-sm text-muted-foreground">
                      Mulai transaksi
                    </p>
                  </a>
                  <a
                    href="/inventaris"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Package className="h-6 w-6 mb-2" />
                    <p className="font-medium">Tambah Produk</p>
                    <p className="text-sm text-muted-foreground">
                      Kelola inventaris
                    </p>
                  </a>
                  <a
                    href="/harga-bertingkat"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Calculator className="h-6 w-6 mb-2" />
                    <p className="font-medium">Atur Harga</p>
                    <p className="text-sm text-muted-foreground">
                      Harga bertingkat
                    </p>
                  </a>
                  <a
                    href="/laporan"
                    className="p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    <p className="font-medium">Laporan</p>
                    <p className="text-sm text-muted-foreground">
                      Analisis penjualan
                    </p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Peringatan Stok
              </CardTitle>
              <CardDescription>Produk dengan stok menipis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    product: "Kopi Arabica Premium",
                    stock: 5,
                    minStock: 10,
                    category: "Minuman",
                  },
                  {
                    product: "Roti Bakar Spesial",
                    stock: 3,
                    minStock: 15,
                    category: "Makanan",
                  },
                  {
                    product: "Es Krim Vanilla",
                    stock: 2,
                    minStock: 8,
                    category: "Dessert",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-700">
                        Stok: {item.stock}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Min: {item.minStock}
                      </p>
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
