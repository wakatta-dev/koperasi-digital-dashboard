/** @format */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMarketplaceOrder, useMarketplaceOrderActions } from "@/hooks/queries/marketplace-orders";
import { formatCurrency } from "@/lib/format";
import { formatOrderDateTime, formatOrderNumber, normalizeOrderStatus } from "../utils";
import {
  isMarketplaceTransitionAllowed,
  isMarketplaceTransitionReasonRequired,
} from "@/modules/marketplace/utils/status";
import type { MarketplaceOrderStatusInput } from "@/types/api/marketplace";

type OrderManualPaymentPageProps = {
  id: string;
};

const manualStatusMap: Record<string, { label: string; className: string }> = {
  WAITING_MANUAL_CONFIRMATION: {
    label: "Menunggu Verifikasi",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900/50",
  },
  MANUAL_PAYMENT_SUBMITTED: {
    label: "Menunggu Verifikasi",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900/50",
  },
  CONFIRMED: {
    label: "Lunas",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50",
  },
  REJECTED: {
    label: "Gagal/Ditolak",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50",
  },
};

type ManualPaymentStatus = "WAITING_MANUAL_CONFIRMATION" | "CONFIRMED" | "REJECTED";

const manualStatusOptions: Array<{
  value: ManualPaymentStatus;
  label: string;
  orderStatus: MarketplaceOrderStatusInput;
}> = [
  {
    value: "WAITING_MANUAL_CONFIRMATION",
    label: "Menunggu Verifikasi",
    orderStatus: "PENDING_PAYMENT",
  },
  {
    value: "CONFIRMED",
    label: "Lunas",
    orderStatus: "PAYMENT_VERIFICATION",
  },
  {
    value: "REJECTED",
    label: "Gagal/Ditolak",
    orderStatus: "CANCELED",
  },
];

const normalizeManualPaymentStatus = (status?: string): ManualPaymentStatus => {
  switch (status) {
    case "CONFIRMED":
      return "CONFIRMED";
    case "REJECTED":
      return "REJECTED";
    case "WAITING_MANUAL_CONFIRMATION":
    case "MANUAL_PAYMENT_SUBMITTED":
    default:
      return "WAITING_MANUAL_CONFIRMATION";
  }
};

