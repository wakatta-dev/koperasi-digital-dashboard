/** @format */

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { STATUS_CONTENT, REQUEST_INFO, type ReservationStatus } from "../constants";

type StatusSidebarProps = {
  status: ReservationStatus;
};

export function StatusSidebar({ status }: StatusSidebarProps) {
  const content = STATUS_CONTENT[status];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-24 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Status Permintaan</h3>

        <div
          className={`${content.badgeBg} ${content.border} rounded-xl p-5 mb-6`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full ${content.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <span className={`material-icons-outlined ${content.iconColor} text-2xl`}>
                {content.icon}
              </span>
            </div>
            <span className={`font-bold ${content.iconColor} text-lg leading-tight`}>
              {content.title}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "inherit" }}>
            <span className={status === "pending" ? "text-amber-900/70 dark:text-amber-100/70" : "text-green-900/70 dark:text-green-100/70"}>
              {content.text}
            </span>
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Ringkasan Biaya
          </h4>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">{REQUEST_INFO.costs.rentalLabel}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {REQUEST_INFO.costs.rentalTotal}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Biaya Kebersihan</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {REQUEST_INFO.costs.cleaning}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
            <span className="font-bold text-gray-900 dark:text-white">{content.summaryLabel}</span>
            <span className="font-bold text-[#4338ca] text-xl">{REQUEST_INFO.costs.total}</span>
          </div>
        </div>

        <div className="space-y-3">
          {content.primaryCta ? (
            <Button className="w-full bg-[#4338ca] hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group">
              <span>{content.primaryCta}</span>
              <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Button>
          ) : null}

          <Button
            variant="ghost"
            className="w-full bg-white dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 py-3 rounded-xl font-semibold transition border border-red-200 dark:border-red-900 hover:border-red-300 flex items-center justify-center gap-2 group shadow-sm"
          >
            <span className="material-icons-outlined group-hover:scale-110 transition-transform text-lg">
              close
            </span>
            Batalkan Permintaan
          </Button>

          <Link
            href="/penyewaan-aset/status"
            className="block w-full text-center py-3 text-sm font-medium text-gray-500 hover:text-[#4338ca] transition"
          >
            Kembali ke Permintaan Saya
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 text-[#4338ca]">
            <span className="material-icons-outlined text-sm">support_agent</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 leading-snug">
              Ada pertanyaan terkait pesanan ini?
            </p>
            <Link href="#" className="text-xs font-bold text-[#4338ca] hover:underline">
              Hubungi Admin BUMDes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
