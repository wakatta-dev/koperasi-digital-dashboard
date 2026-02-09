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
import { InputField } from "@/components/shared/inputs/input-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
        className="!flex !flex-col !gap-0 !p-0 w-full max-w-[90vw] sm:!max-w-lg overflow-hidden rounded-lg border border-border bg-popover text-left shadow-2xl max-h-[90vh]"
        showCloseButton={false}
      >
        <div className="shrink-0 border-b border-border bg-card px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle
              className="text-lg font-bold leading-6 text-foreground"
              id="modal-title"
            >
              Pengembalian Dana Pesanan
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Lengkapi detail pengembalian dana pesanan pelanggan.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                ID Pesanan
              </span>
              <span className="font-semibold text-foreground">
                {formatOrderNumber(order?.order_number)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Pelanggan
              </span>
              <span className="font-medium text-foreground">
                {order?.customer_name || "-"}
              </span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">
                Total Pembayaran
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(totalPayment)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 min-h-0 sm:p-6">
          <div>
            <Label className="mb-3 block text-sm font-medium text-foreground">
              Jenis Pengembalian Dana
            </Label>
            <RadioGroup defaultValue="partial" className="space-y-3">
              <div className="flex items-center">
                <RadioGroupItem value="full" id="refund-full" />
                <Label
                  className="ml-3 block text-sm font-medium text-foreground"
                  htmlFor="refund-full"
                >
                  Pengembalian Dana Penuh
                  <span className="block text-xs font-normal text-muted-foreground">
                    Otomatis senilai {formatCurrency(totalPayment)}
                  </span>
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="partial" id="refund-partial" />
                <Label
                  className="ml-3 block text-sm font-medium text-foreground"
                  htmlFor="refund-partial"
                >
                  Pengembalian Dana Parsial
                </Label>
              </div>
              <div className="ml-7">
                <InputField
                  id="price"
                  name="price"
                  ariaLabel="Nominal pengembalian dana"
                  size="sm"
                  startIcon={<span className="sm:text-sm">Rp</span>}
                  defaultValue={refundSuggestion}
                  placeholder="0"
                  type="text"
                />
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label
              className="mb-2 block text-sm font-medium text-foreground"
              htmlFor="method"
            >
              Metode Pengembalian Dana
            </Label>
            <Select defaultValue="Transfer Bank">
              <SelectTrigger
                className="mt-1 h-auto w-full rounded-md py-2 pl-3 pr-10 text-sm font-normal"
                id="method"
              >
                <SelectValue placeholder="Pilih metode" />
              </SelectTrigger>
              <SelectContent className="border border-border bg-popover text-foreground">
                <SelectItem
                  className="text-sm"
                  value="Kembali ke Saldo Kredit"
                >
                  Kembali ke Saldo Kredit
                </SelectItem>
                <SelectItem
                  className="text-sm"
                  value="Metode Pembayaran Asal"
                >
                  Metode Pembayaran Asal
                </SelectItem>
                <SelectItem
                  className="text-sm"
                  value="Transfer Bank"
                >
                  Transfer Bank
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 grid grid-cols-1 gap-y-3 rounded-md border border-border bg-muted/40 p-4">
              <div>
                <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Nama Bank
                </Label>
                <Input
                  className="h-auto rounded-md text-sm"
                  placeholder="e.g. BCA"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Nomor Rekening
                  </Label>
                  <Input
                    className="h-auto rounded-md text-sm"
                    type="text"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Atas Nama
                  </Label>
                  <Input
                    className="h-auto rounded-md text-sm"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label
              className="mb-2 block text-sm font-medium text-foreground"
              htmlFor="reason"
            >
              Alasan Pengembalian Dana <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="min-h-[unset] rounded-md text-sm"
              id="reason"
              name="reason"
              placeholder="Jelaskan alasan pengembalian dana..."
              rows={3}
            />
          </div>
        </div>
        <div className="shrink-0 border-t border-border bg-muted/40 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <Button
            className="w-full justify-center sm:ml-3 sm:w-auto sm:text-sm"
            type="button"
            disabled
            title="Fitur pengembalian dana belum tersedia"
          >
            Proses Pengembalian Dana
          </Button>
          <DialogClose asChild>
            <Button
              className="mt-3 w-full justify-center sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              variant="outline"
              type="button"
            >
              Batal
            </Button>
          </DialogClose>
        </div>
        <div className="shrink-0 border-t border-border bg-card px-4 pb-4 text-xs text-amber-600 sm:px-6">
          Fitur pengembalian dana belum tersedia di backend saat ini.
        </div>
      </DialogContent>
    </Dialog>
  );
}
