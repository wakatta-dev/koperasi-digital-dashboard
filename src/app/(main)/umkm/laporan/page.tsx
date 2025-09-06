/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
          <p className="text-muted-foreground">Ringkasan keuangan dan billing</p>
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

      {/* Filter Waktu */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Periode</p>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih rentang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 hari</SelectItem>
                  <SelectItem value="30">30 hari</SelectItem>
                  <SelectItem value="90">90 hari</SelectItem>
                  <SelectItem value="365">1 tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Rentang</p>
              <DateRangePicker triggerClassName="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {finance ? finance.total_income : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {finance ? finance.total_expense : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Saldo Akhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {finance ? finance.ending_balance : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tagihan</CardTitle>
            <CardDescription>
              Total: {billing ? billing.total_invoices : 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Paid: {billing ? (billing as any).total_paid ?? billing.status_detail?.paid ?? 0 : 0} • Pending: {billing ? (billing as any).total_pending ?? billing.status_detail?.pending ?? 0 : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder (future) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Keuangan</CardTitle>
            <CardDescription>Ringkasan pemasukan/pengeluaran per bulan</CardDescription>
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
            <CardTitle>Invoice Overdue</CardTitle>
            <CardDescription>Daftar tagihan yang terlambat</CardDescription>
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

      {/* Laporan Terperinci */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Penjualan</CardTitle>
            <CardDescription>Total, rata-rata, dan tren</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO integrate API: sales report */}
            <div className="text-sm text-muted-foreground">Data penjualan akan ditampilkan di sini.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Arus Kas</CardTitle>
            <CardDescription>Penerimaan dan pengeluaran kas</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO integrate API: cash flow */}
            <div className="text-sm text-muted-foreground">Ringkasan arus kas akan ditampilkan di sini.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Neraca</CardTitle>
            <CardDescription>Aset, kewajiban, dan ekuitas</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO integrate API: balance sheet */}
            <div className="text-sm text-muted-foreground">Neraca akan ditampilkan di sini.</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laba Rugi</CardTitle>
          <CardDescription>Pendapatan, HPP, dan beban</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO integrate API: profit & loss */}
          <div className="text-sm text-muted-foreground">Laporan laba rugi akan ditampilkan di sini.</div>
        </CardContent>
      </Card>
    </div>
  );
}
