/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LaporanNeracaPage() {
  const [period, setPeriod] = useState<string>("");
  const [data, setData] = useState<any | null>(null);

  // TODO integrate API: fetch balance sheet by period
  useEffect(() => {
    setData(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Neraca</h2>
          <p className="text-muted-foreground">Aktiva, Kewajiban, dan Ekuitas</p>
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
            <CardTitle>Aktiva</CardTitle>
            <CardDescription>Kas, Piutang, Persediaan, Aset</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>Kas: -</li>
              <li>Piutang: -</li>
              <li>Persediaan: -</li>
              <li>Aset Tetap: -</li>
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

