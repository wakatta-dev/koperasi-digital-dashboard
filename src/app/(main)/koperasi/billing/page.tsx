/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listClientInvoices } from "@/services/api";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");

  // Integrate API: fetch invoices
  useEffect(() => {
    (async () => {
      const res = await listClientInvoices({ limit: 100 }).catch(() => null);
      if (res && res.success) setInvoices(res.data || []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tagihan & Add-Ons</h2>
          <p className="text-muted-foreground">Kelola langganan dan pembayaran</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Riwayat Pembayaran</Button>
          <Button>Tambah Add-Ons</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tagihan</CardTitle>
          <CardDescription>Status pembayaran & jatuh tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Input placeholder="Cari invoice..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button variant="outline">Filter</Button>
            <Button variant="secondary">Export Excel</Button>
          </div>
          <div className="space-y-3">
            {invoices.filter((inv: any) => !query || String(inv.number ?? inv.id).includes(query)).map((inv: any) => (
              <div key={String(inv.id)} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-md items-center">
                <div>
                  <div className="font-medium">{inv.number ?? inv.id}</div>
                  <div className="text-xs text-muted-foreground">Jatuh tempo: {inv.due_date ?? '-'}</div>
                </div>
                <div className="text-sm">Jumlah: {inv.amount ?? '-'}</div>
                <div>
                  <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'} className="capitalize">{inv.status ?? 'unpaid'}</Badge>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="outline" size="sm">Lihat</Button>
                  <Button size="sm">Bayar</Button>
                </div>
              </div>
            ))}
            {!invoices.length && (
              <div className="text-sm text-muted-foreground italic">Tidak ada tagihan</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add-Ons</CardTitle>
          <CardDescription>Fitur tambahan untuk memperluas fungsi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{name:'E-Sign',desc:'Tanda tangan digital'}, {name:'WhatsApp Gateway',desc:'Kirim notifikasi WA'}, {name:'Advanced Reports',desc:'Laporan lanjutan'}].map((a) => (
              <div key={a.name} className="p-4 border rounded-lg flex flex-col gap-2">
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-muted-foreground">{a.desc}</div>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm">Detail</Button>
                  <Button size="sm">Beli</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
