/** @format */

"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import type {
  LoanApplicationResponse,
  LoanInstallment,
  LoanInstallmentListResponse,
  LoanReleaseLetterResponse,
  MemberListItem,
} from "@/types/api";
import { CreditCard, Search, CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

type ApplyFormState = {
  memberId?: number;
  amount: number;
  purpose: string;
  tenor: number;
  rate: number;
};

export default function PinjamanClient() {
  const [applyForm, setApplyForm] = useState<ApplyFormState>({
    memberId: undefined,
    amount: 0,
    purpose: "",
    tenor: 12,
    rate: 12,
  });
  const [loanId, setLoanId] = useState<string>("");
  const [installments, setInstallments] = useState<LoanInstallment[]>([]);
  const [loading, setLoading] = useState(false);
  const [installmentLoading, setInstallmentLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unpaid" | "paid" | "overdue"
  >("all");
  const [dueDate, setDueDate] = useState<string>("");
  const [releaseLoading, setReleaseLoading] = useState(false);

  const userFetcher = useMemo(
    () => makePaginatedListFetcher<MemberListItem>(listMembers, { limit: 10 }),
    []
  );

  const isApplyDisabled = useMemo(() => {
    const { memberId, amount, tenor } = applyForm;
    return !memberId || amount <= 0 || tenor <= 0 || loading;
  }, [applyForm, loading]);

  const handleApply = useCallback(async () => {
    if (isApplyDisabled || !applyForm.memberId) return;
    setLoading(true);
    try {
      const res: LoanApplicationResponse = await applyLoan({
        member_id: applyForm.memberId,
        amount: applyForm.amount,
        tenor: applyForm.tenor,
        rate: applyForm.rate,
        purpose: applyForm.purpose.trim() || undefined,
      });
      if (!res.success) {
        throw new Error(res.message || "Gagal mengajukan pinjaman");
      }
      toast.success("Pengajuan pinjaman terkirim");
      setApplyForm({
        memberId: undefined,
        amount: 0,
        purpose: "",
        tenor: 12,
        rate: 12,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengajukan pinjaman"
      );
    } finally {
      setLoading(false);
    }
  }, [applyForm, isApplyDisabled]);

  const loadInstallments = useCallback(async () => {
    if (!loanId.trim()) {
      toast.error("Masukkan ID pinjaman terlebih dahulu");
      return;
    }
    setInstallmentLoading(true);
    try {
      const res: LoanInstallmentListResponse = await listLoanInstallments(
        loanId.trim(),
        {
          status: statusFilter === "all" ? undefined : statusFilter,
          due_date: dueDate || undefined,
          limit: 50,
        }
      );
      if (!res.success || !Array.isArray(res.data)) {
        throw new Error(res.message || "Gagal memuat angsuran");
      }
      setInstallments(res.data as LoanInstallment[]);
    } catch (error) {
      setInstallments([]);
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat angsuran"
      );
    } finally {
      setInstallmentLoading(false);
    }
  }, [dueDate, loanId, statusFilter]);

  const handleApprove = useCallback(async () => {
    if (!loanId.trim()) {
      toast.error("Masukkan ID pinjaman terlebih dahulu");
      return;
    }
    try {
      const res: LoanApplicationResponse = await approveLoan(loanId.trim());
      if (!res.success) {
        throw new Error(res.message || "Gagal menyetujui pinjaman");
      }
      toast.success("Pinjaman disetujui");
      await loadInstallments();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyetujui pinjaman"
      );
    }
  }, [loanId, loadInstallments]);

  const handleDisburse = useCallback(async () => {
    if (!loanId.trim()) {
      toast.error("Masukkan ID pinjaman terlebih dahulu");
      return;
    }
    try {
      const res: LoanApplicationResponse = await disburseLoan(loanId.trim(), {
        method: "transfer",
      });
      if (!res.success) {
        throw new Error(res.message || "Gagal mencairkan pinjaman");
      }
      toast.success("Pinjaman dicairkan");
      await loadInstallments();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mencairkan pinjaman"
      );
    }
  }, [loanId, loadInstallments]);

  const handleReleaseLetter = useCallback(async () => {
    if (!loanId.trim()) {
      toast.error("Masukkan ID pinjaman terlebih dahulu");
      return;
    }
    setReleaseLoading(true);
    try {
      const res: LoanReleaseLetterResponse = await getLoanReleaseLetter(
        loanId.trim()
      );
      if (!res.success || !res.data?.content) {
        throw new Error(res.message || "Surat pelunasan belum tersedia");
      }
      const popup = window.open("", "_blank", "noopener,noreferrer");
      if (popup) {
        popup.document.write(res.data.content);
        popup.document.close();
      } else {
        toast.info("Buka blokir pop-up untuk melihat surat pelunasan");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil surat pelunasan"
      );
    } finally {
      setReleaseLoading(false);
    }
  }, [loanId]);

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
              value={applyForm.memberId ?? null}
              onChange={(value) =>
                setApplyForm((prev) => ({
                  ...prev,
                  memberId: value ?? undefined,
                }))
              }
              getOptionValue={(member) => member.id}
              getOptionLabel={(member) =>
                member.full_name || member.no_anggota || String(member.id)
              }
              queryKey={["members", "search-loan-apply"]}
              fetchPage={userFetcher}
              placeholder="Cari anggota (nama/email/no. anggota)"
              emptyText="Tidak ada anggota"
              notReadyText="Ketik untuk mencari"
              minChars={1}
              renderOption={(member) => (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {member.full_name || `Anggota #${member.id}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {member.no_anggota} • {member.email || "-"}
                  </span>
                </div>
              )}
              renderValue={(value) =>
                value ? <span>Anggota #{value}</span> : <span />
              }
            />
            <Input
              type="number"
              min={0}
              placeholder="Jumlah"
              value={applyForm.amount || ""}
              onChange={(event) =>
                setApplyForm((prev) => ({
                  ...prev,
                  amount: Number(event.target.value || 0),
                }))
              }
            />
            <Textarea
              placeholder="Keperluan"
              value={applyForm.purpose}
              onChange={(event) =>
                setApplyForm((prev) => ({
                  ...prev,
                  purpose: event.target.value,
                }))
              }
              className="md:col-span-2"
              rows={1}
            />
            <Input
              type="number"
              min={1}
              placeholder="Tenor (bulan)"
              value={applyForm.tenor || ""}
              onChange={(event) =>
                setApplyForm((prev) => ({
                  ...prev,
                  tenor: Number(event.target.value || 0),
                }))
              }
            />
            <Input
              type="number"
              step="0.01"
              min={0}
              placeholder="Rate (%)"
              value={applyForm.rate || ""}
              onChange={(event) =>
                setApplyForm((prev) => ({
                  ...prev,
                  rate: Number(event.target.value || 0),
                }))
              }
            />
            <Button onClick={handleApply} disabled={isApplyDisabled}>
              {loading ? "Memproses..." : "Ajukan"}
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
                onChange={(event) => setLoanId(event.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as typeof statusFilter)
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
              onChange={(event) => setDueDate(event.target.value)}
            />
            <Button
              variant="outline"
              onClick={loadInstallments}
              disabled={!loanId.trim() || installmentLoading}
            >
              {installmentLoading ? "Memuat..." : "Muat Angsuran"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleApprove}
              disabled={!loanId.trim()}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Setujui
            </Button>
            <Button onClick={handleDisburse} disabled={!loanId.trim()}>
              <CreditCard className="mr-2 h-4 w-4" /> Cairkan
            </Button>
            <Button
              variant="ghost"
              onClick={handleReleaseLetter}
              disabled={!loanId.trim() || releaseLoading}
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
          {installments.map((installment) => (
            <div
              key={installment.id}
              className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">Angsuran #{installment.id}</p>
                <p className="text-sm text-muted-foreground">
                  Jatuh tempo: {formatDate(installment.due_date)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Penalti:{" "}
                  {currencyFormatter.format(Number(installment.penalty || 0))}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">
                    Jumlah: {currencyFormatter.format(installment.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dibayar: {currencyFormatter.format(installment.paid_amount)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Status: {installment.status}
                  </p>
                </div>
                {installment.status !== "paid" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const nominal = Number(
                        prompt(
                          "Nominal pembayaran",
                          String(
                            Math.max(
                              0,
                              installment.amount - installment.paid_amount
                            )
                          )
                        ) || 0
                      );
                      if (!Number.isFinite(nominal) || nominal <= 0) return;
                      try {
                        const res = await payLoanInstallment(installment.id, {
                          amount: nominal,
                          date: new Date().toISOString(),
                          method: "manual",
                        });
                        if (!res.success) {
                          throw new Error(
                            res.message || "Gagal mencatat pembayaran"
                          );
                        }
                        toast.success("Angsuran dicatat");
                        await loadInstallments();
                      } catch (error) {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "Gagal mencatat pembayaran"
                        );
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
              {loanId
                ? "Belum ada data angsuran untuk filter saat ini."
                : 'Masukkan ID pinjaman dan klik "Muat Angsuran" untuk melihat jadwal.'}
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
