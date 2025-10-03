/** @format */

"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import {
  listSavingsTransactions,
  verifySavingsDeposit,
  approveSavingsWithdrawal,
  getSavingsProof,
} from "@/services/api";
import { SavingsDepositDialog } from "@/components/feature/koperasi/savings/savings-deposit-dialog";
import { SavingsWithdrawDialog } from "@/components/feature/koperasi/savings/savings-withdraw-dialog";
import { toast } from "sonner";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { MemberListItem } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function SimpananClient() {
  const [memberId, setMemberId] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | number | null>(null);
  const [approvingId, setApprovingId] = useState<string | number | null>(null);
  const [proofId, setProofId] = useState<string | number | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "setoran" | "penarikan">(
    "all"
  );
  const [range, setRange] = useState<{ start?: string; end?: string }>({});

  async function load() {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await listSavingsTransactions(memberId, {
        type: typeFilter === "all" ? undefined : typeFilter,
        start: range.start,
        end: range.end,
        limit: 20,
      });
      if (res.success) setRows(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(
    () =>
      rows.reduce(
        (acc, tx) => {
          const amount = Number(tx.amount ?? 0);
          if (tx.type === "setoran") {
            acc.deposit += amount;
          } else if (tx.type === "penarikan") {
            acc.withdraw += amount;
          }
          if (tx.status === "pending") acc.pending += 1;
          return acc;
        },
        { deposit: 0, withdraw: 0, pending: 0 }
      ),
    [rows]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Simpanan</h2>
          <p className="text-muted-foreground">
            Kelola setoran, verifikasi, dan penarikan simpanan anggota
          </p>
        </div>
        <div className="flex gap-2">
          <SavingsWithdrawDialog memberId={memberId} onSuccess={load} />
          <SavingsDepositDialog memberId={memberId} onSuccess={load} />
        </div>
      </div>

      <SavingsSummary summary={summary} hasSelection={Boolean(memberId)} />

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <AsyncCombobox<MemberListItem, number>
              value={memberId ? Number(memberId) : null}
              onChange={(val) => setMemberId(val ? String(val) : "")}
              getOptionValue={(m) => m.id}
              getOptionLabel={(m) =>
                m.user?.full_name || m.no_anggota || String(m.id)
              }
              queryKey={["members", "search-savings-list"]}
              fetchPage={makePaginatedListFetcher<MemberListItem>(listMembers, {
                limit: 10,
              })}
              placeholder="Cari anggota (nama/email/no. anggota)"
              emptyText="Tidak ada anggota"
              notReadyText="Ketik untuk mencari"
              minChars={1}
              renderOption={(m) => (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {m.user?.full_name || `Anggota #${m.id}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.no_anggota} • {m.user?.email || "-"}
                  </span>
                </div>
              )}
              renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Select
              value={typeFilter}
              onValueChange={(val) => setTypeFilter(val as typeof typeFilter)}
            >
              <SelectTrigger className="md:w-40">
                <SelectValue placeholder="Jenis transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="setoran">Setoran</SelectItem>
                <SelectItem value="penarikan">Penarikan</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker
              placeholder="Rentang tanggal"
              value={{ start: range.start, end: range.end }}
              onChange={(start, end) =>
                setRange({ start: start || undefined, end: end || undefined })
              }
              triggerClassName="w-full md:w-56"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={load}
              disabled={!memberId || loading}
            >
              {loading ? "Memuat..." : "Muat Riwayat"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRange({});
                setTypeFilter("all");
                setRows([]);
              }}
              disabled={!memberId && !rows.length}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Simpanan</CardTitle>
          <CardDescription>
            Riwayat setoran dan penarikan berdasarkan anggota terpilih
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rows.map((transaction: any) => (
              <div
                key={String(transaction.id)}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {transaction.type === "setoran" ? (
                      <ArrowUpCircle className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="h-6 w-6 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Anggota #{transaction.member_id ?? memberId}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category ?? "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.created_at ?? transaction.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "setoran"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {transaction.type === "setoran" ? "+" : "-"}{" "}
                      {currencyFormatter.format(
                        Number(transaction.amount ?? 0)
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Metode:{" "}
                      {transaction.method ?? transaction.payment_method ?? "-"}
                    </p>
                  </div>

                  <Badge
                    variant={
                      transaction.type === "setoran" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {transaction.type}
                  </Badge>
                  <Badge
                    variant={
                      String(transaction.status).toLowerCase() === "pending"
                        ? "secondary"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {transaction.status ?? "-"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          setProofId(transaction.id);
                          const proof = await getSavingsProof(transaction.id);
                          const url = proof?.data?.proof;
                          if (url) {
                            window.open(url, "_blank", "noopener,noreferrer");
                          } else {
                            toast.info("Bukti transaksi belum tersedia");
                          }
                        } catch (e: any) {
                          toast.error(e?.message || "Gagal mengambil bukti");
                        } finally {
                          setProofId(null);
                        }
                      }}
                      disabled={proofId === transaction.id}
                    >
                      {proofId === transaction.id ? "Memuat..." : "Bukti"}
                    </Button>
                    {transaction.type === "setoran" &&
                      transaction.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={verifyingId === transaction.id}
                          onClick={async () => {
                            try {
                              setVerifyingId(transaction.id);
                              await verifySavingsDeposit(transaction.id);
                              toast.success("Setoran diverifikasi");
                              await load();
                            } catch (e: any) {
                              toast.error(
                                e?.message || "Gagal memverifikasi setoran"
                              );
                            } finally {
                              setVerifyingId(null);
                            }
                          }}
                        >
                          {verifyingId === transaction.id
                            ? "Memproses..."
                            : "Verifikasi"}
                        </Button>
                      )}
                    {transaction.type === "penarikan" &&
                      transaction.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={approvingId === transaction.id}
                          onClick={async () => {
                            try {
                              setApprovingId(transaction.id);
                              await approveSavingsWithdrawal(transaction.id);
                              toast.success("Penarikan disetujui");
                              await load();
                            } catch (e: any) {
                              toast.error(
                                e?.message || "Gagal menyetujui penarikan"
                              );
                            } finally {
                              setApprovingId(null);
                            }
                          }}
                        >
                          {approvingId === transaction.id
                            ? "Memproses..."
                            : "Setujui"}
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            ))}
            {!rows.length && (
              <div className="text-sm text-muted-foreground italic">
                {`Pilih anggota lalu klik "Muat Riwayat" untuk melihat transaksi.`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SavingsSummary({
  summary,
  hasSelection,
}: {
  summary: { deposit: number; withdraw: number; pending: number };
  hasSelection: boolean;
}) {
  const balance = summary.deposit - summary.withdraw;

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Setoran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasSelection ? currencyFormatter.format(summary.deposit) : "-"}
          </div>
          <p className="text-xs text-muted-foreground">
            Total setoran untuk anggota dipilih
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Penarikan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasSelection ? currencyFormatter.format(summary.withdraw) : "-"}
          </div>
          <p className="text-xs text-muted-foreground">
            Jumlah penarikan tercatat
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Saldo Hitung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasSelection ? currencyFormatter.format(balance) : "-"}
          </div>
          <p className="text-xs text-muted-foreground">
            Estimasi setoran dikurangi penarikan
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Transaksi Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasSelection ? summary.pending : "-"}
          </div>
          <p className="text-xs text-muted-foreground">
            Menunggu verifikasi / persetujuan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
