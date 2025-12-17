/** @format */

"use client";

import React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ScheduleModalProps = {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const fieldClass =
  "block w-full rounded-lg border-gray-300 dark:border-gray-600 py-2 text-text-main-light dark:text-text-main-dark shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm bg-transparent";

export function ScheduleModal({ mode, open, onOpenChange }: ScheduleModalProps) {
  const isEdit = mode === "edit";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-lg transform overflow-hidden rounded-xl border border-border-light bg-white text-left shadow-2xl transition-all dark:border-border-dark dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-border-light px-4 py-4 dark:border-border-dark sm:px-6">
            <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark">
              {isEdit ? "Edit Jadwal" : "Tambah Jadwal"}
            </h3>
            <button
              type="button"
              className="text-text-sub-light transition-colors hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 px-4 py-5 sm:p-6">
            <div>
              <label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                Nama Aset
              </label>
              <div className="mt-1">
                <Select defaultValue="1">
                  <SelectTrigger className={cn(fieldClass, "h-11")}>
                    <SelectValue placeholder="Pilih aset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Gedung Serbaguna Kartika</SelectItem>
                    <SelectItem value="2">Corporate Office Hall</SelectItem>
                    <SelectItem value="3">Spacious Hotel Lobby</SelectItem>
                    <SelectItem value="4">Conference Room A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                Nama Penyewa
              </label>
              <div className="mt-1">
                <Input
                  defaultValue={isEdit ? "PT. Maju Mundur" : ""}
                  placeholder="Masukkan nama penyewa"
                  className={cn(fieldClass, "h-11")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                  Tanggal Mulai Sewa
                </label>
                <div className="relative mt-1">
                  <Input
                    type="date"
                    defaultValue={isEdit ? "2023-10-12" : undefined}
                    className={cn(fieldClass, "h-11")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                  Tanggal Akhir Sewa
                </label>
                <div className="relative mt-1">
                  <Input
                    type="date"
                    defaultValue={isEdit ? "2023-10-14" : undefined}
                    className={cn(fieldClass, "h-11")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                  Waktu Mulai
                </label>
                <div className="relative mt-1">
                  <Input
                    type="time"
                    defaultValue={isEdit ? "08:00" : undefined}
                    className={cn(fieldClass, "h-11")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                  Waktu Akhir
                </label>
                <div className="relative mt-1">
                  <Input
                    type="time"
                    defaultValue={isEdit ? "17:00" : undefined}
                    className={cn(fieldClass, "h-11")}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                Status
              </label>
              <div className="mt-1">
                <Select defaultValue={isEdit ? "Confirmed" : undefined}>
                  <SelectTrigger className={cn(fieldClass, "h-11")}>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Finished">Finished</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border-light bg-gray-50 px-4 py-3 dark:border-border-dark dark:bg-gray-800/50 sm:flex-row sm:justify-end sm:px-6">
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
              onClick={() => onOpenChange(false)}
            >
              {isEdit ? "Simpan Perubahan" : "Tambah Jadwal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
