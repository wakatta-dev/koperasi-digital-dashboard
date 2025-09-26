/** @format */

'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, CheckCircle } from "lucide-react";
import { applyLoan, approveLoan, disburseLoan, listLoanInstallments, payLoanInstallment } from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { LoanInstallment, MemberListItem } from "@/types/api";

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

type ApplyFormState = {
  member_id: string;
  amount: number;
  purpose: string;
  tenor: number;
  rate: number;
};

export default function PinjamanClient() {
  const [applyPayload, setApplyPayload] = useState<ApplyFormState>({
    member_id: "",
    amount: 0,
    purpose: "",
    tenor: 12,
    rate: 12,
  });
  const [loanId, setLoanId] = useState<string>("");
  const [installments, setInstallments] = useState<LoanInstallment[]>([]);
  const [loading, setLoading] = useState(false);

  async function onApply() {
    setLoading(true);
    try {
      await applyLoan({
        member_id: Number(applyPayload.member_id),
        amount: Number(applyPayload.amount),
        purpose: String(applyPayload.purpose || ""),
        tenor: Number(applyPayload.tenor || 12),
        rate: Number(applyPayload.rate || 0),
      });
      setApplyPayload({ member_id: "", amount: 0, purpose: "", tenor: 12, rate: 12 });
    } finally {
      setLoading(false);
    }
  }

  async function loadInstallments() {
    if (!loanId) return;
    const res = await listLoanInstallments(loanId);
    if (res.success) setInstallments((res.data as LoanInstallment[]) ?? []);
  }

  async function onApprove() {
    if (!loanId) return;
    await approveLoan(loanId);
    await loadInstallments();
  }

  async function onDisburse() {
    if (!loanId) return;
    await disburseLoan(loanId);
    await loadInstallments();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pinjaman</h2>
          <p className="text-muted-foreground">Kelola pinjaman anggota koperasi</p>
        </div>
        <div className="flex items-center gap-2"/>
      </div>

      {/* Apply Loan */}
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Baru</CardTitle>
          <CardDescription>Ajukan pinjaman untuk anggota</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <AsyncCombobox<MemberListItem, number>
              value={applyPayload.member_id ? Number(applyPayload.member_id) : null}
              onChange={(val) => setApplyPayload((s) => ({ ...s, member_id: val ?? "" }))}
              getOptionValue={(m) => m.id}
              getOptionLabel={(m) => m.full_name || m.no_anggota || String(m.id)}
              queryKey={["members", "search-loan-apply"]}
              fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, { limit: 10 })}
              placeholder="Cari anggota (nama/email/no. anggota)"
              emptyText="Tidak ada anggota"
              notReadyText="Ketik untuk mencari"
              minChars={1}
              renderOption={(m) => (
                <div className="flex flex-col">
                  <span className="font-medium">{m.full_name || `Anggota #${m.id}`}</span>
                  <span className="text-xs text-muted-foreground">{m.no_anggota} • {m.email || '-'}</span>
                </div>
              )}
              renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
            />
            <Input
              type="number"
              placeholder="Jumlah"
              value={applyPayload.amount}
              onChange={(e) => setApplyPayload((s) => ({ ...s, amount: Number(e.target.value || 0) }))}
            />
            <Input
              placeholder="Keperluan"
              value={applyPayload.purpose}
              onChange={(e) => setApplyPayload((s) => ({ ...s, purpose: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Tenor (bulan)"
              value={applyPayload.tenor}
              onChange={(e) => setApplyPayload((s) => ({ ...s, tenor: Number(e.target.value || 0) }))}
            />
            <Input
              type="number"
              placeholder="Rate (%)"
              value={applyPayload.rate}
              onChange={(e) => setApplyPayload((s) => ({ ...s, rate: Number(e.target.value || 0) }))}
            />
            <Button onClick={onApply} disabled={loading || !applyPayload.member_id || !applyPayload.amount}>
              Ajukan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loan Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Operasi Pinjaman</CardTitle>
          <CardDescription>Setujui/Cairkan dan lihat angsuran berdasarkan ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="ID pinjaman" value={loanId} onChange={(e) => setLoanId(e.target.value)} />
            </div>
            <Button variant="outline" onClick={loadInstallments} disabled={!loanId}>Muat Angsuran</Button>
            <Button variant="secondary" onClick={onApprove} disabled={!loanId}><CheckCircle className="h-4 w-4 mr-2" />Setujui</Button>
            <Button variant="default" onClick={onDisburse} disabled={!loanId}><CreditCard className="h-4 w-4 mr-2" />Cairkan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Installments */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Angsuran</CardTitle>
          <CardDescription>Status dan detail angsuran</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {installments.map((ins) => (
              <div key={String(ins.id)} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Angsuran #{ins.id}</div>
                  <div className="text-sm text-muted-foreground">Jatuh tempo: {ins.due_date ?? "-"}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">Jumlah: {idr.format(ins.amount)}</p>
                    <p className="text-sm text-muted-foreground">Dibayar: {idr.format(ins.paid_amount)}</p>
                    <p className="text-xs text-muted-foreground">Status: {ins.status}</p>
                  </div>
                  {ins.status !== "paid" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const amount = Number(
                          prompt("Nominal bayar", String(Math.max(0, ins.amount - ins.paid_amount))) || 0
                        );
                        if (!amount) return;
                        await payLoanInstallment(ins.id, {
                          amount,
                          date: new Date().toISOString(),
                          method: "manual",
                        });
                        await loadInstallments();
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Bayar
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {!installments.length && (
              <div className="text-sm text-muted-foreground italic">Masukkan ID pinjaman untuk melihat angsuran.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
