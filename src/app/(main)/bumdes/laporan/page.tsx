/** @format */

"use client";

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
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function LaporanPage() {
  // NOTE: Keep calling actions optional; these would normally be server-side
  const [finance, setFinance] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [unit, setUnit] = useState<string>("all");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    // TODO integrate API: GET /api/bumdes/reports?unit=...&date=...
    getFinanceReportAction().then(setFinance).catch(() => setFinance(null));
    getBillingReportAction().then(setBilling).catch(() => setBilling(null));
  }, [unit, date]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Unit</span>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="min-w-[200px]"><SelectValue placeholder="Pilih unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Unit</SelectItem>
                  <SelectItem value="UU001">Warung Sembako Desa</SelectItem>
                  <SelectItem value="UU002">Rental Alat Pertanian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tanggal</span>
              <Input type="month" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          {/* TODO integrate API: apply unit/date filters */}
        </CardContent>
      </Card>

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
              {(billing?.overdue_invoices ?? []).slice(0, 5).map((inv: any) => (
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
