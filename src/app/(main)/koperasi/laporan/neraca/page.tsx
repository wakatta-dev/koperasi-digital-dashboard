/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportReportRaw, getBalanceSheetReport } from "@/services/api";

export default function LaporanNeracaPage() {
  const [period, setPeriod] = useState<string>("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<false | 'pdf' | 'xlsx'>(false);

  async function onFilter() {
    setLoading(true);
    try {
      const [year, month] = period.split("-");
      const start = period ? `${year}-${month}-01` : undefined;
      const res = await getBalanceSheetReport({ start });
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
      const blob = await exportReportRaw({ type: 'balance-sheet', start, format });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `laporan-neraca${period ? `-${period}` : ''}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
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
          <h2 className="text-2xl font-bold">Neraca</h2>
          <p className="text-muted-foreground">Aktiva, Kewajiban, dan Ekuitas</p>
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
            <CardTitle>Aktiva</CardTitle>
            <CardDescription>Kas, Piutang, Persediaan, Aset</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>Total Aset: {data?.total_assets ?? '-'}</li>
              {(data?.breakdown ?? []).slice(0, 4).map((b: any, idx: number) => (
                <li key={idx}>{b.account ?? `Akun ${idx + 1}`}: {b.amount ?? '-'}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kewajiban</CardTitle>
            <CardDescription>Hutang lancar & jangka panjang</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>Hutang Usaha: -</li>
              <li>Hutang Pinjaman: -</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ekuitas</CardTitle>
            <CardDescription>Modal dan saldo laba</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>Modal: -</li>
              <li>Saldo Laba: -</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
