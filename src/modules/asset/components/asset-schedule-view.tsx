/** @format */

"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell } from "@/components/shared/data-display/TableCell";
import { TableHeader } from "@/components/shared/data-display/TableHeader";
import { TableRow } from "@/components/shared/data-display/TableRow";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { cn } from "@/lib/utils";
import { QK } from "@/hooks/queries/queryKeys";
import { getAssetRentalBookings } from "@/services/api/asset-rental";
import type { AssetSchedule } from "../types";
import { ScheduleModal } from "./asset-schedule-modals";
import { mapBookingToSchedule } from "../utils/mappers";
import { Label } from "@/components/ui/label";

type AssetScheduleViewProps = {
  activeTab?: "manajemen" | "jadwal";
};

const tabs = [
  {
    key: "manajemen",
    label: "Manajemen Aset",
    href: "/bumdes/asset/manajemen",
  },
  { key: "jadwal", label: "Manajemen Penyewaan", href: "/bumdes/asset/jadwal" },
];

const statusVariant: Record<
  AssetSchedule["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  Confirmed: "default",
  Pending: "secondary",
  Reserved: "outline",
  Finished: "secondary",
  Cancelled: "destructive",
  Dipesan: "outline",
  "Menunggu Pembayaran": "secondary",
  Berlangsung: "default",
  Selesai: "secondary",
};

