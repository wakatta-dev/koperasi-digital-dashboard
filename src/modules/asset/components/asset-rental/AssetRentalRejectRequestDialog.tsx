/** @format */

"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { AssetRentalDialogShell } from "./AssetRentalDialogShell";

type AssetRentalRejectRequestDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (reason: string) => void;
}>;

export function AssetRentalRejectRequestDialog({
  open,
  onOpenChange,
  onConfirm,
}: AssetRentalRejectRequestDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <AssetRentalDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Tolak Pengajuan Sewa"
      footer={
        <>
          <Button
            className="bg-red-600 text-white hover:bg-red-500"
            disabled={reason.trim().length === 0}
            onClick={() => {
              onConfirm?.(reason.trim());
              setReason("");
              onOpenChange(false);
            }}
          >
            Konfirmasi Tolak
          </Button>
          <Button
            variant="outline"
            className="border-slate-300"
            onClick={() => {
              setReason("");
              onOpenChange(false);
            }}
          >
            Batal
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="reject-reason">Alasan Penolakan</Label>
        <Textarea
          id="reject-reason"
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Berikan alasan singkat mengapa pengajuan ini ditolak..."
          className="border-slate-300 bg-slate-50"
        />
      </div>

      <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-orange-800">Perhatian</p>
            <p className="mt-1 text-sm text-orange-700">
              Peminjam akan menerima notifikasi otomatis mengenai status penolakan ini.
            </p>
          </div>
        </div>
      </div>
    </AssetRentalDialogShell>
  );
}
