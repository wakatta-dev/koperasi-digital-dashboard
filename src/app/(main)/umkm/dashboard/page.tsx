/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import { getUmkmDashboard } from "@/services/api";
import type {
  DashboardNotification,
  UmkmDashboardSummary,
} from "@/types/api";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("id-ID");

function formatCurrency(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return currencyFormatter.format(value);
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return numberFormatter.format(value);
}

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function UmkmDashboard() {
  const response = await getUmkmDashboard().catch(() => null);
  const summary =
    response && response.success
      ? (response.data as UmkmDashboardSummary | null)
      : null;

  const hasSummary = Boolean(summary);
  const topProducts = summary?.top_products ?? [];
  const lowStockNotifications = summary?.low_stock_notifications ?? [];
  const topProductsCount = hasSummary ? topProducts.length : null;
  const lowStockCount = hasSummary ? lowStockNotifications.length : null;

  const stats = [
    {
      title: "Penjualan Hari Ini",
      value: formatCurrency(summary?.daily_sales ?? null),
      icon: <DollarSign className="h-4 w-4" />,
      hint: "Nilai transaksi bruto"
    },
    {
      title: "Pesanan Hari Ini",
      value: formatNumber(summary?.daily_orders ?? null),
      icon: <ShoppingCart className="h-4 w-4" />,
      hint: "Jumlah order yang tercatat"
    },
    {
      title: "Produk Teratas",
      value: formatNumber(topProductsCount),
      icon: <Package className="h-4 w-4" />,
      hint: "Daftar produk performa terbaik"
    },
    {
      title: "Notifikasi Stok",
      value: formatNumber(lowStockCount),
      icon: <AlertTriangle className="h-4 w-4" />,
      hint: "Peringatan stok menipis"
    },
  ];

  return (
    <div className="space-y-6">
      {!summary && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ringkasan tidak tersedia</AlertTitle>
          <AlertDescription>
            Data dashboard UMKM belum tersedia atau sedang diproses oleh sistem.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produk Teratas</CardTitle>
            <CardDescription>
              Daftar `top_products` dari ringkasan dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length ? (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={`${product}-${index}`}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-medium">{product}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Produk teratas belum tersedia.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifikasi Stok Menipis</CardTitle>
            <CardDescription>
              Diambil dari `low_stock_notifications`
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockList
              items={lowStockNotifications}
              emptyMessage="Tidak ada peringatan stok saat ini"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LowStockList({
  items,
  emptyMessage,
}: {
  items: DashboardNotification[];
  emptyMessage: string;
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.slice(0, 8).map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between gap-3 rounded-lg border p-3"
        >
          <div className="min-w-0 space-y-1 text-sm">
            <p className="font-medium">{item.title || "Notifikasi"}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(item.created_at)}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs uppercase">
            {item.type || "INFO"}
          </Badge>
        </div>
      ))}
    </div>
  );
}
