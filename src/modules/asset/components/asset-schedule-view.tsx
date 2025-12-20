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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { QK } from "@/hooks/queries/queryKeys";
import { getAssetRentalBookings } from "@/services/api/asset-rental";
import type { AssetSchedule } from "../types";
import { ScheduleModal } from "./asset-schedule-modals";
import { mapBookingToSchedule } from "../utils/mappers";

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

const statusClass: Record<AssetSchedule["status"], string> = {
  Confirmed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800",
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
  Reserved:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
  Finished:
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
  Cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
  Dipesan: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Menunggu Pembayaran":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Berlangsung:
    "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  Selesai: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  Cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
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
    <div className="mx-auto max-w-[1400px] text-slate-900 dark:text-slate-100">
      <div className="space-y-6">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
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
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
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
            <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
              Penambahan reservasi dilakukan oleh klien; halaman ini hanya untuk
              review dan approval.
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            {error instanceof Error
              ? error.message
              : "Gagal memuat data reservasi"}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_minmax(260px,1fr)]">
          <Card className="overflow-hidden border-border-light dark:border-border-dark">
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow className="divide-x divide-border-light dark:divide-border-dark">
                        <TableHead className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                          No
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                          Aset
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                          Penyewa
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                          Waktu Sewa
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                          Harga Sewa
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                          Status
                        </TableHead>
                        <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border-light bg-white dark:divide-border-dark dark:bg-slate-900">
                      {isLoading ? renderSkeletonRows() : null}

                      {!isLoading && schedules.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="px-6 py-6 text-center text-sm text-text-sub-light dark:text-text-sub-dark"
                          >
                            Belum ada reservasi tercatat.
                          </TableCell>
                        </TableRow>
                      ) : null}

                      {schedules.map((schedule, idx) => (
                        <TableRow
                          key={schedule.id}
                          className={cn(
                            "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                            schedule.faded ? "opacity-60" : ""
                          )}
                        >
                          <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-main-light dark:text-text-main-dark align-top">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top">
                            <div className="flex items-start">
                              <div className="ml-4 space-y-1">
                                <div className="text-sm font-semibold leading-snug text-text-main-light dark:text-text-main-dark">
                                  {schedule.assetName}
                                </div>
                                <div className="text-xs leading-snug text-text-sub-light dark:text-text-sub-dark">
                                  ID: {schedule.assetId}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top text-sm text-text-main-light dark:text-text-main-dark">
                            {schedule.price ?? "-"}
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top">
                            <div className="text-sm leading-snug text-text-main-light dark:text-text-main-dark">
                              {schedule.renterCompany}
                            </div>
                            <div className="text-xs leading-snug text-text-sub-light dark:text-text-sub-dark">
                              {schedule.renterName}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 align-top">
                            <div className="text-sm leading-snug text-text-main-light dark:text-text-main-dark">
                              {schedule.start}{" "}
                              {schedule.end ? `- ${schedule.end}` : ""}
                            </div>
                            <div className="text-xs leading-snug text-text-sub-light dark:text-text-sub-dark">
                              {schedule.duration}
                              {schedule.timeRange
                                ? ` • ${schedule.timeRange}`
                                : ""}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap px-6 py-4 align-top">
                            <Badge
                              variant="outline"
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5",
                                statusClass[schedule.status]
                              )}
                            >
                              {schedule.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium align-top">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-text-sub-light hover:text-primary"
                              onClick={() => handleRowAction(schedule)}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="flex items-center justify-between border-t border-border-light bg-white px-6 py-4 text-sm text-text-sub-light dark:border-border-dark dark:bg-slate-900 dark:text-text-sub-dark">
                <div className="hidden sm:block">
                  Menampilkan{" "}
                  <span className="font-medium text-text-main-light dark:text-text-main-dark">
                    {totalRows || 0}
                  </span>{" "}
                  hasil
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-text-sub-light hover:bg-gray-50 disabled:opacity-50 dark:text-text-sub-dark dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-text-main-light hover:bg-gray-50 dark:text-text-main-dark dark:hover:bg-gray-800"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden border-border-light shadow-lg dark:border-border-dark dark:bg-slate-900 lg:flex lg:flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-text-main-light dark:text-text-main-dark">
                Filter
              </CardTitle>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                Filter status yang didukung backend: PENDING_REVIEW, AWAITING_DP, AWAITING_SETTLEMENT, CONFIRMED_FULL, CANCELLED, REJECTED.
              </p>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-6">
              <Input
                placeholder="Cari nama pemesan"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-main-light focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-slate-900 dark:text-text-main-dark"
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                  Status (sesuai backend)
                </label>
                <Select
                  value={statusFilter || "ALL"}
                  onValueChange={(val) => setStatusFilter(val === "ALL" ? "" : val)}
                >
                  <SelectTrigger className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-main-light focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-slate-900 dark:text-text-main-dark">
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="PENDING_REVIEW">Menunggu Persetujuan</SelectItem>
                    <SelectItem value="AWAITING_DP">Menunggu DP</SelectItem>
                    <SelectItem value="AWAITING_SETTLEMENT">Menunggu Pelunasan</SelectItem>
                    <SelectItem value="CONFIRMED_FULL">Terkonfirmasi</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    <SelectItem value="REJECTED">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-auto flex items-center space-x-3 border-t border-border-light pt-4 dark:border-border-dark">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg bg-white text-sm font-medium text-text-main-light hover:bg-gray-50 dark:bg-transparent dark:text-text-main-dark dark:hover:bg-gray-800"
                  onClick={() => setStatusFilter("")}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-primary-hover"
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
      <TableCell className="px-6 py-4 text-sm text-text-sub-light dark:text-text-sub-dark">
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
