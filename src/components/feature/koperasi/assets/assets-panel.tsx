/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  createAsset,
  deleteAsset,
  listAssets,
  updateAsset,
  updateAssetStatus,
} from "@/services/api";

export function AssetsPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    code: "",
    name: "",
    category: "",
    acquisition_date: "",
    acquisition_cost: 0,
    depreciation_method: "straight_line",
    useful_life_months: 36,
    location: "",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await listAssets();
      if (res.success) setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Aset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Kode" value={form.code} onChange={(e) => setForm((s: any) => ({ ...s, code: e.target.value }))} />
            <Input placeholder="Nama" value={form.name} onChange={(e) => setForm((s: any) => ({ ...s, name: e.target.value }))} />
            <Input placeholder="Kategori" value={form.category} onChange={(e) => setForm((s: any) => ({ ...s, category: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
            <DatePicker placeholder="Tgl Akuisisi" value={form.acquisition_date || undefined} onChange={(v) => setForm((s: any) => ({ ...s, acquisition_date: v || "" }))} triggerClassName="w-full" />
            <Input type="number" placeholder="Biaya Akuisisi" value={form.acquisition_cost} onChange={(e) => setForm((s: any) => ({ ...s, acquisition_cost: Number(e.target.value || 0) }))} />
            <Input placeholder="Metode Depresiasi" value={form.depreciation_method} onChange={(e) => setForm((s: any) => ({ ...s, depreciation_method: e.target.value }))} />
            <Input type="number" placeholder="Umur (bulan)" value={form.useful_life_months} onChange={(e) => setForm((s: any) => ({ ...s, useful_life_months: Number(e.target.value || 0) }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input placeholder="Lokasi" value={form.location} onChange={(e) => setForm((s: any) => ({ ...s, location: e.target.value }))} />
            <div />
            <Button
              onClick={async () => {
                await createAsset(form);
                setForm({ code: "", name: "", category: "", acquisition_date: "", acquisition_cost: 0, depreciation_method: "straight_line", useful_life_months: 36, location: "" });
                await load();
              }}
              disabled={loading}
            >
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Aset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!items.length && (
              <div className="text-sm text-muted-foreground italic">Belum ada aset</div>
            )}
            {items.map((a: any) => (
              <div key={a.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-md items-center">
                <div>
                  <div className="font-medium">{a.code} • {a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.category} • {a.location}</div>
                </div>
                <div>
                  <div className="text-sm">Biaya: {a.acquisition_cost}</div>
                  <div className="text-xs text-muted-foreground">Metode: {a.depreciation_method}</div>
                </div>
                <div>
                  <div className="text-sm">Status: {a.status}</div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={async () => { await updateAssetStatus(a.id, { status: a.status === 'active' ? 'inactive' : 'active' }); await load(); }}>Toggle Status</Button>
                  <Button variant="outline" size="sm" onClick={async () => { await updateAsset(a.id, { name: a.name }); await load(); }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={async () => { await deleteAsset(a.id); await load(); }}>Hapus</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
