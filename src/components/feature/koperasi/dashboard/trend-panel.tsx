/** @format */

"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendChart } from "./trend-chart";

export function TrendPanel({ data }: { data: number[] }) {
  const chartData = useMemo(
    () =>
      data.map((value, index) => ({
        label: `Periode ${index + 1}`,
        value,
      })),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Simpanan & Pinjaman</CardTitle>
        <CardDescription>Data agregat dari ringkasan dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length ? (
          <TrendChart data={chartData} />
        ) : (
          <div className="text-sm text-muted-foreground italic">
            Tidak ada data tren
          </div>
        )}
      </CardContent>
    </Card>
  );
}
