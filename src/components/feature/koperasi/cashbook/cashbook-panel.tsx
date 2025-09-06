/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createManualCashEntry, exportCashSummaryRaw, getCashSummary } from "@/services/api";

export function CashbookPanel() {
  const [summary, setSummary] = useState<any | null>(null);
  const [range, setRange] = useState<{ start?: string; end?: string }>({});
  const [entry, setEntry] = useState({ amount: 0, type: "in" as "in" | "out", category: "operasional", note: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadSummary() {
    try {
      setLoading(true);
      const res = await getCashSummary({ ...range });
      if (res.success) setSummary(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreateEntry() {
    setSubmitting(true);
    try {
      await createManualCashEntry(entry as any);
      setEntry({ ...entry, amount: 0, note: "" });
      await loadSummary();
    } finally {
      setSubmitting(false);
    }
  }

  async function onExport() {
    const blob = await exportCashSummaryRaw({ report_type: "summary", ...range });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cash-summary";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kas (Cashbook)</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <DateTimeRangePicker
            value={{ start: range.start, end: range.end }}
            onChange={(s, e) => setRange({ start: s, end: e })}
            triggerClassName="w-full"
          />
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={loadSummary} disabled={loading}>Muat Ringkasan</Button>
            <Button type="button" onClick={onExport}>Export</Button>
          </div>
        </div>

        {/* Summary view */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Total Masuk</div>
            <div className="text-xl font-semibold">{summary?.total_in ?? 0}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Total Keluar</div>
            <div className="text-xl font-semibold">{summary?.total_out ?? 0}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Saldo</div>
            <div className="text-xl font-semibold">{summary?.balance ?? 0}</div>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Entri Kas Manual</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Select value={entry.type} onValueChange={(v) => setEntry((s) => ({ ...s, type: v as any }))}>
              <SelectTrigger><SelectValue placeholder="Tipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Masuk</SelectItem>
                <SelectItem value="out">Keluar</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Jumlah" value={entry.amount} onChange={(e) => setEntry((s) => ({ ...s, amount: Number(e.target.value || 0) }))} />
            <Input placeholder="Kategori" value={entry.category} onChange={(e) => setEntry((s) => ({ ...s, category: e.target.value }))} />
            <Input placeholder="Catatan" value={entry.note} onChange={(e) => setEntry((s) => ({ ...s, note: e.target.value }))} />
            <Button onClick={onCreateEntry} disabled={submitting}>Simpan</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
