/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LaporanArusKasPage() {
  const [period, setPeriod] = useState<string>("");
  // TODO integrate API: fetch cashflow by period

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Arus Kas</h2>
          <p className="text-muted-foreground">Operasional, Investasi, dan Pendanaan</p>
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
            <CardTitle>Operasional</CardTitle>
            <CardDescription>Kas dari operasi</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>Penerimaan: -</li>
              <li>Pengeluaran: -</li>
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
              <li>Pembelian Aset: -</li>
              <li>Penjualan Aset: -</li>
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
              <li>Pinjaman Masuk: -</li>
              <li>Pelunasan Pinjaman: -</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

