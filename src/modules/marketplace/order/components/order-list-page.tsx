/** @format */

import Link from "next/link";

export function OrderListPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F9FAFB] text-[#111827] antialiased dark:bg-[#0f172a] dark:text-[#f8fafc] font-['Inter',_sans-serif]">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#0f172a]">
        <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-6 dark:border-[#334155] dark:bg-[#0f172a]">
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
                    className="text-sm font-medium text-[#4f46e5] hover:underline dark:text-indigo-400"
                    href="/bumdes/marketplace/order"
                  >
                    Manajemen Pesanan
                  </Link>
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
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
              Manajemen Pesanan
            </h1>
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-icons-outlined text-gray-400">
                  search
                </span>
              </div>
              <input
                className="block w-full rounded-md border border-[#e5e7eb] bg-white py-2 pl-10 pr-3 text-sm leading-5 text-[#111827] placeholder-[#6b7280] transition-colors focus:border-[#4f46e5] focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:placeholder-gray-400 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder-[#94a3b8]"
                placeholder="Cari ID Pesanan, nama pelanggan, atau produk..."
                type="text"
              />
            </div>
            <div className="relative group">
              <button
                className="inline-flex items-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-slate-700"
                type="button"
              >
                <span className="material-icons-outlined mr-2 text-lg">
                  filter_list
                </span>
                Filter
              </button>
              <div className="absolute right-0 top-12 z-20 hidden w-64 rounded-md border border-[#e5e7eb] bg-white shadow-lg dark:border-[#334155] dark:bg-[#1e293b] group-hover:block">
                <div className="space-y-4 p-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Rentang Tanggal
                    </label>
                    <input
                      className="w-full rounded border-gray-300 bg-gray-50 text-xs dark:border-gray-600 dark:bg-slate-800"
                      type="date"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Status Pembayaran
                    </label>
                    <select className="w-full rounded border-gray-300 bg-gray-50 text-xs dark:border-gray-600 dark:bg-slate-800">
                      <option>Semua</option>
                      <option>Menunggu</option>
                      <option>Lunas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                <thead className="bg-gray-50 dark:bg-slate-800/50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      ID Pesanan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Tanggal Pesanan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Nama Pelanggan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Total Pembayaran
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Status Pembayaran
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Status Pengiriman
                    </th>
                    <th className="relative px-6 py-3" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb] bg-white dark:divide-[#334155] dark:bg-[#1e293b]">
                  <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                      #ORD-2023-001
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                      20 Okt 2023
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Budi Santoso
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Rp450.000
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Lunas
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Dikirim
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="relative inline-block text-left group">
                        <button
                          className="text-[#6b7280] hover:text-[#111827] focus:outline-none dark:text-[#94a3b8] dark:hover:text-white"
                          type="button"
                        >
                          <span className="material-icons-outlined">
                            more_vert
                          </span>
                        </button>
                        <div className="absolute right-0 z-10 mt-2 hidden w-48 origin-top-right divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg outline-none dark:divide-gray-700 dark:border-gray-700 dark:bg-slate-800 group-hover:block">
                          <div className="py-1">
                            <Link
                              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
                              href="/bumdes/marketplace/order/ORD-2023-001"
                            >
                              <span className="material-icons-outlined mr-3 text-base text-gray-400">
                                visibility
                              </span>
                              Lihat Detail
                            </Link>
                            <a
                              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
                              href="#"
                            >
                              <span className="material-icons-outlined mr-3 text-base text-gray-400">
                                edit
                              </span>
                              Ubah Status
                            </a>
                          </div>
                          <div className="py-1">
                            <a
                              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
                              href="#"
                            >
                              <span className="material-icons-outlined mr-3 text-base text-gray-400">
                                print
                              </span>
                              Cetak Invoice
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                      #ORD-2023-002
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                      21 Okt 2023
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Siti Aminah
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Rp125.000
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Menunggu Pembayaran
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Baru
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        className="text-[#6b7280] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white"
                        type="button"
                      >
                        <span className="material-icons-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                      #ORD-2023-003
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                      21 Okt 2023
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Rudi Hermawan
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Rp850.000
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Lunas
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-orange-100 px-2 text-xs font-semibold leading-5 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        Diproses
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        className="text-[#6b7280] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white"
                        type="button"
                      >
                        <span className="material-icons-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                      #ORD-2023-004
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                      22 Okt 2023
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Dewi Lestari
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Rp2.300.000
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Lunas
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        Selesai
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        className="text-[#6b7280] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white"
                        type="button"
                      >
                        <span className="material-icons-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                      #ORD-2023-005
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                      23 Okt 2023
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Ahmad Fauzi
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Rp65.000
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Dibatalkan
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Dibatalkan
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        className="text-[#6b7280] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white"
                        type="button"
                      >
                        <span className="material-icons-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                      #ORD-2023-006
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                      23 Okt 2023
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Maya Sari
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                      Rp1.150.000
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Lunas
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-orange-100 px-2 text-xs font-semibold leading-5 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        Diproses
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        className="text-[#6b7280] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white"
                        type="button"
                      >
                        <span className="material-icons-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end border-t border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                  type="button"
                >
                  <span className="material-icons-outlined mr-1 text-sm">
                    chevron_left
                  </span>
                  Previous
                </button>
                <button
                  className="rounded-md border border-[#e5e7eb] bg-white px-3 py-1 text-sm font-medium text-[#4f46e5] dark:border-[#334155] dark:bg-[#1e293b] dark:text-indigo-400"
                  type="button"
                >
                  1
                </button>
                <button
                  className="rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                  type="button"
                >
                  2
                </button>
                <button
                  className="rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                  type="button"
                >
                  3
                </button>
                <span className="px-2 text-[#6b7280] dark:text-[#94a3b8]">
                  ...
                </span>
                <button
                  className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                  type="button"
                >
                  Next
                  <span className="material-icons-outlined ml-1 text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
