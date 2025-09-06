/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Users, DollarSign, Calculator, Download } from "lucide-react";
import {
  createYearlySHU,
  distributeSHU,
  exportSHURaw,
  listSHUByMember,
  listSHUHistory,
  simulateSHU,
} from "@/services/api";

export default function SHUPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<number | "">(new Date().getFullYear());
  const [total, setTotal] = useState<number | "">("");
  const [simulation, setSimulation] = useState<any[] | null>(null);
  const [memberId, setMemberId] = useState<string>("");
  const [memberDist, setMemberDist] = useState<any[] | null>(null);

  async function loadHistory() {
    setLoading(true);
    try {
      const res = await listSHUHistory();
      if (res.success) setHistory(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const latest = useMemo(() => (history?.[0] ? history[0] : null), [history]);

  async function onCreateYearly() {
    if (!year || !total) return;
    await createYearlySHU({ year: Number(year), total_shu: Number(total) });
    setTotal("");
    await loadHistory();
  }

  async function onSimulate() {
    if (!year) return;
    const res = await simulateSHU(year);
    if (res.success) setSimulation(res.data || []);
  }

  async function onDistribute() {
    if (!year) return;
    await distributeSHU(year, {
      method: "transfer",
      description: `Distribusi SHU ${year}`,
    });
    await loadHistory();
  }

  async function onExport() {
    const y = year || latest?.year;
    if (!y) return;
    const blob = await exportSHURaw(y);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `shu-${y}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function loadMember() {
    if (!memberId) return;
    const res = await listSHUByMember(memberId);
    if (res.success) setMemberDist(res.data || []);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sisa Hasil Usaha (SHU)</h2>
          <p className="text-muted-foreground">
            Kelola pembagian SHU kepada anggota
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSimulate}>
            <Calculator className="h-4 w-4 mr-2" /> Hitung SHU
          </Button>
          <Button type="button" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" /> Export Data
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Input & Aksi</CardTitle>
          <CardDescription>
            Input total SHU tahunan, simulasi, dan distribusi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Tahun</div>
              <Input
                type="number"
                value={String(year)}
                onChange={(e) =>
                  setYear(e.target.value ? Number(e.target.value) : "")
                }
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Total SHU
              </div>
              <Input
                type="number"
                placeholder="50000000"
                value={String(total)}
                onChange={(e) =>
                  setTotal(e.target.value ? Number(e.target.value) : "")
                }
              />
            </div>
            <Button
              type="button"
              onClick={onCreateYearly}
              disabled={loading || !year || !total}
            >
              Simpan Total
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSimulate}
              disabled={loading || !year}
            >
              Simulasi
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onDistribute}
              disabled={loading || !year}
            >
              Distribusi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SHU Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total SHU {latest?.year ?? "-"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latest?.total_shu ?? "-"}</div>
            <p className="text-xs text-muted-foreground">Terakhir diinput</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {latest?.status ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              Status tahun berjalan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tahun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latest?.year ?? "-"}</div>
            <p className="text-xs text-muted-foreground">Tahun data terbaru</p>
          </CardContent>
        </Card>
      </div>

      {/* SHU History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat SHU</CardTitle>
          <CardDescription>Data SHU per tahun</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((shu, idx) => (
              <div
                key={shu?.id ?? `${shu?.year ?? "unknown"}-${idx}`}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">SHU Tahun {shu.year}</h3>
                    <p className="text-sm text-muted-foreground">
                      Total: {shu.total_shu}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Status: {shu.status ?? "-"}
                    </p>
                  </div>
                  <Badge variant="default">{shu.status ?? "-"}</Badge>
                </div>
              </div>
            ))}
            {!history.length && (
              <div className="text-sm text-muted-foreground italic">
                Belum ada data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Result */}
      {simulation && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Simulasi {year}</CardTitle>
            <CardDescription>Perkiraan distribusi per anggota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simulation.map((row: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="font-medium">
                    Anggota #{row.member_id ?? row.memberId ?? idx + 1}
                  </div>
                  <div className="text-sm">
                    Jumlah: {row.amount ?? row.total ?? "-"}
                  </div>
                </div>
              ))}
              {!simulation.length && (
                <div className="text-sm text-muted-foreground italic">
                  Tidak ada hasil simulasi
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member SHU Distribution (by member) */}
      <Card>
        <CardHeader>
          <CardTitle>Pembagian SHU per Anggota</CardTitle>
          <CardDescription>
            Masukkan ID anggota untuk melihat riwayat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-4">
            <Input
              placeholder="ID Anggota"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
            <Button type="button" onClick={loadMember} disabled={!memberId}>
              Muat Riwayat
            </Button>
          </div>
          <div className="space-y-4">
            {(memberDist ?? []).map((row: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Anggota #{row.member_id ?? memberId}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tahun: {row.year ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Total SHU: {row.amount ?? row.total ?? "-"}
                    </p>
                  </div>
                  <Badge variant="secondary">Riwayat</Badge>
                </div>
              </div>
            ))}
            {memberDist !== null && !(memberDist ?? []).length && (
              <div className="text-sm text-muted-foreground italic">
                Tidak ada data
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
