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
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react";

const salesData = [
  {
    period: "Hari Ini",
    revenue: "Rp 2,450,000",
    transactions: 23,
    growth: "+12.5%",
  },
  {
    period: "Minggu Ini",
    revenue: "Rp 15,200,000",
    transactions: 156,
    growth: "+8.3%",
  },
  {
    period: "Bulan Ini",
    revenue: "Rp 58,750,000",
    transactions: 642,
    growth: "+15.7%",
  },
  {
    period: "Tahun Ini",
    revenue: "Rp 485,600,000",
    transactions: 5847,
    growth: "+22.1%",
  },
];

const topProducts = [
  {
    name: "Kopi Arabica Premium",
    sold: 145,
    revenue: "Rp 2,175,000",
    trend: "up",
  },
  { name: "Nasi Gudeg", sold: 98, revenue: "Rp 1,764,000", trend: "up" },
  { name: "Paket Hemat", sold: 67, revenue: "Rp 2,680,000", trend: "up" },
  {
    name: "Roti Bakar Spesial",
    sold: 54,
    revenue: "Rp 648,000",
    trend: "down",
  },
  { name: "Es Teh Manis", sold: 234, revenue: "Rp 1,170,000", trend: "up" },
];

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laporan</h2>
          <p className="text-muted-foreground">
            Analisis penjualan dan performa UMKM
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

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesData.map((data) => (
          <Card key={data.period}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {data.period}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.revenue}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">
                  {data.transactions} transaksi
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">{data.growth}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Penjualan</CardTitle>
            <CardDescription>Penjualan 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Grafik Penjualan</p>
                <p className="text-sm text-muted-foreground">
                  Data visualisasi akan ditampilkan di sini
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Produk</CardTitle>
            <CardDescription>Distribusi penjualan per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  category: "Minuman",
                  percentage: 45,
                  revenue: "Rp 26,437,500",
                },
                {
                  category: "Makanan",
                  percentage: 35,
                  revenue: "Rp 20,562,500",
                },
                {
                  category: "Paket",
                  percentage: 20,
                  revenue: "Rp 11,750,000",
                },
              ].map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.revenue}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produk Terlaris</CardTitle>
          <CardDescription>
            Produk dengan penjualan tertinggi bulan ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.sold} terjual
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                    <div className="flex items-center gap-1">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <Badge
                        variant={
                          product.trend === "up" ? "default" : "secondary"
                        }
                      >
                        {product.trend === "up" ? "Naik" : "Turun"}
                      </Badge>
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
