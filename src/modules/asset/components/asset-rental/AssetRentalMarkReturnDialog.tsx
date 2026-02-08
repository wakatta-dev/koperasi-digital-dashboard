/** @format */

"use client";

import { Check, Wrench, XCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { AssetRentalDialogShell } from "./AssetRentalDialogShell";

type AssetRentalMarkReturnDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetName?: string;
  renterName?: string;
  onConfirm?: (payload: { condition: "baik" | "rusak" | "perbaikan"; notes: string }) => void;
}>;

const options = [
  { label: "Baik", value: "baik", icon: Check },
  { label: "Rusak", value: "rusak", icon: XCircle },
  { label: "Perlu Perbaikan", value: "perbaikan", icon: Wrench },
] as const;

export function AssetRentalMarkReturnDialog({
  open,
  onOpenChange,
  assetName,
  renterName,
  onConfirm,
}: AssetRentalMarkReturnDialogProps) {
  const [selected, setSelected] = useState<(typeof options)[number]["value"]>(
    "baik"
  );
  const [notes, setNotes] = useState("");

  return (
    <AssetRentalDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Tandai Selesai Pengembalian"
      footer={
        <>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => {
              onConfirm?.({
                condition: selected,
                notes: notes.trim(),
              });
              setSelected("baik");
              setNotes("");
              onOpenChange(false);
            }}
          >
            Tandai Selesai
          </Button>
          <Button
            variant="outline"
            className="border-slate-300"
            onClick={() => {
              setSelected("baik");
              setNotes("");
              onOpenChange(false);
            }}
          >
            Batal
          </Button>
        </>
      }
    >
      <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{assetName ?? "-"}</h4>
        <p className="mt-1 text-xs text-slate-500">
          Dikembalikan oleh{" "}
          <span className="font-medium text-slate-700">{renterName ?? "-"}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label>Kondisi Akhir Aset</Label>
        <div className="grid grid-cols-3 gap-3">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                className={cn(
                  "rounded-xl border p-3 text-center transition-colors",
                  selected === option.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <span className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-slate-900">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="return-notes">Catatan Kondisi Singkat</Label>
        <Textarea
          id="return-notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Contoh: Layar baret halus, charger lengkap..."
          className="border-slate-200 bg-slate-50"
        />
      </div>
    </AssetRentalDialogShell>
  );
}
