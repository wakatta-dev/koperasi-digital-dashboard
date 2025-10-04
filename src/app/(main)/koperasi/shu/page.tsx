/** @format */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calculator, Download } from "lucide-react";
import AsyncCombobox from "@/components/ui/async-combobox";
import { toast } from "sonner";

import {
  createYearlySHU,
  distributeSHU,
  exportSHURaw,
  listSHUByMember,
  listSHUHistory,
  simulateSHU,
  listMembers,
} from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type {
  YearlySHU,
  SHUDistribution,
  SHUHistoryResponse,
  SHUSimulationResponse,
  SHUMemberHistoryResponse,
  SHUDistributionResponse,
  YearlySHURequest,
} from "@/types/api";
import type { MemberListItem } from "@/types/api";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat("id-ID", {
  style: "percent",
  minimumFractionDigits: 2,
});

type FormState = {
  year: number | "";
  total: number | "";
  allocationSavings: number | "";
  allocationParticipation: number | "";
};

type MemberFilterState = {
  memberId?: number;
};

export default function SHUPage() {
  const [history, setHistory] = useState<YearlySHU[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    year: new Date().getFullYear(),
    total: "",
    allocationSavings: "",
    allocationParticipation: "",
  });
  const [simulation, setSimulation] = useState<SHUDistribution[] | null>(null);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [distributeLoading, setDistributeLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [distributionLoading, setDistributionLoading] = useState(false);
  const [memberDistributions, setMemberDistributions] =
    useState<SHUDistribution[] | null>(null);
  const [memberFilter, setMemberFilter] = useState<MemberFilterState>({});

  const memberFetcher = useMemo(
    () => makePaginatedListFetcher<MemberListItem>(listMembers, { limit: 10 }),
    []
  );

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res: SHUHistoryResponse | null = await listSHUHistory({
        limit: 50,
      }).catch(() => null);
      if (!res || !res.success || !Array.isArray(res.data)) {
        throw new Error(res?.message || "Gagal memuat riwayat SHU");
      }
      setHistory(res.data as YearlySHU[]);
    } catch (error) {
      setHistory([]);
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat riwayat SHU"
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const latestYearData = useMemo(() => history.at(0) ?? null, [history]);

  const handleCreateYearly = useCallback(async () => {
    const payload: YearlySHURequest = {
      year:
        typeof form.year === "number"
          ? form.year
          : Number.parseInt(String(form.year || new Date().getFullYear()), 10),
      total_shu:
        typeof form.total === "number"
          ? form.total
          : Number.parseFloat(String(form.total || 0)),
    };

    if (!payload.year || payload.total_shu <= 0) {
      toast.error("Tahun dan total SHU wajib diisi");
      return;
    }

    if (form.allocationSavings !== "") {
      payload.allocation_savings = Number(form.allocationSavings);
    }
    if (form.allocationParticipation !== "") {
      payload.allocation_participation = Number(form.allocationParticipation);
    }

    try {
      const res = await createYearlySHU(payload);
      if (!res.success) {
        throw new Error(res.message || "Gagal menyimpan total SHU");
      }
      toast.success("Total SHU tersimpan");
      setForm((prev) => ({
        ...prev,
        total: "",
        allocationSavings: "",
        allocationParticipation: "",
      }));
      await loadHistory();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan total SHU"
      );
    }
  }, [form, loadHistory]);

  const handleSimulate = useCallback(async () => {
    const targetYear = form.year || latestYearData?.year;
    if (!targetYear) {
      toast.error("Tentukan tahun terlebih dahulu");
      return;
    }
    setSimulateLoading(true);
    try {
      const res: SHUSimulationResponse = await simulateSHU(targetYear);
      if (!res.success || !Array.isArray(res.data)) {
        throw new Error(res.message || "Gagal mensimulasikan SHU");
      }
      setSimulation(res.data as SHUDistribution[]);
    } catch (error) {
      setSimulation(null);
      toast.error(
        error instanceof Error ? error.message : "Gagal mensimulasikan SHU"
      );
    } finally {
      setSimulateLoading(false);
    }
  }, [form.year, latestYearData?.year]);

  const handleDistribute = useCallback(async () => {
    const targetYear = form.year || latestYearData?.year;
    if (!targetYear) {
      toast.error("Tentukan tahun terlebih dahulu");
      return;
    }
    setDistributeLoading(true);
    try {
      const res: SHUDistributionResponse = await distributeSHU(targetYear, {
        method: "transfer",
        description: `Distribusi SHU ${targetYear}`,
      });
      if (!res.success) {
        throw new Error(res.message || "Gagal mendistribusikan SHU");
      }
      toast.success("Distribusi SHU berhasil");
      await loadHistory();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mendistribusikan SHU"
      );
    } finally {
      setDistributeLoading(false);
    }
  }, [form.year, latestYearData?.year, loadHistory]);

  const handleExport = useCallback(async () => {
    const targetYear = form.year || latestYearData?.year;
    if (!targetYear) {
      toast.error("Tentukan tahun terlebih dahulu");
      return;
    }
    setExportLoading(true);
    try {
      const blob = await exportSHURaw(targetYear);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shu-${targetYear}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Export SHU berhasil");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengekspor SHU"
      );
    } finally {
      setExportLoading(false);
    }
  }, [form.year, latestYearData?.year]);

  const handleLoadMemberDistribution = useCallback(async () => {
    if (!memberFilter.memberId) {
      toast.error("Pilih anggota terlebih dahulu");
      return;
    }
    setDistributionLoading(true);
    try {
      const res: SHUMemberHistoryResponse = await listSHUByMember(
        memberFilter.memberId,
        { limit: 50 }
      );
      if (!res.success || !Array.isArray(res.data)) {
        throw new Error(res.message || "Gagal memuat distribusi anggota");
      }
      setMemberDistributions(res.data as SHUDistribution[]);
    } catch (error) {
      setMemberDistributions(null);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memuat distribusi anggota"
      );
    } finally {
      setDistributionLoading(false);
    }
  }, [memberFilter.memberId]);

  const historySummary = useMemo(() => {
    const totalDistributed = history
      .filter((item) => item.status === "distributed")
      .reduce((acc, item) => acc + item.total_shu, 0);
    return {
      count: history.length,
      distributed: totalDistributed,
    };
  }, [history]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sisa Hasil Usaha (SHU)</h2>
          <p className="text-muted-foreground">
            Kelola pembagian SHU kepada anggota
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSimulate}
            disabled={simulateLoading}
          >
            <Calculator className="mr-2 h-4 w-4" />
            {simulateLoading ? "Menghitung..." : "Hitung SHU"}
          </Button>
          <Button onClick={handleExport} disabled={exportLoading}>
            <Download className="mr-2 h-4 w-4" />
            {exportLoading ? "Mengunduh..." : "Export Data"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Input & Aksi</CardTitle>
          <CardDescription>
            Input total SHU tahunan, simulasi, dan distribusi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid items-end gap-3 md:grid-cols-7">
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Tahun</div>
              <Input
                type="number"
                value={form.year === "" ? "" : form.year}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    year: event.target.value
                      ? Number(event.target.value)
                      : "",
                  }))
                }
              />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Total SHU</div>
              <Input
                type="number"
                placeholder="50000000"
                value={form.total === "" ? "" : form.total}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    total: event.target.value
                      ? Number(event.target.value)
                      : "",
                  }))
                }
              />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">% Simpanan</div>
              <Input
                type="number"
                placeholder="60"
                value={
                  form.allocationSavings === "" ? "" : form.allocationSavings
                }
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    allocationSavings: event.target.value
                      ? Number(event.target.value)
                      : "",
                  }))
                }
              />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">% Partisipasi</div>
              <Input
                type="number"
                placeholder="40"
                value={
                  form.allocationParticipation === ""
                    ? ""
                    : form.allocationParticipation
                }
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    allocationParticipation: event.target.value
                      ? Number(event.target.value)
                      : "",
                  }))
                }
              />
            </div>
            <Button
              type="button"
              onClick={handleCreateYearly}
              disabled={historyLoading || !form.year || !form.total}
            >
              {historyLoading ? "Memproses..." : "Simpan Total"}
            </Button>
            <Button
              type="button"
              onClick={handleDistribute}
              disabled={distributeLoading}
            >
              {distributeLoading ? "Mendistribusi..." : "Distribusikan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Riwayat Tahunan</CardTitle>
              <CardDescription>Status per tahun pembukuan SHU</CardDescription>
            </div>
            <Badge variant="secondary">Total terdistribusi: {currencyFormatter.format(historySummary.distributed)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded border p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-semibold">Tahun {item.year}</div>
                <div className="text-sm text-muted-foreground">
                  Total SHU: {currencyFormatter.format(item.total_shu)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Simpanan: {percentageFormatter.format(item.allocation_savings / 100)} | Partisipasi: {percentageFormatter.format(item.allocation_participation / 100)}
                </div>
              </div>
              <Badge variant={item.status === "distributed" ? "default" : "secondary"}>
                {item.status === "distributed" ? "Terdistribusi" : "Draft"}
              </Badge>
            </div>
          ))}
          {!history.length && (
            <div className="text-sm text-muted-foreground italic">
              Belum ada data riwayat SHU
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulasi Distribusi</CardTitle>
          <CardDescription>
            Hasil simulasi distribusi berdasarkan konfigurasi SHU
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {simulation?.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded border p-3"
            >
              <div>
                <div className="font-semibold">{row.member_name}</div>
                <div className="text-xs text-muted-foreground">
                  Id anggota: {row.member_id}
                </div>
              </div>
              <div className="text-sm text-right">
                Simpanan: {currencyFormatter.format(row.simpanan)}
                <br />
                Partisipasi: {currencyFormatter.format(row.partisipasi)}
                <br />
                <strong>Total: {currencyFormatter.format(row.amount)}</strong>
              </div>
            </div>
          ))}
          {!simulation?.length && (
            <div className="text-sm text-muted-foreground italic">
              Jalankan simulasi untuk melihat pembagian SHU.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribusi per Anggota</CardTitle>
          <CardDescription>Cek riwayat distribusi khusus anggota</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid items-end gap-3 md:grid-cols-4">
            <AsyncCombobox<MemberListItem, number>
              value={memberFilter.memberId ?? null}
              onChange={(value) =>
                setMemberFilter({ memberId: value ?? undefined })
              }
              getOptionValue={(member) => member.id}
              getOptionLabel={(member) =>
                member.full_name || member.no_anggota || String(member.id)
              }
              queryKey={["members", "search-shu-member"]}
              fetchPage={memberFetcher}
              placeholder="Pilih anggota"
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
            <Button
              type="button"
              variant="outline"
              onClick={handleLoadMemberDistribution}
              disabled={distributionLoading}
            >
              {distributionLoading ? "Memuat..." : "Lihat Riwayat"}
            </Button>
          </div>

          <div className="space-y-2">
            {memberDistributions?.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded border p-3"
              >
                <div>
                  <div className="font-semibold">Tahun {row.year}</div>
                  <div className="text-xs text-muted-foreground">
                    Status: {row.status}
                  </div>
                </div>
                <div className="text-sm text-right">
                  Simpanan: {currencyFormatter.format(row.simpanan)}
                  <br />
                  Partisipasi: {currencyFormatter.format(row.partisipasi)}
                  <br />
                  <strong>Total: {currencyFormatter.format(row.amount)}</strong>
                </div>
              </div>
            ))}
            {!memberDistributions?.length && (
              <div className="text-sm text-muted-foreground italic">
                Pilih anggota dan tekan &quot;Lihat Riwayat&quot; untuk menampilkan data.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
