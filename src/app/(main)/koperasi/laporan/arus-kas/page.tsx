/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportReportRaw, getCashflowReport } from "@/services/api";

export default function LaporanArusKasPage() {
  const [period, setPeriod] = useState<string>("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<false | 'pdf' | 'xlsx'>(false);

  async function onFilter() {
    setLoading(true);
    try {
      const [year, month] = period.split("-");
      const start = period ? `${year}-${month}-01` : undefined;
      const res = await getCashflowReport({ start });
      if (res.success) setData(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function onExport(format: 'pdf' | 'xlsx') {
    setExporting(format);
    try {
      const [year, month] = (period || '').split("-");
      const start = period ? `${year}-${month}-01` : undefined;
      const blob = await exportReportRaw({ type: 'cashflow', start, format });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `laporan-arus-kas${period ? `-${period}` : ''}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
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
          <h2 className="text-2xl font-bold">Arus Kas</h2>
          <p className="text-muted-foreground">Operasional, Investasi, dan Pendanaan</p>
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
            <CardTitle>Operasional</CardTitle>
            <CardDescription>Kas dari operasi</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>Total Kas Masuk: {data?.total_cash_in ?? '-'}</li>
              <li>Total Kas Keluar: {data?.total_cash_out ?? '-'}</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Investasi</CardTitle>
            <CardDescription>Kas dari investasi</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {(data?.data ?? []).slice(0, 2).map((d: any, idx: number) => (
                <li key={idx}>{d.label ?? `Item ${idx + 1}`}: IN {d.cash_in ?? 0} / OUT {d.cash_out ?? 0}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pendanaan</CardTitle>
            <CardDescription>Kas dari pendanaan</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {(data?.data ?? []).slice(2, 4).map((d: any, idx: number) => (
                <li key={idx}>{d.label ?? `Item ${idx + 1}`}: IN {d.cash_in ?? 0} / OUT {d.cash_out ?? 0}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