export function OrderManualPaymentPage({ id }: OrderManualPaymentPageProps) {
  const { data: order, isLoading, isError, error } = useMarketplaceOrder(id);
  const { decideManualPayment } = useMarketplaceOrderActions();
  const manualPayment = order?.manual_payment;
  const statusKey = manualPayment?.status ?? "WAITING_MANUAL_CONFIRMATION";
  const status = manualStatusMap[statusKey] ?? manualStatusMap.WAITING_MANUAL_CONFIRMATION;
  const normalizedStatus = normalizeManualPaymentStatus(statusKey);
  const [selectedStatus, setSelectedStatus] = useState<ManualPaymentStatus>(normalizedStatus);
  const [adminNote, setAdminNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedStatus(normalizeManualPaymentStatus(statusKey));
  }, [statusKey]);

  const paymentMethodLabel = useMemo(() => {
    if (!manualPayment?.bank_name) return "Transfer Bank Manual";
    return `Transfer Bank Manual (${manualPayment.bank_name})`;
  }, [manualPayment?.bank_name]);

  const selectedOption = manualStatusOptions.find(
    (option) => option.value === selectedStatus
  );
  const targetOrderStatus = selectedOption?.orderStatus;
  const currentOrderStatus = normalizeOrderStatus(order?.status);
  const isSubmitting = decideManualPayment.isPending;
  const isStatusUnchanged = selectedStatus === normalizedStatus;
  const isTransitionAllowed = Boolean(targetOrderStatus)
    && isMarketplaceTransitionAllowed(currentOrderStatus, targetOrderStatus);
  const reasonRequired = isMarketplaceTransitionReasonRequired(
    currentOrderStatus,
    targetOrderStatus
  );

  const handleConfirm = async () => {
    if (!order || !targetOrderStatus || isSubmitting) return;
    if (!isTransitionAllowed) {
      setNoteError("Perubahan status tidak valid untuk kondisi pesanan saat ini.");
      return;
    }
    const reason = adminNote.trim();
    if (reasonRequired && reason.length === 0) {
      setNoteError("Alasan wajib diisi untuk transisi status ini.");
      return;
    }
    await decideManualPayment.mutateAsync({
      id: order.id,
      payload: {
        status: selectedStatus,
        ...(reason ? { reason } : {}),
      },
    });
    setNoteError(null);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background text-foreground antialiased">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex items-center">
            <button
              className="mr-4 text-muted-foreground hover:text-foreground md:hidden"
              type="button"
            >
              <span className="material-icons-outlined">menu</span>
            </button>
            <button
              className="mr-4 hidden text-muted-foreground hover:text-foreground md:block"
              type="button"
            >
              <span className="material-icons-outlined">menu_open</span>
            </button>
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    className="text-sm font-medium text-muted-foreground hover:text-indigo-500"
                    href="/bumdes/marketplace/order"
                  >
                    Manajemen Pesanan
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground">/</span>
                </li>
                <li>
                  <Link
                    className="text-sm font-medium text-muted-foreground hover:text-indigo-500"
                    href={`/bumdes/marketplace/order/${id}`}
                  >
                    Detail Pesanan
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground">/</span>
                </li>
                <li>
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Konfirmasi Pembayaran
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <button
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            type="button"
          >
            <span className="material-icons-outlined dark:hidden">dark_mode</span>
            <span className="material-icons-outlined hidden dark:block">
              light_mode
            </span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-6">
            <Link
              className="group mb-4 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500"
              href={`/bumdes/marketplace/order/${id}`}
            >
              <span className="material-icons-outlined mr-1 text-base transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Kembali ke Detail Pesanan
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                Konfirmasi Pembayaran Manual
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                <span className="w-2 h-2 mr-2 bg-yellow-500 rounded-full animate-pulse"></span>
                {status.label}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Memuat detail pembayaran...
            </div>
          ) : null}
          {isError ? (
            <div className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : "Gagal memuat detail pembayaran."}
            </div>
          ) : null}

          {order ? (
            <>
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      ID Pesanan/Reservasi
                    </p>
                    <p className="text-xl font-bold text-foreground flex items-center">
                      {formatOrderNumber(order.order_number)}
                      <button
                        className="ml-2 text-muted-foreground hover:text-indigo-500 transition-colors"
                        type="button"
                        title="Copy ID"
                      >
                        <span className="material-icons-outlined text-sm">
                          content_copy
                        </span>
                      </button>
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Tanggal Pesanan/Permintaan
                    </p>
                    <p className="text-lg font-medium text-foreground">
                      {formatOrderDateTime(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Total Tagihan (Harus Dibayar)
                    </p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-card shadow-sm rounded-lg border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center bg-muted/30">
                      <span className="material-icons-outlined mr-2 text-muted-foreground">
                        person
                      </span>
                      <h2 className="text-base font-semibold text-foreground">
                        Informasi Pelanggan
                      </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Nama Pelanggan
                        </p>
                        <p className="font-medium text-foreground">
                          {order.customer_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Email
                        </p>
                        <p className="font-medium text-foreground">
                          {order.customer_email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Nomor Telepon
                        </p>
                        <p className="font-medium text-foreground">
                          {order.customer_phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card shadow-sm rounded-lg border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center bg-muted/30">
                      <span className="material-icons-outlined mr-2 text-muted-foreground">
                        payments
                      </span>
                      <h2 className="text-base font-semibold text-foreground">
                        Detail Pembayaran yang Diajukan
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Metode Pembayaran
                          </label>
                          <div className="flex items-center p-3 border border-border rounded-md bg-muted/30">
                            <span className="material-icons-outlined text-muted-foreground mr-2">
                              account_balance
                            </span>
                            <span className="font-medium text-foreground">
                              {paymentMethodLabel}
                            </span>
                          </div>
                        </div>
                        <div>
                          <InputField
                            label="Tanggal Transfer (Estimasi)"
                            labelClassName="text-sm font-medium text-muted-foreground"
                            startIcon={
                              <span className="material-icons-outlined">
                                calendar_today
                              </span>
                            }
                            value={
                              manualPayment?.transfer_date
                                ? manualPayment.transfer_date
                                : formatOrderDateTime(order.created_at)
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <InputField
                          label="Jumlah yang Ditransfer Pelanggan"
                          labelClassName="text-sm font-medium text-muted-foreground"
                          startIcon={<span className="sm:text-sm">Rp</span>}
                          endIcon={<span className="sm:text-xs">IDR</span>}
                          value={formatCurrency(
                            manualPayment?.transfer_amount ?? order.total
                          )
                            .replace("Rp", "")
                            .trim()}
                          readOnly
                          controlClassName="text-lg font-semibold"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Pastikan jumlah ini sesuai dengan mutasi rekening.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card shadow-sm rounded-lg border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center bg-muted/30">
                      <span className="material-icons-outlined mr-2 text-muted-foreground">
                        receipt_long
                      </span>
                      <h2 className="text-base font-semibold text-foreground">
                        Bukti Transfer
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="bg-muted/50 rounded-lg p-2 border border-dashed border-border flex justify-center items-center">
                        <div className="relative group w-full max-w-lg">
                          {manualPayment?.proof_url ? (
                            <Image
                              alt="Bukti Transfer"
                              className="rounded shadow-sm w-full h-auto object-contain max-h-[500px]"
                              src={manualPayment.proof_url}
                              width={800}
                              height={600}
                            />
                          ) : (
                            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded">
                              Bukti transfer belum tersedia.
                            </div>
                          )}
                          {manualPayment?.proof_url ? (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center rounded">
                              <span className="material-icons-outlined text-white opacity-0 group-hover:opacity-100 text-4xl transform scale-75 group-hover:scale-100 transition-all">
                                visibility
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
                        <div className="flex items-center">
                          <span className="material-icons-outlined mr-2 text-muted-foreground">
                            description
                          </span>
                          <span>
                            {manualPayment?.proof_filename ?? "Belum ada file"}
                          </span>
                        </div>
                        <span>
                          Diunggah:{" "}
                          {manualPayment?.created_at
                            ? formatOrderDateTime(manualPayment.created_at)
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-card shadow-lg rounded-lg border border-border sticky top-6">
                    <div className="px-6 py-4 border-b border-border bg-indigo-50 dark:bg-indigo-900/20">
                      <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                        <span className="material-icons-outlined mr-2">
                          verified_user
                        </span>
                        Verifikasi & Aksi
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ubah Status Pembayaran
                        </label>
                        <Select
                          value={selectedStatus}
                          onValueChange={(value) => {
                            setSelectedStatus(value as ManualPaymentStatus);
                            setNoteError(null);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            {manualStatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Catatan Admin{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            {reasonRequired ? "(Wajib)" : "(Opsional)"}
                          </span>
                        </label>
                        <Textarea
                          placeholder={
                            reasonRequired
                              ? "Wajib isi alasan untuk perubahan status ini..."
                              : "Tambahkan catatan internal mengenai verifikasi ini..."
                          }
                          rows={4}
                          value={adminNote}
                          aria-invalid={Boolean(noteError)}
                          onChange={(event) => {
                            setAdminNote(event.target.value);
                            if (noteError) {
                              setNoteError(null);
                            }
                          }}
                        />
                        {noteError ? (
                          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            {noteError}
                          </p>
                        ) : null}
                      </div>
                      <div className="pt-4 border-t border-border space-y-3">
                        <Button
                          className="w-full"
                          onClick={handleConfirm}
                          disabled={
                            !order ||
                            isSubmitting ||
                            isStatusUnchanged ||
                            !isTransitionAllowed ||
                            (reasonRequired && adminNote.trim().length === 0)
                          }
                        >
                          {isSubmitting
                            ? "Menyimpan..."
                            : "Simpan Perubahan & Konfirmasi"}
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/bumdes/marketplace/order/${id}`}>
                            Kembali ke Detail Pesanan
                          </Link>
                        </Button>
                      </div>
                      <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="material-icons-outlined text-blue-400">
                              info
                            </span>
                          </div>
                          <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              Gunakan status ini sesuai hasil verifikasi aktual.
                              Alasan perubahan diwajibkan untuk transisi berisiko
                              agar jejak audit tetap aman.
                            </p>
                            {!isTransitionAllowed ? (
                              <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                                Kombinasi status yang dipilih tidak valid untuk status
                                pesanan saat ini.
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
