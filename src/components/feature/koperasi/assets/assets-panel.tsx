/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  createAsset,
  deleteAsset,
  listAssets,
  exportAssets,
  updateAssetStatus,
  getAssetDepreciation,
  listAssetUsages,
  logAssetUsage,
} from "@/services/api";
import type { Asset, AssetDepreciation, AssetUsage } from "@/types/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

type AssetFormState = {
  code: string;
  name: string;
  category: string;
  acquisition_date: string;
  acquisition_cost: number;
  depreciation_method: string;
  useful_life_months: number;
  location: string;
};

const INITIAL_FORM: AssetFormState = {
  code: "",
  name: "",
  category: "",
  acquisition_date: "",
  acquisition_cost: 0,
  depreciation_method: "straight_line",
  useful_life_months: 36,
  location: "",
};

export function AssetsPanel({ initial = [] }: { initial?: Asset[] }) {
  const [items, setItems] = useState<Asset[]>(initial || []);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AssetFormState>(INITIAL_FORM);
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [depreciations, setDepreciations] = useState<AssetDepreciation[]>([]);
  const [usages, setUsages] = useState<AssetUsage[]>([]);
  const [notes, setNotes] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((asset) => {
      const matchesTerm = term
        ? asset.name.toLowerCase().includes(term.toLowerCase()) ||
          asset.code.toLowerCase().includes(term.toLowerCase())
        : true;
      const matchesStatus =
        status === "all" ? true : String(asset.status) === status;
      return matchesTerm && matchesStatus;
    });
  }, [items, status, term]);

  async function loadAssets() {
    setLoading(true);
    try {
      const res = await listAssets({
        term: term || undefined,
        status: status === "all" ? undefined : status,
        limit: 20,
      });
      if (res.success) setItems((res.data as Asset[]) ?? []);
    } catch (e: any) {
      toast.error(e?.message || "Gagal memuat aset");
    } finally {
      setLoading(false);
    }
  }

  async function submitAsset() {
    if (!form.code || !form.name || !form.acquisition_date || !form.category) {
      toast.error("Lengkapi data aset terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const acquisitionDateIso = toRfc3339Date(form.acquisition_date);
      if (!acquisitionDateIso) {
        toast.error("Tanggal akuisisi tidak valid");
        return;
      }
      await createAsset({
        code: form.code,
        name: form.name,
        category: form.category,
        acquisition_date: acquisitionDateIso,
        acquisition_cost: form.acquisition_cost,
        depreciation_method: form.depreciation_method,
        useful_life_months: form.useful_life_months,
        location: form.location,
      });
      toast.success("Aset ditambahkan");
      setForm(INITIAL_FORM);
      await loadAssets();
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambah aset");
    } finally {
      setLoading(false);
    }
  }

  async function selectAsset(asset: Asset) {
    setSelectedAsset(asset);
    try {
      const [depRes, usageRes] = await Promise.all([
        getAssetDepreciation(asset.id, { limit: 10 }).catch(() => null),
        listAssetUsages(asset.id, { limit: 10 }).catch(() => null),
      ]);
      setDepreciations(depRes?.success ? (depRes.data as AssetDepreciation[]) ?? [] : []);
      setUsages(usageRes?.success ? (usageRes.data as AssetUsage[]) ?? [] : []);
    } catch {
      setDepreciations([]);
      setUsages([]);
    }
  }

  async function handleExport(format: "pdf" | "xlsx") {
    try {
      const blob = await exportAssets({
        type: "assets",
        format,
        status: status === "all" ? undefined : status,
        term: term || undefined,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `assets-${Date.now()}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengekspor aset");
    }
  }

  async function handleLogUsage(asset: Asset) {
    const usedBy = prompt("Dipakai oleh", "Tim Operasional");
    if (!usedBy) return;
    const purpose = prompt("Keperluan", "Pemakaian harian") || "";
    const start = prompt("Mulai (YYYY-MM-DD)", new Date().toISOString().slice(0, 10));
    if (!start) return;
    try {
      const payloadNotes = notes.trim();
      await logAssetUsage(asset.id, {
        used_by: usedBy,
        purpose,
        start_time: new Date(start).toISOString(),
        notes: payloadNotes ? payloadNotes : undefined,
      });
      toast.success("Penggunaan dicatat");
      await selectAsset(asset);
    } catch (e: any) {
      toast.error(e?.message || "Gagal mencatat penggunaan");
    }
  }

  useEffect(() => {
    if (!initial?.length) {
      void loadAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Aset</CardTitle>
          <CardDescription>Isi data aset tetap untuk pencatatan keuangan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Kode"
              value={form.code}
              onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
            />
            <Input
              placeholder="Nama"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
            <Input
              placeholder="Kategori"
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <DatePicker
              placeholder="Tgl Akuisisi"
              value={form.acquisition_date || undefined}
              onChange={(v) =>
                setForm((s) => ({ ...s, acquisition_date: v || "" }))
              }
              triggerClassName="w-full"
            />
            <Input
              type="number"
              placeholder="Biaya Akuisisi"
              value={form.acquisition_cost || ""}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  acquisition_cost: Number(e.target.value || 0),
                }))
              }
            />
            <Input
              placeholder="Metode Depresiasi"
              value={form.depreciation_method}
              onChange={(e) =>
                setForm((s) => ({ ...s, depreciation_method: e.target.value }))
              }
            />
            <Input
              type="number"
              placeholder="Umur (bulan)"
              value={form.useful_life_months || ""}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  useful_life_months: Number(e.target.value || 0),
                }))
              }
            />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Lokasi"
              value={form.location}
              onChange={(e) =>
                setForm((s) => ({ ...s, location: e.target.value }))
              }
            />
            <Textarea
              placeholder="Catatan (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="md:col-span-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setForm(INITIAL_FORM)}
              disabled={loading}
            >
              Reset
            </Button>
            <Button onClick={submitAsset} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Aset</CardTitle>
          <CardDescription>Filter aset dan kelola status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Cari aset..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="md:w-64"
            />
            <div className="flex items-center gap-2">
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as typeof status)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadAssets}>
                {loading ? "Memuat..." : "Muat"}
              </Button>
              <Button variant="ghost" onClick={() => handleExport("pdf")}>Export PDF</Button>
              <Button variant="ghost" onClick={() => handleExport("xlsx")}>Export Excel</Button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.map((asset) => (
              <div
                key={asset.id}
                className={`flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between ${
                  selectedAsset?.id === asset.id ? "bg-muted/40" : ""
                }`}
              >
                <div>
                  <p className="font-medium">
                    {asset.code} • {asset.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {asset.category} • {asset.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Akuisisi: {formatDate(asset.acquisition_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {currencyFormatter.format(Number(asset.acquisition_cost ?? 0))}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Status: {asset.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => selectAsset(asset)}>
                    Detail
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const next = asset.status === "active" ? "inactive" : "active";
                      await updateAssetStatus(asset.id, { status: next });
                      toast.success("Status aset diperbarui");
                      await loadAssets();
                    }}
                  >
                    Ubah Status
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLogUsage(asset)}
                  >
                    Catat Penggunaan
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      await deleteAsset(asset.id);
                      toast.success("Aset dihapus");
                      await loadAssets();
                    }}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
            {!filteredItems.length && (
              <div className="text-sm italic text-muted-foreground">
                Tidak ada aset sesuai filter.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedAsset && (
        <Card>
          <CardHeader>
            <CardTitle>Detail Aset: {selectedAsset.name}</CardTitle>
            <CardDescription>
              Riwayat penyusutan dan penggunaan untuk audit internal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Penyusutan</p>
              <div className="mt-2 space-y-2">
                {depreciations.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between rounded border p-3 text-sm"
                  >
                    <span>{formatDate(dep.period)}</span>
                    <span>{currencyFormatter.format(dep.amount)}</span>
                    <span className="text-muted-foreground">
                      Akumulasi: {currencyFormatter.format(dep.accumulated)}
                    </span>
                  </div>
                ))}
                {!depreciations.length && (
                  <div className="text-sm text-muted-foreground italic">
                    Belum ada data penyusutan
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Penggunaan</p>
              <div className="mt-2 space-y-2">
                {usages.map((usage) => (
                  <div
                    key={usage.id}
                    className="rounded border p-3 text-sm"
                  >
                    <p className="font-medium">{usage.used_by}</p>
                    <p className="text-muted-foreground">
                      {usage.purpose} • {formatDate(usage.start_time)}
                    </p>
                    {usage.notes ? (
                      <p className="text-xs text-muted-foreground">Catatan: {usage.notes}</p>
                    ) : null}
                  </div>
                ))}
                {!usages.length && (
                  <div className="text-sm text-muted-foreground italic">
                    Belum ada catatan penggunaan
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function toRfc3339Date(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
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
