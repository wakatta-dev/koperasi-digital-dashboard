/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { getKoperasiDashboardTrend } from "@/services/api";
import { TrendChart } from "./trend-chart";

export function TrendPanel({ initial }: { initial: any[] }) {
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [data, setData] = useState<any[]>(initial || []);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getKoperasiDashboardTrend({ start: start || undefined, end: end || undefined });
      if (res.success) setData((res.data as any[]) || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Auto-load default last 30 days can be handled by backend when no start/end provided
    // Keep initial from SSR for faster paint
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Simpanan & Pinjaman</CardTitle>
        <CardDescription>Filter sesuai periode</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end mb-3">
          <DateRangePicker
            placeholder="Pilih rentang"
            value={{ start: start || undefined, end: end || undefined }}
            onChange={(s, e) => {
              setStart(s || "");
              setEnd(e || "");
            }}
            triggerClassName="w-full"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Memuat...' : 'Filter'}</Button>
            <Button variant="ghost" onClick={() => { setStart(''); setEnd(''); }}>Reset</Button>
          </div>
        </div>
        {data?.length ? (
          <TrendChart data={data as any} />
        ) : (
          <div className="text-sm text-muted-foreground italic">Tidak ada data tren</div>
        )}
      </CardContent>
    </Card>
  );
}
