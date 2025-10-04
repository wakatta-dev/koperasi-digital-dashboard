/** @format */

"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PiggyBank, CreditCard, DollarSign, RefreshCcw } from "lucide-react";
import { getKoperasiDashboard } from "@/services/api";
import type { KoperasiDashboardSummary } from "@/types/api";
import { toast } from "sonner";

const numberFormatter = new Intl.NumberFormat("id-ID");
const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function SummaryCards({ initial }: { initial: KoperasiDashboardSummary | null }) {
  const [data, setData] = useState<KoperasiDashboardSummary | null>(initial);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await getKoperasiDashboard();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(res.data ?? null);
        if (!res.success) {
          toast.error(res.message || "Gagal memuat ringkasan dashboard");
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat ringkasan dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(
    () => [
      {
        title: "Total Anggota",
        value: typeof data?.active_members === "number" ? numberFormatter.format(data.active_members) : "-",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Total Simpanan",
        value: typeof data?.total_savings === "number" ? currencyFormatter.format(data.total_savings) : "-",
        icon: <PiggyBank className="h-4 w-4" />,
      },
      {
        title: "Total Pinjaman",
        value: typeof data?.total_loans === "number" ? currencyFormatter.format(data.total_loans) : "-",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        title: "SHU Berjalan",
        value: typeof data?.running_shu === "number" ? currencyFormatter.format(data.running_shu) : "-",
        icon: <DollarSign className="h-4 w-4" />,
      },
    ],
    [data]
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCcw className="h-4 w-4 mr-2" /> {loading ? "Menyegarkan..." : "Segarkan"}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{String(stat.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
