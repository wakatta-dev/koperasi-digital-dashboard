/** @format */

import Link from "next/link";

export function OrderDetailPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F9FAFB] text-[#111827] antialiased dark:bg-[#0f172a] dark:text-[#f8fafc] font-['Inter',_sans-serif]">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#0f172a]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-6 dark:border-[#334155] dark:bg-[#0f172a]">
          <div className="flex items-center">
            <button
              className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
              type="button"
            >
              <span className="material-icons-outlined">menu</span>
            </button>
            <button
              className="mr-4 hidden text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 md:block"
              type="button"
            >
              <span className="material-icons-outlined">menu_open</span>
            </button>
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    className="text-sm font-medium text-[#6b7280] hover:text-[#4f46e5] dark:text-[#94a3b8] dark:hover:text-indigo-400"
                    href="/bumdes/marketplace/order"
                  >
                    Manajemen Pesanan
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400 dark:text-gray-600">/</span>
                </li>
                <li>
                  <span className="text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                    Detail Pesanan
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <button
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gray-200"
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
              className="group mb-4 inline-flex items-center text-sm font-medium text-[#6b7280] transition-colors hover:text-[#4f46e5] dark:text-[#94a3b8] dark:hover:text-indigo-400"
              href="/bumdes/marketplace/order"
            >
              <span className="material-icons-outlined mr-1 text-base transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Kembali ke Manajemen Pesanan
            </Link>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
                Detail Pesanan{" "}
                <span className="ml-2 text-xl font-normal text-[#6b7280] dark:text-[#94a3b8]">
                  #ORD-2023-001
                </span>
              </h1>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:hover:bg-slate-700"
                  type="button"
                >
                  <span className="material-icons-outlined mr-2 text-lg">
                    print
                  </span>
                  Cetak Invoice
                </button>
              </div>
            </div>
          </div>
          <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  ID Pesanan
                </p>
                <p className="text-lg font-bold text-[#111827] dark:text-white">
                  #ORD-2023-001
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Tanggal Pesanan
                </p>
                <p className="text-lg font-bold text-[#111827] dark:text-white">
                  20 Okt 2023
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Status Pembayaran
                </p>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Lunas
                </span>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Status Pengiriman
                </p>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Dikirim
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                  <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                    Daftar Barang
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                    <thead className="bg-gray-50 dark:bg-slate-800/50">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                          scope="col"
                        >
                          Produk
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                          scope="col"
                        >
                          Jumlah
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                          scope="col"
                        >
                          Harga Satuan
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                          scope="col"
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                      <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
                                <span className="material-icons-outlined text-lg">
                                  image
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#111827] dark:text-white">
                                Kopi Arabika Gayo Premium
                              </div>
                              <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                                SKU: KP-001
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                          2
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                          Rp75.000
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-[#111827] dark:text-white">
                          Rp150.000
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
                                <span className="material-icons-outlined text-lg">
                                  image
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#111827] dark:text-white">
                                Keripik Singkong Balado
                              </div>
                              <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                                SKU: SN-005
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                          5
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                          Rp15.000
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-[#111827] dark:text-white">
                          Rp75.000
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
                                <span className="material-icons-outlined text-lg">
                                  image
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#111827] dark:text-white">
                                Madu Hutan Asli 500ml
                              </div>
                              <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                                SKU: MD-012
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                          1
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                          Rp225.000
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-[#111827] dark:text-white">
                          Rp225.000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                  <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                    Detail Pembayaran &amp; Keuangan
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800 md:flex-row">
                    <div>
                      <p className="mb-1 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                        Metode Pembayaran
                      </p>
                      <div className="flex items-center">
                        <span className="material-icons-outlined mr-2 text-gray-400">
                          account_balance
                        </span>
                        <span className="font-medium text-[#111827] dark:text-white">
                          Transfer Bank (BCA)
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                        ID Transaksi Pembayaran
                      </p>
                      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-[#111827] dark:bg-slate-700 dark:text-white">
                        TRX-99887766
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b7280] dark:text-[#94a3b8]">
                        Subtotal Barang
                      </span>
                      <span className="font-medium text-[#111827] dark:text-white">
                        Rp450.000
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b7280] dark:text-[#94a3b8]">
                        Biaya Pengiriman
                      </span>
                      <span className="font-medium text-[#111827] dark:text-white">
                        Rp20.000
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b7280] dark:text-[#94a3b8]">
                        Diskon
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -Rp0
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                      <span className="text-base font-bold text-[#111827] dark:text-white">
                        Total Pembayaran
                      </span>
                      <span className="text-xl font-bold text-[#4f46e5] dark:text-indigo-400">
                        Rp470.000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Aksi Pesanan
                </h3>
                <div className="space-y-3">
                  <button
                    className="flex w-full items-center justify-center rounded-md bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2"
                    type="button"
                  >
                    <span className="material-icons-outlined mr-2">
                      local_shipping
                    </span>
                    Ubah Status Pengiriman
                  </button>
                  <button
                    className="flex w-full items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-50 focus:outline-none dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-slate-700"
                    type="button"
                  >
                    <span className="material-icons-outlined mr-2">
                      receipt
                    </span>
                    Cetak Invoice
                  </button>
                  <button
                    className="flex w-full items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-50 focus:outline-none dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-slate-700"
                    type="button"
                  >
                    <span className="material-icons-outlined mr-2">
                      money_off
                    </span>
                    Ajukan Pengembalian Dana
                  </button>
                  <button
                    className="flex w-full items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
                    type="button"
                  >
                    <span className="material-icons-outlined mr-2">
                      cancel
                    </span>
                    Batalkan Pesanan
                  </button>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                  <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                    Informasi Pelanggan
                  </h2>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-start">
                    <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                      person
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#111827] dark:text-white">
                        Budi Santoso
                      </p>
                      <p className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                        Customer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                      email
                    </span>
                    <div>
                      <p className="text-sm text-[#111827] dark:text-white">
                        budi@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                      phone
                    </span>
                    <div>
                      <p className="text-sm text-[#111827] dark:text-white">
                        0812-3456-7890
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      Alamat Pengiriman
                    </h4>
                    <div className="flex items-start">
                      <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                        place
                      </span>
                      <p className="text-sm leading-relaxed text-[#111827] dark:text-white">
                        Jl. Merdeka No. 10
                        <br />
                        Coblong, Bandung
                        <br />
                        Jawa Barat, 40132
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      Metode Pengiriman
                    </h4>
                    <div className="flex items-center">
                      <span className="material-icons-outlined mr-3 text-gray-400">
                        local_shipping
                      </span>
                      <span className="text-sm font-medium text-[#111827] dark:text-white">
                        JNE Regular
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                  <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                    Riwayat Status
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="relative ml-3 space-y-6 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
                    <li className="relative">
                      <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500 dark:border-[#1e293b]"></span>
                      <p className="text-sm font-medium text-[#111827] dark:text-white">
                        Pesanan Dikirim
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#94a3b8]">
                        21 Okt 2023, 15:30
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white bg-gray-300 dark:border-[#1e293b] dark:bg-gray-600"></span>
                      <p className="text-sm font-medium text-[#111827] dark:text-white">
                        Pesanan Diproses
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#94a3b8]">
                        21 Okt 2023, 09:00
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white bg-gray-300 dark:border-[#1e293b] dark:bg-gray-600"></span>
                      <p className="text-sm font-medium text-[#111827] dark:text-white">
                        Pembayaran Diterima
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#94a3b8]">
                        20 Okt 2023, 14:05
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white bg-gray-300 dark:border-[#1e293b] dark:bg-gray-600"></span>
                      <p className="text-sm font-medium text-[#111827] dark:text-white">
                        Pesanan Dibuat
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#94a3b8]">
                        20 Okt 2023, 14:00
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-labelledby="modal-title"
        aria-modal="true"
        className="relative z-10"
        role="dialog"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg border border-[#e5e7eb] bg-white text-left shadow-xl transition-all dark:border-[#334155] dark:bg-[#1e293b] sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 dark:bg-[#1e293b] sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <span className="material-icons-outlined text-[#4f46e5] dark:text-indigo-400">
                      local_shipping
                    </span>
                  </div>
                  <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-lg font-semibold leading-6 text-[#111827] dark:text-white"
                      id="modal-title"
                    >
                      Ubah Status Pengiriman
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                        Perbarui status pengiriman untuk pesanan{" "}
                        <span className="font-medium text-[#111827] dark:text-white">
                          #ORD-2023-001
                        </span>
                        .
                      </p>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label
                            className="mb-1 block text-sm font-medium text-[#111827] dark:text-white"
                            htmlFor="shipping-status"
                          >
                            Pilih Status Baru
                          </label>
                          <select
                            className="block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-[#111827] shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white"
                            defaultValue="shipped"
                            id="shipping-status"
                            name="shipping-status"
                          >
                            <option value="processing">Diproses</option>
                            <option value="shipped">Dikirim</option>
                            <option value="completed">Selesai</option>
                          </select>
                        </div>
                        <div className="animate-fade-in-down" id="tracking-number-field">
                          <label
                            className="mb-1 block text-sm font-medium text-[#111827] dark:text-white"
                            htmlFor="tracking-number"
                          >
                            Nomor Resi Pengiriman
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                              className="block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-[#111827] shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white"
                              defaultValue="JNE-882910392"
                              id="tracking-number"
                              name="tracking-number"
                              placeholder="Masukkan nomor resi..."
                              type="text"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="material-icons-outlined text-sm text-gray-400">
                                qr_code
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#e5e7eb] bg-gray-50 px-4 py-3 dark:border-[#334155] dark:bg-slate-800/50 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  className="inline-flex w-full justify-center rounded-md bg-[#4f46e5] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4338ca] sm:ml-3 sm:w-auto"
                  type="button"
                >
                  Simpan Perubahan
                </button>
                <button
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#6b7280] shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-[#1e293b] dark:text-[#94a3b8] dark:ring-gray-600 dark:hover:bg-slate-700 sm:mt-0 sm:w-auto"
                  type="button"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
