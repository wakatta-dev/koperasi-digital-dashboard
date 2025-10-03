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
import { Input } from "@/components/ui/input";
import { CreditCard, Search, CheckCircle, FileText } from "lucide-react";
import {
  applyLoan,
  approveLoan,
  disburseLoan,
  listLoanInstallments,
  payLoanInstallment,
  getLoanReleaseLetter,
} from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type { LoanInstallment, MemberListItem } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unpaid" | "paid" | "overdue"
  >("all");
  const [dueDate, setDueDate] = useState<string>("");
  const [releaseLoading, setReleaseLoading] = useState(false);

  async function onApply() {
    setLoading(true);
    try {
      await applyLoan({
        member_id: Number(applyPayload.member_id),
        amount: applyPayload.amount,
        purpose: applyPayload.purpose || undefined,
        tenor: applyPayload.tenor,
        rate: applyPayload.rate,
      });
      toast.success("Pengajuan pinjaman terkirim");
      setApplyPayload({
        member_id: "",
        amount: 0,
        purpose: "",
        tenor: 12,
        rate: 12,
      });
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengajukan pinjaman");
    } finally {
      setLoading(false);
    }
  }

  async function loadInstallments() {
    if (!loanId) return;
    const res = await listLoanInstallments(loanId, {
      status: statusFilter === "all" ? undefined : statusFilter,
      due_date: dueDate || undefined,
      limit: 20,
    });
    if (res.success) {
      setInstallments((res.data as LoanInstallment[]) ?? []);
    } else {
      toast.error(res.message || "Gagal memuat angsuran");
    }
  }

  async function onApprove() {
    if (!loanId) return;
    try {
      await approveLoan(loanId);
      toast.success("Pinjaman disetujui");
      await loadInstallments();
    } catch (e: any) {
      toast.error(e?.message || "Gagal menyetujui pinjaman");
    }
  }

  async function onDisburse() {
    if (!loanId) return;
    try {
      await disburseLoan(loanId, { method: "transfer" });
      toast.success("Pinjaman dicairkan");
      await loadInstallments();
    } catch (e: any) {
      toast.error(e?.message || "Gagal mencairkan pinjaman");
    }
  }

  async function onReleaseLetter() {
    if (!loanId) return;
    setReleaseLoading(true);
    try {
      const res = await getLoanReleaseLetter(loanId);
      if (res.success && res.data?.content) {
        const win = window.open("", "_blank", "noopener,noreferrer");
        if (win) {
          win.document.write(res.data.content);
          win.document.close();
        } else {
          toast.info("Buka blokir pop-up untuk melihat surat pelunasan");
        }
      } else {
        toast.info("Surat pelunasan belum tersedia");
      }
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengambil surat pelunasan");
    } finally {
      setReleaseLoading(false);
    }
  }

  const totals = useMemo(() => {
    return installments.reduce(
      (acc, ins) => {
        acc.total += ins.amount;
        acc.paid += ins.paid_amount;
        if (ins.status === "overdue") acc.overdue += 1;
        return acc;
      },
      { total: 0, paid: 0, overdue: 0 }
    );
  }, [installments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pinjaman</h2>
          <p className="text-muted-foreground">
            Kelola pengajuan, persetujuan, dan angsuran pinjaman anggota
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Baru</CardTitle>
          <CardDescription>
            Ajukan pinjaman sesuai dokumen anggota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-6">
            <AsyncCombobox<MemberListItem, number>
              value={
                applyPayload.member_id ? Number(applyPayload.member_id) : null
              }
              onChange={(val) =>
                setApplyPayload((s) => ({
                  ...s,
                  member_id: val != null ? String(val) : "",
                }))
              }
              getOptionValue={(m) => m.id}
              getOptionLabel={(m) =>
                m.full_name || m.no_anggota || String(m.id)
              }
              queryKey={["members", "search-loan-apply"]}
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
                    {m.full_name || `Anggota #${m.id}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.no_anggota} • {m.email || "-"}
                  </span>
                </div>
              )}
              renderValue={(val) => <span>{val ? `Anggota #${val}` : ""}</span>}
            />
            <Input
              type="number"
              min={0}
              placeholder="Jumlah"
              value={applyPayload.amount || ""}
              onChange={(e) =>
                setApplyPayload((s) => ({
                  ...s,
                  amount: Number(e.target.value || 0),
                }))
              }
            />
            <Input
              placeholder="Keperluan"
              value={applyPayload.purpose}
              onChange={(e) =>
                setApplyPayload((s) => ({ ...s, purpose: e.target.value }))
              }
            />
            <Input
              type="number"
              min={1}
              placeholder="Tenor (bulan)"
              value={applyPayload.tenor || ""}
              onChange={(e) =>
                setApplyPayload((s) => ({
                  ...s,
                  tenor: Number(e.target.value || 0),
                }))
              }
            />
            <Input
              type="number"
              step="0.01"
              min={0}
              placeholder="Rate (%)"
              value={applyPayload.rate || ""}
              onChange={(e) =>
                setApplyPayload((s) => ({
                  ...s,
                  rate: Number(e.target.value || 0),
                }))
              }
            />
            <Button
              onClick={onApply}
              disabled={
                loading ||
                !applyPayload.member_id ||
                !applyPayload.amount ||
                !applyPayload.tenor
              }
            >
              Ajukan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operasi Pinjaman</CardTitle>
          <CardDescription>
            Setujui, cairkan, dan filter angsuran
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid items-end gap-3 md:grid-cols-5">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="ID pinjaman"
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(val) =>
                setStatusFilter(val as typeof statusFilter)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status angsuran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="unpaid">Belum dibayar</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={loadInstallments}
              disabled={!loanId}
            >
              Muat Angsuran
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onApprove} disabled={!loanId}>
              <CheckCircle className="mr-2 h-4 w-4" /> Setujui
            </Button>
            <Button onClick={onDisburse} disabled={!loanId}>
              <CreditCard className="mr-2 h-4 w-4" /> Cairkan
            </Button>
            <Button
              variant="ghost"
              onClick={onReleaseLetter}
              disabled={!loanId || releaseLoading}
            >
              <FileText className="mr-2 h-4 w-4" />
              {releaseLoading ? "Memuat..." : "Surat Pelunasan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Angsuran</CardTitle>
          <CardDescription>
            Total {installments.length} angsuran, dibayar{" "}
            {currencyFormatter.format(totals.paid)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {installments.map((ins) => (
            <div
              key={String(ins.id)}
              className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">Angsuran #{ins.id}</p>
                <p className="text-sm text-muted-foreground">
                  Jatuh tempo: {formatDate(ins.due_date)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Penalti: {currencyFormatter.format(Number(ins.penalty || 0))}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">
                    Jumlah: {currencyFormatter.format(ins.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dibayar: {currencyFormatter.format(ins.paid_amount)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Status: {ins.status}
                  </p>
                </div>
                {ins.status !== "paid" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const nominal = Number(
                        prompt(
                          "Nominal bayar",
                          String(Math.max(0, ins.amount - ins.paid_amount))
                        ) || 0
                      );
                      if (!nominal) return;
                      try {
                        await payLoanInstallment(ins.id, {
                          amount: nominal,
                          date: new Date().toISOString(),
                          method: "manual",
                        });
                        toast.success("Angsuran dicatat");
                        await loadInstallments();
                      } catch (e: any) {
                        toast.error(e?.message || "Gagal mencatat pembayaran");
                      }
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Bayar
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!installments.length && (
            <div className="text-sm text-muted-foreground italic">
              {`Masukkan ID pinjaman dan klik "Muat Angsuran" untuk melihat jadwal.`}
            </div>
          )}
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
    }).format(new Date(value));
  } catch {
    return value;
  }
}
