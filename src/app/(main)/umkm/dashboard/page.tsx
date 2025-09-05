/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Note: Chart placeholder to avoid client-only lib in server build
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

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
  // TODO integrate API: KPIs, weekly sales chart, notifications, and top products
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
                <span>dari kemarin</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Sales Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grafik Penjualan Mingguan</CardTitle>
            <CardDescription>Ringkasan penjualan 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                {/* TODO integrate API: render weekly sales chart */}
                <span className="text-muted-foreground text-sm">Grafik penjualan akan ditambahkan</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <div key={index} className="flex items-center justify-between">
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
            <CardTitle>Notifikasi</CardTitle>
            <CardDescription>Update terbaru untuk Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO integrate API: fetch notifications */}
            <div className="space-y-3">
              {["Stok 'Es Teh Manis' menurun", "Invoice #INV-1002 jatuh tempo 3 hari lagi", "Fitur Marketplace tersedia untuk diaktifkan"].map((n, i) => (
                <div key={i} className="p-3 border rounded-md text-sm">{n}</div>
              ))}
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

      {/* Top products */}
      <Card>
        <CardHeader>
          <CardTitle>Produk Terlaris</CardTitle>
          <CardDescription>Minggu ini</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO integrate API: fetch top-selling products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Kopi Arabica Premium", sold: 42 },
              { name: "Roti Bakar Spesial", sold: 35 },
              { name: "Nasi Gudeg", sold: 28 },
            ].map((p) => (
              <div key={p.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{p.name}</p>
                  <span className="text-sm text-muted-foreground">{p.sold} terjual</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
