/** @format */

"use client";

import React from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { assetSchedules } from "../data/schedules";
import type { AssetSchedule } from "../types";
import { ScheduleModal } from "./asset-schedule-modals";

type AssetScheduleViewProps = {
  activeTab?: "manajemen" | "jadwal";
};

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
};

const actionIcon = (
  <MoreVertical className="h-5 w-5 text-text-sub-light transition-colors hover:text-primary" />
);

export function AssetScheduleView({ activeTab = "jadwal" }: AssetScheduleViewProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <div className="mx-auto max-w-[1400px] text-slate-900 dark:text-slate-100">
      <div className="space-y-6">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {["Manajemen Aset", "Jadwal Aset Sewa"].map((tab) => (
            <Button
              key={tab}
              type="button"
              variant={
                (tab === "Manajemen Aset" && activeTab === "manajemen") ||
                (tab === "Jadwal Aset Sewa" && activeTab === "jadwal")
                  ? "secondary"
                  : "ghost"
              }
              className={cn(
                "h-auto rounded-md px-4 py-1.5 text-sm font-medium shadow-none",
                (tab === "Manajemen Aset" && activeTab === "manajemen") ||
                  (tab === "Jadwal Aset Sewa" && activeTab === "jadwal")
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              )}
              onClick={() => {
                if (tab === "Manajemen Aset") {
                  router.push("/bumdes/asset/manajemen");
                }
              }}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Daftar Reservasi</h2>
            <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
              Penambahan reservasi dilakukan oleh klien; halaman ini hanya untuk review dan approval.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_minmax(260px,1fr)]">
          <div className="rounded-xl overflow-hidden border border-border-light bg-white shadow-sm dark:border-border-dark dark:bg-slate-900">
            <div className="relative max-w-full overflow-x-auto">
              <table className="w-full min-w-[1000px] divide-y divide-border-light dark:divide-border-dark">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                      Aset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                      Penyewa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                      Waktu Sewa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                      Harga Sewa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light bg-white dark:divide-border-dark dark:bg-slate-900">
                  {assetSchedules.map((schedule, idx) => (
                    <tr
                      key={schedule.id}
                      className={cn(
                        "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                        schedule.faded ? "opacity-60" : ""
                      )}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-main-light dark:text-text-main-dark">
                        {idx + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={schedule.thumbnail}
                              alt={schedule.assetName}
                              className={cn(
                                "h-10 w-10 rounded-lg object-cover",
                                schedule.faded ? "grayscale" : ""
                              )}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
                              {schedule.assetName}
                            </div>
                            <div className="text-xs text-text-sub-light dark:text-text-sub-dark">
                              ID: {schedule.assetId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-text-main-light dark:text-text-main-dark">
                        {schedule.price ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-text-main-light dark:text-text-main-dark">
                          {schedule.renterCompany}
                        </div>
                        <div className="text-xs text-text-sub-light dark:text-text-sub-dark">
                          {schedule.renterName}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-text-main-light dark:text-text-main-dark">
                          {schedule.start}{" "}
                          {schedule.end ? `- ${schedule.end}` : ""}
                        </div>
                        <div className="text-xs text-text-sub-light dark:text-text-sub-dark">
                          {schedule.duration}
                          {schedule.timeRange ? ` • ${schedule.timeRange}` : ""}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex px-2.5 py-0.5 text-xs font-semibold leading-5 rounded-full",
                            statusClass[schedule.status]
                          )}
                        >
                          {schedule.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          className="text-text-sub-light transition-colors hover:text-primary"
                          onClick={() => setEditOpen(true)}
                        >
                          {actionIcon}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-border-light bg-white px-6 py-4 text-sm text-text-sub-light dark:border-border-dark dark:bg-slate-900 dark:text-text-sub-dark">
              <div className="hidden sm:block">
                Menampilkan{" "}
                <span className="font-medium text-text-main-light dark:text-text-main-dark">
                  1
                </span>{" "}
                sampai{" "}
                <span className="font-medium text-text-main-light dark:text-text-main-dark">
                  5
                </span>{" "}
                dari{" "}
                <span className="font-medium text-text-main-light dark:text-text-main-dark">
                  12
                </span>{" "}
                hasil
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center gap-1 rounded-md border border-border-light px-3 py-1 text-sm text-text-sub-light transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-border-dark dark:text-text-sub-dark dark:hover:bg-gray-800">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button className="flex items-center gap-1 rounded-md border border-border-light px-3 py-1 text-sm text-text-main-light transition-colors hover:bg-gray-50 dark:border-border-dark dark:text-text-main-dark dark:hover:bg-gray-800">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden rounded-xl border border-border-light bg-white shadow-lg dark:border-border-dark dark:bg-slate-900 lg:flex lg:flex-col">
            <div className="p-6">
              <h3 className="mb-6 text-lg font-bold text-text-main-light dark:text-text-main-dark">
                Filter
              </h3>
              <div className="mb-6">
                <Input
                  placeholder="Cari nama pemesan"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-main-light focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-slate-900 dark:text-text-main-dark"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                  Aset
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-main-light focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-slate-900 dark:text-text-main-dark">
                    <option value="">Pilih Aset</option>
                    <option>Gedung Serbaguna Kartika</option>
                    <option>Corporate Office Hall</option>
                    <option>Spacious Hotel Lobby</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                  Tanggal Sewa
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      placeholder="Tanggal Mulai"
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-main-light focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-slate-900 dark:text-text-main-dark"
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="Tanggal Selesai"
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-main-light focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-slate-900 dark:text-text-main-dark"
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <label className="mb-3 block text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                  Status
                </label>
                <div className="space-y-3">
                  {[
                    "Menunggu Pembayaran",
                    "Dipesan",
                    "Berlangsung",
                    "Selesai",
                    "Dibatalkan",
                  ].map((status) => (
                    <label
                      key={status}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div
                        className={cn(
                          "flex-1 rounded-md py-1.5 px-3 text-center text-sm font-medium transition-opacity hover:opacity-90",
                          status === "Menunggu Pembayaran" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                          status === "Dipesan" &&
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                          status === "Berlangsung" &&
                            "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
                          status === "Selesai" &&
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                          status === "Dibatalkan" &&
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {status}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex items-center space-x-3 border-t border-border-light pt-4 dark:border-border-dark">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg bg-white text-sm font-medium text-text-main-light hover:bg-gray-50 dark:bg-transparent dark:text-text-main-dark dark:hover:bg-gray-800"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-primary-hover"
                >
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleModal mode="edit" open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
