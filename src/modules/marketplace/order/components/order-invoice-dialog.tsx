/** @format */

"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type OrderInvoiceDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
};

export function OrderInvoiceDialog({
  open,
  onOpenChange,
  trigger,
}: OrderInvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className="!flex !flex-col !gap-0 !p-0 w-full max-w-[90vw] sm:!max-w-4xl border border-gray-200 dark:border-gray-700 shadow-2xl bg-white dark:bg-[#1e293b] max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:absolute print:top-0 print:left-0 print:w-full print:m-0 print:max-w-none print:translate-x-0 print:translate-y-0 print:rounded-none font-['Inter',_sans-serif]"
        id="invoice-modal-content"
        overlayClassName="bg-gray-900 bg-opacity-75 print:hidden backdrop-blur-sm"
        showCloseButton={false}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-gray-50 px-6 py-4 dark:border-[#334155] dark:bg-slate-800 print:hidden">
          <DialogTitle className="flex items-center text-lg font-semibold leading-6 text-[#111827] dark:text-white">
            <span className="material-symbols-outlined mr-2 text-[#4f46e5]">
              print
            </span>
            Cetak Invoice
          </DialogTitle>
          <DialogClose asChild>
            <button
              className="rounded-md bg-transparent text-gray-400 transition-colors hover:text-gray-500 focus:outline-none"
              type="button"
            >
              <span className="sr-only">Close</span>
              <span className="material-symbols-outlined">close</span>
            </button>
          </DialogClose>
        </div>
        <div
          className="overflow-y-auto bg-white p-8 text-gray-900 print:overflow-visible print:p-0 sm:p-10"
          id="invoice-printable"
        >
          <div className="mb-8 flex flex-col items-start justify-between border-b border-gray-100 pb-8 md:flex-row">
            <div className="mb-6 md:mb-0">
              <div className="mb-4 flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#4f46e5] text-white shadow-sm print:shadow-none">
                  <span className="material-symbols-outlined text-2xl">
                    storefront
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900">
                    3Portals BUMDes
                  </h1>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Unit Perdagangan Desa
                  </p>
                </div>
              </div>
              <div className="text-sm leading-relaxed text-gray-600">
                <p>Jl. Raya Desa No. 123, Sukamaju</p>
                <p>Kecamatan Megamendung, Bogor 16770</p>
                <p>Jawa Barat, Indonesia</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center">
                    <span className="material-symbols-outlined mr-1 text-[16px] text-gray-400">
                      call
                    </span>
                    +62 812-3456-7890
                  </span>
                  <span className="flex items-center">
                    <span className="material-symbols-outlined mr-1 text-[16px] text-gray-400">
                      mail
                    </span>
                    info@3portals.id
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full text-left md:w-auto md:text-right">
              <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-[#4f46e5]">
                INVOICE
              </h2>
              <p className="mb-4 text-lg font-semibold text-gray-700">
                #ORD-2023-001
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-8 md:justify-end">
                  <span className="text-gray-500">Tanggal Invoice:</span>
                  <span className="font-medium text-gray-900">
                    21 Okt 2023
                  </span>
                </div>
                <div className="flex justify-between gap-8 md:justify-end">
                  <span className="text-gray-500">Tanggal Pesanan:</span>
                  <span className="font-medium text-gray-900">
                    20 Okt 2023
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-8 pt-2 md:justify-end">
                  <span className="text-gray-500">Status Pembayaran:</span>
                  <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 print:border-0">
                    LUNAS
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 grid grid-cols-1 gap-8 border-b border-gray-100 pb-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-gray-400">
                <span className="material-symbols-outlined mr-1 text-[16px]">
                  person
                </span>
                Kepada (Bill To)
              </h3>
              <div className="text-sm text-gray-600">
                <p className="mb-1 text-base font-bold text-gray-900">
                  Budi Santoso
                </p>
                <p className="mb-1">budi@example.com</p>
                <p>0812-3456-7890</p>
              </div>
            </div>
            <div>
              <h3 className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-gray-400 md:justify-end">
                <span className="material-symbols-outlined mr-1 text-[16px]">
                  local_shipping
                </span>
                Kirim Ke (Ship To)
              </h3>
              <div className="text-sm text-gray-600 md:text-right">
                <p className="mb-1 text-base font-bold text-gray-900">
                  Budi Santoso
                </p>
                <p className="mb-2 leading-relaxed">
                  Jl. Merdeka No. 10, Coblong
                  <br />
                  Bandung, Jawa Barat, 40132
                </p>
                <p className="inline-block rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs print:border-0 print:bg-transparent print:p-0">
                  <span className="font-semibold">Metode:</span> JNE Regular
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Daftar Barang
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-200 print:rounded-none print:border-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:bg-gray-100">
                  <tr>
                    <th
                      className="w-12 px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                      scope="col"
                    >
                      No.
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                      scope="col"
                    >
                      Produk
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500"
                      scope="col"
                    >
                      Harga Satuan
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500"
                      scope="col"
                    >
                      Jumlah
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500"
                      scope="col"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500">1</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Kopi Arabika Gayo Premium
                      <span className="block text-xs font-normal text-gray-400">
                        SKU: KP-001
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      Rp75.000
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      2
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Rp150.000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500">2</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Keripik Singkong Balado
                      <span className="block text-xs font-normal text-gray-400">
                        SKU: SN-005
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      Rp15.000
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      5
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Rp75.000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500">3</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Madu Hutan Asli 500ml
                      <span className="block text-xs font-normal text-gray-400">
                        SKU: MD-012
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      Rp225.000
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      1
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Rp225.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div className="w-full md:w-5/12">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Informasi Pembayaran
              </h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 print:border-gray-300 print:bg-transparent">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Metode</span>
                  <span className="flex items-center text-sm font-semibold text-gray-900">
                    <span className="material-symbols-outlined mr-1 text-[18px] text-gray-400">
                      account_balance
                    </span>
                    Transfer Bank (BCA)
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="text-sm text-gray-500">ID Transaksi</span>
                  <span className="rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs text-gray-700 print:border-0 print:bg-transparent print:p-0 print:text-sm">
                    TRX-99887766
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Catatan
                </h3>
                <p className="text-xs italic leading-relaxed text-gray-500">
                  Terima kasih atas kepercayaan Anda berbelanja di BUMDes
                  Sejahtera. Barang yang sudah dibeli tidak dapat ditukar atau
                  dikembalikan kecuali ada perjanjian sebelumnya.
                </p>
              </div>
            </div>
            <div className="w-full md:w-5/12">
              <div className="rounded-lg bg-gray-50 p-6 print:bg-transparent print:p-0">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal Barang</span>
                    <span className="font-medium text-gray-900">Rp450.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Pengiriman</span>
                    <span className="font-medium text-gray-900">Rp20.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diskon</span>
                    <span className="font-medium text-green-600">-Rp0</span>
                  </div>
                  <div className="my-3 border-t border-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-800">
                      Total Pembayaran
                    </span>
                    <span className="text-2xl font-bold text-[#4f46e5]">
                      Rp470.000
                    </span>
                  </div>
                  <div className="mt-1 text-right text-xs text-gray-400">
                    Termasuk PPN jika berlaku
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 hidden items-end justify-between border-t border-gray-200 pt-8 print:flex">
            <div className="text-[10px] text-gray-400">
              Dicetak pada: <span id="print-date">21 Okt 2023 10:30</span>
              <br />
              System: 3Portals Business Manager
            </div>
            <div className="w-40 text-center">
              <div className="mb-2 h-20 border-b border-gray-300"></div>
              <p className="text-xs font-medium text-gray-500">
                Authorized Signature
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3 border-t border-[#e5e7eb] bg-gray-50 px-6 py-4 dark:border-[#334155] dark:bg-slate-800 print:hidden sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <button
              className="inline-flex w-full items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-slate-700 sm:w-auto"
              type="button"
            >
              Kembali
            </button>
          </DialogClose>
          <button
            className="inline-flex w-full items-center justify-center rounded-md bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 sm:w-auto"
            type="button"
          >
            <span className="material-symbols-outlined mr-2 text-lg">
              print
            </span>
            Cetak Sekarang
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
