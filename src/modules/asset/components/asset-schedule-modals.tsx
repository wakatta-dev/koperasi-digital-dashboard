/** @format */

"use client";

import React from "react";
import { Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { QK } from "@/hooks/queries/queryKeys";
import {
  completeAssetBooking,
  updateAssetBookingStatus,
} from "@/services/api/asset-rental";
import type { AssetSchedule } from "../types";

type ScheduleModalProps = {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: AssetSchedule;
};

export function ScheduleModal({
  mode,
  open,
  onOpenChange,
  booking,
}: ScheduleModalProps) {
  const isEdit = mode === "edit";

  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = React.useState<
    string | undefined
  >(booking?.backendStatus);
  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: async () => {
      if (!booking?.id) {
        throw new Error("Booking tidak ditemukan");
      }
      const status =
        selectedStatus ?? booking.backendStatus ?? "PENDING_REVIEW";
      const res =
        status === "CONFIRMED_FULL"
          ? await completeAssetBooking(booking.id)
          : await updateAssetBookingStatus(booking.id, status);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memperbarui status booking");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.assetRental.bookings() });
      showToastSuccess("Status diperbarui", "Reservasi berhasil diperbarui");
      onOpenChange(false);
    },
    onError: (err: any) => {
      showToastError("Gagal menyimpan status", err?.message || err);
    },
  });

  if (!open || !booking) return null;

  const statusLabel = selectedStatus || booking.backendStatus || booking.status;
  const normalizedLabel = (statusLabel || "").toUpperCase();
  const isDone =
    normalizedLabel === "CONFIRMED_FULL" || booking.status === "Selesai";
  const statusOptions = [
    // { value: "PENDING_REVIEW", label: "Menunggu Persetujuan" },
    { value: "AWAITING_DP", label: "Disetujui (Menunggu DP)" },
    // { value: "AWAITING_SETTLEMENT", label: "DP Lunas (Menunggu Pelunasan)" },
    // { value: "CONFIRMED_FULL", label: "Tandai Selesai / Konfirmasi Penuh" },
    // { value: "CANCELLED", label: "Dibatalkan" },
    { value: "REJECTED", label: "Ditolak" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative mx-auto w-full max-w-2xl transform overflow-hidden rounded-2xl border border-border bg-popover text-left shadow-2xl transition-all">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Permintaan Reservasi
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                {isEdit ? "Konfirmasi / Tandai Selesai" : "Tambah Jadwal"}
              </h3>
            </div>
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1.2fr_0.8fr] sm:gap-6">
            <div className="space-y-4">
              <section className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Aset
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {booking.assetName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {booking.assetId}
                    </p>
                  </div>
                  <StatusBadge status={statusLabel} done={isDone} />
                </div>
              </section>

              <section className="rounded-xl border border-border bg-card p-4">
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  Data Penyewa
                </h4>
                <InfoRow label="Nama Penyewa" value={booking.renterName} />
                <InfoRow label="Kontak" value={booking.renterCompany} />
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-xl border border-border bg-card p-4">
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  Jadwal
                </h4>
                <InfoRow label="Mulai" value={booking.start} />
                <InfoRow label="Selesai" value={booking.end} />
                <InfoRow label="Durasi" value={booking.duration} />
              </section>

              <section className="rounded-xl border border-border bg-card p-4">
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  Ringkasan & Status Approval
                </h4>
                <InfoRow label="Total" value={booking.price ?? "-"} bold />
                <InfoRow
                  label="Status Approval"
                  value={
                    <Select
                      value={statusLabel}
                      onValueChange={(val) => setSelectedStatus(val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-10 w-full text-left text-sm">
                        <SelectValue placeholder="Pilih status approval" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  }
                />
              </section>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/40 px-5 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg bg-background"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isPending}
              onClick={() => updateStatus().catch(() => undefined)}
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Simpan Status"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value?: React.ReactNode;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right",
          bold && "font-semibold text-foreground",
          muted && "text-xs text-muted-foreground"
        )}
      >
        {value ?? "-"}
      </span>
    </div>
  );
}

function StatusBadge({ status, done }: { status?: string; done?: boolean }) {
  const label = (() => {
    const key = (status || "").toUpperCase();
    switch (key) {
      case "PENDING_REVIEW":
        return "Menunggu Persetujuan";
      case "AWAITING_DP":
        return "Menunggu DP";
      case "AWAITING_SETTLEMENT":
        return "Menunggu Pelunasan";
      case "CONFIRMED_FULL":
        return "Terkonfirmasi";
      case "CANCELLED":
        return "Dibatalkan";
      case "REJECTED":
        return "Ditolak";
      default:
        return status ?? "-";
    }
  })();
  return (
    <Badge
      variant={done ? "default" : "secondary"}
      className="rounded-full px-3 py-1 text-xs font-semibold"
    >
      {label}
    </Badge>
  );
}
