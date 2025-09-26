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
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { listSavingsTransactions, verifySavingsDeposit, approveSavingsWithdrawal } from "@/services/api";
import { SavingsDepositDialog } from "@/components/feature/koperasi/savings/savings-deposit-dialog";
import { SavingsWithdrawDialog } from "@/components/feature/koperasi/savings/savings-withdraw-dialog";
import { toast } from "sonner";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberListItem } from "@/types/api";

export default function SimpananClient() {
  const [memberId, setMemberId] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | number | null>(null);
  const [approvingId, setApprovingId] = useState<string | number | null>(null);

  async function load() {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await listSavingsTransactions(memberId);
      if (res.success) setRows(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Simpanan</h2>
          <p className="text-muted-foreground">
            Kelola simpanan anggota koperasi
          </p>
        </div>
        <div className="flex gap-2">
          <SavingsWithdrawDialog memberId={memberId} onSuccess={load} />
          <SavingsDepositDialog memberId={memberId} onSuccess={load} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Simpanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 2.4M</div>
            <p className="text-xs text-muted-foreground">
              +15.2% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Simpanan Pokok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 623K</div>
            <p className="text-xs text-muted-foreground">1,247 anggota</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Simpanan Wajib
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 1.2M</div>
            <p className="text-xs text-muted-foreground">Bulanan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Simpanan Sukarela
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 577K</div>
            <p className="text-xs text-muted-foreground">
              Dapat ditarik sewaktu-waktu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search / Member Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <AsyncCombobox<MemberListItem, number>
                value={memberId ? Number(memberId) : null}
                onChange={(val) => setMemberId(val ? String(val) : "")}
                getOptionValue={(m) => m.id}
                getOptionLabel={(m) => m.user?.full_name || m.no_anggota || String(m.id)}
                queryKey={["members", "search-savings-list"]}
                fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, { limit: 10 })}
                placeholder="Cari anggota (nama/email/no. anggota)"
                emptyText="Tidak ada anggota"
                notReadyText="Ketik untuk mencari"
                minChars={1}
                renderOption={(m) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{m.user?.full_name || `Anggota #${m.id}`}</span>
                    <span className="text-xs text-muted-foreground">{m.no_anggota} • {m.user?.email || '-'}</span>
                  </div>
                )}
                renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
              />
            </div>
            <Button variant="outline" onClick={load} disabled={!memberId || loading}>{loading ? "Memuat..." : "Muat"}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Simpanan</CardTitle>
          <CardDescription>
            Riwayat setoran dan penarikan simpanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rows.map((transaction: any) => (
              <div
                key={String(transaction.id)}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    {transaction.type === "setoran" ? (
                      <ArrowUpCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Anggota #{transaction.member_id ?? memberId}</h3>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category ?? "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.created_at ?? transaction.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === "setoran" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "setoran" ? "+" : "-"} {transaction.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Metode: {transaction.method ?? transaction.payment_method ?? "-"}
                    </p>
                  </div>

                  <Badge variant={transaction.type === "setoran" ? "default" : "secondary"}>{transaction.type}</Badge>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">{transaction.status}</div>
                    {transaction.type === "setoran" && transaction.status === "pending" && (
                      <Button variant="ghost" size="sm" disabled={verifyingId === transaction.id} onClick={async () => {
                        try { setVerifyingId(transaction.id); await verifySavingsDeposit(transaction.id); toast.success("Setoran diverifikasi"); await load(); } catch (e: any) { toast.error(e?.message || "Gagal verifikasi"); } finally { setVerifyingId(null); }
                      }}>{verifyingId === transaction.id ? "Memproses..." : "Verifikasi"}</Button>
                    )}
                    {transaction.type === "penarikan" && transaction.status === "pending" && (
                      <Button variant="ghost" size="sm" disabled={approvingId === transaction.id} onClick={async () => {
                        try { setApprovingId(transaction.id); await approveSavingsWithdrawal(transaction.id); toast.success("Penarikan disetujui"); await load(); } catch (e: any) { toast.error(e?.message || "Gagal menyetujui"); } finally { setApprovingId(null); }
                      }}>{approvingId === transaction.id ? "Memproses..." : "Setujui"}</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!rows.length && (
              <div className="text-sm text-muted-foreground italic">Pilih anggota untuk melihat riwayat.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
