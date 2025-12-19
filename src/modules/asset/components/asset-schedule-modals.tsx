/** @format */

"use client";

import React from "react";
import { Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      const status = selectedStatus ?? booking.backendStatus ?? "BOOKED";
      const res =
        status === "COMPLETED"
          ? await completeAssetBooking(booking.id)
          : await updateAssetBookingStatus(booking.id, status);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memperbarui status booking");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.assetRental.bookings() });
      onOpenChange(false);
    },
  });

  if (!open || !booking) return null;

  const statusLabel = selectedStatus || booking.backendStatus || booking.status;
  const isDone = statusLabel === "COMPLETED" || booking.status === "Selesai";
  const statusOptions = [
    { value: "BOOKED", label: "Menunggu / Pending Approval" },
    { value: "COMPLETED", label: "Disetujui" },
    { value: "CANCELLED", label: "Ditolak / Dibatalkan" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative mx-auto w-full max-w-2xl transform overflow-hidden rounded-2xl border border-border-light bg-white text-left shadow-2xl transition-all dark:border-border-dark dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-border-light px-5 py-4 dark:border-border-dark">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-sub-light dark:text-text-sub-dark">
                Permintaan Reservasi
              </p>
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark">
                {isEdit ? "Konfirmasi / Tandai Selesai" : "Tambah Jadwal"}
              </h3>
            </div>
            <button
              type="button"
              className="text-text-sub-light transition-colors hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1.2fr_0.8fr] sm:gap-6">
            <div className="space-y-4">
              <section className="rounded-xl border border-border-light bg-slate-50 p-4 dark:border-border-dark dark:bg-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-text-sub-light dark:text-text-sub-dark">
                      Aset
                    </p>
                    <p className="text-base font-semibold text-text-main-light dark:text-text-main-dark">
                      {booking.assetName}
                    </p>
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                      ID: {booking.assetId}
                    </p>
                  </div>
                  <Badge status={statusLabel} done={isDone} />
                </div>
              </section>

              <section className="rounded-xl border border-border-light p-4 dark:border-border-dark dark:bg-slate-900/60">
                <h4 className="mb-3 text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                  Data Penyewa
                </h4>
                <InfoRow label="Nama Penyewa" value={booking.renterName} />
                <InfoRow label="Kontak" value={booking.renterCompany} />
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-xl border border-border-light p-4 dark:border-border-dark dark:bg-slate-900/60">
                <h4 className="mb-3 text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                  Jadwal
                </h4>
                <InfoRow label="Mulai" value={booking.start} />
                <InfoRow label="Selesai" value={booking.end} />
                <InfoRow label="Durasi" value={booking.duration} />
              </section>

              <section className="rounded-xl border border-border-light p-4 dark:border-border-dark dark:bg-slate-900/60">
                <h4 className="mb-3 text-sm font-semibold text-text-main-light dark:text-text-main-dark">
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

          <div className="flex flex-col-reverse gap-3 border-t border-border-light bg-gray-50 px-5 py-4 dark:border-border-dark dark:bg-gray-800/50 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg bg-white dark:bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="rounded-lg bg-indigo-600 hover:bg-primary-hover"
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
      <span className="text-text-sub-light dark:text-text-sub-dark">
        {label}
      </span>
      <span
        className={cn(
          "text-right",
          bold && "font-semibold text-text-main-light dark:text-text-main-dark",
          muted && "text-xs text-text-sub-light dark:text-text-sub-dark"
        )}
      >
        {value ?? "-"}
      </span>
    </div>
  );
}

function Badge({ status, done }: { status?: string; done?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        done
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      )}
    >
      {status ?? "-"}
    </span>
  );
}
