/** @format */

import { Button } from "@/components/ui/button";
import { RESERVATION_SHARED, RESERVATION_STATES, type ReservationState } from "../constants";

type ReservationSummaryCardProps = {
  state: ReservationState;
  hasSignature?: boolean;
  onDownload?: () => void;
};

export function ReservationSummaryCard({
  state,
  hasSignature,
  onDownload,
}: ReservationSummaryCardProps) {
  const data = RESERVATION_STATES[state];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-400/10 p-6 border-b border-emerald-500/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="flex-shrink-0 bg-emerald-500 text-white rounded-full p-2">
          <span className="material-icons-outlined text-3xl">check</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {data.bannerText}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{data.bannerSubtext}</p>
        </div>
      </div>

      <div className="p-6 md:p-10">
        <div className="flex flex-col items-center justify-center mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-2">
            Nomor Reservasi Anda
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center gap-3">
            <span className="text-xl md:text-2xl font-mono font-bold text-[#4338ca] dark:text-indigo-400">
              {RESERVATION_SHARED.reservationId}
            </span>
            <button className="text-gray-400 hover:text-[#4338ca] transition" title="Salin Kode">
              <span className="material-icons-outlined text-lg">content_copy</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="material-icons-outlined text-[#4338ca] text-lg">domain</span>
            Ringkasan Reservasi
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm relative group">
                <img
                  src={RESERVATION_SHARED.assetImage}
                  alt="Gedung Serbaguna"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800 dark:text-white shadow-sm">
                  Aset Desa
                </div>
              </div>
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 content-start">
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nama Aset</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {RESERVATION_SHARED.assetName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-in</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {RESERVATION_SHARED.checkIn}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-out</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {RESERVATION_SHARED.checkOut}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status Reservasi</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${data.statusBadgeClasses}`}
                >
                  <span className="material-icons-outlined text-sm">
                    {state === "done" ? "verified" : "schedule"}
                  </span>
                  {data.statusLabel}
                </span>
              </div>
              <div className="sm:col-span-2 mt-2">
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Total Biaya Sewa</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {data.payment.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {state === "done" ? "DP Dibayar" : "DP Dibayar (30%)"}
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {state === "dp" ? `- ${data.payment.dp}` : data.payment.dp}
                      </span>
                    </div>
                    {data.payment.settlement ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Pelunasan</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {data.payment.settlement}
                        </span>
                      </div>
                    ) : null}
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {data.payment.statusText}
                      </span>
                      <span className={`font-bold text-lg ${data.payment.statusColor}`}>
                        {data.payment.remaining ?? data.payment.statusText}
                        {data.payment.remaining ? "" : null}
                      </span>
                    </div>
                    {data.payment.remaining ? (
                      <Button className="mt-3 w-full bg-[#4338ca] hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group" asChild>
                        <a href={data.cta?.href ?? "#"}>
                          <span>{data.cta?.label}</span>
                          <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="material-icons-outlined text-[#4338ca] text-lg">person</span>
              Detail Penyewa
            </h3>
            <div className="space-y-3">
              <InfoRow label="Nama Lengkap" value={RESERVATION_SHARED.renter.name} />
              <InfoRow label="Nomor Telepon" value={RESERVATION_SHARED.renter.phone} />
              <InfoRow label="Email" value={RESERVATION_SHARED.renter.email} />
              <InfoRow label="Instansi" value={RESERVATION_SHARED.renter.organization} />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="material-icons-outlined text-[#4338ca] text-lg">admin_panel_settings</span>
              Pesan dari Manajemen
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex-grow">
              <div className="flex gap-3">
                <span className="material-icons-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="mb-2 font-medium">{RESERVATION_SHARED.managerNote.title}</p>
                  <p className="leading-relaxed opacity-90">{RESERVATION_SHARED.managerNote.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="material-icons-outlined text-[#4338ca] text-lg">description</span>
            Detail Aset
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {RESERVATION_SHARED.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {RESERVATION_SHARED.tags.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <span className="material-icons-outlined text-sm">{tag.icon}</span> {tag.label}
              </span>
            ))}
          </div>
        </div>

        {hasSignature ? (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-[#4338ca] text-lg">timeline</span>
                Linimasa Pembayaran
              </h4>
              <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <li className="flex items-start gap-2">
                  <span className="material-icons-outlined text-green-500 text-base mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <p className="font-semibold">DP diterima</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {data.payment.dp} diterima. Jadwal dikunci.
                    </p>
                  </div>
                </li>
                {state === "done" ? (
                  <li className="flex items-start gap-2">
                    <span className="material-icons-outlined text-green-500 text-base mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="font-semibold">Pelunasan selesai</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {data.payment.settlement ?? data.payment.remaining} dikonfirmasi.
                      </p>
                    </div>
                  </li>
                ) : (
                  <li className="flex items-start gap-2">
                    <span className="material-icons-outlined text-amber-500 text-base mt-0.5">
                      schedule
                    </span>
                    <div>
                      <p className="font-semibold">Menunggu pelunasan</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Selesaikan sebelum {data.payment.dueText ?? "tenggat"}.
                      </p>
                    </div>
                  </li>
                )}
              </ol>
            </div>

            {data.showDownloadButtons ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold shadow-sm transition flex items-center justify-center gap-2"
                  type="button"
                  onClick={onDownload}
                >
                  <span className="material-icons-outlined">download</span>
                  Unduh Bukti / Invoice
                </Button>
                <Button
                  className="w-full sm:w-auto px-6 py-3 bg-[#4338ca] hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
                  asChild
                >
                  <a href="#">Bagikan Tautan Aman</a>
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-200">
            Tautan ini memerlukan signature valid untuk mengunduh bukti atau melihat timeline lengkap.
          </div>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/80 p-4 text-center border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Halaman ini adalah bukti sah reservasi Anda. Harap simpan tautan ini atau unduh bukti
          reservasi.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{value}</span>
    </div>
  );
}
