/** @format */

"use client";

import { Calendar, Info } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { AssetRentalDialogShell } from "./AssetRentalDialogShell";

type AssetRentalReturnConfirmationDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}>;

function toLocalDateTimeInputValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AssetRentalReturnConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: AssetRentalReturnConfirmationDialogProps) {
  const [returnTimestamp, setReturnTimestamp] = useState(() =>
    toLocalDateTimeInputValue(new Date())
  );
  const [condition, setCondition] = useState("Baik / Normal");
  const [notes, setNotes] = useState("");

  return (
    <AssetRentalDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Konfirmasi Pengembalian Aset"
      footer={
        <>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={onConfirm}
          >
            Konfirmasi &amp; Selesaikan
          </Button>
          <Button
            variant="outline"
            className="border-slate-300"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="return-date">Timestamp Pengembalian</Label>
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="return-date"
            type="datetime-local"
            value={returnTimestamp}
            onChange={(event) => setReturnTimestamp(event.target.value)}
            className="border-slate-300 bg-white pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Kondisi Akhir Aset</Label>
        <div className="grid grid-cols-2 gap-3">
          {["Baik / Normal", "Rusak / Hilang"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCondition(item)}
              className={cn(
                "rounded-lg border p-3 text-center text-sm font-medium transition-colors",
                condition === item
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="return-note">Catatan Pengembalian</Label>
        <Textarea
          id="return-note"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Contoh: Lecet halus pada body bagian bawah..."
          className="border-slate-300 bg-white"
        />
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Pemeriksaan Kelengkapan</p>
            <p className="mt-1 opacity-90">
              Pastikan Charger Original dan Sleeve Case telah dikembalikan sebelum melakukan konfirmasi.
            </p>
          </div>
        </div>
      </div>
    </AssetRentalDialogShell>
  );
}
