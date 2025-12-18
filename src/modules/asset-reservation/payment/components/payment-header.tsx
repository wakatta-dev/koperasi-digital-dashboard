/** @format */

import Link from "next/link";

type PaymentHeaderProps = {
  backHref: string;
};

export function PaymentHeader({ backHref }: PaymentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Pembayaran Sewa Aset
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Selesaikan pembayaran Anda untuk mengamankan reservasi.
        </p>
      </div>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition hover:border-gray-400 dark:hover:border-gray-500"
      >
        <span className="material-icons-outlined text-lg">arrow_back</span>
        Kembali ke Detail Permintaan
      </Link>
    </div>
  );
}
