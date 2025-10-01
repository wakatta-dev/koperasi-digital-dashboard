/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowUpRight,
  Building,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { getBumdesDashboard } from "@/services/api";
import type {
  BumdesDashboardSummary,
  DashboardNotification,
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

export default async function BumdesDashboard() {
  const response = await getBumdesDashboard().catch(() => null);
  const summary =
    response && response.success
      ? (response.data as BumdesDashboardSummary | null)
      : null;

  const revenuePerUnit = summary?.revenue_per_unit ?? [];
  const bookingNotifications = summary?.booking_notifications ?? [];
  const rentalNotifications = summary?.rental_notifications ?? [];
  const hasSummary = Boolean(summary);

  const unitCount = revenuePerUnit.length;
  const highestRevenue = unitCount
    ? Math.max(...revenuePerUnit)
    : null;
  const averageRevenue = unitCount
    ? revenuePerUnit.reduce((acc, value) => acc + value, 0) / unitCount
    : null;
  const consolidatedRevenue =
    typeof summary?.consolidated_revenue === "number"
      ? summary.consolidated_revenue
      : null;

  return (
    <div className="space-y-6">
      {!summary && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ringkasan tidak tersedia</AlertTitle>
          <AlertDescription>
            Data dashboard BUMDes belum tersedia atau sedang diproses oleh
            sistem.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendapatan Konsolidasi
            </CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(consolidatedRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total gabungan seluruh unit usaha
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jumlah Unit Usaha
            </CardTitle>
            <Building className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasSummary ? formatNumber(unitCount) : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              Berdasarkan data pendapatan per unit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendapatan Rata-rata
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(averageRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Perkiraan rata-rata per unit usaha
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendapatan Tertinggi
            </CardTitle>
            <ArrowUpRight className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(highestRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Unit dengan kontribusi terbesar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pendapatan per Unit Usaha</CardTitle>
          <CardDescription>
            Data agregat dari `revenue_per_unit` pada ringkasan dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueDistribution data={revenuePerUnit} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <NotificationsCard
          title="Notifikasi Booking"
          description="Informasi terbaru mengenai pemesanan aset"
          items={bookingNotifications}
          emptyMessage="Belum ada notifikasi booking"
        />
        <NotificationsCard
          title="Notifikasi Penyewaan"
          description="Status sewa aset BUMDes"
          items={rentalNotifications}
          emptyMessage="Belum ada notifikasi penyewaan"
        />
      </div>
    </div>
  );
}

function RevenueDistribution({ data }: { data: number[] }) {
  if (!data.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Data pendapatan per unit belum tersedia.
      </div>
    );
  }

  const maxValue = Math.max(...data, 0);

  return (
    <div className="space-y-4">
      {data.map((value, index) => {
        const percentage = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
        return (
          <div key={index} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Unit {index + 1}</span>
              <span>{formatCurrency(value)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Kontribusi sekitar {percentage}% dari unit dengan pendapatan tertinggi
            </p>
          </div>
        );
      })}
    </div>
  );
}

function NotificationsCard({
  title,
  description,
  items,
  emptyMessage,
}: {
  title: string;
  description: string;
  items: DashboardNotification[];
  emptyMessage: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
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
          {!items.length && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
