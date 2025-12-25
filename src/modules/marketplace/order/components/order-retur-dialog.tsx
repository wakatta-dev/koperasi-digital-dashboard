/** @format */

"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatNumber } from "@/lib/format";
import { formatOrderNumber } from "../utils";
import type { MarketplaceOrderDetailResponse } from "@/types/api/marketplace";

type OrderReturDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  order?: MarketplaceOrderDetailResponse | null;
};

export function OrderReturDialog({
  open,
  onOpenChange,
  order,
}: OrderReturDialogProps) {
  const totalPayment = order?.total ?? null;
  const refundSuggestion = useMemo(() => {
    if (totalPayment === null || totalPayment <= 0) return "";
    const partial = Math.round(totalPayment / 2);
    return formatNumber(partial, { maximumFractionDigits: 0 });
  }, [totalPayment]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!flex !flex-col !gap-0 !p-0 w-full max-w-[90vw] sm:!max-w-lg overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-2xl dark:border-gray-700 dark:bg-[#1e293b] max-h-[90vh] font-['Inter',_sans-serif]"
        overlayClassName="bg-gray-900 bg-opacity-75 print:hidden backdrop-blur-sm"
        showCloseButton={false}
      >
        <div className="shrink-0 border-b border-gray-100 bg-white px-4 pb-4 pt-5 dark:border-gray-700 dark:bg-[#1e293b] sm:p-6 sm:pb-4">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle
              className="text-lg font-bold leading-6 text-[#111827] dark:text-white"
              id="modal-title"
            >
              Pengembalian Dana Pesanan
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
              Lengkapi detail pengembalian dana pesanan pelanggan.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="flex justify-between">
              <span className="text-[#6b7280] dark:text-[#94a3b8]">
                ID Pesanan
              </span>
              <span className="font-semibold text-[#111827] dark:text-white">
                {formatOrderNumber(order?.order_number)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280] dark:text-[#94a3b8]">
                Pelanggan
              </span>
              <span className="font-medium text-[#111827] dark:text-white">
                {order?.customer_name || "-"}
              </span>
            </div>
            <div className="mt-1 flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="text-[#6b7280] dark:text-[#94a3b8]">
                Total Pembayaran
              </span>
              <span className="font-bold text-[#4f46e5] dark:text-indigo-400">
                {formatCurrency(totalPayment)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 min-h-0 sm:p-6">
          <div>
            <Label className="mb-3 block text-sm font-medium text-[#111827] dark:text-white">
              Jenis Pengembalian Dana
            </Label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 border-gray-300 text-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-700"
                  id="refund-full"
                  name="refund-type"
                  type="radio"
                />
                <Label
                  className="ml-3 block text-sm font-medium text-[#111827] dark:text-white"
                  htmlFor="refund-full"
                >
                  Pengembalian Dana Penuh
                  <span className="block text-xs font-normal text-[#6b7280] dark:text-[#94a3b8]">
                    Otomatis senilai {formatCurrency(totalPayment)}
                  </span>
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  className="h-4 w-4 border-gray-300 text-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-700"
                  defaultChecked
                  id="refund-partial"
                  name="refund-type"
                  type="radio"
                />
                <Label
                  className="ml-3 block text-sm font-medium text-[#111827] dark:text-white"
                  htmlFor="refund-partial"
                >
                  Pengembalian Dana Parsial
                </Label>
              </div>
              <div className="ml-7">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <Input
                    className="h-auto rounded-md border-gray-300 bg-white pl-10 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                    defaultValue={refundSuggestion}
                    id="price"
                    name="price"
                    placeholder="0"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label
              className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
              htmlFor="method"
            >
              Metode Pengembalian Dana
            </Label>
            <Select defaultValue="Transfer Bank">
              <SelectTrigger
                className="mt-1 h-auto w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-normal text-[#111827] shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                id="method"
              >
                <SelectValue placeholder="Pilih metode" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200 bg-white text-[#111827] dark:border-gray-700 dark:bg-slate-800 dark:text-white">
                <SelectItem
                  className="text-sm text-[#111827] dark:text-white"
                  value="Kembali ke Saldo Kredit"
                >
                  Kembali ke Saldo Kredit
                </SelectItem>
                <SelectItem
                  className="text-sm text-[#111827] dark:text-white"
                  value="Metode Pembayaran Asal"
                >
                  Metode Pembayaran Asal
                </SelectItem>
                <SelectItem
                  className="text-sm text-[#111827] dark:text-white"
                  value="Transfer Bank"
                >
                  Transfer Bank
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 grid grid-cols-1 gap-y-3 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-800/50">
              <div>
                <Label className="mb-1 block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">
                  Nama Bank
                </Label>
                <Input
                  className="h-auto rounded-md border-gray-300 bg-white text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g. BCA"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Nomor Rekening
                  </Label>
                  <Input
                    className="h-auto rounded-md border-gray-300 bg-white text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                    type="text"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">
                    Atas Nama
                  </Label>
                  <Input
                    className="h-auto rounded-md border-gray-300 bg-white text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label
              className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
              htmlFor="reason"
            >
              Alasan Pengembalian Dana <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="min-h-[unset] rounded-md border border-gray-300 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-slate-800 dark:text-white"
              id="reason"
              name="reason"
              placeholder="Jelaskan alasan pengembalian dana..."
              rows={3}
            />
          </div>
        </div>
        <div className="shrink-0 border-t border-[#e5e7eb] bg-gray-50 px-4 py-3 dark:border-[#334155] dark:bg-slate-800/50 sm:flex sm:flex-row-reverse sm:px-6">
          <Button
            className="w-full justify-center rounded-md bg-[#4f46e5] px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-3 sm:w-auto sm:text-sm"
            type="button"
            disabled
            title="Fitur pengembalian dana belum tersedia"
          >
            Proses Pengembalian Dana
          </Button>
          <DialogClose asChild>
            <Button
              className="mt-3 w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-[#111827] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              variant="outline"
              type="button"
            >
              Batal
            </Button>
          </DialogClose>
        </div>
        <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-4 text-xs text-amber-600 dark:border-gray-700 dark:bg-[#1e293b] dark:text-amber-400 sm:px-6">
          Fitur pengembalian dana belum tersedia di backend saat ini.
        </div>
      </DialogContent>
    </Dialog>
  );
}
