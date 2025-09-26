/** @format */

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { getKoperasiDashboardTrend } from "@/services/api";
import { TrendChart } from "./trend-chart";
import type { KoperasiTrendPoint } from "@/types/api";

export function TrendPanel({ initial }: { initial: KoperasiTrendPoint[] }) {
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [data, setData] = useState<KoperasiTrendPoint[]>(initial || []);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getKoperasiDashboardTrend({
        start: start || undefined,
        end: end || undefined,
      });
      if (res.success) setData((res.data as KoperasiTrendPoint[]) || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Simpanan & Pinjaman</CardTitle>
        <CardDescription>Filter sesuai periode</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-x-2 mb-4">
          <DateRangePicker
            placeholder="Pilih rentang"
            value={{ start: start || undefined, end: end || undefined }}
            onChange={(s, e) => {
              setStart(s || "");
              setEnd(e || "");
            }}
            triggerClassName="w-full"
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? "Memuat..." : "Filter"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setStart("");
                setEnd("");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        {data?.length ? (
          <TrendChart data={data} />
        ) : (
          <div className="text-sm text-muted-foreground italic">
            Tidak ada data tren
          </div>
        )}
      </CardContent>
    </Card>
  );
}
