/** @format */

"use client";

import { useState } from "react";
import { useTransactions, useTransactionActions } from "@/hooks/queries/transactions";
import type { Transaction } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionsExportButton } from "./transactions-export-button";

type Props = {
  initialData?: Transaction[];
};

export function TransactionsList({ initialData }: Props) {
  const { data: txs = [] } = useTransactions(undefined, initialData);
  const { create, remove } = useTransactionActions();
  const [form, setForm] = useState<any>({
    type: "CashIn",
    category: "operasional",
    amount: 0,
    payment_method: "tunai",
    description: "",
    debit_account_code: "1000",
    debit_account_name: "Cash",
    credit_account_code: "4000",
    credit_account_name: "Revenue",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transaksi</h2>
        <div className="flex gap-2">
          <TransactionsExportButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Select value={form.type} onValueChange={(v) => setForm((s: any) => ({ ...s, type: v }))}>
              <SelectTrigger><SelectValue placeholder="Tipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CashIn">CashIn</SelectItem>
                <SelectItem value="CashOut">CashOut</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Kategori" value={form.category} onChange={(e) => setForm((s: any) => ({ ...s, category: e.target.value }))} />
            <Input placeholder="Metode" value={form.payment_method} onChange={(e) => setForm((s: any) => ({ ...s, payment_method: e.target.value }))} />
            <Input type="number" placeholder="Jumlah" value={form.amount} onChange={(e) => setForm((s: any) => ({ ...s, amount: Number(e.target.value) }))} />
            <Input placeholder="Debit Code" value={form.debit_account_code} onChange={(e) => setForm((s: any) => ({ ...s, debit_account_code: e.target.value }))} />
            <Input placeholder="Credit Code" value={form.credit_account_code} onChange={(e) => setForm((s: any) => ({ ...s, credit_account_code: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input placeholder="Debit Name" value={form.debit_account_name} onChange={(e) => setForm((s: any) => ({ ...s, debit_account_name: e.target.value }))} />
            <Input placeholder="Credit Name" value={form.credit_account_name} onChange={(e) => setForm((s: any) => ({ ...s, credit_account_name: e.target.value }))} />
            <Input placeholder="Deskripsi" value={form.description} onChange={(e) => setForm((s: any) => ({ ...s, description: e.target.value }))} />
          </div>
          <div className="mt-3">
            <Button
              onClick={async () => {
                await create.mutateAsync(form);
                setForm((s: any) => ({ ...s, amount: 0, description: "" }));
              }}
              disabled={create.isPending}
            >
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {txs.length === 0 && (
              <div className="text-sm italic text-muted-foreground">Belum ada transaksi</div>
            )}
            {txs.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">{t.type} • {t.category}</div>
                  <div className="text-xs text-muted-foreground">{t.transaction_date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Rp {t.amount}</div>
                  <div className="text-xs text-muted-foreground">{t.payment_method}</div>
                </div>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => remove.mutate(t.id)}>Hapus</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
