/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { exportReportRaw } from "@/services/api";

export function ExportQuickClient() {
  const [type, setType] = useState<string>("profit-loss");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [format, setFormat] = useState<"pdf" | "xlsx">("pdf");
  const [busy, setBusy] = useState(false);

  async function onExport() {
    setBusy(true);
    try {
      const blob = await exportReportRaw({ type, start: start || undefined, end: end || undefined, format });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `laporan-${type}${start ? `-${start}` : ""}${end ? `-${end}` : ""}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Cepat</CardTitle>
        <CardDescription>Export laporan gabungan sesuai tipe</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profit-loss">Profit Loss</SelectItem>
              <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
              <SelectItem value="cashflow">Cashflow</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker
            placeholder="Rentang"
            value={{ start: start || undefined, end: end || undefined }}
            onChange={(s, e) => { setStart(s || ""); setEnd(e || ""); }}
            triggerClassName="w-full"
          />
          <Select value={format} onValueChange={(v) => setFormat(v as "pdf" | "xlsx")}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
            </SelectContent>
          </Select>
          <div className="md:col-span-2 flex gap-2">
            <Button onClick={onExport} disabled={busy}>{busy ? "Mengekspor..." : "Export"}</Button>
            <Button variant="outline" onClick={() => { setStart(""); setEnd(""); }}>Reset</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
