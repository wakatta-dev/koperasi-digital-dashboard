/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";
import { getFinanceReportAction, getBillingReportAction } from "@/actions/reporting";

export default async function LaporanPage() {
  const finance = await getFinanceReportAction().catch(() => null);
  const billing = await getBillingReportAction().catch(() => null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laporan</h2>
          <p className="text-muted-foreground">Ringkasan BUMDes</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {finance ? finance.total_income : 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {finance ? finance.total_expense : 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Saldo Akhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {finance ? finance.ending_balance : 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts / Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Keuangan</CardTitle>
            <CardDescription>Ringkasan per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Grafik akan ditambahkan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tagihan Overdue</CardTitle>
            <CardDescription>Tagihan terlambat terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {(billing?.overdue_invoices ?? []).slice(0, 5).map((inv) => (
                <div key={inv.id} className="flex justify-between">
                  <span>#{inv.number}</span>
                  <span>Rp {inv.total}</span>
                </div>
              ))}
              {(!billing || (billing.overdue_invoices ?? []).length === 0) && (
                <div className="text-muted-foreground italic">Tidak ada data</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
