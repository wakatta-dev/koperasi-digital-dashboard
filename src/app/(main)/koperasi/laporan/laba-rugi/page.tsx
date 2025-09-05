/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LaporanLabaRugiPage() {
  const [period, setPeriod] = useState<string>("");
  // TODO integrate API: fetch P&L by period

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laba Rugi</h2>
          <p className="text-muted-foreground">Pendapatan, Beban, dan Laba Bersih</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Periode (YYYY-MM)" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-40" />
          <Button variant="outline">Filter</Button>
          <Button>Export PDF</Button>
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
              <li>Jasa Pinjaman: -</li>
              <li>Pendapatan Operasional: -</li>
              <li>Lain-lain: -</li>
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
              <li>Gaji & Tunjangan: -</li>
              <li>Operasional: -</li>
              <li>Penyusutan: -</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Laba Bersih</CardTitle>
            <CardDescription>Pendapatan - Beban</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