export function AssetScheduleView({
  activeTab = "jadwal",
}: AssetScheduleViewProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    React.useState<AssetSchedule | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: QK.assetRental.bookings({ status: statusFilter || undefined }),
    queryFn: async (): Promise<AssetSchedule[]> => {
      const res = await getAssetRentalBookings(
        statusFilter ? { status: statusFilter } : undefined
      );
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat jadwal reservasi");
      }
      return res.data.map(mapBookingToSchedule);
    },
  });
  const schedules = React.useMemo(() => data ?? [], [data]);
  const totalRows = schedules.length;

  const handleRowAction = (schedule: AssetSchedule) => {
    setSelectedSchedule(schedule);
    setEditOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1400px] text-foreground">
      <div className="space-y-6">
        <div className="inline-flex rounded-lg bg-muted/40 p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              variant={
                (tab.key === "manajemen" && activeTab === "manajemen") ||
                (tab.key === "jadwal" && activeTab === "jadwal")
                  ? "secondary"
                  : "ghost"
              }
              className={cn(
                "h-auto rounded-md px-4 py-1.5 text-sm font-medium shadow-none",
                (tab.key === "manajemen" && activeTab === "manajemen") ||
                  (tab.key === "jadwal" && activeTab === "jadwal")
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                if (tab.href) {
                  router.push(tab.href);
                }
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Daftar Reservasi</h2>
            <p className="text-sm text-muted-foreground">
              Penambahan reservasi dilakukan oleh klien; halaman ini hanya untuk
              review dan approval.
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Gagal memuat data reservasi"}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_minmax(260px,1fr)]">
          <Card className="flex flex-col overflow-hidden border-border p-0">
            <CardContent className="flex h-full min-h-[520px] flex-col p-0">
              <ScrollArea className="w-full flex-1 min-h-0">
                <div className="min-w-[1000px]">
                  <TableShell
                    className="w-full text-sm"
                    containerClassName="overflow-visible"
                  >
                    <TableHeader className="bg-muted/40">
                      <TableRow className="divide-x divide-border">
                        <TableCell
                          as="th"
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          No
                        </TableCell>
                        <TableCell
                          as="th"
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          Aset
                        </TableCell>
                        <TableCell
                          as="th"
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          Penyewa
                        </TableCell>
                        <TableCell
                          as="th"
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          Waktu Sewa
                        </TableCell>
                        <TableCell
                          as="th"
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          Harga Sewa
                        </TableCell>
                        <TableCell
                          as="th"
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          Status
                        </TableCell>
                        <TableCell
                          as="th"
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          Aksi
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <tbody className="divide-y divide-border bg-card">
                      {isLoading ? renderSkeletonRows() : null}

                      {!isLoading && schedules.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="px-6 py-6 text-center text-sm text-muted-foreground"
                          >
                            Belum ada reservasi tercatat.
                          </TableCell>
                        </TableRow>
                      ) : null}

                      {schedules.map((schedule, idx) => (
                        <TableRow
                          key={schedule.id}
                          className={cn(
                            "transition-colors hover:bg-muted/40",
                            schedule.faded ? "opacity-60" : ""
                          )}
                        >
                          <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground align-top">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top">
                            <div className="flex items-start">
                              <div className="ml-4 space-y-1">
                                <div className="text-sm font-semibold leading-snug text-foreground">
                                  {schedule.assetName}
                                </div>
                                <div className="text-xs leading-snug text-muted-foreground">
                                  ID: {schedule.assetId}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top text-sm text-foreground">
                            {schedule.price ?? "-"}
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top">
                            <div className="text-sm leading-snug text-foreground">
                              {schedule.renterCompany}
                            </div>
                            <div className="text-xs leading-snug text-muted-foreground">
                              {schedule.renterName}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top">
                            <div className="text-sm leading-snug text-foreground">
                              {schedule.start}{" "}
                              {schedule.end ? `- ${schedule.end}` : ""}
                            </div>
                            <div className="text-xs leading-snug text-muted-foreground">
                              {schedule.duration}
                              {schedule.timeRange
                                ? ` • ${schedule.timeRange}`
                                : ""}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap px-6 py-4 align-top">
                            <Badge
                              variant={statusVariant[schedule.status]}
                              className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5"
                            >
                              {schedule.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium align-top">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => handleRowAction(schedule)}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </TableShell>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="mt-auto flex items-center justify-between border-t border-border bg-card px-6 py-4 text-sm text-muted-foreground">
                <div className="hidden sm:block">
                  Menampilkan{" "}
                  <span className="font-medium text-foreground">
                    {totalRows || 0}
                  </span>{" "}
                  hasil
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-muted-foreground hover:bg-muted/40 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-foreground hover:bg-muted/40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden border-border bg-card shadow-lg lg:flex lg:flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">
                Filter
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Pilih status pemesanan yang tersedia
              </p>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-4">
              <Input
                placeholder="Cari nama pemesan"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary"
              />

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Status
                </Label>
                <Select
                  value={statusFilter || "ALL"}
                  onValueChange={(val) =>
                    setStatusFilter(val === "ALL" ? "" : val)
                  }
                >
                  <SelectTrigger className="w-full rounded-lg border border-input bg-background px-4  text-sm text-foreground focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="PENDING_REVIEW">
                      Menunggu Persetujuan
                    </SelectItem>
                    <SelectItem value="AWAITING_DP">Menunggu DP</SelectItem>
                    <SelectItem value="AWAITING_SETTLEMENT">
                      Menunggu Pelunasan
                    </SelectItem>
                    <SelectItem value="CONFIRMED_FULL">
                      Terkonfirmasi
                    </SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    <SelectItem value="REJECTED">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-auto flex items-center space-x-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg bg-background text-sm font-medium text-foreground hover:bg-muted/40"
                  onClick={() => setStatusFilter("")}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-lg text-sm font-medium text-primary-foreground"
                  onClick={() => {
                    // query already reacts to state change; button kept for UX parity
                  }}
                >
                  Terapkan Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ScheduleModal
        mode="edit"
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedSchedule(null);
        }}
        booking={selectedSchedule ?? undefined}
      />
    </div>
  );
}

function renderSkeletonRows(count = 5) {
  return Array.from({ length: count }).map((_, idx) => (
    <TableRow key={`skeleton-${idx}`} className="animate-pulse">
      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-3 w-20" />
      </TableCell>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-24" />
      </TableCell>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell className="px-6 py-4 text-right">
        <Skeleton className="ml-auto h-5 w-5 rounded" />
      </TableCell>
    </TableRow>
  ));
}
