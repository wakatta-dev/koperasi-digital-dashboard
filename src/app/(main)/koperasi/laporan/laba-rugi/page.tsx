/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportReportRaw, getProfitLossReport } from "@/services/api";

type ProfitLossItem = {
  label: string;
  profit: number;
  loss: number;
};

type ProfitLossViewState = {
  income: number;
  expense: number;
  net: number;
  items: ProfitLossItem[];
};

export default function LaporanLabaRugiPage() {
  const [period, setPeriod] = useState<string>("");
  const [data, setData] = useState<ProfitLossViewState | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<false | 'pdf' | 'xlsx'>(false);

  async function onFilter() {
    setLoading(true);
    try {
      const [year, month] = period.split("-");
      const start = period ? `${year}-${month}-01` : undefined;
      const res = await getProfitLossReport({ start });
      if (res.success) {
        const report = res.data;
        const breakdown = report?.breakdown ?? [];
        const items: ProfitLossItem[] = breakdown.map((entry) => ({
          label: entry.account,
          profit: entry.amount > 0 ? entry.amount : 0,
          loss: entry.amount < 0 ? Math.abs(entry.amount) : 0,
        }));
        const income = typeof report?.revenue === "number"
          ? report.revenue
          : items.reduce((acc, it) => acc + it.profit, 0);
        const expense = typeof report?.expense === "number"
          ? report.expense
          : items.reduce((acc, it) => acc + it.loss, 0);
        const net = typeof report?.net_income === "number" ? report.net_income : income - expense;
        setData({ income, expense, net, items });
      }
    } finally {
      setLoading(false);
    }
  }

  async function onExport(format: 'pdf' | 'xlsx') {
    setExporting(format);
    try {
      const [year, month] = (period || '').split("-");
      const start = period ? `${year}-${month}-01` : undefined;
      const blob = await exportReportRaw({ type: 'profit-loss', start, format });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `laporan-laba-rugi${period ? `-${period}` : ''}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laba Rugi</h2>
          <p className="text-muted-foreground">Pendapatan, Beban, dan Laba Bersih</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Periode (YYYY-MM)" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-40" />
          <Button variant="outline" onClick={onFilter} disabled={loading}>{loading ? "Memuat..." : "Filter"}</Button>
          <Button onClick={() => onExport('pdf')} disabled={!!exporting}>{exporting === 'pdf' ? 'Mengekspor...' : 'Export PDF'}</Button>
          <Button variant="secondary" onClick={() => onExport('xlsx')} disabled={!!exporting}>{exporting === 'xlsx' ? 'Mengekspor...' : 'Export Excel'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan</CardTitle>
            <CardDescription>Operasional & lainnya</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {(data?.items ?? []).map((it, idx: number) => (
                <li key={idx}>{it.label}: {it.profit ?? 0}</li>
              ))}
              {!data?.items?.length && (
                <li className="text-muted-foreground italic">-</li>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Beban</CardTitle>
            <CardDescription>Gaji, operasional, dll</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {(data?.items ?? []).map((it, idx: number) => (
                <li key={idx}>{it.label}: {it.loss ?? 0}</li>
              ))}
              {!data?.items?.length && (
                <li className="text-muted-foreground italic">-</li>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Laba Bersih</CardTitle>
            <CardDescription>Pendapatan - Beban</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{typeof data?.net === 'number' ? data.net : '-'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
