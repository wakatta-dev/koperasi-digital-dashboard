/** @format */

'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { createPayment, listClientInvoices } from '@/services/api';
import { InvoiceDetailDialog } from '@/components/feature/koperasi/billing/invoice-detail-dialog';

type Props = { initialInvoices: any[] };

export default function BillingClient({ initialInvoices }: Props) {
  const qc = useQueryClient();
  const [query, setQuery] = useState('');

  const { data: invoices = [], isFetching } = useQuery({
    queryKey: ['client-invoices'],
    queryFn: async () => {
      const res = await listClientInvoices({ limit: 100 });
      return res.success ? (res.data as any[]) : [];
    },
    initialData: initialInvoices,
    staleTime: 60_000,
  });

  const filtered = useMemo(
    () => invoices.filter((inv: any) => !query || String(inv.number ?? inv.id).includes(query)),
    [invoices, query]
  );

  const payMutation = useMutation({
    mutationFn: async (inv: any) => {
      const raw = prompt(
        `Masukkan jumlah pembayaran untuk invoice ${inv.number ?? inv.id}:`,
        String(inv.amount ?? inv.total ?? 0)
      );
      if (!raw) return;
      const amount = Number(raw);
      if (!amount || isNaN(amount)) return;
      await createPayment(inv.id, { amount });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-invoices'] });
    },
  });

  return (
    <>
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
            <Button variant="outline" disabled={isFetching}>{isFetching ? 'Memuat...' : 'Filter'}</Button>
            <Button variant="secondary">Export Excel</Button>
          </div>
          <div className="space-y-3">
            {filtered.map((inv: any) => (
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
                  <InvoiceDetailDialog id={inv.id} />
                  <Button size="sm" onClick={() => payMutation.mutate(inv)} disabled={payMutation.isPending}>Bayar</Button>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="text-sm text-muted-foreground italic">{invoices.length ? 'Tidak ada yang cocok dengan pencarian' : 'Tidak ada tagihan'}</div>
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
    </>
  );
}

