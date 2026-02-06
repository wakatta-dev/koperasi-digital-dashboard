/** @format */

import Link from "next/link";

export function ConfirmationActions() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link
        href="#"
        className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
      >
        <span className="material-icons-outlined group-hover:animate-pulse">receipt_long</span>
        Lihat Pesanan Saya
      </Link>
      <Link
        href="/marketplace"
        className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <span className="material-icons-outlined">shopping_bag</span>
        Lanjutkan Belanja
      </Link>
    </div>
  );
}
